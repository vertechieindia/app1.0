"""
Extended screening endpoints: source-only, screen-techies, invites, signatures, enterprise.
"""

from __future__ import annotations

import re
from datetime import datetime
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.company import Company, CompanyAdmin
from app.models.job import Job, JobStatus, JobApplication
from app.models.screening import (
    CompanyHmInvite,
    HmEmailSignature,
    RequirementType,
    ScreeningInvite,
    ScreeningTask,
    ScreeningTaskStatus,
    ScreeningTaskType,
    SourcingPath,
    SourcingRequest,
    SourcingRequestStatus,
)
from app.models.user import User
from app.services.screening_invite_service import (
    build_signup_url,
    generate_token,
    get_hm_signature,
    invite_to_dict,
    send_screening_invite_email,
)
from app.services.company_screening_service import (
    apply_task_company_scope,
    can_access_tech_screener_portal,
    company_scope_for_tech_screener,
    require_screening_dashboard_user,
    resolve_user_company_id,
)
from app.services.screening_service import (
    is_hiring_manager,
    is_staff_approved,
    is_super_or_admin,
    require_staff_approved,
    sourcing_request_to_dict,
    task_to_dict,
)

router = APIRouter(tags=["Screening"])


class SourceOnlyCreate(BaseModel):
    title: str
    jd_text: str
    company_id: Optional[UUID] = None
    screening_criteria: Optional[dict] = None
    notes: Optional[str] = None
    headcount: Optional[int] = None
    job_snapshot: Optional[dict] = None


class ScreenTechiesCreate(BaseModel):
    title: str
    jd_text: Optional[str] = None
    company_id: Optional[UUID] = None
    emails: List[str] = Field(..., min_length=1)
    screening_criteria: Optional[dict] = None
    email_subject: Optional[str] = None
    email_body: Optional[str] = None
    enterprise_verification: bool = True


class HmEmailSignatureUpdate(BaseModel):
    sender_name: Optional[str] = None
    sender_title: Optional[str] = None
    sender_phone: Optional[str] = None
    signature_html: Optional[str] = None


class CompanyHmInviteCreate(BaseModel):
    emails: List[str] = Field(..., min_length=1)


def _parse_emails(raw: List[str]) -> List[str]:
    out: List[str] = []
    seen = set()
    for line in raw:
        for part in re.split(r"[\s,;]+", line):
            e = part.strip().lower()
            if e and "@" in e and e not in seen:
                seen.add(e)
                out.append(e)
    return out


@router.post("/sourcing-requests/source-only")
async def create_source_only_requirement(
    body: SourceOnlyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """HM sourcing help — NOT published to job portal."""
    require_staff_approved(current_user)
    if not is_hiring_manager(current_user):
        raise HTTPException(status_code=403, detail="Hiring managers only")

    company_id = body.company_id or await resolve_user_company_id(db, current_user)

    sr = SourcingRequest(
        title=body.title.strip(),
        jd_text=body.jd_text,
        company_id=company_id,
        requested_by_id=current_user.id,
        path=SourcingPath.WITH_REQ_TEAM,
        requirement_type=RequirementType.SOURCE_ONLY,
        publish_to_portal=False,
        screening_criteria=body.screening_criteria or {},
        job_snapshot=body.job_snapshot or {},
        notes=body.notes,
        headcount=body.headcount,
        status=SourcingRequestStatus.PENDING,
    )
    db.add(sr)
    await db.commit()
    await db.refresh(sr)
    data = sourcing_request_to_dict(sr)
    data["publish_to_portal"] = False
    data["requirement_type"] = sr.requirement_type.value
    return data


@router.post("/screen-techies")
async def screen_techies(
    body: ScreenTechiesCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Bulk invite external candidates → signup → screener queue."""
    require_staff_approved(current_user)
    if not is_hiring_manager(current_user):
        raise HTTPException(status_code=403, detail="Hiring managers only")

    emails = _parse_emails(body.emails)
    if not emails:
        raise HTTPException(status_code=400, detail="No valid emails provided")

    company_id = body.company_id or await resolve_user_company_id(db, current_user)
    company_name = ""
    if company_id:
        c = await db.execute(select(Company).where(Company.id == company_id))
        comp = c.scalar_one_or_none()
        if comp:
            company_name = comp.name

    sr = SourcingRequest(
        title=body.title.strip(),
        jd_text=body.jd_text,
        company_id=company_id,
        requested_by_id=current_user.id,
        path=SourcingPath.DIRECT_SCREENER,
        requirement_type=RequirementType.SCREEN_INVITE,
        publish_to_portal=False,
        screening_criteria=body.screening_criteria or {},
        status=SourcingRequestStatus.SCREENING,
    )
    db.add(sr)
    await db.flush()

    task_type = (
        ScreeningTaskType.ENTERPRISE_VERIFICATION
        if body.enterprise_verification
        else ScreeningTaskType.RECRUITMENT
    )
    initial_task_status = ScreeningTaskStatus.OPEN

    sent = 0
    invites_out = []
    for email in emails:
        token = generate_token()
        invite = ScreeningInvite(
            sourcing_request_id=sr.id,
            invited_by_id=current_user.id,
            company_id=company_id,
            candidate_email=email,
            invite_token=token,
            email_subject=body.email_subject,
        )
        db.add(invite)
        await db.flush()

        task = ScreeningTask(
            sourcing_request_id=sr.id,
            created_by_id=current_user.id,
            task_type=task_type,
            status=initial_task_status,
            candidate_email=email,
            candidate_source="hm_invite",
            screening_invite_id=invite.id,
        )
        db.add(task)
        await db.flush()

        custom = body.email_body or ""
        ok = await send_screening_invite_email(
            db, current_user, invite, body.title, custom, company_name
        )
        if ok:
            sent += 1
        invites_out.append(invite_to_dict(invite, task))

    await db.commit()
    return {
        "sourcing_request_id": str(sr.id),
        "emails_requested": len(emails),
        "emails_sent": sent,
        "invites": invites_out,
    }


@router.get("/invites")
async def list_hm_invite_progress(
    sourcing_request_id: Optional[UUID] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    require_staff_approved(current_user)
    q = select(ScreeningInvite).options(selectinload(ScreeningInvite.sourcing_request))
    if is_hiring_manager(current_user) and not is_super_or_admin(current_user):
        q = q.where(ScreeningInvite.invited_by_id == current_user.id)
    if sourcing_request_id:
        q = q.where(ScreeningInvite.sourcing_request_id == sourcing_request_id)
    q = q.order_by(ScreeningInvite.created_at.desc())
    result = await db.execute(q)
    invites = result.scalars().all()
    items = []
    for inv in invites:
        tr = await db.execute(
            select(ScreeningTask).where(ScreeningTask.screening_invite_id == inv.id)
        )
        task = tr.scalar_one_or_none()
        d = invite_to_dict(inv, task)
        d["job_title"] = inv.sourcing_request.title if inv.sourcing_request else None
        d["detailed_results"] = (task.detailed_results if task else {}) or {}
        items.append(d)
    return {"items": items, "total": len(items)}


@router.get("/hm/sourcing-results")
async def hm_sourcing_results(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """HM: track Get Help to Source / sourcing requests and screened candidate outcomes."""
    await require_screening_dashboard_user(db, current_user)
    if not is_hiring_manager(current_user):
        raise HTTPException(status_code=403, detail="Hiring managers only")

    sr_result = await db.execute(
        select(SourcingRequest)
        .options(selectinload(SourcingRequest.job))
        .where(SourcingRequest.requested_by_id == current_user.id)
        .order_by(SourcingRequest.created_at.desc())
    )
    requests = sr_result.scalars().all()
    sr_ids = [r.id for r in requests]
    tasks: list[ScreeningTask] = []
    if sr_ids:
        tr = await db.execute(
            select(ScreeningTask)
            .options(
                selectinload(ScreeningTask.job),
                selectinload(ScreeningTask.sourcing_request),
                selectinload(ScreeningTask.application).selectinload(JobApplication.applicant),
                selectinload(ScreeningTask.claimed_by),
            )
            .where(ScreeningTask.sourcing_request_id.in_(sr_ids))
            .order_by(ScreeningTask.created_at.desc())
        )
        tasks = list(tr.scalars().all())

    req_items = []
    for r in requests:
        d = sourcing_request_to_dict(r)
        counts: dict[str, int] = {}
        for t in tasks:
            if t.sourcing_request_id == r.id and t.status:
                key = t.status.value
                counts[key] = counts.get(key, 0) + 1
        d["task_counts"] = counts
        req_items.append(d)

    return {
        "requests": req_items,
        "tasks": [task_to_dict(t) for t in tasks],
        "total_tasks": len(tasks),
    }


@router.get("/invites/public/{token}")
async def get_public_invite_info(token: str, db: AsyncSession = Depends(get_db)) -> Any:
    row = await db.execute(
        select(ScreeningInvite)
        .options(selectinload(ScreeningInvite.sourcing_request))
        .where(ScreeningInvite.invite_token == token)
    )
    invite = row.scalar_one_or_none()
    if not invite:
        raise HTTPException(status_code=404, detail="Invite not found")
    sr = invite.sourcing_request
    return {
        "candidate_email": invite.candidate_email,
        "job_title": sr.title if sr else None,
        "company_id": str(invite.company_id) if invite.company_id else None,
        "signup_url": await build_signup_url(token),
    }


@router.get("/hm/email-signature")
async def get_email_signature(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    require_staff_approved(current_user)
    sig = await get_hm_signature(db, current_user.id)
    if not sig:
        return {"sender_name": None, "sender_title": None, "sender_phone": None, "signature_html": None}
    return {
        "sender_name": sig.sender_name,
        "sender_title": sig.sender_title,
        "sender_phone": sig.sender_phone,
        "signature_html": sig.signature_html,
    }


@router.put("/hm/email-signature")
async def update_email_signature(
    body: HmEmailSignatureUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    require_staff_approved(current_user)
    if not is_hiring_manager(current_user):
        raise HTTPException(status_code=403, detail="Hiring managers only")
    row = await db.execute(select(HmEmailSignature).where(HmEmailSignature.user_id == current_user.id))
    sig = row.scalar_one_or_none()
    if not sig:
        sig = HmEmailSignature(user_id=current_user.id)
        db.add(sig)
    if body.sender_name is not None:
        sig.sender_name = body.sender_name
    if body.sender_title is not None:
        sig.sender_title = body.sender_title
    if body.sender_phone is not None:
        sig.sender_phone = body.sender_phone
    if body.signature_html is not None:
        sig.signature_html = body.signature_html
    await db.commit()
    await db.refresh(sig)
    return {"status": "saved"}


@router.get("/enterprise/tasks")
async def list_enterprise_tasks(
    pool: str = Query("pending"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Tech Screener — Enterprise Verification Dashboard."""
    require_staff_approved(current_user)
    if not await can_access_tech_screener_portal(db, current_user):
        raise HTTPException(status_code=403, detail="Tech screener access only")

    status_map = {
        "pending": [ScreeningTaskStatus.OPEN, ScreeningTaskStatus.CLAIMED, ScreeningTaskStatus.PENDING_REQ_TEAM],
        "selected": [ScreeningTaskStatus.SELECTED],
        "rejected": [ScreeningTaskStatus.REJECTED],
    }
    statuses = status_map.get(pool, status_map["pending"])
    query = (
        select(ScreeningTask)
        .options(
            selectinload(ScreeningTask.job),
            selectinload(ScreeningTask.sourcing_request),
            selectinload(ScreeningTask.application).selectinload(JobApplication.applicant),
            selectinload(ScreeningTask.claimed_by),
            selectinload(ScreeningTask.candidate_user),
        )
        .where(
            ScreeningTask.task_type == ScreeningTaskType.ENTERPRISE_VERIFICATION,
            ScreeningTask.status.in_(statuses),
        )
        .order_by(ScreeningTask.created_at.desc())
    )
    scope = await company_scope_for_tech_screener(db, current_user)
    query = await apply_task_company_scope(query, scope)
    result = await db.execute(query)
    tasks = result.scalars().all()
    return {"items": [task_to_dict(t) for t in tasks], "total": len(tasks)}


@router.post("/companies/{company_id}/hm-invites")
async def invite_company_hms(
    company_id: UUID,
    body: CompanyHmInviteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Company admin invites employees as Hiring Managers (bulk or single)."""
    admin_check = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.company_id == company_id,
            CompanyAdmin.user_id == current_user.id,
        )
    )
    if not admin_check.scalar_one_or_none() and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorized")

    comp_row = await db.execute(select(Company).where(Company.id == company_id))
    company = comp_row.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    emails = _parse_emails(body.emails)
    from app.core.email import send_email
    from app.services.screening_invite_service import _frontend_base

    sent = 0
    created = []
    for email in emails:
        token = generate_token()
        inv = CompanyHmInvite(
            company_id=company_id,
            invited_by_id=current_user.id,
            email=email,
            invite_token=token,
            status="sent",
            sent_at=datetime.utcnow(),
        )
        db.add(inv)
        await db.flush()
        signup_url = f"{_frontend_base()}/signup?role=hr&company_hm_invite={token}"
        html = f"""<p>You are invited to join <strong>{company.name}</strong> on VerTechie as a Hiring Manager.</p>
        <p><a href="{signup_url}">Create your account</a></p>"""
        if await send_email(email, f"Join {company.name} on VerTechie", html):
            sent += 1
        created.append({"email": email, "token": token})

    await db.commit()
    return {"invited": len(emails), "emails_sent": sent, "items": created}
