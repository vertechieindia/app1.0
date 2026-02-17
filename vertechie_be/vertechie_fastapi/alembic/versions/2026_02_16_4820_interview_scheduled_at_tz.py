"""migrate interviews.scheduled_at to timestamptz

Revision ID: 4820_interview_tz
Revises: 4818a9c851b9
Create Date: 2026-02-16
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4820_interview_tz"
down_revision = "4818a9c851b9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    # Existing values are stored as UTC-naive datetimes. Convert them to UTC-aware.
    op.execute(
        """
        ALTER TABLE interviews
        ALTER COLUMN scheduled_at TYPE TIMESTAMP WITH TIME ZONE
        USING (scheduled_at AT TIME ZONE 'UTC')
        """
    )


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    # Convert back to UTC-naive values if downgraded.
    op.execute(
        """
        ALTER TABLE interviews
        ALTER COLUMN scheduled_at TYPE TIMESTAMP WITHOUT TIME ZONE
        USING (scheduled_at AT TIME ZONE 'UTC')
        """
    )

