"""Add STAFF_ADMIN to roletype enum (uppercase, matches existing PG convention).

Revision ID: 2026_06_22_staff_enum
Revises: 2026_06_22_role_name
"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op
from sqlalchemy import text

revision: str = "2026_06_22_staff_enum"
down_revision: Union[str, None] = "2026_06_22_role_name"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    # Migration 2026_06_22_role_name may have added lowercase staff_admin; app uses STAFF_ADMIN.
    if not conn.execute(
        text(
            """
            SELECT 1 FROM pg_enum e
            JOIN pg_type t ON e.enumtypid = t.oid
            WHERE t.typname = 'roletype' AND e.enumlabel = 'STAFF_ADMIN'
            """
        )
    ).scalar():
        op.execute(text("ALTER TYPE roletype ADD VALUE 'STAFF_ADMIN'"))


def downgrade() -> None:
    pass
