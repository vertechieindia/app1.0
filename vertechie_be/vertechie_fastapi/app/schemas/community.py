"""
Community schemas - Groups, Posts, Comments.
"""

from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class GroupCreate(BaseModel):
    """Create group."""
    
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    
    group_type: str = "public"
    category: Optional[str] = None
    tags: List[str] = []
    
    requires_approval: bool = False
    post_approval_required: bool = False
    
    rules: List[dict] = []


class GroupUpdate(BaseModel):
    """Update group."""
    
    name: Optional[str] = None
    description: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    group_type: Optional[str] = None
    requires_approval: Optional[bool] = None
    post_approval_required: Optional[bool] = None
    rules: Optional[List[dict]] = None


class GroupResponse(BaseModel):
    """Group response."""
    
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None
    
    group_type: str
    category: Optional[str] = None
    tags: List[str] = []
    
    member_count: int = 0
    post_count: int = 0
    
    is_active: bool
    is_featured: bool
    
    created_by_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class GroupMemberResponse(BaseModel):
    """Group member response."""
    
    id: UUID
    group_id: UUID
    user_id: UUID
    role: str
    is_approved: bool
    is_banned: bool
    joined_at: datetime
    
    class Config:
        from_attributes = True


class PostCreate(BaseModel):
    """Create post."""
    
    content: Optional[str] = None
    post_type: str = "text"
    
    group_id: Optional[UUID] = None
    
    media: List[dict] = []  # [{url, type, thumbnail}]
    
    link_url: Optional[str] = None
    
    poll_data: Optional[dict] = None
    
    tags: List[str] = []
    mentions: List[UUID] = []
    
    visibility: str = "public"


class PostUpdate(BaseModel):
    """Update post."""
    
    content: Optional[str] = None
    media: Optional[List[dict]] = None
    tags: Optional[List[str]] = None
    visibility: Optional[str] = None


class PostResponse(BaseModel):
    """Post response."""
    
    id: UUID
    author_id: UUID
    group_id: Optional[UUID] = None
    
    post_type: str
    content: Optional[str] = None
    
    media: List[dict] = []
    link_url: Optional[str] = None
    link_preview: Optional[dict] = None
    poll_data: Optional[dict] = None
    
    tags: List[str] = []
    
    visibility: str
    
    is_pinned: bool = False
    
    likes_count: int = 0
    comments_count: int = 0
    shares_count: int = 0
    views_count: int = 0
    
    is_edited: bool = False
    
    created_at: datetime
    
    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    """Create comment."""
    
    post_id: UUID
    content: str
    parent_id: Optional[UUID] = None
    media_url: Optional[str] = None
    mentions: List[UUID] = []


class CommentUpdate(BaseModel):
    """Update comment."""
    
    content: str


class CommentResponse(BaseModel):
    """Comment response."""
    
    id: UUID
    post_id: UUID
    author_id: UUID
    parent_id: Optional[UUID] = None
    
    content: str
    media_url: Optional[str] = None
    
    likes_count: int = 0
    replies_count: int = 0
    
    is_edited: bool = False
    is_deleted: bool = False
    
    created_at: datetime
    
    class Config:
        from_attributes = True


class ReactionCreate(BaseModel):
    """Create reaction."""
    
    reaction_type: str = "like"

