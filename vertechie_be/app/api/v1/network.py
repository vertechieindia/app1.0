"""
Networking routes.
"""

from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_

from app.db import get_db
from app.models.network import Connection, ConnectionRequest, ConnectionStatus
from app.models.user import User, UserProfile
from app.api.v1.auth import get_current_user

router = APIRouter()


@router.get("/connections", response_model=List[dict])
async def list_connections(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> Any:
    """List user's connections."""
    query = select(Connection).where(
        or_(
            Connection.user_id == current_user.id,
            Connection.connected_user_id == current_user.id
        )
    ).where(Connection.status == ConnectionStatus.ACCEPTED)
    
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    connections = result.scalars().all()
    
    enriched = []
    for conn in connections:
        other_user_id = conn.connected_user_id if str(conn.user_id) == str(current_user.id) else conn.user_id
        
        user_result = await db.execute(select(User).where(User.id == other_user_id))
        other_user = user_result.scalar_one_or_none()
        
        profile_result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == other_user_id)
        )
        profile = profile_result.scalar_one_or_none()
        
        if other_user:
            enriched.append({
                "id": str(conn.id),
                "user": {
                    "id": str(other_user.id),
                    "name": other_user.full_name,
                    "email": other_user.email,
                    "headline": profile.headline if profile else None,
                    "avatar_url": profile.avatar_url if profile else None,
                },
                "connected_at": conn.connected_at.isoformat(),
            })
    
    return enriched


@router.get("/requests", response_model=List[dict])
async def list_connection_requests(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    type: str = Query("received", regex="^(received|sent)$"),
) -> Any:
    """List pending connection requests."""
    if type == "received":
        query = select(ConnectionRequest).where(
            and_(
                ConnectionRequest.to_user_id == current_user.id,
                ConnectionRequest.status == ConnectionStatus.PENDING
            )
        )
    else:
        query = select(ConnectionRequest).where(
            and_(
                ConnectionRequest.from_user_id == current_user.id,
                ConnectionRequest.status == ConnectionStatus.PENDING
            )
        )
    
    result = await db.execute(query)
    requests = result.scalars().all()
    
    enriched = []
    for req in requests:
        other_user_id = req.from_user_id if type == "received" else req.to_user_id
        
        user_result = await db.execute(select(User).where(User.id == other_user_id))
        other_user = user_result.scalar_one_or_none()
        
        profile_result = await db.execute(
            select(UserProfile).where(UserProfile.user_id == other_user_id)
        )
        profile = profile_result.scalar_one_or_none()
        
        if other_user:
            enriched.append({
                "id": str(req.id),
                "user": {
                    "id": str(other_user.id),
                    "name": other_user.full_name,
                    "headline": profile.headline if profile else None,
                    "avatar_url": profile.avatar_url if profile else None,
                },
                "message": req.message,
                "created_at": req.created_at.isoformat(),
            })
    
    return enriched


@router.post("/requests", status_code=status.HTTP_201_CREATED)
async def send_connection_request(
    request_in: dict,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Send a connection request."""
    to_user_id = request_in.get("user_id")
    
    if str(to_user_id) == str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot connect with yourself"
        )
    
    # Check if already connected
    existing_conn = await db.execute(
        select(Connection).where(
            or_(
                and_(
                    Connection.user_id == current_user.id,
                    Connection.connected_user_id == to_user_id
                ),
                and_(
                    Connection.user_id == to_user_id,
                    Connection.connected_user_id == current_user.id
                )
            )
        )
    )
    if existing_conn.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already connected"
        )
    
    # Check if request already exists
    existing_req = await db.execute(
        select(ConnectionRequest).where(
            and_(
                ConnectionRequest.from_user_id == current_user.id,
                ConnectionRequest.to_user_id == to_user_id,
                ConnectionRequest.status == ConnectionStatus.PENDING
            )
        )
    )
    if existing_req.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request already sent"
        )
    
    request = ConnectionRequest(
        from_user_id=current_user.id,
        to_user_id=to_user_id,
        message=request_in.get("message"),
    )
    db.add(request)
    await db.commit()
    
    return {"message": "Connection request sent"}


@router.post("/requests/{request_id}/accept")
async def accept_connection_request(
    request_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Accept a connection request."""
    result = await db.execute(
        select(ConnectionRequest).where(ConnectionRequest.id == request_id)
    )
    request = result.scalar_one_or_none()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    if str(request.to_user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    # Update request
    request.status = ConnectionStatus.ACCEPTED
    request.responded_at = datetime.utcnow()
    
    # Create connection
    connection = Connection(
        user_id=request.from_user_id,
        connected_user_id=request.to_user_id,
        connected_at=datetime.utcnow(),
    )
    db.add(connection)
    
    # Update connection counts
    from_profile = await db.execute(
        select(UserProfile).where(UserProfile.user_id == request.from_user_id)
    )
    to_profile = await db.execute(
        select(UserProfile).where(UserProfile.user_id == request.to_user_id)
    )
    
    from_p = from_profile.scalar_one_or_none()
    to_p = to_profile.scalar_one_or_none()
    
    if from_p:
        from_p.connections_count += 1
    if to_p:
        to_p.connections_count += 1
    
    await db.commit()
    
    return {"message": "Connection accepted"}


@router.post("/requests/{request_id}/decline")
async def decline_connection_request(
    request_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Decline a connection request."""
    result = await db.execute(
        select(ConnectionRequest).where(ConnectionRequest.id == request_id)
    )
    request = result.scalar_one_or_none()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    
    if str(request.to_user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    request.status = ConnectionStatus.DECLINED
    request.responded_at = datetime.utcnow()
    
    await db.commit()
    
    return {"message": "Connection request declined"}


@router.delete("/connections/{connection_id}")
async def remove_connection(
    connection_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Remove a connection."""
    result = await db.execute(
        select(Connection).where(Connection.id == connection_id)
    )
    connection = result.scalar_one_or_none()
    
    if not connection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Connection not found"
        )
    
    if str(connection.user_id) != str(current_user.id) and \
       str(connection.connected_user_id) != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    await db.delete(connection)
    await db.commit()
    
    return {"message": "Connection removed"}

