"""
SQLAlchemy Base class and common mixins.
"""

from datetime import datetime
from typing import Any
import uuid

from sqlalchemy import Column, DateTime
from sqlalchemy.ext.declarative import as_declarative, declared_attr
from sqlalchemy.dialects.postgresql import UUID


@as_declarative()
class Base:
    """Base class for all SQLAlchemy models."""
    
    id: Any
    __name__: str
    
    @declared_attr
    def __tablename__(cls) -> str:
        """Generate tablename from class name."""
        return cls.__name__.lower() + "s"


class UUIDMixin:
    """Mixin that adds a UUID primary key."""
    
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
    )


class TimestampMixin:
    """Mixin that adds created_at and updated_at timestamps."""
    
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

