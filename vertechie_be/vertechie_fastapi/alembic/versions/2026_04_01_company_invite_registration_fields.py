"""company invite registration fields, company gst/domain, provisioned_company_id

Revision ID: 2026_04_01_company_invite_reg
Revises: 2026_04_01_learn_admin_roletype
Create Date: 2026-04-01

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


revision: str = "2026_04_01_company_invite_reg"
down_revision: Union[str, None] = "2026_04_01_learn_admin_roletype"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("companies", sa.Column("gst_number", sa.String(50), nullable=True))
    op.add_column("companies", sa.Column("domain", sa.String(255), nullable=True))

    op.add_column("company_invites", sa.Column("legal_name", sa.String(300), nullable=True))
    op.add_column("company_invites", sa.Column("domain", sa.String(255), nullable=True))
    op.add_column("company_invites", sa.Column("gst_number", sa.String(50), nullable=True))
    op.add_column("company_invites", sa.Column("founder_details", sa.JSON(), nullable=True))
    op.add_column("company_invites", sa.Column("headquarters_address", sa.Text(), nullable=True))
    op.add_column("company_invites", sa.Column("branch_addresses", sa.JSON(), nullable=True))
    op.add_column("company_invites", sa.Column("industry", sa.String(100), nullable=True))
    op.add_column("company_invites", sa.Column("logo_url", sa.String(500), nullable=True))
    op.add_column("company_invites", sa.Column("banner_image_url", sa.String(500), nullable=True))
    op.add_column("company_invites", sa.Column("about", sa.Text(), nullable=True))
    op.add_column("company_invites", sa.Column("tagline", sa.String(200), nullable=True))
    op.add_column(
        "company_invites",
        sa.Column("provisioned_company_id", UUID(as_uuid=True), nullable=True),
    )
    op.create_foreign_key(
        "fk_company_invites_provisioned_company",
        "company_invites",
        "companies",
        ["provisioned_company_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_company_invites_provisioned_company", "company_invites", type_="foreignkey")
    op.drop_column("company_invites", "provisioned_company_id")
    for col in (
        "tagline",
        "about",
        "banner_image_url",
        "logo_url",
        "industry",
        "branch_addresses",
        "headquarters_address",
        "founder_details",
        "gst_number",
        "domain",
        "legal_name",
    ):
        op.drop_column("company_invites", col)
    op.drop_column("companies", "domain")
    op.drop_column("companies", "gst_number")
