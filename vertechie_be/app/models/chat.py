"""
Chat and Messaging models.
"""

from datetime import datetime
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, JSON, ForeignKey, Integer
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class ConversationType(str, enum.Enum):
    DIRECT = "direct"
    GROUP = "group"
    CHANNEL = "channel"


class MessageType(str, enum.Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    GIF = "gif"
    POLL = "poll"
    SYSTEM = "system"


class Conversation(Base, UUIDMixin, TimestampMixin):
    """Chat conversation/room."""
    
    __tablename__ = "conversation"
    
    conversation_type = Column(Enum(ConversationType), default=ConversationType.DIRECT)
    
    # For group/channel
    name = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Created by
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)
    
    # Settings
    is_archived = Column(Boolean, default=False)
    is_muted = Column(Boolean, default=False)
    
    # Stats
    member_count = Column(Integer, default=0)
    message_count = Column(Integer, default=0)
    
    last_message_at = Column(DateTime, nullable=True)
    last_message_preview = Column(String(200), nullable=True)
    
    # Relationships
    members = relationship("ChatMember", back_populates="conversation")
    messages = relationship("Message", back_populates="conversation", order_by="Message.created_at")


class ChatMember(Base, UUIDMixin, TimestampMixin):
    """Chat conversation members."""
    
    __tablename__ = "chatmember"
    
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversation.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    
    # Role
    role = Column(String(20), default="member")  # admin, moderator, member
    
    # Settings
    is_muted = Column(Boolean, default=False)
    notifications_enabled = Column(Boolean, default=True)
    
    # Status
    last_read_at = Column(DateTime, nullable=True)
    unread_count = Column(Integer, default=0)
    
    # Joined
    joined_at = Column(DateTime, default=datetime.utcnow)
    invited_by_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="members")


class Message(Base, UUIDMixin, TimestampMixin):
    """Chat messages."""
    
    __tablename__ = "message"
    
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversation.id"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    
    message_type = Column(Enum(MessageType), default=MessageType.TEXT)
    
    # Content
    content = Column(Text, nullable=True)
    
    # Media
    media_url = Column(String(500), nullable=True)
    media_type = Column(String(50), nullable=True)
    media_metadata = Column(JSON, default=dict)
    
    # Reply
    reply_to_id = Column(UUID(as_uuid=True), ForeignKey("message.id"), nullable=True)
    
    # Reactions
    reactions = Column(JSON, default=dict)  # {"👍": ["user_id1", "user_id2"], ...}
    
    # Poll
    poll_data = Column(JSON, nullable=True)
    
    # Edit/Delete
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime, nullable=True)
    
    # Read status
    read_by = Column(ARRAY(String), default=list)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")

