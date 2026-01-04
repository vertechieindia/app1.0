"""
Job-related schemas.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime

from app.schemas.common import BaseSchema, TimestampSchema


class JobCreate(BaseModel):
    """Schema for creating a job posting."""
    title: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=50)
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    
    company_name: str = Field(..., max_length=200)
    company_logo: Optional[str] = None
    
    location: Optional[str] = Field(None, max_length=200)
    is_remote: bool = False
    remote_type: Optional[str] = None
    
    job_type: str = "full_time"
    experience_level: str = "mid"
    department: Optional[str] = None
    
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    show_salary: bool = True
    
    application_email: Optional[str] = None
    application_url: Optional[str] = None
    easy_apply: bool = True
    
    expires_at: Optional[datetime] = None


class JobUpdate(BaseModel):
    """Schema for updating a job posting."""
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    description: Optional[str] = None
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    
    location: Optional[str] = None
    is_remote: Optional[bool] = None
    
    job_type: Optional[str] = None
    experience_level: Optional[str] = None
    
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    show_salary: Optional[bool] = None
    
    status: Optional[str] = None
    is_featured: Optional[bool] = None


class JobResponse(TimestampSchema):
    """Job response schema."""
    id: str
    title: str
    slug: str
    description: str
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    benefits: Optional[str] = None
    
    company_name: str
    company_logo: Optional[str] = None
    
    location: Optional[str] = None
    is_remote: bool
    remote_type: Optional[str] = None
    
    job_type: str
    experience_level: str
    department: Optional[str] = None
    
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str
    show_salary: bool
    
    status: str
    is_featured: bool
    
    views_count: int
    applications_count: int
    
    expires_at: Optional[datetime] = None


class JobListResponse(BaseSchema):
    """Job list item (summarized)."""
    id: str
    title: str
    slug: str
    company_name: str
    company_logo: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool
    job_type: str
    experience_level: str
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str
    show_salary: bool
    is_featured: bool
    applications_count: int
    created_at: datetime


class JobApplicationCreate(BaseModel):
    """Schema for applying to a job."""
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    answers: Optional[dict] = None
    source: Optional[str] = None


class JobApplicationResponse(TimestampSchema):
    """Job application response."""
    id: str
    job_id: str
    applicant_id: str
    status: str
    cover_letter: Optional[str] = None
    resume_url: Optional[str] = None
    recruiter_notes: Optional[str] = None
    rating: Optional[int] = None
    interview_scheduled_at: Optional[datetime] = None

