"""
Unified Network API - Combined Network & Community endpoints.
Provides a single API for the merged Network experience.
"""

from typing import Any, List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_, func, desc
from pydantic import BaseModel

from app.db.session import get_db
from app.models.network import Connection, ConnectionRequest, Follow, BlockedUser, ConnectionStatus
from app.models.community import Group, GroupMember, Post, Comment, PostReaction, PollVote, GroupType, GroupMemberRole, PostType
from app.models.user import User, UserProfile
from app.core.security import get_current_user

router = APIRouter()


# ============================================
# SCHEMAS
# ============================================

class NetworkStatsResponse(BaseModel):
    connections_count: int
    followers_count: int
    following_count: int
    pending_requests_count: int
    group_memberships: int
    profile_views: int
    posts_count: int
    unread_notifications: int


class UserSuggestion(BaseModel):
    id: str
    name: str
    title: Optional[str]
    company: Optional[str]
    avatar_url: Optional[str]
    mutual_connections: int
    is_verified: bool
    skills: List[str]
    reason: str  # Why suggested: "mutual connections", "similar skills", etc.


class GroupSuggestion(BaseModel):
    id: str
    name: str
    description: str
    member_count: int
    category: str
    is_featured: bool
    reason: str


class TrendingTopic(BaseModel):
    tag: str
    posts_count: int
    trend_direction: str  # up, down, stable


class FeedItem(BaseModel):
    id: str
    type: str  # post, article, event, milestone
    author_id: str
    author_name: str
    author_title: Optional[str]
    author_avatar: Optional[str]
    author_verified: bool
    content: str
    media: List[dict]
    likes_count: int
    comments_count: int
    shares_count: int
    is_liked: bool
    is_saved: bool
    created_at: str
    group_id: Optional[str]
    group_name: Optional[str]
    post_type: Optional[str] = None  # text, poll, link, image, video, article
    poll_data: Optional[dict] = None  # {question, options: []}
    link_url: Optional[str] = None


class NetworkEvent(BaseModel):
    id: str
    title: str
    description: str
    date: str
    time: str
    attendees_count: int
    host_name: str
    event_type: str
    is_registered: bool
    cover_image: Optional[str]


# ============================================
# UNIFIED NETWORK STATS
# ============================================

@router.get("/stats", response_model=NetworkStatsResponse)
async def get_unified_network_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get comprehensive network statistics."""
    
    # Get user profile
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    # Count connections
    result = await db.execute(
        select(func.count(Connection.id)).where(
            or_(
                Connection.user_id == current_user.id,
                Connection.connected_user_id == current_user.id
            ),
            Connection.status == ConnectionStatus.ACCEPTED
        )
    )
    connections_count = result.scalar() or 0
    
    # Count pending requests
    result = await db.execute(
        select(func.count(ConnectionRequest.id)).where(
            ConnectionRequest.receiver_id == current_user.id,
            ConnectionRequest.status == ConnectionStatus.PENDING
        )
    )
    pending_count = result.scalar() or 0
    
    # Count group memberships
    result = await db.execute(
        select(func.count(GroupMember.id)).where(
            GroupMember.user_id == current_user.id,
            GroupMember.is_approved == True,
            GroupMember.is_banned == False
        )
    )
    group_count = result.scalar() or 0
    
    # Count unread notifications
    from app.models.notification import Notification
    result = await db.execute(
        select(func.count(Notification.id)).where(
            Notification.user_id == current_user.id,
            Notification.is_read == False
        )
    )
    unread_notifications = result.scalar() or 0
    
    return NetworkStatsResponse(
        connections_count=connections_count,
        followers_count=profile.followers_count if profile else 0,
        following_count=profile.following_count if profile else 0,
        pending_requests_count=pending_count,
        group_memberships=group_count,
        profile_views=profile.profile_views if profile and hasattr(profile, 'profile_views') else 0,
        posts_count=posts_count,
        unread_notifications=unread_notifications
    )


# ============================================
# PEOPLE SUGGESTIONS
# ============================================

@router.get("/suggestions/people", response_model=List[UserSuggestion])
async def get_people_suggestions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50)
) -> Any:
    """Get people you may want to connect with."""
    
    # Get current connections
    result = await db.execute(
        select(Connection.connected_user_id).where(
            Connection.user_id == current_user.id,
            Connection.status == ConnectionStatus.ACCEPTED
        )
    )
    connected_ids = [r[0] for r in result.all()]
    
    result = await db.execute(
        select(Connection.user_id).where(
            Connection.connected_user_id == current_user.id,
            Connection.status == ConnectionStatus.ACCEPTED
        )
    )
    connected_ids.extend([r[0] for r in result.all()])
    
    # Get blocked users
    result = await db.execute(
        select(BlockedUser.blocked_id).where(BlockedUser.blocker_id == current_user.id)
    )
    blocked_ids = [r[0] for r in result.all()]
    
    # Exclude current user, connections, and blocked
    exclude_ids = [current_user.id] + connected_ids + blocked_ids
    
    # Find users with similar interests (simplified - would use ML in production)
    query = select(User, UserProfile).outerjoin(UserProfile, User.id == UserProfile.user_id)
    
    if exclude_ids:
        query = query.where(User.id.notin_(exclude_ids))
    
    query = query.where(User.is_active == True)
    query = query.limit(limit)
    
    result = await db.execute(query)
    rows = result.all()
    
    suggestions = []
    for user, profile in rows:
        # Count mutual connections (simplified)
        mutual_count = 0
        if connected_ids:
            result = await db.execute(
                select(func.count(Connection.id)).where(
                    or_(
                        and_(Connection.user_id == user.id, Connection.connected_user_id.in_(connected_ids)),
                        and_(Connection.connected_user_id == user.id, Connection.user_id.in_(connected_ids))
                    ),
                    Connection.status == ConnectionStatus.ACCEPTED
                )
            )
            mutual_count = result.scalar() or 0
        
        suggestions.append(UserSuggestion(
            id=str(user.id),
            name=f"{user.first_name} {user.last_name}",
            title=profile.headline if profile else None,
            company=profile.current_company if profile else None,
            avatar_url=profile.avatar_url if profile else None,
            mutual_connections=mutual_count,
            is_verified=user.is_verified if hasattr(user, 'is_verified') else False,
            skills=profile.skills[:5] if profile and profile.skills else [],
            reason="mutual connections" if mutual_count > 0 else "similar industry"
        ))
    
    # Sort by mutual connections
    suggestions.sort(key=lambda x: x.mutual_connections, reverse=True)
    
    return suggestions


# ============================================
# GROUP SUGGESTIONS
# ============================================

@router.get("/suggestions/groups", response_model=List[GroupSuggestion])
async def get_group_suggestions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50)
) -> Any:
    """Get groups you may want to join."""
    
    # Get groups user is already in
    result = await db.execute(
        select(GroupMember.group_id).where(
            GroupMember.user_id == current_user.id
        )
    )
    joined_ids = [r[0] for r in result.all()]
    
    # Find public groups not joined
    query = select(Group).where(
        Group.is_active == True,
        Group.group_type != GroupType.SECRET
    )
    
    if joined_ids:
        query = query.where(Group.id.notin_(joined_ids))
    
    query = query.order_by(Group.is_featured.desc(), Group.member_count.desc())
    query = query.limit(limit)
    
    result = await db.execute(query)
    groups = result.scalars().all()
    
    return [
        GroupSuggestion(
            id=str(g.id),
            name=g.name,
            description=g.description or "",
            member_count=g.member_count,
            category=g.category or "General",
            is_featured=g.is_featured,
            reason="popular in your network" if g.is_featured else "based on your interests"
        )
        for g in groups
    ]


# ============================================
# UNIFIED FEED
# ============================================

@router.get("/feed", response_model=List[FeedItem])
async def get_unified_feed(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    filter_type: Optional[str] = Query(None, description="post, article, event, all")
) -> Any:
    """Get unified feed from connections and groups."""
    
    # Get connections
    result = await db.execute(
        select(Connection.connected_user_id).where(
            Connection.user_id == current_user.id,
            Connection.status == ConnectionStatus.ACCEPTED
        )
    )
    connection_ids = [r[0] for r in result.all()]
    
    result = await db.execute(
        select(Connection.user_id).where(
            Connection.connected_user_id == current_user.id,
            Connection.status == ConnectionStatus.ACCEPTED
        )
    )
    connection_ids.extend([r[0] for r in result.all()])
    
    # Get following
    result = await db.execute(
        select(Follow.following_id).where(Follow.follower_id == current_user.id)
    )
    following_ids = [r[0] for r in result.all()]
    
    # Get groups
    result = await db.execute(
        select(GroupMember.group_id).where(
            GroupMember.user_id == current_user.id,
            GroupMember.is_approved == True
        )
    )
    group_ids = [r[0] for r in result.all()]
    
    # Build query
    query = select(Post, User, UserProfile, Group).join(
        User, Post.author_id == User.id
    ).outerjoin(
        UserProfile, User.id == UserProfile.user_id
    ).outerjoin(
        Group, Post.group_id == Group.id
    )
    
    # Filter conditions
    author_ids = list(set(connection_ids + following_ids + [current_user.id]))
    
    conditions = [
        Post.is_published == True,
        or_(
            Post.author_id.in_(author_ids) if author_ids else False,
            Post.group_id.in_(group_ids) if group_ids else False,
            Post.visibility == "public"
        )
    ]
    
    if filter_type and filter_type != "all":
        conditions.append(Post.post_type == PostType(filter_type))
    
    query = query.where(and_(*conditions))
    query = query.order_by(desc(Post.created_at))
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    rows = result.all()
    
    feed_items = []
    for post, user, profile, group in rows:
        # Check if current user liked this post
        like_result = await db.execute(
            select(PostReaction).where(
                PostReaction.post_id == post.id,
                PostReaction.user_id == current_user.id
            )
        )
        is_liked = like_result.scalar_one_or_none() is not None
        
        # Get poll vote counts if it's a poll
        poll_data = post.poll_data if post.poll_data else None
        user_vote = None
        if post.post_type == PostType.POLL and poll_data:
            # Get user's vote
            vote_result = await db.execute(
                select(PollVote).where(
                    PollVote.post_id == post.id,
                    PollVote.user_id == current_user.id
                )
            )
            user_vote_obj = vote_result.scalar_one_or_none()
            if user_vote_obj:
                user_vote = user_vote_obj.option_index
            
            # Get vote counts for all options
            vote_counts_result = await db.execute(
                select(PollVote.option_index, func.count(PollVote.id))
                .where(PollVote.post_id == post.id)
                .group_by(PollVote.option_index)
            )
            vote_counts = {row[0]: row[1] for row in vote_counts_result.all()}
            
            # Update poll_data with vote counts
            if isinstance(poll_data, dict):
                poll_data = poll_data.copy()
                poll_data["vote_counts"] = vote_counts
                poll_data["total_votes"] = sum(vote_counts.values())
                # Only include user_vote if user has voted (not None)
                if user_vote is not None:
                    poll_data["user_vote"] = user_vote
                # If user hasn't voted, don't include user_vote field (or set to None explicitly)
                else:
                    poll_data["user_vote"] = None
        
        feed_items.append(FeedItem(
            id=str(post.id),
            type=post.post_type.value if post.post_type else "text",
            author_id=str(user.id),
            author_name=f"{user.first_name} {user.last_name}",
            author_title=profile.headline if profile else None,
            author_avatar=profile.avatar_url if profile else None,
            author_verified=user.is_verified if hasattr(user, 'is_verified') else False,
            content=post.content or "",
            media=post.media or [],
            likes_count=post.likes_count,
            comments_count=post.comments_count,
            shares_count=post.shares_count,
            is_liked=is_liked,
            is_saved=False,  # TODO: Implement saved posts
            created_at=post.created_at.isoformat() if post.created_at else "",
            group_id=str(group.id) if group else None,
            group_name=group.name if group else None,
            post_type=post.post_type.value if post.post_type else "text",
            poll_data=poll_data,
            link_url=post.link_url if post.link_url else None
        ))
    
    return feed_items


# ============================================
# TRENDING TOPICS
# ============================================

@router.get("/trending", response_model=List[TrendingTopic])
async def get_trending_topics(
    db: AsyncSession = Depends(get_db),
    limit: int = Query(10, ge=1, le=20)
) -> Any:
    """Get trending topics/hashtags in the network."""
    
    # In production, this would aggregate hashtags from recent posts
    # For now, return mock data
    trending = [
        TrendingTopic(tag="#TechCareers", posts_count=1234, trend_direction="up"),
        TrendingTopic(tag="#ReactJS", posts_count=987, trend_direction="up"),
        TrendingTopic(tag="#AITools", posts_count=856, trend_direction="stable"),
        TrendingTopic(tag="#RemoteWork", posts_count=743, trend_direction="up"),
        TrendingTopic(tag="#StartupLife", posts_count=621, trend_direction="down"),
        TrendingTopic(tag="#MachineLearning", posts_count=589, trend_direction="up"),
        TrendingTopic(tag="#DevOps", posts_count=512, trend_direction="stable"),
        TrendingTopic(tag="#Python", posts_count=478, trend_direction="up"),
        TrendingTopic(tag="#CloudComputing", posts_count=423, trend_direction="stable"),
        TrendingTopic(tag="#DataScience", posts_count=398, trend_direction="up"),
    ]
    
    return trending[:limit]


# ============================================
# QUICK ACTIONS
# ============================================

@router.post("/quick-connect/{user_id}")
async def quick_connect(
    user_id: UUID,
    message: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Quick connect with a user (sends connection request)."""
    
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot connect with yourself"
        )
    
    # Check if already connected
    result = await db.execute(
        select(Connection).where(
            or_(
                and_(Connection.user_id == current_user.id, Connection.connected_user_id == user_id),
                and_(Connection.user_id == user_id, Connection.connected_user_id == current_user.id)
            ),
            Connection.status == ConnectionStatus.ACCEPTED
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already connected"
        )
    
    # Check for pending request
    result = await db.execute(
        select(ConnectionRequest).where(
            or_(
                and_(ConnectionRequest.sender_id == current_user.id, ConnectionRequest.receiver_id == user_id),
                and_(ConnectionRequest.sender_id == user_id, ConnectionRequest.receiver_id == current_user.id)
            ),
            ConnectionRequest.status == ConnectionStatus.PENDING
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        if existing.sender_id == user_id:
            # They sent us a request - auto accept
            existing.status = ConnectionStatus.ACCEPTED
            existing.responded_at = datetime.utcnow()
            
            connection = Connection(
                user_id=user_id,
                connected_user_id=current_user.id,
                status=ConnectionStatus.ACCEPTED
            )
            db.add(connection)
            await db.commit()
            return {"message": "Connection accepted", "status": "connected"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Request already pending"
            )
    
    # Create new request
    request = ConnectionRequest(
        sender_id=current_user.id,
        receiver_id=user_id,
        message=message or f"Hi! I'd like to connect with you on VerTechie.",
    )
    db.add(request)
    await db.commit()
    
    return {"message": "Connection request sent", "status": "pending"}


@router.post("/quick-join/{group_id}")
async def quick_join_group(
    group_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Quick join a group."""
    
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
        role=GroupMemberRole.MEMBER,
        is_approved=not group.requires_approval,
    )
    db.add(member)
    
    if not group.requires_approval:
        group.member_count += 1
    
    await db.commit()
    
    return {
        "message": "Joined group" if not group.requires_approval else "Join request sent",
        "status": "joined" if not group.requires_approval else "pending"
    }


# ============================================
# NETWORK ACTIVITY
# ============================================

@router.get("/activity")
async def get_network_activity(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = Query(10, ge=1, le=50)
) -> Any:
    """Get recent network activity (connections, joins, posts)."""
    
    activities = []
    
    # Recent connections (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    result = await db.execute(
        select(Connection, User).join(
            User, Connection.connected_user_id == User.id
        ).where(
            Connection.user_id == current_user.id,
            Connection.status == ConnectionStatus.ACCEPTED,
            Connection.connected_at >= week_ago
        ).order_by(desc(Connection.connected_at)).limit(5)
    )
    
    for conn, user in result.all():
        activities.append({
            "type": "connection",
            "message": f"You connected with {user.first_name} {user.last_name}",
            "timestamp": conn.connected_at.isoformat() if conn.connected_at else "",
            "user_id": str(user.id),
            "icon": "handshake"
        })
    
    # Recent group joins
    result = await db.execute(
        select(GroupMember, Group).join(
            Group, GroupMember.group_id == Group.id
        ).where(
            GroupMember.user_id == current_user.id,
            GroupMember.is_approved == True,
            GroupMember.joined_at >= week_ago
        ).order_by(desc(GroupMember.joined_at)).limit(5)
    )
    
    for member, group in result.all():
        activities.append({
            "type": "group_join",
            "message": f"You joined {group.name}",
            "timestamp": member.joined_at.isoformat() if member.joined_at else "",
            "group_id": str(group.id),
            "icon": "groups"
        })
    
    # Sort by timestamp
    activities.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    
    return activities[:limit]


# ============================================
# NETWORK SEARCH
# ============================================

@router.get("/search")
async def search_network(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    q: str = Query(..., min_length=2, description="Search query"),
    type: str = Query("all", description="people, groups, posts, jobs, courses, all"),
    limit: int = Query(20, ge=1, le=100)
) -> Any:
    """Search across people, groups, posts, jobs, and courses."""
    
    results = {
        "people": [],
        "groups": [],
        "posts": [],
        "jobs": [],
        "courses": [],
        "query": q,
        "total": 0
    }
    
    search_term = f"%{q}%"
    
    # Search people
    if type in ["all", "people"]:
        result = await db.execute(
            select(User, UserProfile).outerjoin(
                UserProfile, User.id == UserProfile.user_id
            ).where(
                User.is_active == True,
                or_(
                    User.first_name.ilike(search_term),
                    User.last_name.ilike(search_term),
                    User.email.ilike(search_term),
                    UserProfile.headline.ilike(search_term),
                    UserProfile.current_company.ilike(search_term)
                )
            ).limit(limit if type == "people" else 5)
        )
        
        for user, profile in result.all():
            results["people"].append({
                "id": str(user.id),
                "name": f"{user.first_name} {user.last_name}",
                "title": profile.headline if profile else None,
                "company": profile.current_company if profile else None,
                "avatar_url": profile.avatar_url if profile else None,
                "type": "person"
            })
    
    # Search groups
    if type in ["all", "groups"]:
        result = await db.execute(
            select(Group).where(
                Group.is_active == True,
                Group.group_type != GroupType.SECRET,
                or_(
                    Group.name.ilike(search_term),
                    Group.description.ilike(search_term),
                    Group.category.ilike(search_term)
                )
            ).limit(limit if type == "groups" else 5)
        )
        
        for group in result.scalars().all():
            results["groups"].append({
                "id": str(group.id),
                "name": group.name,
                "description": group.description,
                "member_count": group.member_count,
                "category": group.category,
                "type": "group"
            })
    
    # Search posts
    if type in ["all", "posts"]:
        result = await db.execute(
            select(Post, User).join(
                User, Post.author_id == User.id
            ).where(
                Post.is_published == True,
                Post.visibility == "public",
                Post.content.ilike(search_term)
            ).order_by(desc(Post.created_at)).limit(limit if type == "posts" else 5)
        )
        
        for post, user in result.all():
            results["posts"].append({
                "id": str(post.id),
                "author_name": f"{user.first_name} {user.last_name}",
                "content": post.content[:200] + "..." if len(post.content or "") > 200 else post.content,
                "likes_count": post.likes_count,
                "created_at": post.created_at.isoformat() if post.created_at else "",
                "type": "post"
            })

    # Search jobs
    if type in ["all", "jobs"]:
        from app.models.job import Job
        # Import JobStatus to check if it's published
        from app.models.job import JobStatus
        result = await db.execute(
            select(Job).where(
                Job.status == JobStatus.PUBLISHED,
                or_(
                    Job.title.ilike(search_term),
                    Job.description.ilike(search_term),
                    Job.company_name.ilike(search_term)
                )
            ).limit(limit if type == "jobs" else 5)
        )
        for job in result.scalars().all():
            results["jobs"].append({
                "id": str(job.id),
                "title": job.title,
                "company": job.company_name,
                "location": job.location,
                "type": "job"
            })

    # Search companies
    if type in ["all", "companies"]:
        from app.models.company import Company, CompanyStatus
        result = await db.execute(
            select(Company).where(
                Company.status == CompanyStatus.ACTIVE,
                or_(
                    Company.name.ilike(search_term),
                    Company.industry.ilike(search_term)
                )
            ).limit(limit if type == "companies" else 5)
        )
        for company in result.scalars().all():
            results["companies"].append({
                "id": str(company.id),
                "name": company.name,
                "industry": company.industry,
                "employees": str(company.employees_count),
                "verified": company.is_verified,
                "type": "company"
            })

    # Search courses
    if type in ["all", "courses"]:
        from app.models.course import Course
        result = await db.execute(
            select(Course).where(
                Course.is_published == True,
                or_(
                    Course.title.ilike(search_term),
                    Course.description.ilike(search_term)
                )
            ).limit(limit if type == "courses" else 5)
        )
        for course in result.scalars().all():
            results["courses"].append({
                "id": str(course.id),
                "title": course.title,
                "instructor": "Instructor", # Placeholder
                "type": "course"
            })

    results["total"] = (
        len(results["people"]) + 
        len(results["groups"]) + 
        len(results["posts"]) + 
        len(results["jobs"]) + 
        len(results["courses"]) +
        len(results["companies"])
    )
    
    return results
