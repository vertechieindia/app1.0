"""
Blog Models for FastAPI
Migrated from Django v_blog
"""

from sqlalchemy import (
    Column, String, Text, Boolean, Integer, DateTime, 
    ForeignKey, JSON, Enum as SQLEnum, Table
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.db.base import Base


# Association table for article tags
article_tags = Table(
    'article_tags',
    Base.metadata,
    Column('article_id', UUID(as_uuid=True), ForeignKey('articles.id')),
    Column('tag_id', UUID(as_uuid=True), ForeignKey('article_tag.id'))
)

# Association table for co-authors
article_coauthors = Table(
    'article_coauthors',
    Base.metadata,
    Column('article_id', UUID(as_uuid=True), ForeignKey('articles.id')),
    Column('user_id', UUID(as_uuid=True), ForeignKey('users.id'))
)


class ArticleCategory(Base):
    """Article categories."""
    __tablename__ = "article_categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    icon = Column(String(50))
    color = Column(String(7), default="#3498db")
    
    parent_id = Column(UUID(as_uuid=True), ForeignKey("article_categories.id"))
    
    order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    featured_image = Column(String(500))
    
    # Relationships
    subcategories = relationship("ArticleCategory", backref="parent", remote_side=[id])
    articles = relationship("Article", back_populates="category")


class ArticleTag(Base):
    """Article tags."""
    __tablename__ = "article_tag"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    
    articles_count = Column(Integer, default=0)


class ArticleSeries(Base):
    """Article series/collection."""
    __tablename__ = "article_series"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    description = Column(Text)
    
    cover_image = Column(String(500))
    
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    is_complete = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    articles = relationship("Article", back_populates="series")


class ArticleStatus(str, enum.Enum):
    DRAFT = "draft"
    REVIEW = "review"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ContentType(str, enum.Enum):
    ARTICLE = "article"
    TUTORIAL = "tutorial"
    NEWS = "news"
    OPINION = "opinion"
    INTERVIEW = "interview"
    CASE_STUDY = "case_study"


class Article(Base):
    """Blog article/post."""
    __tablename__ = "articles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    title = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, nullable=False)
    subtitle = Column(String(300))
    
    # Content
    content = Column(Text, nullable=False)  # Markdown
    excerpt = Column(Text)
    
    # Type
    content_type = Column(SQLEnum(ContentType), default=ContentType.ARTICLE)
    
    # Media (Text to allow base64 data URLs or long URLs)
    cover_image = Column(Text)
    thumbnail = Column(Text)
    
    # Author
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Classification
    category_id = Column(UUID(as_uuid=True), ForeignKey("article_categories.id"))
    series_id = Column(UUID(as_uuid=True), ForeignKey("article_series.id"))
    series_order = Column(Integer)
    
    # SEO
    meta_title = Column(String(70))
    meta_description = Column(String(160))
    canonical_url = Column(String(500))
    
    # Reading
    reading_time_minutes = Column(Integer, default=5)
    
    # Status
    status = Column(SQLEnum(ArticleStatus), default=ArticleStatus.DRAFT)
    is_featured = Column(Boolean, default=False)
    is_pinned = Column(Boolean, default=False)
    is_premium = Column(Boolean, default=False)
    
    # Stats
    views_count = Column(Integer, default=0)
    unique_views = Column(Integer, default=0)
    reactions_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    bookmarks_count = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime)
    scheduled_at = Column(DateTime)
    
    # Relationships
    category = relationship("ArticleCategory", back_populates="articles")
    series = relationship("ArticleSeries", back_populates="articles")
    tags = relationship("ArticleTag", secondary=article_tags)
    comments = relationship("ArticleComment", back_populates="article")
    reactions = relationship("ArticleReaction", back_populates="article")


class ArticleComment(Base):
    """Comments on articles."""
    __tablename__ = "article_comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    article_id = Column(UUID(as_uuid=True), ForeignKey("articles.id"))
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    parent_id = Column(UUID(as_uuid=True), ForeignKey("article_comments.id"))
    
    content = Column(Text, nullable=False)
    
    likes_count = Column(Integer, default=0)
    
    is_edited = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    article = relationship("Article", back_populates="comments")
    replies = relationship("ArticleComment", backref="parent", remote_side=[id])


class ReactionType(str, enum.Enum):
    LIKE = "like"
    LOVE = "love"
    INSIGHTFUL = "insightful"
    CLAP = "clap"
    FIRE = "fire"


class ArticleReaction(Base):
    """Reactions on articles."""
    __tablename__ = "article_reactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    article_id = Column(UUID(as_uuid=True), ForeignKey("articles.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    reaction_type = Column(SQLEnum(ReactionType))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    article = relationship("Article", back_populates="reactions")


class ArticleBookmark(Base):
    """Bookmarked articles."""
    __tablename__ = "article_bookmarks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    article_id = Column(UUID(as_uuid=True), ForeignKey("articles.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    created_at = Column(DateTime, default=datetime.utcnow)


class NewsletterStatus(str, enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"


class Newsletter(Base):
    """Email newsletters."""
    __tablename__ = "newsletters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    subject = Column(String(200), nullable=False)
    preview_text = Column(String(200))
    content = Column(Text, nullable=False)
    
    # Audience
    audience = Column(String(50), default="all")  # all, subscribers, segment
    segment_filters = Column(JSON, default=dict)
    
    status = Column(SQLEnum(NewsletterStatus), default=NewsletterStatus.DRAFT)
    
    scheduled_at = Column(DateTime)
    sent_at = Column(DateTime)
    
    # Stats
    recipients_count = Column(Integer, default=0)
    opens_count = Column(Integer, default=0)
    clicks_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class NewsletterSubscriber(Base):
    """Newsletter subscribers."""
    __tablename__ = "newsletter_subscribers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    email = Column(String(255), unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    
    # Preferences
    preferences = Column(JSON, default=dict)
    
    is_active = Column(Boolean, default=True)
    
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    unsubscribed_at = Column(DateTime)

