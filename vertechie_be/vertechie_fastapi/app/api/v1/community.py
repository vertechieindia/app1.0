"""
Community API endpoints - Groups, Posts, Comments.
"""

import logging
import traceback
from typing import Any, List, Optional
from uuid import UUID, uuid4
from datetime import datetime

from pathlib import Path
from fastapi import APIRouter, Depends, File, HTTPException, Request, status, UploadFile, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from sqlalchemy.exc import OperationalError, ProgrammingError
from slugify import slugify

from app.db.session import get_db
from app.models.community import (
    Group, GroupMember, Post, Comment, PostReaction, PollVote,
    Event, EventRegistration, StartupIdea, FounderMatch,
    GroupType, GroupMemberRole, PostType
)
from app.models.user import User, UserProfile
from app.schemas.community import (
    GroupCreate, GroupUpdate, GroupResponse, GroupMemberResponse,
    PostCreate, PostUpdate, PostResponse,
    CommentCreate, CommentUpdate, CommentResponse,
    ReactionCreate, EventCreate, EventResponse,
    StartupIdeaCreate, StartupIdeaResponse
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


# ============= Upload (for post images) =============

# Upload directory: project_root/uploads (created at first upload)
def _upload_dir() -> Path:
    root = Path(__file__).resolve().parent.parent.parent.parent
    d = root / "uploads"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _ext(filename: str) -> str:
    if "." in filename:
        return "." + filename.rsplit(".", 1)[-1].lower()
    return ".jpg"


@router.post("/upload")
async def upload_post_image(
    request: Request,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Upload an image for a post. Returns { url } (absolute URL to the file)."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image files are allowed",
        )
    ext = _ext(file.filename or "image.jpg")
    name = f"{uuid4().hex}{ext}"
    dest = _upload_dir() / name
    content = await file.read()
    dest.write_bytes(content)
    base = str(request.base_url).rstrip("/")
    url = f"{base}/uploads/{name}"
    return {"url": url}


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
    
    # Must have content or media
    has_content = bool(post_in.content and post_in.content.strip())
    has_media = bool(post_in.media and len(post_in.media) > 0)
    if not has_content and not has_media:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post content or at least one image is required",
        )

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
    
    # Convert post_type string to PostType enum safely
    post_type_str = post_in.post_type or "text"
    try:
        post_type_enum = PostType(post_type_str.lower())
    except (ValueError, AttributeError):
        # Default to TEXT if invalid post_type provided
        post_type_enum = PostType.TEXT
    
    # Prepare post data, excluding post_type from model_dump since we handle it separately
    post_data = post_in.model_dump(exclude={'post_type'})
    post_data['author_id'] = current_user.id
    post_data['post_type'] = post_type_enum
    post_data['is_published'] = True  # Ensure post is published by default
    
    post = Post(**post_data)
    
    db.add(post)
    
    # Update group post count
    if post_in.group_id:
        result = await db.execute(
            select(Group).where(Group.id == post_in.group_id)
        )
        group = result.scalar_one_or_none()
        if group:
            group.post_count += 1
    
    # Update user post count
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if profile:
        profile.posts_count = (profile.posts_count or 0) + 1
    
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

@router.get("/posts/{post_id}/comments")
async def list_comments(
    post_id: UUID,
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> Any:
    """List comments on a post."""
    
    # Join with User to get author info
    result = await db.execute(
        select(Comment, User)
        .join(User, Comment.author_id == User.id)
        .where(
            Comment.post_id == post_id,
            Comment.is_deleted == False,
            Comment.parent_id == None  # Top-level only
        )
        .order_by(Comment.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = result.all()
    
    # Map to include author info
    comments_with_author = []
    for comment, author in rows:
        author_name = f"{author.first_name} {author.last_name}".strip()
        if not author_name:
            author_name = author.email.split('@')[0] if author.email else "User"
        
        comment_dict = {
            "id": str(comment.id),
            "post_id": str(comment.post_id),
            "author_id": str(comment.author_id),
            "author": {
                "id": str(author.id),
                "name": author_name,
            },
            "content": comment.content,
            "parent_id": str(comment.parent_id) if comment.parent_id else None,
            "media_url": comment.media_url,
            "likes_count": comment.likes_count or 0,
            "replies_count": comment.replies_count or 0,
            "is_edited": comment.is_edited or False,
            "is_deleted": comment.is_deleted or False,
            "created_at": comment.created_at.isoformat() if comment.created_at else datetime.utcnow().isoformat(),
        }
        comments_with_author.append(comment_dict)
    
    return comments_with_author


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
        mentions=comment_in.mentions or [],
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


@router.post("/posts/{post_id}/vote")
async def vote_on_poll(
    post_id: UUID,
    option_index: int = Query(..., ge=0, description="Index of the poll option (0-based)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Vote on a poll option."""
    
    try:
        # Get the post
        result = await db.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalar_one_or_none()
        
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        
        if post.post_type != PostType.POLL:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This post is not a poll"
            )
        
        if not post.poll_data or not isinstance(post.poll_data, dict):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid poll data"
            )
        
        options = post.poll_data.get("options", [])
        if not options or option_index >= len(options):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid option index. Poll has {len(options)} options."
            )
        
        # Check if user already voted
        result = await db.execute(
            select(PollVote).where(
                PollVote.post_id == post_id,
                PollVote.user_id == current_user.id
            )
        )
        existing_vote = result.scalar_one_or_none()
        
        if existing_vote:
            # Update existing vote
            existing_vote.option_index = option_index
            message = "Vote updated"
        else:
            # Create new vote
            vote = PollVote(
                post_id=post_id,
                user_id=current_user.id,
                option_index=option_index
            )
            db.add(vote)
            message = "Vote recorded"
        
        await db.commit()
        
        # Get updated vote counts
        result = await db.execute(
            select(PollVote.option_index, func.count(PollVote.id))
            .where(PollVote.post_id == post_id)
            .group_by(PollVote.option_index)
        )
        vote_counts = {int(row[0]): int(row[1]) for row in result.all()}
        
        # Update poll_data with vote counts (don't save to DB, just return)
        total_votes = sum(vote_counts.values())
        
        return {
            "message": message,
            "vote_counts": vote_counts,
            "total_votes": total_votes,
            "user_vote": option_index
        }
    except HTTPException:
        raise
    except Exception as e:
        import logging
        import traceback
        logger = logging.getLogger(__name__)
        error_details = traceback.format_exc()
        logger.error(f"Error voting on poll: {str(e)}\n{error_details}")
        
        # Check if it's a table doesn't exist error
        error_str = str(e).lower()
        if "no such table" in error_str or "does not exist" in error_str or "poll_votes" in error_str:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Poll votes table not found. Please run database migration: alembic upgrade head"
            )
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record vote: {str(e)}"
        )


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


# ============= Events =============

@router.get("/events")
async def list_events(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    event_type: Optional[str] = Query(None),
) -> Any:
    """List upcoming events."""
    
    try:
        query = select(Event, User).join(
            User, Event.host_id == User.id
        ).where(
            Event.is_active == True,
            Event.is_cancelled == False,
            Event.start_date >= datetime.utcnow()
        )
        
        if event_type:
            query = query.where(Event.event_type == event_type)
        
        query = query.order_by(Event.start_date.asc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        rows = result.all()
        
        events_with_host = []
        current_user_id = current_user.id if current_user else None
        
        for event, host in rows:
            # Check if current user is registered (if authenticated)
            is_registered = False
            if current_user_id:
                try:
                    reg_result = await db.execute(
                        select(EventRegistration).where(
                            EventRegistration.event_id == event.id,
                            EventRegistration.user_id == current_user_id,
                            EventRegistration.status == "registered"
                        )
                    )
                    is_registered = reg_result.scalar_one_or_none() is not None
                except Exception:
                    # Table might not exist yet
                    is_registered = False
            
            event_dict = {
                "id": str(event.id),
                "title": event.title,
                "description": event.description,
                "host_id": str(event.host_id),
                "host_name": f"{host.first_name} {host.last_name}".strip() or host.email.split('@')[0],
                "start_date": event.start_date.isoformat() if event.start_date else None,
                "end_date": event.end_date.isoformat() if event.end_date else None,
                "timezone": event.timezone,
                "event_type": event.event_type,
                "location": event.location,
                "is_virtual": event.is_virtual,
                "meeting_link": event.meeting_link,
                "cover_image": event.cover_image,
                "is_public": event.is_public,
                "max_attendees": event.max_attendees,
                "attendees_count": event.attendees_count or 0,
                "views_count": event.views_count or 0,
                "is_registered": is_registered,
                "created_at": event.created_at.isoformat() if event.created_at else None,
            }
            events_with_host.append(event_dict)
        
        return events_with_host
    except (OperationalError, ProgrammingError) as e:
        # Database table doesn't exist
        logger = logging.getLogger(__name__)
        error_str = str(e).lower()
        error_trace = traceback.format_exc()
        logger.error(f"Database error listing events: {error_str}\n{error_trace}")
        
        if any(keyword in error_str for keyword in ["no such table", "relation", "does not exist", "table"]):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Events table not found. Please run database migrations: alembic upgrade head"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        # Other errors
        logger = logging.getLogger(__name__)
        error_trace = traceback.format_exc()
        logger.error(f"Error listing events: {str(e)}\n{error_trace}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching events: {str(e)}"
        )


@router.post("/events", status_code=status.HTTP_201_CREATED)
async def create_event(
    event_in: EventCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new event."""
    
    try:
        # Parse dates - handle various formats
        try:
            if 'T' in event_in.start_date:
                start_date = datetime.fromisoformat(event_in.start_date.replace('Z', '+00:00'))
            else:
                # If only date provided, assume midnight UTC
                start_date = datetime.fromisoformat(f"{event_in.start_date}T00:00:00+00:00")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid start_date format: {str(e)}"
            )
        
        end_date = None
        if event_in.end_date:
            try:
                if 'T' in event_in.end_date:
                    end_date = datetime.fromisoformat(event_in.end_date.replace('Z', '+00:00'))
                else:
                    end_date = datetime.fromisoformat(f"{event_in.end_date}T23:59:59+00:00")
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Invalid end_date format: {str(e)}"
                )
        
        event = Event(
            title=event_in.title,
            description=event_in.description,
            host_id=current_user.id,
            start_date=start_date,
            end_date=end_date,
            timezone=event_in.timezone,
            event_type=event_in.event_type,
            location=event_in.location,
            is_virtual=event_in.is_virtual,
            meeting_link=event_in.meeting_link,
            cover_image=event_in.cover_image,
            is_public=event_in.is_public,
            requires_approval=event_in.requires_approval,
            max_attendees=event_in.max_attendees,
        )
        
        db.add(event)
        await db.commit()
        await db.refresh(event)
        
        # Get host info
        result = await db.execute(
            select(User).where(User.id == current_user.id)
        )
        host = result.scalar_one()
        
        return {
            "id": str(event.id),
            "title": event.title,
            "description": event.description,
            "host_id": str(event.host_id),
            "host_name": f"{host.first_name} {host.last_name}".strip() or host.email.split('@')[0],
            "start_date": event.start_date.isoformat() if event.start_date else None,
            "end_date": event.end_date.isoformat() if event.end_date else None,
            "timezone": event.timezone,
            "event_type": event.event_type,
            "location": event.location,
            "is_virtual": event.is_virtual,
            "meeting_link": event.meeting_link,
            "cover_image": event.cover_image,
            "is_public": event.is_public,
            "max_attendees": event.max_attendees,
            "attendees_count": 0,
            "views_count": 0,
            "is_registered": False,
            "created_at": event.created_at.isoformat() if event.created_at else None,
        }
    except HTTPException:
        raise
    except (OperationalError, ProgrammingError) as e:
        # Database table doesn't exist
        logger = logging.getLogger(__name__)
        error_str = str(e).lower()
        error_trace = traceback.format_exc()
        logger.error(f"Database error creating event: {error_str}\n{error_trace}")
        
        if any(keyword in error_str for keyword in ["no such table", "relation", "does not exist", "table"]):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Events table not found. Please run database migrations: alembic upgrade head"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        # Other errors
        logger = logging.getLogger(__name__)
        error_trace = traceback.format_exc()
        logger.error(f"Error creating event: {str(e)}\n{error_trace}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating event: {str(e)}"
        )


@router.post("/events/{event_id}/register")
async def register_for_event(
    event_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Register for an event."""
    
    # Get event
    result = await db.execute(
        select(Event).where(Event.id == event_id)
    )
    event = result.scalar_one_or_none()
    
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    if not event.is_active or event.is_cancelled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event is not available"
        )
    
    # Check if already registered
    result = await db.execute(
        select(EventRegistration).where(
            EventRegistration.event_id == event_id,
            EventRegistration.user_id == current_user.id
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        if existing.status == "registered":
            # Unregister
            existing.status = "cancelled"
            event.attendees_count = max(0, event.attendees_count - 1)
            await db.commit()
            return {"message": "Unregistered from event"}
        else:
            # Re-register
            existing.status = "registered"
            event.attendees_count += 1
            await db.commit()
            return {"message": "Registered for event"}
    else:
        # New registration
        registration = EventRegistration(
            event_id=event_id,
            user_id=current_user.id,
            status="registered"
        )
        db.add(registration)
        event.attendees_count += 1
        await db.commit()
        return {"message": "Registered for event"}


# ============= Combinator =============

@router.get("/combinator/ideas", response_model=List[StartupIdeaResponse])
async def list_startup_ideas(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    stage: Optional[str] = Query(None),
) -> Any:
    """List startup ideas for matching."""
    
    try:
        query = select(StartupIdea, User).join(
            User, StartupIdea.founder_id == User.id
        ).where(
            StartupIdea.is_active == True
        )
        
        if stage:
            query = query.where(StartupIdea.stage == stage)
        
        query = query.order_by(StartupIdea.created_at.desc())
        query = query.offset(skip).limit(limit)
        
        result = await db.execute(query)
        rows = result.all()
        
        ideas_with_founder = []
        for idea, founder in rows:
            idea_dict = {
                "id": str(idea.id),
                "founder_id": str(idea.founder_id),
                "founder_name": f"{founder.first_name} {founder.last_name}".strip() or founder.email.split('@')[0],
                "title": idea.title,
                "description": idea.description,
                "problem": idea.problem,
                "target_market": idea.target_market,
                "stage": idea.stage,
                "commitment": idea.commitment,
                "funding_status": idea.funding_status,
                "roles_needed": idea.roles_needed or [],
                "skills_needed": idea.skills_needed or [],
                "team_size": idea.team_size or 0,
                "founder_roles": idea.founder_roles or [],
                "founder_skills": idea.founder_skills or [],
                "views_count": idea.views_count or 0,
                "connections_count": idea.connections_count or 0,
                "is_active": idea.is_active,
                "created_at": idea.created_at,
            }
            ideas_with_founder.append(idea_dict)
        
        return ideas_with_founder
    except (OperationalError, ProgrammingError) as e:
        # Database table doesn't exist
        logger = logging.getLogger(__name__)
        error_str = str(e).lower()
        error_trace = traceback.format_exc()
        logger.error(f"Database error listing startup ideas: {error_str}\n{error_trace}")
        
        if any(keyword in error_str for keyword in ["no such table", "relation", "does not exist", "table"]):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Startup ideas table not found. Please run database migrations: alembic upgrade head"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        # Other errors
        logger = logging.getLogger(__name__)
        error_trace = traceback.format_exc()
        logger.error(f"Error listing startup ideas: {str(e)}\n{error_trace}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching startup ideas: {str(e)}"
        )


@router.post("/combinator/ideas", response_model=StartupIdeaResponse, status_code=status.HTTP_201_CREATED)
async def submit_startup_idea(
    idea_in: StartupIdeaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Submit a startup idea for co-founder matching."""
    
    try:
        idea = StartupIdea(
            founder_id=current_user.id,
            title=idea_in.title,
            description=idea_in.description,
            problem=idea_in.problem,
            target_market=idea_in.target_market,
            stage=idea_in.stage,
            commitment=idea_in.commitment,
            funding_status=idea_in.funding_status,
            roles_needed=idea_in.roles_needed,
            skills_needed=idea_in.skills_needed,
            team_size=idea_in.team_size,
            founder_roles=idea_in.founder_roles,
            founder_skills=idea_in.founder_skills,
            founder_commitment=idea_in.founder_commitment,
            founder_funding=idea_in.founder_funding,
        )
        
        db.add(idea)
        await db.commit()
        await db.refresh(idea)
        
        # Get founder info
        result = await db.execute(
            select(User).where(User.id == current_user.id)
        )
        founder = result.scalar_one()
        
        return {
            "id": str(idea.id),
            "founder_id": str(idea.founder_id),
            "founder_name": f"{founder.first_name} {founder.last_name}".strip() or founder.email.split('@')[0],
            "title": idea.title,
            "description": idea.description,
            "problem": idea.problem,
            "target_market": idea.target_market,
            "stage": idea.stage,
            "commitment": idea.commitment,
            "funding_status": idea.funding_status,
            "roles_needed": idea.roles_needed or [],
            "skills_needed": idea.skills_needed or [],
            "team_size": idea.team_size or 0,
            "founder_roles": idea.founder_roles or [],
            "founder_skills": idea.founder_skills or [],
            "views_count": 0,
            "connections_count": 0,
            "is_active": idea.is_active,
            "created_at": idea.created_at,
        }
    except HTTPException:
        raise
    except (OperationalError, ProgrammingError) as e:
        # Database table doesn't exist
        logger = logging.getLogger(__name__)
        error_str = str(e).lower()
        error_trace = traceback.format_exc()
        logger.error(f"Database error submitting startup idea: {error_str}\n{error_trace}")
        
        if any(keyword in error_str for keyword in ["no such table", "relation", "does not exist", "table"]):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Startup ideas table not found. Please run database migrations: alembic upgrade head"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        # Other errors
        logger = logging.getLogger(__name__)
        error_trace = traceback.format_exc()
        logger.error(f"Error submitting startup idea: {str(e)}\n{error_trace}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error submitting startup idea: {str(e)}"
        )


@router.post("/combinator/ideas/{idea_id}/connect")
async def connect_with_founder(
    idea_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Connect with a founder (send match request)."""
    
    # Get idea
    result = await db.execute(
        select(StartupIdea).where(StartupIdea.id == idea_id)
    )
    idea = result.scalar_one_or_none()
    
    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Startup idea not found"
        )
    
    if idea.founder_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot connect with your own idea"
        )
    
    # Check if already matched
    result = await db.execute(
        select(FounderMatch).where(
            FounderMatch.idea_id == idea_id,
            FounderMatch.founder_id == current_user.id
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        if existing.status == "connected":
            return {"message": "Already connected"}
        elif existing.status == "pending":
            return {"message": "Connection request already sent"}
        else:
            # Resend request
            existing.status = "pending"
            await db.commit()
            return {"message": "Connection request sent"}
    else:
        # Create new match
        match = FounderMatch(
            idea_id=idea_id,
            founder_id=current_user.id,
            status="pending"
        )
        db.add(match)
        idea.connections_count += 1
        await db.commit()
        return {"message": "Connection request sent"}

