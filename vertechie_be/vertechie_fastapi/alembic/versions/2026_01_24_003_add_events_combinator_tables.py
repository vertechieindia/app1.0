"""add events and combinator tables

Revision ID: 003_add_events_combinator
Revises: 002_add_poll_votes
Create Date: 2026-01-24 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '003_add_events_combinator'
down_revision: Union[str, None] = '002_add_poll_votes'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create events table
    op.create_table(
        'events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('host_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('start_date', sa.DateTime, nullable=False),
        sa.Column('end_date', sa.DateTime, nullable=True),
        sa.Column('timezone', sa.String(50), default='UTC'),
        sa.Column('event_type', sa.String(50), default='webinar'),
        sa.Column('location', sa.String(500), nullable=True),
        sa.Column('is_virtual', sa.Boolean, default=False),
        sa.Column('meeting_link', sa.String(500), nullable=True),
        sa.Column('cover_image', sa.String(500), nullable=True),
        sa.Column('is_public', sa.Boolean, default=True),
        sa.Column('requires_approval', sa.Boolean, default=False),
        sa.Column('max_attendees', sa.Integer, nullable=True),
        sa.Column('attendees_count', sa.Integer, default=0),
        sa.Column('views_count', sa.Integer, default=0),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('is_cancelled', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['host_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_events_host_id', 'events', ['host_id'])
    op.create_index('ix_events_start_date', 'events', ['start_date'])
    
    # Create event_registrations table
    op.create_table(
        'event_registrations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('event_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.String(20), default='registered'),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('event_id', 'user_id', name='uq_event_registration_user_event'),
    )
    op.create_index('ix_event_registrations_event_id', 'event_registrations', ['event_id'])
    op.create_index('ix_event_registrations_user_id', 'event_registrations', ['user_id'])
    
    # Create startup_ideas table
    op.create_table(
        'startup_ideas',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('founder_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('problem', sa.Text, nullable=False),
        sa.Column('target_market', sa.String(200), nullable=True),
        sa.Column('stage', sa.String(50), default='idea'),
        sa.Column('commitment', sa.String(50), default='exploring'),
        sa.Column('funding_status', sa.String(50), nullable=True),
        sa.Column('roles_needed', sa.JSON, default=list),
        sa.Column('skills_needed', sa.JSON, default=list),
        sa.Column('team_size', sa.Integer, default=0),
        sa.Column('founder_roles', sa.JSON, default=list),
        sa.Column('founder_skills', sa.JSON, default=list),
        sa.Column('founder_commitment', sa.String(50), nullable=True),
        sa.Column('founder_funding', sa.String(50), nullable=True),
        sa.Column('is_active', sa.Boolean, default=True),
        sa.Column('is_matched', sa.Boolean, default=False),
        sa.Column('views_count', sa.Integer, default=0),
        sa.Column('connections_count', sa.Integer, default=0),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['founder_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_startup_ideas_founder_id', 'startup_ideas', ['founder_id'])
    op.create_index('ix_startup_ideas_stage', 'startup_ideas', ['stage'])
    
    # Create founder_matches table
    op.create_table(
        'founder_matches',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('idea_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('founder_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('status', sa.String(20), default='pending'),
        sa.Column('match_score', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['idea_id'], ['startup_ideas.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['founder_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_founder_matches_idea_id', 'founder_matches', ['idea_id'])
    op.create_index('ix_founder_matches_founder_id', 'founder_matches', ['founder_id'])


def downgrade() -> None:
    op.drop_index('ix_founder_matches_founder_id', table_name='founder_matches')
    op.drop_index('ix_founder_matches_idea_id', table_name='founder_matches')
    op.drop_table('founder_matches')
    op.drop_index('ix_startup_ideas_stage', table_name='startup_ideas')
    op.drop_index('ix_startup_ideas_founder_id', table_name='startup_ideas')
    op.drop_table('startup_ideas')
    op.drop_index('ix_event_registrations_user_id', table_name='event_registrations')
    op.drop_index('ix_event_registrations_event_id', table_name='event_registrations')
    op.drop_table('event_registrations')
    op.drop_index('ix_events_start_date', table_name='events')
    op.drop_index('ix_events_host_id', table_name='events')
    op.drop_table('events')
