"""Add profile_name column to users

Revision ID: 2026_03_12_profile_name
Revises: 2026_03_08_hr_company
Create Date: 2026-03-12

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2026_03_12_profile_name"
down_revision: Union[str, None] = "2026_03_08_hr_company"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("profile_name", sa.String(length=150), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "profile_name")

