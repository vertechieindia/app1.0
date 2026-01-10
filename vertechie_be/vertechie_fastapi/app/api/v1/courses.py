"""
Courses and Learning API endpoints.
"""

from typing import Any, List, Optional
from uuid import UUID, uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from slugify import slugify

from app.db.session import get_db
from app.models.course import Course, CourseCategory, CourseEnrollment, EnrollmentStatus
from app.models.lesson import Module, Lesson, LessonProgress, LessonStatus
from app.models.user import User
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseResponse, CourseListResponse,
    CourseCategoryResponse, EnrollmentResponse, ModuleResponse, LessonResponse
)
from app.core.security import get_current_user

router = APIRouter()


@router.get("/", response_model=List[CourseListResponse])
async def list_courses(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category_id: Optional[UUID] = Query(None),
    difficulty: Optional[str] = Query(None),
    is_free: Optional[bool] = Query(None),
    is_featured: Optional[bool] = Query(None),
) -> Any:
    """List published courses."""
    
    query = select(Course).where(Course.is_published == True)
    
    if search:
        query = query.where(
            or_(
                Course.title.ilike(f"%{search}%"),
                Course.description.ilike(f"%{search}%"),
            )
        )
    
    if category_id:
        query = query.where(Course.category_id == category_id)
    
    if difficulty:
        query = query.where(Course.difficulty == difficulty)
    
    if is_free is not None:
        query = query.where(Course.is_free == is_free)
    
    if is_featured:
        query = query.where(Course.is_featured == True)
    
    query = query.order_by(Course.is_featured.desc(), Course.enrollment_count.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/categories", response_model=List[CourseCategoryResponse])
async def list_categories(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """List course categories."""
    
    result = await db.execute(
        select(CourseCategory)
        .where(CourseCategory.is_active == True)
        .order_by(CourseCategory.order)
    )
    return result.scalars().all()


@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_in: CourseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new course."""
    
    slug = f"{slugify(course_in.title)}-{uuid4().hex[:8]}"
    
    course = Course(
        **course_in.model_dump(),
        slug=slug,
        instructor_id=current_user.id,
    )
    
    db.add(course)
    await db.commit()
    await db.refresh(course)
    
    return course


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get course by ID."""
    
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    return course


@router.get("/{course_id}/curriculum")
async def get_curriculum(
    course_id: UUID,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get course curriculum (modules and lessons)."""
    
    # Verify course exists
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Get modules
    result = await db.execute(
        select(Module)
        .where(Module.course_id == course_id)
        .order_by(Module.order)
    )
    modules = result.scalars().all()
    
    curriculum = []
    for module in modules:
        # Get lessons for this module
        result = await db.execute(
            select(Lesson)
            .where(Lesson.module_id == module.id)
            .order_by(Lesson.order)
        )
        lessons = result.scalars().all()
        
        curriculum.append({
            "id": str(module.id),
            "title": module.title,
            "description": module.description,
            "order": module.order,
            "is_free_preview": module.is_free_preview,
            "estimated_minutes": module.estimated_minutes,
            "lessons": [
                {
                    "id": str(lesson.id),
                    "title": lesson.title,
                    "slug": lesson.slug,
                    "lesson_type": lesson.lesson_type.value if lesson.lesson_type else "article",
                    "estimated_minutes": lesson.estimated_minutes,
                    "is_free_preview": lesson.is_free_preview,
                    "order": lesson.order,
                }
                for lesson in lessons
            ]
        })
    
    return curriculum


@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: UUID,
    course_in: CourseUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Update course."""
    
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    if course.instructor_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    update_data = course_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(course, field, value)
    
    await db.commit()
    await db.refresh(course)
    
    return course


# ============= Enrollments =============

@router.post("/{course_id}/enroll", status_code=status.HTTP_201_CREATED)
async def enroll_in_course(
    course_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Enroll in a course."""
    
    # Check course exists
    result = await db.execute(
        select(Course).where(Course.id == course_id)
    )
    course = result.scalar_one_or_none()
    
    if not course or not course.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check if already enrolled
    result = await db.execute(
        select(CourseEnrollment).where(
            CourseEnrollment.course_id == course_id,
            CourseEnrollment.user_id == current_user.id
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already enrolled in this course"
        )
    
    enrollment = CourseEnrollment(
        user_id=current_user.id,
        course_id=course_id,
        is_paid=course.is_free,
        payment_amount=0 if course.is_free else course.price,
    )
    
    db.add(enrollment)
    
    # Update course enrollment count
    course.enrollment_count += 1
    
    await db.commit()
    
    return {"message": "Successfully enrolled", "enrollment_id": str(enrollment.id)}


@router.get("/my/enrollments", response_model=List[EnrollmentResponse])
async def get_my_enrollments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = Query(None),
) -> Any:
    """Get my course enrollments."""
    
    query = select(CourseEnrollment).where(
        CourseEnrollment.user_id == current_user.id
    )
    
    if status_filter:
        query = query.where(CourseEnrollment.status == status_filter)
    
    # MySQL/MariaDB doesn't support NULLS FIRST
    query = query.order_by(
        CourseEnrollment.last_accessed_at.is_(None).desc(),
        CourseEnrollment.last_accessed_at.desc()
    )
    
    result = await db.execute(query)
    enrollments = result.scalars().all()
    
    # Enrich with course data
    enriched = []
    for enrollment in enrollments:
        course_result = await db.execute(
            select(Course).where(Course.id == enrollment.course_id)
        )
        course = course_result.scalar_one_or_none()
        
        enriched.append({
            **enrollment.__dict__,
            "id": str(enrollment.id),
            "user_id": str(enrollment.user_id),
            "course_id": str(enrollment.course_id),
            "course_title": course.title if course else None,
            "course_thumbnail": course.thumbnail if course else None,
        })
    
    return enriched


# ============= Lessons =============

@router.get("/lessons/{lesson_id}")
async def get_lesson(
    lesson_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get lesson content."""
    
    result = await db.execute(
        select(Lesson).where(Lesson.id == lesson_id)
    )
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Get module and course
    module_result = await db.execute(
        select(Module).where(Module.id == lesson.module_id)
    )
    module = module_result.scalar_one()
    
    # Check access
    if not lesson.is_free_preview:
        enrollment_result = await db.execute(
            select(CourseEnrollment).where(
                CourseEnrollment.course_id == module.course_id,
                CourseEnrollment.user_id == current_user.id
            )
        )
        if not enrollment_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Please enroll in this course to access this lesson"
            )
    
    return {
        "id": str(lesson.id),
        "title": lesson.title,
        "description": lesson.description,
        "lesson_type": lesson.lesson_type.value if lesson.lesson_type else "article",
        "content_html": lesson.content_html,
        "content_markdown": lesson.content_markdown,
        "estimated_minutes": lesson.estimated_minutes,
        "video_url": lesson.video_url,
        "video_duration_seconds": lesson.video_duration_seconds,
        "initial_code": lesson.initial_code,
        "language": lesson.language,
        "attachments": lesson.attachments,
    }


@router.post("/lessons/{lesson_id}/complete")
async def complete_lesson(
    lesson_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Mark lesson as completed."""
    
    result = await db.execute(
        select(Lesson).where(Lesson.id == lesson_id)
    )
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Get module and enrollment
    module_result = await db.execute(
        select(Module).where(Module.id == lesson.module_id)
    )
    module = module_result.scalar_one()
    
    enrollment_result = await db.execute(
        select(CourseEnrollment).where(
            CourseEnrollment.course_id == module.course_id,
            CourseEnrollment.user_id == current_user.id
        )
    )
    enrollment = enrollment_result.scalar_one_or_none()
    
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enrolled in this course"
        )
    
    # Get or create progress
    progress_result = await db.execute(
        select(LessonProgress).where(
            LessonProgress.lesson_id == lesson_id,
            LessonProgress.user_id == current_user.id
        )
    )
    progress = progress_result.scalar_one_or_none()
    
    if not progress:
        progress = LessonProgress(
            user_id=current_user.id,
            lesson_id=lesson_id,
            enrollment_id=enrollment.id,
        )
        db.add(progress)
    
    progress.status = LessonStatus.COMPLETED
    progress.progress_percentage = 100
    progress.completed_at = datetime.utcnow()
    
    # Update enrollment progress
    enrollment.completed_lessons += 1
    enrollment.last_accessed_at = datetime.utcnow()
    
    # Get course to calculate progress
    course_result = await db.execute(
        select(Course).where(Course.id == module.course_id)
    )
    course = course_result.scalar_one()
    
    if course.total_lessons > 0:
        enrollment.progress_percentage = (enrollment.completed_lessons / course.total_lessons) * 100
    
    await db.commit()
    
    return {
        "message": "Lesson completed",
        "course_progress": float(enrollment.progress_percentage)
    }

