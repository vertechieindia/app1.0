"""add poll votes table

Revision ID: 2026_01_24_002
Revises: 2026_01_23_001
Create Date: 2026-01-24 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002_add_poll_votes'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create poll_votes table
    op.create_table(
        'poll_votes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('post_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('option_index', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('post_id', 'user_id', name='uq_poll_vote_user_post'),
    )
    op.create_index('ix_poll_votes_post_id', 'poll_votes', ['post_id'])
    op.create_index('ix_poll_votes_user_id', 'poll_votes', ['user_id'])


def downgrade() -> None:
    op.drop_index('ix_poll_votes_user_id', table_name='poll_votes')
    op.drop_index('ix_poll_votes_post_id', table_name='poll_votes')
    op.drop_table('poll_votes')
