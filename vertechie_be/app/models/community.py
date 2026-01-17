"""
Community models (Groups, Posts, Comments).
"""

from datetime import datetime
import enum

from sqlalchemy import (
    Column, String, Boolean, DateTime, Enum, 
    Text, JSON, ForeignKey, Integer
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.db.base import Base, TimestampMixin, UUIDMixin


class GroupType(str, enum.Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    SECRET = "secret"


class MemberRole(str, enum.Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MODERATOR = "moderator"
    MEMBER = "member"


class Group(Base, UUIDMixin, TimestampMixin):
    """Community groups."""
    
    __tablename__ = "group"
    
    name = Column(String(200), nullable=False)
    slug = Column(String(250), unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Media
    avatar_url = Column(String(500), nullable=True)
    cover_url = Column(String(500), nullable=True)
    
    # Settings
    group_type = Column(Enum(GroupType), default=GroupType.PUBLIC)
    requires_approval = Column(Boolean, default=False)
    posting_permissions = Column(String(20), default="all")  # all, admins, mods
    
    # Created by
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Stats
    member_count = Column(Integer, default=0)
    post_count = Column(Integer, default=0)
    
    # Categories/Tags
    category = Column(String(100), nullable=True)
    tags = Column(ARRAY(String), default=list)
    
    # Relationships
    members = relationship("GroupMember", back_populates="group")
    posts = relationship("Post", back_populates="group")


class GroupMember(Base, UUIDMixin, TimestampMixin):
    """Group members."""
    
    __tablename__ = "groupmember"
    
    group_id = Column(UUID(as_uuid=True), ForeignKey("group.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    role = Column(Enum(MemberRole), default=MemberRole.MEMBER)
    
    joined_at = Column(DateTime, default=datetime.utcnow)
    invited_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Notifications
    notifications_enabled = Column(Boolean, default=True)
    
    # Relationships
    group = relationship("Group", back_populates="members")


class Post(Base, UUIDMixin, TimestampMixin):
    """Community posts."""
    
    __tablename__ = "post"
    
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    group_id = Column(UUID(as_uuid=True), ForeignKey("group.id"), nullable=True)
    
    # Content
    content = Column(Text, nullable=False)
    content_html = Column(Text, nullable=True)
    
    # Media
    media_urls = Column(ARRAY(String), default=list)
    media_type = Column(String(50), nullable=True)
    
    # Link preview
    link_url = Column(String(500), nullable=True)
    link_preview = Column(JSON, nullable=True)
    
    # Visibility
    visibility = Column(String(20), default="public")  # public, connections, private
    
    # Stats
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    shares_count = Column(Integer, default=0)
    views_count = Column(Integer, default=0)
    
    # Edit/Delete
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    is_deleted = Column(Boolean, default=False)
    
    # Pinned
    is_pinned = Column(Boolean, default=False)
    
    # Relationships
    group = relationship("Group", back_populates="posts")
    comments = relationship("Comment", back_populates="post", order_by="Comment.created_at")


class Comment(Base, UUIDMixin, TimestampMixin):
    """Post comments."""
    
    __tablename__ = "comment"
    
    post_id = Column(UUID(as_uuid=True), ForeignKey("post.id"), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Reply to another comment
    parent_id = Column(UUID(as_uuid=True), ForeignKey("comment.id"), nullable=True)
    
    # Content
    content = Column(Text, nullable=False)
    
    # Stats
    likes_count = Column(Integer, default=0)
    replies_count = Column(Integer, default=0)
    
    # Edit/Delete
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime, nullable=True)
    is_deleted = Column(Boolean, default=False)
    
    # Relationships
    post = relationship("Post", back_populates="comments")

