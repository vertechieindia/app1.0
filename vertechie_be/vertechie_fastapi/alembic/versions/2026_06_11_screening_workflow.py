"""screening workflow tables and role types

Revision ID: 2026_06_11_screening_workflow
Revises: 2026_05_06_bgc_workflow_columns
Create Date: 2026-06-11
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "2026_06_11_screening_workflow"
down_revision: Union[str, None] = "2026_05_06_bgc_workflow_columns"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _ensure_enum(name: str, values: list[str]) -> None:
    vals = ", ".join(f"'{v}'" for v in values)
    op.execute(
        sa.text(
            f"""
            DO $$ BEGIN
                CREATE TYPE {name} AS ENUM ({vals});
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            DO $$ BEGIN
                ALTER TYPE roletype ADD VALUE 'REQUIREMENTS_TEAM';
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )
    op.execute(
        sa.text(
            """
            DO $$ BEGIN
                ALTER TYPE roletype ADD VALUE 'SCREENER';
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )

    _ensure_enum("sourcingpath", ["with_req_team", "direct_screener"])
    _ensure_enum(
        "sourcingrequeststatus",
        ["pending", "in_progress", "screening", "submitted_to_hm", "completed", "cancelled"],
    )
    _ensure_enum("screeningtaskstatus", ["pending_req_team", "open", "claimed", "selected", "rejected"])
    _ensure_enum(
        "screeningrejectionreason",
        ["work_authorization_mismatch", "location_mismatch", "skill_mismatch", "other"],
    )

    sourcingpath = postgresql.ENUM(
        "with_req_team", "direct_screener", name="sourcingpath", create_type=False
    )
    sourcingrequeststatus = postgresql.ENUM(
        "pending", "in_progress", "screening", "submitted_to_hm", "completed", "cancelled",
        name="sourcingrequeststatus",
        create_type=False,
    )
    screeningtaskstatus = postgresql.ENUM(
        "pending_req_team", "open", "claimed", "selected", "rejected",
        name="screeningtaskstatus",
        create_type=False,
    )
    screeningrejectionreason = postgresql.ENUM(
        "work_authorization_mismatch", "location_mismatch", "skill_mismatch", "other",
        name="screeningrejectionreason",
        create_type=False,
    )

    bind = op.get_bind()
    insp = sa.inspect(bind)
    if not insp.has_table("sourcing_requests"):
        op.create_table(
            "sourcing_requests",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id"), nullable=True),
            sa.Column("requested_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("assigned_to_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("title", sa.String(300), nullable=False),
            sa.Column("jd_text", sa.Text(), nullable=True),
            sa.Column("jd_file_url", sa.String(500), nullable=True),
            sa.Column("path", sourcingpath, nullable=False, server_default="with_req_team"),
            sa.Column("status", sourcingrequeststatus, nullable=False, server_default="pending"),
            sa.Column("screening_criteria", sa.JSON(), nullable=True),
            sa.Column("notes", sa.Text(), nullable=True),
            sa.Column("headcount", sa.Integer(), nullable=True),
            sa.Column("submitted_to_hm_at", sa.DateTime(), nullable=True),
            sa.Column("completed_at", sa.DateTime(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )
        op.create_index("ix_sourcing_requests_job_id", "sourcing_requests", ["job_id"])
        op.create_index("ix_sourcing_requests_requested_by_id", "sourcing_requests", ["requested_by_id"])
        op.create_index("ix_sourcing_requests_status", "sourcing_requests", ["status"])

    if not insp.has_table("screening_tasks"):
        op.create_table(
            "screening_tasks",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column("sourcing_request_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("sourcing_requests.id"), nullable=True),
            sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id"), nullable=True),
            sa.Column("application_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("job_applications.id"), nullable=True),
            sa.Column("created_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("status", screeningtaskstatus, nullable=False, server_default="open"),
            sa.Column("candidate_name", sa.String(200), nullable=True),
            sa.Column("candidate_email", sa.String(255), nullable=True),
            sa.Column("candidate_phone", sa.String(50), nullable=True),
            sa.Column("candidate_resume_url", sa.String(500), nullable=True),
            sa.Column("candidate_source", sa.String(100), nullable=True),
            sa.Column("candidate_linkedin_url", sa.String(500), nullable=True),
            sa.Column("candidate_profile_data", sa.JSON(), nullable=True),
            sa.Column("claimed_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("claimed_at", sa.DateTime(), nullable=True),
            sa.Column("screener_comments", sa.Text(), nullable=True),
            sa.Column("rejection_reason", screeningrejectionreason, nullable=True),
            sa.Column("rejection_notes", sa.Text(), nullable=True),
            sa.Column("completed_at", sa.DateTime(), nullable=True),
            sa.Column("completed_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("checks_completed", sa.JSON(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )
        op.create_index("ix_screening_tasks_sourcing_request_id", "screening_tasks", ["sourcing_request_id"])
        op.create_index("ix_screening_tasks_job_id", "screening_tasks", ["job_id"])
        op.create_index("ix_screening_tasks_application_id", "screening_tasks", ["application_id"])
        op.create_index("ix_screening_tasks_status", "screening_tasks", ["status"])
        op.create_index("ix_screening_tasks_claimed_by_id", "screening_tasks", ["claimed_by_id"])


def downgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)
    if insp.has_table("screening_tasks"):
        op.drop_index("ix_screening_tasks_claimed_by_id", table_name="screening_tasks")
        op.drop_index("ix_screening_tasks_status", table_name="screening_tasks")
        op.drop_index("ix_screening_tasks_application_id", table_name="screening_tasks")
        op.drop_index("ix_screening_tasks_job_id", table_name="screening_tasks")
        op.drop_index("ix_screening_tasks_sourcing_request_id", table_name="screening_tasks")
        op.drop_table("screening_tasks")

    if insp.has_table("sourcing_requests"):
        op.drop_index("ix_sourcing_requests_status", table_name="sourcing_requests")
        op.drop_index("ix_sourcing_requests_requested_by_id", table_name="sourcing_requests")
        op.drop_index("ix_sourcing_requests_job_id", table_name="sourcing_requests")
        op.drop_table("sourcing_requests")

    op.execute("DROP TYPE IF EXISTS screeningrejectionreason")
    op.execute("DROP TYPE IF EXISTS screeningtaskstatus")
    op.execute("DROP TYPE IF EXISTS sourcingrequeststatus")
    op.execute("DROP TYPE IF EXISTS sourcingpath")
