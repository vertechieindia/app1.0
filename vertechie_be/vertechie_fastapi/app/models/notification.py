"""
In-App Notification Models
For real-time notifications to users
"""

from sqlalchemy import (
    Column, String, Text, Boolean, DateTime, 
    ForeignKey, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.base import Base


class NotificationType(str, enum.Enum):
    """Types of notifications"""
    INTERVIEW_SCHEDULED = "interview_scheduled"
    INTERVIEW_REMINDER = "interview_reminder"
    INTERVIEW_CANCELLED = "interview_cancelled"
    APPLICATION_STATUS = "application_status"
    APPLICATION_UPDATE = "application_update"
    APPLICATION_SELECTED = "application_selected"
    APPLICATION_REJECTED = "application_rejected"
    JOB_MATCH = "job_match"
    MESSAGE = "message"
    SYSTEM = "system"
    OFFER_RECEIVED = "offer_received"
    PROFILE_VIEW = "profile_view"


class Notification(Base):
    """In-app notifications for users."""
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Who receives the notification
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Notification content
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(SQLEnum(NotificationType), default=NotificationType.SYSTEM)
    
    # Link to related entity (for navigation)
    link = Column(String(500), nullable=True)  # e.g., /techie/my-interviews
    
    # Reference to related entity
    reference_id = Column(UUID(as_uuid=True), nullable=True)  # e.g., interview_id, job_id
    reference_type = Column(String(50), nullable=True)  # e.g., "interview", "job", "application"
    
    # Status
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", backref="notifications")

    def mark_as_read(self):
        """Mark notification as read."""
        self.is_read = True
        self.read_at = datetime.utcnow()
