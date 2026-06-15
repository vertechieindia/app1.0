"""Screening workflow business logic."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import attributes as orm_attributes

from app.models.job import JobApplication, ApplicationStatus
from app.models.screening import (
    ScreeningTask,
    ScreeningTaskStatus,
    SourcingRequest,
    SourcingRequestStatus,
    SourcingPath,
)
from app.models.user import User, VerificationStatus


def normalize_role_slug(value: str) -> str:
    return (value or "").strip().lower().replace("-", "_").replace(" ", "_")


def get_role_slugs(user: User) -> set[str]:
    slugs: set[str] = set()
    for admin_role in user.admin_roles or []:
        slugs.add(normalize_role_slug(str(admin_role)))
    # Avoid lazy-loading roles in async request handlers (MissingGreenlet).
    state = orm_attributes.instance_state(user)
    if "roles" in state.unloaded:
        return slugs
    for role in getattr(user, "roles", None) or []:
        role_type = getattr(role, "role_type", None)
        if role_type is not None:
            slugs.add(normalize_role_slug(str(getattr(role_type, "value", role_type))))
    return slugs


def is_staff_approved(user: User) -> bool:
    if user.is_superuser:
        return True
    raw = user.verification_status
    if raw is None:
        return bool(user.is_verified)
    status = (raw.value if hasattr(raw, "value") else str(raw)).upper()
    if status == VerificationStatus.APPROVED.value:
        return True
    if status in (
        VerificationStatus.PENDING.value,
        VerificationStatus.UNDER_REVIEW.value,
        VerificationStatus.REJECTED.value,
        VerificationStatus.RESUBMITTED.value,
    ):
        return False
    return bool(user.is_verified)


def is_super_or_admin(user: User) -> bool:
    if user.is_superuser:
        return True
    slugs = get_role_slugs(user)
    return "superadmin" in slugs or "super_admin" in slugs


def is_requirements_team(user: User) -> bool:
    if is_super_or_admin(user):
        return True
    return "requirements_admin" in get_role_slugs(user)


def is_screener(user: User) -> bool:
    if is_super_or_admin(user):
        return True
    return "screener_admin" in get_role_slugs(user)


def is_tech_screener(user: User) -> bool:
    if is_super_or_admin(user):
        return True
    return "tech_screener_admin" in get_role_slugs(user)


def is_hiring_manager(user: User) -> bool:
    if user.is_superuser:
        return True
    slugs = get_role_slugs(user)
    return "hm_admin" in slugs or "hiring_manager" in slugs


def require_staff_approved(user: User) -> None:
    from fastapi import HTTPException

    if not is_staff_approved(user):
        raise HTTPException(
            status_code=403,
            detail="Account pending approval. Dashboard access is not available until verified.",
        )


async def move_application_to_hm_screening(
    db: AsyncSession,
    application: JobApplication,
    screener: User,
    comments: Optional[str],
) -> None:
    """Selected profile → HM ATS pipeline (shortlisted / screening stage)."""
    application.status = ApplicationStatus.SHORTLISTED
    application.reviewed_by_id = screener.id
    application.reviewed_at = datetime.utcnow()
    if comments:
        existing = (application.reviewer_notes or "").strip()
        note = f"[Screener] {comments.strip()}"
        application.reviewer_notes = f"{existing}\n{note}".strip() if existing else note
    await db.flush()


async def maybe_create_screening_task_for_application(
    db: AsyncSession,
    application: JobApplication,
) -> Optional[ScreeningTask]:
    """When a candidate applies, attach to active sourcing request if configured."""
    result = await db.execute(
        select(SourcingRequest)
        .where(
            SourcingRequest.job_id == application.job_id,
            SourcingRequest.status.in_([
                SourcingRequestStatus.PENDING,
                SourcingRequestStatus.IN_PROGRESS,
                SourcingRequestStatus.SCREENING,
            ]),
        )
        .order_by(SourcingRequest.created_at.desc())
        .limit(1)
    )
    sourcing = result.scalar_one_or_none()
    if not sourcing:
        return None

    dup = await db.execute(
        select(ScreeningTask.id).where(ScreeningTask.application_id == application.id).limit(1)
    )
    if dup.scalar_one_or_none():
        return None

    initial_status = (
        ScreeningTaskStatus.PENDING_REQ_TEAM
        if sourcing.path == SourcingPath.WITH_REQ_TEAM
        else ScreeningTaskStatus.OPEN
    )
    applicant = application.applicant
    if applicant is None and application.applicant_id:
        from sqlalchemy import select as sa_select
        from app.models.user import User as UserModel
        urow = await db.execute(sa_select(UserModel).where(UserModel.id == application.applicant_id))
        applicant = urow.scalar_one_or_none()
    task = ScreeningTask(
        sourcing_request_id=sourcing.id,
        job_id=application.job_id,
        application_id=application.id,
        created_by_id=sourcing.requested_by_id,
        status=initial_status,
        candidate_name=(
            f"{getattr(applicant, 'first_name', '')} {getattr(applicant, 'last_name', '')}".strip()
            if applicant
            else None
        ),
        candidate_email=getattr(applicant, "email", None) if applicant else None,
    )
    db.add(task)
    if sourcing.status == SourcingRequestStatus.PENDING:
        sourcing.status = SourcingRequestStatus.IN_PROGRESS
    await db.flush()
    return task


def task_to_dict(task: ScreeningTask, include_details: bool = True) -> dict[str, Any]:
    job = task.job
    sr = task.sourcing_request
    applicant = task.application.applicant if task.application else None
    name = task.candidate_name
    email = task.candidate_email
    if not name and applicant:
        name = f"{applicant.first_name or ''} {applicant.last_name or ''}".strip()
    if not email and applicant:
        email = applicant.email

    data: dict[str, Any] = {
        "id": str(task.id),
        "sourcing_request_id": str(task.sourcing_request_id) if task.sourcing_request_id else None,
        "job_id": str(task.job_id) if task.job_id else None,
        "application_id": str(task.application_id) if task.application_id else None,
        "status": task.status.value if task.status else None,
        "task_type": task.task_type.value if getattr(task, "task_type", None) else "recruitment",
        "candidate_name": name,
        "candidate_email": email,
        "candidate_phone": task.candidate_phone,
        "candidate_resume_url": task.candidate_resume_url,
        "candidate_source": task.candidate_source,
        "candidate_linkedin_url": task.candidate_linkedin_url,
        "claimed_by_id": str(task.claimed_by_id) if task.claimed_by_id else None,
        "claimed_at": task.claimed_at.isoformat() if task.claimed_at else None,
        "screener_comments": task.screener_comments,
        "rejection_reason": task.rejection_reason.value if task.rejection_reason else None,
        "rejection_notes": task.rejection_notes,
        "completed_at": task.completed_at.isoformat() if task.completed_at else None,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "job_title": job.title if job else (sr.title if sr else None),
        "screening_criteria": (sr.screening_criteria if sr else {}) or {},
        "jd_text": sr.jd_text if sr else None,
    }
    if include_details:
        data["candidate_profile_data"] = task.candidate_profile_data or {}
        data["checks_completed"] = task.checks_completed or {}
        data["detailed_results"] = getattr(task, "detailed_results", None) or {}
        if task.claimed_by:
            data["claimed_by_name"] = (
                f"{task.claimed_by.first_name or ''} {task.claimed_by.last_name or ''}".strip()
                or task.claimed_by.email
            )
    return data


def sourcing_request_to_dict(sr: SourcingRequest) -> dict[str, Any]:
    job = sr.job
    return {
        "id": str(sr.id),
        "job_id": str(sr.job_id) if sr.job_id else None,
        "job_title": job.title if job else sr.title,
        "title": sr.title,
        "jd_text": sr.jd_text,
        "jd_file_url": sr.jd_file_url,
        "path": sr.path.value if sr.path else None,
        "status": sr.status.value if sr.status else None,
        "requirement_type": sr.requirement_type.value if getattr(sr, "requirement_type", None) else None,
        "publish_to_portal": bool(getattr(sr, "publish_to_portal", False)),
        "screening_criteria": sr.screening_criteria or {},
        "notes": sr.notes,
        "headcount": sr.headcount,
        "requested_by_id": str(sr.requested_by_id),
        "assigned_to_id": str(sr.assigned_to_id) if sr.assigned_to_id else None,
        "submitted_to_hm_at": sr.submitted_to_hm_at.isoformat() if sr.submitted_to_hm_at else None,
        "completed_at": sr.completed_at.isoformat() if sr.completed_at else None,
        "created_at": sr.created_at.isoformat() if sr.created_at else None,
        "task_counts": {},
    }
