"""
Blog API Routes
Articles, Comments, and Newsletters
"""

from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.blog import (
    ArticleCategory, ArticleTag, ArticleSeries, Article,
    ArticleComment, ArticleReaction, ArticleBookmark,
    Newsletter, NewsletterSubscriber,
    ArticleStatus, ContentType, ReactionType
)
from app.models.user import User
from app.core.security import get_current_user, get_current_admin_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/blog", tags=["Blog"])


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

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    is_premium: Optional[bool] = None

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
    query = select(Article).where(Article.status == ArticleStatus.PUBLISHED)
    
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
    return result.scalars().all()


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
    
    return article


@router.get("/articles/slug/{slug}", response_model=ArticleDetailResponse)
async def get_article_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """Get article by slug."""
    result = await db.execute(
        select(Article).where(Article.slug == slug)
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article.views_count += 1
    await db.commit()
    
    return article


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
    
    db_article = Article(
        author_id=current_user.id,
        reading_time_minutes=reading_time,
        **article.model_dump(exclude={'tags'})
    )
    db.add(db_article)
    await db.commit()
    await db.refresh(db_article)
    
    return db_article


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
        setattr(article, key, value)
    
    await db.commit()
    await db.refresh(article)
    return article


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
        .join(ArticleBookmark)
        .where(ArticleBookmark.user_id == current_user.id)
        .order_by(ArticleBookmark.created_at.desc())
        .offset(skip).limit(limit)
    )
    return result.scalars().all()


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

