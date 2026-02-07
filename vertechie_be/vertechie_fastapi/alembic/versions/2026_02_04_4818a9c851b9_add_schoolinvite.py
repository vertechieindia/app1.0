"""Add_SchoolInvite

Revision ID: 4818a9c851b9
Revises: 011_gitlab_oauth
Create Date: 2026-02-04 07:50:06.185024+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "4818a9c851b9"
down_revision: Union[str, None] = "011_gitlab_oauth"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("DROP TABLE IF EXISTS school_invites CASCADE")
    op.execute("DROP TYPE IF EXISTS school_invitestatus CASCADE")
    
    op.create_table(
        'school_invites',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('school_id', sa.UUID(), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=True),
        sa.Column('member_type', postgresql.ENUM('CURRENT_STUDENT', 'ALUMNI', 'FACULTY', name='membertype', create_type=False), nullable=True),
        sa.Column('graduation_year', sa.Integer(), nullable=True),
        sa.Column('student_id', sa.String(length=50), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'SENT', 'ACCEPTED', 'DECLINED', name='school_invitestatus'), nullable=True),
        sa.Column('invited_by_id', sa.UUID(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('sent_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['invited_by_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['school_id'], ['schools.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('school_invites')
    op.execute("DROP TYPE IF EXISTS school_invitestatus CASCADE")
