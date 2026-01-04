"""
Course and Learning schemas.
"""

from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal

from app.schemas.common import BaseSchema, TimestampSchema


class CourseCreate(BaseModel):
    """Schema for creating a course."""
    title: str = Field(..., min_length=5, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=300)
    description: str = Field(..., min_length=50)
    short_description: Optional[str] = Field(None, max_length=500)
    
    category_id: Optional[str] = None
    tags: List[str] = []
    difficulty: str = "beginner"
    course_type: str = "course"
    
    thumbnail: Optional[str] = None
    cover_image: Optional[str] = None
    intro_video: Optional[str] = None
    
    is_free: bool = True
    price: Decimal = 0
    
    estimated_hours: int = 0
    
    language: str = "en"
    skills_required: List[str] = []
    skills_gained: List[str] = []
    
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None


class CourseUpdate(BaseModel):
    """Schema for updating a course."""
    title: Optional[str] = Field(None, min_length=5, max_length=200)
    subtitle: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    
    category_id: Optional[str] = None
    tags: Optional[List[str]] = None
    difficulty: Optional[str] = None
    
    thumbnail: Optional[str] = None
    cover_image: Optional[str] = None
    intro_video: Optional[str] = None
    
    is_free: Optional[bool] = None
    price: Optional[Decimal] = None
    
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None


class CourseResponse(TimestampSchema):
    """Course response schema."""
    id: str
    title: str
    slug: str
    subtitle: Optional[str] = None
    description: str
    short_description: Optional[str] = None
    
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    tags: List[str] = []
    difficulty: str
    course_type: str
    
    thumbnail: Optional[str] = None
    cover_image: Optional[str] = None
    intro_video: Optional[str] = None
    
    instructor_id: Optional[str] = None
    instructor_name: Optional[str] = None
    
    is_free: bool
    price: Decimal
    discount_price: Optional[Decimal] = None
    
    estimated_hours: int
    total_lessons: int
    total_quizzes: int
    total_projects: int
    
    is_published: bool
    is_featured: bool
    allow_certificate: bool
    
    language: str
    skills_required: List[str] = []
    skills_gained: List[str] = []
    
    enrollment_count: int
    completion_count: int
    average_rating: Decimal
    total_reviews: int
    
    published_at: Optional[datetime] = None


class CourseListResponse(BaseSchema):
    """Course list item (summarized)."""
    id: str
    title: str
    slug: str
    short_description: Optional[str] = None
    thumbnail: Optional[str] = None
    difficulty: str
    course_type: str
    is_free: bool
    price: Decimal
    estimated_hours: int
    total_lessons: int
    enrollment_count: int
    average_rating: Decimal
    total_reviews: int
    is_featured: bool
    instructor_name: Optional[str] = None
    created_at: datetime


class EnrollmentCreate(BaseModel):
    """Schema for enrolling in a course."""
    course_id: str


class EnrollmentResponse(TimestampSchema):
    """Enrollment response schema."""
    id: str
    user_id: str
    course_id: str
    course_title: Optional[str] = None
    course_thumbnail: Optional[str] = None
    status: str
    progress_percentage: Decimal
    completed_lessons: int
    completed_quizzes: int
    is_paid: bool
    enrolled_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    last_accessed_at: Optional[datetime] = None
    certificate_issued: bool


class ModuleCreate(BaseModel):
    """Schema for creating a module."""
    course_id: str
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    order: int = 0
    is_free_preview: bool = False


class ModuleResponse(TimestampSchema):
    """Module response schema."""
    id: str
    course_id: str
    title: str
    description: Optional[str] = None
    order: int
    is_free_preview: bool
    estimated_hours: Decimal
    lessons: List["LessonListResponse"] = []


class LessonCreate(BaseModel):
    """Schema for creating a lesson."""
    module_id: str
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    lesson_type: str = "article"
    order: int = 0
    content_html: Optional[str] = None
    content_markdown: Optional[str] = None
    estimated_minutes: int = 10
    is_free_preview: bool = False
    video_url: Optional[str] = None


class LessonResponse(TimestampSchema):
    """Lesson response schema."""
    id: str
    module_id: str
    title: str
    slug: str
    description: Optional[str] = None
    lesson_type: str
    order: int
    content_html: Optional[str] = None
    estimated_minutes: int
    is_free_preview: bool
    is_required: bool
    video_url: Optional[str] = None
    video_duration_seconds: int


class LessonListResponse(BaseSchema):
    """Lesson list item."""
    id: str
    title: str
    lesson_type: str
    order: int
    estimated_minutes: int
    is_free_preview: bool

