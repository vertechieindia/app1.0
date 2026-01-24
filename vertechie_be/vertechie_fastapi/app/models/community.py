"""
Community models - Groups, Posts, Comments.
"""

from datetime import datetime
from typing import Optional
import uuid
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum,
    Text, JSON, ForeignKey, Integer
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class GroupType(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    SECRET = "secret"


class GroupMemberRole(str, enum.Enum):
    MEMBER = "member"
    MODERATOR = "moderator"
    ADMIN = "admin"
    OWNER = "owner"


class PostType(str, enum.Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    LINK = "link"
    POLL = "poll"
    ARTICLE = "article"
    EVENT = "event"


class Group(Base, UUIDMixin, TimestampMixin):
    """Community group."""
    
    __tablename__ = "groups"
    
    # Basic Info
    name = Column(String(100), nullable=False)
    slug = Column(String(120), unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Media
    avatar_url = Column(String(500), nullable=True)
    cover_url = Column(String(500), nullable=True)
    
    # Type
    group_type = Column(Enum(GroupType), default=GroupType.PUBLIC)
    
    # Category/Tags
    category = Column(String(50), nullable=True)
    tags = Column(JSON, default=list)
    
    # Settings
    requires_approval = Column(Boolean, default=False)
    post_approval_required = Column(Boolean, default=False)
    
    # Rules
    rules = Column(JSON, default=list)  # [{title, description}]
    
    # Stats (denormalized)
    member_count = Column(Integer, default=0)
    post_count = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    # Creator
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    created_by = relationship("User", foreign_keys=[created_by_id], backref="groups_created")
    members = relationship("GroupMember", back_populates="group")
    posts = relationship("Post", back_populates="group")


class GroupMember(Base, UUIDMixin, TimestampMixin):
    """Group membership."""
    
    __tablename__ = "group_members"
    
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Role
    role = Column(Enum(GroupMemberRole), default=GroupMemberRole.MEMBER)
    
    # Status
    is_approved = Column(Boolean, default=True)
    is_banned = Column(Boolean, default=False)
    ban_reason = Column(Text, nullable=True)
    
    # Notifications
    notifications_enabled = Column(Boolean, default=True)
    
    # Timestamps
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    group = relationship("Group", back_populates="members")
    user = relationship("User", backref="group_memberships")


class Post(Base, UUIDMixin, TimestampMixin):
    """Community post."""
    
    __tablename__ = "posts"
    
    # Author
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Group (optional - can be personal feed post)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id"), nullable=True)
    
    # Type
    post_type = Column(Enum(PostType), default=PostType.TEXT)
    
    # Content
    content = Column(Text, nullable=True)
    content_html = Column(Text, nullable=True)
    
    # Media
    media = Column(JSON, default=list)  # [{url, type, thumbnail}]
    
    # Link preview
    link_url = Column(String(500), nullable=True)
    link_preview = Column(JSON, nullable=True)  # {title, description, image}
    
    # Poll
    poll_data = Column(JSON, nullable=True)  # {question, options[], end_date}
    
    # Tags and mentions
    tags = Column(JSON, default=list)
    mentions = Column(JSON, default=list)
    
    # Visibility
    visibility = Column(String(20), default="public")  # public, connections, private
    
    # Status
    is_published = Column(Boolean, default=True)
    is_pinned = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=True)
    
    # Stats (denormalized)
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    
    # Edit
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    
    # Relationships
    author = relationship("User", backref="posts")
    group = relationship("Group", back_populates="posts")
    comments = relationship("Comment", back_populates="post")
    reactions = relationship("PostReaction", back_populates="post")


class Comment(Base, UUIDMixin, TimestampMixin):
    """Post comment."""
    
    __tablename__ = "comments"
    
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Parent (for replies)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("comments.id"), nullable=True)
    
    # Content
    content = Column(Text, nullable=False)
    
    # Media
    media_url = Column(String(500), nullable=True)
    
    # Mentions
    mentions = Column(JSON, default=list)
    
    # Stats
    likes_count = Column(Integer, default=0)
    replies_count = Column(Integer, default=0)
    
    # Status
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    is_deleted = Column(Boolean, default=False)
    
    # Relationships
    post = relationship("Post", back_populates="comments")
    author = relationship("User", backref="comments")
    parent = relationship("Comment", remote_side="Comment.id", backref="replies")


class PostReaction(Base, UUIDMixin, TimestampMixin):
    """Post reaction/like."""
    
    __tablename__ = "post_reactions"
    
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Reaction type
    reaction_type = Column(String(20), default="like")  # like, love, celebrate, etc.
    
    # Relationships
    post = relationship("Post", back_populates="reactions")
    user = relationship("User", backref="post_reactions")

