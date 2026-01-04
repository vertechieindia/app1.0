"""
Chat and Messaging schemas.
"""

from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class ConversationCreate(BaseModel):
    """Create conversation."""
    
    conversation_type: str = "direct"
    name: Optional[str] = None
    description: Optional[str] = None
    member_ids: List[UUID] = []


class ConversationResponse(BaseModel):
    """Conversation response."""
    
    id: UUID
    conversation_type: str
    name: Optional[str] = None
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    message_count: int = 0
    member_count: int = 0
    last_message_at: Optional[datetime] = None
    last_message_preview: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


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


class MessageReaction(BaseModel):
    """Add reaction to message."""
    
    reaction_type: str = "like"  # emoji


class MessageEdit(BaseModel):
    """Edit message."""
    
    content: str

