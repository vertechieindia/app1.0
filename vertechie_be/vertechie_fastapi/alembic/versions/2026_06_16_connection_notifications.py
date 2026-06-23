"""Add connection notification enum values.

Revision ID: 2026_06_16_conn_notif
Revises: 2026_06_15_help_support
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op
from sqlalchemy import text

revision: str = "2026_06_16_conn_notif"
down_revision: Union[str, None] = "2026_06_15_help_support"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    for label in ("CONNECTION_REQUEST", "CONNECTION_ACCEPTED"):
        exists = conn.execute(
            text(
                """
                SELECT 1 FROM pg_enum e
                JOIN pg_type t ON e.enumtypid = t.oid
                WHERE t.typname = 'notificationtype' AND e.enumlabel = :label
                """
            ),
            {"label": label},
        ).scalar()
        if not exists:
            op.execute(text(f"ALTER TYPE notificationtype ADD VALUE '{label}'"))


def downgrade() -> None:
    pass
