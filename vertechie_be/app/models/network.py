"""
Networking and Connections models.
"""

from datetime import datetime
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base, TimestampMixin, UUIDMixin


class ConnectionStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    BLOCKED = "blocked"


class Connection(Base, UUIDMixin, TimestampMixin):
    """User connections (like LinkedIn connections)."""
    
    __tablename__ = "connection"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    connected_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    status = Column(Enum(ConnectionStatus), default=ConnectionStatus.ACCEPTED)
    
    connected_at = Column(DateTime, default=datetime.utcnow)
    
    # How they know each other
    relationship_type = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)


class ConnectionRequest(Base, UUIDMixin, TimestampMixin):
    """Connection requests."""
    
    __tablename__ = "connectionrequest"
    
    from_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    to_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    status = Column(Enum(ConnectionStatus), default=ConnectionStatus.PENDING)
    
    # Request message
    message = Column(Text, nullable=True)
    
    # Response
    responded_at = Column(DateTime, nullable=True)

