"""Business logic for Help Center & Customer Support."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Set
from uuid import UUID

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.permissions import collect_effective_permission_codes, user_has_permission
from app.models.notification import Notification, NotificationType
from app.models.support import (
    FAQ,
    FAQCategory,
    FAQFeedback,
    SupportTicket,
    TicketMessage,
    TicketStatus,
)
from app.models.user import User


SUPPORT_PERMISSIONS = frozenset({"view_support_tickets", "manage_support_tickets"})


def user_display_name(user: User | None) -> str:
    if not user:
        return "Unknown"
    parts = [user.first_name or "", user.last_name or ""]
    name = " ".join(p for p in parts if p).strip()
    return name or user.email or "User"


async def is_support_staff(db: AsyncSession, user: User) -> bool:
    if user.is_superuser:
        return True
    admin_roles = [str(r).lower() for r in (user.admin_roles or [])]
    if "support_admin" in admin_roles:
        return True
    eff = await collect_effective_permission_codes(db, user)
    return user_has_permission(eff, "manage_support_tickets") or user_has_permission(
        eff, "view_support_tickets"
    )


async def get_support_staff_user_ids(db: AsyncSession) -> List[UUID]:
    result = await db.execute(
        select(User).options(selectinload(User.roles)).where(User.is_active.is_(True))
    )
    users = result.scalars().all()
    ids: List[UUID] = []
    for u in users:
        if await is_support_staff(db, u):
            ids.append(u.id)
    return ids


async def generate_ticket_number(db: AsyncSession) -> str:
    today = datetime.utcnow().strftime("%Y%m%d")
    prefix = f"VT-{today}-"
    result = await db.execute(
        select(func.count(SupportTicket.id)).where(
            SupportTicket.ticket_number.like(f"{prefix}%")
        )
    )
    count = (result.scalar() or 0) + 1
    return f"{prefix}{count:04d}"


async def notify_user(
    db: AsyncSession,
    *,
    user_id: UUID,
    title: str,
    message: str,
    notification_type: NotificationType,
    ticket_id: UUID,
    link: str,
) -> None:
    db.add(
        Notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type=notification_type,
            link=link,
            reference_id=ticket_id,
            reference_type="support_ticket",
        )
    )


async def notify_support_staff(
    db: AsyncSession,
    *,
    title: str,
    message: str,
    notification_type: NotificationType,
    ticket_id: UUID,
    link: str,
    exclude_user_id: Optional[UUID] = None,
) -> None:
    staff_ids = await get_support_staff_user_ids(db)
    for uid in staff_ids:
        if exclude_user_id and uid == exclude_user_id:
            continue
        await notify_user(
            db,
            user_id=uid,
            title=title,
            message=message,
            notification_type=notification_type,
            ticket_id=ticket_id,
            link=link,
        )


def ticket_user_link(ticket_id: UUID) -> str:
    return f"/help/tickets/{ticket_id}"


def ticket_staff_link(ticket_id: UUID) -> str:
    return f"/vertechie/support/tickets/{ticket_id}"


async def apply_status_timestamps(ticket: SupportTicket, new_status: TicketStatus) -> None:
    if new_status == TicketStatus.RESOLVED and not ticket.resolved_at:
        ticket.resolved_at = datetime.utcnow()
    if new_status == TicketStatus.CLOSED and not ticket.closed_at:
        ticket.closed_at = datetime.utcnow()


def build_ticket_list_item(
    ticket: SupportTicket,
    *,
    user_name: Optional[str] = None,
    user_email: Optional[str] = None,
    assigned_to_name: Optional[str] = None,
    message_count: int = 0,
) -> dict:
    return {
        "id": ticket.id,
        "ticket_number": ticket.ticket_number,
        "subject": ticket.subject,
        "ticket_type": ticket.ticket_type,
        "status": ticket.status,
        "priority": ticket.priority,
        "category": ticket.category,
        "user_id": ticket.user_id,
        "user_name": user_name,
        "user_email": user_email,
        "assigned_to_id": ticket.assigned_to_id,
        "assigned_to_name": assigned_to_name,
        "message_count": message_count,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
    }


def build_message_response(msg: TicketMessage) -> dict:
    author = msg.author
    return {
        "id": msg.id,
        "body": msg.body,
        "is_internal": msg.is_internal,
        "is_staff_reply": msg.is_staff_reply,
        "author_id": msg.author_id,
        "author_name": user_display_name(author) if author else "System",
        "created_at": msg.created_at,
    }
