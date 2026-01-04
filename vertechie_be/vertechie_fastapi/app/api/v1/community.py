"""
Community API endpoints - Groups, Posts, Comments.
"""

from typing import Any, List, Optional
from uuid import UUID, uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from slugify import slugify

from app.db.session import get_db
from app.models.community import (
    Group, GroupMember, Post, Comment, PostReaction,
    GroupType, GroupMemberRole, PostType
)
from app.models.user import User, UserProfile
from app.schemas.community import (
    GroupCreate, GroupUpdate, GroupResponse, GroupMemberResponse,
    PostCreate, PostUpdate, PostResponse,
    CommentCreate, CommentUpdate, CommentResponse,
    ReactionCreate
)
from app.core.security import get_current_user, get_optional_user

router = APIRouter()


# ============= Groups =============

@router.get("/groups", response_model=List[GroupResponse])
async def list_groups(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
) -> Any:
    """List public groups."""
    
    query = select(Group).where(
        Group.is_active == True,
        Group.group_type != GroupType.SECRET
    )
    
    if search:
        query = query.where(
            or_(
                Group.name.ilike(f"%{search}%"),
                Group.description.ilike(f"%{search}%"),
            )
        )
    
    if category:
        query = query.where(Group.category == category)
    
    query = query.order_by(Group.is_featured.desc(), Group.member_count.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/groups", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
async def create_group(
    group_in: GroupCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new group."""
    
    slug = f"{slugify(group_in.name)}-{uuid4().hex[:6]}"
    
    group = Group(
        **group_in.model_dump(),
        slug=slug,
        created_by_id=current_user.id,
        member_count=1,
    )
    
    db.add(group)
    await db.flush()
    
    # Add creator as owner
    member = GroupMember(
        group_id=group.id,
        user_id=current_user.id,
        role=GroupMemberRole.OWNER,
    )
    db.add(member)
    
    await db.commit()
    await db.refresh(group)
    
    return group


@router.get("/groups/{group_id}", response_model=GroupResponse)
async def get_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get group details."""
    
    result = await db.execute(
        select(Group).where(Group.id == group_id)
    )
    group = result.scalar_one_or_none()
    
    if not group or not group.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    return group


@router.put("/groups/{group_id}", response_model=GroupResponse)
async def update_group(
    group_id: UUID,
    group_in: GroupUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update group (admin only)."""
    
    # Check if admin
    result = await db.execute(
        select(GroupMember).where(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user.id,
            GroupMember.role.in_([GroupMemberRole.ADMIN, GroupMemberRole.OWNER])
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    result = await db.execute(
        select(Group).where(Group.id == group_id)
    )
    group = result.scalar_one()
    
    update_data = group_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(group, field, value)
    
    await db.commit()
    await db.refresh(group)
    
    return group


@router.post("/groups/{group_id}/join")
async def join_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Join a group."""
    
    result = await db.execute(
        select(Group).where(Group.id == group_id)
    )
    group = result.scalar_one_or_none()
    
    if not group or not group.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Group not found"
        )
    
    if group.group_type == GroupType.SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot join secret group"
        )
    
    # Check if already member
    result = await db.execute(
        select(GroupMember).where(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user.id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already a member"
        )
    
    member = GroupMember(
        group_id=group_id,
        user_id=current_user.id,
        is_approved=not group.requires_approval,
    )
    db.add(member)
    
    if not group.requires_approval:
        group.member_count += 1
    
    await db.commit()
    
    return {"message": "Joined group" if not group.requires_approval else "Join request sent"}


@router.delete("/groups/{group_id}/leave", status_code=status.HTTP_204_NO_CONTENT)
async def leave_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Leave a group."""
    
    result = await db.execute(
        select(GroupMember).where(
            GroupMember.group_id == group_id,
            GroupMember.user_id == current_user.id
        )
    )
    member = result.scalar_one_or_none()
    
    if member:
        if member.role == GroupMemberRole.OWNER:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Owner cannot leave group. Transfer ownership first."
            )
        
        await db.delete(member)
        
        result = await db.execute(
            select(Group).where(Group.id == group_id)
        )
        group = result.scalar_one()
        group.member_count = max(0, group.member_count - 1)
        
        await db.commit()


# ============= Posts =============

@router.get("/posts", response_model=List[PostResponse])
async def list_feed_posts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
) -> Any:
    """Get user's feed posts."""
    
    # Get groups user is member of
    result = await db.execute(
        select(GroupMember.group_id).where(
            GroupMember.user_id == current_user.id,
            GroupMember.is_approved == True
        )
    )
    my_groups = [r[0] for r in result.all()]
    
    # Get public posts + posts from my groups
    query = select(Post).where(
        Post.is_published == True,
        or_(
            Post.visibility == "public",
            Post.group_id.in_(my_groups) if my_groups else False,
            Post.author_id == current_user.id
        )
    )
    
    query = query.order_by(Post.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/posts", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_in: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new post."""
    
    # If posting to group, verify membership
    if post_in.group_id:
        result = await db.execute(
            select(GroupMember).where(
                GroupMember.group_id == post_in.group_id,
                GroupMember.user_id == current_user.id,
                GroupMember.is_approved == True,
                GroupMember.is_banned == False
            )
        )
        if not result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not a member of this group"
            )
    
    post = Post(
        **post_in.model_dump(),
        author_id=current_user.id,
        post_type=PostType(post_in.post_type),
    )
    
    db.add(post)
    
    # Update group post count
    if post_in.group_id:
        result = await db.execute(
            select(Group).where(Group.id == post_in.group_id)
        )
        group = result.scalar_one()
        group.post_count += 1
    
    # Update user post count
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if profile:
        profile.posts_count += 1
    
    await db.commit()
    await db.refresh(post)
    
    return post


@router.get("/posts/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get post by ID."""
    
    result = await db.execute(
        select(Post).where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post or not post.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Increment views
    post.views_count += 1
    await db.commit()
    
    return post


@router.put("/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: UUID,
    post_in: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update a post."""
    
    result = await db.execute(
        select(Post).where(
            Post.id == post_id,
            Post.author_id == current_user.id
        )
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    update_data = post_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)
    
    post.is_edited = True
    post.edited_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(post)
    
    return post


@router.delete("/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete a post."""
    
    result = await db.execute(
        select(Post).where(
            Post.id == post_id,
            Post.author_id == current_user.id
        )
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    await db.delete(post)
    await db.commit()


@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: UUID,
    reaction_in: ReactionCreate = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Like/react to a post."""
    
    result = await db.execute(
        select(Post).where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    reaction_type = reaction_in.reaction_type if reaction_in else "like"
    
    # Check for existing reaction
    result = await db.execute(
        select(PostReaction).where(
            PostReaction.post_id == post_id,
            PostReaction.user_id == current_user.id
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        if existing.reaction_type == reaction_type:
            # Remove reaction
            await db.delete(existing)
            post.likes_count = max(0, post.likes_count - 1)
            await db.commit()
            return {"message": "Reaction removed"}
        else:
            # Update reaction
            existing.reaction_type = reaction_type
            await db.commit()
            return {"message": "Reaction updated"}
    
    # Add new reaction
    reaction = PostReaction(
        post_id=post_id,
        user_id=current_user.id,
        reaction_type=reaction_type,
    )
    db.add(reaction)
    post.likes_count += 1
    
    await db.commit()
    
    return {"message": "Reaction added"}


# ============= Comments =============

@router.get("/posts/{post_id}/comments", response_model=List[CommentResponse])
async def list_comments(
    post_id: UUID,
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> Any:
    """List comments on a post."""
    
    result = await db.execute(
        select(Comment)
        .where(
            Comment.post_id == post_id,
            Comment.is_deleted == False,
            Comment.parent_id == None  # Top-level only
        )
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: UUID,
    comment_in: CommentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Add a comment to a post."""
    
    result = await db.execute(
        select(Post).where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    comment = Comment(
        post_id=post_id,
        author_id=current_user.id,
        content=comment_in.content,
        parent_id=comment_in.parent_id,
        media_url=comment_in.media_url,
        mentions=comment_in.mentions,
    )
    
    db.add(comment)
    
    # Update post comments count
    post.comments_count += 1
    
    # Update parent replies count
    if comment_in.parent_id:
        result = await db.execute(
            select(Comment).where(Comment.id == comment_in.parent_id)
        )
        parent = result.scalar_one_or_none()
        if parent:
            parent.replies_count += 1
    
    await db.commit()
    await db.refresh(comment)
    
    return comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete a comment."""
    
    result = await db.execute(
        select(Comment).where(
            Comment.id == comment_id,
            Comment.author_id == current_user.id
        )
    )
    comment = result.scalar_one_or_none()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    comment.is_deleted = True
    
    # Update post comments count
    result = await db.execute(
        select(Post).where(Post.id == comment.post_id)
    )
    post = result.scalar_one()
    post.comments_count = max(0, post.comments_count - 1)
    
    await db.commit()

