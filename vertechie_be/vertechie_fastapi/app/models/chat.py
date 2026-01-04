"""
Chat and Messaging models.
"""

from datetime import datetime
from typing import Optional
import uuid
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum,
    Text, JSON, ForeignKey, Integer
)
from app.db.types import GUID
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
    VIDEO = "video"
    AUDIO = "audio"
    GIF = "gif"
    POLL = "poll"
    SYSTEM = "system"


class MemberRole(str, enum.Enum):
    MEMBER = "member"
    ADMIN = "admin"
    OWNER = "owner"


class Conversation(Base, UUIDMixin, TimestampMixin):
    """Chat conversation/room."""
    
    __tablename__ = "conversations"
    
    # Type
    conversation_type = Column(Enum(ConversationType), default=ConversationType.DIRECT)
    
    # For group chats
    name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    
    # Settings
    is_muted_by_default = Column(Boolean, default=False)
    
    # Stats
    message_count = Column(Integer, default=0)
    member_count = Column(Integer, default=0)
    
    # Last activity
    last_message_at = Column(DateTime, nullable=True)
    last_message_preview = Column(String(200), nullable=True)
    
    # Relationships
    members = relationship("ChatMember", back_populates="conversation")
    messages = relationship("Message", back_populates="conversation", order_by="Message.created_at.desc()")


class ChatMember(Base, UUIDMixin, TimestampMixin):
    """Conversation member."""
    
    __tablename__ = "chat_members"
    
    conversation_id = Column(GUID(), ForeignKey("conversations.id"), nullable=False)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    
    # Role
    role = Column(Enum(MemberRole), default=MemberRole.MEMBER)
    
    # Nickname in this chat
    nickname = Column(String(50), nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Notifications
    is_muted = Column(Boolean, default=False)
    muted_until = Column(DateTime, nullable=True)
    
    # Read status
    last_read_at = Column(DateTime, nullable=True)
    last_read_message_id = Column(GUID(), nullable=True)
    unread_count = Column(Integer, default=0)
    
    # Timestamps
    joined_at = Column(DateTime, default=datetime.utcnow)
    left_at = Column(DateTime, nullable=True)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="members")
    user = relationship("User", backref="chat_memberships")


class Message(Base, UUIDMixin, TimestampMixin):
    """Chat message."""
    
    __tablename__ = "messages"
    
    conversation_id = Column(GUID(), ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    
    # Message type
    message_type = Column(Enum(MessageType), default=MessageType.TEXT)
    
    # Content
    content = Column(Text, nullable=True)
    
    # Media
    media_url = Column(String(500), nullable=True)
    media_type = Column(String(50), nullable=True)
    media_name = Column(String(200), nullable=True)
    media_size = Column(Integer, nullable=True)
    
    # Poll data
    poll_data = Column(JSON, nullable=True)  # {question, options[], votes{}}
    
    # Reply to
    reply_to_id = Column(GUID(), ForeignKey("messages.id"), nullable=True)
    
    # Forward
    forwarded_from_id = Column(GUID(), ForeignKey("messages.id"), nullable=True)
    
    # Reactions
    reactions = Column(JSON, default=dict)  # {emoji: [user_ids]}
    
    # Edit
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    original_content = Column(Text, nullable=True)
    
    # Delete
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime, nullable=True)
    deleted_for_everyone = Column(Boolean, default=False)
    
    # Read status
    read_by = Column(JSON, default=list)
    
    # Mentions
    mentions = Column(JSON, default=list)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_messages")
    reply_to = relationship("Message", remote_side="Message.id", foreign_keys=[reply_to_id])

