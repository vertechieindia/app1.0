"""change verification_status to enum

Revision ID: 8aff217dafb1
Revises: 0183b7d3376b
Create Date: 2026-03-03 10:27:14.089651+00:00
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "8aff217dafb1"
down_revision: Union[str, None] = "0183b7d3376b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create enum only if not exists
    op.execute("""
    DO $$ BEGIN
        CREATE TYPE verificationstatus AS ENUM (
            'PENDING',
            'APPROVED',
            'REJECTED'
        );
    EXCEPTION
        WHEN duplicate_object THEN null;
    END $$;
    """)

    # Alter column type
    op.execute("""
        ALTER TABLE users 
        ALTER COLUMN verification_status 
        TYPE verificationstatus 
        USING verification_status::verificationstatus;
    """)


def downgrade() -> None:
    # 1️⃣ Convert back to VARCHAR
    op.execute("""
        ALTER TABLE users 
        ALTER COLUMN verification_status 
        TYPE VARCHAR;
    """)

    # 2️⃣ Drop ENUM type
    op.execute("DROP TYPE verificationstatus;")