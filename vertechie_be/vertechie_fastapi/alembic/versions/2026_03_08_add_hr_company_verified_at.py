"""Add hr_company_verified_at for HR profile review

Revision ID: 2026_03_08_hr_company
Revises: 2026_03_07_institution_invite
Create Date: 2026-03-08

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2026_03_08_hr_company"
down_revision: Union[str, None] = "2026_03_07_institution_invite"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("hr_company_verified_at", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "hr_company_verified_at")
