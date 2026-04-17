"""user_fcm_tokens for FCM web push (chat)

Revision ID: 2026_04_16_user_fcm_tokens
Revises: 2026_04_15_document_verification
Create Date: 2026-04-16

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


revision: str = "2026_04_16_user_fcm_tokens"
down_revision: Union[str, None] = "2026_04_15_document_verification"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_fcm_tokens",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("token", sa.String(length=512), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_user_fcm_tokens_user_id", "user_fcm_tokens", ["user_id"])
    op.create_index(op.f("ix_user_fcm_tokens_id"), "user_fcm_tokens", ["id"])
    op.create_index(op.f("ix_user_fcm_tokens_token"), "user_fcm_tokens", ["token"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_user_fcm_tokens_token"), table_name="user_fcm_tokens")
    op.drop_index(op.f("ix_user_fcm_tokens_id"), table_name="user_fcm_tokens")
    op.drop_index("ix_user_fcm_tokens_user_id", table_name="user_fcm_tokens")
    op.drop_table("user_fcm_tokens")
