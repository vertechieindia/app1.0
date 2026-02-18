"""
User Activity and XP Tracking Models
"""

import enum
from sqlalchemy import Column, String, ForeignKey, DateTime, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.db.base import Base

class ActivityType(str, enum.Enum):
    LOGIN = "login"
    PRACTICE = "practice"
    LEARN = "learn"
    POST = "post"
    COMMENT = "comment"
    QUIZ = "quiz"
    PROJECT = "project"
    INTERVIEW = "interview"
    COURSE_COMPLETION = "course_completion"

class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    # Keep as string for cross-database compatibility and easier enum evolution.
    activity_type = Column(String(50), nullable=False, index=True)
    
    # Optional context (e.g., {"course_id": "...", "points": 50})
    data = Column(JSON, default=dict)
    
    # XP earned for this specific activity
    xp_earned = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
