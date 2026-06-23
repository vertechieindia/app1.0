"""
Help Center & Customer Support API.

User routes: /support/*
Staff routes: /admin/support/*
"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from slugify import slugify
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.notification import NotificationType
from app.models.support import (
    FAQ,
    FAQCategory,
    FAQFeedback,
    SupportTicket,
    TicketMessage,
    TicketStatus,
    TicketType,
)
from app.models.user import User
from app.schemas.support import (
    FAQCategoryCreate,
    FAQCategoryResponse,
    FAQCreate,
    FAQFeedbackCreate,
    FAQListItem,
    FAQUpdate,
    SupportDashboardStats,
    TicketCreate,
    TicketDetailResponse,
    TicketListItem,
    TicketMessageCreate,
    TicketMessageResponse,
    TicketUpdate,
)
from app.services.support_service import (
    apply_status_timestamps,
    build_message_response,
    build_ticket_list_item,
    generate_ticket_number,
    is_support_staff,
    notify_support_staff,
    notify_user,
    ticket_staff_link,
    ticket_user_link,
    user_display_name,
)

router = APIRouter(prefix="/support", tags=["Help Center"])
admin_router = APIRouter(prefix="/admin/support", tags=["Customer Support Dashboard"])


async def require_support_staff(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not await is_support_staff(db, current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Customer Support access required")
    return current_user


# ——— FAQ (public to authenticated users) ———

@router.get("/faqs/categories", response_model=List[FAQCategoryResponse])
async def list_faq_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(FAQCategory)
        .where(FAQCategory.is_active.is_(True))
        .order_by(FAQCategory.sort_order, FAQCategory.name)
    )
    categories = result.scalars().all()
    out: List[FAQCategoryResponse] = []
    for cat in categories:
        count_result = await db.execute(
            select(func.count(FAQ.id)).where(
                FAQ.category_id == cat.id,
                FAQ.is_published.is_(True),
            )
        )
        out.append(
            FAQCategoryResponse(
                id=cat.id,
                name=cat.name,
                slug=cat.slug,
                description=cat.description,
                sort_order=cat.sort_order,
                faq_count=count_result.scalar() or 0,
            )
        )
    return out


@router.get("/faqs", response_model=List[FAQListItem])
async def list_faqs(
    q: Optional[str] = Query(None, description="Search keyword"),
    category_id: Optional[UUID] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(FAQ, FAQCategory.name)
        .join(FAQCategory, FAQ.category_id == FAQCategory.id)
        .where(FAQ.is_published.is_(True), FAQCategory.is_active.is_(True))
    )
    if category_id:
        stmt = stmt.where(FAQ.category_id == category_id)
    if q:
        pattern = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                FAQ.question.ilike(pattern),
                FAQ.answer.ilike(pattern),
                FAQ.keywords.ilike(pattern),
            )
        )
    stmt = stmt.order_by(FAQ.sort_order, FAQ.question)
    result = await db.execute(stmt)
    rows = result.all()

    feedback_result = await db.execute(
        select(FAQFeedback).where(FAQFeedback.user_id == current_user.id)
    )
    feedback_map = {f.faq_id: f.is_helpful for f in feedback_result.scalars().all()}

    return [
        FAQListItem(
            id=faq.id,
            category_id=faq.category_id,
            category_name=cat_name,
            question=faq.question,
            answer=faq.answer,
            keywords=faq.keywords,
            helpful_count=faq.helpful_count,
            not_helpful_count=faq.not_helpful_count,
            view_count=faq.view_count,
            user_feedback=feedback_map.get(faq.id),
        )
        for faq, cat_name in rows
    ]


@router.get("/faqs/{faq_id}", response_model=FAQListItem)
async def get_faq(
    faq_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(FAQ, FAQCategory.name)
        .join(FAQCategory, FAQ.category_id == FAQCategory.id)
        .where(FAQ.id == faq_id, FAQ.is_published.is_(True))
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="FAQ not found")
    faq, cat_name = row
    faq.view_count = (faq.view_count or 0) + 1

    fb = await db.execute(
        select(FAQFeedback).where(
            FAQFeedback.faq_id == faq_id,
            FAQFeedback.user_id == current_user.id,
        )
    )
    feedback = fb.scalar_one_or_none()

    return FAQListItem(
        id=faq.id,
        category_id=faq.category_id,
        category_name=cat_name,
        question=faq.question,
        answer=faq.answer,
        keywords=faq.keywords,
        helpful_count=faq.helpful_count,
        not_helpful_count=faq.not_helpful_count,
        view_count=faq.view_count,
        user_feedback=feedback.is_helpful if feedback else None,
    )


@router.post("/faqs/{faq_id}/feedback")
async def submit_faq_feedback(
    faq_id: UUID,
    payload: FAQFeedbackCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(select(FAQ).where(FAQ.id == faq_id, FAQ.is_published.is_(True)))
    faq = result.scalar_one_or_none()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")

    existing = await db.execute(
        select(FAQFeedback).where(
            FAQFeedback.faq_id == faq_id,
            FAQFeedback.user_id == current_user.id,
        )
    )
    fb = existing.scalar_one_or_none()
    if fb:
        if fb.is_helpful != payload.is_helpful:
            if fb.is_helpful:
                faq.helpful_count = max(0, faq.helpful_count - 1)
                faq.not_helpful_count += 1
            else:
                faq.not_helpful_count = max(0, faq.not_helpful_count - 1)
                faq.helpful_count += 1
            fb.is_helpful = payload.is_helpful
    else:
        db.add(
            FAQFeedback(
                faq_id=faq_id,
                user_id=current_user.id,
                is_helpful=payload.is_helpful,
            )
        )
        if payload.is_helpful:
            faq.helpful_count += 1
        else:
            faq.not_helpful_count += 1

    return {"success": True, "is_helpful": payload.is_helpful}


# ——— User tickets ———

@router.get("/tickets/my", response_model=List[TicketListItem])
async def list_my_tickets(
    status_filter: Optional[TicketStatus] = Query(None, alias="status"),
    ticket_type: Optional[TicketType] = Query(None, alias="type"),
    q: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = (
        select(SupportTicket)
        .options(selectinload(SupportTicket.assigned_to), selectinload(SupportTicket.messages))
        .where(SupportTicket.user_id == current_user.id)
    )
    if status_filter:
        stmt = stmt.where(SupportTicket.status == status_filter)
    if ticket_type:
        stmt = stmt.where(SupportTicket.ticket_type == ticket_type)
    if q:
        pattern = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(SupportTicket.subject.ilike(pattern), SupportTicket.ticket_number.ilike(pattern))
        )
    stmt = stmt.order_by(SupportTicket.created_at.desc())
    result = await db.execute(stmt)
    tickets = result.scalars().all()
    return [
        TicketListItem(
            **build_ticket_list_item(
                t,
                assigned_to_name=user_display_name(t.assigned_to),
                message_count=len(t.messages or []),
            )
        )
        for t in tickets
    ]


@router.get("/tickets/my/{ticket_id}", response_model=TicketDetailResponse)
async def get_my_ticket(
    ticket_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(SupportTicket)
        .options(
            selectinload(SupportTicket.assigned_to),
            selectinload(SupportTicket.messages).selectinload(TicketMessage.author),
        )
        .where(SupportTicket.id == ticket_id, SupportTicket.user_id == current_user.id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    visible_messages = [m for m in ticket.messages if not m.is_internal]
    return TicketDetailResponse(
        **build_ticket_list_item(
            ticket,
            assigned_to_name=user_display_name(ticket.assigned_to),
            message_count=len(visible_messages),
        ),
        description=ticket.description,
        resolved_at=ticket.resolved_at,
        closed_at=ticket.closed_at,
        messages=[TicketMessageResponse(**build_message_response(m)) for m in visible_messages],
    )


@router.post("/tickets", response_model=TicketDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_ticket(
    payload: TicketCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ticket_number = await generate_ticket_number(db)
    ticket = SupportTicket(
        ticket_number=ticket_number,
        user_id=current_user.id,
        subject=payload.subject.strip(),
        description=payload.description.strip(),
        ticket_type=payload.ticket_type,
        priority=payload.priority,
        category=payload.category,
        status=TicketStatus.OPEN,
    )
    db.add(ticket)
    await db.flush()

    await notify_user(
        db,
        user_id=current_user.id,
        title="Support ticket created",
        message=f"Your ticket {ticket_number} has been submitted. Our team will respond soon.",
        notification_type=NotificationType.SUPPORT_TICKET_CREATED,
        ticket_id=ticket.id,
        link=ticket_user_link(ticket.id),
    )
    await notify_support_staff(
        db,
        title="New support ticket",
        message=f"{user_display_name(current_user)} submitted: {ticket.subject}",
        notification_type=NotificationType.SUPPORT_TICKET_CREATED,
        ticket_id=ticket.id,
        link=ticket_staff_link(ticket.id),
        exclude_user_id=current_user.id,
    )

    return TicketDetailResponse(
        **build_ticket_list_item(ticket, message_count=0),
        description=ticket.description,
        messages=[],
    )


@router.post("/tickets/my/{ticket_id}/messages", response_model=TicketMessageResponse)
async def reply_to_my_ticket(
    ticket_id: UUID,
    payload: TicketMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(SupportTicket)
        .options(selectinload(SupportTicket.assigned_to))
        .where(SupportTicket.id == ticket_id, SupportTicket.user_id == current_user.id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if ticket.status in (TicketStatus.CLOSED, TicketStatus.RESOLVED):
        raise HTTPException(status_code=400, detail="Cannot reply to a closed or resolved ticket")

    msg = TicketMessage(
        ticket_id=ticket.id,
        author_id=current_user.id,
        body=payload.body.strip(),
        is_staff_reply=False,
        is_internal=False,
    )
    db.add(msg)
    if ticket.status == TicketStatus.WAITING_FOR_USER:
        ticket.status = TicketStatus.IN_PROGRESS

    if ticket.assigned_to_id:
        await notify_user(
            db,
            user_id=ticket.assigned_to_id,
            title=f"User replied on {ticket.ticket_number}",
            message=payload.body.strip()[:200],
            notification_type=NotificationType.SUPPORT_TICKET_RESPONSE,
            ticket_id=ticket.id,
            link=ticket_staff_link(ticket.id),
        )
    else:
        await notify_support_staff(
            db,
            title=f"User replied on {ticket.ticket_number}",
            message=payload.body.strip()[:200],
            notification_type=NotificationType.SUPPORT_TICKET_RESPONSE,
            ticket_id=ticket.id,
            link=ticket_staff_link(ticket.id),
            exclude_user_id=current_user.id,
        )

    await db.flush()
    await db.refresh(msg, ["author"])
    return TicketMessageResponse(**build_message_response(msg))


# ——— Staff dashboard ———

@admin_router.get("/dashboard/stats", response_model=SupportDashboardStats)
async def dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    total = await db.scalar(select(func.count(SupportTicket.id))) or 0
    by_status = {}
    for st in TicketStatus:
        count = await db.scalar(
            select(func.count(SupportTicket.id)).where(SupportTicket.status == st)
        ) or 0
        by_status[st.value] = count
    unassigned = await db.scalar(
        select(func.count(SupportTicket.id)).where(SupportTicket.assigned_to_id.is_(None))
    ) or 0
    feedback = await db.scalar(
        select(func.count(SupportTicket.id)).where(
            SupportTicket.ticket_type.in_([TicketType.FEEDBACK, TicketType.SUGGESTION])
        )
    ) or 0
    complaints = await db.scalar(
        select(func.count(SupportTicket.id)).where(SupportTicket.ticket_type == TicketType.COMPLAINT)
    ) or 0
    return SupportDashboardStats(
        total_tickets=total,
        open_tickets=by_status.get("open", 0),
        in_progress_tickets=by_status.get("in_progress", 0),
        waiting_for_user_tickets=by_status.get("waiting_for_user", 0),
        resolved_tickets=by_status.get("resolved", 0),
        closed_tickets=by_status.get("closed", 0),
        unassigned_tickets=unassigned,
        feedback_tickets=feedback,
        complaint_tickets=complaints,
    )


@admin_router.get("/tickets", response_model=List[TicketListItem])
async def list_all_tickets(
    status_filter: Optional[TicketStatus] = Query(None, alias="status"),
    ticket_type: Optional[TicketType] = Query(None, alias="type"),
    priority: Optional[str] = Query(None),
    assigned_to_id: Optional[UUID] = Query(None),
    unassigned_only: bool = Query(False),
    q: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    stmt = (
        select(SupportTicket)
        .options(
            selectinload(SupportTicket.user),
            selectinload(SupportTicket.assigned_to),
            selectinload(SupportTicket.messages),
        )
    )
    if status_filter:
        stmt = stmt.where(SupportTicket.status == status_filter)
    if ticket_type:
        stmt = stmt.where(SupportTicket.ticket_type == ticket_type)
    if priority:
        stmt = stmt.where(SupportTicket.priority == priority)
    if assigned_to_id:
        stmt = stmt.where(SupportTicket.assigned_to_id == assigned_to_id)
    if unassigned_only:
        stmt = stmt.where(SupportTicket.assigned_to_id.is_(None))
    if q:
        pattern = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                SupportTicket.subject.ilike(pattern),
                SupportTicket.ticket_number.ilike(pattern),
                SupportTicket.description.ilike(pattern),
            )
        )
    stmt = stmt.order_by(SupportTicket.created_at.desc())
    result = await db.execute(stmt)
    tickets = result.scalars().all()
    return [
        TicketListItem(
            **build_ticket_list_item(
                t,
                user_name=user_display_name(t.user),
                user_email=t.user.email if t.user else None,
                assigned_to_name=user_display_name(t.assigned_to),
                message_count=len(t.messages or []),
            )
        )
        for t in tickets
    ]


@admin_router.get("/tickets/{ticket_id}", response_model=TicketDetailResponse)
async def get_ticket_admin(
    ticket_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    result = await db.execute(
        select(SupportTicket)
        .options(
            selectinload(SupportTicket.user),
            selectinload(SupportTicket.assigned_to),
            selectinload(SupportTicket.messages).selectinload(TicketMessage.author),
        )
        .where(SupportTicket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return TicketDetailResponse(
        **build_ticket_list_item(
            ticket,
            user_name=user_display_name(ticket.user),
            user_email=ticket.user.email if ticket.user else None,
            assigned_to_name=user_display_name(ticket.assigned_to),
            message_count=len(ticket.messages or []),
        ),
        description=ticket.description,
        resolved_at=ticket.resolved_at,
        closed_at=ticket.closed_at,
        messages=[TicketMessageResponse(**build_message_response(m)) for m in ticket.messages],
    )


@admin_router.patch("/tickets/{ticket_id}", response_model=TicketDetailResponse)
async def update_ticket(
    ticket_id: UUID,
    payload: TicketUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    result = await db.execute(
        select(SupportTicket)
        .options(
            selectinload(SupportTicket.user),
            selectinload(SupportTicket.assigned_to),
            selectinload(SupportTicket.messages).selectinload(TicketMessage.author),
        )
        .where(SupportTicket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    old_status = ticket.status
    old_assignee = ticket.assigned_to_id

    if payload.status is not None:
        await apply_status_timestamps(ticket, payload.status)
        ticket.status = payload.status
    if payload.priority is not None:
        ticket.priority = payload.priority
    if payload.category is not None:
        ticket.category = payload.category
    if payload.assigned_to_id is not None:
        assignee = await db.get(User, payload.assigned_to_id)
        if not assignee:
            raise HTTPException(status_code=404, detail="Assignee not found")
        ticket.assigned_to_id = payload.assigned_to_id

    if payload.assigned_to_id is not None and ticket.assigned_to_id != old_assignee:
        await notify_user(
            db,
            user_id=ticket.assigned_to_id,
            title=f"Ticket assigned: {ticket.ticket_number}",
            message=ticket.subject,
            notification_type=NotificationType.SUPPORT_TICKET_ASSIGNED,
            ticket_id=ticket.id,
            link=ticket_staff_link(ticket.id),
        )
        await notify_user(
            db,
            user_id=ticket.user_id,
            title="Support agent assigned",
            message=f"Your ticket {ticket.ticket_number} has been assigned to our support team.",
            notification_type=NotificationType.SUPPORT_TICKET_ASSIGNED,
            ticket_id=ticket.id,
            link=ticket_user_link(ticket.id),
        )

    if payload.status is not None and payload.status != old_status:
        status_label = payload.status.value.replace("_", " ").title()
        await notify_user(
            db,
            user_id=ticket.user_id,
            title=f"Ticket status: {status_label}",
            message=f"Your ticket {ticket.ticket_number} is now {status_label}.",
            notification_type=NotificationType.SUPPORT_TICKET_STATUS_CHANGED,
            ticket_id=ticket.id,
            link=ticket_user_link(ticket.id),
        )
        if payload.status == TicketStatus.RESOLVED:
            await notify_user(
                db,
                user_id=ticket.user_id,
                title="Ticket resolved",
                message=f"Your ticket {ticket.ticket_number} has been resolved.",
                notification_type=NotificationType.SUPPORT_TICKET_RESOLVED,
                ticket_id=ticket.id,
                link=ticket_user_link(ticket.id),
            )
        if payload.status == TicketStatus.CLOSED:
            await notify_user(
                db,
                user_id=ticket.user_id,
                title="Ticket closed",
                message=f"Your ticket {ticket.ticket_number} has been closed.",
                notification_type=NotificationType.SUPPORT_TICKET_CLOSED,
                ticket_id=ticket.id,
                link=ticket_user_link(ticket.id),
            )

    return TicketDetailResponse(
        **build_ticket_list_item(
            ticket,
            user_name=user_display_name(ticket.user),
            user_email=ticket.user.email if ticket.user else None,
            assigned_to_name=user_display_name(ticket.assigned_to),
            message_count=len(ticket.messages or []),
        ),
        description=ticket.description,
        resolved_at=ticket.resolved_at,
        closed_at=ticket.closed_at,
        messages=[TicketMessageResponse(**build_message_response(m)) for m in ticket.messages],
    )


@admin_router.post("/tickets/{ticket_id}/messages", response_model=TicketMessageResponse)
async def staff_reply(
    ticket_id: UUID,
    payload: TicketMessageCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    result = await db.execute(
        select(SupportTicket).where(SupportTicket.id == ticket_id)
    )
    ticket = result.scalar_one_or_none()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    msg = TicketMessage(
        ticket_id=ticket.id,
        author_id=current_user.id,
        body=payload.body.strip(),
        is_staff_reply=True,
        is_internal=payload.is_internal,
    )
    db.add(msg)

    if not ticket.assigned_to_id:
        ticket.assigned_to_id = current_user.id
    if ticket.status == TicketStatus.OPEN:
        ticket.status = TicketStatus.IN_PROGRESS

    if not payload.is_internal:
        ticket.status = TicketStatus.WAITING_FOR_USER
        await notify_user(
            db,
            user_id=ticket.user_id,
            title=f"Reply on {ticket.ticket_number}",
            message=payload.body.strip()[:200],
            notification_type=NotificationType.SUPPORT_TICKET_RESPONSE,
            ticket_id=ticket.id,
            link=ticket_user_link(ticket.id),
        )

    await db.flush()
    await db.refresh(msg, ["author"])
    return TicketMessageResponse(**build_message_response(msg))


# ——— FAQ management (staff) ———

@admin_router.get("/faqs", response_model=List[FAQListItem])
async def admin_list_faqs(
    category_id: Optional[UUID] = Query(None),
    q: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    stmt = select(FAQ, FAQCategory.name).join(FAQCategory, FAQ.category_id == FAQCategory.id)
    if category_id:
        stmt = stmt.where(FAQ.category_id == category_id)
    if q:
        pattern = f"%{q.strip()}%"
        stmt = stmt.where(or_(FAQ.question.ilike(pattern), FAQ.answer.ilike(pattern)))
    stmt = stmt.order_by(FAQ.sort_order, FAQ.question)
    result = await db.execute(stmt)
    return [
        FAQListItem(
            id=faq.id,
            category_id=faq.category_id,
            category_name=cat_name,
            question=faq.question,
            answer=faq.answer,
            keywords=faq.keywords,
            helpful_count=faq.helpful_count,
            not_helpful_count=faq.not_helpful_count,
            view_count=faq.view_count,
        )
        for faq, cat_name in result.all()
    ]


@admin_router.post("/faqs", response_model=FAQListItem, status_code=status.HTTP_201_CREATED)
async def create_faq(
    payload: FAQCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    cat = await db.get(FAQCategory, payload.category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    faq = FAQ(
        category_id=payload.category_id,
        question=payload.question.strip(),
        answer=payload.answer.strip(),
        keywords=payload.keywords,
        sort_order=payload.sort_order,
        is_published=payload.is_published,
    )
    db.add(faq)
    await db.flush()
    return FAQListItem(
        id=faq.id,
        category_id=faq.category_id,
        category_name=cat.name,
        question=faq.question,
        answer=faq.answer,
        keywords=faq.keywords,
        helpful_count=0,
        not_helpful_count=0,
        view_count=0,
    )


@admin_router.put("/faqs/{faq_id}", response_model=FAQListItem)
async def update_faq(
    faq_id: UUID,
    payload: FAQUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    result = await db.execute(
        select(FAQ, FAQCategory.name)
        .join(FAQCategory, FAQ.category_id == FAQCategory.id)
        .where(FAQ.id == faq_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="FAQ not found")
    faq, cat_name = row
    if payload.category_id is not None:
        faq.category_id = payload.category_id
    if payload.question is not None:
        faq.question = payload.question.strip()
    if payload.answer is not None:
        faq.answer = payload.answer.strip()
    if payload.keywords is not None:
        faq.keywords = payload.keywords
    if payload.sort_order is not None:
        faq.sort_order = payload.sort_order
    if payload.is_published is not None:
        faq.is_published = payload.is_published
    return FAQListItem(
        id=faq.id,
        category_id=faq.category_id,
        category_name=cat_name,
        question=faq.question,
        answer=faq.answer,
        keywords=faq.keywords,
        helpful_count=faq.helpful_count,
        not_helpful_count=faq.not_helpful_count,
        view_count=faq.view_count,
    )


@admin_router.delete("/faqs/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faq(
    faq_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    faq = await db.get(FAQ, faq_id)
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    await db.delete(faq)


@admin_router.post("/faqs/categories", response_model=FAQCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_faq_category(
    payload: FAQCategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_support_staff),
):
    slug = slugify(payload.name)
    existing = await db.execute(select(FAQCategory).where(FAQCategory.slug == slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Category already exists")
    cat = FAQCategory(
        name=payload.name.strip(),
        slug=slug,
        description=payload.description,
        sort_order=payload.sort_order,
    )
    db.add(cat)
    await db.flush()
    return FAQCategoryResponse(
        id=cat.id,
        name=cat.name,
        slug=cat.slug,
        description=cat.description,
        sort_order=cat.sort_order,
        faq_count=0,
    )
