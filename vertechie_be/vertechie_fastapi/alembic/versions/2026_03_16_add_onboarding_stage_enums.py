"""add onboarding to applicationstatus and stagetype enums

Revision ID: 2026_03_16_onboarding_stage
Revises: 2026_03_15_cal_sync
Create Date: 2026-03-16
"""

from typing import Sequence, Union

from alembic import op


revision: str = "2026_03_16_onboarding_stage"
down_revision: Union[str, None] = "2026_03_15_cal_sync"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TYPE applicationstatus ADD VALUE IF NOT EXISTS 'ONBOARDING'")
    op.execute("ALTER TYPE stagetype ADD VALUE IF NOT EXISTS 'ONBOARDING'")


def downgrade() -> None:
    # PostgreSQL enums do not support dropping individual values safely.
    pass
