"""
Course and Learning schemas.
"""

from typing import Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class CourseCategoryResponse(BaseModel):
    """Course category response."""
    
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    color: Optional[str] = None
    courses_count: int = 0
    
    class Config:
        from_attributes = True


class CourseCreate(BaseModel):
    """Course creation schema."""
    
    title: str = Field(..., max_length=200)
    description: str
    short_description: Optional[str] = None
    
    thumbnail: Optional[str] = None
    preview_video: Optional[str] = None
    
    category_id: Optional[UUID] = None
    
    difficulty: str = "beginner"
    language: str = "English"
    
    is_free: bool = True
    price: float = 0
    currency: str = "USD"
    
    prerequisites: List[str] = []
    target_audience: List[str] = []
    learning_outcomes: List[str] = []
    
    tags: List[str] = []


class CourseUpdate(BaseModel):
    """Course update schema."""
    
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    thumbnail: Optional[str] = None
    category_id: Optional[UUID] = None
    difficulty: Optional[str] = None
    is_free: Optional[bool] = None
    price: Optional[float] = None
    is_published: Optional[bool] = None
    is_featured: Optional[bool] = None
    tags: Optional[List[str]] = None


class CourseResponse(BaseModel):
    """Course response schema."""
    
    id: UUID
    title: str
    slug: str
    description: str
    short_description: Optional[str] = None
    
    thumbnail: Optional[str] = None
    
    category_id: Optional[UUID] = None
    instructor_id: UUID
    
    difficulty: str
    language: str
    
    estimated_hours: float = 0
    total_lessons: int = 0
    
    is_free: bool = True
    price: float = 0
    
    is_published: bool = False
    is_featured: bool = False
    is_certified: bool = False
    
    enrollment_count: int = 0
    rating: float = 0
    reviews_count: int = 0
    
    tags: List[str] = []
    
    created_at: datetime
    
    class Config:
        from_attributes = True


class CourseListResponse(BaseModel):
    """Course list response (minimal)."""
    
    id: UUID
    title: str
    slug: str
    short_description: Optional[str] = None
    thumbnail: Optional[str] = None
    difficulty: str
    is_free: bool
    price: float = 0
    enrollment_count: int = 0
    rating: float = 0
    is_featured: bool = False
    
    class Config:
        from_attributes = True


class ModuleResponse(BaseModel):
    """Module response."""
    
    id: UUID
    course_id: UUID
    title: str
    description: Optional[str] = None
    order: int
    estimated_minutes: int = 0
    is_free_preview: bool = False
    
    class Config:
        from_attributes = True


class LessonResponse(BaseModel):
    """Lesson response."""
    
    id: UUID
    module_id: UUID
    title: str
    slug: Optional[str] = None
    description: Optional[str] = None
    lesson_type: str
    estimated_minutes: int = 5
    is_free_preview: bool = False
    order: int
    
    class Config:
        from_attributes = True


class EnrollmentCreate(BaseModel):
    """Enrollment request."""
    
    course_id: UUID


class EnrollmentResponse(BaseModel):
    """Enrollment response."""
    
    id: UUID
    user_id: UUID
    course_id: UUID
    status: str
    progress_percentage: float = 0
    completed_lessons: int = 0
    is_paid: bool = False
    enrolled_at: datetime
    completed_at: Optional[datetime] = None
    
    # Extra fields from joins
    course_title: Optional[str] = None
    course_thumbnail: Optional[str] = None
    
    class Config:
        from_attributes = True

