"""
Network and Connection schemas.
"""

from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, EmailStr


class ConnectionRequestCreate(BaseModel):
    """Create connection request."""
    
    receiver_id: UUID
    message: Optional[str] = None
    request_type: str = "connect"


class ConnectionRequestResponse(BaseModel):
    """Connection request response."""
    
    id: UUID
    sender_id: UUID
    receiver_id: UUID
    request_type: str
    message: Optional[str] = None
    status: str
    created_at: datetime
    responded_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ConnectionResponse(BaseModel):
    """Connection response."""
    
    id: UUID
    user_id: UUID
    connected_user_id: UUID
    connection_type: str
    status: str
    connected_at: datetime
    
    class Config:
        from_attributes = True


class ConnectionRequestAction(BaseModel):
    """Accept/decline connection request."""
    
    action: str  # accept, decline
    response_message: Optional[str] = None


class FollowCreate(BaseModel):
    """Follow user request."""
    
    user_id: UUID
    notify_on_post: bool = True


class FollowResponse(BaseModel):
    """Follow response."""
    
    id: UUID
    follower_id: UUID
    following_id: UUID
    notify_on_post: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class BlockUserCreate(BaseModel):
    """Block user request."""
    
    user_id: UUID
    reason: Optional[str] = None


class UserNetworkStats(BaseModel):
    """User network statistics."""
    
    connections_count: int = 0
    followers_count: int = 0
    following_count: int = 0
    pending_requests_count: int = 0


class NetworkInviteRequest(BaseModel):
    """Invite users to join VerTechie."""

    emails: List[EmailStr]
    message: Optional[str] = None


class NetworkInviteResponse(BaseModel):
    """Response for sending network invites."""

    total_requested: int
    total_sent: int
    failed_emails: List[str] = []
    message: str

