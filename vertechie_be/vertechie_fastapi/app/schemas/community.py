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
    
    content: str
    parent_id: Optional[UUID] = None
    media_url: Optional[str] = None
    mentions: Optional[List[UUID]] = []


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


# ============================================
# EVENT SCHEMAS
# ============================================

class EventCreate(BaseModel):
    """Create event."""
    
    title: str
    description: Optional[str] = None
    start_date: str  # ISO format datetime
    end_date: Optional[str] = None
    timezone: str = "UTC"
    event_type: str = "webinar"  # webinar, workshop, meetup, conference
    location: Optional[str] = None
    is_virtual: bool = False
    meeting_link: Optional[str] = None
    cover_image: Optional[str] = None
    is_public: bool = True
    requires_approval: bool = False
    max_attendees: Optional[int] = None


class EventResponse(BaseModel):
    """Event response."""
    
    id: UUID
    title: str
    description: Optional[str] = None
    host_id: UUID
    host_name: Optional[str] = None
    start_date: datetime
    end_date: Optional[datetime] = None
    timezone: str
    event_type: str
    location: Optional[str] = None
    is_virtual: bool
    meeting_link: Optional[str] = None
    cover_image: Optional[str] = None
    is_public: bool
    max_attendees: Optional[int] = None
    attendees_count: int = 0
    views_count: int = 0
    is_registered: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


# ============================================
# COMBINATOR SCHEMAS
# ============================================

class StartupIdeaCreate(BaseModel):
    """Create startup idea."""
    
    title: str
    description: str
    problem: str
    target_market: Optional[str] = None
    stage: str = "idea"  # idea, validating, mvp, launched, revenue
    commitment: str = "exploring"  # full-time, part-time, side-project, exploring
    funding_status: Optional[str] = None
    roles_needed: List[str] = []
    skills_needed: List[str] = []
    team_size: int = 0
    founder_roles: List[str] = []
    founder_skills: List[str] = []
    founder_commitment: Optional[str] = None
    founder_funding: Optional[str] = None


class StartupIdeaResponse(BaseModel):
    """Startup idea response."""
    
    id: UUID
    founder_id: UUID
    founder_name: Optional[str] = None
    title: str
    description: str
    problem: str
    target_market: Optional[str] = None
    stage: str
    commitment: str
    funding_status: Optional[str] = None
    roles_needed: List[str] = []
    skills_needed: List[str] = []
    team_size: int = 0
    founder_roles: List[str] = []
    founder_skills: List[str] = []
    views_count: int = 0
    connections_count: int = 0
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

