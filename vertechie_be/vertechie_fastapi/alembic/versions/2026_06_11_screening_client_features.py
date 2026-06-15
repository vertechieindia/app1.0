"""client screening features: invites, tech screener, signatures, hm invites

Revision ID: 2026_06_11_screening_client_features
Revises: 2026_06_11_screening_workflow
Create Date: 2026-06-11
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "2026_06_11_scr_client"
down_revision: Union[str, None] = "2026_06_11_screening_workflow"
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
                ALTER TYPE roletype ADD VALUE 'TECH_SCREENER';
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )

    bind = op.get_bind()
    insp = sa.inspect(bind)

    _ensure_enum("requirementtype", ["source_only", "job_linked", "screen_invite"])
    _ensure_enum("screeningtasktype", ["recruitment", "enterprise_verification"])
    _ensure_enum(
        "screeninginvitestatus",
        [
            "invite_sent", "signup_started", "signup_submitted", "approved", "denied",
            "screening_pending", "screening_selected", "screening_rejected",
        ],
    )

    # Fix enums created with uppercase member names on prior failed runs.
    for enum_name, lowercase_vals in (
        ("requirementtype", ["source_only", "job_linked", "screen_invite"]),
        ("screeningtasktype", ["recruitment", "enterprise_verification"]),
    ):
        row = bind.execute(
            sa.text(
                "SELECT e.enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid "
                "WHERE t.typname = :name LIMIT 1"
            ),
            {"name": enum_name},
        ).fetchone()
        if row and row[0] != lowercase_vals[0]:
            op.execute(sa.text(f"DROP TYPE IF EXISTS {enum_name} CASCADE"))
            vals = ", ".join(f"'{v}'" for v in lowercase_vals)
            op.execute(sa.text(f"CREATE TYPE {enum_name} AS ENUM ({vals})"))

    if insp.has_table("sourcing_requests"):
        cols = {c["name"] for c in insp.get_columns("sourcing_requests")}
        requirementtype = postgresql.ENUM(
            "source_only", "job_linked", "screen_invite", name="requirementtype", create_type=False
        )
        if "company_id" not in cols:
            op.add_column("sourcing_requests", sa.Column("company_id", postgresql.UUID(as_uuid=True), nullable=True))
            op.create_foreign_key("fk_sourcing_requests_company_id", "sourcing_requests", "companies", ["company_id"], ["id"])
        if "requirement_type" not in cols:
            op.add_column(
                "sourcing_requests",
                sa.Column("requirement_type", requirementtype, nullable=True),
            )
            op.execute(
                sa.text(
                    "UPDATE sourcing_requests SET requirement_type = 'job_linked'::requirementtype "
                    "WHERE requirement_type IS NULL"
                )
            )
        if "publish_to_portal" not in cols:
            op.add_column("sourcing_requests", sa.Column("publish_to_portal", sa.Boolean(), server_default="false", nullable=False))
        if "job_snapshot" not in cols:
            op.add_column("sourcing_requests", sa.Column("job_snapshot", sa.JSON(), nullable=True))

    if insp.has_table("screening_tasks"):
        cols = {c["name"] for c in insp.get_columns("screening_tasks")}
        screeningtasktype = postgresql.ENUM(
            "recruitment", "enterprise_verification", name="screeningtasktype", create_type=False
        )
        if "task_type" not in cols:
            op.add_column(
                "screening_tasks",
                sa.Column("task_type", screeningtasktype, nullable=True),
            )
            op.execute(
                sa.text(
                    "UPDATE screening_tasks SET task_type = 'recruitment'::screeningtasktype "
                    "WHERE task_type IS NULL"
                )
            )
        if "candidate_user_id" not in cols:
            op.add_column("screening_tasks", sa.Column("candidate_user_id", postgresql.UUID(as_uuid=True), nullable=True))
            op.create_foreign_key("fk_screening_tasks_candidate_user_id", "screening_tasks", "users", ["candidate_user_id"], ["id"])
        if "detailed_results" not in cols:
            op.add_column("screening_tasks", sa.Column("detailed_results", sa.JSON(), nullable=True))
        if "screening_invite_id" not in cols:
            op.add_column("screening_tasks", sa.Column("screening_invite_id", postgresql.UUID(as_uuid=True), nullable=True))

    if not insp.has_table("screening_invites"):
        inv_status = postgresql.ENUM(
            "invite_sent", "signup_started", "signup_submitted", "approved", "denied",
            "screening_pending", "screening_selected", "screening_rejected",
            name="screeninginvitestatus", create_type=False,
        )
        op.create_table(
            "screening_invites",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column("sourcing_request_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("sourcing_requests.id"), nullable=False),
            sa.Column("invited_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=True),
            sa.Column("candidate_email", sa.String(255), nullable=False),
            sa.Column("invite_token", sa.String(64), unique=True, nullable=False),
            sa.Column("email_subject", sa.String(500), nullable=True),
            sa.Column("email_body_sent", sa.Text(), nullable=True),
            sa.Column("status", inv_status, nullable=False),
            sa.Column("candidate_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("invite_sent_at", sa.DateTime(), nullable=True),
            sa.Column("signup_started_at", sa.DateTime(), nullable=True),
            sa.Column("signup_submitted_at", sa.DateTime(), nullable=True),
            sa.Column("reviewed_at", sa.DateTime(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )

    if insp.has_table("screening_tasks") and insp.has_table("screening_invites"):
        fks = {fk.get("name") for fk in insp.get_foreign_keys("screening_tasks")}
        if "fk_screening_tasks_screening_invite_id" not in fks:
            try:
                op.create_foreign_key(
                    "fk_screening_tasks_screening_invite_id",
                    "screening_tasks",
                    "screening_invites",
                    ["screening_invite_id"],
                    ["id"],
                )
            except Exception:
                pass

    if not insp.has_table("hm_email_signatures"):
        op.create_table(
            "hm_email_signatures",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), unique=True, nullable=False),
            sa.Column("sender_name", sa.String(200), nullable=True),
            sa.Column("sender_title", sa.String(200), nullable=True),
            sa.Column("sender_phone", sa.String(50), nullable=True),
            sa.Column("signature_html", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )

    if not insp.has_table("company_hm_invites"):
        op.create_table(
            "company_hm_invites",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
            sa.Column("invited_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("email", sa.String(255), nullable=False),
            sa.Column("invite_token", sa.String(64), unique=True, nullable=False),
            sa.Column("status", sa.String(30), server_default="sent", nullable=False),
            sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("sent_at", sa.DateTime(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )


def downgrade() -> None:
    bind = op.get_bind()
    insp = sa.inspect(bind)
    if insp.has_table("company_hm_invites"):
        op.drop_table("company_hm_invites")
    if insp.has_table("hm_email_signatures"):
        op.drop_table("hm_email_signatures")
    if insp.has_table("screening_invites"):
        op.drop_table("screening_invites")
