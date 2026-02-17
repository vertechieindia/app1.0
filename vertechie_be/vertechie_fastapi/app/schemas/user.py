"""
User schemas.
"""

from typing import Optional, List
from datetime import datetime, date
from uuid import UUID
import re
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator


class UserBase(BaseModel):
    """Base user schema."""
    
    email: EmailStr
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    phone: Optional[str] = None
    mobile_number: Optional[str] = None
    dob: Optional[date] = None
    country: Optional[str] = None
    address: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema."""
    
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    """User update schema."""
    
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    phone: Optional[str] = None
    mobile_number: Optional[str] = None
    dob: Optional[date] = None
    country: Optional[str] = None
    address: Optional[str] = None


class UserResponse(UserBase):
    """User response schema."""
    
    id: UUID
    username: Optional[str] = None
    vertechie_id: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    is_superuser: bool = False  # Added for admin routing
    is_staff: Optional[bool] = False  # Added for admin routing (alias for is_superuser in frontend)
    email_verified: Optional[bool] = False
    mobile_verified: Optional[bool] = False
    created_at: Optional[datetime] = None
    # Admin fields
    admin_roles: Optional[List[str]] = []  # List of admin role strings
    date_joined: Optional[datetime] = None  # Alias for created_at for frontend compatibility
    last_login: Optional[datetime] = None  # Last login timestamp
    
    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    """User profile update schema."""
    
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    skills: Optional[List[str]] = None
    experience_years: Optional[int] = None
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    gitlab_url: Optional[str] = None
    github_username: Optional[str] = None
    gitlab_username: Optional[str] = None
    twitter_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    open_to_work: Optional[bool] = None
    preferred_job_types: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None


class UserProfileResponse(BaseModel):
    """User profile response."""
    
    id: UUID
    user_id: UUID
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    skills: List[str] = []
    experience_years: int = 0
    current_position: Optional[str] = None
    current_company: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    gitlab_url: Optional[str] = None
    github_username: Optional[str] = None
    gitlab_username: Optional[str] = None
    twitter_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    open_to_work: bool = False
    connections_count: int = 0
    followers_count: int = 0
    following_count: int = 0
    posts_count: int = 0
    karma_points: int = 0
    
    class Config:
        from_attributes = True


class ExperienceCreate(BaseModel):
    """Experience creation schema."""
    
    title: str
    company_name: str
    company_id: Optional[UUID] = None
    employment_type: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool = False
    start_date: date
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None
    skills: List[str] = []
    client_name: Optional[str] = None
    company_website: Optional[str] = None
    manager_name: Optional[str] = None
    manager_email: Optional[str] = None
    manager_phone: Optional[str] = None
    manager_linkedin: Optional[str] = None


class ExperienceResponse(ExperienceCreate):
    """Experience response schema."""
    
    id: UUID
    user_id: UUID
    is_verified: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class EducationCreate(BaseModel):
    """Education creation schema."""
    
    school_name: str
    school_id: Optional[UUID] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    grade: Optional[str] = None
    score_type: Optional[str] = None  # cgpa | percentage | grade
    score_value: Optional[str] = None
    activities: Optional[str] = None
    description: Optional[str] = None

    @field_validator("score_type")
    @classmethod
    def validate_score_type(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = value.strip().lower()
        if cleaned == "":
            return None
        if cleaned not in {"cgpa", "percentage", "grade"}:
            raise ValueError("score_type must be one of: cgpa, percentage, grade")
        return cleaned

    @model_validator(mode="after")
    def validate_score_fields(self):
        score_type = self.score_type
        score_value = (self.score_value or "").strip()
        legacy_grade = (self.grade or "").strip()

        # Backward compatibility: infer score fields from legacy grade
        if not score_type and not score_value and legacy_grade:
            if re.fullmatch(r"\d+(\.\d+)?", legacy_grade):
                numeric_grade = float(legacy_grade)
                if numeric_grade <= 10:
                    score_type = "cgpa"
                elif numeric_grade <= 100:
                    score_type = "percentage"
                else:
                    score_type = "grade"
            else:
                score_type = "grade"
            score_value = legacy_grade
            self.score_type = score_type
            self.score_value = score_value

        if score_type and not score_value:
            raise ValueError("score_value is required when score_type is provided")
        if score_value and not score_type:
            raise ValueError("score_type is required when score_value is provided")

        if score_type == "cgpa":
            try:
                num = float(score_value)
            except ValueError:
                raise ValueError("score_value must be numeric for cgpa")
            if num < 0 or num > 10:
                raise ValueError("cgpa must be between 0 and 10")

        if score_type == "percentage":
            try:
                num = float(score_value)
            except ValueError:
                raise ValueError("score_value must be numeric for percentage")
            if num < 0 or num > 100:
                raise ValueError("percentage must be between 0 and 100")

        if score_type == "grade" and score_value:
            if not re.fullmatch(r"[A-Za-z][A-Za-z0-9+\-]{0,4}", score_value):
                raise ValueError("grade must be like A, A+, B1, O, etc.")

        # Keep legacy field populated for backward compatibility
        if score_value and not legacy_grade:
            self.grade = score_value
        return self


class EducationResponse(EducationCreate):
    """Education response schema."""
    
    id: UUID
    user_id: UUID
    is_verified: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminExperienceCreate(BaseModel):
    """Experience for admin user creation."""
    client_name: Optional[str] = None
    company_website: Optional[str] = None
    work_location: Optional[str] = None
    job_title: Optional[str] = None
    from_date: Optional[str] = None
    to_date: Optional[str] = None
    skills: Optional[List[str]] = None
    job_description: Optional[str] = None
    manager_name: Optional[str] = None
    manager_email: Optional[str] = None
    manager_phone: Optional[str] = None
    manager_linkedin: Optional[str] = None


class AdminEducationCreate(BaseModel):
    """Education for admin user creation."""
    institution_name: Optional[str] = None
    level_of_education: Optional[str] = None
    field_of_study: Optional[str] = None
    from_date: Optional[str] = None
    to_date: Optional[str] = None
    gpa_score: Optional[str] = None
    score_type: Optional[str] = None
    score_value: Optional[str] = None


class AdminUserCreate(BaseModel):
    """Admin user creation schema - handles all user types."""
    
    # Core fields
    email: EmailStr
    password: str = Field(..., min_length=6)
    
    @field_validator('email', mode='before')
    @classmethod
    def normalize_email(cls, v):
        """Normalize email: strip whitespace, lowercase, and fix common typos."""
        if isinstance(v, str):
            # Strip all whitespace (leading, trailing, and internal)
            v = ''.join(v.split())
            # Lowercase
            v = v.lower()
            # Fix common typo: comma instead of dot after @
            # e.g., "user@domain,com" -> "user@domain.com"
            if '@' in v:
                parts = v.split('@', 1)
                if len(parts) == 2:
                    domain = parts[1]
                    # Replace comma with dot in domain part (common typo)
                    domain = domain.replace(',', '.')
                    v = f"{parts[0]}@{domain}"
        return v
    
    # Name fields - optional for admin users (can be created with just email/password)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    mobile_number: Optional[str] = None
    dob: Optional[str] = None  # Accept string for flexibility
    country: Optional[str] = None
    gov_id: Optional[str] = None
    address: Optional[str] = None
    
    # Role - determines user type
    role: str = "techie"  # techie, hr, company, school, admin
    
    # Admin roles - frontend sends specific admin roles like ["hm_admin", "company_admin"]
    admin_roles: Optional[List[str]] = None
    
    # Techie-specific fields
    work_authorization: Optional[str] = None
    profile: Optional[str] = None  # Profile summary
    experiences: Optional[List[AdminExperienceCreate]] = None
    educations: Optional[List[AdminEducationCreate]] = None
    
    # HR-specific fields
    company_name: Optional[str] = None
    company_email: Optional[str] = None
    company_website: Optional[str] = None
    
    # Company-specific fields
    ein: Optional[str] = None
    cin: Optional[str] = None
    account_number: Optional[str] = None
    reg_state: Optional[str] = None
    started_date: Optional[str] = None
    about: Optional[str] = None
    
    # School-specific fields
    school_name: Optional[str] = None
    est_year: Optional[str] = None
    
    # Verification bypass (admin creates verified users)
    bypass_email_verification: bool = True
    bypass_mobile_verification: bool = True

