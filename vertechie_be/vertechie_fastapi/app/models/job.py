"""
Job related models.
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


class JobType(str, enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"
    TEMPORARY = "temporary"


class ExperienceLevel(str, enum.Enum):
    ENTRY = "entry"
    JUNIOR = "junior"
    MID = "mid"
    SENIOR = "senior"
    LEAD = "lead"
    EXECUTIVE = "executive"


class JobStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    PAUSED = "paused"
    CLOSED = "closed"
    ARCHIVED = "archived"


class ApplicationStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    SHORTLISTED = "shortlisted"
    INTERVIEW = "interview"
    OFFERED = "offered"
    HIRED = "hired"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class Job(Base, UUIDMixin, TimestampMixin):
    """Job posting model."""
    
    __tablename__ = "jobs"
    
    # Basic Info
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, index=True)
    description = Column(Text, nullable=False)
    short_description = Column(String(500), nullable=True)
    
    # Company
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True)
    company_name = Column(String(200), nullable=True)  # For external postings
    
    # Posted by
    posted_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Job Details
    job_type = Column(Enum(JobType), default=JobType.FULL_TIME)
    experience_level = Column(Enum(ExperienceLevel), default=ExperienceLevel.MID)
    
    # Location
    location = Column(String(200), nullable=True)
    is_remote = Column(Boolean, default=False)
    remote_type = Column(String(50), nullable=True)  # fully_remote, hybrid, on_site
    
    # Salary
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    salary_currency = Column(String(3), default="INR")
    salary_period = Column(String(20), default="yearly")  # yearly, monthly, hourly
    show_salary = Column(Boolean, default=True)
    
    # Requirements
    skills_required = Column(JSON, default=list)
    skills_preferred = Column(JSON, default=list)
    experience_years_min = Column(Integer, default=0)
    experience_years_max = Column(Integer, nullable=True)
    education_required = Column(String(100), nullable=True)
    
    # Benefits
    benefits = Column(JSON, default=list)
    
    # Status
    status = Column(Enum(JobStatus), default=JobStatus.DRAFT)
    is_featured = Column(Boolean, default=False)
    
    # Visibility
    is_internal = Column(Boolean, default=False)  # Company internal only
    requires_cover_letter = Column(Boolean, default=False)
    
    # Application
    external_apply_url = Column(String(500), nullable=True)
    application_deadline = Column(Date, nullable=True)
    
    # Stats (denormalized)
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    
    # Timestamps
    published_at = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    company = relationship("Company", back_populates="jobs")
    posted_by = relationship("User", backref="posted_jobs")
    applications = relationship("JobApplication", back_populates="job")


class JobApplication(Base, UUIDMixin, TimestampMixin):
    """Job application model."""
    
    __tablename__ = "job_applications"
    
    # References
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    applicant_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Status
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.SUBMITTED)
    
    # Application Content
    cover_letter = Column(Text, nullable=True)
    resume_url = Column(String(500), nullable=True)
    answers = Column(JSON, nullable=True)  # For custom questions
    
    # Additional Info
    expected_salary = Column(Integer, nullable=True)
    available_from = Column(Date, nullable=True)
    referral_source = Column(String(100), nullable=True)
    
    # Review
    reviewed_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)  # 1-5 stars
    
    # Skill Matching
    match_score = Column(Integer, nullable=True)  # Percentage 0-100
    matched_skills = Column(JSON, default=list)  # Skills that matched
    missing_skills = Column(JSON, default=list)  # Required skills applicant lacks
    
    # Timestamps
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    job = relationship("Job", back_populates="applications")
    applicant = relationship("User", foreign_keys=[applicant_id], backref="applications")
    reviewed_by = relationship("User", foreign_keys=[reviewed_by_id])


class SavedJob(Base, UUIDMixin, TimestampMixin):
    """Saved/bookmarked jobs."""
    
    __tablename__ = "saved_jobs"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    
    notes = Column(Text, nullable=True)
    
    # Relationships
    user = relationship("User", backref="saved_jobs")
    job = relationship("Job", backref="saves")

