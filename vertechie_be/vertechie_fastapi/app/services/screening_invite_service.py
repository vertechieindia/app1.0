"""Screening invite emails, signup linking, and techie approval hooks."""

from __future__ import annotations

import secrets
from datetime import datetime
from typing import Any, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.email import send_email
from app.models.screening import (
    HmEmailSignature,
    ScreeningInvite,
    ScreeningInviteStatus,
    ScreeningTask,
    ScreeningTaskStatus,
    ScreeningTaskType,
    SourcingRequest,
    RequirementType,
)
from app.models.user import User, VerificationStatus


DEFAULT_SCREEN_TEMPLATE = """<p>Hello,</p>
<p>{{company_line}}We are reaching out through <strong>VerTechie</strong> regarding the role: <strong>{{job_title}}</strong>.</p>
<p>Please create your verified techie profile on VerTechie so our team can complete the screening requested by the hiring team.</p>
<p>{{custom_message}}</p>
<p><a href="{{signup_url}}" style="display:inline-block;background:#0d47a1;color:#fff;padding:12px 24px;text-decoration:none;border-radius:6px;">Create Your VerTechie Profile</a></p>
<p>VerTechie may contact you as part of the verification process.</p>
{{signature_block}}
"""


def _frontend_base() -> str:
    return (get_settings().FRONTEND_URL or "http://localhost:5173").rstrip("/")


def generate_token() -> str:
    return secrets.token_urlsafe(32)


async def get_hm_signature(db: AsyncSession, user_id: UUID) -> Optional[HmEmailSignature]:
    row = await db.execute(select(HmEmailSignature).where(HmEmailSignature.user_id == user_id))
    return row.scalar_one_or_none()


def render_signature_block(sig: Optional[HmEmailSignature], hm: User) -> str:
    if sig and sig.signature_html:
        return f'<div style="margin-top:24px;border-top:1px solid #ddd;padding-top:12px;">{sig.signature_html}</div>'
    name = (sig.sender_name if sig else None) or f"{hm.first_name or ''} {hm.last_name or ''}".strip() or hm.email
    title = sig.sender_title if sig else ""
    phone = sig.sender_phone if sig else ""
    lines = [f"<strong>{name}</strong>"]
    if title:
        lines.append(title)
    if phone:
        lines.append(phone)
    return f'<div style="margin-top:24px;border-top:1px solid #ddd;padding-top:12px;">{"<br/>".join(lines)}</div>'


async def build_signup_url(invite_token: str) -> str:
    return f"{_frontend_base()}/signup?role=techie&screening_invite={invite_token}"


async def send_screening_invite_email(
    db: AsyncSession,
    hm: User,
    invite: ScreeningInvite,
    job_title: str,
    custom_message: str = "",
    company_name: str = "",
) -> bool:
    sig = await get_hm_signature(db, hm.id)
    signup_url = await build_signup_url(invite.invite_token)
    company_line = f"{company_name} is working with VerTechie. " if company_name else ""
    signature_block = render_signature_block(sig, hm)
    html = (
        DEFAULT_SCREEN_TEMPLATE.replace("{{company_line}}", company_line)
        .replace("{{job_title}}", job_title)
        .replace("{{custom_message}}", custom_message or "")
        .replace("{{signup_url}}", signup_url)
        .replace("{{signature_block}}", signature_block)
    )
    subject = invite.email_subject or f"VerTechie profile invitation — {job_title}"
    ok = await send_email(invite.candidate_email, subject, html)
    if ok:
        invite.email_body_sent = html
        invite.invite_sent_at = datetime.utcnow()
        invite.status = ScreeningInviteStatus.INVITE_SENT
    return ok


async def link_invite_on_signup(
    db: AsyncSession,
    user: User,
    invite_token: str,
) -> Optional[ScreeningInvite]:
    row = await db.execute(
        select(ScreeningInvite).where(ScreeningInvite.invite_token == invite_token.strip())
    )
    invite = row.scalar_one_or_none()
    if not invite:
        return None
    if invite.candidate_email.lower() != user.email.lower():
        return None
    invite.candidate_user_id = user.id
    invite.signup_submitted_at = datetime.utcnow()
    invite.status = ScreeningInviteStatus.SIGNUP_SUBMITTED
    task_row = await db.execute(
        select(ScreeningTask).where(ScreeningTask.screening_invite_id == invite.id)
    )
    task = task_row.scalar_one_or_none()
    if task:
        task.candidate_user_id = user.id
        task.candidate_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
        task.candidate_email = user.email
    await db.flush()
    return invite


async def handle_techie_verification_review(
    db: AsyncSession,
    user: User,
    approved: bool,
) -> None:
    """After techie admin approve/deny — advance invite + screening task."""
    rows = await db.execute(
        select(ScreeningInvite).where(ScreeningInvite.candidate_user_id == user.id)
    )
    invites = rows.scalars().all()
    for invite in invites:
        if approved:
            invite.status = ScreeningInviteStatus.APPROVED
            invite.reviewed_at = datetime.utcnow()
            task_row = await db.execute(
                select(ScreeningTask).where(ScreeningTask.screening_invite_id == invite.id)
            )
            task = task_row.scalar_one_or_none()
            if task:
                task.status = ScreeningTaskStatus.OPEN
                invite.status = ScreeningInviteStatus.SCREENING_PENDING
        else:
            invite.status = ScreeningInviteStatus.DENIED
            invite.reviewed_at = datetime.utcnow()
            task_row = await db.execute(
                select(ScreeningTask).where(ScreeningTask.screening_invite_id == invite.id)
            )
            task = task_row.scalar_one_or_none()
            if task:
                task.status = ScreeningTaskStatus.REJECTED
    await db.flush()


async def sync_invite_on_screening_complete(
    db: AsyncSession,
    task: ScreeningTask,
    selected: bool,
) -> None:
    if not task.screening_invite_id:
        return
    row = await db.execute(
        select(ScreeningInvite).where(ScreeningInvite.id == task.screening_invite_id)
    )
    invite = row.scalar_one_or_none()
    if not invite:
        return
    invite.status = (
        ScreeningInviteStatus.SCREENING_SELECTED if selected else ScreeningInviteStatus.SCREENING_REJECTED
    )
    await db.flush()


def invite_to_dict(invite: ScreeningInvite, task: Optional[ScreeningTask] = None) -> dict[str, Any]:
    return {
        "id": str(invite.id),
        "sourcing_request_id": str(invite.sourcing_request_id),
        "candidate_email": invite.candidate_email,
        "status": invite.status.value if invite.status else None,
        "invite_sent_at": invite.invite_sent_at.isoformat() if invite.invite_sent_at else None,
        "signup_submitted_at": invite.signup_submitted_at.isoformat() if invite.signup_submitted_at else None,
        "reviewed_at": invite.reviewed_at.isoformat() if invite.reviewed_at else None,
        "screening_task_id": str(task.id) if task else None,
        "screening_task_status": task.status.value if task and task.status else None,
        "invite_token": invite.invite_token,
    }
