"""
Pydantic Schemas for API validation.
"""

from app.schemas.user import (
    UserCreate, UserUpdate, UserResponse, UserLogin,
    Token, TokenPayload, UserProfileResponse
)
from app.schemas.job import (
    JobCreate, JobUpdate, JobResponse, JobListResponse,
    JobApplicationCreate, JobApplicationResponse
)
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseResponse, CourseListResponse,
    EnrollmentCreate, EnrollmentResponse
)
from app.schemas.common import (
    PaginatedResponse, MessageResponse, ErrorResponse
)

__all__ = [
    # User
    "UserCreate", "UserUpdate", "UserResponse", "UserLogin",
    "Token", "TokenPayload", "UserProfileResponse",
    # Job
    "JobCreate", "JobUpdate", "JobResponse", "JobListResponse",
    "JobApplicationCreate", "JobApplicationResponse",
    # Course
    "CourseCreate", "CourseUpdate", "CourseResponse", "CourseListResponse",
    "EnrollmentCreate", "EnrollmentResponse",
    # Common
    "PaginatedResponse", "MessageResponse", "ErrorResponse",
]

