"""Add users.last_seen_at for chat presence (online/offline).

Revision ID: 2026_03_22_last_seen
Revises: job_hire_loc_20260321
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2026_03_22_last_seen"
down_revision: Union[str, None] = "job_hire_loc_20260321"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITHOUT TIME ZONE")
    )
    op.execute(
        sa.text("CREATE INDEX IF NOT EXISTS ix_users_last_seen_at ON users (last_seen_at)")
    )


def downgrade() -> None:
    op.execute(sa.text("DROP INDEX IF EXISTS ix_users_last_seen_at"))
    op.execute(sa.text("ALTER TABLE users DROP COLUMN IF EXISTS last_seen_at"))
