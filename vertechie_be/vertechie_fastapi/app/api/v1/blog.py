"""
Blog API Routes
Articles, Comments, and Newsletters
"""

from typing import List, Optional, Any, Dict
from uuid import UUID
import re

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, insert
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.blog import (
    ArticleCategory, ArticleTag, ArticleSeries, Article,
    ArticleComment, ArticleReaction, ArticleBookmark,
    Newsletter, NewsletterSubscriber,
    ArticleStatus, ContentType, ReactionType, article_tags
)
from app.models.user import User, UserProfile
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(tags=["Blog"])


# ============= Pydantic Schemas =============

class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: str
    is_featured: bool
    
    class Config:
        from_attributes = True

class ArticleCreate(BaseModel):
    title: str
    slug: str
    subtitle: Optional[str] = None
    content: str
    excerpt: Optional[str] = None
    content_type: ContentType = ContentType.ARTICLE
    cover_image: Optional[str] = None
    category_id: Optional[UUID] = None
    series_id: Optional[UUID] = None
    series_order: Optional[int] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_premium: bool = False
    tags: List[str] = []
    status: Optional[ArticleStatus] = ArticleStatus.PUBLISHED  # Default to published when creating

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    is_premium: Optional[bool] = None
    tags: Optional[List[str]] = None

class ArticleResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    subtitle: Optional[str] = None
    excerpt: Optional[str] = None
    content_type: ContentType
    cover_image: Optional[str] = None
    author_id: UUID
    category_id: Optional[UUID] = None
    reading_time_minutes: int
    status: ArticleStatus
    is_featured: bool
    is_pinned: bool
    is_premium: bool
    views_count: int
    reactions_count: int
    comments_count: int
    created_at: datetime
    published_at: Optional[datetime] = None
    # Enriched fields for frontend
    author_name: Optional[str] = None
    author_avatar: Optional[str] = None
    author_title: Optional[str] = None
    author_verified: Optional[bool] = None
    category_name: Optional[str] = None
    category_slug: Optional[str] = None
    tags: List[str] = []
    likes_count: int = 0
    
    class Config:
        from_attributes = True

class ArticleDetailResponse(ArticleResponse):
    content: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class CommentCreate(BaseModel):
    content: str
    parent_id: Optional[UUID] = None

class CommentResponse(BaseModel):
    id: UUID
    article_id: UUID
    author_id: UUID
    content: str
    parent_id: Optional[UUID] = None
    likes_count: int
    is_edited: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class SeriesResponse(BaseModel):
    id: UUID
    title: str
    slug: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    author_id: UUID
    is_complete: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TopAuthorResponse(BaseModel):
    id: UUID
    name: str
    avatar: Optional[str] = None
    title: Optional[str] = None
    is_verified: bool = False
    followers: int = 0
    articles_count: int = 0
    total_views: int = 0


class TopAuthorsPayload(BaseModel):
    total_authors: int
    items: List[TopAuthorResponse]


class TrendingTagResponse(BaseModel):
    name: str
    slug: str
    articles_count: int


class BlogMyStatsResponse(BaseModel):
    articles_published: int
    total_views: int
    comments_received: int
    reactions_received: int


def _serialize_article_for_response(
    article: Article,
    user: Optional[User] = None,
    profile: Optional[UserProfile] = None,
) -> Dict[str, Any]:
    return {
        "id": article.id,
        "title": article.title,
        "slug": article.slug,
        "subtitle": article.subtitle,
        "excerpt": article.excerpt,
        "content_type": article.content_type,
        "cover_image": article.cover_image,
        "author_id": article.author_id,
        "category_id": article.category_id,
        "reading_time_minutes": article.reading_time_minutes,
        "status": article.status,
        "is_featured": article.is_featured,
        "is_pinned": article.is_pinned,
        "is_premium": article.is_premium,
        "views_count": article.views_count,
        "reactions_count": article.reactions_count,
        "comments_count": article.comments_count,
        "created_at": article.created_at,
        "published_at": article.published_at,
        "author_name": user.full_name if user else None,
        "author_avatar": profile.avatar_url if profile else None,
        "author_title": profile.headline if profile else None,
        "author_verified": bool(user.is_verified) if user else False,
        "category_name": article.category.name if article.category else None,
        "category_slug": article.category.slug if article.category else None,
        "tags": [t.name for t in (article.tags or [])],
        "likes_count": article.reactions_count or 0,
    }


async def _serialize_article_with_author_context(
    db: AsyncSession,
    article: Article,
) -> Dict[str, Any]:
    user: Optional[User] = None
    profile: Optional[UserProfile] = None

    if article.author_id:
        user_result = await db.execute(select(User).where(User.id == article.author_id))
        user = user_result.scalar_one_or_none()
        profile_result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == article.author_id)
        )
        profile = profile_result.scalar_one_or_none()

    return _serialize_article_for_response(article, user, profile)


async def _serialize_article_detail_with_author_context(
    db: AsyncSession,
    article: Article,
) -> Dict[str, Any]:
    payload = await _serialize_article_with_author_context(db, article)
    payload.update(
        {
            "content": article.content,
            "meta_title": article.meta_title,
            "meta_description": article.meta_description,
        }
    )
    return payload


def _slugify_tag(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower())
    return slug.strip("-")


async def _resolve_article_tags(db: AsyncSession, raw_tags: List[str]) -> List[ArticleTag]:
    cleaned: list[str] = []
    seen: set[str] = set()
    for tag in raw_tags or []:
        if not isinstance(tag, str):
            continue
        name = tag.strip()
        if not name:
            continue
        key = name.lower()
        if key in seen:
            continue
        seen.add(key)
        cleaned.append(name)

    if not cleaned:
        return []

    slug_by_name = {name: _slugify_tag(name) for name in cleaned}
    slugs = [slug for slug in slug_by_name.values() if slug]
    if not slugs:
        return []

    existing_result = await db.execute(select(ArticleTag).where(ArticleTag.slug.in_(slugs)))
    existing_tags = existing_result.scalars().all()
    by_slug = {tag.slug: tag for tag in existing_tags}

    resolved: list[ArticleTag] = []
    for name in cleaned:
        slug = slug_by_name.get(name, "")
        if not slug:
            continue
        tag_obj = by_slug.get(slug)
        if not tag_obj:
            tag_obj = ArticleTag(name=name, slug=slug)
            db.add(tag_obj)
            await db.flush()
            by_slug[slug] = tag_obj
        resolved.append(tag_obj)

    return resolved


async def _set_article_tags(db: AsyncSession, article_id: UUID, raw_tags: List[str]) -> None:
    resolved_tags = await _resolve_article_tags(db, raw_tags)
    await db.execute(delete(article_tags).where(article_tags.c.article_id == article_id))
    if not resolved_tags:
        return
    values = [
        {"article_id": article_id, "tag_id": tag.id}
        for tag in resolved_tags
        if tag and tag.id
    ]
    if values:
        await db.execute(insert(article_tags), values)


# ============= Categories =============

@router.get("/categories", response_model=List[CategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db)
):
    """List article categories."""
    result = await db.execute(
        select(ArticleCategory).where(ArticleCategory.is_active == True)
    )
    return result.scalars().all()


@router.get("/top-authors", response_model=TopAuthorsPayload)
async def list_top_authors(
    limit: int = Query(5, ge=1, le=20),
    db: AsyncSession = Depends(get_db)
):
    """List top blog authors ranked by published article count."""
    totals_result = await db.execute(
        select(func.count(func.distinct(Article.author_id))).where(
            Article.status == ArticleStatus.PUBLISHED
        )
    )
    total_authors = int(totals_result.scalar() or 0)

    ranked_result = await db.execute(
        select(
            Article.author_id,
            func.count(Article.id).label("articles_count"),
            func.coalesce(func.sum(Article.views_count), 0).label("total_views"),
        )
        .where(Article.status == ArticleStatus.PUBLISHED)
        .group_by(Article.author_id)
        .order_by(func.count(Article.id).desc(), func.coalesce(func.sum(Article.views_count), 0).desc())
        .limit(limit)
    )
    ranked_rows = ranked_result.all()
    if not ranked_rows:
        return TopAuthorsPayload(total_authors=0, items=[])

    author_ids = [row[0] for row in ranked_rows if row[0]]
    users_result = await db.execute(select(User).where(User.id.in_(author_ids)))
    profiles_result = await db.execute(select(UserProfile).where(UserProfile.user_id.in_(author_ids)))
    users_by_id = {u.id: u for u in users_result.scalars().all()}
    profiles_by_user_id = {p.user_id: p for p in profiles_result.scalars().all()}

    items: List[TopAuthorResponse] = []
    for author_id, articles_count, total_views in ranked_rows:
        user = users_by_id.get(author_id)
        profile = profiles_by_user_id.get(author_id)
        name = user.full_name if user else "Anonymous"
        items.append(
            TopAuthorResponse(
                id=author_id,
                name=name,
                avatar=profile.avatar_url if profile else None,
                title=profile.headline if profile else None,
                is_verified=bool(user.is_verified) if user else False,
                followers=int(profile.followers_count) if profile and profile.followers_count else 0,
                articles_count=int(articles_count or 0),
                total_views=int(total_views or 0),
            )
        )

    return TopAuthorsPayload(total_authors=total_authors, items=items)


@router.get("/tags/trending", response_model=List[TrendingTagResponse])
async def list_trending_tags(
    limit: int = Query(10, ge=1, le=30),
    db: AsyncSession = Depends(get_db)
):
    """List trending tags based on published article usage."""
    result = await db.execute(
        select(
            ArticleTag.name,
            ArticleTag.slug,
            func.count(Article.id).label("articles_count"),
        )
        .select_from(ArticleTag)
        .join(article_tags, ArticleTag.id == article_tags.c.tag_id)
        .join(Article, Article.id == article_tags.c.article_id)
        .where(Article.status == ArticleStatus.PUBLISHED)
        .group_by(ArticleTag.id, ArticleTag.name, ArticleTag.slug)
        .order_by(func.count(Article.id).desc(), ArticleTag.name.asc())
        .limit(limit)
    )
    rows = result.all()
    return [
        TrendingTagResponse(
            name=row[0],
            slug=row[1],
            articles_count=int(row[2] or 0),
        )
        for row in rows
    ]


@router.get("/me/stats", response_model=BlogMyStatsResponse)
async def get_my_blog_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's blog statistics."""
    authored_result = await db.execute(
        select(
            func.count(Article.id),
            func.coalesce(func.sum(Article.views_count), 0),
            func.coalesce(func.sum(Article.comments_count), 0),
            func.coalesce(func.sum(Article.reactions_count), 0),
        ).where(
            Article.author_id == current_user.id,
            Article.status == ArticleStatus.PUBLISHED
        )
    )
    articles_published, total_views, comments_received, reactions_received = authored_result.one()
    return BlogMyStatsResponse(
        articles_published=int(articles_published or 0),
        total_views=int(total_views or 0),
        comments_received=int(comments_received or 0),
        reactions_received=int(reactions_received or 0),
    )


# ============= Articles =============

@router.get("/articles", response_model=List[ArticleResponse])
async def list_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    featured: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """List published articles."""
    query = (
        select(Article)
        .options(selectinload(Article.category), selectinload(Article.tags))
        .where(Article.status == ArticleStatus.PUBLISHED)
    )
    
    if category:
        query = query.join(ArticleCategory).where(ArticleCategory.slug == category)
    if search:
        query = query.where(
            Article.title.ilike(f"%{search}%") | 
            Article.excerpt.ilike(f"%{search}%")
        )
    if featured:
        query = query.where(Article.is_featured == True)
    
    query = query.order_by(Article.published_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    articles = result.scalars().all()
    if not articles:
        return []

    author_ids = list({a.author_id for a in articles if a.author_id})
    users_by_id: Dict[UUID, User] = {}
    profiles_by_user_id: Dict[UUID, UserProfile] = {}
    if author_ids:
        users_result = await db.execute(
            select(User).where(User.id.in_(author_ids))
        )
        users = users_result.scalars().all()
        users_by_id = {u.id: u for u in users}

        profiles_result = await db.execute(
            select(UserProfile).where(UserProfile.user_id.in_(author_ids))
        )
        profiles = profiles_result.scalars().all()
        profiles_by_user_id = {p.user_id: p for p in profiles}

    payload: List[Dict[str, Any]] = []
    for article in articles:
        user = users_by_id.get(article.author_id)
        profile = profiles_by_user_id.get(article.author_id)
        payload.append(_serialize_article_for_response(article, user, profile))

    return payload


@router.get("/articles/{article_id}", response_model=ArticleDetailResponse)
async def get_article(
    article_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get article details."""
    result = await db.execute(
        select(Article)
        .options(
            selectinload(Article.category),
            selectinload(Article.tags),
            selectinload(Article.series)
        )
        .where(Article.id == article_id)
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment view count
    article.views_count += 1
    await db.commit()

    article_result = await db.execute(
        select(Article)
        .options(
            selectinload(Article.category),
            selectinload(Article.tags),
            selectinload(Article.series),
        )
        .where(Article.id == article.id)
    )
    article_with_relations = article_result.scalar_one_or_none()
    if not article_with_relations:
        raise HTTPException(status_code=404, detail="Article not found")

    return await _serialize_article_detail_with_author_context(db, article_with_relations)


@router.get("/articles/slug/{slug}", response_model=ArticleDetailResponse)
async def get_article_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get article by slug."""
    result = await db.execute(
        select(Article)
        .options(
            selectinload(Article.category),
            selectinload(Article.tags),
            selectinload(Article.series),
        )
        .where(Article.slug == slug)
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.views_count += 1
    await db.commit()

    article_result = await db.execute(
        select(Article)
        .options(
            selectinload(Article.category),
            selectinload(Article.tags),
            selectinload(Article.series),
        )
        .where(Article.id == article.id)
    )
    article_with_relations = article_result.scalar_one_or_none()
    if not article_with_relations:
        raise HTTPException(status_code=404, detail="Article not found")

    return await _serialize_article_detail_with_author_context(db, article_with_relations)


@router.post("/articles", response_model=ArticleResponse)
async def create_article(
    article: ArticleCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new article."""
    # Check if slug is unique
    existing = await db.execute(
        select(Article).where(Article.slug == article.slug)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Slug already exists")
    
    # Calculate reading time
    word_count = len(article.content.split())
    reading_time = max(1, word_count // 200)
    
    # Prepare article data
    article_data = article.model_dump(exclude={'tags'})
    
    # Set published_at if status is PUBLISHED
    if article.status == ArticleStatus.PUBLISHED:
        article_data['published_at'] = datetime.utcnow()
    
    db_article = Article(
        author_id=current_user.id,
        reading_time_minutes=reading_time,
        **article_data
    )
    db.add(db_article)
    await db.flush()

    if article.tags:
        await _set_article_tags(db, db_article.id, article.tags)

    await db.commit()
    await db.refresh(db_article)

    # Re-query with relationships eagerly loaded so response serialization is async-safe.
    article_result = await db.execute(
        select(Article)
        .options(selectinload(Article.category), selectinload(Article.tags))
        .where(Article.id == db_article.id)
    )
    article_with_relations = article_result.scalar_one_or_none()
    if not article_with_relations:
        raise HTTPException(status_code=404, detail="Article not found after creation")

    return await _serialize_article_with_author_context(db, article_with_relations)


@router.put("/articles/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: UUID,
    article_update: ArticleUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an article."""
    result = await db.execute(
        select(Article).where(
            Article.id == article_id,
            Article.author_id == current_user.id
        )
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_data = article_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "tags":
            continue
        setattr(article, key, value)

    if article_update.tags is not None:
        await _set_article_tags(db, article.id, article_update.tags)
    
    await db.commit()
    await db.refresh(article)

    article_result = await db.execute(
        select(Article)
        .options(selectinload(Article.category), selectinload(Article.tags))
        .where(Article.id == article.id)
    )
    article_with_relations = article_result.scalar_one_or_none()
    if not article_with_relations:
        raise HTTPException(status_code=404, detail="Article not found after update")

    return await _serialize_article_with_author_context(db, article_with_relations)


@router.put("/articles/{article_id}/publish")
async def publish_article(
    article_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Publish an article."""
    result = await db.execute(
        select(Article).where(
            Article.id == article_id,
            Article.author_id == current_user.id
        )
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.status = ArticleStatus.PUBLISHED
    article.published_at = datetime.utcnow()
    await db.commit()
    
    return {"status": "published"}


@router.delete("/articles/{article_id}")
async def delete_article(
    article_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an article."""
    result = await db.execute(
        select(Article).where(
            Article.id == article_id,
            Article.author_id == current_user.id
        )
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    await db.delete(article)
    await db.commit()
    
    return {"status": "deleted"}


# ============= Comments =============

@router.get("/articles/{article_id}/comments", response_model=List[CommentResponse])
async def list_comments(
    article_id: UUID,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """List article comments."""
    result = await db.execute(
        select(ArticleComment)
        .where(
            ArticleComment.article_id == article_id,
            ArticleComment.is_deleted == False
        )
        .order_by(ArticleComment.created_at.desc())
        .offset(skip).limit(limit)
    )
    return result.scalars().all()


@router.post("/articles/{article_id}/comments", response_model=CommentResponse)
async def add_comment(
    article_id: UUID,
    comment: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a comment to article."""
    db_comment = ArticleComment(
        article_id=article_id,
        author_id=current_user.id,
        **comment.model_dump()
    )
    db.add(db_comment)
    
    # Update comment count
    article_result = await db.execute(
        select(Article).where(Article.id == article_id)
    )
    article = article_result.scalar_one_or_none()
    if article:
        article.comments_count += 1
    
    await db.commit()
    await db.refresh(db_comment)
    return db_comment


# ============= Reactions =============

@router.post("/articles/{article_id}/react")
async def react_to_article(
    article_id: UUID,
    reaction_type: ReactionType,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add reaction to article."""
    # Check if already reacted
    existing = await db.execute(
        select(ArticleReaction).where(
            ArticleReaction.article_id == article_id,
            ArticleReaction.user_id == current_user.id
        )
    )
    reaction = existing.scalar_one_or_none()
    
    if reaction:
        # Update reaction type
        reaction.reaction_type = reaction_type
    else:
        # Add new reaction
        reaction = ArticleReaction(
            article_id=article_id,
            user_id=current_user.id,
            reaction_type=reaction_type
        )
        db.add(reaction)
        
        # Update reaction count
        article_result = await db.execute(
            select(Article).where(Article.id == article_id)
        )
        article = article_result.scalar_one_or_none()
        if article:
            article.reactions_count += 1
    
    await db.commit()
    return {"status": "reacted"}


@router.delete("/articles/{article_id}/react")
async def remove_reaction(
    article_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove reaction from article."""
    result = await db.execute(
        select(ArticleReaction).where(
            ArticleReaction.article_id == article_id,
            ArticleReaction.user_id == current_user.id
        )
    )
    reaction = result.scalar_one_or_none()
    
    if reaction:
        await db.delete(reaction)
        
        # Update reaction count
        article_result = await db.execute(
            select(Article).where(Article.id == article_id)
        )
        article = article_result.scalar_one_or_none()
        if article and article.reactions_count > 0:
            article.reactions_count -= 1
        
        await db.commit()
    
    return {"status": "removed"}


# ============= Bookmarks =============

@router.post("/articles/{article_id}/bookmark")
async def bookmark_article(
    article_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Bookmark an article."""
    # Check if already bookmarked
    existing = await db.execute(
        select(ArticleBookmark).where(
            ArticleBookmark.article_id == article_id,
            ArticleBookmark.user_id == current_user.id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Already bookmarked")
    
    bookmark = ArticleBookmark(
        article_id=article_id,
        user_id=current_user.id
    )
    db.add(bookmark)
    
    # Update bookmark count
    article_result = await db.execute(
        select(Article).where(Article.id == article_id)
    )
    article = article_result.scalar_one_or_none()
    if article:
        article.bookmarks_count += 1
    
    await db.commit()
    return {"status": "bookmarked"}


@router.delete("/articles/{article_id}/bookmark")
async def remove_bookmark(
    article_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove bookmark from article."""
    result = await db.execute(
        select(ArticleBookmark).where(
            ArticleBookmark.article_id == article_id,
            ArticleBookmark.user_id == current_user.id
        )
    )
    bookmark = result.scalar_one_or_none()
    
    if bookmark:
        await db.delete(bookmark)
        
        # Update bookmark count
        article_result = await db.execute(
            select(Article).where(Article.id == article_id)
        )
        article = article_result.scalar_one_or_none()
        if article and article.bookmarks_count > 0:
            article.bookmarks_count -= 1
        
        await db.commit()
    
    return {"status": "removed"}


@router.get("/bookmarks", response_model=List[ArticleResponse])
async def list_my_bookmarks(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List my bookmarked articles."""
    result = await db.execute(
        select(Article)
        .options(selectinload(Article.category), selectinload(Article.tags))
        .join(ArticleBookmark, Article.id == ArticleBookmark.article_id)
        .where(ArticleBookmark.user_id == current_user.id)
        .order_by(ArticleBookmark.created_at.desc())
        .offset(skip).limit(limit)
    )
    articles = result.scalars().all()
    if not articles:
        return []

    author_ids = list({a.author_id for a in articles if a.author_id})
    users_by_id: Dict[UUID, User] = {}
    profiles_by_user_id: Dict[UUID, UserProfile] = {}
    if author_ids:
        users_result = await db.execute(select(User).where(User.id.in_(author_ids)))
        profiles_result = await db.execute(select(UserProfile).where(UserProfile.user_id.in_(author_ids)))
        users_by_id = {u.id: u for u in users_result.scalars().all()}
        profiles_by_user_id = {p.user_id: p for p in profiles_result.scalars().all()}

    return [
        _serialize_article_for_response(
            article,
            users_by_id.get(article.author_id),
            profiles_by_user_id.get(article.author_id),
        )
        for article in articles
    ]


# ============= Series =============

@router.get("/series", response_model=List[SeriesResponse])
async def list_series(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """List article series."""
    result = await db.execute(
        select(ArticleSeries)
        .where(ArticleSeries.is_published == True)
        .order_by(ArticleSeries.created_at.desc())
        .offset(skip).limit(limit)
    )
    return result.scalars().all()


@router.get("/series/{series_id}", response_model=SeriesResponse)
async def get_series(
    series_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get series details with articles."""
    result = await db.execute(
        select(ArticleSeries)
        .options(selectinload(ArticleSeries.articles))
        .where(ArticleSeries.id == series_id)
    )
    series = result.scalar_one_or_none()
    
    if not series:
        raise HTTPException(status_code=404, detail="Series not found")
    
    return series


# ============= Newsletter =============

@router.post("/newsletter/subscribe")
async def subscribe_newsletter(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Subscribe to newsletter."""
    # Check if already subscribed
    existing = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == email)
    )
    subscriber = existing.scalar_one_or_none()
    
    if subscriber:
        if subscriber.is_active:
            raise HTTPException(status_code=400, detail="Already subscribed")
        else:
            subscriber.is_active = True
            await db.commit()
            return {"status": "resubscribed"}
    
    new_subscriber = NewsletterSubscriber(
        email=email
    )
    db.add(new_subscriber)
    await db.commit()
    
    return {"status": "subscribed"}


@router.delete("/newsletter/unsubscribe")
async def unsubscribe_newsletter(
    email: str,
    db: AsyncSession = Depends(get_db)
):
    """Unsubscribe from newsletter."""
    result = await db.execute(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == email)
    )
    subscriber = result.scalar_one_or_none()
    
    if subscriber:
        subscriber.is_active = False
        subscriber.unsubscribed_at = datetime.utcnow()
        await db.commit()
    
    return {"status": "unsubscribed"}


# ============= Admin Endpoints =============

admin_router = APIRouter(prefix="/admin/blog", tags=["Admin - Blog"])


@admin_router.put("/articles/{article_id}/feature")
async def feature_article(
    article_id: UUID,
    featured: bool = True,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Feature/unfeature an article."""
    result = await db.execute(
        select(Article).where(Article.id == article_id)
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.is_featured = featured
    await db.commit()
    
    return {"status": "featured" if featured else "unfeatured"}


@admin_router.delete("/articles/{article_id}")
async def admin_delete_article(
    article_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Admin: Delete any article."""
    result = await db.execute(
        select(Article).where(Article.id == article_id)
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    await db.delete(article)
    await db.commit()
    
    return {"status": "deleted"}

