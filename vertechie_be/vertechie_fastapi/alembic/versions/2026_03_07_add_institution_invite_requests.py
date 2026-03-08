"""Add institution_invite_requests table

Revision ID: 2026_03_07_institution_invite
Revises: 2026_03_07_places
Create Date: 2026-03-07

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "2026_03_07_institution_invite"
down_revision: Union[str, None] = "b2c3d4e5f6a7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enum only if it does not exist (idempotent for re-runs)
    conn = op.get_bind()
    result = conn.execute(sa.text("SELECT 1 FROM pg_type WHERE typname = 'institution_invitestatus'"))
    if result.scalar() is None:
        op.execute("CREATE TYPE institution_invitestatus AS ENUM ('pending', 'sent', 'accepted', 'declined')")
    institution_invite_enum = postgresql.ENUM("pending", "sent", "accepted", "declined", name="institution_invitestatus", create_type=False)
    # Create table only if it does not exist
    from sqlalchemy import inspect
    if not inspect(conn).has_table("institution_invite_requests"):
        op.create_table(
            "institution_invite_requests",
            sa.Column("id", sa.UUID(), nullable=False),
            sa.Column("institution_name", sa.String(length=300), nullable=False),
            sa.Column("requested_by_id", sa.UUID(), nullable=True),
            sa.Column("status", institution_invite_enum, nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.ForeignKeyConstraint(["requested_by_id"], ["users.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )


def downgrade() -> None:
    op.drop_table("institution_invite_requests")
    op.execute("DROP TYPE IF EXISTS institution_invitestatus CASCADE")
