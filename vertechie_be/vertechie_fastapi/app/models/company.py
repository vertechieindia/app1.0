"""
Company Models for FastAPI
Migrated from Django v_auth and v_company
"""

from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, 
    ForeignKey, JSON, Enum as SQLEnum
)
from app.db.types import GUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.base import Base


class CompanySize(str, enum.Enum):
    STARTUP = "startup"  # 1-10
    SMALL = "small"  # 11-50
    MEDIUM = "medium"  # 51-200
    LARGE = "large"  # 201-1000
    ENTERPRISE = "enterprise"  # 1000+


class CompanyStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    INACTIVE = "inactive"


class Company(Base):
    """Company/Organization model."""
    __tablename__ = "companies"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    name = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    legal_name = Column(String(200))
    
    # Type & Industry
    company_type = Column(String(50))  # public, private, nonprofit
    industry = Column(String(100))
    sub_industry = Column(String(100))
    
    # Size
    company_size = Column(SQLEnum(CompanySize), default=CompanySize.STARTUP)
    employees_count = Column(Integer, default=0)
    
    # Branding
    logo_url = Column(String(500))
    cover_image_url = Column(String(500))
    primary_color = Column(String(7), default="#3498db")
    
    # Description
    description = Column(Text)
    tagline = Column(String(200))
    
    # Location
    headquarters = Column(String(200))
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    
    # Contact
    website = Column(String(500))
    email = Column(String(255))
    phone = Column(String(20))
    
    # Social
    linkedin_url = Column(String(500))
    twitter_url = Column(String(500))
    facebook_url = Column(String(500))
    github_url = Column(String(500))
    
    # Details
    founded_year = Column(Integer)
    funding_stage = Column(String(50))  # seed, series_a, etc.
    total_funding = Column(Float)
    
    # Tech Stack
    tech_stack = Column(JSON, default=list)
    
    # Status
    status = Column(SQLEnum(CompanyStatus), default=CompanyStatus.PENDING)
    is_verified = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    # Subscription
    subscription_plan = Column(String(50), default="free")
    subscription_expires_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    profile = relationship("CompanyProfile", back_populates="company", uselist=False)
    locations = relationship("CompanyLocation", back_populates="company")
    benefits = relationship("CompanyBenefit", back_populates="company")
    photos = relationship("CompanyPhoto", back_populates="company")
    team_members = relationship("CompanyTeamMember", back_populates="company")
    jobs = relationship("Job", back_populates="company")
    admins = relationship("CompanyAdmin", back_populates="company")


class CompanyProfile(Base):
    """Extended company profile for employer branding."""
    __tablename__ = "company_profiles"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    company_id = Column(GUID(), ForeignKey("companies.id"), unique=True)
    
    # Mission & Vision
    mission = Column(Text)
    vision = Column(Text)
    tagline = Column(String(200))
    
    # About
    about = Column(Text)
    history = Column(Text)
    
    # Media
    video_url = Column(String(500))
    banner_image = Column(String(500))
    
    # Tech Stack
    tech_stack = Column(JSON, default=list)
    
    # Work Style
    work_culture = Column(Text)
    work_life_balance = Column(Text)
    remote_policy = Column(String(100))
    
    # Diversity & Inclusion
    diversity_statement = Column(Text)
    diversity_metrics = Column(JSON, default=dict)
    
    # Awards & Recognition
    awards = Column(JSON, default=list)
    
    # Press & Media
    press_mentions = Column(JSON, default=list)
    
    # Custom Sections
    custom_sections = Column(JSON, default=list)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="profile")


class CompanyLocation(Base):
    """Company office locations."""
    __tablename__ = "company_locations"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    company_id = Column(GUID(), ForeignKey("companies.id"))
    
    name = Column(String(100))  # "Headquarters", "Engineering Hub"
    
    # Address
    address_line1 = Column(String(200))
    address_line2 = Column(String(200))
    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))
    postal_code = Column(String(20))
    
    # Coordinates
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Details
    phone = Column(String(20))
    email = Column(String(255))
    
    is_headquarters = Column(Boolean, default=False)
    employees_count = Column(Integer)
    
    # Photos
    photos = Column(JSON, default=list)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="locations")


class BenefitCategory(str, enum.Enum):
    HEALTH = "health"
    FINANCIAL = "financial"
    TIME_OFF = "time_off"
    FAMILY = "family"
    DEVELOPMENT = "development"
    OFFICE = "office"
    REMOTE = "remote"
    OTHER = "other"


class CompanyBenefit(Base):
    """Company benefits and perks."""
    __tablename__ = "company_benefits"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    company_id = Column(GUID(), ForeignKey("companies.id"))
    
    title = Column(String(100), nullable=False)
    description = Column(Text)
    category = Column(SQLEnum(BenefitCategory))
    icon = Column(String(50))
    
    is_featured = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    
    # Relationships
    company = relationship("Company", back_populates="benefits")


class PhotoType(str, enum.Enum):
    OFFICE = "office"
    TEAM = "team"
    EVENT = "event"
    PRODUCT = "product"
    OTHER = "other"


class CompanyPhoto(Base):
    """Company photos/gallery."""
    __tablename__ = "company_photos"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    company_id = Column(GUID(), ForeignKey("companies.id"))
    
    url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500))
    caption = Column(String(200))
    photo_type = Column(SQLEnum(PhotoType), default=PhotoType.OTHER)
    
    order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="photos")


class CompanyTeamMember(Base):
    """Company leadership/team members."""
    __tablename__ = "company_team_members"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    company_id = Column(GUID(), ForeignKey("companies.id"))
    
    name = Column(String(100), nullable=False)
    title = Column(String(100))
    bio = Column(Text)
    photo_url = Column(String(500))
    linkedin_url = Column(String(500))
    twitter_url = Column(String(500))
    
    is_leadership = Column(Boolean, default=False)
    order = Column(Integer, default=0)
    
    # Relationships
    company = relationship("Company", back_populates="team_members")


class CompanyAdmin(Base):
    """Company administrators."""
    __tablename__ = "company_admins"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    company_id = Column(GUID(), ForeignKey("companies.id"))
    user_id = Column(GUID(), ForeignKey("users.id"))
    
    role = Column(String(50))  # owner, admin, hr, recruiter
    
    # Permissions
    can_manage_jobs = Column(Boolean, default=True)
    can_manage_candidates = Column(Boolean, default=True)
    can_manage_team = Column(Boolean, default=False)
    can_manage_billing = Column(Boolean, default=False)
    can_manage_admins = Column(Boolean, default=False)
    
    added_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    company = relationship("Company", back_populates="admins")
    user = relationship("User")


class InviteStatus(str, enum.Enum):
    PENDING = "pending"
    SENT = "sent"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    EXPIRED = "expired"


class CompanyInvite(Base):
    """Company invite requests from users."""
    __tablename__ = "company_invites"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    
    # Company Details
    company_name = Column(String(200), nullable=False)
    address = Column(Text)
    website = Column(String(500))
    
    # Contact Person
    contact_person_name = Column(String(100))
    contact_person_role = Column(String(100))
    
    # Contact Info (JSON arrays)
    emails = Column(JSON, default=list)  # List of email addresses
    phone_numbers = Column(JSON, default=list)  # List of phone numbers
    
    # Status
    status = Column(SQLEnum(InviteStatus), default=InviteStatus.PENDING)
    
    # Who requested
    requested_by_id = Column(GUID(), ForeignKey("users.id"), nullable=True)
    
    # Notes
    admin_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    sent_at = Column(DateTime)  # When invite email was sent
    
    # Relationships
    requested_by = relationship("User", foreign_keys=[requested_by_id])

