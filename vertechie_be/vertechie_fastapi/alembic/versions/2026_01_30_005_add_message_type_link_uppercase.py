"""Add LINK (uppercase) to messagetype enum - SQLAlchemy stores enum name not value

Revision ID: 005_add_link_uppercase
Revises: 004_add_message_type_link
Create Date: 2026-01-30

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '005_add_link_uppercase'
down_revision: Union[str, None] = '004_add_message_type_link'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # SQLAlchemy with PostgreSQL stores enum *name* (LINK), not value (link). Add uppercase.
    op.execute("ALTER TYPE messagetype ADD VALUE IF NOT EXISTS 'LINK'")


def downgrade() -> None:
    pass
