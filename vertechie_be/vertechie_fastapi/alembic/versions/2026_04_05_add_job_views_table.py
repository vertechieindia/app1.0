"""add job_views table for unique authenticated job viewers

Revision ID: 2026_04_05_job_views
Revises: 2026_04_05_skill_cat
Create Date: 2026-04-05

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql


revision: str = "2026_04_05_job_views"
down_revision: Union[str, None] = "2026_04_05_skill_cat"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy import inspect

    conn = op.get_bind()
    if inspect(conn).has_table("job_views"):
        return

    op.create_table(
        "job_views",
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("job_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("job_id", "user_id", name="uq_job_views_job_user"),
    )
    op.create_index(op.f("ix_job_views_job_id"), "job_views", ["job_id"], unique=False)
    op.create_index(op.f("ix_job_views_user_id"), "job_views", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_job_views_user_id"), table_name="job_views")
    op.drop_index(op.f("ix_job_views_job_id"), table_name="job_views")
    op.drop_table("job_views")
