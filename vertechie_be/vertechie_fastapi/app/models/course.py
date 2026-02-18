"""
Course and Learning models.
"""

from datetime import datetime
from typing import Optional
import uuid
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, Date,
    Text, JSON, ForeignKey, Integer, Float
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class EnrollmentStatus(str, enum.Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    DROPPED = "dropped"
    PAUSED = "paused"


class CourseCategory(Base, UUIDMixin, TimestampMixin):
    """Course category model."""
    
    __tablename__ = "course_categories"
    
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, index=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)
    color = Column(String(20), nullable=True)
    
    parent_id = Column(UUID(as_uuid=True), ForeignKey("course_categories.id"), nullable=True)
    order = Column(Integer, default=0)
    
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Stats
    courses_count = Column(Integer, default=0)
    
    # Relationships
    courses = relationship("Course", back_populates="category")
    parent = relationship("CourseCategory", remote_side="CourseCategory.id")


class Course(Base, UUIDMixin, TimestampMixin):
    """Course model."""
    
    __tablename__ = "courses"
    
    # Basic Info
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, index=True)
    description = Column(Text, nullable=False)
    short_description = Column(String(500), nullable=True)
    
    # Media
    thumbnail = Column(String(500), nullable=True)
    preview_video = Column(String(500), nullable=True)
    
    # Category
    category_id = Column(UUID(as_uuid=True), ForeignKey("course_categories.id"), nullable=True)
    
    # Instructor
    instructor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Details
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.BEGINNER)
    language = Column(String(50), default="English")
    
    # Duration
    estimated_hours = Column(Float, default=0)
    total_lessons = Column(Integer, default=0)
    total_quizzes = Column(Integer, default=0)
    
    # Pricing
    is_free = Column(Boolean, default=True)
    price = Column(Float, default=0)
    currency = Column(String(3), default="USD")
    discount_price = Column(Float, nullable=True)
    
    # Requirements
    prerequisites = Column(JSON, default=list)
    target_audience = Column(JSON, default=list)
    learning_outcomes = Column(JSON, default=list)
    
    # Status
    is_published = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    is_certified = Column(Boolean, default=False)
    
    # Stats (denormalized)
    enrollment_count = Column(Integer, default=0)
    rating = Column(Float, default=0)
    reviews_count = Column(Integer, default=0)
    completion_rate = Column(Float, default=0)
    
    # SEO
    meta_title = Column(String(200), nullable=True)
    meta_description = Column(String(500), nullable=True)
    tags = Column(JSON, default=list)
    
    # Timestamps
    published_at = Column(DateTime, nullable=True)
    
    # Relationships
    category = relationship("CourseCategory", back_populates="courses")
    instructor = relationship("User", backref="courses_taught")
    modules = relationship("Module", back_populates="course", order_by="Module.order")
    enrollments = relationship("CourseEnrollment", back_populates="course")


class CourseEnrollment(Base, UUIDMixin, TimestampMixin):
    """Course enrollment model."""
    
    __tablename__ = "course_enrollments"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    
    # Status
    status = Column(Enum(EnrollmentStatus), default=EnrollmentStatus.ACTIVE)
    
    # Progress
    progress_percentage = Column(Float, default=0)
    completed_lessons = Column(Integer, default=0)
    current_lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id"), nullable=True)
    
    # Payment
    is_paid = Column(Boolean, default=False)
    payment_amount = Column(Float, default=0)
    payment_id = Column(String(100), nullable=True)
    
    # Certificate
    certificate_issued = Column(Boolean, default=False)
    certificate_url = Column(String(500), nullable=True)
    certificate_issued_at = Column(DateTime, nullable=True)
    
    # Timestamps
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", backref="enrollments")
    course = relationship("Course", back_populates="enrollments")


class CourseCertificate(Base, UUIDMixin, TimestampMixin):
    """
    Certificates issued to users upon course completion.
    """
    __tablename__ = "course_certificates"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=False)
    
    certificate_number = Column(String(50), unique=True, index=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    
    # URL to the generated certificate (PDF or Image)
    file_url = Column(String(500), nullable=True)
    
    # Verification metadata
    verification_code = Column(String(20), unique=True)
    
    # Relationships
    user = relationship("User", backref="course_certificates")
    course = relationship("Course", backref="certificates")

