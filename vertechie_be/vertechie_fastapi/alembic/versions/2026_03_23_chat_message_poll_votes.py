"""Add chat_poll_votes for chat message polls (one vote per user per message).

Revision ID: 2026_03_23_chat_poll_votes
Revises: 2026_03_22_last_seen
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "2026_03_23_chat_poll_votes"
down_revision: Union[str, None] = "2026_03_22_last_seen"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy import inspect

    bind = op.get_bind()
    inspector = inspect(bind)
    if "chat_poll_votes" in inspector.get_table_names():
        return

    op.create_table(
        "chat_poll_votes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("message_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("option_index", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(["message_id"], ["messages.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.UniqueConstraint("message_id", "user_id", name="uq_chat_poll_vote_user_message"),
    )
    op.create_index("ix_chat_poll_votes_message_id", "chat_poll_votes", ["message_id"])
    op.create_index("ix_chat_poll_votes_user_id", "chat_poll_votes", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_chat_poll_votes_user_id", table_name="chat_poll_votes")
    op.drop_index("ix_chat_poll_votes_message_id", table_name="chat_poll_votes")
    op.drop_table("chat_poll_votes")
