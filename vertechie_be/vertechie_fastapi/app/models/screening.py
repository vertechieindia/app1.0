"""
Screening workflow models: sourcing requests, screening tasks, invites, HM signatures.
"""

from datetime import datetime
import enum
import uuid

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, Text, JSON, ForeignKey, Integer,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


def _enum(enum_cls):
    """Persist str enum .value labels (matches PostgreSQL lowercase screening enums)."""
    return Enum(enum_cls, values_callable=lambda obj: [e.value for e in obj])


class SourcingPath(str, enum.Enum):
    WITH_REQ_TEAM = "with_req_team"
    DIRECT_SCREENER = "direct_screener"


class SourcingRequestStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    SCREENING = "screening"
    SUBMITTED_TO_HM = "submitted_to_hm"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class RequirementType(str, enum.Enum):
    SOURCE_ONLY = "source_only"
    JOB_LINKED = "job_linked"
    SCREEN_INVITE = "screen_invite"


class ScreeningTaskType(str, enum.Enum):
    RECRUITMENT = "recruitment"
    ENTERPRISE_VERIFICATION = "enterprise_verification"


class ScreeningTaskStatus(str, enum.Enum):
    PENDING_REQ_TEAM = "pending_req_team"
    OPEN = "open"
    CLAIMED = "claimed"
    SELECTED = "selected"
    REJECTED = "rejected"


class ScreeningInviteStatus(str, enum.Enum):
    INVITE_SENT = "invite_sent"
    SIGNUP_STARTED = "signup_started"
    SIGNUP_SUBMITTED = "signup_submitted"
    APPROVED = "approved"
    DENIED = "denied"
    SCREENING_PENDING = "screening_pending"
    SCREENING_SELECTED = "screening_selected"
    SCREENING_REJECTED = "screening_rejected"


class ScreeningRejectionReason(str, enum.Enum):
    WORK_AUTHORIZATION_MISMATCH = "work_authorization_mismatch"
    LOCATION_MISMATCH = "location_mismatch"
    SKILL_MISMATCH = "skill_mismatch"
    OTHER = "other"


class SourcingRequest(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "sourcing_requests"

    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=True, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True, index=True)
    requested_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    assigned_to_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    title = Column(String(300), nullable=False)
    jd_text = Column(Text, nullable=True)
    jd_file_url = Column(String(500), nullable=True)

    path = Column(_enum(SourcingPath), default=SourcingPath.WITH_REQ_TEAM, nullable=False)
    requirement_type = Column(
        _enum(RequirementType), default=RequirementType.JOB_LINKED, nullable=False
    )
    publish_to_portal = Column(Boolean, default=False, nullable=False)
    status = Column(
        _enum(SourcingRequestStatus),
        default=SourcingRequestStatus.PENDING,
        nullable=False,
        index=True,
    )

    screening_criteria = Column(JSON, default=dict)
    job_snapshot = Column(JSON, default=dict)
    notes = Column(Text, nullable=True)
    headcount = Column(Integer, nullable=True)

    submitted_to_hm_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    job = relationship("Job", backref="sourcing_requests")
    company = relationship("Company", backref="sourcing_requests")
    requested_by = relationship("User", foreign_keys=[requested_by_id])
    assigned_to = relationship("User", foreign_keys=[assigned_to_id])
    tasks = relationship("ScreeningTask", back_populates="sourcing_request")
    invites = relationship("ScreeningInvite", back_populates="sourcing_request")


class ScreeningInvite(Base, UUIDMixin, TimestampMixin):
    """HM-invited candidate email → signup → screening pipeline."""

    __tablename__ = "screening_invites"

    sourcing_request_id = Column(
        UUID(as_uuid=True), ForeignKey("sourcing_requests.id"), nullable=False, index=True
    )
    invited_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=True)
    candidate_email = Column(String(255), nullable=False, index=True)
    invite_token = Column(String(64), unique=True, nullable=False, index=True)
    email_subject = Column(String(500), nullable=True)
    email_body_sent = Column(Text, nullable=True)

    status = Column(
        _enum(ScreeningInviteStatus),
        default=ScreeningInviteStatus.INVITE_SENT,
        nullable=False,
        index=True,
    )
    candidate_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    invite_sent_at = Column(DateTime, nullable=True)
    signup_started_at = Column(DateTime, nullable=True)
    signup_submitted_at = Column(DateTime, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    sourcing_request = relationship("SourcingRequest", back_populates="invites")
    invited_by = relationship("User", foreign_keys=[invited_by_id])
    candidate_user = relationship("User", foreign_keys=[candidate_user_id])


class ScreeningTask(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "screening_tasks"

    sourcing_request_id = Column(
        UUID(as_uuid=True), ForeignKey("sourcing_requests.id"), nullable=True, index=True
    )
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=True, index=True)
    application_id = Column(
        UUID(as_uuid=True), ForeignKey("job_applications.id"), nullable=True, index=True
    )
    candidate_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    screening_invite_id = Column(
        UUID(as_uuid=True), ForeignKey("screening_invites.id"), nullable=True, index=True
    )

    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    task_type = Column(
        _enum(ScreeningTaskType), default=ScreeningTaskType.RECRUITMENT, nullable=False, index=True
    )

    status = Column(
        _enum(ScreeningTaskStatus),
        default=ScreeningTaskStatus.OPEN,
        nullable=False,
        index=True,
    )

    candidate_name = Column(String(200), nullable=True)
    candidate_email = Column(String(255), nullable=True)
    candidate_phone = Column(String(50), nullable=True)
    candidate_resume_url = Column(String(500), nullable=True)
    candidate_source = Column(String(100), nullable=True)
    candidate_linkedin_url = Column(String(500), nullable=True)
    candidate_profile_data = Column(JSON, default=dict)

    claimed_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    claimed_at = Column(DateTime, nullable=True)

    screener_comments = Column(Text, nullable=True)
    rejection_reason = Column(_enum(ScreeningRejectionReason), nullable=True)
    rejection_notes = Column(Text, nullable=True)
    detailed_results = Column(JSON, default=dict)
    completed_at = Column(DateTime, nullable=True)
    completed_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    checks_completed = Column(JSON, default=dict)

    sourcing_request = relationship("SourcingRequest", back_populates="tasks")
    job = relationship("Job", backref="screening_tasks")
    application = relationship("JobApplication", backref="screening_tasks")
    created_by = relationship("User", foreign_keys=[created_by_id])
    claimed_by = relationship("User", foreign_keys=[claimed_by_id])
    completed_by = relationship("User", foreign_keys=[completed_by_id])
    candidate_user = relationship("User", foreign_keys=[candidate_user_id])
    screening_invite = relationship("ScreeningInvite", foreign_keys=[screening_invite_id])


class HmEmailSignature(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "hm_email_signatures"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    sender_name = Column(String(200), nullable=True)
    sender_title = Column(String(200), nullable=True)
    sender_phone = Column(String(50), nullable=True)
    signature_html = Column(Text, nullable=True)

    user = relationship("User", backref="hm_email_signature")


class CompanyHmInvite(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "company_hm_invites"

    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)
    invited_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    invite_token = Column(String(64), unique=True, nullable=False, index=True)
    status = Column(String(30), default="sent", nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    sent_at = Column(DateTime, nullable=True)

    company = relationship("Company", backref="hm_invites")
    invited_by = relationship("User", foreign_keys=[invited_by_id])
    user = relationship("User", foreign_keys=[user_id])


class CompanyStaffRole(str, enum.Enum):
    """Per-company screening staff (created by company admin / HR)."""
    RECRUITER = "recruiter"
    SCREENER = "screener"
    TECH_SCREENER = "tech_screener"


class CompanyScreeningStaff(Base, UUIDMixin, TimestampMixin):
    """Links a user to a company as recruiter, screener, or tech screener."""

    __tablename__ = "company_screening_staff"
    __table_args__ = (
        {"comment": "Per-company recruitment/screener staff"},
    )

    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    staff_role = Column(_enum(CompanyStaffRole), nullable=False, index=True)
    assigned_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    company = relationship("Company", backref="screening_staff")
    user = relationship("User", foreign_keys=[user_id])
    assigned_by = relationship("User", foreign_keys=[assigned_by_id])
