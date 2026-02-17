"""add missing experience fields
Revision ID: 4822_experience_missing_fields
Revises: 4821_education_score_fields
Create Date: 2026-02-16
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4822_experience_missing_fields"
down_revision = "4821_education_score_fields"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("experiences", sa.Column("client_name", sa.String(length=200), nullable=True))
    op.add_column("experiences", sa.Column("company_website", sa.String(length=255), nullable=True))
    op.add_column("experiences", sa.Column("manager_name", sa.String(length=100), nullable=True))
    op.add_column("experiences", sa.Column("manager_email", sa.String(length=255), nullable=True))
    op.add_column("experiences", sa.Column("manager_phone", sa.String(length=20), nullable=True))
    op.add_column("experiences", sa.Column("manager_linkedin", sa.String(length=512), nullable=True))


def downgrade() -> None:
    op.drop_column("experiences", "manager_linkedin")
    op.drop_column("experiences", "manager_phone")
    op.drop_column("experiences", "manager_email")
    op.drop_column("experiences", "manager_name")
    op.drop_column("experiences", "company_website")
    op.drop_column("experiences", "client_name")
