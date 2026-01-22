"""
Job schemas.
"""

from typing import Optional, List
from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    """Job creation schema."""
    
    title: str = Field(..., max_length=200)
    description: str
    short_description: Optional[str] = None
    
    company_id: Optional[UUID] = None
    company_name: Optional[str] = None
    
    job_type: str = "full_time"
    experience_level: str = "mid"
    
    location: Optional[str] = None
    is_remote: bool = False
    remote_type: Optional[str] = None
    
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    salary_period: str = "yearly"
    show_salary: bool = True
    
    skills_required: List[str] = []
    skills_preferred: List[str] = []
    experience_years_min: int = 0
    experience_years_max: Optional[int] = None
    education_required: Optional[str] = None
    
    benefits: List[str] = []
    
    external_apply_url: Optional[str] = None
    application_deadline: Optional[date] = None
    
    # Allow setting status on creation (default to published for immediate visibility)
    status: str = "published"


class JobUpdate(BaseModel):
    """Job update schema."""
    
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    job_type: Optional[str] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None
    is_remote: Optional[bool] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    skills_required: Optional[List[str]] = None
    skills_preferred: Optional[List[str]] = None
    benefits: Optional[List[str]] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None


class JobResponse(BaseModel):
    """Job response schema."""
    
    id: UUID
    title: str
    slug: str
    description: str
    short_description: Optional[str] = None
    
    company_id: Optional[UUID] = None
    company_name: Optional[str] = None
    posted_by_id: UUID
    
    job_type: str
    experience_level: str
    
    location: Optional[str] = None
    is_remote: bool = False
    
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    show_salary: bool = True
    
    skills_required: List[str] = []
    benefits: List[str] = []
    
    status: str
    is_featured: bool = False
    
    views_count: int = 0
    applications_count: int = 0
    
    published_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class JobApplicationCreate(BaseModel):
    """Job application creation."""
    
    job_id: Optional[UUID] = None  # Optional since job_id comes from URL path
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    answers: Optional[dict] = None  # Must be a dict like {"question_id": "answer"}
    expected_salary: Optional[int] = None
    available_from: Optional[date] = None
    referral_source: Optional[str] = None


class JobApplicationResponse(BaseModel):
    """Job application response."""
    
    id: UUID
    job_id: UUID
    applicant_id: UUID
    status: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    
    # Skill matching fields
    match_score: Optional[int] = None  # Percentage 0-100
    matched_skills: List[str] = []  # Skills that matched
    missing_skills: List[str] = []  # Required skills applicant lacks
    
    class Config:
        from_attributes = True


class ApplicantInfo(BaseModel):
    """Applicant information for job applications."""
    
    id: UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: str
    phone: Optional[str] = None
    mobile_number: Optional[str] = None
    title: Optional[str] = None
    headline: Optional[str] = None
    skills: List[str] = []
    experience_years: Optional[int] = None
    location: Optional[str] = None
    address: Optional[str] = None
    avatar_url: Optional[str] = None
    
    class Config:
        from_attributes = True


class JobApplicationWithApplicant(BaseModel):
    """Job application with full applicant details."""
    
    id: UUID
    job_id: UUID
    applicant_id: UUID
    status: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    answers: Optional[dict] = None
    expected_salary: Optional[int] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    rating: Optional[int] = None
    reviewer_notes: Optional[str] = None
    
    # Skill matching fields
    match_score: Optional[int] = None  # Percentage 0-100
    matched_skills: List[str] = []  # Skills that matched
    missing_skills: List[str] = []  # Required skills applicant lacks
    
    # Nested applicant info
    applicant: Optional[ApplicantInfo] = None
    
    class Config:
        from_attributes = True


class JobSummary(BaseModel):
    """Minimal job info for embedding in applications."""
    
    id: UUID
    title: str
    company_name: str
    location: Optional[str] = None
    job_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    is_remote: bool = False
    
    class Config:
        from_attributes = True


class JobApplicationWithJob(BaseModel):
    """Job application with job details for techie's my-applications view."""
    
    id: UUID
    job_id: UUID
    applicant_id: UUID
    status: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    
    # Nested job info
    job: Optional[JobSummary] = None
    
    class Config:
        from_attributes = True


class SavedJobCreate(BaseModel):
    """Save job request."""
    
    job_id: UUID
    notes: Optional[str] = None

