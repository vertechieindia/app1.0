"""Initial schema - Complete database structure.

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-01-23

This migration documents the complete VerTechie database schema.
Total tables: 106
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create all tables."""
    
    # Table: article_categories
    op.create_table(
        'article_categories',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('color', sa.String(length=7), nullable=True),
        sa.Column('parent_id', postgresql.UUID(), nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('featured_image', sa.String(length=500), nullable=True),
    )

    # Table: article_tag
    op.create_table(
        'article_tag',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('slug', sa.String(length=50), nullable=False),
        sa.Column('articles_count', sa.Integer, nullable=True),
    )

    # Table: code_snippet
    op.create_table(
        'code_snippet',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('language', sa.String(length=50), nullable=False),
        sa.Column('code', sa.Text, nullable=False),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('tags', sa.Text, nullable=True),
        sa.Column('version', sa.String(length=20), nullable=True),
        sa.Column('created_by', sa.String(length=36), nullable=True),
        sa.Column('usage_count', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: companies
    op.create_table(
        'companies',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('legal_name', sa.String(length=200), nullable=True),
        sa.Column('company_type', sa.String(length=50), nullable=True),
        sa.Column('industry', sa.String(length=100), nullable=True),
        sa.Column('sub_industry', sa.String(length=100), nullable=True),
        sa.Column('company_size', sa.Enum('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE', name='companysize'), nullable=True),
        sa.Column('employees_count', sa.Integer, nullable=True),
        sa.Column('logo_url', sa.String(length=500), nullable=True),
        sa.Column('cover_image_url', sa.String(length=500), nullable=True),
        sa.Column('primary_color', sa.String(length=7), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('tagline', sa.String(length=200), nullable=True),
        sa.Column('headquarters', sa.String(length=200), nullable=True),
        sa.Column('address', sa.Text, nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('country', sa.String(length=100), nullable=True),
        sa.Column('postal_code', sa.String(length=20), nullable=True),
        sa.Column('website', sa.String(length=500), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('linkedin_url', sa.String(length=500), nullable=True),
        sa.Column('twitter_url', sa.String(length=500), nullable=True),
        sa.Column('facebook_url', sa.String(length=500), nullable=True),
        sa.Column('github_url', sa.String(length=500), nullable=True),
        sa.Column('founded_year', sa.Integer, nullable=True),
        sa.Column('funding_stage', sa.String(length=50), nullable=True),
        sa.Column('total_funding', sa.Float, nullable=True),
        sa.Column('tech_stack', sa.JSON, nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE', name='companystatus'), nullable=True),
        sa.Column('is_verified', sa.Boolean, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('subscription_plan', sa.String(length=50), nullable=True),
        sa.Column('subscription_expires_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: contests
    op.create_table(
        'contests',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('contest_type', sa.Enum('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'SPECIAL', 'COMPANY', name='contesttype'), nullable=True),
        sa.Column('start_time', sa.DateTime, nullable=False),
        sa.Column('end_time', sa.DateTime, nullable=False),
        sa.Column('duration_minutes', sa.Integer, nullable=True),
        sa.Column('rules', sa.Text, nullable=True),
        sa.Column('prizes', sa.JSON, nullable=True),
        sa.Column('problems', sa.JSON, nullable=True),
        sa.Column('status', sa.Enum('UPCOMING', 'RUNNING', 'ENDED', name='conteststatus'), nullable=True),
        sa.Column('is_rated', sa.Boolean, nullable=True),
        sa.Column('is_public', sa.Boolean, nullable=True),
        sa.Column('registrations_count', sa.Integer, nullable=True),
        sa.Column('participants_count', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: conversations
    op.create_table(
        'conversations',
        sa.Column('conversation_type', sa.Enum('DIRECT', 'GROUP', 'CHANNEL', name='conversationtype'), nullable=True),
        sa.Column('name', sa.String(length=100), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('is_muted_by_default', sa.Boolean, nullable=True),
        sa.Column('message_count', sa.Integer, nullable=True),
        sa.Column('member_count', sa.Integer, nullable=True),
        sa.Column('last_message_at', sa.DateTime, nullable=True),
        sa.Column('last_message_preview', sa.String(length=200), nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: course_categories
    op.create_table(
        'course_categories',
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('color', sa.String(length=20), nullable=True),
        sa.Column('parent_id', postgresql.UUID(), nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('courses_count', sa.Integer, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: media_asset
    op.create_table(
        'media_asset',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('original_filename', sa.String(length=255), nullable=True),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('media_type', sa.String(length=20), nullable=True),
        sa.Column('mime_type', sa.String(length=100), nullable=True),
        sa.Column('file_size', sa.Integer, nullable=True),
        sa.Column('folder', sa.String(length=200), nullable=True),
        sa.Column('alt_text', sa.String(length=200), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('tags', sa.Text, nullable=True),
        sa.Column('uploaded_by', sa.String(length=36), nullable=True),
        sa.Column('usage_count', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: newsletters
    op.create_table(
        'newsletters',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('subject', sa.String(length=200), nullable=False),
        sa.Column('preview_text', sa.String(length=200), nullable=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('audience', sa.String(length=50), nullable=True),
        sa.Column('segment_filters', sa.JSON, nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', name='newsletterstatus'), nullable=True),
        sa.Column('scheduled_at', sa.DateTime, nullable=True),
        sa.Column('sent_at', sa.DateTime, nullable=True),
        sa.Column('recipients_count', sa.Integer, nullable=True),
        sa.Column('opens_count', sa.Integer, nullable=True),
        sa.Column('clicks_count', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: otps
    op.create_table(
        'otps',
        sa.Column('target', sa.String(length=255), nullable=False),
        sa.Column('target_type', sa.String(length=10), nullable=False),
        sa.Column('otp_hash', sa.String(length=256), nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('expires_at', sa.DateTime, nullable=False),
        sa.Column('id', postgresql.UUID(), primary_key=True),
    )

    # Table: problem_categories
    op.create_table(
        'problem_categories',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('color', sa.String(length=7), nullable=True),
        sa.Column('parent_id', postgresql.UUID(), nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
    )

    # Table: schools
    op.create_table(
        'schools',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('short_name', sa.String(length=50), nullable=True),
        sa.Column('school_type', sa.Enum('UNIVERSITY', 'COLLEGE', 'BOOTCAMP', 'TRAINING', 'HIGH_SCHOOL', 'ONLINE', name='schooltype'), nullable=True),
        sa.Column('logo_url', sa.String(length=500), nullable=True),
        sa.Column('cover_image_url', sa.String(length=500), nullable=True),
        sa.Column('primary_color', sa.String(length=7), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('tagline', sa.String(length=200), nullable=True),
        sa.Column('address', sa.Text, nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('country', sa.String(length=100), nullable=True),
        sa.Column('postal_code', sa.String(length=20), nullable=True),
        sa.Column('website', sa.String(length=500), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('linkedin_url', sa.String(length=500), nullable=True),
        sa.Column('twitter_url', sa.String(length=500), nullable=True),
        sa.Column('accreditation', sa.JSON, nullable=True),
        sa.Column('established_year', sa.Integer, nullable=True),
        sa.Column('students_count', sa.Integer, nullable=True),
        sa.Column('alumni_count', sa.Integer, nullable=True),
        sa.Column('programs_count', sa.Integer, nullable=True),
        sa.Column('placement_rate', sa.Float, nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE', name='schoolstatus'), nullable=True),
        sa.Column('is_verified', sa.Boolean, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('subscription_plan', sa.String(length=50), nullable=True),
        sa.Column('subscription_expires_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: tutorial_category
    op.create_table(
        'tutorial_category',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=False),
        sa.Column('display_order', sa.Integer, nullable=True),
        sa.Column('icon', sa.String(length=100), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('parent_id', sa.String(length=36), nullable=True),
        sa.Column('color', sa.String(length=20), nullable=True),
        sa.Column('thumbnail', sa.String(length=500), nullable=True),
        sa.Column('is_visible', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: user_role
    op.create_table(
        'user_role',
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('role_type', sa.Enum('TECHIE', 'HIRING_MANAGER', 'COMPANY_ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'BDM_ADMIN', name='roletype'), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('permissions', sa.JSON, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: users
    op.create_table(
        'users',
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('first_name', sa.String(length=100), nullable=True),
        sa.Column('middle_name', sa.String(length=150), nullable=True),
        sa.Column('last_name', sa.String(length=100), nullable=True),
        sa.Column('username', sa.String(length=50), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('mobile_number', sa.String(length=20), nullable=True),
        sa.Column('vertechie_id', sa.String(length=50), nullable=True),
        sa.Column('dob', sa.Date, nullable=True),
        sa.Column('country', sa.String(length=50), nullable=True),
        sa.Column('gov_id', sa.String(length=4), nullable=True),
        sa.Column('address', sa.Text, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('is_verified', sa.Boolean, nullable=True),
        sa.Column('email_verified', sa.Boolean, nullable=True),
        sa.Column('mobile_verified', sa.Boolean, nullable=True),
        sa.Column('is_superuser', sa.Boolean, nullable=True),
        sa.Column('verification_status', sa.Enum('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMITTED', name='verificationstatus'), nullable=True),
        sa.Column('reviewed_by_id', postgresql.UUID(), nullable=True),
        sa.Column('reviewed_at', sa.DateTime, nullable=True),
        sa.Column('rejection_reason', sa.Text, nullable=True),
        sa.Column('admin_notes', sa.Text, nullable=True),
        sa.Column('is_blocked', sa.Boolean, nullable=True),
        sa.Column('blocked_at', sa.DateTime, nullable=True),
        sa.Column('blocked_reason', sa.Text, nullable=True),
        sa.Column('blocked_by_id', postgresql.UUID(), nullable=True),
        sa.Column('face_verification', sa.JSON, nullable=True),
        sa.Column('admin_roles', sa.JSON, nullable=True),
        sa.Column('oauth_provider', sa.String(length=50), nullable=True),
        sa.Column('oauth_id', sa.String(length=255), nullable=True),
        sa.Column('last_login', sa.DateTime, nullable=True),
        sa.Column('verified_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: article_series
    op.create_table(
        'article_series',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('cover_image', sa.String(length=500), nullable=True),
        sa.Column('author_id', postgresql.UUID(), nullable=True),
        sa.Column('is_complete', sa.Boolean, nullable=True),
        sa.Column('is_published', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: assessments
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('instructions', sa.Text, nullable=True),
        sa.Column('assessment_type', sa.Enum('CODING', 'MCQ', 'SKILLS', 'PERSONALITY', 'COGNITIVE', 'CUSTOM', name='assessmenttype'), nullable=True),
        sa.Column('time_limit_minutes', sa.Integer, nullable=True),
        sa.Column('passing_score', sa.Integer, nullable=True),
        sa.Column('max_score', sa.Integer, nullable=True),
        sa.Column('is_proctored', sa.Boolean, nullable=True),
        sa.Column('allow_retake', sa.Boolean, nullable=True),
        sa.Column('randomize_questions', sa.Boolean, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: availability_schedules
    op.create_table(
        'availability_schedules',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('timezone', sa.String(length=50), nullable=True),
        sa.Column('is_default', sa.Boolean, nullable=True),
        sa.Column('weekly_hours', sa.JSON, nullable=True),
        sa.Column('date_overrides', sa.JSON, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: blocked_profile_history
    op.create_table(
        'blocked_profile_history',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('blocked_by_id', postgresql.UUID(), nullable=False),
        sa.Column('action', sa.String(length=20), nullable=False),
        sa.Column('reason', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
    )

    # Table: blocked_users
    op.create_table(
        'blocked_users',
        sa.Column('blocker_id', postgresql.UUID(), nullable=False),
        sa.Column('blocked_id', postgresql.UUID(), nullable=False),
        sa.Column('reason', sa.Text, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: calendar_connections
    op.create_table(
        'calendar_connections',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('provider', sa.Enum('GOOGLE', 'MICROSOFT', 'APPLE', 'ZOOM', name='calendarprovider'), nullable=False),
        sa.Column('access_token', sa.Text, nullable=True),
        sa.Column('refresh_token', sa.Text, nullable=True),
        sa.Column('token_expires_at', sa.DateTime, nullable=True),
        sa.Column('calendar_id', sa.String(length=255), nullable=True),
        sa.Column('calendar_name', sa.String(length=200), nullable=True),
        sa.Column('is_primary', sa.Boolean, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('sync_enabled', sa.Boolean, nullable=True),
        sa.Column('last_synced_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: chat_members
    op.create_table(
        'chat_members',
        sa.Column('conversation_id', postgresql.UUID(), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('role', sa.Enum('MEMBER', 'ADMIN', 'OWNER', name='memberrole'), nullable=True),
        sa.Column('nickname', sa.String(length=50), nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('is_muted', sa.Boolean, nullable=True),
        sa.Column('muted_until', sa.DateTime, nullable=True),
        sa.Column('last_read_at', sa.DateTime, nullable=True),
        sa.Column('last_read_message_id', postgresql.UUID(), nullable=True),
        sa.Column('unread_count', sa.Integer, nullable=True),
        sa.Column('joined_at', sa.DateTime, nullable=True),
        sa.Column('left_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: company_admins
    op.create_table(
        'company_admins',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('role', sa.String(length=50), nullable=True),
        sa.Column('can_manage_jobs', sa.Boolean, nullable=True),
        sa.Column('can_manage_candidates', sa.Boolean, nullable=True),
        sa.Column('can_manage_team', sa.Boolean, nullable=True),
        sa.Column('can_manage_billing', sa.Boolean, nullable=True),
        sa.Column('can_manage_admins', sa.Boolean, nullable=True),
        sa.Column('added_at', sa.DateTime, nullable=True),
    )

    # Table: company_benefits
    op.create_table(
        'company_benefits',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('title', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('category', sa.Enum('HEALTH', 'FINANCIAL', 'TIME_OFF', 'FAMILY', 'DEVELOPMENT', 'OFFICE', 'REMOTE', 'OTHER', name='benefitcategory'), nullable=True),
        sa.Column('icon', sa.String(length=50), nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
    )

    # Table: company_invites
    op.create_table(
        'company_invites',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_name', sa.String(length=200), nullable=False),
        sa.Column('address', sa.Text, nullable=True),
        sa.Column('website', sa.String(length=500), nullable=True),
        sa.Column('contact_person_name', sa.String(length=100), nullable=True),
        sa.Column('contact_person_role', sa.String(length=100), nullable=True),
        sa.Column('emails', sa.JSON, nullable=True),
        sa.Column('phone_numbers', sa.JSON, nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', name='invitestatus'), nullable=True),
        sa.Column('requested_by_id', postgresql.UUID(), nullable=True),
        sa.Column('admin_notes', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
        sa.Column('sent_at', sa.DateTime, nullable=True),
    )

    # Table: company_locations
    op.create_table(
        'company_locations',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=100), nullable=True),
        sa.Column('address_line1', sa.String(length=200), nullable=True),
        sa.Column('address_line2', sa.String(length=200), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=True),
        sa.Column('state', sa.String(length=100), nullable=True),
        sa.Column('country', sa.String(length=100), nullable=True),
        sa.Column('postal_code', sa.String(length=20), nullable=True),
        sa.Column('latitude', sa.Float, nullable=True),
        sa.Column('longitude', sa.Float, nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('is_headquarters', sa.Boolean, nullable=True),
        sa.Column('employees_count', sa.Integer, nullable=True),
        sa.Column('photos', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: company_photos
    op.create_table(
        'company_photos',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('thumbnail_url', sa.String(length=500), nullable=True),
        sa.Column('caption', sa.String(length=200), nullable=True),
        sa.Column('photo_type', sa.Enum('OFFICE', 'TEAM', 'EVENT', 'PRODUCT', 'OTHER', name='phototype'), nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('uploaded_at', sa.DateTime, nullable=True),
    )

    # Table: company_profiles
    op.create_table(
        'company_profiles',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('mission', sa.Text, nullable=True),
        sa.Column('vision', sa.Text, nullable=True),
        sa.Column('tagline', sa.String(length=200), nullable=True),
        sa.Column('about', sa.Text, nullable=True),
        sa.Column('history', sa.Text, nullable=True),
        sa.Column('video_url', sa.String(length=500), nullable=True),
        sa.Column('banner_image', sa.String(length=500), nullable=True),
        sa.Column('tech_stack', sa.JSON, nullable=True),
        sa.Column('work_culture', sa.Text, nullable=True),
        sa.Column('work_life_balance', sa.Text, nullable=True),
        sa.Column('remote_policy', sa.String(length=100), nullable=True),
        sa.Column('diversity_statement', sa.Text, nullable=True),
        sa.Column('diversity_metrics', sa.JSON, nullable=True),
        sa.Column('awards', sa.JSON, nullable=True),
        sa.Column('press_mentions', sa.JSON, nullable=True),
        sa.Column('custom_sections', sa.JSON, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: company_team_members
    op.create_table(
        'company_team_members',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('title', sa.String(length=100), nullable=True),
        sa.Column('bio', sa.Text, nullable=True),
        sa.Column('photo_url', sa.String(length=500), nullable=True),
        sa.Column('linkedin_url', sa.String(length=500), nullable=True),
        sa.Column('twitter_url', sa.String(length=500), nullable=True),
        sa.Column('is_leadership', sa.Boolean, nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
    )

    # Table: connection_requests
    op.create_table(
        'connection_requests',
        sa.Column('sender_id', postgresql.UUID(), nullable=False),
        sa.Column('receiver_id', postgresql.UUID(), nullable=False),
        sa.Column('request_type', sa.Enum('FOLLOW', 'CONNECT', name='followtype'), nullable=True),
        sa.Column('message', sa.Text, nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED', 'WITHDRAWN', name='connectionstatus'), nullable=True),
        sa.Column('responded_at', sa.DateTime, nullable=True),
        sa.Column('response_message', sa.Text, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: connections
    op.create_table(
        'connections',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('connected_user_id', postgresql.UUID(), nullable=False),
        sa.Column('connection_type', sa.Enum('FOLLOW', 'CONNECT', name='followtype'), nullable=True),
        sa.Column('status', sa.Enum('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED', 'WITHDRAWN', name='connectionstatus'), nullable=True),
        sa.Column('connected_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: contest_registrations
    op.create_table(
        'contest_registrations',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('contest_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('rank', sa.Integer, nullable=True),
        sa.Column('score', sa.Integer, nullable=True),
        sa.Column('finish_time', sa.DateTime, nullable=True),
        sa.Column('old_rating', sa.Integer, nullable=True),
        sa.Column('new_rating', sa.Integer, nullable=True),
        sa.Column('rating_change', sa.Integer, nullable=True),
        sa.Column('registered_at', sa.DateTime, nullable=True),
    )

    # Table: courses
    op.create_table(
        'courses',
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=True),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('short_description', sa.String(length=500), nullable=True),
        sa.Column('thumbnail', sa.String(length=500), nullable=True),
        sa.Column('preview_video', sa.String(length=500), nullable=True),
        sa.Column('category_id', postgresql.UUID(), nullable=True),
        sa.Column('instructor_id', postgresql.UUID(), nullable=False),
        sa.Column('difficulty', sa.Enum('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT', name='difficultylevel'), nullable=True),
        sa.Column('language', sa.String(length=50), nullable=True),
        sa.Column('estimated_hours', sa.Float, nullable=True),
        sa.Column('total_lessons', sa.Integer, nullable=True),
        sa.Column('total_quizzes', sa.Integer, nullable=True),
        sa.Column('is_free', sa.Boolean, nullable=True),
        sa.Column('price', sa.Float, nullable=True),
        sa.Column('currency', sa.String(length=3), nullable=True),
        sa.Column('discount_price', sa.Float, nullable=True),
        sa.Column('prerequisites', sa.JSON, nullable=True),
        sa.Column('target_audience', sa.JSON, nullable=True),
        sa.Column('learning_outcomes', sa.JSON, nullable=True),
        sa.Column('is_published', sa.Boolean, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('is_certified', sa.Boolean, nullable=True),
        sa.Column('enrollment_count', sa.Integer, nullable=True),
        sa.Column('rating', sa.Float, nullable=True),
        sa.Column('reviews_count', sa.Integer, nullable=True),
        sa.Column('completion_rate', sa.Float, nullable=True),
        sa.Column('meta_title', sa.String(length=200), nullable=True),
        sa.Column('meta_description', sa.String(length=500), nullable=True),
        sa.Column('tags', sa.JSON, nullable=True),
        sa.Column('published_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: departments
    op.create_table(
        'departments',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('school_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('short_name', sa.String(length=20), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('head_id', postgresql.UUID(), nullable=True),
        sa.Column('students_count', sa.Integer, nullable=True),
    )

    # Table: educations
    op.create_table(
        'educations',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('school_name', sa.String(length=200), nullable=False),
        sa.Column('school_id', postgresql.UUID(), nullable=True),
        sa.Column('degree', sa.String(length=100), nullable=True),
        sa.Column('field_of_study', sa.String(length=200), nullable=True),
        sa.Column('start_year', sa.Integer, nullable=True),
        sa.Column('end_year', sa.Integer, nullable=True),
        sa.Column('grade', sa.String(length=50), nullable=True),
        sa.Column('activities', sa.Text, nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('is_verified', sa.Boolean, nullable=True),
        sa.Column('verified_by_id', postgresql.UUID(), nullable=True),
        sa.Column('verified_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: experiences
    op.create_table(
        'experiences',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('company_name', sa.String(length=200), nullable=False),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('employment_type', sa.Enum('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', name='employmenttype'), nullable=True),
        sa.Column('location', sa.String(length=200), nullable=True),
        sa.Column('is_remote', sa.Boolean, nullable=True),
        sa.Column('start_date', sa.Date, nullable=False),
        sa.Column('end_date', sa.Date, nullable=True),
        sa.Column('is_current', sa.Boolean, nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('skills', sa.JSON, nullable=True),
        sa.Column('is_verified', sa.Boolean, nullable=True),
        sa.Column('verified_by_id', postgresql.UUID(), nullable=True),
        sa.Column('verified_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: follows
    op.create_table(
        'follows',
        sa.Column('follower_id', postgresql.UUID(), nullable=False),
        sa.Column('following_id', postgresql.UUID(), nullable=False),
        sa.Column('notify_on_post', sa.Boolean, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: groups
    op.create_table(
        'groups',
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('cover_url', sa.String(length=500), nullable=True),
        sa.Column('group_type', sa.Enum('PUBLIC', 'PRIVATE', 'SECRET', name='grouptype'), nullable=True),
        sa.Column('category', sa.String(length=50), nullable=True),
        sa.Column('tags', sa.JSON, nullable=True),
        sa.Column('requires_approval', sa.Boolean, nullable=True),
        sa.Column('post_approval_required', sa.Boolean, nullable=True),
        sa.Column('rules', sa.JSON, nullable=True),
        sa.Column('member_count', sa.Integer, nullable=True),
        sa.Column('post_count', sa.Integer, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('created_by_id', postgresql.UUID(), nullable=False),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: hiring_pipelines
    op.create_table(
        'hiring_pipelines',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('is_default', sa.Boolean, nullable=True),
        sa.Column('is_template', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: jobs
    op.create_table(
        'jobs',
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=True),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('short_description', sa.String(length=500), nullable=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('company_name', sa.String(length=200), nullable=True),
        sa.Column('posted_by_id', postgresql.UUID(), nullable=False),
        sa.Column('job_type', sa.Enum('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'TEMPORARY', name='jobtype'), nullable=True),
        sa.Column('experience_level', sa.Enum('ENTRY', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE', name='experiencelevel'), nullable=True),
        sa.Column('location', sa.String(length=200), nullable=True),
        sa.Column('is_remote', sa.Boolean, nullable=True),
        sa.Column('remote_type', sa.String(length=50), nullable=True),
        sa.Column('salary_min', sa.Integer, nullable=True),
        sa.Column('salary_max', sa.Integer, nullable=True),
        sa.Column('salary_currency', sa.String(length=3), nullable=True),
        sa.Column('salary_period', sa.String(length=20), nullable=True),
        sa.Column('show_salary', sa.Boolean, nullable=True),
        sa.Column('skills_required', sa.JSON, nullable=True),
        sa.Column('skills_preferred', sa.JSON, nullable=True),
        sa.Column('experience_years_min', sa.Integer, nullable=True),
        sa.Column('experience_years_max', sa.Integer, nullable=True),
        sa.Column('education_required', sa.String(length=100), nullable=True),
        sa.Column('benefits', sa.JSON, nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'PUBLISHED', 'PAUSED', 'CLOSED', 'ARCHIVED', name='jobstatus'), nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('is_internal', sa.Boolean, nullable=True),
        sa.Column('requires_cover_letter', sa.Boolean, nullable=True),
        sa.Column('external_apply_url', sa.String(length=500), nullable=True),
        sa.Column('application_deadline', sa.Date, nullable=True),
        sa.Column('views_count', sa.Integer, nullable=True),
        sa.Column('applications_count', sa.Integer, nullable=True),
        sa.Column('published_at', sa.DateTime, nullable=True),
        sa.Column('expires_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: messages
    op.create_table(
        'messages',
        sa.Column('conversation_id', postgresql.UUID(), nullable=False),
        sa.Column('sender_id', postgresql.UUID(), nullable=False),
        sa.Column('message_type', sa.Enum('TEXT', 'IMAGE', 'FILE', 'VIDEO', 'AUDIO', 'GIF', 'POLL', 'SYSTEM', name='messagetype'), nullable=True),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('media_url', sa.String(length=500), nullable=True),
        sa.Column('media_type', sa.String(length=50), nullable=True),
        sa.Column('media_name', sa.String(length=200), nullable=True),
        sa.Column('media_size', sa.Integer, nullable=True),
        sa.Column('poll_data', sa.JSON, nullable=True),
        sa.Column('reply_to_id', postgresql.UUID(), nullable=True),
        sa.Column('forwarded_from_id', postgresql.UUID(), nullable=True),
        sa.Column('reactions', sa.JSON, nullable=True),
        sa.Column('is_edited', sa.Boolean, nullable=True),
        sa.Column('edited_at', sa.DateTime, nullable=True),
        sa.Column('original_content', sa.Text, nullable=True),
        sa.Column('is_deleted', sa.Boolean, nullable=True),
        sa.Column('deleted_at', sa.DateTime, nullable=True),
        sa.Column('deleted_for_everyone', sa.Boolean, nullable=True),
        sa.Column('read_by', sa.JSON, nullable=True),
        sa.Column('mentions', sa.JSON, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: newsletter_subscribers
    op.create_table(
        'newsletter_subscribers',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('preferences', sa.JSON, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('subscribed_at', sa.DateTime, nullable=True),
        sa.Column('unsubscribed_at', sa.DateTime, nullable=True),
    )

    # Table: notifications
    op.create_table(
        'notifications',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('message', sa.Text, nullable=False),
        sa.Column('notification_type', sa.Enum('INTERVIEW_SCHEDULED', 'INTERVIEW_REMINDER', 'INTERVIEW_CANCELLED', 'APPLICATION_STATUS', 'APPLICATION_UPDATE', 'APPLICATION_SELECTED', 'APPLICATION_REJECTED', 'JOB_MATCH', 'MESSAGE', 'SYSTEM', 'OFFER_RECEIVED', 'PROFILE_VIEW', name='notificationtype'), nullable=True),
        sa.Column('link', sa.String(length=500), nullable=True),
        sa.Column('reference_id', postgresql.UUID(), nullable=True),
        sa.Column('reference_type', sa.String(length=50), nullable=True),
        sa.Column('is_read', sa.Boolean, nullable=True),
        sa.Column('read_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: problems
    op.create_table(
        'problems',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('problem_number', sa.Integer, nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('examples', sa.JSON, nullable=True),
        sa.Column('constraints', sa.Text, nullable=True),
        sa.Column('follow_up', sa.Text, nullable=True),
        sa.Column('difficulty', sa.Enum('EASY', 'MEDIUM', 'HARD', name='difficulty'), nullable=False),
        sa.Column('tags', sa.JSON, nullable=True),
        sa.Column('companies', sa.JSON, nullable=True),
        sa.Column('starter_code', sa.JSON, nullable=True),
        sa.Column('solution_code', sa.JSON, nullable=True),
        sa.Column('time_limit_ms', sa.Integer, nullable=True),
        sa.Column('memory_limit_mb', sa.Integer, nullable=True),
        sa.Column('supported_languages', sa.JSON, nullable=True),
        sa.Column('author_id', postgresql.UUID(), nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED', name='problemstatus'), nullable=True),
        sa.Column('is_premium', sa.Boolean, nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('submission_count', sa.Integer, nullable=True),
        sa.Column('accepted_count', sa.Integer, nullable=True),
        sa.Column('likes', sa.Integer, nullable=True),
        sa.Column('dislikes', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: profile_review_history
    op.create_table(
        'profile_review_history',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('reviewer_id', postgresql.UUID(), nullable=False),
        sa.Column('previous_status', sa.Enum('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMITTED', name='verificationstatus'), nullable=True),
        sa.Column('new_status', sa.Enum('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'RESUBMITTED', name='verificationstatus'), nullable=False),
        sa.Column('action', sa.String(length=50), nullable=False),
        sa.Column('reason', sa.Text, nullable=True),
        sa.Column('admin_notes', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
    )

    # Table: projects
    op.create_table(
        'projects',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('owner_id', postgresql.UUID(), nullable=True),
        sa.Column('project_type', sa.Enum('WEB', 'MOBILE', 'BACKEND', 'FULLSTACK', 'LIBRARY', 'SCRIPT', 'DATA_SCIENCE', 'MACHINE_LEARNING', 'GAME', 'OTHER', name='projecttype'), nullable=True),
        sa.Column('framework', sa.Enum('REACT', 'VUE', 'ANGULAR', 'NEXTJS', 'NUXTJS', 'SVELTE', 'VANILLA_JS', 'REACT_NATIVE', 'FLUTTER', 'IONIC', 'SWIFT', 'KOTLIN', 'DJANGO', 'FASTAPI', 'FLASK', 'EXPRESS', 'NESTJS', 'SPRING', 'DOTNET', 'RAILS', 'GO', 'RUST', 'JUPYTER', 'NONE', name='framework'), nullable=True),
        sa.Column('visibility', sa.Enum('PRIVATE', 'TEAM', 'PUBLIC', name='visibility'), nullable=True),
        sa.Column('git_url', sa.String(length=500), nullable=True),
        sa.Column('git_branch', sa.String(length=100), nullable=True),
        sa.Column('git_connected', sa.Boolean, nullable=True),
        sa.Column('default_language', sa.String(length=50), nullable=True),
        sa.Column('entry_file', sa.String(length=500), nullable=True),
        sa.Column('build_command', sa.String(length=500), nullable=True),
        sa.Column('run_command', sa.String(length=500), nullable=True),
        sa.Column('docker_image', sa.String(length=255), nullable=True),
        sa.Column('environment_variables', sa.JSON, nullable=True),
        sa.Column('ports', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
        sa.Column('last_opened_at', sa.DateTime, nullable=True),
        sa.Column('total_files', sa.Integer, nullable=True),
        sa.Column('total_size_bytes', sa.BigInteger, nullable=True),
    )

    # Table: student_batches
    op.create_table(
        'student_batches',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('school_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('start_year', sa.Integer, nullable=True),
        sa.Column('end_year', sa.Integer, nullable=True),
        sa.Column('students_count', sa.Integer, nullable=True),
        sa.Column('is_current', sa.Boolean, nullable=True),
    )

    # Table: tutorial
    op.create_table(
        'tutorial',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('short_description', sa.String(length=500), nullable=True),
        sa.Column('full_description', sa.Text, nullable=True),
        sa.Column('category_id', sa.String(length=36), nullable=True),
        sa.Column('difficulty', sa.String(length=20), nullable=True),
        sa.Column('tags', sa.Text, nullable=True),
        sa.Column('thumbnail', sa.String(length=500), nullable=True),
        sa.Column('cover_image', sa.String(length=500), nullable=True),
        sa.Column('intro_video', sa.String(length=500), nullable=True),
        sa.Column('author_id', sa.String(length=36), nullable=True),
        sa.Column('version', sa.String(length=20), nullable=True),
        sa.Column('is_free', sa.Boolean, nullable=True),
        sa.Column('price', sa.Float, nullable=True),
        sa.Column('estimated_hours', sa.Float, nullable=True),
        sa.Column('total_sections', sa.Integer, nullable=True),
        sa.Column('total_lessons', sa.Integer, nullable=True),
        sa.Column('enrollment_count', sa.Integer, nullable=True),
        sa.Column('average_rating', sa.Float, nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('published_at', sa.DateTime, nullable=True),
        sa.Column('meta_title', sa.String(length=60), nullable=True),
        sa.Column('meta_description', sa.String(length=160), nullable=True),
        sa.Column('prerequisites', sa.Text, nullable=True),
        sa.Column('skills_gained', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: user_profile
    op.create_table(
        'user_profile',
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('headline', sa.String(length=200), nullable=True),
        sa.Column('bio', sa.Text, nullable=True),
        sa.Column('location', sa.String(length=200), nullable=True),
        sa.Column('website', sa.String(length=255), nullable=True),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('cover_url', sa.String(length=500), nullable=True),
        sa.Column('skills', sa.JSON, nullable=True),
        sa.Column('experience_years', sa.Integer, nullable=True),
        sa.Column('current_position', sa.String(length=200), nullable=True),
        sa.Column('current_company', sa.String(length=200), nullable=True),
        sa.Column('linkedin_url', sa.String(length=255), nullable=True),
        sa.Column('github_url', sa.String(length=255), nullable=True),
        sa.Column('gitlab_url', sa.String(length=255), nullable=True),
        sa.Column('twitter_url', sa.String(length=255), nullable=True),
        sa.Column('portfolio_url', sa.String(length=255), nullable=True),
        sa.Column('open_to_work', sa.Boolean, nullable=True),
        sa.Column('preferred_job_types', sa.JSON, nullable=True),
        sa.Column('preferred_locations', sa.JSON, nullable=True),
        sa.Column('salary_expectation', sa.JSON, nullable=True),
        sa.Column('connections_count', sa.Integer, nullable=True),
        sa.Column('followers_count', sa.Integer, nullable=True),
        sa.Column('following_count', sa.Integer, nullable=True),
        sa.Column('posts_count', sa.Integer, nullable=True),
        sa.Column('karma_points', sa.Integer, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: user_progress
    op.create_table(
        'user_progress',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('easy_solved', sa.Integer, nullable=True),
        sa.Column('medium_solved', sa.Integer, nullable=True),
        sa.Column('hard_solved', sa.Integer, nullable=True),
        sa.Column('total_solved', sa.Integer, nullable=True),
        sa.Column('total_submissions', sa.Integer, nullable=True),
        sa.Column('accepted_submissions', sa.Integer, nullable=True),
        sa.Column('current_streak', sa.Integer, nullable=True),
        sa.Column('max_streak', sa.Integer, nullable=True),
        sa.Column('last_submission_date', sa.DateTime, nullable=True),
        sa.Column('rating', sa.Integer, nullable=True),
        sa.Column('max_rating', sa.Integer, nullable=True),
        sa.Column('badges', sa.JSON, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: user_roles
    op.create_table(
        'user_roles',
        sa.Column('user_id', postgresql.UUID(), primary_key=True),
        sa.Column('role_id', postgresql.UUID(), primary_key=True),
    )

    # Table: workspaces
    op.create_table(
        'workspaces',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('theme', sa.String(length=50), nullable=True),
        sa.Column('font_size', sa.Integer, nullable=True),
        sa.Column('font_family', sa.String(length=100), nullable=True),
        sa.Column('tab_size', sa.Integer, nullable=True),
        sa.Column('auto_save', sa.Boolean, nullable=True),
        sa.Column('word_wrap', sa.Boolean, nullable=True),
        sa.Column('line_numbers', sa.Boolean, nullable=True),
        sa.Column('minimap', sa.Boolean, nullable=True),
        sa.Column('keybindings', sa.String(length=50), nullable=True),
        sa.Column('custom_settings', sa.JSON, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: articles
    op.create_table(
        'articles',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('subtitle', sa.String(length=300), nullable=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('excerpt', sa.Text, nullable=True),
        sa.Column('content_type', sa.Enum('ARTICLE', 'TUTORIAL', 'NEWS', 'OPINION', 'INTERVIEW', 'CASE_STUDY', name='contenttype'), nullable=True),
        sa.Column('cover_image', sa.String(length=500), nullable=True),
        sa.Column('thumbnail', sa.String(length=500), nullable=True),
        sa.Column('author_id', postgresql.UUID(), nullable=True),
        sa.Column('category_id', postgresql.UUID(), nullable=True),
        sa.Column('series_id', postgresql.UUID(), nullable=True),
        sa.Column('series_order', sa.Integer, nullable=True),
        sa.Column('meta_title', sa.String(length=70), nullable=True),
        sa.Column('meta_description', sa.String(length=160), nullable=True),
        sa.Column('canonical_url', sa.String(length=500), nullable=True),
        sa.Column('reading_time_minutes', sa.Integer, nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED', name='articlestatus'), nullable=True),
        sa.Column('is_featured', sa.Boolean, nullable=True),
        sa.Column('is_pinned', sa.Boolean, nullable=True),
        sa.Column('is_premium', sa.Boolean, nullable=True),
        sa.Column('views_count', sa.Integer, nullable=True),
        sa.Column('unique_views', sa.Integer, nullable=True),
        sa.Column('reactions_count', sa.Integer, nullable=True),
        sa.Column('comments_count', sa.Integer, nullable=True),
        sa.Column('shares_count', sa.Integer, nullable=True),
        sa.Column('bookmarks_count', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
        sa.Column('published_at', sa.DateTime, nullable=True),
        sa.Column('scheduled_at', sa.DateTime, nullable=True),
    )

    # Table: assessment_problems
    op.create_table(
        'assessment_problems',
        sa.Column('assessment_id', postgresql.UUID(), nullable=True),
        sa.Column('problem_id', postgresql.UUID(), nullable=True),
    )

    # Table: assessment_questions
    op.create_table(
        'assessment_questions',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(), nullable=True),
        sa.Column('question_type', sa.Enum('MCQ', 'MULTI_SELECT', 'SHORT_ANSWER', 'LONG_ANSWER', 'CODE', 'FILE_UPLOAD', name='questiontype'), nullable=True),
        sa.Column('question_text', sa.Text, nullable=False),
        sa.Column('options', sa.JSON, nullable=True),
        sa.Column('correct_answers', sa.JSON, nullable=True),
        sa.Column('code_language', sa.String(length=50), nullable=True),
        sa.Column('starter_code', sa.Text, nullable=True),
        sa.Column('test_cases', sa.JSON, nullable=True),
        sa.Column('points', sa.Integer, nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('explanation', sa.Text, nullable=True),
    )

    # Table: code_executions
    op.create_table(
        'code_executions',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('project_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('language', sa.String(length=50), nullable=False),
        sa.Column('code', sa.Text, nullable=False),
        sa.Column('entry_file', sa.String(length=500), nullable=True),
        sa.Column('input_data', sa.Text, nullable=True),
        sa.Column('status', sa.Enum('QUEUED', 'RUNNING', 'COMPLETED', 'ERROR', 'TIMEOUT', 'CANCELLED', name='executionstatus'), nullable=True),
        sa.Column('stdout', sa.Text, nullable=True),
        sa.Column('stderr', sa.Text, nullable=True),
        sa.Column('exit_code', sa.Integer, nullable=True),
        sa.Column('runtime_ms', sa.Integer, nullable=True),
        sa.Column('memory_kb', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
    )

    # Table: debug_sessions
    op.create_table(
        'debug_sessions',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('project_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('language', sa.String(length=50), nullable=True),
        sa.Column('entry_file', sa.String(length=500), nullable=True),
        sa.Column('breakpoints', sa.JSON, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('current_file', sa.String(length=500), nullable=True),
        sa.Column('current_line', sa.Integer, nullable=True),
        sa.Column('variables', sa.JSON, nullable=True),
        sa.Column('call_stack', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: group_members
    op.create_table(
        'group_members',
        sa.Column('group_id', postgresql.UUID(), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('role', sa.Enum('MEMBER', 'MODERATOR', 'ADMIN', 'OWNER', name='groupmemberrole'), nullable=True),
        sa.Column('is_approved', sa.Boolean, nullable=True),
        sa.Column('is_banned', sa.Boolean, nullable=True),
        sa.Column('ban_reason', sa.Text, nullable=True),
        sa.Column('notifications_enabled', sa.Boolean, nullable=True),
        sa.Column('joined_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: job_applications
    op.create_table(
        'job_applications',
        sa.Column('job_id', postgresql.UUID(), nullable=False),
        sa.Column('applicant_id', postgresql.UUID(), nullable=False),
        sa.Column('status', sa.Enum('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED', 'WITHDRAWN', name='applicationstatus'), nullable=True),
        sa.Column('cover_letter', sa.Text, nullable=True),
        sa.Column('resume_url', sa.String(length=500), nullable=True),
        sa.Column('answers', sa.JSON, nullable=True),
        sa.Column('expected_salary', sa.Integer, nullable=True),
        sa.Column('available_from', sa.Date, nullable=True),
        sa.Column('referral_source', sa.String(length=100), nullable=True),
        sa.Column('reviewed_by_id', postgresql.UUID(), nullable=True),
        sa.Column('reviewed_at', sa.DateTime, nullable=True),
        sa.Column('reviewer_notes', sa.Text, nullable=True),
        sa.Column('rating', sa.Integer, nullable=True),
        sa.Column('match_score', sa.Integer, nullable=True),
        sa.Column('matched_skills', sa.JSON, nullable=True),
        sa.Column('missing_skills', sa.JSON, nullable=True),
        sa.Column('submitted_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: meeting_types
    op.create_table(
        'meeting_types',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('color', sa.String(length=20), nullable=True),
        sa.Column('duration_minutes', sa.Integer, nullable=True),
        sa.Column('schedule_id', postgresql.UUID(), nullable=True),
        sa.Column('buffer_before_minutes', sa.Integer, nullable=True),
        sa.Column('buffer_after_minutes', sa.Integer, nullable=True),
        sa.Column('min_notice_hours', sa.Integer, nullable=True),
        sa.Column('max_days_ahead', sa.Integer, nullable=True),
        sa.Column('max_bookings_per_day', sa.Integer, nullable=True),
        sa.Column('location_type', sa.String(length=50), nullable=True),
        sa.Column('location_details', sa.Text, nullable=True),
        sa.Column('video_link', sa.String(length=500), nullable=True),
        sa.Column('is_paid', sa.Boolean, nullable=True),
        sa.Column('price', sa.Integer, nullable=True),
        sa.Column('currency', sa.String(length=3), nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('is_public', sa.Boolean, nullable=True),
        sa.Column('custom_questions', sa.JSON, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: modules
    op.create_table(
        'modules',
        sa.Column('course_id', postgresql.UUID(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('estimated_minutes', sa.Integer, nullable=True),
        sa.Column('is_free_preview', sa.Boolean, nullable=True),
        sa.Column('is_published', sa.Boolean, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: pipeline_stages
    op.create_table(
        'pipeline_stages',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('pipeline_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('stage_type', sa.Enum('APPLIED', 'SCREENING', 'PHONE_SCREEN', 'ASSESSMENT', 'INTERVIEW', 'ONSITE', 'OFFER', 'HIRED', 'REJECTED', name='stagetype'), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('color', sa.String(length=7), nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('auto_advance_days', sa.Integer, nullable=True),
        sa.Column('auto_reject_days', sa.Integer, nullable=True),
        sa.Column('email_on_enter', sa.Text, nullable=True),
        sa.Column('email_on_reject', sa.Text, nullable=True),
    )

    # Table: placements
    op.create_table(
        'placements',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('school_id', postgresql.UUID(), nullable=True),
        sa.Column('student_id', postgresql.UUID(), nullable=True),
        sa.Column('batch_id', postgresql.UUID(), nullable=True),
        sa.Column('company_id', postgresql.UUID(), nullable=True),
        sa.Column('company_name', sa.String(length=200), nullable=True),
        sa.Column('job_title', sa.String(length=200), nullable=True),
        sa.Column('job_type', sa.String(length=50), nullable=True),
        sa.Column('salary', sa.Float, nullable=True),
        sa.Column('currency', sa.String(length=3), nullable=True),
        sa.Column('offer_date', sa.DateTime, nullable=True),
        sa.Column('joining_date', sa.DateTime, nullable=True),
        sa.Column('is_verified', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: posts
    op.create_table(
        'posts',
        sa.Column('author_id', postgresql.UUID(), nullable=False),
        sa.Column('group_id', postgresql.UUID(), nullable=True),
        sa.Column('post_type', sa.Enum('TEXT', 'IMAGE', 'VIDEO', 'LINK', 'POLL', 'ARTICLE', 'EVENT', name='posttype'), nullable=True),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('content_html', sa.Text, nullable=True),
        sa.Column('media', sa.JSON, nullable=True),
        sa.Column('link_url', sa.String(length=500), nullable=True),
        sa.Column('link_preview', sa.JSON, nullable=True),
        sa.Column('poll_data', sa.JSON, nullable=True),
        sa.Column('tags', sa.JSON, nullable=True),
        sa.Column('mentions', sa.JSON, nullable=True),
        sa.Column('visibility', sa.String(length=20), nullable=True),
        sa.Column('is_published', sa.Boolean, nullable=True),
        sa.Column('is_pinned', sa.Boolean, nullable=True),
        sa.Column('is_approved', sa.Boolean, nullable=True),
        sa.Column('likes_count', sa.Integer, nullable=True),
        sa.Column('comments_count', sa.Integer, nullable=True),
        sa.Column('shares_count', sa.Integer, nullable=True),
        sa.Column('views_count', sa.Integer, nullable=True),
        sa.Column('is_edited', sa.Boolean, nullable=True),
        sa.Column('edited_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: problem_category_association
    op.create_table(
        'problem_category_association',
        sa.Column('problem_id', postgresql.UUID(), nullable=True),
        sa.Column('category_id', postgresql.UUID(), nullable=True),
    )

    # Table: problem_hints
    op.create_table(
        'problem_hints',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('problem_id', postgresql.UUID(), nullable=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('unlock_cost', sa.Integer, nullable=True),
    )

    # Table: problem_solutions
    op.create_table(
        'problem_solutions',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('problem_id', postgresql.UUID(), nullable=True),
        sa.Column('author_id', postgresql.UUID(), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('language', sa.String(length=50), nullable=True),
        sa.Column('time_complexity', sa.String(length=50), nullable=True),
        sa.Column('space_complexity', sa.String(length=50), nullable=True),
        sa.Column('is_official', sa.Boolean, nullable=True),
        sa.Column('is_approved', sa.Boolean, nullable=True),
        sa.Column('votes', sa.Integer, nullable=True),
        sa.Column('views', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: programs
    op.create_table(
        'programs',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('school_id', postgresql.UUID(), nullable=True),
        sa.Column('department_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=True),
        sa.Column('code', sa.String(length=20), nullable=True),
        sa.Column('program_type', sa.Enum('BACHELORS', 'MASTERS', 'PHD', 'DIPLOMA', 'CERTIFICATE', 'BOOTCAMP', name='programtype'), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('duration_months', sa.Integer, nullable=True),
        sa.Column('tuition_fee', sa.Float, nullable=True),
        sa.Column('currency', sa.String(length=3), nullable=True),
        sa.Column('requirements', sa.JSON, nullable=True),
        sa.Column('seats_available', sa.Integer, nullable=True),
        sa.Column('enrolled_count', sa.Integer, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: project_collaborators
    op.create_table(
        'project_collaborators',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('project_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('role', sa.Enum('OWNER', 'ADMIN', 'EDITOR', 'VIEWER', name='collaboratorrole'), nullable=True),
        sa.Column('can_edit', sa.Boolean, nullable=True),
        sa.Column('can_execute', sa.Boolean, nullable=True),
        sa.Column('can_manage_files', sa.Boolean, nullable=True),
        sa.Column('can_invite', sa.Boolean, nullable=True),
        sa.Column('last_active_at', sa.DateTime, nullable=True),
        sa.Column('cursor_position', sa.JSON, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: project_folders
    op.create_table(
        'project_folders',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('project_id', postgresql.UUID(), nullable=True),
        sa.Column('parent_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('path', sa.String(length=1000), nullable=False),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: saved_jobs
    op.create_table(
        'saved_jobs',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('job_id', postgresql.UUID(), nullable=False),
        sa.Column('notes', sa.Text, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: school_admins
    op.create_table(
        'school_admins',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('school_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('role', sa.Enum('OWNER', 'ADMIN', 'PLACEMENT_HEAD', 'HOD', 'FACULTY', name='adminrole'), nullable=True),
        sa.Column('department_id', postgresql.UUID(), nullable=True),
        sa.Column('can_manage_students', sa.Boolean, nullable=True),
        sa.Column('can_manage_programs', sa.Boolean, nullable=True),
        sa.Column('can_manage_placements', sa.Boolean, nullable=True),
        sa.Column('can_manage_admins', sa.Boolean, nullable=True),
        sa.Column('added_at', sa.DateTime, nullable=True),
    )

    # Table: school_members
    op.create_table(
        'school_members',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('school_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('member_type', sa.Enum('CURRENT_STUDENT', 'ALUMNI', 'FACULTY', name='membertype'), nullable=True),
        sa.Column('student_id', sa.String(length=50), nullable=True),
        sa.Column('department_id', postgresql.UUID(), nullable=True),
        sa.Column('batch_id', postgresql.UUID(), nullable=True),
        sa.Column('graduation_year', sa.Integer, nullable=True),
        sa.Column('is_verified', sa.Boolean, nullable=True),
        sa.Column('joined_at', sa.DateTime, nullable=True),
    )

    # Table: similar_problems_association
    op.create_table(
        'similar_problems_association',
        sa.Column('problem_id', postgresql.UUID(), nullable=True),
        sa.Column('similar_problem_id', postgresql.UUID(), nullable=True),
    )

    # Table: submissions
    op.create_table(
        'submissions',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('problem_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('language', sa.String(length=50), nullable=False),
        sa.Column('code', sa.Text, nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT', 'MEMORY_LIMIT', 'RUNTIME_ERROR', 'COMPILE_ERROR', 'INTERNAL_ERROR', name='submissionstatus'), nullable=True),
        sa.Column('runtime_ms', sa.Integer, nullable=True),
        sa.Column('memory_kb', sa.Integer, nullable=True),
        sa.Column('test_cases_passed', sa.Integer, nullable=True),
        sa.Column('test_cases_total', sa.Integer, nullable=True),
        sa.Column('error_message', sa.Text, nullable=True),
        sa.Column('failed_test_case', sa.Integer, nullable=True),
        sa.Column('score', sa.Integer, nullable=True),
        sa.Column('is_submission', sa.Boolean, nullable=True),
        sa.Column('submitted_at', sa.DateTime, nullable=True),
    )

    # Table: test_cases
    op.create_table(
        'test_cases',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('problem_id', postgresql.UUID(), nullable=True),
        sa.Column('input_data', sa.Text, nullable=False),
        sa.Column('expected_output', sa.Text, nullable=False),
        sa.Column('explanation', sa.Text, nullable=True),
        sa.Column('is_sample', sa.Boolean, nullable=True),
        sa.Column('is_hidden', sa.Boolean, nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('weight', sa.Integer, nullable=True),
    )

    # Table: tutorial_enrollment
    op.create_table(
        'tutorial_enrollment',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('tutorial_id', sa.String(length=36), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('progress_percent', sa.Float, nullable=True),
        sa.Column('completed_lessons', sa.Integer, nullable=True),
        sa.Column('enrolled_at', sa.DateTime, nullable=True),
        sa.Column('started_at', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('last_accessed_at', sa.DateTime, nullable=True),
        sa.Column('certificate_issued', sa.Boolean, nullable=True),
        sa.Column('certificate_id', sa.String(length=36), nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: tutorial_section
    op.create_table(
        'tutorial_section',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('tutorial_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('display_order', sa.Integer, nullable=True),
        sa.Column('is_free_preview', sa.Boolean, nullable=True),
        sa.Column('estimated_minutes', sa.Integer, nullable=True),
        sa.Column('is_published', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: article_bookmarks
    op.create_table(
        'article_bookmarks',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('article_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: article_coauthors
    op.create_table(
        'article_coauthors',
        sa.Column('article_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
    )

    # Table: article_comments
    op.create_table(
        'article_comments',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('article_id', postgresql.UUID(), nullable=True),
        sa.Column('author_id', postgresql.UUID(), nullable=True),
        sa.Column('parent_id', postgresql.UUID(), nullable=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('likes_count', sa.Integer, nullable=True),
        sa.Column('is_edited', sa.Boolean, nullable=True),
        sa.Column('is_deleted', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: article_reactions
    op.create_table(
        'article_reactions',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('article_id', postgresql.UUID(), nullable=True),
        sa.Column('user_id', postgresql.UUID(), nullable=True),
        sa.Column('reaction_type', sa.Enum('LIKE', 'LOVE', 'INSIGHTFUL', 'CLAP', 'FIRE', name='reactiontype'), nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: article_tags
    op.create_table(
        'article_tags',
        sa.Column('article_id', postgresql.UUID(), nullable=True),
        sa.Column('tag_id', postgresql.UUID(), nullable=True),
    )

    # Table: bookings
    op.create_table(
        'bookings',
        sa.Column('meeting_type_id', postgresql.UUID(), nullable=False),
        sa.Column('host_id', postgresql.UUID(), nullable=False),
        sa.Column('invitee_id', postgresql.UUID(), nullable=True),
        sa.Column('invitee_name', sa.String(length=200), nullable=False),
        sa.Column('invitee_email', sa.String(length=255), nullable=False),
        sa.Column('invitee_phone', sa.String(length=20), nullable=True),
        sa.Column('invitee_timezone', sa.String(length=50), nullable=True),
        sa.Column('answers', sa.JSON, nullable=True),
        sa.Column('start_time', sa.DateTime, nullable=False),
        sa.Column('end_time', sa.DateTime, nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW', name='bookingstatus'), nullable=True),
        sa.Column('location', sa.Text, nullable=True),
        sa.Column('video_link', sa.String(length=500), nullable=True),
        sa.Column('host_notes', sa.Text, nullable=True),
        sa.Column('invitee_notes', sa.Text, nullable=True),
        sa.Column('cancelled_by', sa.String(length=20), nullable=True),
        sa.Column('cancellation_reason', sa.Text, nullable=True),
        sa.Column('cancelled_at', sa.DateTime, nullable=True),
        sa.Column('host_calendar_event_id', sa.String(length=255), nullable=True),
        sa.Column('invitee_calendar_event_id', sa.String(length=255), nullable=True),
        sa.Column('reminder_sent', sa.Boolean, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: candidate_assessments
    op.create_table(
        'candidate_assessments',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('assessment_id', postgresql.UUID(), nullable=True),
        sa.Column('candidate_id', postgresql.UUID(), nullable=True),
        sa.Column('application_id', postgresql.UUID(), nullable=True),
        sa.Column('status', sa.Enum('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'GRADING', 'COMPLETED', 'EXPIRED', name='candidateassessmentstatus'), nullable=True),
        sa.Column('answers', sa.JSON, nullable=True),
        sa.Column('score', sa.Float, nullable=True),
        sa.Column('passed', sa.Boolean, nullable=True),
        sa.Column('started_at', sa.DateTime, nullable=True),
        sa.Column('submitted_at', sa.DateTime, nullable=True),
        sa.Column('time_taken_seconds', sa.Integer, nullable=True),
        sa.Column('invited_at', sa.DateTime, nullable=True),
        sa.Column('expires_at', sa.DateTime, nullable=True),
    )

    # Table: candidates_in_pipeline
    op.create_table(
        'candidates_in_pipeline',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('application_id', postgresql.UUID(), nullable=True),
        sa.Column('pipeline_id', postgresql.UUID(), nullable=True),
        sa.Column('current_stage_id', postgresql.UUID(), nullable=True),
        sa.Column('assigned_to_id', postgresql.UUID(), nullable=True),
        sa.Column('stage_history', sa.JSON, nullable=True),
        sa.Column('priority', sa.Integer, nullable=True),
        sa.Column('is_starred', sa.Boolean, nullable=True),
        sa.Column('entered_stage_at', sa.DateTime, nullable=True),
        sa.Column('rejection_reason', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: comments
    op.create_table(
        'comments',
        sa.Column('post_id', postgresql.UUID(), nullable=False),
        sa.Column('author_id', postgresql.UUID(), nullable=False),
        sa.Column('parent_id', postgresql.UUID(), nullable=True),
        sa.Column('content', sa.Text, nullable=False),
        sa.Column('media_url', sa.String(length=500), nullable=True),
        sa.Column('mentions', sa.JSON, nullable=True),
        sa.Column('likes_count', sa.Integer, nullable=True),
        sa.Column('replies_count', sa.Integer, nullable=True),
        sa.Column('is_edited', sa.Boolean, nullable=True),
        sa.Column('edited_at', sa.DateTime, nullable=True),
        sa.Column('is_deleted', sa.Boolean, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: interviews
    op.create_table(
        'interviews',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('application_id', postgresql.UUID(), nullable=True),
        sa.Column('interview_type', sa.Enum('PHONE', 'VIDEO', 'ONSITE', 'TECHNICAL', 'BEHAVIORAL', 'PANEL', name='interviewtype'), nullable=True),
        sa.Column('scheduled_at', sa.DateTime, nullable=False),
        sa.Column('duration_minutes', sa.Integer, nullable=True),
        sa.Column('timezone', sa.String(length=50), nullable=True),
        sa.Column('location', sa.String(length=200), nullable=True),
        sa.Column('meeting_link', sa.String(length=500), nullable=True),
        sa.Column('interviewers', sa.JSON, nullable=True),
        sa.Column('status', sa.Enum('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', name='interviewstatus'), nullable=True),
        sa.Column('notes', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: job_offers
    op.create_table(
        'job_offers',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('application_id', postgresql.UUID(), nullable=True),
        sa.Column('base_salary', sa.Float, nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=True),
        sa.Column('salary_period', sa.String(length=20), nullable=True),
        sa.Column('equity_type', sa.String(length=50), nullable=True),
        sa.Column('equity_amount', sa.Float, nullable=True),
        sa.Column('vesting_period', sa.String(length=50), nullable=True),
        sa.Column('signing_bonus', sa.Float, nullable=True),
        sa.Column('annual_bonus', sa.Float, nullable=True),
        sa.Column('benefits', sa.JSON, nullable=True),
        sa.Column('job_title', sa.String(length=200), nullable=True),
        sa.Column('start_date', sa.DateTime, nullable=True),
        sa.Column('employment_type', sa.String(length=50), nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'WITHDRAWN', name='offerstatus'), nullable=True),
        sa.Column('expires_at', sa.DateTime, nullable=True),
        sa.Column('responded_at', sa.DateTime, nullable=True),
        sa.Column('response_notes', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
    )

    # Table: lessons
    op.create_table(
        'lessons',
        sa.Column('module_id', postgresql.UUID(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('lesson_type', sa.Enum('VIDEO', 'ARTICLE', 'QUIZ', 'EXERCISE', 'PROJECT', 'INTERACTIVE', name='lessontype'), nullable=True),
        sa.Column('content_html', sa.Text, nullable=True),
        sa.Column('content_markdown', sa.Text, nullable=True),
        sa.Column('video_url', sa.String(length=500), nullable=True),
        sa.Column('video_duration_seconds', sa.Integer, nullable=True),
        sa.Column('video_provider', sa.String(length=50), nullable=True),
        sa.Column('initial_code', sa.Text, nullable=True),
        sa.Column('solution_code', sa.Text, nullable=True),
        sa.Column('language', sa.String(length=50), nullable=True),
        sa.Column('estimated_minutes', sa.Integer, nullable=True),
        sa.Column('is_free_preview', sa.Boolean, nullable=True),
        sa.Column('is_published', sa.Boolean, nullable=True),
        sa.Column('attachments', sa.JSON, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: post_reactions
    op.create_table(
        'post_reactions',
        sa.Column('post_id', postgresql.UUID(), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('reaction_type', sa.String(length=20), nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: project_files
    op.create_table(
        'project_files',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('project_id', postgresql.UUID(), nullable=True),
        sa.Column('folder_id', postgresql.UUID(), nullable=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('path', sa.String(length=1000), nullable=False),
        sa.Column('extension', sa.String(length=50), nullable=True),
        sa.Column('language', sa.String(length=50), nullable=True),
        sa.Column('file_type', sa.Enum('CODE', 'CONFIG', 'DATA', 'ASSET', 'DOCUMENT', 'OTHER', name='filetype'), nullable=True),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('content_binary', sa.LargeBinary, nullable=True),
        sa.Column('is_binary', sa.Boolean, nullable=True),
        sa.Column('size_bytes', sa.Integer, nullable=True),
        sa.Column('encoding', sa.String(length=50), nullable=True),
        sa.Column('line_count', sa.Integer, nullable=True),
        sa.Column('version', sa.Integer, nullable=True),
        sa.Column('checksum', sa.String(length=64), nullable=True),
        sa.Column('locked_by_id', postgresql.UUID(), nullable=True),
        sa.Column('locked_at', sa.DateTime, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
        sa.Column('updated_at', sa.DateTime, nullable=True),
        sa.Column('last_edited_by_id', postgresql.UUID(), nullable=True),
    )

    # Table: scheduling_links
    op.create_table(
        'scheduling_links',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('meeting_type_id', postgresql.UUID(), nullable=True),
        sa.Column('token', sa.String(length=100), nullable=True),
        sa.Column('name', sa.String(length=100), nullable=True),
        sa.Column('duration_minutes', sa.Integer, nullable=True),
        sa.Column('available_days', sa.JSON, nullable=True),
        sa.Column('start_date', sa.Date, nullable=True),
        sa.Column('end_date', sa.Date, nullable=True),
        sa.Column('start_time', sa.Time, nullable=True),
        sa.Column('end_time', sa.Time, nullable=True),
        sa.Column('buffer_before', sa.Integer, nullable=True),
        sa.Column('buffer_after', sa.Integer, nullable=True),
        sa.Column('max_bookings', sa.Integer, nullable=True),
        sa.Column('bookings_count', sa.Integer, nullable=True),
        sa.Column('requires_approval', sa.Boolean, nullable=True),
        sa.Column('is_active', sa.Boolean, nullable=True),
        sa.Column('expires_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: submission_test_results
    op.create_table(
        'submission_test_results',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('submission_id', postgresql.UUID(), nullable=True),
        sa.Column('test_case_number', sa.Integer, nullable=False),
        sa.Column('status', sa.Enum('PASSED', 'FAILED', 'ERROR', 'TIMEOUT', 'SKIPPED', name='testresultstatus'), nullable=True),
        sa.Column('input_data', sa.Text, nullable=True),
        sa.Column('expected_output', sa.Text, nullable=True),
        sa.Column('actual_output', sa.Text, nullable=True),
        sa.Column('runtime_ms', sa.Integer, nullable=True),
        sa.Column('memory_kb', sa.Integer, nullable=True),
        sa.Column('stderr', sa.Text, nullable=True),
    )

    # Table: tutorial_lesson
    op.create_table(
        'tutorial_lesson',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('section_id', sa.String(length=36), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=True),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('display_order', sa.Integer, nullable=True),
        sa.Column('lesson_type', sa.String(length=20), nullable=True),
        sa.Column('estimated_minutes', sa.Integer, nullable=True),
        sa.Column('is_free_preview', sa.Boolean, nullable=True),
        sa.Column('is_required', sa.Boolean, nullable=True),
        sa.Column('is_published', sa.Boolean, nullable=True),
        sa.Column('has_quiz', sa.Boolean, nullable=True),
        sa.Column('has_exercise', sa.Boolean, nullable=True),
        sa.Column('has_try_it', sa.Boolean, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: assessment_results
    op.create_table(
        'assessment_results',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('attempt_id', postgresql.UUID(), nullable=True),
        sa.Column('question_id', postgresql.UUID(), nullable=True),
        sa.Column('answer', sa.JSON, nullable=True),
        sa.Column('is_correct', sa.Boolean, nullable=True),
        sa.Column('points_earned', sa.Float, nullable=True),
        sa.Column('grader_notes', sa.Text, nullable=True),
        sa.Column('graded_by_id', postgresql.UUID(), nullable=True),
    )

    # Table: content_block
    op.create_table(
        'content_block',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('lesson_id', sa.String(length=36), nullable=False),
        sa.Column('block_type', sa.String(length=30), nullable=False),
        sa.Column('display_order', sa.Integer, nullable=True),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('settings', sa.Text, nullable=True),
        sa.Column('code_content', sa.Text, nullable=True),
        sa.Column('code_language', sa.String(length=50), nullable=True),
        sa.Column('default_code', sa.Text, nullable=True),
        sa.Column('expected_output', sa.Text, nullable=True),
        sa.Column('result_type', sa.String(length=30), nullable=True),
        sa.Column('media_url', sa.String(length=500), nullable=True),
        sa.Column('alt_text', sa.String(length=200), nullable=True),
        sa.Column('caption', sa.String(length=500), nullable=True),
        sa.Column('header_level', sa.Integer, nullable=True),
        sa.Column('quiz_data', sa.Text, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: course_enrollments
    op.create_table(
        'course_enrollments',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('course_id', postgresql.UUID(), nullable=False),
        sa.Column('status', sa.Enum('ACTIVE', 'COMPLETED', 'DROPPED', 'PAUSED', name='enrollmentstatus'), nullable=True),
        sa.Column('progress_percentage', sa.Float, nullable=True),
        sa.Column('completed_lessons', sa.Integer, nullable=True),
        sa.Column('current_lesson_id', postgresql.UUID(), nullable=True),
        sa.Column('is_paid', sa.Boolean, nullable=True),
        sa.Column('payment_amount', sa.Float, nullable=True),
        sa.Column('payment_id', sa.String(length=100), nullable=True),
        sa.Column('certificate_issued', sa.Boolean, nullable=True),
        sa.Column('certificate_url', sa.String(length=500), nullable=True),
        sa.Column('certificate_issued_at', sa.DateTime, nullable=True),
        sa.Column('enrolled_at', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('last_accessed_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: file_versions
    op.create_table(
        'file_versions',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('file_id', postgresql.UUID(), nullable=True),
        sa.Column('version', sa.Integer, nullable=False),
        sa.Column('content', sa.Text, nullable=True),
        sa.Column('checksum', sa.String(length=64), nullable=True),
        sa.Column('created_by_id', postgresql.UUID(), nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=True),
    )

    # Table: interview_scorecards
    op.create_table(
        'interview_scorecards',
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('interview_id', postgresql.UUID(), nullable=True),
        sa.Column('interviewer_id', postgresql.UUID(), nullable=True),
        sa.Column('overall_score', sa.Integer, nullable=True),
        sa.Column('scores', sa.JSON, nullable=True),
        sa.Column('strengths', sa.Text, nullable=True),
        sa.Column('weaknesses', sa.Text, nullable=True),
        sa.Column('notes', sa.Text, nullable=True),
        sa.Column('recommendation', sa.String(length=50), nullable=True),
        sa.Column('submitted_at', sa.DateTime, nullable=True),
    )

    # Table: quizzes
    op.create_table(
        'quizzes',
        sa.Column('lesson_id', postgresql.UUID(), nullable=True),
        sa.Column('course_id', postgresql.UUID(), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text, nullable=True),
        sa.Column('instructions', sa.Text, nullable=True),
        sa.Column('time_limit_minutes', sa.Integer, nullable=True),
        sa.Column('passing_score', sa.Float, nullable=True),
        sa.Column('max_attempts', sa.Integer, nullable=True),
        sa.Column('shuffle_questions', sa.Boolean, nullable=True),
        sa.Column('shuffle_options', sa.Boolean, nullable=True),
        sa.Column('show_correct_answers', sa.Boolean, nullable=True),
        sa.Column('is_published', sa.Boolean, nullable=True),
        sa.Column('is_required', sa.Boolean, nullable=True),
        sa.Column('total_questions', sa.Integer, nullable=True),
        sa.Column('total_points', sa.Integer, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: tutorial_lesson_progress
    op.create_table(
        'tutorial_lesson_progress',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('lesson_id', sa.String(length=36), nullable=False),
        sa.Column('is_completed', sa.Boolean, nullable=True),
        sa.Column('progress_percent', sa.Float, nullable=True),
        sa.Column('time_spent_seconds', sa.Integer, nullable=True),
        sa.Column('started_at', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('last_accessed_at', sa.DateTime, nullable=True),
        sa.Column('code_submissions', sa.Integer, nullable=True),
        sa.Column('successful_runs', sa.Integer, nullable=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: lesson_progress
    op.create_table(
        'lesson_progress',
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('lesson_id', postgresql.UUID(), nullable=False),
        sa.Column('enrollment_id', postgresql.UUID(), nullable=True),
        sa.Column('status', sa.Enum('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', name='lessonstatus'), nullable=True),
        sa.Column('progress_percentage', sa.Float, nullable=True),
        sa.Column('video_position_seconds', sa.Integer, nullable=True),
        sa.Column('user_code', sa.Text, nullable=True),
        sa.Column('time_spent_seconds', sa.Integer, nullable=True),
        sa.Column('started_at', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('last_accessed_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: questions
    op.create_table(
        'questions',
        sa.Column('quiz_id', postgresql.UUID(), nullable=False),
        sa.Column('question_text', sa.Text, nullable=False),
        sa.Column('question_html', sa.Text, nullable=True),
        sa.Column('question_type', sa.Enum('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'LONG_ANSWER', 'CODE', 'FILL_BLANK', 'MATCHING', 'ORDERING', name='questiontype'), nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('code_snippet', sa.Text, nullable=True),
        sa.Column('code_language', sa.String(length=50), nullable=True),
        sa.Column('test_cases', sa.JSON, nullable=True),
        sa.Column('points', sa.Integer, nullable=True),
        sa.Column('explanation', sa.Text, nullable=True),
        sa.Column('is_required', sa.Boolean, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: quiz_attempts
    op.create_table(
        'quiz_attempts',
        sa.Column('quiz_id', postgresql.UUID(), nullable=False),
        sa.Column('user_id', postgresql.UUID(), nullable=False),
        sa.Column('score', sa.Float, nullable=True),
        sa.Column('percentage', sa.Float, nullable=True),
        sa.Column('passed', sa.Boolean, nullable=True),
        sa.Column('total_questions', sa.Integer, nullable=True),
        sa.Column('correct_answers', sa.Integer, nullable=True),
        sa.Column('wrong_answers', sa.Integer, nullable=True),
        sa.Column('skipped_answers', sa.Integer, nullable=True),
        sa.Column('time_taken_seconds', sa.Integer, nullable=True),
        sa.Column('answers', sa.JSON, nullable=True),
        sa.Column('is_completed', sa.Boolean, nullable=True),
        sa.Column('started_at', sa.DateTime, nullable=True),
        sa.Column('completed_at', sa.DateTime, nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
        sa.Column('created_at', sa.DateTime, nullable=False),
        sa.Column('updated_at', sa.DateTime, nullable=False),
    )

    # Table: question_options
    op.create_table(
        'question_options',
        sa.Column('question_id', postgresql.UUID(), nullable=False),
        sa.Column('text', sa.Text, nullable=False),
        sa.Column('is_correct', sa.Boolean, nullable=True),
        sa.Column('order', sa.Integer, nullable=True),
        sa.Column('match_with', sa.String(length=200), nullable=True),
        sa.Column('id', postgresql.UUID(), primary_key=True),
    )



def downgrade() -> None:
    """Drop all tables in reverse order."""
    
    op.drop_table('question_options')
    op.drop_table('quiz_attempts')
    op.drop_table('questions')
    op.drop_table('lesson_progress')
    op.drop_table('tutorial_lesson_progress')
    op.drop_table('quizzes')
    op.drop_table('interview_scorecards')
    op.drop_table('file_versions')
    op.drop_table('course_enrollments')
    op.drop_table('content_block')
    op.drop_table('assessment_results')
    op.drop_table('tutorial_lesson')
    op.drop_table('submission_test_results')
    op.drop_table('scheduling_links')
    op.drop_table('project_files')
    op.drop_table('post_reactions')
    op.drop_table('lessons')
    op.drop_table('job_offers')
    op.drop_table('interviews')
    op.drop_table('comments')
    op.drop_table('candidates_in_pipeline')
    op.drop_table('candidate_assessments')
    op.drop_table('bookings')
    op.drop_table('article_tags')
    op.drop_table('article_reactions')
    op.drop_table('article_comments')
    op.drop_table('article_coauthors')
    op.drop_table('article_bookmarks')
    op.drop_table('tutorial_section')
    op.drop_table('tutorial_enrollment')
    op.drop_table('test_cases')
    op.drop_table('submissions')
    op.drop_table('similar_problems_association')
    op.drop_table('school_members')
    op.drop_table('school_admins')
    op.drop_table('saved_jobs')
    op.drop_table('project_folders')
    op.drop_table('project_collaborators')
    op.drop_table('programs')
    op.drop_table('problem_solutions')
    op.drop_table('problem_hints')
    op.drop_table('problem_category_association')
    op.drop_table('posts')
    op.drop_table('placements')
    op.drop_table('pipeline_stages')
    op.drop_table('modules')
    op.drop_table('meeting_types')
    op.drop_table('job_applications')
    op.drop_table('group_members')
    op.drop_table('debug_sessions')
    op.drop_table('code_executions')
    op.drop_table('assessment_questions')
    op.drop_table('assessment_problems')
    op.drop_table('articles')
    op.drop_table('workspaces')
    op.drop_table('user_roles')
    op.drop_table('user_progress')
    op.drop_table('user_profile')
    op.drop_table('tutorial')
    op.drop_table('student_batches')
    op.drop_table('projects')
    op.drop_table('profile_review_history')
    op.drop_table('problems')
    op.drop_table('notifications')
    op.drop_table('newsletter_subscribers')
    op.drop_table('messages')
    op.drop_table('jobs')
    op.drop_table('hiring_pipelines')
    op.drop_table('groups')
    op.drop_table('follows')
    op.drop_table('experiences')
    op.drop_table('educations')
    op.drop_table('departments')
    op.drop_table('courses')
    op.drop_table('contest_registrations')
    op.drop_table('connections')
    op.drop_table('connection_requests')
    op.drop_table('company_team_members')
    op.drop_table('company_profiles')
    op.drop_table('company_photos')
    op.drop_table('company_locations')
    op.drop_table('company_invites')
    op.drop_table('company_benefits')
    op.drop_table('company_admins')
    op.drop_table('chat_members')
    op.drop_table('calendar_connections')
    op.drop_table('blocked_users')
    op.drop_table('blocked_profile_history')
    op.drop_table('availability_schedules')
    op.drop_table('assessments')
    op.drop_table('article_series')
    op.drop_table('users')
    op.drop_table('user_role')
    op.drop_table('tutorial_category')
    op.drop_table('schools')
    op.drop_table('problem_categories')
    op.drop_table('otps')
    op.drop_table('newsletters')
    op.drop_table('media_asset')
    op.drop_table('course_categories')
    op.drop_table('conversations')
    op.drop_table('contests')
    op.drop_table('companies')
    op.drop_table('code_snippet')
    op.drop_table('article_tag')
    op.drop_table('article_categories')
