"""
Lesson and Module models.
"""

from datetime import datetime
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, JSON, ForeignKey, Integer, Numeric
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class LessonType(str, enum.Enum):
    VIDEO = "video"
    ARTICLE = "article"
    INTERACTIVE = "interactive"
    QUIZ = "quiz"
    PROJECT = "project"
    ASSIGNMENT = "assignment"
    RESOURCE = "resource"


class ProgressStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Module(Base, UUIDMixin, TimestampMixin):
    """Course module/section."""
    
    __tablename__ = "module"
    
    course_id = Column(UUID(as_uuid=True), ForeignKey("course.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    is_free_preview = Column(Boolean, default=False)
    estimated_hours = Column(Numeric(5, 2), default=0)
    
    # Relationships
    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", order_by="Lesson.order")


class Lesson(Base, UUIDMixin, TimestampMixin):
    """Individual lesson."""
    
    __tablename__ = "lesson"
    
    module_id = Column(UUID(as_uuid=True), ForeignKey("module.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    slug = Column(String(250), index=True)
    description = Column(Text, nullable=True)
    lesson_type = Column(Enum(LessonType), default=LessonType.ARTICLE)
    order = Column(Integer, default=0)
    
    # Content
    content_html = Column(Text, nullable=True)
    content_markdown = Column(Text, nullable=True)
    
    # Duration
    estimated_minutes = Column(Integer, default=10)
    
    # Settings
    is_free_preview = Column(Boolean, default=False)
    is_required = Column(Boolean, default=True)
    allows_discussion = Column(Boolean, default=True)
    
    # Code Exercise
    initial_code = Column(Text, nullable=True)
    solution_code = Column(Text, nullable=True)
    test_code = Column(Text, nullable=True)
    language = Column(String(50), nullable=True)
    
    # Video
    video_url = Column(String(500), nullable=True)
    video_duration_seconds = Column(Integer, default=0)
    
    # Relationships
    module = relationship("Module", back_populates="lessons")
    progress = relationship("LessonProgress", back_populates="lesson")


class LessonProgress(Base, UUIDMixin, TimestampMixin):
    """User progress on lessons."""
    
    __tablename__ = "lessonprogress"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lesson.id"), nullable=False)
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("courseenrollment.id"), nullable=False)
    
    status = Column(Enum(ProgressStatus), default=ProgressStatus.NOT_STARTED)
    progress_percentage = Column(Numeric(5, 2), default=0)
    
    # Video progress
    video_watched_seconds = Column(Integer, default=0)
    video_total_seconds = Column(Integer, default=0)
    
    # Code exercise
    code_submitted = Column(Text, nullable=True)
    code_passed = Column(Boolean, nullable=True)
    
    # Timing
    time_spent_seconds = Column(Integer, default=0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, default=datetime.utcnow)
    
    # Notes
    notes = Column(Text, nullable=True)
    bookmarked = Column(Boolean, default=False)
    
    # Relationships
    lesson = relationship("Lesson", back_populates="progress")

