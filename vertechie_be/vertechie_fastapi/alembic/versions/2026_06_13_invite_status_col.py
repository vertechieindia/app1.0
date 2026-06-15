"""Restore screening_invites.status column after enum fix.

Revision ID: 2026_06_13_invite_status
Revises: 2026_06_13_fix_invite_enum
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "2026_06_13_invite_status"
down_revision: Union[str, None] = "2026_06_13_fix_invite_enum"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)
    if not insp.has_table("screening_invites"):
        return
    cols = {c["name"] for c in insp.get_columns("screening_invites")}
    if "status" not in cols:
        inv_status = postgresql.ENUM(
            "invite_sent", "signup_started", "signup_submitted", "approved", "denied",
            "screening_pending", "screening_selected", "screening_rejected",
            name="screeninginvitestatus", create_type=False,
        )
        op.add_column(
            "screening_invites",
            sa.Column("status", inv_status, nullable=False, server_default="invite_sent"),
        )


def downgrade() -> None:
    pass
