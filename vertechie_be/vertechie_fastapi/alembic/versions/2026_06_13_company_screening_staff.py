"""Per-company screening staff table.

Revision ID: 2026_06_13_co_staff
Revises: 2026_06_13_invite_status
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "2026_06_13_co_staff"
down_revision: Union[str, None] = "2026_06_13_invite_status"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        sa.text(
            """
            DO $$ BEGIN
                CREATE TYPE companystaffrole AS ENUM ('recruiter', 'screener', 'tech_screener');
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )
    bind = op.get_bind()
    insp = sa.inspect(bind)
    if not insp.has_table("company_screening_staff"):
        role_enum = postgresql.ENUM(
            "recruiter", "screener", "tech_screener", name="companystaffrole", create_type=False
        )
        op.create_table(
            "company_screening_staff",
            sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
            sa.Column("company_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("companies.id"), nullable=False),
            sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
            sa.Column("staff_role", role_enum, nullable=False),
            sa.Column("assigned_by_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
            sa.Column("is_active", sa.Boolean(), server_default="true", nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), nullable=True),
        )
        op.create_index("ix_company_screening_staff_company_id", "company_screening_staff", ["company_id"])
        op.create_index("ix_company_screening_staff_user_id", "company_screening_staff", ["user_id"])
        op.create_index(
            "uq_company_screening_staff_company_user_role",
            "company_screening_staff",
            ["company_id", "user_id", "staff_role"],
            unique=True,
        )


def downgrade() -> None:
    op.drop_table("company_screening_staff")
