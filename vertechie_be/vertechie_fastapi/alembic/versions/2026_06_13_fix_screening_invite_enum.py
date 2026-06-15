"""Fix screeninginvitestatus enum to lowercase values.

Revision ID: 2026_06_13_fix_invite_enum
Revises: 2026_06_11_scr_client
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "2026_06_13_fix_invite_enum"
down_revision: Union[str, None] = "2026_06_11_scr_client"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    row = bind.execute(
        sa.text(
            "SELECT e.enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid "
            "WHERE t.typname = 'screeninginvitestatus' LIMIT 1"
        )
    ).fetchone()
    if row and row[0] != "invite_sent":
        op.execute(sa.text("DROP TYPE IF EXISTS screeninginvitestatus CASCADE"))
        op.execute(
            sa.text(
                "CREATE TYPE screeninginvitestatus AS ENUM ("
                "'invite_sent', 'signup_started', 'signup_submitted', 'approved', 'denied', "
                "'screening_pending', 'screening_selected', 'screening_rejected'"
                ")"
            )
        )
        op.execute(
            sa.text(
                """
                CREATE TABLE IF NOT EXISTS screening_invites (
                    id UUID PRIMARY KEY,
                    sourcing_request_id UUID NOT NULL REFERENCES sourcing_requests(id),
                    invited_by_id UUID NOT NULL REFERENCES users(id),
                    company_id UUID REFERENCES companies(id),
                    candidate_email VARCHAR(255) NOT NULL,
                    invite_token VARCHAR(64) NOT NULL UNIQUE,
                    email_subject VARCHAR(500),
                    email_body_sent TEXT,
                    status screeninginvitestatus NOT NULL DEFAULT 'invite_sent',
                    candidate_user_id UUID REFERENCES users(id),
                    invite_sent_at TIMESTAMP,
                    signup_started_at TIMESTAMP,
                    signup_submitted_at TIMESTAMP,
                    reviewed_at TIMESTAMP,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP
                )
                """
            )
        )


def downgrade() -> None:
    pass
