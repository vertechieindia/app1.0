"""
Chat and Messaging schemas.
"""

from typing import Optional, List, Union
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, field_validator, field_serializer, ConfigDict


class ConversationCreate(BaseModel):
    """Create conversation."""
    
    conversation_type: str = "direct"
    name: Optional[str] = None
    description: Optional[str] = None
    member_ids: List[Union[UUID, str]] = []
    
    @field_validator('member_ids', mode='before')
    @classmethod
    def parse_member_ids(cls, v):
        """Parse member_ids from strings or UUIDs."""
        if isinstance(v, list):
            return [UUID(str(item)) if isinstance(item, str) else item for item in v]
        return v


def _serialize_datetime_utc(dt: Optional[datetime]) -> Optional[str]:
    """Serialize naive datetime as ISO with Z so frontend interprets as UTC."""
    if dt is None:
        return None
    return dt.isoformat() + 'Z' if dt.tzinfo is None else dt.isoformat()


class ConversationMemberSummary(BaseModel):
    """Member row returned with conversation list (includes presence for UI)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    is_active: bool = True
    role: str = ""
    unread_count: int = 0
    is_online: bool = False


class ConversationResponse(BaseModel):
    """Conversation response."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    conversation_type: str
    name: Optional[str] = None
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    message_count: int = 0
    member_count: int = 0
    last_message_at: Optional[datetime] = None
    last_message_preview: Optional[str] = None
    unread_count: int = 0  # Added for unread message tracking
    created_at: datetime
    # Optional client fields (list endpoint)
    type: Optional[str] = None
    is_group: Optional[bool] = None
    # Direct DM: other participant is online; groups: any member online (optional)
    is_online: Optional[bool] = None
    members: Optional[List[ConversationMemberSummary]] = None

    @field_serializer('last_message_at', 'created_at')
    def serialize_datetimes(self, dt: Optional[datetime]) -> Optional[str]:
        return _serialize_datetime_utc(dt)


class MessageCreate(BaseModel):
    """Create message."""
    
    content: Optional[str] = None
    message_type: str = "text"
    
    media_url: Optional[str] = None
    media_type: Optional[str] = None
    media_name: Optional[str] = None
    
    reply_to_id: Optional[UUID] = None
    
    poll_data: Optional[dict] = None
    
    mentions: List[UUID] = []


class MessageResponse(BaseModel):
    """Message response."""
    
    id: UUID
    conversation_id: UUID
    sender_id: UUID
    
    message_type: str
    content: Optional[str] = None
    
    media_url: Optional[str] = None
    media_type: Optional[str] = None
    media_name: Optional[str] = None
    
    poll_data: Optional[dict] = None
    
    reply_to_id: Optional[UUID] = None
    
    reactions: dict = {}
    
    is_edited: bool = False
    is_deleted: bool = False
    
    read_by: List[UUID] = []
    mentions: List[UUID] = []
    
    created_at: datetime

    @field_serializer('created_at')
    def serialize_created_at(self, dt: datetime) -> str:
        """Serialize as ISO with Z so frontend interprets as UTC."""
        if dt.tzinfo is None:
            return dt.isoformat() + 'Z'
        return dt.isoformat()
    
    class Config:
        from_attributes = True


class ChatMemberResponse(BaseModel):
    """Chat member response."""
    
    id: UUID
    conversation_id: UUID
    user_id: UUID
    role: str
    nickname: Optional[str] = None
    is_active: bool
    is_muted: bool
    unread_count: int = 0
    joined_at: datetime
    
    class Config:
        from_attributes = True


class ChatUserCandidateResponse(BaseModel):
    """User candidate for starting a chat (accepted connections only)."""

    id: UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    email: str
    user_type: str = "techie"


class MessageReaction(BaseModel):
    """Add reaction to message."""
    
    reaction_type: str = "like"  # emoji


class MessageEdit(BaseModel):
    """Edit message."""
    
    content: str

