"""convert user_activities.activity_type enum to text

Revision ID: 4824_user_activity_type_text
Revises: 4823_gamification
Create Date: 2026-02-17
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "4824_user_activity_type_text"
down_revision = "4823_gamification"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    dialect = bind.dialect.name

    if dialect == "postgresql":
        op.execute(
            """
            ALTER TABLE user_activities
            ALTER COLUMN activity_type TYPE VARCHAR(50)
            USING LOWER(activity_type::text)
            """
        )
        op.execute("DROP TYPE IF EXISTS activitytype")
    else:
        with op.batch_alter_table("user_activities") as batch_op:
            batch_op.alter_column(
                "activity_type",
                existing_type=sa.String(length=255),
                type_=sa.String(length=50),
                existing_nullable=True,
            )


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return

    op.execute(
        """
        CREATE TYPE activitytype AS ENUM (
          'LOGIN', 'PRACTICE', 'LEARNING', 'POST_CREATED', 'POST_REACTION',
          'COMMENT_CREATED', 'INTERVIEW_ATTENDED', 'ASSESSMENT_COMPLETED'
        )
        """
    )
    op.execute(
        """
        ALTER TABLE user_activities
        ALTER COLUMN activity_type TYPE activitytype
        USING UPPER(activity_type)::activitytype
        """
    )

