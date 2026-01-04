"""
Network and Connections API endpoints.
"""

from typing import Any, List, Optional
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func

from app.db.session import get_db
from app.models.network import Connection, ConnectionRequest, Follow, BlockedUser, ConnectionStatus
from app.models.user import User, UserProfile
from app.schemas.network import (
    ConnectionRequestCreate, ConnectionRequestResponse,
    ConnectionResponse, ConnectionRequestAction,
    FollowCreate, FollowResponse,
    BlockUserCreate, UserNetworkStats
)
from app.core.security import get_current_user

router = APIRouter()


# ============= Connections =============

@router.get("/connections", response_model=List[ConnectionResponse])
async def list_connections(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's connections."""
    
    result = await db.execute(
        select(Connection).where(
            or_(
                Connection.user_id == current_user.id,
                Connection.connected_user_id == current_user.id
            ),
            Connection.status == ConnectionStatus.ACCEPTED
        )
    )
    return result.scalars().all()


@router.delete("/connections/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_connection(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Remove a connection."""
    
    result = await db.execute(
        select(Connection).where(
            or_(
                (Connection.user_id == current_user.id) & (Connection.connected_user_id == user_id),
                (Connection.user_id == user_id) & (Connection.connected_user_id == current_user.id)
            ),
            Connection.status == ConnectionStatus.ACCEPTED
        )
    )
    connection = result.scalar_one_or_none()
    
    if connection:
        await db.delete(connection)
        
        # Update connection counts
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == current_user.id)
        )
        my_profile = result.scalar_one_or_none()
        if my_profile:
            my_profile.connections_count = max(0, my_profile.connections_count - 1)
        
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        other_profile = result.scalar_one_or_none()
        if other_profile:
            other_profile.connections_count = max(0, other_profile.connections_count - 1)
        
        await db.commit()


# ============= Connection Requests =============

@router.get("/requests/sent", response_model=List[ConnectionRequestResponse])
async def list_sent_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List sent connection requests."""
    
    result = await db.execute(
        select(ConnectionRequest).where(
            ConnectionRequest.sender_id == current_user.id,
            ConnectionRequest.status == ConnectionStatus.PENDING
        )
    )
    return result.scalars().all()


@router.get("/requests/received", response_model=List[ConnectionRequestResponse])
async def list_received_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List received connection requests."""
    
    result = await db.execute(
        select(ConnectionRequest).where(
            ConnectionRequest.receiver_id == current_user.id,
            ConnectionRequest.status == ConnectionStatus.PENDING
        )
    )
    return result.scalars().all()


@router.post("/requests", response_model=ConnectionRequestResponse, status_code=status.HTTP_201_CREATED)
async def send_connection_request(
    request_in: ConnectionRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Send a connection request."""
    
    if request_in.receiver_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send request to yourself"
        )
    
    # Check if already connected
    result = await db.execute(
        select(Connection).where(
            or_(
                (Connection.user_id == current_user.id) & (Connection.connected_user_id == request_in.receiver_id),
                (Connection.user_id == request_in.receiver_id) & (Connection.connected_user_id == current_user.id)
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
                (ConnectionRequest.sender_id == current_user.id) & (ConnectionRequest.receiver_id == request_in.receiver_id),
                (ConnectionRequest.sender_id == request_in.receiver_id) & (ConnectionRequest.receiver_id == current_user.id)
            ),
            ConnectionRequest.status == ConnectionStatus.PENDING
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request already pending"
        )
    
    request = ConnectionRequest(
        sender_id=current_user.id,
        receiver_id=request_in.receiver_id,
        message=request_in.message,
    )
    
    db.add(request)
    await db.commit()
    await db.refresh(request)
    
    return request


@router.post("/requests/{request_id}/respond")
async def respond_to_request(
    request_id: UUID,
    action_in: ConnectionRequestAction,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Accept or decline a connection request."""
    
    result = await db.execute(
        select(ConnectionRequest).where(
            ConnectionRequest.id == request_id,
            ConnectionRequest.receiver_id == current_user.id,
            ConnectionRequest.status == ConnectionStatus.PENDING
        )
    )
    request = result.scalar_one_or_none()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    request.responded_at = datetime.utcnow()
    request.response_message = action_in.response_message
    
    if action_in.action == "accept":
        request.status = ConnectionStatus.ACCEPTED
        
        # Create connection
        connection = Connection(
            user_id=request.sender_id,
            connected_user_id=current_user.id,
            status=ConnectionStatus.ACCEPTED,
        )
        db.add(connection)
        
        # Update connection counts
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == current_user.id)
        )
        my_profile = result.scalar_one_or_none()
        if my_profile:
            my_profile.connections_count += 1
        
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == request.sender_id)
        )
        sender_profile = result.scalar_one_or_none()
        if sender_profile:
            sender_profile.connections_count += 1
    
    elif action_in.action == "decline":
        request.status = ConnectionStatus.DECLINED
    
    await db.commit()
    
    return {"message": f"Request {action_in.action}ed"}


@router.delete("/requests/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def withdraw_request(
    request_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Withdraw a sent connection request."""
    
    result = await db.execute(
        select(ConnectionRequest).where(
            ConnectionRequest.id == request_id,
            ConnectionRequest.sender_id == current_user.id,
            ConnectionRequest.status == ConnectionStatus.PENDING
        )
    )
    request = result.scalar_one_or_none()
    
    if request:
        request.status = ConnectionStatus.WITHDRAWN
        await db.commit()


# ============= Follows =============

@router.get("/followers", response_model=List[FollowResponse])
async def list_followers(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List user's followers."""
    
    result = await db.execute(
        select(Follow).where(Follow.following_id == current_user.id)
    )
    return result.scalars().all()


@router.get("/following", response_model=List[FollowResponse])
async def list_following(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """List users I'm following."""
    
    result = await db.execute(
        select(Follow).where(Follow.follower_id == current_user.id)
    )
    return result.scalars().all()


@router.post("/follow/{user_id}", status_code=status.HTTP_201_CREATED)
async def follow_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Follow a user."""
    
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot follow yourself"
        )
    
    # Check if already following
    result = await db.execute(
        select(Follow).where(
            Follow.follower_id == current_user.id,
            Follow.following_id == user_id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following"
        )
    
    follow = Follow(
        follower_id=current_user.id,
        following_id=user_id,
    )
    db.add(follow)
    
    # Update follower counts
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    my_profile = result.scalar_one_or_none()
    if my_profile:
        my_profile.following_count += 1
    
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user_id)
    )
    other_profile = result.scalar_one_or_none()
    if other_profile:
        other_profile.followers_count += 1
    
    await db.commit()
    
    return {"message": "Now following user"}


@router.delete("/follow/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unfollow_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Unfollow a user."""
    
    result = await db.execute(
        select(Follow).where(
            Follow.follower_id == current_user.id,
            Follow.following_id == user_id
        )
    )
    follow = result.scalar_one_or_none()
    
    if follow:
        await db.delete(follow)
        
        # Update follower counts
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == current_user.id)
        )
        my_profile = result.scalar_one_or_none()
        if my_profile:
            my_profile.following_count = max(0, my_profile.following_count - 1)
        
        result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == user_id)
        )
        other_profile = result.scalar_one_or_none()
        if other_profile:
            other_profile.followers_count = max(0, other_profile.followers_count - 1)
        
        await db.commit()


# ============= Block =============

@router.post("/block/{user_id}", status_code=status.HTTP_201_CREATED)
async def block_user(
    user_id: UUID,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Block a user."""
    
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot block yourself"
        )
    
    # Check if already blocked
    result = await db.execute(
        select(BlockedUser).where(
            BlockedUser.blocker_id == current_user.id,
            BlockedUser.blocked_id == user_id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already blocked"
        )
    
    block = BlockedUser(
        blocker_id=current_user.id,
        blocked_id=user_id,
        reason=reason,
    )
    db.add(block)
    await db.commit()
    
    return {"message": "User blocked"}


@router.delete("/block/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def unblock_user(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Unblock a user."""
    
    result = await db.execute(
        select(BlockedUser).where(
            BlockedUser.blocker_id == current_user.id,
            BlockedUser.blocked_id == user_id
        )
    )
    block = result.scalar_one_or_none()
    
    if block:
        await db.delete(block)
        await db.commit()


# ============= Stats =============

@router.get("/stats", response_model=UserNetworkStats)
async def get_network_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get user's network statistics."""
    
    # Get profile
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    
    # Count pending requests
    result = await db.execute(
        select(func.count(ConnectionRequest.id)).where(
            ConnectionRequest.receiver_id == current_user.id,
            ConnectionRequest.status == ConnectionStatus.PENDING
        )
    )
    pending_count = result.scalar() or 0
    
    return UserNetworkStats(
        connections_count=profile.connections_count if profile else 0,
        followers_count=profile.followers_count if profile else 0,
        following_count=profile.following_count if profile else 0,
        pending_requests_count=pending_count,
    )

