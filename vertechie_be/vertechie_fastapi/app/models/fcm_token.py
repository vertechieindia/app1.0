"""
FCM device tokens for web push (chat and future use).
"""

from sqlalchemy import Column, String, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base, TimestampMixin, UUIDMixin


class UserFcmToken(Base, UUIDMixin, TimestampMixin):
    """Stores Firebase Cloud Messaging registration tokens per user device."""

    __tablename__ = "user_fcm_tokens"
    __table_args__ = (
        Index("ix_user_fcm_tokens_user_id", "user_id"),
    )

    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    # FCM tokens are long; 512 covers future formats
    token = Column(String(512), nullable=False, unique=True, index=True)

    user = relationship("User", backref="fcm_tokens")
