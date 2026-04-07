"""company_invites.invite_flow: outreach vs registration

Revision ID: 2026_04_03_invite_flow
Revises: 764b704c89b8
Create Date: 2026-04-03

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2026_04_03_invite_flow"
down_revision: Union[str, None] = "764b704c89b8"
branch_labels: Union[str, Sequence[str], None] = None
# This migration classifies rows using fields introduced in
# 2026_04_01_company_invite_reg, so ensure that branch is applied first.
depends_on: Union[str, Sequence[str], None] = ("2026_04_01_company_invite_reg",)


def upgrade() -> None:
    op.add_column(
        "company_invites",
        sa.Column("invite_flow", sa.String(length=32), nullable=True),
    )
    conn = op.get_bind()
    # Heuristic: full registration submissions have richer profile fields
    conn.execute(
        sa.text(
            """
            UPDATE company_invites SET invite_flow = 'registration'
            WHERE legal_name IS NOT NULL
               OR gst_number IS NOT NULL
               OR (headquarters_address IS NOT NULL AND length(trim(headquarters_address)) > 10)
               OR (about IS NOT NULL AND length(trim(about)) > 20)
            """
        )
    )
    conn.execute(
        sa.text("UPDATE company_invites SET invite_flow = 'outreach' WHERE invite_flow IS NULL")
    )
    op.alter_column(
        "company_invites",
        "invite_flow",
        existing_type=sa.String(length=32),
        nullable=False,
        server_default="outreach",
    )


def downgrade() -> None:
    op.drop_column("company_invites", "invite_flow")
