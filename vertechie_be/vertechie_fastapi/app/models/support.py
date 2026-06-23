"""
Help Center & Customer Support models.
"""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum as SQLEnum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class TicketStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    WAITING_FOR_USER = "waiting_for_user"
    RESOLVED = "resolved"
    CLOSED = "closed"


class TicketType(str, enum.Enum):
    SUPPORT = "support"
    FEEDBACK = "feedback"
    SUGGESTION = "suggestion"
    COMPLAINT = "complaint"


class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class FAQCategory(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "faq_categories"

    name = Column(String(120), nullable=False, unique=True)
    slug = Column(String(140), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    faqs = relationship("FAQ", back_populates="category", cascade="all, delete-orphan")


class FAQ(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "faqs"

    category_id = Column(UUID(as_uuid=True), ForeignKey("faq_categories.id", ondelete="CASCADE"), nullable=False, index=True)
    question = Column(String(500), nullable=False)
    answer = Column(Text, nullable=False)
    keywords = Column(String(500), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    helpful_count = Column(Integer, default=0, nullable=False)
    not_helpful_count = Column(Integer, default=0, nullable=False)
    view_count = Column(Integer, default=0, nullable=False)

    category = relationship("FAQCategory", back_populates="faqs")
    feedback = relationship("FAQFeedback", back_populates="faq", cascade="all, delete-orphan")


class FAQFeedback(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "faq_feedback"
    __table_args__ = (UniqueConstraint("faq_id", "user_id", name="uq_faq_feedback_user"),)

    faq_id = Column(UUID(as_uuid=True), ForeignKey("faqs.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    is_helpful = Column(Boolean, nullable=False)

    faq = relationship("FAQ", back_populates="feedback")
    user = relationship("User", backref="faq_feedback")


class SupportTicket(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "support_tickets"

    ticket_number = Column(String(32), nullable=False, unique=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assigned_to_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    subject = Column(String(300), nullable=False)
    description = Column(Text, nullable=False)
    ticket_type = Column(SQLEnum(TicketType), default=TicketType.SUPPORT, nullable=False)
    status = Column(SQLEnum(TicketStatus), default=TicketStatus.OPEN, nullable=False, index=True)
    priority = Column(SQLEnum(TicketPriority), default=TicketPriority.MEDIUM, nullable=False)

    category = Column(String(120), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    closed_at = Column(DateTime, nullable=True)

    user = relationship("User", foreign_keys=[user_id], backref="support_tickets")
    assigned_to = relationship("User", foreign_keys=[assigned_to_id], backref="assigned_support_tickets")
    messages = relationship(
        "TicketMessage",
        back_populates="ticket",
        cascade="all, delete-orphan",
        order_by="TicketMessage.created_at",
    )


class TicketMessage(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ticket_messages"

    ticket_id = Column(UUID(as_uuid=True), ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    body = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=False, nullable=False)
    is_staff_reply = Column(Boolean, default=False, nullable=False)

    ticket = relationship("SupportTicket", back_populates="messages")
    author = relationship("User", backref="ticket_messages")
