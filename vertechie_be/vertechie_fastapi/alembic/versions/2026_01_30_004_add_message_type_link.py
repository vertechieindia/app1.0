"""Add LINK to messagetype enum for chat links

Revision ID: 004_add_message_type_link
Revises: 003_add_events_combinator
Create Date: 2026-01-30

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '004_add_message_type_link'
down_revision: Union[str, None] = '003_add_events_combinator'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # PostgreSQL: SQLAlchemy stores enum *name* (LINK), not value (link). Add uppercase to match.
    op.execute("ALTER TYPE messagetype ADD VALUE IF NOT EXISTS 'LINK'")


def downgrade() -> None:
    # PostgreSQL does not support removing enum values; would require recreating the type
    pass
