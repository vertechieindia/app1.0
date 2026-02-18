"""
Learning Platform Models - Enterprise Hierarchy (SQLite Compatible)

Hierarchy:
All Tutorials (Catalog)
 └── Category
      └── Tutorial (Course)
           └── Section (Module/Chapter)
                └── Lesson (Topic)
                     └── Content Blocks
"""

from datetime import datetime
import enum
import uuid
from sqlalchemy import (
    Column, String, Boolean, DateTime, 
    Text, ForeignKey, Integer, Float
)
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin


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

class TutorialCategory(Base, TimestampMixin):
    """
    Top-level categorization for tutorials.
    Examples: Web Development, Programming Languages, AI/ML, DevOps
    """
    __tablename__ = "tutorial_category"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Required
    name = Column(String(100), nullable=False, index=True)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    display_order = Column(Integer, default=0)
    icon = Column(String(100), nullable=True)
    
    # Optional
    description = Column(Text, nullable=True)
    parent_id = Column(String(36), ForeignKey("tutorial_category.id"), nullable=True)
    color = Column(String(20), default="#0d47a1")
    thumbnail = Column(String(500), nullable=True)
    is_visible = Column(Boolean, default=True)
    
    # Relationships
    tutorials = relationship("Tutorial", back_populates="category", lazy="dynamic")
    parent = relationship("TutorialCategory", 
                         remote_side=[id],
                         backref="children",
                         lazy="select")


# ============================================
# TUTORIAL (COURSE)
# ============================================

class Tutorial(Base, TimestampMixin):
    """
    Main tutorial/course entity.
    """
    __tablename__ = "tutorial"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Core Info
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, index=True, nullable=False)
    short_description = Column(String(500), nullable=True)
    full_description = Column(Text, nullable=True)
    
    # Categorization
    category_id = Column(String(36), ForeignKey("tutorial_category.id"), nullable=True)
    difficulty = Column(String(20), default="beginner")
    tags = Column(Text, nullable=True)  # JSON string of tags
    
    # Media
    thumbnail = Column(String(500), nullable=True)
    cover_image = Column(String(500), nullable=True)
    intro_video = Column(String(500), nullable=True)
    
    # Authoring
    author_id = Column(String(36), nullable=True)
    version = Column(String(20), default="1.0")
    
    # Pricing
    is_free = Column(Boolean, default=True)
    price = Column(Float, default=0.0)
    
    # Stats
    estimated_hours = Column(Float, default=0)
    total_sections = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    enrollment_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    
    # Publishing
    status = Column(String(20), default="draft")
    is_featured = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    
    # SEO
    meta_title = Column(String(60), nullable=True)
    meta_description = Column(String(160), nullable=True)
    
    # Prerequisites (JSON string)
    prerequisites = Column(Text, nullable=True)
    skills_gained = Column(Text, nullable=True)
    
    # Relationships
    category = relationship("TutorialCategory", back_populates="tutorials")
    sections = relationship("TutorialSection", back_populates="tutorial", 
                           order_by="TutorialSection.display_order",
                           lazy="dynamic")


# ============================================
# SECTION (MODULE/CHAPTER)
# ============================================

class TutorialSection(Base, TimestampMixin):
    """
    Logical grouping of lessons within a tutorial.
    """
    __tablename__ = "tutorial_section"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Core
    tutorial_id = Column(String(36), ForeignKey("tutorial.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
    
    # Settings
    is_free_preview = Column(Boolean, default=False)
    estimated_minutes = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    
    # Relationships
    tutorial = relationship("Tutorial", back_populates="sections")
    lessons = relationship("TutorialLesson", back_populates="section",
                          order_by="TutorialLesson.display_order",
                          lazy="dynamic")


# ============================================
# LESSON (TOPIC)
# ============================================

class TutorialLesson(Base, TimestampMixin):
    """
    Individual lesson/topic within a section.
    """
    __tablename__ = "tutorial_lesson"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Core
    section_id = Column(String(36), ForeignKey("tutorial_section.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(250), index=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
    
    # Type & Settings
    lesson_type = Column(String(20), default="article")
    estimated_minutes = Column(Integer, default=10)
    is_free_preview = Column(Boolean, default=False)
    is_required = Column(Boolean, default=True)
    is_published = Column(Boolean, default=True)
    
    # Flags
    has_quiz = Column(Boolean, default=False)
    has_exercise = Column(Boolean, default=False)
    has_try_it = Column(Boolean, default=False)
    
    # Relationships
    section = relationship("TutorialSection", back_populates="lessons")
    content_blocks = relationship("ContentBlock", back_populates="lesson",
                                 order_by="ContentBlock.display_order",
                                 lazy="dynamic")


# ============================================
# CONTENT BLOCKS
# ============================================

class ContentBlock(Base, TimestampMixin):
    """
    Individual content block within a lesson.
    Supports multiple block types for rich content.
    """
    __tablename__ = "content_block"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Core
    lesson_id = Column(String(36), ForeignKey("tutorial_lesson.id"), nullable=False, index=True)
    block_type = Column(String(30), nullable=False)  # header, text, code, try_it, etc.
    display_order = Column(Integer, default=0)
    
    # Content based on type - stored as JSON strings
    content = Column(Text, nullable=True)  # Main content (text, markdown)
    settings = Column(Text, nullable=True)  # Block-specific settings as JSON
    
    # Code-specific
    code_content = Column(Text, nullable=True)
    code_language = Column(String(50), nullable=True)
    
    # Try It Yourself specific
    default_code = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    result_type = Column(String(30), nullable=True)  # html, console, preview
    
    # Image/Video specific
    media_url = Column(String(500), nullable=True)
    alt_text = Column(String(200), nullable=True)
    caption = Column(String(500), nullable=True)
    
    # Header specific
    header_level = Column(Integer, default=2)  # 1, 2, 3
    
    # Quiz block specific  
    quiz_data = Column(Text, nullable=True)  # JSON for quiz questions
    
    # Relationships
    lesson = relationship("TutorialLesson", back_populates="content_blocks")


# ============================================
# MEDIA LIBRARY
# ============================================

class MediaAsset(Base, TimestampMixin):
    """
    Centralized media library for reusable assets.
    """
    __tablename__ = "media_asset"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Core
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=True)
    url = Column(String(500), nullable=False)
    
    # Metadata
    media_type = Column(String(20), default="image")
    mime_type = Column(String(100), nullable=True)
    file_size = Column(Integer, default=0)  # bytes
    
    # Organization
    folder = Column(String(200), nullable=True)
    alt_text = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)  # JSON string
    
    # Tracking
    uploaded_by = Column(String(36), nullable=True)
    usage_count = Column(Integer, default=0)


# ============================================
# CODE SNIPPET LIBRARY
# ============================================

class CodeSnippet(Base, TimestampMixin):
    """
    Reusable code snippets library.
    """
    __tablename__ = "code_snippet"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    # Core
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    language = Column(String(50), nullable=False)
    code = Column(Text, nullable=False)
    
    # Categorization
    category = Column(String(100), nullable=True)
    tags = Column(Text, nullable=True)  # JSON string
    
    # Versioning
    version = Column(String(20), default="1.0")
    
    # Tracking
    created_by = Column(String(36), nullable=True)
    usage_count = Column(Integer, default=0)


# ============================================
# ENROLLMENT TRACKING
# ============================================

class TutorialEnrollment(Base, TimestampMixin):
    """
    Tracks user enrollments in tutorials.
    """
    __tablename__ = "tutorial_enrollment"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    user_id = Column(String(36), nullable=False, index=True)
    tutorial_id = Column(String(36), ForeignKey("tutorial.id"), nullable=False, index=True)
    
    # Progress
    status = Column(String(20), default="enrolled")  # enrolled, in_progress, completed
    progress_percent = Column(Float, default=0.0)
    completed_lessons = Column(Integer, default=0)
    
    # Timestamps
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, nullable=True)
    
    # Certificate
    certificate_issued = Column(Boolean, default=False)
    certificate_id = Column(String(36), nullable=True)


# ============================================
# TUTORIAL LESSON PROGRESS
# ============================================

class TutorialLessonProgress(Base, TimestampMixin):
    """
    Tracks user progress through tutorial lessons.
    """
    __tablename__ = "tutorial_lesson_progress"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    user_id = Column(String(36), nullable=False, index=True)
    lesson_id = Column(String(36), ForeignKey("tutorial_lesson.id"), nullable=False, index=True)
    
    # Progress
    is_completed = Column(Boolean, default=False)
    progress_percent = Column(Float, default=0.0)
    time_spent_seconds = Column(Integer, default=0)
    
    # Timestamps
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_accessed_at = Column(DateTime, default=datetime.utcnow)
    
    # Try It tracking
    code_submissions = Column(Integer, default=0)
    successful_runs = Column(Integer, default=0)


# ============================================
# CERTIFICATES
# ============================================

class Certificate(Base, TimestampMixin):
    """
    Certificates issued to users upon course completion.
    """
    __tablename__ = "tutorial_certificate"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), nullable=False, index=True) # Matches TutorialEnrollment user_id type
    tutorial_id = Column(String(36), ForeignKey("tutorial.id"), nullable=False)
    
    certificate_number = Column(String(50), unique=True, index=True)
    issued_at = Column(DateTime, default=datetime.utcnow)
    
    # URL to the generated certificate (PDF or Image)
    file_url = Column(String(500), nullable=True)
    
    # Verification metadata
    verification_code = Column(String(20), unique=True)
    
    # Relationship
    tutorial = relationship("Tutorial")
