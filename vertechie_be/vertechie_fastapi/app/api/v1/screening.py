"""
Screening workflow API: sourcing requests, screening tasks, claim workflow.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.job import Job, JobApplication
from app.models.screening import (
    ScreeningRejectionReason,
    ScreeningTask,
    ScreeningTaskStatus,
    ScreeningTaskType,
    SourcingPath,
    SourcingRequest,
    SourcingRequestStatus,
)
from app.models.user import User
from app.services.screening_service import (
    is_hiring_manager,
    is_requirements_team,
    is_screener,
    is_staff_approved,
    is_super_or_admin,
    is_tech_screener,
    maybe_create_screening_task_for_application,
    move_application_to_hm_screening,
    sourcing_request_to_dict,
    task_to_dict,
)
from app.services.company_screening_service import (
    apply_task_company_scope,
    assert_recruiter_can_access_sourcing,
    assert_screener_can_access_task,
    assert_tech_screener_can_access_task,
    can_access_any_screening_portal,
    can_access_recruiter_portal,
    can_access_screener_portal,
    can_access_tech_screener_portal,
    company_scope_for_recruiter,
    company_scope_for_screener,
    company_scope_for_tech_screener,
    require_screening_dashboard_user,
    resolve_user_company_id,
    user_has_company_staff_role,
)
from app.models.screening import CompanyStaffRole
from app.services.screening_invite_service import sync_invite_on_screening_complete

router = APIRouter(tags=["Screening"])


# ---------- Schemas ----------


class ScreeningCriteriaSchema(BaseModel):
    checks: List[str] = Field(default_factory=list)
    location_notes: Optional[str] = None
    visa_notes: Optional[str] = None
    tech_mandatory: List[str] = Field(default_factory=list)
    tech_optional: List[str] = Field(default_factory=list)


class SourcingRequestCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    job_id: Optional[UUID] = None
    company_id: Optional[UUID] = None
    jd_text: Optional[str] = None
    jd_file_url: Optional[str] = None
    path: SourcingPath = SourcingPath.WITH_REQ_TEAM
    screening_criteria: Optional[dict] = None
    notes: Optional[str] = None
    headcount: Optional[int] = None


class SourcingRequestUpdate(BaseModel):
    status: Optional[SourcingRequestStatus] = None
    assigned_to_id: Optional[UUID] = None
    notes: Optional[str] = None
    screening_criteria: Optional[dict] = None


class ScreeningTaskCreate(BaseModel):
    sourcing_request_id: Optional[UUID] = None
    job_id: Optional[UUID] = None
    application_id: Optional[UUID] = None
    candidate_name: Optional[str] = None
    candidate_email: Optional[str] = None
    candidate_phone: Optional[str] = None
    candidate_resume_url: Optional[str] = None
    candidate_source: Optional[str] = None
    candidate_linkedin_url: Optional[str] = None
    candidate_profile_data: Optional[dict] = None
    send_to_screener: bool = True


class ScreeningTaskComplete(BaseModel):
    outcome: str = Field(..., description="selected or rejected")
    screener_comments: Optional[str] = None
    rejection_reason: Optional[ScreeningRejectionReason] = None
    rejection_notes: Optional[str] = None
    checks_completed: Optional[dict] = None
    detailed_results: Optional[dict] = None


# ---------- Helpers ----------


async def _load_sourcing(db: AsyncSession, sr_id: UUID) -> SourcingRequest:
    result = await db.execute(
        select(SourcingRequest)
        .options(selectinload(SourcingRequest.job))
        .where(SourcingRequest.id == sr_id)
    )
    sr = result.scalar_one_or_none()
    if not sr:
        raise HTTPException(status_code=404, detail="Sourcing request not found")
    return sr


async def _load_task(db: AsyncSession, task_id: UUID) -> ScreeningTask:
    result = await db.execute(
        select(ScreeningTask)
        .options(
            selectinload(ScreeningTask.job),
            selectinload(ScreeningTask.sourcing_request),
            selectinload(ScreeningTask.application).selectinload(JobApplication.applicant),
            selectinload(ScreeningTask.claimed_by),
        )
        .where(ScreeningTask.id == task_id)
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Screening task not found")
    return task


async def _attach_task_counts(db: AsyncSession, items: List[dict]) -> List[dict]:
    if not items:
        return items
    ids = [UUID(i["id"]) for i in items]
    counts = await db.execute(
        select(
            ScreeningTask.sourcing_request_id,
            ScreeningTask.status,
            func.count(ScreeningTask.id),
        )
        .where(ScreeningTask.sourcing_request_id.in_(ids))
        .group_by(ScreeningTask.sourcing_request_id, ScreeningTask.status)
    )
    by_sr: dict[str, dict[str, int]] = {}
    for sr_id, status, cnt in counts.all():
        key = str(sr_id)
        by_sr.setdefault(key, {})
        by_sr[key][status.value if status else "unknown"] = cnt
    for item in items:
        item["task_counts"] = by_sr.get(item["id"], {})
    return items


def _initial_task_status(sourcing: Optional[SourcingRequest], send_to_screener: bool) -> ScreeningTaskStatus:
    """Direct-to-screener requests skip recruiter queue; req-team path holds until released."""
    if sourcing and sourcing.path == SourcingPath.DIRECT_SCREENER:
        return ScreeningTaskStatus.OPEN
    if not send_to_screener:
        return ScreeningTaskStatus.PENDING_REQ_TEAM
    if sourcing and sourcing.path == SourcingPath.WITH_REQ_TEAM:
        return ScreeningTaskStatus.PENDING_REQ_TEAM
    return ScreeningTaskStatus.OPEN


async def _recruitment_screener(db: AsyncSession, user: User) -> bool:
    if is_screener(user):
        return True
    return await user_has_company_staff_role(db, user.id, CompanyStaffRole.SCREENER)


async def _tech_screener_user(db: AsyncSession, user: User) -> bool:
    if is_tech_screener(user):
        return True
    return await user_has_company_staff_role(db, user.id, CompanyStaffRole.TECH_SCREENER)


# ---------- Sourcing Requests ----------


@router.post("/sourcing-requests")
async def create_sourcing_request(
    body: SourcingRequestCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    if not is_hiring_manager(current_user) and not await can_access_recruiter_portal(db, current_user):
        raise HTTPException(status_code=403, detail="Not authorized to create sourcing requests")

    if body.job_id:
        job_row = await db.execute(select(Job).where(Job.id == body.job_id))
        job = job_row.scalar_one_or_none()
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")

    company_id = body.company_id or await resolve_user_company_id(db, current_user)

    sr = SourcingRequest(
        title=body.title.strip(),
        job_id=body.job_id,
        company_id=company_id,
        requested_by_id=current_user.id,
        jd_text=body.jd_text,
        jd_file_url=body.jd_file_url,
        path=SourcingPath.WITH_REQ_TEAM,
        screening_criteria=body.screening_criteria or {},
        notes=body.notes,
        headcount=body.headcount,
        status=SourcingRequestStatus.PENDING,
    )
    db.add(sr)
    await db.commit()
    await db.refresh(sr)
    data = sourcing_request_to_dict(sr)
    data["task_counts"] = {}
    return data


@router.get("/sourcing-requests")
async def list_sourcing_requests(
    status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    query = select(SourcingRequest).options(selectinload(SourcingRequest.job))

    if is_super_or_admin(current_user):
        pass
    elif await can_access_recruiter_portal(db, current_user):
        scope = await company_scope_for_recruiter(db, current_user)
        if scope is not None:
            if not scope:
                return {"items": [], "total": 0}
            query = query.where(SourcingRequest.company_id.in_(scope))
    elif is_hiring_manager(current_user):
        query = query.where(SourcingRequest.requested_by_id == current_user.id)
    else:
        raise HTTPException(status_code=403, detail="Not authorized to list sourcing requests")

    if status:
        try:
            st = SourcingRequestStatus(status.strip().lower())
            query = query.where(SourcingRequest.status == st)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status}")

    query = query.order_by(SourcingRequest.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    rows = result.scalars().all()
    items = [sourcing_request_to_dict(r) for r in rows]
    items = await _attach_task_counts(db, items)
    return {"items": items, "total": len(items)}


@router.get("/sourcing-requests/{sr_id}")
async def get_sourcing_request(
    sr_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    sr = await _load_sourcing(db, sr_id)
    if is_super_or_admin(current_user):
        pass
    elif is_hiring_manager(current_user) and sr.requested_by_id == current_user.id:
        pass
    elif await can_access_recruiter_portal(db, current_user):
        await assert_recruiter_can_access_sourcing(db, current_user, sr)
    else:
        raise HTTPException(status_code=403, detail="Not authorized")
    data = sourcing_request_to_dict(sr)
    data["task_counts"] = {}
    enriched = await _attach_task_counts(db, [data])
    return enriched[0]


@router.patch("/sourcing-requests/{sr_id}")
async def update_sourcing_request(
    sr_id: UUID,
    body: SourcingRequestUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    if not await can_access_recruiter_portal(db, current_user) and not is_hiring_manager(current_user):
        raise HTTPException(status_code=403, detail="Not authorized")
    sr = await _load_sourcing(db, sr_id)
    if await can_access_recruiter_portal(db, current_user):
        await assert_recruiter_can_access_sourcing(db, current_user, sr)
    elif not is_hiring_manager(current_user) or sr.requested_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    if body.status is not None:
        sr.status = body.status
    if body.assigned_to_id is not None:
        sr.assigned_to_id = body.assigned_to_id
    if body.notes is not None:
        sr.notes = body.notes
    if body.screening_criteria is not None:
        sr.screening_criteria = body.screening_criteria
    await db.commit()
    await db.refresh(sr)
    return sourcing_request_to_dict(sr)


@router.post("/sourcing-requests/{sr_id}/send-to-screener")
async def send_sourcing_to_screener(
    sr_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Requirements Team releases pending tasks to screener pool."""
    await require_screening_dashboard_user(db, current_user)
    if not await can_access_recruiter_portal(db, current_user):
        raise HTTPException(status_code=403, detail="Not authorized")

    sr = await _load_sourcing(db, sr_id)
    await assert_recruiter_can_access_sourcing(db, current_user, sr)
    pending = await db.execute(
        select(ScreeningTask).where(
            ScreeningTask.sourcing_request_id == sr.id,
            ScreeningTask.status == ScreeningTaskStatus.PENDING_REQ_TEAM,
        )
    )
    tasks = pending.scalars().all()
    for t in tasks:
        t.status = ScreeningTaskStatus.OPEN
    sr.status = SourcingRequestStatus.SCREENING
    await db.commit()
    return {"updated_tasks": len(tasks), "status": sr.status.value}


@router.post("/sourcing-requests/{sr_id}/submit-to-hm")
async def submit_sourcing_to_hm(
    sr_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Requirements Team submits vetted profiles back to Hiring Manager."""
    await require_screening_dashboard_user(db, current_user)
    if not await can_access_recruiter_portal(db, current_user):
        raise HTTPException(status_code=403, detail="Not authorized")

    sr = await _load_sourcing(db, sr_id)
    await assert_recruiter_can_access_sourcing(db, current_user, sr)
    selected = await db.execute(
        select(func.count(ScreeningTask.id)).where(
            ScreeningTask.sourcing_request_id == sr.id,
            ScreeningTask.status == ScreeningTaskStatus.SELECTED,
        )
    )
    selected_count = selected.scalar() or 0
    sr.status = SourcingRequestStatus.SUBMITTED_TO_HM
    sr.submitted_to_hm_at = datetime.utcnow()
    await db.commit()
    return {
        "status": sr.status.value,
        "selected_count": selected_count,
        "submitted_to_hm_at": sr.submitted_to_hm_at.isoformat(),
    }


# ---------- Screening Tasks ----------


@router.get("/tasks")
async def list_screening_tasks(
    status: Optional[str] = Query(None, description="Comma-separated statuses"),
    sourcing_request_id: Optional[UUID] = Query(None),
    job_id: Optional[UUID] = Query(None),
    pool: Optional[str] = Query(None, description="open|mine|pending|selected|rejected"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    recruiter = await can_access_recruiter_portal(db, current_user)
    screener = await can_access_screener_portal(db, current_user)
    if not screener and not recruiter and not is_hiring_manager(current_user):
        raise HTTPException(status_code=403, detail="Not authorized")

    query = (
        select(ScreeningTask)
        .options(
            selectinload(ScreeningTask.job),
            selectinload(ScreeningTask.sourcing_request),
            selectinload(ScreeningTask.application).selectinload(JobApplication.applicant),
            selectinload(ScreeningTask.claimed_by),
        )
    )

    if pool == "open":
        query = query.where(ScreeningTask.status == ScreeningTaskStatus.OPEN)
    elif pool == "mine":
        query = query.where(
            ScreeningTask.claimed_by_id == current_user.id,
            ScreeningTask.status.in_([ScreeningTaskStatus.CLAIMED, ScreeningTaskStatus.OPEN]),
        )
    elif pool == "pending":
        query = query.where(
            ScreeningTask.status.in_([
                ScreeningTaskStatus.OPEN,
                ScreeningTaskStatus.CLAIMED,
                ScreeningTaskStatus.PENDING_REQ_TEAM,
            ])
        )
    elif pool == "selected":
        query = query.where(ScreeningTask.status == ScreeningTaskStatus.SELECTED)
    elif pool == "rejected":
        query = query.where(ScreeningTask.status == ScreeningTaskStatus.REJECTED)

    if status:
        statuses = []
        for s in status.split(","):
            try:
                statuses.append(ScreeningTaskStatus(s.strip().lower()))
            except ValueError:
                pass
        if statuses:
            query = query.where(ScreeningTask.status.in_(statuses))

    if sourcing_request_id:
        query = query.where(ScreeningTask.sourcing_request_id == sourcing_request_id)
    if job_id:
        query = query.where(ScreeningTask.job_id == job_id)

    recruitment = await _recruitment_screener(db, current_user)
    tech = await _tech_screener_user(db, current_user)
    if recruitment and not tech and not is_super_or_admin(current_user):
        query = query.where(ScreeningTask.task_type == ScreeningTaskType.RECRUITMENT)
    elif tech and not recruitment and not is_super_or_admin(current_user):
        query = query.where(ScreeningTask.task_type == ScreeningTaskType.ENTERPRISE_VERIFICATION)

    if screener and not is_super_or_admin(current_user):
        scope = await company_scope_for_screener(db, current_user)
        query = await apply_task_company_scope(query, scope)
    elif recruiter and not is_hiring_manager(current_user) and not is_super_or_admin(current_user):
        scope = await company_scope_for_recruiter(db, current_user)
        query = await apply_task_company_scope(query, scope)
    elif is_hiring_manager(current_user) and not screener and not recruiter:
        hm_srs = await db.execute(
            select(SourcingRequest.id).where(SourcingRequest.requested_by_id == current_user.id)
        )
        sr_ids = [r[0] for r in hm_srs.all()]
        if not sr_ids:
            return {"items": [], "total": 0}
        query = query.where(ScreeningTask.sourcing_request_id.in_(sr_ids))

    query = query.order_by(ScreeningTask.created_at.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    tasks = result.scalars().all()
    return {"items": [task_to_dict(t) for t in tasks], "total": len(tasks)}


@router.get("/tasks/grouped-by-job")
async def list_tasks_grouped_by_job(
    pool: str = Query("pending", description="pending|selected|rejected"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Screener portal: job title tiles grouped by outcome bucket."""
    await require_screening_dashboard_user(db, current_user)
    if not await can_access_screener_portal(db, current_user):
        raise HTTPException(status_code=403, detail="Screener access only")

    status_map = {
        "pending": [ScreeningTaskStatus.OPEN, ScreeningTaskStatus.CLAIMED],
        "selected": [ScreeningTaskStatus.SELECTED],
        "rejected": [ScreeningTaskStatus.REJECTED],
    }
    statuses = status_map.get(pool, status_map["pending"])

    query = (
        select(ScreeningTask)
        .options(selectinload(ScreeningTask.job), selectinload(ScreeningTask.sourcing_request))
        .where(
            ScreeningTask.status.in_(statuses),
            ScreeningTask.task_type == ScreeningTaskType.RECRUITMENT,
        )
        .order_by(ScreeningTask.created_at.desc())
    )
    scope = await company_scope_for_screener(db, current_user)
    query = await apply_task_company_scope(query, scope)
    result = await db.execute(query)
    tasks = result.scalars().all()
    groups: dict[str, dict] = {}
    for t in tasks:
        title = t.job.title if t.job else (t.sourcing_request.title if t.sourcing_request else "Unknown Role")
        key = str(t.job_id or t.sourcing_request_id or title)
        if key not in groups:
            groups[key] = {
                "job_id": str(t.job_id) if t.job_id else None,
                "sourcing_request_id": str(t.sourcing_request_id) if t.sourcing_request_id else None,
                "job_title": title,
                "screening_criteria": (t.sourcing_request.screening_criteria if t.sourcing_request else {}) or {},
                "jd_text": t.sourcing_request.jd_text if t.sourcing_request else None,
                "task_count": 0,
                "tasks": [],
            }
        groups[key]["task_count"] += 1
        groups[key]["tasks"].append(task_to_dict(t, include_details=False))
    return {"pool": pool, "groups": list(groups.values())}


@router.post("/tasks")
async def create_screening_task(
    body: ScreeningTaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    if not await can_access_recruiter_portal(db, current_user) and not is_hiring_manager(current_user):
        raise HTTPException(status_code=403, detail="Not authorized to create screening tasks")

    sourcing: Optional[SourcingRequest] = None
    if body.sourcing_request_id:
        sourcing = await _load_sourcing(db, body.sourcing_request_id)
        if await can_access_recruiter_portal(db, current_user):
            await assert_recruiter_can_access_sourcing(db, current_user, sourcing)

    job_id = body.job_id or (sourcing.job_id if sourcing else None)
    initial_status = _initial_task_status(sourcing, body.send_to_screener)

    if body.application_id:
        app_row = await db.execute(
            select(JobApplication)
            .options(selectinload(JobApplication.applicant))
            .where(JobApplication.id == body.application_id)
        )
        application = app_row.scalar_one_or_none()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        job_id = application.job_id
        applicant = application.applicant
        candidate_name = body.candidate_name or (
            f"{applicant.first_name or ''} {applicant.last_name or ''}".strip() if applicant else None
        )
        candidate_email = body.candidate_email or (applicant.email if applicant else None)
    else:
        candidate_name = body.candidate_name
        candidate_email = body.candidate_email

    task = ScreeningTask(
        sourcing_request_id=body.sourcing_request_id,
        job_id=job_id,
        application_id=body.application_id,
        created_by_id=current_user.id,
        status=initial_status,
        candidate_name=candidate_name,
        candidate_email=candidate_email,
        candidate_phone=body.candidate_phone,
        candidate_resume_url=body.candidate_resume_url,
        candidate_source=body.candidate_source,
        candidate_linkedin_url=body.candidate_linkedin_url,
        candidate_profile_data=body.candidate_profile_data or {},
    )
    db.add(task)
    if sourcing:
        if initial_status == ScreeningTaskStatus.OPEN and sourcing.status in (
            SourcingRequestStatus.PENDING,
            SourcingRequestStatus.IN_PROGRESS,
        ):
            sourcing.status = SourcingRequestStatus.SCREENING
        elif sourcing.status == SourcingRequestStatus.PENDING:
            sourcing.status = SourcingRequestStatus.IN_PROGRESS
    await db.commit()
    return task_to_dict(await _load_task(db, task.id))


@router.get("/tasks/{task_id}")
async def get_screening_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    task = await _load_task(db, task_id)
    return task_to_dict(task)


@router.post("/tasks/{task_id}/claim")
async def claim_screening_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    recruitment = await _recruitment_screener(db, current_user)
    tech = await _tech_screener_user(db, current_user)
    if not recruitment and not tech:
        raise HTTPException(status_code=403, detail="Screener access only")

    task = await _load_task(db, task_id)
    if task.task_type == ScreeningTaskType.ENTERPRISE_VERIFICATION and not tech:
        raise HTTPException(status_code=403, detail="Tech screener only for enterprise verification tasks")
    if task.task_type == ScreeningTaskType.RECRUITMENT and not recruitment and not is_super_or_admin(current_user):
        raise HTTPException(status_code=403, detail="Recruitment screener only")
    if task.task_type == ScreeningTaskType.RECRUITMENT:
        await assert_screener_can_access_task(db, current_user, task)
    else:
        await assert_tech_screener_can_access_task(db, current_user, task)
    if task.status not in (ScreeningTaskStatus.OPEN, ScreeningTaskStatus.CLAIMED):
        raise HTTPException(status_code=400, detail="Task is not available to claim")
    if task.claimed_by_id and task.claimed_by_id != current_user.id:
        raise HTTPException(status_code=409, detail="Task already claimed by another screener")

    task.claimed_by_id = current_user.id
    task.claimed_at = datetime.utcnow()
    task.status = ScreeningTaskStatus.CLAIMED
    await db.commit()
    return task_to_dict(await _load_task(db, task.id))


@router.post("/tasks/{task_id}/release")
async def release_screening_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    recruitment = await _recruitment_screener(db, current_user)
    tech = await _tech_screener_user(db, current_user)
    if not recruitment and not tech:
        raise HTTPException(status_code=403, detail="Screener access only")

    task = await _load_task(db, task_id)
    if task.task_type == ScreeningTaskType.ENTERPRISE_VERIFICATION and not tech:
        raise HTTPException(status_code=403, detail="Tech screener only for enterprise verification tasks")
    if task.task_type == ScreeningTaskType.RECRUITMENT and not recruitment and not is_super_or_admin(current_user):
        raise HTTPException(status_code=403, detail="Recruitment screener only")
    if task.task_type == ScreeningTaskType.RECRUITMENT:
        await assert_screener_can_access_task(db, current_user, task)
    else:
        await assert_tech_screener_can_access_task(db, current_user, task)
    if task.claimed_by_id != current_user.id and not is_super_or_admin(current_user):
        raise HTTPException(status_code=403, detail="You did not claim this task")
    if task.status != ScreeningTaskStatus.CLAIMED:
        raise HTTPException(status_code=400, detail="Only claimed tasks can be released")

    task.claimed_by_id = None
    task.claimed_at = None
    task.status = ScreeningTaskStatus.OPEN
    await db.commit()
    return task_to_dict(await _load_task(db, task.id))


@router.put("/tasks/{task_id}/complete")
async def complete_screening_task(
    task_id: UUID,
    body: ScreeningTaskComplete,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    recruitment = await _recruitment_screener(db, current_user)
    tech = await _tech_screener_user(db, current_user)
    if not recruitment and not tech:
        raise HTTPException(status_code=403, detail="Screener access only")

    task = await _load_task(db, task_id)
    if task.task_type == ScreeningTaskType.ENTERPRISE_VERIFICATION and not tech:
        raise HTTPException(status_code=403, detail="Tech screener only for enterprise verification tasks")
    if task.task_type == ScreeningTaskType.RECRUITMENT and not recruitment and not is_super_or_admin(current_user):
        raise HTTPException(status_code=403, detail="Recruitment screener only")
    if task.task_type == ScreeningTaskType.RECRUITMENT:
        await assert_screener_can_access_task(db, current_user, task)
    else:
        await assert_tech_screener_can_access_task(db, current_user, task)
    if task.status not in (ScreeningTaskStatus.CLAIMED, ScreeningTaskStatus.OPEN):
        raise HTTPException(status_code=400, detail="Task cannot be completed in current status")
    if task.claimed_by_id and task.claimed_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Task claimed by another screener")

    outcome = body.outcome.strip().lower()
    if outcome not in ("selected", "rejected"):
        raise HTTPException(status_code=400, detail="outcome must be selected or rejected")

    task.completed_at = datetime.utcnow()
    task.completed_by_id = current_user.id
    task.screener_comments = body.screener_comments
    task.checks_completed = body.checks_completed or {}
    if body.detailed_results is not None:
        task.detailed_results = body.detailed_results

    if outcome == "selected":
        task.status = ScreeningTaskStatus.SELECTED
        task.rejection_reason = None
        task.rejection_notes = None
        if task.application_id:
            app_row = await db.execute(
                select(JobApplication).where(JobApplication.id == task.application_id)
            )
            application = app_row.scalar_one_or_none()
            if application:
                await move_application_to_hm_screening(db, application, current_user, body.screener_comments)
    else:
        task.status = ScreeningTaskStatus.REJECTED
        task.rejection_reason = body.rejection_reason or ScreeningRejectionReason.OTHER
        task.rejection_notes = body.rejection_notes
        if task.application_id:
            app_row = await db.execute(
                select(JobApplication).where(JobApplication.id == task.application_id)
            )
            application = app_row.scalar_one_or_none()
            if application:
                from app.models.job import ApplicationStatus

                application.status = ApplicationStatus.REJECTED
                if body.rejection_notes or body.rejection_reason:
                    reason = body.rejection_reason.value if body.rejection_reason else "other"
                    note = f"[Screener Rejected: {reason}] {body.rejection_notes or ''}".strip()
                    existing = (application.reviewer_notes or "").strip()
                    application.reviewer_notes = f"{existing}\n{note}".strip() if existing else note

    await sync_invite_on_screening_complete(db, task, outcome == "selected")
    await db.commit()
    return task_to_dict(await _load_task(db, task.id))


@router.get("/stats")
async def screening_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    await require_screening_dashboard_user(db, current_user)
    if not await can_access_any_screening_portal(db, current_user):
        raise HTTPException(status_code=403, detail="Not authorized")

    task_query = select(ScreeningTask)
    sr_query = select(SourcingRequest)

    if not is_super_or_admin(current_user):
        if await can_access_screener_portal(db, current_user):
            scope = await company_scope_for_screener(db, current_user)
            task_query = await apply_task_company_scope(task_query, scope)
            task_query = task_query.where(ScreeningTask.task_type == ScreeningTaskType.RECRUITMENT)
        elif await can_access_tech_screener_portal(db, current_user):
            scope = await company_scope_for_tech_screener(db, current_user)
            task_query = await apply_task_company_scope(task_query, scope)
            task_query = task_query.where(
                ScreeningTask.task_type == ScreeningTaskType.ENTERPRISE_VERIFICATION
            )
        elif await can_access_recruiter_portal(db, current_user):
            scope = await company_scope_for_recruiter(db, current_user)
            if scope is not None:
                if not scope:
                    return {
                        "tasks": {},
                        "sourcing_requests": {},
                        "pending_screenings": 0,
                        "selected": 0,
                        "rejected": 0,
                    }
                sr_query = sr_query.where(SourcingRequest.company_id.in_(scope))
                task_query = await apply_task_company_scope(task_query, scope)
        elif is_hiring_manager(current_user):
            sr_query = sr_query.where(SourcingRequest.requested_by_id == current_user.id)

    task_rows = await db.execute(task_query)
    tasks = task_rows.scalars().all()
    by_status: dict[str, int] = {}
    for t in tasks:
        key = t.status.value if t.status else "unknown"
        by_status[key] = by_status.get(key, 0) + 1

    sr_rows = await db.execute(sr_query)
    sourcing_list = sr_rows.scalars().all()
    sourcing_by_status: dict[str, int] = {}
    for sr in sourcing_list:
        key = sr.status.value if sr.status else "unknown"
        sourcing_by_status[key] = sourcing_by_status.get(key, 0) + 1

    return {
        "tasks": by_status,
        "sourcing_requests": sourcing_by_status,
        "pending_screenings": by_status.get("open", 0) + by_status.get("claimed", 0) + by_status.get("pending_req_team", 0),
        "selected": by_status.get("selected", 0),
        "rejected": by_status.get("rejected", 0),
    }
