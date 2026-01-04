"""
Course and Learning routes.
"""

from typing import Any, List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from slugify import slugify
import uuid

from app.db import get_db
from app.models.course import Course, CourseCategory, CourseEnrollment, EnrollmentStatus
from app.models.lesson import Module, Lesson, LessonProgress
from app.models.user import User
from app.schemas.course import (
    CourseCreate, CourseUpdate, CourseResponse, CourseListResponse,
    EnrollmentCreate, EnrollmentResponse, ModuleResponse, LessonResponse
)
from app.api.v1.auth import get_current_user

router = APIRouter()


# ==================================
# ADMIN COURSE MANAGEMENT ENDPOINTS
# ==================================

async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require admin or learn_admin role."""
    if current_user.role not in ['super_admin', 'admin', 'learn_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


# --- Admin Category Management ---

@router.post("/admin/categories", status_code=status.HTTP_201_CREATED)
async def admin_create_category(
    name: str = Body(...),
    description: str = Body(None),
    icon: str = Body(None),
    color: str = Body("#0d47a1"),
    order: int = Body(0),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Create a new course category."""
    slug = slugify(name)
    
    category = CourseCategory(
        name=name,
        slug=slug,
        description=description,
        icon=icon,
        color=color,
        order=order,
        is_active=True,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    
    return {
        "id": str(category.id),
        "name": category.name,
        "slug": category.slug,
        "description": category.description,
        "icon": category.icon,
        "color": category.color,
        "message": "Category created successfully"
    }


@router.put("/admin/categories/{category_id}")
async def admin_update_category(
    category_id: str,
    name: str = Body(None),
    description: str = Body(None),
    icon: str = Body(None),
    color: str = Body(None),
    order: int = Body(None),
    is_active: bool = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Update a category."""
    result = await db.execute(select(CourseCategory).where(CourseCategory.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    if name is not None:
        category.name = name
        category.slug = slugify(name)
    if description is not None:
        category.description = description
    if icon is not None:
        category.icon = icon
    if color is not None:
        category.color = color
    if order is not None:
        category.order = order
    if is_active is not None:
        category.is_active = is_active
    
    await db.commit()
    return {"message": "Category updated successfully", "id": str(category.id)}


@router.delete("/admin/categories/{category_id}")
async def admin_delete_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Delete a category."""
    result = await db.execute(select(CourseCategory).where(CourseCategory.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    await db.delete(category)
    await db.commit()
    return {"message": "Category deleted successfully"}


# --- Admin Course Management ---

@router.get("/admin/courses")
async def admin_list_courses(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
    skip: int = Query(0),
    limit: int = Query(50),
    search: str = Query(None),
    is_published: bool = Query(None),
) -> Any:
    """List all courses for admin (including unpublished)."""
    query = select(Course)
    
    if search:
        query = query.where(
            (Course.title.ilike(f"%{search}%")) |
            (Course.description.ilike(f"%{search}%"))
        )
    
    if is_published is not None:
        query = query.where(Course.is_published == is_published)
    
    query = query.order_by(Course.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    courses = result.scalars().all()
    
    return [
        {
            "id": str(c.id),
            "title": c.title,
            "slug": c.slug,
            "description": c.description[:200] if c.description else "",
            "difficulty": c.difficulty.value if c.difficulty else "beginner",
            "is_published": c.is_published,
            "is_featured": c.is_featured,
            "is_free": c.is_free,
            "total_lessons": c.total_lessons,
            "enrollment_count": c.enrollment_count,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in courses
    ]


@router.post("/admin/courses", status_code=status.HTTP_201_CREATED)
async def admin_create_course(
    title: str = Body(...),
    description: str = Body(...),
    short_description: str = Body(None),
    difficulty: str = Body("beginner"),
    category_id: str = Body(None),
    is_free: bool = Body(True),
    price: float = Body(0),
    estimated_hours: int = Body(0),
    thumbnail: str = Body(None),
    tags: List[str] = Body([]),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Create a new course."""
    base_slug = slugify(title)
    slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
    
    course = Course(
        title=title,
        slug=slug,
        description=description,
        short_description=short_description,
        difficulty=difficulty,
        category_id=category_id if category_id else None,
        is_free=is_free,
        price=price,
        estimated_hours=estimated_hours,
        thumbnail=thumbnail,
        tags=tags,
        instructor_id=current_user.id,
        is_published=False,
    )
    db.add(course)
    await db.commit()
    await db.refresh(course)
    
    return {
        "id": str(course.id),
        "title": course.title,
        "slug": course.slug,
        "message": "Course created successfully"
    }


@router.get("/admin/courses/{course_id}")
async def admin_get_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Any:
    """Get full course details for admin."""
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get modules with lessons
    modules_query = select(Module).where(Module.course_id == course_id).order_by(Module.order)
    modules_result = await db.execute(modules_query)
    modules = modules_result.scalars().all()
    
    modules_data = []
    for module in modules:
        lessons_query = select(Lesson).where(Lesson.module_id == module.id).order_by(Lesson.order)
        lessons_result = await db.execute(lessons_query)
        lessons = lessons_result.scalars().all()
        
        modules_data.append({
            "id": str(module.id),
            "title": module.title,
            "description": module.description,
            "order": module.order,
            "is_free_preview": module.is_free_preview,
            "lessons": [
                {
                    "id": str(lesson.id),
                    "title": lesson.title,
                    "slug": lesson.slug,
                    "description": lesson.description,
                    "lesson_type": lesson.lesson_type.value,
                    "estimated_minutes": lesson.estimated_minutes,
                    "is_free_preview": lesson.is_free_preview,
                    "order": lesson.order,
                    "content_markdown": lesson.content_markdown,
                    "initial_code": lesson.initial_code,
                    "solution_code": lesson.solution_code,
                    "language": lesson.language,
                }
                for lesson in lessons
            ]
        })
    
    return {
        "id": str(course.id),
        "title": course.title,
        "slug": course.slug,
        "subtitle": course.subtitle,
        "description": course.description,
        "short_description": course.short_description,
        "difficulty": course.difficulty.value if course.difficulty else "beginner",
        "category_id": str(course.category_id) if course.category_id else None,
        "is_free": course.is_free,
        "price": float(course.price) if course.price else 0,
        "is_published": course.is_published,
        "is_featured": course.is_featured,
        "estimated_hours": course.estimated_hours,
        "total_lessons": course.total_lessons,
        "thumbnail": course.thumbnail,
        "tags": course.tags or [],
        "modules": modules_data,
    }


@router.put("/admin/courses/{course_id}")
async def admin_update_course(
    course_id: str,
    title: str = Body(None),
    description: str = Body(None),
    short_description: str = Body(None),
    difficulty: str = Body(None),
    category_id: str = Body(None),
    is_free: bool = Body(None),
    price: float = Body(None),
    is_published: bool = Body(None),
    is_featured: bool = Body(None),
    estimated_hours: int = Body(None),
    thumbnail: str = Body(None),
    tags: List[str] = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Update a course."""
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if title is not None:
        course.title = title
    if description is not None:
        course.description = description
    if short_description is not None:
        course.short_description = short_description
    if difficulty is not None:
        course.difficulty = difficulty
    if category_id is not None:
        course.category_id = category_id if category_id else None
    if is_free is not None:
        course.is_free = is_free
    if price is not None:
        course.price = price
    if is_published is not None:
        course.is_published = is_published
        if is_published and not course.published_at:
            course.published_at = datetime.utcnow()
    if is_featured is not None:
        course.is_featured = is_featured
    if estimated_hours is not None:
        course.estimated_hours = estimated_hours
    if thumbnail is not None:
        course.thumbnail = thumbnail
    if tags is not None:
        course.tags = tags
    
    await db.commit()
    return {"message": "Course updated successfully", "id": str(course.id)}


@router.delete("/admin/courses/{course_id}")
async def admin_delete_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Delete a course and all its modules/lessons."""
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Delete all related data
    modules_result = await db.execute(select(Module).where(Module.course_id == course_id))
    modules = modules_result.scalars().all()
    
    for module in modules:
        await db.execute(delete(Lesson).where(Lesson.module_id == module.id))
    
    await db.execute(delete(Module).where(Module.course_id == course_id))
    await db.execute(delete(CourseEnrollment).where(CourseEnrollment.course_id == course_id))
    await db.delete(course)
    await db.commit()
    
    return {"message": "Course deleted successfully"}


# --- Admin Module Management ---

@router.post("/admin/courses/{course_id}/modules", status_code=status.HTTP_201_CREATED)
async def admin_create_module(
    course_id: str,
    title: str = Body(...),
    description: str = Body(None),
    order: int = Body(0),
    is_free_preview: bool = Body(False),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Create a module in a course."""
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Get max order
    max_order_result = await db.execute(
        select(func.max(Module.order)).where(Module.course_id == course_id)
    )
    max_order = max_order_result.scalar() or 0
    
    module = Module(
        course_id=course_id,
        title=title,
        description=description,
        order=order if order > 0 else max_order + 1,
        is_free_preview=is_free_preview,
    )
    db.add(module)
    await db.commit()
    await db.refresh(module)
    
    return {
        "id": str(module.id),
        "title": module.title,
        "order": module.order,
        "message": "Module created successfully"
    }


@router.put("/admin/modules/{module_id}")
async def admin_update_module(
    module_id: str,
    title: str = Body(None),
    description: str = Body(None),
    order: int = Body(None),
    is_free_preview: bool = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Update a module."""
    result = await db.execute(select(Module).where(Module.id == module_id))
    module = result.scalar_one_or_none()
    
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    if title is not None:
        module.title = title
    if description is not None:
        module.description = description
    if order is not None:
        module.order = order
    if is_free_preview is not None:
        module.is_free_preview = is_free_preview
    
    await db.commit()
    return {"message": "Module updated successfully", "id": str(module.id)}


@router.delete("/admin/modules/{module_id}")
async def admin_delete_module(
    module_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Delete a module and its lessons."""
    result = await db.execute(select(Module).where(Module.id == module_id))
    module = result.scalar_one_or_none()
    
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Delete lessons first
    await db.execute(delete(Lesson).where(Lesson.module_id == module_id))
    await db.delete(module)
    
    # Update course lesson count
    course_result = await db.execute(select(Course).where(Course.id == module.course_id))
    course = course_result.scalar_one()
    lessons_count = await db.execute(
        select(func.count(Lesson.id)).where(
            Lesson.module_id.in_(
                select(Module.id).where(Module.course_id == course.id)
            )
        )
    )
    course.total_lessons = lessons_count.scalar() or 0
    
    await db.commit()
    return {"message": "Module deleted successfully"}


# --- Admin Lesson Management ---

@router.post("/admin/modules/{module_id}/lessons", status_code=status.HTTP_201_CREATED)
async def admin_create_lesson(
    module_id: str,
    title: str = Body(...),
    description: str = Body(None),
    lesson_type: str = Body("article"),
    order: int = Body(0),
    estimated_minutes: int = Body(10),
    is_free_preview: bool = Body(False),
    content_markdown: str = Body(None),
    initial_code: str = Body(None),
    solution_code: str = Body(None),
    language: str = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Create a lesson in a module."""
    result = await db.execute(select(Module).where(Module.id == module_id))
    module = result.scalar_one_or_none()
    
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    
    # Get max order
    max_order_result = await db.execute(
        select(func.max(Lesson.order)).where(Lesson.module_id == module_id)
    )
    max_order = max_order_result.scalar() or 0
    
    slug = slugify(title)
    
    lesson = Lesson(
        module_id=module_id,
        title=title,
        slug=slug,
        description=description,
        lesson_type=lesson_type,
        order=order if order > 0 else max_order + 1,
        estimated_minutes=estimated_minutes,
        is_free_preview=is_free_preview,
        content_markdown=content_markdown,
        initial_code=initial_code,
        solution_code=solution_code,
        language=language,
    )
    db.add(lesson)
    
    # Update course lesson count
    course_result = await db.execute(select(Course).where(Course.id == module.course_id))
    course = course_result.scalar_one()
    course.total_lessons = (course.total_lessons or 0) + 1
    
    await db.commit()
    await db.refresh(lesson)
    
    return {
        "id": str(lesson.id),
        "title": lesson.title,
        "slug": lesson.slug,
        "order": lesson.order,
        "message": "Lesson created successfully"
    }


@router.get("/admin/lessons/{lesson_id}")
async def admin_get_lesson(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> Any:
    """Get full lesson details for editing."""
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return {
        "id": str(lesson.id),
        "module_id": str(lesson.module_id),
        "title": lesson.title,
        "slug": lesson.slug,
        "description": lesson.description,
        "lesson_type": lesson.lesson_type.value,
        "order": lesson.order,
        "estimated_minutes": lesson.estimated_minutes,
        "is_free_preview": lesson.is_free_preview,
        "content_markdown": lesson.content_markdown,
        "content_html": lesson.content_html,
        "initial_code": lesson.initial_code,
        "solution_code": lesson.solution_code,
        "test_code": lesson.test_code,
        "language": lesson.language,
        "video_url": lesson.video_url,
    }


@router.put("/admin/lessons/{lesson_id}")
async def admin_update_lesson(
    lesson_id: str,
    title: str = Body(None),
    description: str = Body(None),
    lesson_type: str = Body(None),
    order: int = Body(None),
    estimated_minutes: int = Body(None),
    is_free_preview: bool = Body(None),
    content_markdown: str = Body(None),
    content_html: str = Body(None),
    initial_code: str = Body(None),
    solution_code: str = Body(None),
    test_code: str = Body(None),
    language: str = Body(None),
    video_url: str = Body(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Update a lesson."""
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    if title is not None:
        lesson.title = title
        lesson.slug = slugify(title)
    if description is not None:
        lesson.description = description
    if lesson_type is not None:
        lesson.lesson_type = lesson_type
    if order is not None:
        lesson.order = order
    if estimated_minutes is not None:
        lesson.estimated_minutes = estimated_minutes
    if is_free_preview is not None:
        lesson.is_free_preview = is_free_preview
    if content_markdown is not None:
        lesson.content_markdown = content_markdown
    if content_html is not None:
        lesson.content_html = content_html
    if initial_code is not None:
        lesson.initial_code = initial_code
    if solution_code is not None:
        lesson.solution_code = solution_code
    if test_code is not None:
        lesson.test_code = test_code
    if language is not None:
        lesson.language = language
    if video_url is not None:
        lesson.video_url = video_url
    
    await db.commit()
    return {"message": "Lesson updated successfully", "id": str(lesson.id)}


@router.delete("/admin/lessons/{lesson_id}")
async def admin_delete_lesson(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin)
) -> dict:
    """Delete a lesson."""
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Get course and update count
    module_result = await db.execute(select(Module).where(Module.id == lesson.module_id))
    module = module_result.scalar_one()
    course_result = await db.execute(select(Course).where(Course.id == module.course_id))
    course = course_result.scalar_one()
    course.total_lessons = max(0, (course.total_lessons or 1) - 1)
    
    # Delete progress records
    await db.execute(delete(LessonProgress).where(LessonProgress.lesson_id == lesson_id))
    await db.delete(lesson)
    await db.commit()
    
    return {"message": "Lesson deleted successfully"}


# ==================================
# PUBLIC COURSE ENDPOINTS
# ==================================


@router.get("/", response_model=List[CourseListResponse])
async def list_courses(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    category: str = Query(None),
    difficulty: str = Query(None),
    is_free: bool = Query(None),
    is_featured: bool = Query(None),
) -> Any:
    """List published courses."""
    query = select(Course).where(Course.is_published == True)
    
    if search:
        query = query.where(
            (Course.title.ilike(f"%{search}%")) |
            (Course.description.ilike(f"%{search}%"))
        )
    
    if category:
        query = query.where(Course.category_id == category)
    
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


@router.get("/categories")
async def list_categories(
    db: AsyncSession = Depends(get_db)
) -> Any:
    """List course categories."""
    query = select(CourseCategory).where(CourseCategory.is_active == True)
    query = query.order_by(CourseCategory.order)
    
    result = await db.execute(query)
    categories = result.scalars().all()
    
    return [
        {
            "id": str(cat.id),
            "name": cat.name,
            "slug": cat.slug,
            "description": cat.description,
            "icon": cat.icon,
            "color": cat.color,
        }
        for cat in categories
    ]


@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_in: CourseCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Create a new course."""
    base_slug = slugify(course_in.title)
    slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
    
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
    course_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get course by ID."""
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    return course


@router.get("/{course_id}/curriculum")
async def get_course_curriculum(
    course_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Get course curriculum (modules and lessons)."""
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Get modules with lessons
    modules_query = select(Module).where(Module.course_id == course_id).order_by(Module.order)
    modules_result = await db.execute(modules_query)
    modules = modules_result.scalars().all()
    
    curriculum = []
    for module in modules:
        lessons_query = select(Lesson).where(Lesson.module_id == module.id).order_by(Lesson.order)
        lessons_result = await db.execute(lessons_query)
        lessons = lessons_result.scalars().all()
        
        curriculum.append({
            "id": str(module.id),
            "title": module.title,
            "description": module.description,
            "order": module.order,
            "is_free_preview": module.is_free_preview,
            "lessons": [
                {
                    "id": str(lesson.id),
                    "title": lesson.title,
                    "lesson_type": lesson.lesson_type.value,
                    "estimated_minutes": lesson.estimated_minutes,
                    "is_free_preview": lesson.is_free_preview,
                    "order": lesson.order,
                }
                for lesson in lessons
            ]
        })
    
    return curriculum


@router.post("/{course_id}/enroll", status_code=status.HTTP_201_CREATED)
async def enroll_in_course(
    course_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Enroll in a course."""
    # Check if course exists
    result = await db.execute(select(Course).where(Course.id == course_id))
    course = result.scalar_one_or_none()
    
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Check if already enrolled
    result = await db.execute(
        select(CourseEnrollment).where(
            (CourseEnrollment.course_id == course_id) &
            (CourseEnrollment.user_id == current_user.id)
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
    status: str = Query(None),
) -> Any:
    """Get current user's course enrollments."""
    query = select(CourseEnrollment).where(CourseEnrollment.user_id == current_user.id)
    
    if status:
        query = query.where(CourseEnrollment.status == status)
    
    query = query.order_by(CourseEnrollment.last_accessed_at.desc().nullsfirst())
    
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


@router.get("/lessons/{lesson_id}")
async def get_lesson(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """Get lesson content."""
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Get module and course
    module_result = await db.execute(select(Module).where(Module.id == lesson.module_id))
    module = module_result.scalar_one()
    
    # Check access
    if not lesson.is_free_preview:
        enrollment_result = await db.execute(
            select(CourseEnrollment).where(
                (CourseEnrollment.course_id == module.course_id) &
                (CourseEnrollment.user_id == current_user.id)
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
        "lesson_type": lesson.lesson_type.value,
        "content_html": lesson.content_html,
        "content_markdown": lesson.content_markdown,
        "estimated_minutes": lesson.estimated_minutes,
        "video_url": lesson.video_url,
        "video_duration_seconds": lesson.video_duration_seconds,
        "initial_code": lesson.initial_code,
        "language": lesson.language,
    }


@router.post("/lessons/{lesson_id}/complete")
async def complete_lesson(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> dict:
    """Mark lesson as completed."""
    result = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    # Get enrollment
    module_result = await db.execute(select(Module).where(Module.id == lesson.module_id))
    module = module_result.scalar_one()
    
    enrollment_result = await db.execute(
        select(CourseEnrollment).where(
            (CourseEnrollment.course_id == module.course_id) &
            (CourseEnrollment.user_id == current_user.id)
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
            (LessonProgress.lesson_id == lesson_id) &
            (LessonProgress.user_id == current_user.id)
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
    
    progress.status = "completed"
    progress.progress_percentage = 100
    progress.completed_at = datetime.utcnow()
    
    # Update enrollment progress
    enrollment.completed_lessons += 1
    enrollment.last_accessed_at = datetime.utcnow()
    
    # Calculate progress percentage
    course_result = await db.execute(select(Course).where(Course.id == module.course_id))
    course = course_result.scalar_one()
    
    if course.total_lessons > 0:
        enrollment.progress_percentage = (enrollment.completed_lessons / course.total_lessons) * 100
    
    await db.commit()
    
    return {
        "message": "Lesson completed",
        "course_progress": float(enrollment.progress_percentage)
    }

