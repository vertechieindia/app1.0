"""
Job-related models.
"""

from datetime import datetime
from typing import Optional
import uuid
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, JSON, ForeignKey, Integer, Numeric
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class JobType(str, enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"


class ExperienceLevel(str, enum.Enum):
    ENTRY = "entry"
    JUNIOR = "junior"
    MID = "mid"
    SENIOR = "senior"
    LEAD = "lead"
    MANAGER = "manager"
    DIRECTOR = "director"
    EXECUTIVE = "executive"


class JobStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    CLOSED = "closed"
    FILLED = "filled"


class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    HIRED = "hired"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class Job(Base, UUIDMixin, TimestampMixin):
    """Job posting model."""
    
    __tablename__ = "job"
    
    # Basic Info
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, index=True)
    description = Column(Text, nullable=False)
    requirements = Column(Text, nullable=True)
    responsibilities = Column(Text, nullable=True)
    benefits = Column(Text, nullable=True)
    
    # Company
    company_id = Column(UUID(as_uuid=True), ForeignKey("company.id"), nullable=True)
    company_name = Column(String(200), nullable=False)
    company_logo = Column(String(500), nullable=True)
    
    # Posted by
    posted_by_id = Column(UUID(as_uuid=True), ForeignKey("user.id"))
    
    # Location
    location = Column(String(200), nullable=True)
    is_remote = Column(Boolean, default=False)
    remote_type = Column(String(50), nullable=True)  # fully_remote, hybrid, on_site
    
    # Job Details
    job_type = Column(Enum(JobType), default=JobType.FULL_TIME)
    experience_level = Column(Enum(ExperienceLevel), default=ExperienceLevel.MID)
    department = Column(String(100), nullable=True)
    
    # Skills
    required_skills = Column(ARRAY(String), default=list)
    preferred_skills = Column(ARRAY(String), default=list)
    
    # Salary
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    salary_currency = Column(String(10), default="USD")
    show_salary = Column(Boolean, default=True)
    
    # Status
    status = Column(Enum(JobStatus), default=JobStatus.DRAFT)
    is_featured = Column(Boolean, default=False)
    
    # Application Settings
    application_email = Column(String(255), nullable=True)
    application_url = Column(String(500), nullable=True)
    easy_apply = Column(Boolean, default=True)
    
    # Stats (denormalized)
    views_count = Column(Integer, default=0)
    applications_count = Column(Integer, default=0)
    
    # Expiry
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    applications = relationship("JobApplication", back_populates="job")


class JobApplication(Base, UUIDMixin, TimestampMixin):
    """Job application model."""
    
    __tablename__ = "jobapplication"
    
    job_id = Column(UUID(as_uuid=True), ForeignKey("job.id"), nullable=False)
    applicant_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    
    # Application
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.APPLIED)
    cover_letter = Column(Text, nullable=True)
    resume_url = Column(String(500), nullable=True)
    
    # Additional Info
    answers = Column(JSON, default=dict)  # Answers to custom questions
    source = Column(String(100), nullable=True)  # Where they found the job
    
    # Recruiter Notes
    recruiter_notes = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)  # 1-5 rating
    
    # Interview
    interview_scheduled_at = Column(DateTime, nullable=True)
    interview_notes = Column(Text, nullable=True)
    
    # Relationships
    job = relationship("Job", back_populates="applications")


class SavedJob(Base, UUIDMixin, TimestampMixin):
    """Saved/bookmarked jobs."""
    
    __tablename__ = "savedjob"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    job_id = Column(UUID(as_uuid=True), ForeignKey("job.id"), nullable=False)
    
    # Optional note
    note = Column(Text, nullable=True)

