"""
Community routes (Groups, Posts, Comments).
"""

from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from slugify import slugify
import uuid

from app.db import get_db
from app.models.community import Group, GroupMember, Post, Comment, GroupType, MemberRole
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()


# Groups
@router.get("/groups", response_model=List[dict])
async def list_groups(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    category: str = Query(None),
) -> Any:
    """List public groups."""
    query = select(Group).where(Group.group_type == GroupType.PUBLIC)
    
    if search:
        query = query.where(
            (Group.name.ilike(f"%{search}%")) |
            (Group.description.ilike(f"%{search}%"))
        )
    
    if category:
        query = query.where(Group.category == category)
    
    query = query.order_by(Group.member_count.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    groups = result.scalars().all()
    
    return [
        {
            "id": str(g.id),
            "name": g.name,
            "slug": g.slug,
            "description": g.description,
            "avatar_url": g.avatar_url,
            "cover_url": g.cover_url,
            "member_count": g.member_count,
            "post_count": g.post_count,
            "category": g.category,
        }
        for g in groups
    ]


@router.post("/groups", status_code=status.HTTP_201_CREATED)
async def create_group(
    group_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Create a new group."""
    base_slug = slugify(group_in.get("name"))
    slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
    
    group = Group(
        name=group_in.get("name"),
        slug=slug,
        description=group_in.get("description"),
        avatar_url=group_in.get("avatar_url"),
        cover_url=group_in.get("cover_url"),
        group_type=GroupType(group_in.get("type", "public")),
        category=group_in.get("category"),
        tags=group_in.get("tags", []),
        created_by_id=current_user.id,
        member_count=1,
    )
    db.add(group)
    await db.flush()
    
    # Add creator as owner
    member = GroupMember(
        group_id=group.id,
        user_id=current_user.id,
        role=MemberRole.OWNER,
    )
    db.add(member)
    await db.commit()
    
    return {"id": str(group.id), "slug": slug}


@router.post("/groups/{group_id}/join")
async def join_group(
    group_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Join a group."""
    result = await db.execute(select(Group).where(Group.id == group_id))
    group = result.scalar_one_or_none()
    
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    # Check if already a member
    existing = await db.execute(
        select(GroupMember).where(
            (GroupMember.group_id == group_id) &
            (GroupMember.user_id == current_user.id)
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already a member"
        )
    
    member = GroupMember(
        group_id=group_id,
        user_id=current_user.id,
    )
    db.add(member)
    
    group.member_count += 1
    await db.commit()
    
    return {"message": "Joined group successfully"}


# Posts
@router.get("/posts", response_model=List[dict])
async def list_posts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    group_id: str = Query(None),
) -> Any:
    """List posts (feed)."""
    query = select(Post).where(Post.is_deleted == False)
    
    if group_id:
        query = query.where(Post.group_id == group_id)
    else:
        # Get posts from public or connections
        query = query.where(Post.visibility == "public")
    
    query = query.order_by(Post.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    posts = result.scalars().all()
    
    enriched = []
    for post in posts:
        # Get author
        author_result = await db.execute(select(User).where(User.id == post.author_id))
        author = author_result.scalar_one_or_none()
        
        enriched.append({
            "id": str(post.id),
            "author": {
                "id": str(author.id) if author else None,
                "name": author.full_name if author else "Unknown",
            },
            "content": post.content,
            "media_urls": post.media_urls,
            "likes_count": post.likes_count,
            "comments_count": post.comments_count,
            "shares_count": post.shares_count,
            "is_pinned": post.is_pinned,
            "created_at": post.created_at.isoformat(),
        })
    
    return enriched


@router.post("/posts", status_code=status.HTTP_201_CREATED)
async def create_post(
    post_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Create a new post."""
    post = Post(
        author_id=current_user.id,
        group_id=post_in.get("group_id"),
        content=post_in.get("content"),
        content_html=post_in.get("content_html"),
        media_urls=post_in.get("media_urls", []),
        visibility=post_in.get("visibility", "public"),
        link_url=post_in.get("link_url"),
    )
    db.add(post)
    
    # Update group post count if in a group
    if post_in.get("group_id"):
        group_result = await db.execute(
            select(Group).where(Group.id == post_in.get("group_id"))
        )
        group = group_result.scalar_one_or_none()
        if group:
            group.post_count += 1
    
    await db.commit()
    await db.refresh(post)
    
    return {"id": str(post.id)}


@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Like/unlike a post."""
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Toggle like (simplified - in production would track likes separately)
    post.likes_count += 1
    await db.commit()
    
    return {"likes_count": post.likes_count}


@router.get("/posts/{post_id}/comments", response_model=List[dict])
async def get_comments(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> Any:
    """Get comments on a post."""
    query = select(Comment).where(
        (Comment.post_id == post_id) &
        (Comment.is_deleted == False) &
        (Comment.parent_id == None)
    )
    query = query.order_by(Comment.created_at.asc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    comments = result.scalars().all()
    
    enriched = []
    for comment in comments:
        author_result = await db.execute(select(User).where(User.id == comment.author_id))
        author = author_result.scalar_one_or_none()
        
        # Get replies
        replies_result = await db.execute(
            select(Comment).where(Comment.parent_id == comment.id)
        )
        replies = replies_result.scalars().all()
        
        enriched.append({
            "id": str(comment.id),
            "author": {
                "id": str(author.id) if author else None,
                "name": author.full_name if author else "Unknown",
            },
            "content": comment.content,
            "likes_count": comment.likes_count,
            "replies_count": len(replies),
            "created_at": comment.created_at.isoformat(),
        })
    
    return enriched


@router.post("/posts/{post_id}/comments", status_code=status.HTTP_201_CREATED)
async def add_comment(
    post_id: str,
    comment_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Add a comment to a post."""
    result = await db.execute(select(Post).where(Post.id == post_id))
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    comment = Comment(
        post_id=post_id,
        author_id=current_user.id,
        content=comment_in.get("content"),
        parent_id=comment_in.get("parent_id"),
    )
    db.add(comment)
    
    post.comments_count += 1
    await db.commit()
    
    return {"id": str(comment.id)}

