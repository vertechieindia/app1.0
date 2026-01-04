"""
Course and Learning models.
"""

from datetime import datetime
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, JSON, ForeignKey, Integer, Numeric
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class CourseType(str, enum.Enum):
    COURSE = "course"
    PATH = "path"
    SKILL_PATH = "skill_path"
    CERTIFICATION = "certification"
    BOOTCAMP = "bootcamp"


class EnrollmentStatus(str, enum.Enum):
    ENROLLED = "enrolled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PAUSED = "paused"
    DROPPED = "dropped"


class CourseCategory(Base, UUIDMixin, TimestampMixin):
    """Course categories."""
    
    __tablename__ = "coursecategory"
    
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)
    color = Column(String(7), default="#0d47a1")
    
    parent_id = Column(UUID(as_uuid=True), ForeignKey("coursecategory.id"), nullable=True)
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    courses = relationship("Course", back_populates="category")


class Course(Base, UUIDMixin, TimestampMixin):
    """Course model."""
    
    __tablename__ = "course"
    
    # Basic Info
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, index=True)
    subtitle = Column(String(300), nullable=True)
    description = Column(Text, nullable=False)
    short_description = Column(String(500), nullable=True)
    
    # Categorization
    category_id = Column(UUID(as_uuid=True), ForeignKey("coursecategory.id"), nullable=True)
    tags = Column(ARRAY(String), default=list)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.BEGINNER)
    course_type = Column(Enum(CourseType), default=CourseType.COURSE)
    
    # Media
    thumbnail = Column(String(500), nullable=True)
    cover_image = Column(String(500), nullable=True)
    intro_video = Column(String(500), nullable=True)
    
    # Instructor
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=True)
    
    # Pricing
    is_free = Column(Boolean, default=True)
    price = Column(Numeric(10, 2), default=0)
    discount_price = Column(Numeric(10, 2), nullable=True)
    
    # Duration & Content
    estimated_hours = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    total_quizzes = Column(Integer, default=0)
    total_projects = Column(Integer, default=0)
    
    # Settings
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    allow_certificate = Column(Boolean, default=True)
    requires_sequential = Column(Boolean, default=False)
    
    # SEO
    meta_title = Column(String(60), nullable=True)
    meta_description = Column(String(160), nullable=True)
    
    # Languages
    language = Column(String(10), default="en")
    available_languages = Column(ARRAY(String), default=list)
    
    # Skills
    skills_required = Column(ARRAY(String), default=list)
    skills_gained = Column(ARRAY(String), default=list)
    
    # Stats (denormalized)
    enrollment_count = Column(Integer, default=0)
    completion_count = Column(Integer, default=0)
    average_rating = Column(Numeric(3, 2), default=0)
    total_reviews = Column(Integer, default=0)
    
    # Timestamps
    published_at = Column(DateTime, nullable=True)
    
    # Relationships
    category = relationship("CourseCategory", back_populates="courses")
    modules = relationship("Module", back_populates="course", order_by="Module.order")
    enrollments = relationship("CourseEnrollment", back_populates="course")


class CourseEnrollment(Base, UUIDMixin, TimestampMixin):
    """User enrollment in courses."""
    
    __tablename__ = "courseenrollment"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("course.id"), nullable=False)
    
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.ENROLLED)
    
    # Progress
    progress_percentage = Column(Numeric(5, 2), default=0)
    completed_lessons = Column(Integer, default=0)
    completed_quizzes = Column(Integer, default=0)
    
    # Payment
    is_paid = Column(Boolean, default=False)
    payment_amount = Column(Numeric(10, 2), default=0)
    payment_date = Column(DateTime, nullable=True)
    
    # Timestamps
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, nullable=True)
    
    # Certificate
    certificate_issued = Column(Boolean, default=False)
    certificate_issued_at = Column(DateTime, nullable=True)
    
    # Relationships
    course = relationship("Course", back_populates="enrollments")

