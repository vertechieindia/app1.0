"""add bgc workflow fields to job applications and role enum

Revision ID: 2026_05_06_bgc_workflow_columns
Revises: 2026_04_16_user_fcm_tokens
Create Date: 2026-05-06
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "2026_05_06_bgc_workflow_columns"
down_revision: Union[str, None] = "2026_04_16_user_fcm_tokens"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # PostgreSQL enum used by user_role.role_type (idempotent).
    op.execute(
        sa.text(
            """
            DO $$ BEGIN
                ALTER TYPE roletype ADD VALUE 'BGC_ADMIN';
            EXCEPTION
                WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )

    op.add_column("job_applications", sa.Column("bgc_state", sa.String(length=30), nullable=True))
    op.add_column("job_applications", sa.Column("bgc_checks", sa.JSON(), nullable=True))
    op.add_column("job_applications", sa.Column("bgc_verified_at", sa.DateTime(), nullable=True))
    op.add_column("job_applications", sa.Column("bgc_locked_at", sa.DateTime(), nullable=True))
    op.add_column(
        "job_applications",
        sa.Column("bgc_last_updated_by_id", postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_foreign_key(
        "fk_job_applications_bgc_last_updated_by_id_users",
        "job_applications",
        "users",
        ["bgc_last_updated_by_id"],
        ["id"],
    )
    op.create_index("ix_job_applications_bgc_state", "job_applications", ["bgc_state"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_job_applications_bgc_state", table_name="job_applications")
    op.drop_constraint(
        "fk_job_applications_bgc_last_updated_by_id_users",
        "job_applications",
        type_="foreignkey",
    )
    op.drop_column("job_applications", "bgc_last_updated_by_id")
    op.drop_column("job_applications", "bgc_locked_at")
    op.drop_column("job_applications", "bgc_verified_at")
    op.drop_column("job_applications", "bgc_checks")
    op.drop_column("job_applications", "bgc_state")
    # Enum value rollback intentionally skipped (PostgreSQL enum values are append-only).

