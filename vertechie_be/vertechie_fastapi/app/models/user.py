"""
User and Authentication models.
Migrated from Django v_auth
"""

from datetime import datetime
from typing import Optional, List
import uuid

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, Date,
    Text, JSON, ForeignKey, Table, Integer, Float
)
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin
from sqlalchemy.dialects.postgresql import UUID, ARRAY

import enum


class RoleType(str, enum.Enum):
    """User role types."""
    TECHIE = "techie"
    HIRING_MANAGER = "hiring_manager"
    COMPANY_ADMIN = "company_admin"
    SCHOOL_ADMIN = "school_admin"
    SUPER_ADMIN = "super_admin"
    BDM_ADMIN = "bdm_admin"


class AdminRole(str, enum.Enum):
    """Admin role types."""
    SUPERADMIN = "superadmin"
    COMPANY_ADMIN = "company_admin"
    HM_ADMIN = "hm_admin"
    TECHIE_ADMIN = "techie_admin"
    SCHOOL_ADMIN = "school_admin"
    BDM_ADMIN = "bdm_admin"


class VerificationStatus(str, enum.Enum):
    """User verification status for admin review workflow."""
    PENDING = "PENDING"           # Submitted, awaiting admin review
    UNDER_REVIEW = "UNDER_REVIEW" # Admin is currently reviewing
    APPROVED = "APPROVED"         # Admin approved the profile
    REJECTED = "REJECTED"         # Admin rejected the profile
    RESUBMITTED = "RESUBMITTED"   # User resubmitted after rejection


# Association table for user roles
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True),
    Column("role_id", UUID(as_uuid=True), ForeignKey("user_role.id"), primary_key=True),
)


class User(Base, UUIDMixin, TimestampMixin):
    """User model for authentication."""
    
    __tablename__ = "users"
    
    # Basic Info
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # Profile
    first_name = Column(String(100), nullable=True)
    middle_name = Column(String(150), nullable=True)
    last_name = Column(String(100), nullable=True)
    username = Column(String(50), unique=True, index=True, nullable=True)
    phone = Column(String(20), nullable=True)
    mobile_number = Column(String(20), nullable=True)
    
    # Identity
    vertechie_id = Column(String(50), unique=True, nullable=True, index=True)
    dob = Column(Date, nullable=True)
    country = Column(String(50), nullable=True)
    gov_id = Column(String(50), nullable=True)  # Up to 50 characters
    address = Column(Text, nullable=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    email_verified = Column(Boolean, default=False)
    mobile_verified = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)
    
    # Admin Review Workflow - PostgreSQL ENUM type
    verification_status = Column(
        Enum(VerificationStatus, name="verificationstatus", create_type=False),
        default=VerificationStatus.PENDING,
        nullable=True,
    )
    reviewed_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)  # Internal notes for admin
    
    # Blocked profile
    is_blocked = Column(Boolean, default=False)
    blocked_at = Column(DateTime, nullable=True)
    blocked_reason = Column(Text, nullable=True)
    blocked_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Face verification
    face_verification = Column(JSON, nullable=True)
    
    # Admin roles (supports multiple)
    admin_roles = Column(JSON, default=list)
    
    # OAuth
    oauth_provider = Column(String(50), nullable=True)
    oauth_id = Column(String(255), nullable=True)
    
    # Timestamps
    last_login = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    # Relationships with CASCADE DELETE - when user is deleted, all related data is deleted
    roles = relationship("UserRole", secondary=user_roles, back_populates="users")
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    experiences = relationship("Experience", back_populates="user", foreign_keys="[Experience.user_id]", cascade="all, delete-orphan")
    educations = relationship("Education", back_populates="user", foreign_keys="[Education.user_id]", cascade="all, delete-orphan")
    
    @property
    def full_name(self) -> str:
        """Get full name."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.first_name or self.last_name or self.email.split("@")[0]


class UserRole(Base, UUIDMixin, TimestampMixin):
    """User role model."""
    
    __tablename__ = "user_role"
    
    name = Column(String(50), unique=True, nullable=False)
    role_type = Column(Enum(RoleType), nullable=False)
    description = Column(Text, nullable=True)
    permissions = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    users = relationship("User", secondary=user_roles, back_populates="roles")


class UserProfile(Base, UUIDMixin, TimestampMixin):
    """Extended user profile for techies."""
    
    __tablename__ = "user_profile"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    
    # Professional Info
    headline = Column(String(200), nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String(200), nullable=True)
    website = Column(String(255), nullable=True)
    
    # Media
    avatar_url = Column(String(500), nullable=True)
    cover_url = Column(String(500), nullable=True)
    
    # Skills & Experience
    skills = Column(JSON, default=list)
    experience_years = Column(Integer, default=0)
    current_position = Column(String(200), nullable=True)
    current_company = Column(String(200), nullable=True)
    
    # Social Links
    linkedin_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    gitlab_url = Column(String(255), nullable=True)
    twitter_url = Column(String(255), nullable=True)
    portfolio_url = Column(String(255), nullable=True)

    # GitHub OAuth - stores encrypted access token for GraphQL API access
    github_access_token = Column(String(500), nullable=True)  # Encrypted token
    github_username = Column(String(255), nullable=True)  # GitHub username from OAuth
    github_user_id = Column(String(50), nullable=True)  # GitHub user ID for verification
    github_connected_at = Column(DateTime, nullable=True)  # When OAuth was completed

    # GitLab OAuth - same pattern as GitHub
    gitlab_access_token = Column(String(500), nullable=True)
    gitlab_username = Column(String(255), nullable=True)
    gitlab_user_id = Column(String(50), nullable=True)
    gitlab_connected_at = Column(DateTime, nullable=True)
    
    # Preferences
    open_to_work = Column(Boolean, default=False)
    preferred_job_types = Column(JSON, default=list)
    preferred_locations = Column(JSON, default=list)
    salary_expectation = Column(JSON, nullable=True)
    
    # Stats (denormalized)
    connections_count = Column(Integer, default=0)
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_count = Column(Integer, default=0)
    karma_points = Column(Integer, default=0)
    
    # Relationships
    user = relationship("User", back_populates="profile")


class EmploymentType(str, enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    FREELANCE = "freelance"


class Experience(Base, UUIDMixin, TimestampMixin):
    """Work experience."""
    
    __tablename__ = "experiences"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Job Details
    title = Column(String(200), nullable=False)
    company_name = Column(String(200), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True)
    
    employment_type = Column(Enum(EmploymentType))
    
    # Location
    location = Column(String(200), nullable=True)
    is_remote = Column(Boolean, default=False)
    
    # Duration
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    is_current = Column(Boolean, default=False)
    
    # Description
    description = Column(Text, nullable=True)
    skills = Column(JSON, default=list)
    
    # Client & Manager Info (from signup)
    client_name = Column(String(200), nullable=True)
    company_website = Column(String(255), nullable=True)
    manager_name = Column(String(100), nullable=True)
    manager_email = Column(String(255), nullable=True)
    manager_phone = Column(String(20), nullable=True)
    manager_linkedin = Column(String(512), nullable=True)
    
    # Verification
    is_verified = Column(Boolean, default=False)
    verified_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="experiences", foreign_keys=[user_id])


class Education(Base, UUIDMixin, TimestampMixin):
    """Educational background."""
    
    __tablename__ = "educations"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # School Info
    school_name = Column(String(200), nullable=False)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"), nullable=True)
    
    # Degree
    degree = Column(String(100), nullable=True)  # Bachelor's, Master's, etc.
    field_of_study = Column(String(200), nullable=True)
    
    # Duration
    start_year = Column(Integer, nullable=True)
    end_year = Column(Integer, nullable=True)
    
    # Details
    grade = Column(String(50), nullable=True)
    score_type = Column(String(20), nullable=True)   # cgpa | percentage | grade
    score_value = Column(String(50), nullable=True)  # raw value as entered by user
    activities = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    
    # Verification
    is_verified = Column(Boolean, default=False)
    verified_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="educations", foreign_keys=[user_id])


class OTP(Base, UUIDMixin):
    """OTP for email/mobile verification."""
    
    __tablename__ = "otps"
    
    target = Column(String(255), nullable=False)  # email or mobile number
    target_type = Column(String(10), nullable=False)  # email or mobile
    otp_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)


class BlockedProfileHistory(Base, UUIDMixin):
    """History of blocked profiles."""
    
    __tablename__ = "blocked_profile_history"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    blocked_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    action = Column(String(20), nullable=False)  # blocked, unblocked
    reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class ProfileReviewHistory(Base, UUIDMixin):
    """History of admin profile reviews for techies."""
    
    __tablename__ = "profile_review_history"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Review action (PostgreSQL ENUM verificationstatus)
    _vs_enum = Enum(VerificationStatus, name="verificationstatus", create_type=False)
    previous_status = Column(_vs_enum, nullable=True)
    new_status = Column(_vs_enum, nullable=False)
    
    # Review details
    action = Column(String(50), nullable=False)  # approved, rejected, requested_changes
    reason = Column(Text, nullable=True)  # Required for rejection
    admin_notes = Column(Text, nullable=True)  # Internal admin notes
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="review_history")
    reviewer = relationship("User", foreign_keys=[reviewer_id])

