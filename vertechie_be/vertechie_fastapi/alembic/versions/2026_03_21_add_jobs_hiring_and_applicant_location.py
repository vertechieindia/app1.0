"""Add jobs hiring/location columns and job_applications applicant location columns.

Revision ID: job_hire_loc_20260321 (<=32 chars for alembic_version.version_num)
Revises: 2026_03_19_sig
Create Date: 2026-03-21

Idempotent ADD COLUMN IF NOT EXISTS for production DBs that reached alembic head
without these columns (stub migrations / manual dev drift).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "job_hire_loc_20260321"
down_revision: Union[str, None] = "2026_03_19_sig"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # --- jobs: align with app.models.job.Job + dev parity (department, hiring_states) ---
    op.execute(
        sa.text(
            "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_countries JSON DEFAULT '[]'::json"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS work_authorizations JSON DEFAULT '[]'::json"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS open_for_sponsorship BOOLEAN"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS collect_applicant_location BOOLEAN DEFAULT false"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS department VARCHAR(200)"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_states JSON DEFAULT '[]'::json"
        )
    )

    op.execute(
        sa.text(
            "UPDATE jobs SET hiring_countries = COALESCE(hiring_countries, '[]'::json)"
        )
    )
    op.execute(
        sa.text(
            "UPDATE jobs SET work_authorizations = COALESCE(work_authorizations, '[]'::json)"
        )
    )
    op.execute(
        sa.text(
            "UPDATE jobs SET collect_applicant_location = COALESCE(collect_applicant_location, false)"
        )
    )
    op.execute(
        sa.text(
            "UPDATE jobs SET hiring_states = COALESCE(hiring_states, '[]'::json)"
        )
    )

    # --- job_applications: app.models.job.JobApplication location fields ---
    op.execute(
        sa.text(
            "ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS applicant_location_lat DOUBLE PRECISION"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS applicant_location_lng DOUBLE PRECISION"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS applicant_location_ip_snapshot JSON"
        )
    )
    op.execute(
        sa.text(
            "ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS applicant_location_consent_at TIMESTAMP WITHOUT TIME ZONE"
        )
    )


def downgrade() -> None:
    op.execute(sa.text("ALTER TABLE job_applications DROP COLUMN IF EXISTS applicant_location_consent_at"))
    op.execute(sa.text("ALTER TABLE job_applications DROP COLUMN IF EXISTS applicant_location_ip_snapshot"))
    op.execute(sa.text("ALTER TABLE job_applications DROP COLUMN IF EXISTS applicant_location_lng"))
    op.execute(sa.text("ALTER TABLE job_applications DROP COLUMN IF EXISTS applicant_location_lat"))

    op.execute(sa.text("ALTER TABLE jobs DROP COLUMN IF EXISTS hiring_states"))
    op.execute(sa.text("ALTER TABLE jobs DROP COLUMN IF EXISTS department"))
    op.execute(sa.text("ALTER TABLE jobs DROP COLUMN IF EXISTS collect_applicant_location"))
    op.execute(sa.text("ALTER TABLE jobs DROP COLUMN IF EXISTS open_for_sponsorship"))
    op.execute(sa.text("ALTER TABLE jobs DROP COLUMN IF EXISTS work_authorizations"))
    op.execute(sa.text("ALTER TABLE jobs DROP COLUMN IF EXISTS hiring_countries"))
