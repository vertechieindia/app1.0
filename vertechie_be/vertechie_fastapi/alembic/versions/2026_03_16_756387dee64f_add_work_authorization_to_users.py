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
    op.add_column(
        "users",
        sa.Column("work_authorization", sa.String(100), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "work_authorization")
