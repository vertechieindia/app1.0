"""
Learning Platform Models - Enterprise Hierarchy

Hierarchy:
All Tutorials (Catalog)
 └── Category
      └── Course
           └── Section (Module/Chapter)
                └── Lesson (Topic)
                     └── Content Blocks
"""

from datetime import datetime
import enum
from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, JSON, ForeignKey, Integer, Numeric
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base, TimestampMixin, UUIDMixin


# ============================================
# ENUMS
# ============================================

class DifficultyLevel(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"


class ContentStatus(str, enum.Enum):
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class LessonType(str, enum.Enum):
    ARTICLE = "article"
    CODE = "code"
    QUIZ = "quiz"
    INTERACTIVE = "interactive"
    VIDEO = "video"
    PROJECT = "project"


class BlockType(str, enum.Enum):
    HEADER = "header"
    TEXT = "text"
    MARKDOWN = "markdown"
    CODE = "code"
    TRY_IT = "try_it"
    IMAGE = "image"
    VIDEO = "video"
    NOTE = "note"
    WARNING = "warning"
    TIP = "tip"
    QUIZ = "quiz"
    OUTPUT_PREVIEW = "output_preview"
    DIVIDER = "divider"
    LIST = "list"
    TABLE = "table"
    EMBED = "embed"


class MediaType(str, enum.Enum):
    IMAGE = "image"
    VIDEO = "video"
    ICON = "icon"
    FILE = "file"


# ============================================
# CATEGORY
# ============================================

class TutorialCategory(Base, UUIDMixin, TimestampMixin):
    """
    Top-level categorization for tutorials.
    Examples: Web Development, Programming Languages, AI/ML, DevOps
    """
    __tablename__ = "tutorial_category"
    
    # Required
    name = Column(String(100), nullable=False, index=True)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    display_order = Column(Integer, default=0)
    icon = Column(String(100), nullable=True)  # Icon name or URL
    
    # Optional
    description = Column(Text, nullable=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("tutorial_category.id"), nullable=True)
    color = Column(String(20), default="#0d47a1")
    thumbnail = Column(String(500), nullable=True)
    
    # Settings
    is_visible = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Relationships
    courses = relationship("Tutorial", back_populates="category", order_by="Tutorial.display_order")
    children = relationship("TutorialCategory", backref="parent", remote_side="TutorialCategory.id")


# ============================================
# COURSE / TUTORIAL
# ============================================

class Tutorial(Base, UUIDMixin, TimestampMixin):
    """
    A complete tutorial/course.
    Examples: HTML Tutorial, Python Course, React Mastery
    """
    __tablename__ = "tutorial"
    
    # ===== MANDATORY =====
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, index=True, nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("tutorial_category.id"), nullable=False)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.BEGINNER)
    estimated_hours = Column(Integer, default=0)
    is_free = Column(Boolean, default=True)
    description = Column(Text, nullable=False)
    status = Column(Enum(ContentStatus), default=ContentStatus.DRAFT)
    
    # ===== RECOMMENDED =====
    short_description = Column(String(500), nullable=True)
    tags = Column(ARRAY(String), default=list)
    prerequisites = Column(ARRAY(String), default=list)  # List of prerequisite course slugs
    language = Column(String(10), default="en")
    thumbnail = Column(String(500), nullable=True)
    cover_image = Column(String(500), nullable=True)
    intro_video = Column(String(500), nullable=True)
    version = Column(String(20), default="1.0")
    
    # ===== PRICING =====
    price = Column(Numeric(10, 2), default=0)
    discount_price = Column(Numeric(10, 2), nullable=True)
    
    # ===== DISPLAY =====
    display_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    badge = Column(String(50), nullable=True)  # "New", "Popular", "Updated"
    
    # ===== AUTHOR =====
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # ===== SEO =====
    meta_title = Column(String(60), nullable=True)
    meta_description = Column(String(160), nullable=True)
    
    # ===== STATS (Denormalized) =====
    total_sections = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    total_duration_minutes = Column(Integer, default=0)
    enrollment_count = Column(Integer, default=0)
    completion_count = Column(Integer, default=0)
    average_rating = Column(Numeric(3, 2), default=0)
    
    # ===== TIMESTAMPS =====
    published_at = Column(DateTime, nullable=True)
    
    # Relationships
    category = relationship("TutorialCategory", back_populates="courses")
    sections = relationship("TutorialSection", back_populates="tutorial", order_by="TutorialSection.display_order")


# ============================================
# SECTION / MODULE / CHAPTER
# ============================================

class TutorialSection(Base, UUIDMixin, TimestampMixin):
    """
    A section/module/chapter within a tutorial.
    Logical grouping of lessons.
    """
    __tablename__ = "tutorial_section"
    
    # Required
    tutorial_id = Column(UUID(as_uuid=True), ForeignKey("tutorial.id"), nullable=False)
    title = Column(String(200), nullable=False)
    display_order = Column(Integer, default=0)
    
    # Optional
    description = Column(Text, nullable=True)
    estimated_minutes = Column(Integer, default=0)
    icon = Column(String(100), nullable=True)
    
    # Settings
    is_visible = Column(Boolean, default=True)
    is_free_preview = Column(Boolean, default=False)
    is_locked = Column(Boolean, default=False)
    unlock_after_section_id = Column(UUID(as_uuid=True), ForeignKey("tutorial_section.id"), nullable=True)
    
    # Stats
    total_lessons = Column(Integer, default=0)
    
    # Relationships
    tutorial = relationship("Tutorial", back_populates="sections")
    lessons = relationship("TutorialLesson", back_populates="section", order_by="TutorialLesson.display_order")


# ============================================
# LESSON / TOPIC
# ============================================

class TutorialLesson(Base, UUIDMixin, TimestampMixin):
    """
    Individual lesson/topic within a section.
    Contains the actual learning content via content blocks.
    """
    __tablename__ = "tutorial_lesson"
    
    # Required
    section_id = Column(UUID(as_uuid=True), ForeignKey("tutorial_section.id"), nullable=False)
    title = Column(String(200), nullable=False)
    slug = Column(String(250), index=True)
    display_order = Column(Integer, default=0)
    lesson_type = Column(Enum(LessonType), default=LessonType.ARTICLE)
    
    # Optional
    description = Column(Text, nullable=True)
    estimated_minutes = Column(Integer, default=10)
    
    # Settings
    is_visible = Column(Boolean, default=True)
    is_free_preview = Column(Boolean, default=False)
    allows_discussion = Column(Boolean, default=True)
    has_quiz = Column(Boolean, default=False)
    has_exercise = Column(Boolean, default=False)
    has_try_it = Column(Boolean, default=True)
    completion_rule = Column(String(50), default="view")  # view, code_run, quiz_pass
    
    # Video specific
    video_url = Column(String(500), nullable=True)
    video_duration_seconds = Column(Integer, default=0)
    
    # Status
    status = Column(Enum(ContentStatus), default=ContentStatus.DRAFT)
    
    # Stats
    view_count = Column(Integer, default=0)
    completion_count = Column(Integer, default=0)
    
    # Relationships
    section = relationship("TutorialSection", back_populates="lessons")
    content_blocks = relationship("ContentBlock", back_populates="lesson", order_by="ContentBlock.display_order")


# ============================================
# CONTENT BLOCKS
# ============================================

class ContentBlock(Base, UUIDMixin, TimestampMixin):
    """
    Individual content block within a lesson.
    This is the atomic unit of content.
    """
    __tablename__ = "content_block"
    
    # Required
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("tutorial_lesson.id"), nullable=False)
    block_type = Column(Enum(BlockType), nullable=False)
    display_order = Column(Integer, default=0)
    
    # Content (JSON structure varies by block type)
    content = Column(JSON, default=dict)
    """
    Content structure by block_type:
    
    HEADER:
        { "level": 1-3, "text": "..." }
    
    TEXT/MARKDOWN:
        { "text": "...", "format": "plain|markdown" }
    
    CODE:
        { "language": "python", "code": "...", "readonly": true, "line_numbers": true }
    
    TRY_IT:
        { 
            "language": "html",
            "default_code": "...",
            "editable": true,
            "result_type": "html_preview|console",
            "show_run_button": true,
            "show_reset_button": true,
            "show_solution": false,
            "solution_code": "..."
        }
    
    IMAGE:
        { "media_id": "uuid", "url": "...", "alt": "...", "caption": "...", "width": "100%" }
    
    VIDEO:
        { "url": "...", "provider": "youtube|vimeo|upload", "autoplay": false }
    
    NOTE/WARNING/TIP:
        { "title": "...", "text": "..." }
    
    QUIZ:
        { "quiz_id": "uuid" }
    
    OUTPUT_PREVIEW:
        { "linked_to_block_id": "uuid", "auto_refresh": true }
    
    LIST:
        { "type": "ordered|unordered", "items": ["...", "..."] }
    
    TABLE:
        { "headers": [...], "rows": [[...], [...]] }
    """
    
    # Settings
    is_visible = Column(Boolean, default=True)
    
    # Relationships
    lesson = relationship("TutorialLesson", back_populates="content_blocks")


# ============================================
# MEDIA LIBRARY
# ============================================

class MediaAsset(Base, UUIDMixin, TimestampMixin):
    """
    Centralized media library for images, videos, icons.
    """
    __tablename__ = "media_asset"
    
    # Required
    name = Column(String(200), nullable=False)
    file_url = Column(String(500), nullable=False)
    media_type = Column(Enum(MediaType), nullable=False)
    
    # Optional
    alt_text = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    mime_type = Column(String(100), nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    duration_seconds = Column(Integer, nullable=True)  # For videos
    
    # Organization
    folder = Column(String(200), default="/")
    tags = Column(ARRAY(String), default=list)
    
    # Uploader
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)


# ============================================
# CODE SNIPPET LIBRARY
# ============================================

class CodeSnippet(Base, UUIDMixin, TimestampMixin):
    """
    Reusable code snippets that can be used across lessons.
    """
    __tablename__ = "code_snippet"
    
    # Required
    name = Column(String(200), nullable=False)
    language = Column(String(50), nullable=False)
    code = Column(Text, nullable=False)
    
    # Optional
    description = Column(Text, nullable=True)
    version = Column(String(20), default="1.0")
    tags = Column(ARRAY(String), default=list)
    
    # Settings
    is_public = Column(Boolean, default=True)
    
    # Author
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)


# ============================================
# ENROLLMENTS & PROGRESS
# ============================================

class TutorialEnrollment(Base, UUIDMixin, TimestampMixin):
    """User enrollment in tutorials."""
    __tablename__ = "tutorial_enrollment"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    tutorial_id = Column(UUID(as_uuid=True), ForeignKey("tutorial.id"), nullable=False)
    
    # Progress
    progress_percentage = Column(Numeric(5, 2), default=0)
    completed_lessons = Column(Integer, default=0)
    current_lesson_id = Column(UUID(as_uuid=True), ForeignKey("tutorial_lesson.id"), nullable=True)
    
    # Status
    is_completed = Column(Boolean, default=False)
    
    # Payment
    is_paid = Column(Boolean, default=False)
    payment_amount = Column(Numeric(10, 2), default=0)
    
    # Timestamps
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, nullable=True)
    
    # Certificate
    certificate_issued = Column(Boolean, default=False)
    certificate_issued_at = Column(DateTime, nullable=True)


class LessonProgress(Base, UUIDMixin, TimestampMixin):
    """User progress on individual lessons."""
    __tablename__ = "tutorial_lesson_progress"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("tutorial_lesson.id"), nullable=False)
    enrollment_id = Column(UUID(as_uuid=True), ForeignKey("tutorial_enrollment.id"), nullable=False)
    
    # Progress
    is_completed = Column(Boolean, default=False)
    progress_percentage = Column(Numeric(5, 2), default=0)
    
    # Video progress
    video_watched_seconds = Column(Integer, default=0)
    
    # Code exercise
    code_submitted = Column(Text, nullable=True)
    code_runs = Column(Integer, default=0)
    
    # Quiz
    quiz_score = Column(Numeric(5, 2), nullable=True)
    quiz_attempts = Column(Integer, default=0)
    
    # Timing
    time_spent_seconds = Column(Integer, default=0)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, default=datetime.utcnow)
    
    # Notes
    notes = Column(Text, nullable=True)
    bookmarked = Column(Boolean, default=False)

