"""Add email/address/phone to institution invite requests

Revision ID: 2026_03_12_invite_details
Revises: 2026_03_12_profile_name
Create Date: 2026-03-12

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2026_03_12_invite_details"
down_revision: Union[str, None] = "2026_03_12_profile_name"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("institution_invite_requests", sa.Column("email", sa.String(length=255), nullable=True))
    op.add_column("institution_invite_requests", sa.Column("address", sa.Text(), nullable=True))
    op.add_column("institution_invite_requests", sa.Column("phone", sa.String(length=50), nullable=True))
    op.add_column("institution_invite_requests", sa.Column("sent_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("institution_invite_requests", "sent_at")
    op.drop_column("institution_invite_requests", "phone")
    op.drop_column("institution_invite_requests", "address")
    op.drop_column("institution_invite_requests", "email")
