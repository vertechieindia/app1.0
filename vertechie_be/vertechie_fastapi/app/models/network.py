"""
Network and Connection models.
"""

from datetime import datetime
from typing import Optional
import uuid
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum,
    Text, JSON, ForeignKey, Integer
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class ConnectionStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    BLOCKED = "blocked"
    WITHDRAWN = "withdrawn"


class FollowType(str, enum.Enum):
    FOLLOW = "follow"
    CONNECT = "connect"


class Connection(Base, UUIDMixin, TimestampMixin):
    """User connection (friendship/follow)."""
    
    __tablename__ = "connections"
    
    # User who initiated
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # User being connected to
    connected_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Type
    connection_type = Column(Enum(FollowType), default=FollowType.CONNECT)
    
    # Status
    status = Column(Enum(ConnectionStatus), default=ConnectionStatus.ACCEPTED)
    
    # Timestamps
    connected_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="connections_initiated")
    connected_user = relationship("User", foreign_keys=[connected_user_id], backref="connections_received")


class ConnectionRequest(Base, UUIDMixin, TimestampMixin):
    """Connection request between users."""
    
    __tablename__ = "connection_requests"
    
    # Sender
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Receiver
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Type
    request_type = Column(Enum(FollowType), default=FollowType.CONNECT)
    
    # Message
    message = Column(Text, nullable=True)
    
    # Status
    status = Column(Enum(ConnectionStatus), default=ConnectionStatus.PENDING)
    
    # Response
    responded_at = Column(DateTime, nullable=True)
    response_message = Column(Text, nullable=True)
    
    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_connection_requests")
    receiver = relationship("User", foreign_keys=[receiver_id], backref="received_connection_requests")


class Follow(Base, UUIDMixin, TimestampMixin):
    """Follow relationship (one-way)."""
    
    __tablename__ = "follows"
    
    follower_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    following_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Notifications
    notify_on_post = Column(Boolean, default=True)
    
    # Relationships
    follower = relationship("User", foreign_keys=[follower_id], backref="following")
    following = relationship("User", foreign_keys=[following_id], backref="followers")


class BlockedUser(Base, UUIDMixin, TimestampMixin):
    """Blocked users."""
    
    __tablename__ = "blocked_users"
    
    blocker_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    blocked_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    reason = Column(Text, nullable=True)
    
    # Relationships
    blocker = relationship("User", foreign_keys=[blocker_id], backref="users_blocked")
    blocked = relationship("User", foreign_keys=[blocked_id], backref="blocked_by")

