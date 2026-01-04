"""
Module and Lesson models.
"""

from datetime import datetime
from typing import Optional
import uuid
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum,
    Text, JSON, ForeignKey, Integer, Float
)
from app.db.types import GUID
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class LessonType(str, enum.Enum):
    VIDEO = "video"
    ARTICLE = "article"
    QUIZ = "quiz"
    EXERCISE = "exercise"
    PROJECT = "project"
    INTERACTIVE = "interactive"


class LessonStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Module(Base, UUIDMixin, TimestampMixin):
    """Course module model."""
    
    __tablename__ = "modules"
    
    course_id = Column(GUID(), ForeignKey("courses.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    
    # Estimated duration in minutes
    estimated_minutes = Column(Integer, default=0)
    
    is_free_preview = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    
    # Relationships
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", order_by="Lesson.order")


class Lesson(Base, UUIDMixin, TimestampMixin):
    """Lesson model."""
    
    __tablename__ = "lessons"
    
    module_id = Column(GUID(), ForeignKey("modules.id"), nullable=False)
    
    # Basic Info
    title = Column(String(200), nullable=False)
    slug = Column(String(250), index=True)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    
    # Content Type
    lesson_type = Column(Enum(LessonType), default=LessonType.ARTICLE)
    
    # Content
    content_html = Column(Text, nullable=True)
    content_markdown = Column(Text, nullable=True)
    
    # Video
    video_url = Column(String(500), nullable=True)
    video_duration_seconds = Column(Integer, nullable=True)
    video_provider = Column(String(50), nullable=True)  # youtube, vimeo, etc.
    
    # Interactive/Code
    initial_code = Column(Text, nullable=True)
    solution_code = Column(Text, nullable=True)
    language = Column(String(50), nullable=True)
    
    # Duration
    estimated_minutes = Column(Integer, default=5)
    
    # Access
    is_free_preview = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    
    # Attachments
    attachments = Column(JSON, default=list)  # [{name, url, type}]
    
    # Relationships
    module = relationship("Module", back_populates="lessons")
    progress = relationship("LessonProgress", back_populates="lesson")


class LessonProgress(Base, UUIDMixin, TimestampMixin):
    """User progress on a lesson."""
    
    __tablename__ = "lesson_progress"
    
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(GUID(), ForeignKey("lessons.id"), nullable=False)
    enrollment_id = Column(GUID(), ForeignKey("course_enrollments.id"), nullable=True)
    
    # Progress
    status = Column(Enum(LessonStatus), default=LessonStatus.NOT_STARTED)
    progress_percentage = Column(Float, default=0)
    
    # Video Progress
    video_position_seconds = Column(Integer, default=0)
    
    # Code Progress
    user_code = Column(Text, nullable=True)
    
    # Time Spent
    time_spent_seconds = Column(Integer, default=0)
    
    # Timestamps
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", backref="lesson_progress")
    lesson = relationship("Lesson", back_populates="progress")

