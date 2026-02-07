"""
School Models for FastAPI
Migrated from Django v_auth and v_school
"""

from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float, DateTime, 
    ForeignKey, JSON, Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.base import Base


class SchoolType(str, enum.Enum):
    UNIVERSITY = "university"
    COLLEGE = "college"
    BOOTCAMP = "bootcamp"
    TRAINING = "training"
    HIGH_SCHOOL = "high_school"
    ONLINE = "online"


class SchoolStatus(str, enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    SUSPENDED = "suspended"
    INACTIVE = "inactive"


class School(Base):
    """Educational institution model."""
    __tablename__ = "schools"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    name = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    short_name = Column(String(50))  # Abbreviation
    
    school_type = Column(SQLEnum(SchoolType))
    
    # Branding
    logo_url = Column(String(500))
    cover_image_url = Column(String(500))
    primary_color = Column(String(7), default="#3498db")
    
    # Description
    description = Column(Text)
    tagline = Column(String(200))
    
    # Location
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
    
    # Accreditation
    accreditation = Column(JSON, default=list)
    established_year = Column(Integer)
    
    # Stats
    students_count = Column(Integer, default=0)
    alumni_count = Column(Integer, default=0)
    programs_count = Column(Integer, default=0)
    placement_rate = Column(Float)
    
    # Status
    status = Column(SQLEnum(SchoolStatus), default=SchoolStatus.PENDING)
    is_verified = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    # Subscription
    subscription_plan = Column(String(50), default="free")
    subscription_expires_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    departments = relationship("Department", back_populates="school")
    programs = relationship("Program", back_populates="school")
    members = relationship("SchoolMember", back_populates="school")
    admins = relationship("SchoolAdmin", back_populates="school")
    placements = relationship("Placement", back_populates="school")
    batches = relationship("StudentBatch", back_populates="school")


class Department(Base):
    """School departments."""
    __tablename__ = "departments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"))
    
    name = Column(String(200), nullable=False)
    short_name = Column(String(20))
    description = Column(Text)
    
    head_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    students_count = Column(Integer, default=0)
    
    # Relationships
    school = relationship("School", back_populates="departments")
    programs = relationship("Program", back_populates="department")


class ProgramType(str, enum.Enum):
    BACHELORS = "bachelors"
    MASTERS = "masters"
    PHD = "phd"
    DIPLOMA = "diploma"
    CERTIFICATE = "certificate"
    BOOTCAMP = "bootcamp"


class Program(Base):
    """Academic programs."""
    __tablename__ = "programs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    
    name = Column(String(200), nullable=False)
    slug = Column(String(250))
    code = Column(String(20))  # CS, ECE, etc.
    
    program_type = Column(SQLEnum(ProgramType))
    
    description = Column(Text)
    duration_months = Column(Integer)
    
    # Fees
    tuition_fee = Column(Float)
    currency = Column(String(3), default="USD")
    
    # Requirements
    requirements = Column(JSON, default=list)
    
    # Stats
    seats_available = Column(Integer)
    enrolled_count = Column(Integer, default=0)
    
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    school = relationship("School", back_populates="programs")
    department = relationship("Department", back_populates="programs")


class StudentBatch(Base):
    """Student batches/cohorts."""
    __tablename__ = "student_batches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"))
    
    name = Column(String(100), nullable=False)  # "Batch 2024", "Cohort 15"
    start_year = Column(Integer)
    end_year = Column(Integer)
    
    students_count = Column(Integer, default=0)
    
    is_current = Column(Boolean, default=True)
    
    # Relationships
    school = relationship("School", back_populates="batches")


class MemberType(str, enum.Enum):
    CURRENT_STUDENT = "current"
    ALUMNI = "alumni"
    FACULTY = "faculty"


class SchoolMember(Base):
    """School members (students, alumni, faculty)."""
    __tablename__ = "school_members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    member_type = Column(SQLEnum(MemberType))
    student_id = Column(String(50))  # Roll number
    
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    batch_id = Column(UUID(as_uuid=True), ForeignKey("student_batches.id"))
    
    graduation_year = Column(Integer)
    
    is_verified = Column(Boolean, default=False)
    
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    school = relationship("School", back_populates="members")
    user = relationship("User")


class AdminRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    PLACEMENT_HEAD = "placement_head"
    HOD = "hod"
    FACULTY = "faculty"


class SchoolAdmin(Base):
    """School administrators."""
    __tablename__ = "school_admins"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    role = Column(SQLEnum(AdminRole))
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"))
    
    # Permissions
    can_manage_students = Column(Boolean, default=True)
    can_manage_programs = Column(Boolean, default=True)
    can_manage_placements = Column(Boolean, default=True)
    can_manage_admins = Column(Boolean, default=False)
    
    added_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    school = relationship("School", back_populates="admins")
    user = relationship("User")


class Placement(Base):
    """Placement records."""
    __tablename__ = "placements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"))
    
    # Student
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    batch_id = Column(UUID(as_uuid=True), ForeignKey("student_batches.id"))
    
    # Company
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"))
    company_name = Column(String(200))  # Backup if company not in system
    
    # Job
    job_title = Column(String(200))
    job_type = Column(String(50))  # full_time, internship
    
    # Package
    salary = Column(Float)
    currency = Column(String(3), default="USD")
    
    # Dates
    offer_date = Column(DateTime)
    joining_date = Column(DateTime)
    
    is_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    school = relationship("School", back_populates="placements")
    student = relationship("User")


class InviteStatus(str, enum.Enum):
    PENDING = "pending"
    SENT = "sent"
    ACCEPTED = "accepted"
    DECLINED = "declined"


class SchoolInvite(Base):
    """School invites for non-registered users."""
    __tablename__ = "school_invites"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    school_id = Column(UUID(as_uuid=True), ForeignKey("schools.id"))
    
    email = Column(String(255), nullable=False)
    name = Column(String(200))
    
    member_type = Column(SQLEnum(MemberType), default=MemberType.ALUMNI)
    graduation_year = Column(Integer)
    student_id = Column(String(50))
    
    status = Column(SQLEnum(InviteStatus, name="school_invitestatus"), default=InviteStatus.PENDING)
    
    invited_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    sent_at = Column(DateTime)
    
    # Relationships
    school = relationship("School")
    invited_by = relationship("User")


