"""add gov_id_last_four for VerTechie ID (PAN/SSN last 4)

Revision ID: a1b2c3d4e5f6
Revises: 8aff217dafb1
Create Date: 2026-03-07

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "8aff217dafb1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("gov_id_last_four", sa.String(length=4), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "gov_id_last_four")
