"""Calendar sync: calendar_blocks, calendar_sync_mappings, extend calendar_connections

Revision ID: 2026_03_15_cal_sync
Revises: 2026_03_15_hiring_states
Create Date: 2026-03-15

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy import inspect

revision: str = "2026_03_15_cal_sync"
down_revision: Union[str, None] = "2026_03_15_hiring_states"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _column_exists(conn, table: str, column: str) -> bool:
    insp = inspect(conn)
    cols = [c["name"] for c in insp.get_columns(table)]
    return column in cols


def _table_exists(conn, table: str) -> bool:
    return inspect(conn).has_table(table)


def upgrade() -> None:
    conn = op.get_bind()
    # New columns on calendar_connections (idempotent)
    for col, col_sa in [
        ("sync_status", sa.Column("sync_status", sa.String(length=50), nullable=True)),
        ("last_sync_error", sa.Column("last_sync_error", sa.Text(), nullable=True)),
        ("sync_token", sa.Column("sync_token", sa.Text(), nullable=True)),
        ("watch_expires_at", sa.Column("watch_expires_at", sa.DateTime(), nullable=True)),
        ("subscription_id", sa.Column("subscription_id", sa.String(length=255), nullable=True)),
        ("subscription_expires_at", sa.Column("subscription_expires_at", sa.DateTime(), nullable=True)),
    ]:
        if not _column_exists(conn, "calendar_connections", col):
            op.add_column("calendar_connections", col_sa)

    # calendar_blocks (idempotent)
    if not _table_exists(conn, "calendar_blocks"):
        op.create_table(
            "calendar_blocks",
            sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("title", sa.String(length=500), nullable=False),
            sa.Column("start_time", sa.DateTime(), nullable=False),
            sa.Column("end_time", sa.DateTime(), nullable=False),
            sa.Column("source", sa.String(length=20), nullable=False),
            sa.Column("last_updated_by", sa.String(length=20), nullable=True),
            sa.Column("external_version", sa.String(length=255), nullable=True),
            sa.Column("is_deleted", sa.Boolean(), default=False),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_calendar_blocks_user_id", "calendar_blocks", ["user_id"])
        op.create_index("ix_calendar_blocks_start_time", "calendar_blocks", ["start_time"])

    # calendar_sync_mappings (idempotent)
    if not _table_exists(conn, "calendar_sync_mappings"):
        op.create_table(
            "calendar_sync_mappings",
            sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("connection_id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("internal_event_id", postgresql.UUID(as_uuid=True), nullable=False),
            sa.Column("provider", sa.String(length=20), nullable=False),
            sa.Column("external_event_id", sa.String(length=500), nullable=False),
            sa.Column("etag", sa.String(length=255), nullable=True),
            sa.Column("change_key", sa.String(length=255), nullable=True),
            sa.Column("last_synced_at", sa.DateTime(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("updated_at", sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(["connection_id"], ["calendar_connections.id"], ondelete="CASCADE"),
            sa.ForeignKeyConstraint(["internal_event_id"], ["calendar_blocks.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index("ix_calendar_sync_mappings_external_event_id", "calendar_sync_mappings", ["external_event_id"])
        op.create_index("ix_calendar_sync_mappings_internal_event_id", "calendar_sync_mappings", ["internal_event_id"])
        op.create_index("ix_calendar_sync_mappings_connection_id", "calendar_sync_mappings", ["connection_id"])


def downgrade() -> None:
    op.drop_index("ix_calendar_sync_mappings_connection_id", table_name="calendar_sync_mappings")
    op.drop_index("ix_calendar_sync_mappings_internal_event_id", table_name="calendar_sync_mappings")
    op.drop_index("ix_calendar_sync_mappings_external_event_id", table_name="calendar_sync_mappings")
    op.drop_table("calendar_sync_mappings")
    op.drop_index("ix_calendar_blocks_start_time", table_name="calendar_blocks")
    op.drop_index("ix_calendar_blocks_user_id", table_name="calendar_blocks")
    op.drop_table("calendar_blocks")
    op.drop_column("calendar_connections", "subscription_expires_at")
    op.drop_column("calendar_connections", "subscription_id")
    op.drop_column("calendar_connections", "watch_expires_at")
    op.drop_column("calendar_connections", "sync_token")
    op.drop_column("calendar_connections", "last_sync_error")
    op.drop_column("calendar_connections", "sync_status")
