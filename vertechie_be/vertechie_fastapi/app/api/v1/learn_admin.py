"""
Learn Admin API - Complete Course Management

Hierarchy:
Category → Tutorial → Section → Lesson → Content Blocks
"""

from typing import Any, List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update
from slugify import slugify
import uuid

from app.db import get_db
from app.models.user import User
from app.models.learn import (
    TutorialCategory, Tutorial, TutorialSection, TutorialLesson,
    ContentBlock, MediaAsset, CodeSnippet, BlockType, ContentStatus,
    DifficultyLevel, LessonType, MediaType
)
from app.api.v1.auth import get_current_user

router = APIRouter()


# ============================================
# AUTH HELPER
# ============================================

# Development mode - set to False in production
DEV_MODE = True  # Allow access without authentication for testing

async def require_learn_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require admin, learn_admin, or super_admin role."""
    if current_user.role not in ['super_admin', 'admin', 'learn_admin', 'superadmin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Learn Admin access required"
        )
    return current_user


async def optional_learn_admin():
    """Optional auth - returns None in dev mode, otherwise requires auth."""
    if DEV_MODE:
        return None
    # In production, this would call get_current_user
    return None


# ============================================
# CATEGORY MANAGEMENT
# ============================================

@router.get("/categories")
async def list_categories(
    db: AsyncSession = Depends(get_db),
    include_hidden: bool = Query(False),
) -> Any:
    """List all tutorial categories."""
    query = select(TutorialCategory)
    if not include_hidden:
        query = query.where(TutorialCategory.is_visible == True)
    query = query.order_by(TutorialCategory.display_order)
    
    result = await db.execute(query)
    categories = result.scalars().all()
    
    return [
        {
            "id": str(c.id),
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "icon": c.icon,
            "color": c.color,
            "thumbnail": c.thumbnail,
            "display_order": c.display_order,
            "is_visible": c.is_visible,
            "is_featured": c.is_featured,
            "parent_id": str(c.parent_id) if c.parent_id else None,
            "course_count": len(c.courses) if c.courses else 0,
        }
        for c in categories
    ]


@router.post("/categories", status_code=status.HTTP_201_CREATED)
async def create_category(
    name: str = Body(...),
    description: str = Body(None),
    icon: str = Body(None),
    color: str = Body("#0d47a1"),
    display_order: int = Body(0),
    parent_id: str = Body(None),
    thumbnail: str = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Create a new tutorial category."""
    slug = slugify(name)
    
    # Check slug uniqueness
    existing = await db.execute(select(TutorialCategory).where(TutorialCategory.slug == slug))
    if existing.scalar_one_or_none():
        slug = f"{slug}-{str(uuid.uuid4())[:8]}"
    
    category = TutorialCategory(
        name=name,
        slug=slug,
        description=description,
        icon=icon,
        color=color,
        display_order=display_order,
        parent_id=parent_id if parent_id else None,
        thumbnail=thumbnail,
        is_visible=True,
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    
    return {
        "id": str(category.id),
        "name": category.name,
        "slug": category.slug,
        "message": "Category created successfully"
    }


@router.get("/categories/{category_id}")
async def get_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get category details."""
    result = await db.execute(select(TutorialCategory).where(TutorialCategory.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {
        "id": str(category.id),
        "name": category.name,
        "slug": category.slug,
        "description": category.description,
        "icon": category.icon,
        "color": category.color,
        "thumbnail": category.thumbnail,
        "display_order": category.display_order,
        "is_visible": category.is_visible,
        "is_featured": category.is_featured,
        "parent_id": str(category.parent_id) if category.parent_id else None,
    }


@router.put("/categories/{category_id}")
async def update_category(
    category_id: str,
    name: str = Body(None),
    description: str = Body(None),
    icon: str = Body(None),
    color: str = Body(None),
    display_order: int = Body(None),
    is_visible: bool = Body(None),
    is_featured: bool = Body(None),
    parent_id: str = Body(None),
    thumbnail: str = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Update a category."""
    result = await db.execute(select(TutorialCategory).where(TutorialCategory.id == category_id))
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
    if display_order is not None:
        category.display_order = display_order
    if is_visible is not None:
        category.is_visible = is_visible
    if is_featured is not None:
        category.is_featured = is_featured
    if parent_id is not None:
        category.parent_id = parent_id if parent_id else None
    if thumbnail is not None:
        category.thumbnail = thumbnail
    
    await db.commit()
    return {"message": "Category updated successfully", "id": str(category.id)}


@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a category (only if no courses)."""
    result = await db.execute(select(TutorialCategory).where(TutorialCategory.id == category_id))
    category = result.scalar_one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check for courses
    courses_result = await db.execute(select(func.count(Tutorial.id)).where(Tutorial.category_id == category_id))
    if courses_result.scalar() > 0:
        raise HTTPException(status_code=400, detail="Cannot delete category with courses")
    
    await db.delete(category)
    await db.commit()
    return {"message": "Category deleted successfully"}


@router.put("/categories/reorder")
async def reorder_categories(
    order: List[dict] = Body(...),  # [{"id": "...", "order": 0}, ...]
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Reorder categories."""
    for item in order:
        await db.execute(
            update(TutorialCategory)
            .where(TutorialCategory.id == item["id"])
            .values(display_order=item["order"])
        )
    await db.commit()
    return {"message": "Categories reordered successfully"}


# ============================================
# TUTORIAL / COURSE MANAGEMENT
# ============================================

@router.get("/tutorials")
async def list_tutorials(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0),
    limit: int = Query(50),
    category_id: str = Query(None),
    status: str = Query(None),
    search: str = Query(None),
) -> Any:
    """List all tutorials (including drafts)."""
    query = select(Tutorial)
    
    if category_id:
        query = query.where(Tutorial.category_id == category_id)
    if status:
        query = query.where(Tutorial.status == status)
    if search:
        query = query.where(
            (Tutorial.title.ilike(f"%{search}%")) |
            (Tutorial.description.ilike(f"%{search}%"))
        )
    
    query = query.order_by(Tutorial.display_order, Tutorial.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    tutorials = result.scalars().all()
    
    return [
        {
            "id": str(t.id),
            "title": t.title,
            "slug": t.slug,
            "short_description": t.short_description,
            "category_id": str(t.category_id) if t.category_id else None,
            "difficulty": t.difficulty.value if t.difficulty else "beginner",
            "status": t.status.value if t.status else "draft",
            "is_free": t.is_free,
            "is_featured": t.is_featured,
            "estimated_hours": t.estimated_hours,
            "total_sections": t.total_sections,
            "total_lessons": t.total_lessons,
            "enrollment_count": t.enrollment_count,
            "thumbnail": t.thumbnail,
            "tags": t.tags or [],
            "display_order": t.display_order,
            "created_at": t.created_at.isoformat() if t.created_at else None,
        }
        for t in tutorials
    ]


@router.post("/tutorials", status_code=status.HTTP_201_CREATED)
async def create_tutorial(
    title: str = Body(...),
    category_id: str = Body(...),
    description: str = Body(...),
    difficulty: str = Body("beginner"),
    estimated_hours: int = Body(0),
    is_free: bool = Body(True),
    short_description: str = Body(None),
    tags: List[str] = Body([]),
    prerequisites: List[str] = Body([]),
    language: str = Body("en"),
    thumbnail: str = Body(None),
    price: float = Body(0),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Create a new tutorial (Step 1 - Metadata only)."""
    base_slug = slugify(title)
    slug = f"{base_slug}-{str(uuid.uuid4())[:8]}"
    
    tutorial = Tutorial(
        title=title,
        slug=slug,
        category_id=category_id,
        description=description,
        difficulty=difficulty,
        estimated_hours=estimated_hours,
        is_free=is_free,
        short_description=short_description,
        tags=tags,
        prerequisites=prerequisites,
        language=language,
        thumbnail=thumbnail,
        price=price,
        author_id=None,  # TODO: Set from authenticated user
        status=ContentStatus.DRAFT,
    )
    db.add(tutorial)
    await db.commit()
    await db.refresh(tutorial)
    
    return {
        "id": str(tutorial.id),
        "title": tutorial.title,
        "slug": tutorial.slug,
        "message": "Tutorial created successfully. Add sections next."
    }


@router.get("/tutorials/{tutorial_id}")
async def get_tutorial(
    tutorial_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get full tutorial details with sections and lessons."""
    result = await db.execute(select(Tutorial).where(Tutorial.id == tutorial_id))
    tutorial = result.scalar_one_or_none()
    
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    
    # Get sections with lessons
    sections_query = select(TutorialSection).where(
        TutorialSection.tutorial_id == tutorial_id
    ).order_by(TutorialSection.display_order)
    sections_result = await db.execute(sections_query)
    sections = sections_result.scalars().all()
    
    sections_data = []
    for section in sections:
        lessons_query = select(TutorialLesson).where(
            TutorialLesson.section_id == section.id
        ).order_by(TutorialLesson.display_order)
        lessons_result = await db.execute(lessons_query)
        lessons = lessons_result.scalars().all()
        
        sections_data.append({
            "id": str(section.id),
            "title": section.title,
            "description": section.description,
            "display_order": section.display_order,
            "is_visible": section.is_visible,
            "is_free_preview": section.is_free_preview,
            "estimated_minutes": section.estimated_minutes,
            "total_lessons": len(lessons),
            "lessons": [
                {
                    "id": str(l.id),
                    "title": l.title,
                    "slug": l.slug,
                    "lesson_type": l.lesson_type.value if l.lesson_type else "article",
                    "estimated_minutes": l.estimated_minutes,
                    "is_visible": l.is_visible,
                    "is_free_preview": l.is_free_preview,
                    "has_quiz": l.has_quiz,
                    "has_exercise": l.has_exercise,
                    "has_try_it": l.has_try_it,
                    "display_order": l.display_order,
                    "status": l.status.value if l.status else "draft",
                }
                for l in lessons
            ]
        })
    
    # Get category name
    category_result = await db.execute(
        select(TutorialCategory).where(TutorialCategory.id == tutorial.category_id)
    )
    category = category_result.scalar_one_or_none()
    
    return {
        "id": str(tutorial.id),
        "title": tutorial.title,
        "slug": tutorial.slug,
        "description": tutorial.description,
        "short_description": tutorial.short_description,
        "category_id": str(tutorial.category_id),
        "category_name": category.name if category else None,
        "difficulty": tutorial.difficulty.value if tutorial.difficulty else "beginner",
        "status": tutorial.status.value if tutorial.status else "draft",
        "is_free": tutorial.is_free,
        "is_featured": tutorial.is_featured,
        "price": float(tutorial.price) if tutorial.price else 0,
        "estimated_hours": tutorial.estimated_hours,
        "language": tutorial.language,
        "thumbnail": tutorial.thumbnail,
        "cover_image": tutorial.cover_image,
        "intro_video": tutorial.intro_video,
        "tags": tutorial.tags or [],
        "prerequisites": tutorial.prerequisites or [],
        "version": tutorial.version,
        "meta_title": tutorial.meta_title,
        "meta_description": tutorial.meta_description,
        "total_sections": len(sections_data),
        "total_lessons": sum(s["total_lessons"] for s in sections_data),
        "enrollment_count": tutorial.enrollment_count,
        "sections": sections_data,
    }


@router.put("/tutorials/{tutorial_id}")
async def update_tutorial(
    tutorial_id: str,
    title: str = Body(None),
    description: str = Body(None),
    short_description: str = Body(None),
    category_id: str = Body(None),
    difficulty: str = Body(None),
    estimated_hours: int = Body(None),
    is_free: bool = Body(None),
    price: float = Body(None),
    status: str = Body(None),
    is_featured: bool = Body(None),
    thumbnail: str = Body(None),
    cover_image: str = Body(None),
    intro_video: str = Body(None),
    tags: List[str] = Body(None),
    prerequisites: List[str] = Body(None),
    language: str = Body(None),
    version: str = Body(None),
    meta_title: str = Body(None),
    meta_description: str = Body(None),
    display_order: int = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Update tutorial metadata."""
    result = await db.execute(select(Tutorial).where(Tutorial.id == tutorial_id))
    tutorial = result.scalar_one_or_none()
    
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    
    if title is not None:
        tutorial.title = title
    if description is not None:
        tutorial.description = description
    if short_description is not None:
        tutorial.short_description = short_description
    if category_id is not None:
        tutorial.category_id = category_id
    if difficulty is not None:
        tutorial.difficulty = difficulty
    if estimated_hours is not None:
        tutorial.estimated_hours = estimated_hours
    if is_free is not None:
        tutorial.is_free = is_free
    if price is not None:
        tutorial.price = price
    if status is not None:
        tutorial.status = status
        if status == "published" and not tutorial.published_at:
            tutorial.published_at = datetime.utcnow()
    if is_featured is not None:
        tutorial.is_featured = is_featured
    if thumbnail is not None:
        tutorial.thumbnail = thumbnail
    if cover_image is not None:
        tutorial.cover_image = cover_image
    if intro_video is not None:
        tutorial.intro_video = intro_video
    if tags is not None:
        tutorial.tags = tags
    if prerequisites is not None:
        tutorial.prerequisites = prerequisites
    if language is not None:
        tutorial.language = language
    if version is not None:
        tutorial.version = version
    if meta_title is not None:
        tutorial.meta_title = meta_title
    if meta_description is not None:
        tutorial.meta_description = meta_description
    if display_order is not None:
        tutorial.display_order = display_order
    
    await db.commit()
    return {"message": "Tutorial updated successfully", "id": str(tutorial.id)}


@router.delete("/tutorials/{tutorial_id}")
async def delete_tutorial(
    tutorial_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a tutorial and all its content."""
    result = await db.execute(select(Tutorial).where(Tutorial.id == tutorial_id))
    tutorial = result.scalar_one_or_none()
    
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    
    # Delete all related content
    sections = await db.execute(select(TutorialSection).where(TutorialSection.tutorial_id == tutorial_id))
    for section in sections.scalars().all():
        lessons = await db.execute(select(TutorialLesson).where(TutorialLesson.section_id == section.id))
        for lesson in lessons.scalars().all():
            await db.execute(delete(ContentBlock).where(ContentBlock.lesson_id == lesson.id))
        await db.execute(delete(TutorialLesson).where(TutorialLesson.section_id == section.id))
    await db.execute(delete(TutorialSection).where(TutorialSection.tutorial_id == tutorial_id))
    
    await db.delete(tutorial)
    await db.commit()
    
    return {"message": "Tutorial deleted successfully"}


@router.post("/tutorials/{tutorial_id}/publish")
async def publish_tutorial(
    tutorial_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Publish a tutorial."""
    result = await db.execute(select(Tutorial).where(Tutorial.id == tutorial_id))
    tutorial = result.scalar_one_or_none()
    
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    
    tutorial.status = ContentStatus.PUBLISHED
    tutorial.published_at = datetime.utcnow()
    
    await db.commit()
    return {"message": "Tutorial published successfully"}


@router.post("/tutorials/{tutorial_id}/unpublish")
async def unpublish_tutorial(
    tutorial_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Unpublish a tutorial (set to draft)."""
    result = await db.execute(select(Tutorial).where(Tutorial.id == tutorial_id))
    tutorial = result.scalar_one_or_none()
    
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    
    tutorial.status = ContentStatus.DRAFT
    
    await db.commit()
    return {"message": "Tutorial unpublished successfully"}


# ============================================
# SECTION MANAGEMENT
# ============================================

@router.get("/tutorials/{tutorial_id}/sections")
async def list_sections(
    tutorial_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """List all sections in a tutorial."""
    query = select(TutorialSection).where(
        TutorialSection.tutorial_id == tutorial_id
    ).order_by(TutorialSection.display_order)
    
    result = await db.execute(query)
    sections = result.scalars().all()
    
    sections_data = []
    for section in sections:
        # Get lesson count
        lesson_count = await db.execute(
            select(func.count(TutorialLesson.id)).where(TutorialLesson.section_id == section.id)
        )
        
        sections_data.append({
            "id": str(section.id),
            "title": section.title,
            "description": section.description,
            "display_order": section.display_order,
            "is_visible": section.is_visible,
            "is_free_preview": section.is_free_preview,
            "estimated_minutes": section.estimated_minutes,
            "total_lessons": lesson_count.scalar() or 0,
        })
    
    return sections_data


@router.post("/tutorials/{tutorial_id}/sections", status_code=status.HTTP_201_CREATED)
async def create_section(
    tutorial_id: str,
    title: str = Body(...),
    description: str = Body(None),
    display_order: int = Body(None),
    is_free_preview: bool = Body(False),
    estimated_minutes: int = Body(0),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Create a section in a tutorial."""
    # Verify tutorial exists
    tutorial_result = await db.execute(select(Tutorial).where(Tutorial.id == tutorial_id))
    tutorial = tutorial_result.scalar_one_or_none()
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    
    # Get max order if not provided
    if display_order is None:
        max_order_result = await db.execute(
            select(func.max(TutorialSection.display_order)).where(TutorialSection.tutorial_id == tutorial_id)
        )
        display_order = (max_order_result.scalar() or 0) + 1
    
    section = TutorialSection(
        tutorial_id=tutorial_id,
        title=title,
        description=description,
        display_order=display_order,
        is_free_preview=is_free_preview,
        estimated_minutes=estimated_minutes,
    )
    db.add(section)
    
    # Update tutorial stats
    tutorial.total_sections = (tutorial.total_sections or 0) + 1
    
    await db.commit()
    await db.refresh(section)
    
    return {
        "id": str(section.id),
        "title": section.title,
        "display_order": section.display_order,
        "message": "Section created successfully"
    }


@router.put("/sections/{section_id}")
async def update_section(
    section_id: str,
    title: str = Body(None),
    description: str = Body(None),
    display_order: int = Body(None),
    is_visible: bool = Body(None),
    is_free_preview: bool = Body(None),
    estimated_minutes: int = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Update a section."""
    result = await db.execute(select(TutorialSection).where(TutorialSection.id == section_id))
    section = result.scalar_one_or_none()
    
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    if title is not None:
        section.title = title
    if description is not None:
        section.description = description
    if display_order is not None:
        section.display_order = display_order
    if is_visible is not None:
        section.is_visible = is_visible
    if is_free_preview is not None:
        section.is_free_preview = is_free_preview
    if estimated_minutes is not None:
        section.estimated_minutes = estimated_minutes
    
    await db.commit()
    return {"message": "Section updated successfully", "id": str(section.id)}


@router.delete("/sections/{section_id}")
async def delete_section(
    section_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a section and all its lessons."""
    result = await db.execute(select(TutorialSection).where(TutorialSection.id == section_id))
    section = result.scalar_one_or_none()
    
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Delete all lessons and content blocks
    lessons = await db.execute(select(TutorialLesson).where(TutorialLesson.section_id == section_id))
    for lesson in lessons.scalars().all():
        await db.execute(delete(ContentBlock).where(ContentBlock.lesson_id == lesson.id))
    await db.execute(delete(TutorialLesson).where(TutorialLesson.section_id == section_id))
    
    # Update tutorial stats
    tutorial_result = await db.execute(select(Tutorial).where(Tutorial.id == section.tutorial_id))
    tutorial = tutorial_result.scalar_one()
    tutorial.total_sections = max(0, (tutorial.total_sections or 1) - 1)
    
    await db.delete(section)
    await db.commit()
    
    return {"message": "Section deleted successfully"}


@router.put("/tutorials/{tutorial_id}/sections/reorder")
async def reorder_sections(
    tutorial_id: str,
    order: List[dict] = Body(...),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Reorder sections within a tutorial."""
    for item in order:
        await db.execute(
            update(TutorialSection)
            .where(TutorialSection.id == item["id"])
            .values(display_order=item["order"])
        )
    await db.commit()
    return {"message": "Sections reordered successfully"}


# ============================================
# LESSON MANAGEMENT
# ============================================

@router.get("/sections/{section_id}/lessons")
async def list_lessons(
    section_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """List all lessons in a section."""
    query = select(TutorialLesson).where(
        TutorialLesson.section_id == section_id
    ).order_by(TutorialLesson.display_order)
    
    result = await db.execute(query)
    lessons = result.scalars().all()
    
    return [
        {
            "id": str(l.id),
            "title": l.title,
            "slug": l.slug,
            "description": l.description,
            "lesson_type": l.lesson_type.value if l.lesson_type else "article",
            "estimated_minutes": l.estimated_minutes,
            "display_order": l.display_order,
            "is_visible": l.is_visible,
            "is_free_preview": l.is_free_preview,
            "has_quiz": l.has_quiz,
            "has_exercise": l.has_exercise,
            "has_try_it": l.has_try_it,
            "status": l.status.value if l.status else "draft",
        }
        for l in lessons
    ]


@router.post("/sections/{section_id}/lessons", status_code=status.HTTP_201_CREATED)
async def create_lesson(
    section_id: str,
    title: str = Body(...),
    lesson_type: str = Body("article"),
    description: str = Body(None),
    display_order: int = Body(None),
    estimated_minutes: int = Body(10),
    is_free_preview: bool = Body(False),
    has_quiz: bool = Body(False),
    has_exercise: bool = Body(False),
    has_try_it: bool = Body(True),
    completion_rule: str = Body("view"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Create a lesson in a section."""
    # Verify section exists
    section_result = await db.execute(select(TutorialSection).where(TutorialSection.id == section_id))
    section = section_result.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    # Get max order if not provided
    if display_order is None:
        max_order_result = await db.execute(
            select(func.max(TutorialLesson.display_order)).where(TutorialLesson.section_id == section_id)
        )
        display_order = (max_order_result.scalar() or 0) + 1
    
    slug = slugify(title)
    
    lesson = TutorialLesson(
        section_id=section_id,
        title=title,
        slug=slug,
        lesson_type=lesson_type,
        description=description,
        display_order=display_order,
        estimated_minutes=estimated_minutes,
        is_free_preview=is_free_preview,
        has_quiz=has_quiz,
        has_exercise=has_exercise,
        has_try_it=has_try_it,
        completion_rule=completion_rule,
        status=ContentStatus.DRAFT,
    )
    db.add(lesson)
    
    # Update section stats
    section.total_lessons = (section.total_lessons or 0) + 1
    
    # Update tutorial stats
    tutorial_result = await db.execute(select(Tutorial).where(Tutorial.id == section.tutorial_id))
    tutorial = tutorial_result.scalar_one()
    tutorial.total_lessons = (tutorial.total_lessons or 0) + 1
    
    await db.commit()
    await db.refresh(lesson)
    
    return {
        "id": str(lesson.id),
        "title": lesson.title,
        "slug": lesson.slug,
        "display_order": lesson.display_order,
        "message": "Lesson created successfully. Add content blocks next."
    }


@router.get("/lessons/{lesson_id}")
async def get_lesson(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Get full lesson details with content blocks."""
    result = await db.execute(select(TutorialLesson).where(TutorialLesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Get content blocks
    blocks_query = select(ContentBlock).where(
        ContentBlock.lesson_id == lesson_id
    ).order_by(ContentBlock.display_order)
    blocks_result = await db.execute(blocks_query)
    blocks = blocks_result.scalars().all()
    
    return {
        "id": str(lesson.id),
        "section_id": str(lesson.section_id),
        "title": lesson.title,
        "slug": lesson.slug,
        "description": lesson.description,
        "lesson_type": lesson.lesson_type.value if lesson.lesson_type else "article",
        "estimated_minutes": lesson.estimated_minutes,
        "display_order": lesson.display_order,
        "is_visible": lesson.is_visible,
        "is_free_preview": lesson.is_free_preview,
        "has_quiz": lesson.has_quiz,
        "has_exercise": lesson.has_exercise,
        "has_try_it": lesson.has_try_it,
        "completion_rule": lesson.completion_rule,
        "video_url": lesson.video_url,
        "status": lesson.status.value if lesson.status else "draft",
        "content_blocks": [
            {
                "id": str(b.id),
                "block_type": b.block_type.value,
                "display_order": b.display_order,
                "content": b.content,
                "is_visible": b.is_visible,
            }
            for b in blocks
        ]
    }


@router.put("/lessons/{lesson_id}")
async def update_lesson(
    lesson_id: str,
    title: str = Body(None),
    description: str = Body(None),
    lesson_type: str = Body(None),
    display_order: int = Body(None),
    estimated_minutes: int = Body(None),
    is_visible: bool = Body(None),
    is_free_preview: bool = Body(None),
    has_quiz: bool = Body(None),
    has_exercise: bool = Body(None),
    has_try_it: bool = Body(None),
    completion_rule: str = Body(None),
    video_url: str = Body(None),
    status: str = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Update a lesson."""
    result = await db.execute(select(TutorialLesson).where(TutorialLesson.id == lesson_id))
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
    if display_order is not None:
        lesson.display_order = display_order
    if estimated_minutes is not None:
        lesson.estimated_minutes = estimated_minutes
    if is_visible is not None:
        lesson.is_visible = is_visible
    if is_free_preview is not None:
        lesson.is_free_preview = is_free_preview
    if has_quiz is not None:
        lesson.has_quiz = has_quiz
    if has_exercise is not None:
        lesson.has_exercise = has_exercise
    if has_try_it is not None:
        lesson.has_try_it = has_try_it
    if completion_rule is not None:
        lesson.completion_rule = completion_rule
    if video_url is not None:
        lesson.video_url = video_url
    if status is not None:
        lesson.status = status
    
    await db.commit()
    return {"message": "Lesson updated successfully", "id": str(lesson.id)}


@router.delete("/lessons/{lesson_id}")
async def delete_lesson(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a lesson and all its content blocks."""
    result = await db.execute(select(TutorialLesson).where(TutorialLesson.id == lesson_id))
    lesson = result.scalar_one_or_none()
    
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Delete content blocks
    await db.execute(delete(ContentBlock).where(ContentBlock.lesson_id == lesson_id))
    
    # Update section and tutorial stats
    section_result = await db.execute(select(TutorialSection).where(TutorialSection.id == lesson.section_id))
    section = section_result.scalar_one()
    section.total_lessons = max(0, (section.total_lessons or 1) - 1)
    
    tutorial_result = await db.execute(select(Tutorial).where(Tutorial.id == section.tutorial_id))
    tutorial = tutorial_result.scalar_one()
    tutorial.total_lessons = max(0, (tutorial.total_lessons or 1) - 1)
    
    await db.delete(lesson)
    await db.commit()
    
    return {"message": "Lesson deleted successfully"}


@router.put("/sections/{section_id}/lessons/reorder")
async def reorder_lessons(
    section_id: str,
    order: List[dict] = Body(...),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Reorder lessons within a section."""
    for item in order:
        await db.execute(
            update(TutorialLesson)
            .where(TutorialLesson.id == item["id"])
            .values(display_order=item["order"])
        )
    await db.commit()
    return {"message": "Lessons reordered successfully"}


# ============================================
# CONTENT BLOCK MANAGEMENT
# ============================================

@router.get("/lessons/{lesson_id}/blocks")
async def list_content_blocks(
    lesson_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """List all content blocks in a lesson."""
    query = select(ContentBlock).where(
        ContentBlock.lesson_id == lesson_id
    ).order_by(ContentBlock.display_order)
    
    result = await db.execute(query)
    blocks = result.scalars().all()
    
    return [
        {
            "id": str(b.id),
            "block_type": b.block_type.value,
            "display_order": b.display_order,
            "content": b.content,
            "is_visible": b.is_visible,
        }
        for b in blocks
    ]


@router.post("/lessons/{lesson_id}/blocks", status_code=status.HTTP_201_CREATED)
async def create_content_block(
    lesson_id: str,
    block_type: str = Body(...),
    content: dict = Body({}),
    display_order: int = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Create a content block in a lesson."""
    # Verify lesson exists
    lesson_result = await db.execute(select(TutorialLesson).where(TutorialLesson.id == lesson_id))
    if not lesson_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Get max order if not provided
    if display_order is None:
        max_order_result = await db.execute(
            select(func.max(ContentBlock.display_order)).where(ContentBlock.lesson_id == lesson_id)
        )
        display_order = (max_order_result.scalar() or 0) + 1
    
    block = ContentBlock(
        lesson_id=lesson_id,
        block_type=block_type,
        content=content,
        display_order=display_order,
    )
    db.add(block)
    await db.commit()
    await db.refresh(block)
    
    return {
        "id": str(block.id),
        "block_type": block.block_type.value,
        "display_order": block.display_order,
        "message": "Content block created successfully"
    }


@router.put("/blocks/{block_id}")
async def update_content_block(
    block_id: str,
    block_type: str = Body(None),
    content: dict = Body(None),
    display_order: int = Body(None),
    is_visible: bool = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Update a content block."""
    result = await db.execute(select(ContentBlock).where(ContentBlock.id == block_id))
    block = result.scalar_one_or_none()
    
    if not block:
        raise HTTPException(status_code=404, detail="Content block not found")
    
    if block_type is not None:
        block.block_type = block_type
    if content is not None:
        block.content = content
    if display_order is not None:
        block.display_order = display_order
    if is_visible is not None:
        block.is_visible = is_visible
    
    await db.commit()
    return {"message": "Content block updated successfully", "id": str(block.id)}


@router.delete("/blocks/{block_id}")
async def delete_content_block(
    block_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a content block."""
    result = await db.execute(select(ContentBlock).where(ContentBlock.id == block_id))
    block = result.scalar_one_or_none()
    
    if not block:
        raise HTTPException(status_code=404, detail="Content block not found")
    
    await db.delete(block)
    await db.commit()
    
    return {"message": "Content block deleted successfully"}


@router.put("/lessons/{lesson_id}/blocks/reorder")
async def reorder_content_blocks(
    lesson_id: str,
    order: List[dict] = Body(...),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Reorder content blocks within a lesson."""
    for item in order:
        await db.execute(
            update(ContentBlock)
            .where(ContentBlock.id == item["id"])
            .values(display_order=item["order"])
        )
    await db.commit()
    return {"message": "Content blocks reordered successfully"}


# ============================================
# MEDIA LIBRARY
# ============================================

@router.get("/media")
async def list_media(
    db: AsyncSession = Depends(get_db),
    media_type: str = Query(None),
    folder: str = Query(None),
    search: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
) -> Any:
    """List media assets."""
    query = select(MediaAsset)
    
    if media_type:
        query = query.where(MediaAsset.media_type == media_type)
    if folder:
        query = query.where(MediaAsset.folder == folder)
    if search:
        query = query.where(MediaAsset.name.ilike(f"%{search}%"))
    
    query = query.order_by(MediaAsset.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    media = result.scalars().all()
    
    return [
        {
            "id": str(m.id),
            "name": m.name,
            "file_url": m.file_url,
            "media_type": m.media_type.value,
            "alt_text": m.alt_text,
            "folder": m.folder,
            "file_size_bytes": m.file_size_bytes,
            "width": m.width,
            "height": m.height,
            "tags": m.tags or [],
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in media
    ]


@router.post("/media", status_code=status.HTTP_201_CREATED)
async def create_media(
    name: str = Body(...),
    file_url: str = Body(...),
    media_type: str = Body(...),
    alt_text: str = Body(None),
    folder: str = Body("/"),
    tags: List[str] = Body([]),
    file_size_bytes: int = Body(None),
    width: int = Body(None),
    height: int = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Create a media asset."""
    media = MediaAsset(
        name=name,
        file_url=file_url,
        media_type=media_type,
        alt_text=alt_text,
        folder=folder,
        tags=tags,
        file_size_bytes=file_size_bytes,
        width=width,
        height=height,
        uploaded_by=None,  # TODO: Set from authenticated user
    )
    db.add(media)
    await db.commit()
    await db.refresh(media)
    
    return {
        "id": str(media.id),
        "name": media.name,
        "file_url": media.file_url,
        "message": "Media asset created successfully"
    }


@router.delete("/media/{media_id}")
async def delete_media(
    media_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a media asset."""
    result = await db.execute(select(MediaAsset).where(MediaAsset.id == media_id))
    media = result.scalar_one_or_none()
    
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    await db.delete(media)
    await db.commit()
    
    return {"message": "Media deleted successfully"}


# ============================================
# CODE SNIPPET LIBRARY
# ============================================

@router.get("/snippets")
async def list_snippets(
    db: AsyncSession = Depends(get_db),
    language: str = Query(None),
    search: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
) -> Any:
    """List code snippets."""
    query = select(CodeSnippet)
    
    if language:
        query = query.where(CodeSnippet.language == language)
    if search:
        query = query.where(
            (CodeSnippet.name.ilike(f"%{search}%")) |
            (CodeSnippet.description.ilike(f"%{search}%"))
        )
    
    query = query.order_by(CodeSnippet.created_at.desc())
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    snippets = result.scalars().all()
    
    return [
        {
            "id": str(s.id),
            "name": s.name,
            "language": s.language,
            "code": s.code,
            "description": s.description,
            "version": s.version,
            "tags": s.tags or [],
            "is_public": s.is_public,
            "created_at": s.created_at.isoformat() if s.created_at else None,
        }
        for s in snippets
    ]


@router.post("/snippets", status_code=status.HTTP_201_CREATED)
async def create_snippet(
    name: str = Body(...),
    language: str = Body(...),
    code: str = Body(...),
    description: str = Body(None),
    version: str = Body("1.0"),
    tags: List[str] = Body([]),
    is_public: bool = Body(True),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Create a code snippet."""
    snippet = CodeSnippet(
        name=name,
        language=language,
        code=code,
        description=description,
        version=version,
        tags=tags,
        is_public=is_public,
        created_by=None,  # TODO: Set from authenticated user
    )
    db.add(snippet)
    await db.commit()
    await db.refresh(snippet)
    
    return {
        "id": str(snippet.id),
        "name": snippet.name,
        "message": "Code snippet created successfully"
    }


@router.put("/snippets/{snippet_id}")
async def update_snippet(
    snippet_id: str,
    name: str = Body(None),
    language: str = Body(None),
    code: str = Body(None),
    description: str = Body(None),
    version: str = Body(None),
    tags: List[str] = Body(None),
    is_public: bool = Body(None),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Update a code snippet."""
    result = await db.execute(select(CodeSnippet).where(CodeSnippet.id == snippet_id))
    snippet = result.scalar_one_or_none()
    
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    
    if name is not None:
        snippet.name = name
    if language is not None:
        snippet.language = language
    if code is not None:
        snippet.code = code
    if description is not None:
        snippet.description = description
    if version is not None:
        snippet.version = version
    if tags is not None:
        snippet.tags = tags
    if is_public is not None:
        snippet.is_public = is_public
    
    await db.commit()
    return {"message": "Snippet updated successfully", "id": str(snippet.id)}


@router.delete("/snippets/{snippet_id}")
async def delete_snippet(
    snippet_id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete a code snippet."""
    result = await db.execute(select(CodeSnippet).where(CodeSnippet.id == snippet_id))
    snippet = result.scalar_one_or_none()
    
    if not snippet:
        raise HTTPException(status_code=404, detail="Snippet not found")
    
    await db.delete(snippet)
    await db.commit()
    
    return {"message": "Snippet deleted successfully"}

