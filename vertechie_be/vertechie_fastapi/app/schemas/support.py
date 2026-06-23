"""Pydantic schemas for Help Center & Customer Support."""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.support import TicketPriority, TicketStatus, TicketType


# ——— FAQ ———

class FAQCategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    sort_order: int
    faq_count: int = 0

    class Config:
        from_attributes = True


class FAQListItem(BaseModel):
    id: UUID
    category_id: UUID
    category_name: Optional[str] = None
    question: str
    answer: str
    keywords: Optional[str] = None
    helpful_count: int
    not_helpful_count: int
    view_count: int
    user_feedback: Optional[bool] = None

    class Config:
        from_attributes = True


class FAQCreate(BaseModel):
    category_id: UUID
    question: str = Field(..., min_length=5, max_length=500)
    answer: str = Field(..., min_length=10)
    keywords: Optional[str] = None
    sort_order: int = 0
    is_published: bool = True


class FAQUpdate(BaseModel):
    category_id: Optional[UUID] = None
    question: Optional[str] = Field(None, min_length=5, max_length=500)
    answer: Optional[str] = Field(None, min_length=10)
    keywords: Optional[str] = None
    sort_order: Optional[int] = None
    is_published: Optional[bool] = None


class FAQFeedbackCreate(BaseModel):
    is_helpful: bool


class FAQCategoryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    description: Optional[str] = None
    sort_order: int = 0


# ——— Tickets ———

class TicketMessageCreate(BaseModel):
    body: str = Field(..., min_length=1)
    is_internal: bool = False


class TicketCreate(BaseModel):
    subject: str = Field(..., min_length=5, max_length=300)
    description: str = Field(..., min_length=10)
    ticket_type: TicketType = TicketType.SUPPORT
    priority: TicketPriority = TicketPriority.MEDIUM
    category: Optional[str] = None


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_to_id: Optional[UUID] = None
    category: Optional[str] = None


class TicketMessageResponse(BaseModel):
    id: UUID
    body: str
    is_internal: bool
    is_staff_reply: bool
    author_id: Optional[UUID] = None
    author_name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TicketListItem(BaseModel):
    id: UUID
    ticket_number: str
    subject: str
    ticket_type: TicketType
    status: TicketStatus
    priority: TicketPriority
    category: Optional[str] = None
    user_id: UUID
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    assigned_to_id: Optional[UUID] = None
    assigned_to_name: Optional[str] = None
    message_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TicketDetailResponse(TicketListItem):
    description: str
    resolved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    messages: List[TicketMessageResponse] = []


class SupportDashboardStats(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    waiting_for_user_tickets: int
    resolved_tickets: int
    closed_tickets: int
    unassigned_tickets: int
    feedback_tickets: int
    complaint_tickets: int
