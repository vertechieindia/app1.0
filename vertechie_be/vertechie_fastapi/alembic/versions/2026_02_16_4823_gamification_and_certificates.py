"""add gamification and certificates

Revision ID: 4823_gamification
Revises: 4822_experience_missing_fields
Create Date: 2026-02-16

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "4823_gamification"
down_revision = "4822_experience_missing_fields"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Add fields to user_profile
    op.add_column('user_profile', sa.Column('xp', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('user_profile', sa.Column('level', sa.Integer(), nullable=True, server_default='1'))
    op.add_column('user_profile', sa.Column('streak_count', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('user_profile', sa.Column('last_activity_date', sa.Date(), nullable=True))

    # 2. Create user_activities table
    op.create_table(
        'user_activities',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('activity_type', sa.Enum('LOGIN', 'PRACTICE', 'LEARNING', 'POST_CREATED', 'POST_REACTION', 'COMMENT_CREATED', 'INTERVIEW_ATTENDED', 'ASSESSMENT_COMPLETED', name='activitytype'), nullable=True),
        sa.Column('data', sa.JSON(), nullable=True),
        sa.Column('xp_earned', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_activities_created_at'), 'user_activities', ['created_at'], unique=False)
    op.create_index(op.f('ix_user_activities_user_id'), 'user_activities', ['user_id'], unique=False)

    # 3. Create tutorial_certificate table
    op.create_table(
        'tutorial_certificate',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('tutorial_id', sa.String(length=36), nullable=False),
        sa.Column('certificate_number', sa.String(length=50), nullable=True),
        sa.Column('issued_at', sa.DateTime(), nullable=True),
        sa.Column('file_url', sa.String(length=500), nullable=True),
        sa.Column('verification_code', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['tutorial_id'], ['tutorial.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('certificate_number'),
        sa.UniqueConstraint('verification_code')
    )
    op.create_index(op.f('ix_tutorial_certificate_certificate_number'), 'tutorial_certificate', ['certificate_number'], unique=False)
    op.create_index(op.f('ix_tutorial_certificate_id'), 'tutorial_certificate', ['id'], unique=False)
    op.create_index(op.f('ix_tutorial_certificate_user_id'), 'tutorial_certificate', ['user_id'], unique=False)

    # 4. Create course_certificates table (Legacy)
    op.create_table(
        'course_certificates',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('course_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('certificate_number', sa.String(length=50), nullable=True),
        sa.Column('issued_at', sa.DateTime(), nullable=True),
        sa.Column('file_url', sa.String(length=500), nullable=True),
        sa.Column('verification_code', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('certificate_number'),
        sa.UniqueConstraint('verification_code')
    )
    op.create_index(op.f('ix_course_certificates_certificate_number'), 'course_certificates', ['certificate_number'], unique=False)
    op.create_index(op.f('ix_course_certificates_id'), 'course_certificates', ['id'], unique=False)
    op.create_index(op.f('ix_course_certificates_user_id'), 'course_certificates', ['user_id'], unique=False)


def downgrade() -> None:
    # 1. Drop tutorial_certificate and course_certificates
    op.drop_table('course_certificates')
    op.drop_table('tutorial_certificate')
    
    # 2. Drop user_activities
    op.drop_table('user_activities')
    # Note: postgresql Enum might need to be dropped if it was created
    # op.execute('DROP TYPE activitytype')

    # 3. Remove fields from user_profile
    op.drop_column('user_profile', 'last_activity_date')
    op.drop_column('user_profile', 'streak_count')
    op.drop_column('user_profile', 'level')
    op.drop_column('user_profile', 'xp')
