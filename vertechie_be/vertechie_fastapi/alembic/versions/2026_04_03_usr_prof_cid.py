"""user_profile.company_id for company affiliation CMS listing

Revision ID: 2026_04_03_usr_prof_cid
Revises: merge_2026_04_03_invite_heads
Create Date: 2026-04-03

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


revision: str = "2026_04_03_usr_prof_cid"
down_revision: Union[str, None] = "merge_2026_04_03_invite_heads"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_profile",
        sa.Column("company_id", sa.UUID(), nullable=True),
    )
    op.create_foreign_key(
        "fk_user_profile_company_id_companies",
        "user_profile",
        "companies",
        ["company_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_user_profile_company_id_companies", "user_profile", type_="foreignkey")
    op.drop_column("user_profile", "company_id")
