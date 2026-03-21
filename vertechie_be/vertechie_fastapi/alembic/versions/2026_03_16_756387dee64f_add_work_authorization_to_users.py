"""add_work_authorization_to_users

Revision ID: 756387dee64f
Revises: 2026_03_16_onboarding_stage
Create Date: 2026-03-16 07:45:38.064123+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "756387dee64f"
down_revision: Union[str, None] = "2026_03_16_onboarding_stage"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Idempotent: column may already exist if DB was altered manually or stamp was out of sync
    op.execute(
        sa.text(
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS work_authorization VARCHAR(100)"
        )
    )


def downgrade() -> None:
    op.execute(
        sa.text("ALTER TABLE users DROP COLUMN IF EXISTS work_authorization")
    )
