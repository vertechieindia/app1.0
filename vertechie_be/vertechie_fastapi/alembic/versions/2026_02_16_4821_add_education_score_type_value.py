"""add score_type and score_value to educations

Revision ID: 4821_education_score_fields
Revises: 4820_interview_tz
Create Date: 2026-02-16
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4821_education_score_fields"
down_revision = "4820_interview_tz"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("educations", sa.Column("score_type", sa.String(length=20), nullable=True))
    op.add_column("educations", sa.Column("score_value", sa.String(length=50), nullable=True))

    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        # Backfill from legacy `grade` for existing records.
        op.execute(
            """
            UPDATE educations
            SET
              score_type = CASE
                WHEN grade IS NULL OR btrim(grade) = '' THEN NULL
                WHEN grade ~ '^[0-9]+(\\.[0-9]+)?$' AND grade::numeric <= 10 THEN 'cgpa'
                WHEN grade ~ '^[0-9]+(\\.[0-9]+)?$' AND grade::numeric <= 100 THEN 'percentage'
                ELSE 'grade'
              END,
              score_value = CASE
                WHEN grade IS NULL OR btrim(grade) = '' THEN NULL
                ELSE btrim(grade)
              END
            WHERE score_type IS NULL OR score_value IS NULL
            """
        )


def downgrade() -> None:
    op.drop_column("educations", "score_value")
    op.drop_column("educations", "score_type")

