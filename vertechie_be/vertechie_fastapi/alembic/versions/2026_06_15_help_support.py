"""Help Center & Customer Support tables + FAQ seed data.

Revision ID: 2026_06_15_help_support
Revises: 2026_06_22_staff_enum
"""
from __future__ import annotations

import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy import text
from sqlalchemy.dialects import postgresql
from sqlalchemy.dialects.postgresql import UUID

revision: str = "2026_06_15_help_support"
down_revision: Union[str, None] = "2026_06_22_staff_enum"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _ensure_enum(name: str, values: list[str]) -> None:
    vals = ", ".join(f"'{v}'" for v in values)
    op.execute(
        sa.text(
            f"""
            DO $$ BEGIN
                CREATE TYPE {name} AS ENUM ({vals});
            EXCEPTION WHEN duplicate_object THEN NULL;
            END $$;
            """
        )
    )


def _add_notification_enum_values() -> None:
    conn = op.get_bind()
    for label in (
        "SUPPORT_TICKET_CREATED",
        "SUPPORT_TICKET_ASSIGNED",
        "SUPPORT_TICKET_RESPONSE",
        "SUPPORT_TICKET_STATUS_CHANGED",
        "SUPPORT_TICKET_RESOLVED",
        "SUPPORT_TICKET_CLOSED",
    ):
        exists = conn.execute(
            text(
                """
                SELECT 1 FROM pg_enum e
                JOIN pg_type t ON e.enumtypid = t.oid
                WHERE t.typname = 'notificationtype' AND e.enumlabel = :label
                """
            ),
            {"label": label},
        ).scalar()
        if not exists:
            op.execute(text(f"ALTER TYPE notificationtype ADD VALUE '{label}'"))


def upgrade() -> None:
    conn = op.get_bind()
    insp = sa.inspect(conn)
    existing = set(insp.get_table_names())

    _ensure_enum(
        "ticketstatus",
        ["open", "in_progress", "waiting_for_user", "resolved", "closed"],
    )
    _ensure_enum("tickettype", ["support", "feedback", "suggestion", "complaint"])
    _ensure_enum("ticketpriority", ["low", "medium", "high", "urgent"])

    ticket_status = postgresql.ENUM(
        "open", "in_progress", "waiting_for_user", "resolved", "closed",
        name="ticketstatus",
        create_type=False,
    )
    ticket_type = postgresql.ENUM(
        "support", "feedback", "suggestion", "complaint",
        name="tickettype",
        create_type=False,
    )
    ticket_priority = postgresql.ENUM(
        "low", "medium", "high", "urgent", name="ticketpriority", create_type=False
    )

    if "faq_categories" not in existing:
        op.create_table(
            "faq_categories",
            sa.Column("id", UUID(as_uuid=True), primary_key=True),
            sa.Column("name", sa.String(120), nullable=False, unique=True),
            sa.Column("slug", sa.String(140), nullable=False, unique=True),
            sa.Column("description", sa.Text(), nullable=True),
            sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        )
        op.create_index("ix_faq_categories_slug", "faq_categories", ["slug"])

    if "faqs" not in existing:
        op.create_table(
            "faqs",
            sa.Column("id", UUID(as_uuid=True), primary_key=True),
            sa.Column("category_id", UUID(as_uuid=True), sa.ForeignKey("faq_categories.id", ondelete="CASCADE"), nullable=False),
            sa.Column("question", sa.String(500), nullable=False),
            sa.Column("answer", sa.Text(), nullable=False),
            sa.Column("keywords", sa.String(500), nullable=True),
            sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("is_published", sa.Boolean(), nullable=False, server_default="true"),
            sa.Column("helpful_count", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("not_helpful_count", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("view_count", sa.Integer(), nullable=False, server_default="0"),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        )
        op.create_index("ix_faqs_category_id", "faqs", ["category_id"])

    if "faq_feedback" not in existing:
        op.create_table(
            "faq_feedback",
            sa.Column("id", UUID(as_uuid=True), primary_key=True),
            sa.Column("faq_id", UUID(as_uuid=True), sa.ForeignKey("faqs.id", ondelete="CASCADE"), nullable=False),
            sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
            sa.Column("is_helpful", sa.Boolean(), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
            sa.UniqueConstraint("faq_id", "user_id", name="uq_faq_feedback_user"),
        )

    if "support_tickets" not in existing:
        op.create_table(
            "support_tickets",
            sa.Column("id", UUID(as_uuid=True), primary_key=True),
            sa.Column("ticket_number", sa.String(32), nullable=False, unique=True),
            sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
            sa.Column("assigned_to_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
            sa.Column("subject", sa.String(300), nullable=False),
            sa.Column("description", sa.Text(), nullable=False),
            sa.Column("ticket_type", ticket_type, nullable=False, server_default="support"),
            sa.Column("status", ticket_status, nullable=False, server_default="open"),
            sa.Column("priority", ticket_priority, nullable=False, server_default="medium"),
            sa.Column("category", sa.String(120), nullable=True),
            sa.Column("resolved_at", sa.DateTime(), nullable=True),
            sa.Column("closed_at", sa.DateTime(), nullable=True),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        )
        op.create_index("ix_support_tickets_ticket_number", "support_tickets", ["ticket_number"])
        op.create_index("ix_support_tickets_user_id", "support_tickets", ["user_id"])
        op.create_index("ix_support_tickets_status", "support_tickets", ["status"])

    if "ticket_messages" not in existing:
        op.create_table(
            "ticket_messages",
            sa.Column("id", UUID(as_uuid=True), primary_key=True),
            sa.Column("ticket_id", UUID(as_uuid=True), sa.ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False),
            sa.Column("author_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
            sa.Column("body", sa.Text(), nullable=False),
            sa.Column("is_internal", sa.Boolean(), nullable=False, server_default="false"),
            sa.Column("is_staff_reply", sa.Boolean(), nullable=False, server_default="false"),
            sa.Column("created_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
            sa.Column("updated_at", sa.DateTime(), nullable=False, server_default=sa.text("now()")),
        )
        op.create_index("ix_ticket_messages_ticket_id", "ticket_messages", ["ticket_id"])

    _add_notification_enum_values()
    _seed_faqs()


def _seed_faqs() -> None:
    categories = [
        ("Account & Profile", "account-profile", "Sign up, login, profile verification, and account settings", 1),
        ("Jobs & Applications", "jobs-applications", "Job search, applying, and application status", 2),
        ("Hiring & ATS", "hiring-ats", "Recruiting tools for hiring managers and companies", 3),
        ("Learning & Courses", "learning-courses", "Courses, tutorials, certificates, and progress", 4),
        ("Technical Issues", "technical-issues", "Bugs, errors, and platform performance", 5),
        ("Privacy & Security", "privacy-security", "Data privacy, security, and document verification", 6),
        ("Billing & Payments", "billing-payments", "Subscriptions, invoices, and payment questions", 7),
        ("General", "general", "General platform questions", 8),
    ]
    faqs = [
        ("account-profile", "How do I create a VerTechie account?", "Go to Sign Up, choose your role (Techie, Hiring Manager, Company, or School), complete the registration form, verify your email with the OTP sent to your inbox, and finish document verification if prompted.", "signup register account create", 1),
        ("account-profile", "How do I reset my password?", "On the login page, click Forgot Password, enter your registered email, and follow the link in the reset email. Links expire after one hour for security.", "password reset forgot login", 2),
        ("account-profile", "Why is my profile pending verification?", "Our team reviews profiles to maintain platform quality. Verification may take 1–3 business days. You will receive an email and in-app notification when your status changes.", "verification pending approve profile", 3),
        ("jobs-applications", "How do I apply for a job?", "Browse Jobs from the main navigation, open a listing, and click Apply. Complete any required screening steps and submit your application. Track status under My Applications.", "apply job application", 1),
        ("jobs-applications", "Can I withdraw an application?", "Yes. Open My Applications, select the application, and choose Withdraw if the option is available. Some employers may have already moved your application forward.", "withdraw cancel application", 2),
        ("jobs-applications", "How will I know if my application status changes?", "You receive in-app notifications and email updates when recruiters change your application stage, schedule interviews, or send offers.", "application status notification update", 3),
        ("hiring-ats", "How do I post a job as a company?", "Company admins can use CMS or ATS to create job postings. Complete your company profile first, then go to Job Postings and click Create Job.", "post job hiring company ats", 1),
        ("hiring-ats", "How do I schedule an interview?", "From the ATS pipeline, select a candidate and use Schedule Interview. Connect your calendar if prompted so candidates receive accurate time slots.", "interview schedule ats pipeline", 2),
        ("learning-courses", "How do I enroll in a course?", "Open Learn from the navigation, browse courses, and click Enroll on any available course. Your progress is saved automatically.", "course enroll learn tutorial", 1),
        ("learning-courses", "Where can I find my certificates?", "After completing a course with certificate requirements, visit your Learn profile or course completion page to download your certificate.", "certificate download complete", 2),
        ("technical-issues", "The camera is not working during signup verification", "Ensure your browser has camera permission. On production, the site must allow camera access via Permissions-Policy. Try Chrome or Edge, use HTTPS, and reload the page after granting permission.", "camera verification signup document", 1),
        ("technical-issues", "I see a 500 error on a page", "Refresh the page and try again. If the issue persists, raise a support ticket from Help Center with the page URL and steps to reproduce.", "error 500 bug broken", 2),
        ("privacy-security", "How is my ID document used?", "Documents are used only for identity verification. Access is restricted to authorized verification staff and stored securely per our Privacy Policy.", "id document verification privacy", 1),
        ("billing-payments", "Where can I view invoices?", "Billing features depend on your plan. Contact sales or raise a billing ticket from Help Center for invoice copies.", "invoice billing payment", 1),
        ("general", "How do I contact customer support?", "Open Help Center from your profile menu. Search FAQs first. If you need more help, use Raise Ticket, Submit Feedback, or Submit Complaint.", "contact support help ticket", 1),
    ]

    conn = op.get_bind()
    cat_ids = {}
    for name, slug, desc, order in categories:
        cat_id = str(uuid.uuid4())
        cat_ids[slug] = cat_id
        conn.execute(
            text(
                """
                INSERT INTO faq_categories (id, name, slug, description, sort_order, is_active, created_at, updated_at)
                VALUES (:id, :name, :slug, :desc, :order, true, now(), now())
                ON CONFLICT (slug) DO NOTHING
                """
            ),
            {"id": cat_id, "name": name, "slug": slug, "desc": desc, "order": order},
        )

    for slug, question, answer, keywords, order in faqs:
        cat_id = cat_ids.get(slug)
        if not cat_id:
            row = conn.execute(
                text("SELECT id FROM faq_categories WHERE slug = :slug"),
                {"slug": slug},
            ).first()
            if not row:
                continue
            cat_id = str(row[0])
        conn.execute(
            text(
                """
                INSERT INTO faqs (id, category_id, question, answer, keywords, sort_order, is_published, helpful_count, not_helpful_count, view_count, created_at, updated_at)
                SELECT :id, :cat_id, :question, :answer, :keywords, :order, true, 0, 0, 0, now(), now()
                WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question = :question)
                """
            ),
            {
                "id": str(uuid.uuid4()),
                "cat_id": cat_id,
                "question": question,
                "answer": answer,
                "keywords": keywords,
                "order": order,
            },
        )


def downgrade() -> None:
    op.drop_table("ticket_messages")
    op.drop_table("support_tickets")
    op.drop_table("faq_feedback")
    op.drop_table("faqs")
    op.drop_table("faq_categories")
    sa.Enum(name="ticketpriority").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="tickettype").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="ticketstatus").drop(op.get_bind(), checkfirst=True)
