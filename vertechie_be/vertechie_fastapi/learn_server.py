"""
Standalone Learn Admin API Server
This runs independently for the Learn Admin functionality
"""

import uuid
from datetime import datetime
from typing import Any, Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Query, Body, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey, Integer, Float, create_engine, select
from sqlalchemy.orm import Session, sessionmaker, relationship, declarative_base
from slugify import slugify
from pydantic import BaseModel

# ============================================
# DATABASE SETUP
# ============================================

DATABASE_URL = "sqlite:///./learn_admin.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ============================================
# MODELS
# ============================================

class TutorialCategory(Base):
    __tablename__ = "tutorial_category"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, index=True)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    display_order = Column(Integer, default=0)
    icon = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    parent_id = Column(String(36), nullable=True)
    color = Column(String(20), default="#0d47a1")
    thumbnail = Column(String(500), nullable=True)
    is_visible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Tutorial(Base):
    __tablename__ = "tutorial"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False, index=True)
    slug = Column(String(250), unique=True, index=True, nullable=False)
    short_description = Column(String(500), nullable=True)
    full_description = Column(Text, nullable=True)
    category_id = Column(String(36), ForeignKey("tutorial_category.id"), nullable=True)
    difficulty = Column(String(20), default="beginner")
    tags = Column(Text, nullable=True)
    thumbnail = Column(String(500), nullable=True)
    is_free = Column(Boolean, default=True)
    price = Column(Float, default=0.0)
    estimated_hours = Column(Float, default=0)
    total_sections = Column(Integer, default=0)
    total_lessons = Column(Integer, default=0)
    status = Column(String(20), default="draft")
    is_featured = Column(Boolean, default=False)
    published_at = Column(DateTime, nullable=True)
    meta_title = Column(String(60), nullable=True)
    meta_description = Column(String(160), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    category = relationship("TutorialCategory", backref="tutorials")
    sections = relationship("TutorialSection", back_populates="tutorial", order_by="TutorialSection.display_order")


class TutorialSection(Base):
    __tablename__ = "tutorial_section"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tutorial_id = Column(String(36), ForeignKey("tutorial.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
    is_free_preview = Column(Boolean, default=False)
    estimated_minutes = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tutorial = relationship("Tutorial", back_populates="sections")
    lessons = relationship("TutorialLesson", back_populates="section", order_by="TutorialLesson.display_order")


class TutorialLesson(Base):
    __tablename__ = "tutorial_lesson"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    section_id = Column(String(36), ForeignKey("tutorial_section.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(250), index=True)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)
    lesson_type = Column(String(20), default="article")
    estimated_minutes = Column(Integer, default=10)
    is_free_preview = Column(Boolean, default=False)
    is_required = Column(Boolean, default=True)
    is_published = Column(Boolean, default=True)
    has_quiz = Column(Boolean, default=False)
    has_exercise = Column(Boolean, default=False)
    has_try_it = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    section = relationship("TutorialSection", back_populates="lessons")
    content_blocks = relationship("ContentBlock", back_populates="lesson", order_by="ContentBlock.display_order")


class ContentBlock(Base):
    __tablename__ = "content_block"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lesson_id = Column(String(36), ForeignKey("tutorial_lesson.id"), nullable=False, index=True)
    block_type = Column(String(30), nullable=False)
    display_order = Column(Integer, default=0)
    content = Column(Text, nullable=True)
    settings = Column(Text, nullable=True)
    code_content = Column(Text, nullable=True)
    code_language = Column(String(50), nullable=True)
    default_code = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    result_type = Column(String(30), nullable=True)
    media_url = Column(String(500), nullable=True)
    alt_text = Column(String(200), nullable=True)
    caption = Column(String(500), nullable=True)
    header_level = Column(Integer, default=2)
    quiz_data = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    lesson = relationship("TutorialLesson", back_populates="content_blocks")


class MediaAsset(Base):
    __tablename__ = "media_asset"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=True)
    url = Column(String(500), nullable=False)
    media_type = Column(String(20), default="image")
    mime_type = Column(String(100), nullable=True)
    file_size = Column(Integer, default=0)
    folder = Column(String(200), nullable=True)
    alt_text = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    tags = Column(Text, nullable=True)
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


class CodeSnippet(Base):
    __tablename__ = "code_snippet"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    language = Column(String(50), nullable=False)
    code = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    tags = Column(Text, nullable=True)
    version = Column(String(20), default="1.0")
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)


# Create tables
Base.metadata.create_all(bind=engine)


# ============================================
# DATABASE DEPENDENCY
# ============================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================
# APP SETUP
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Learn Admin Server Starting...")
    Base.metadata.create_all(bind=engine)
    yield
    print("Learn Admin Server Stopping...")


app = FastAPI(
    title="VerTechie Learn Admin API",
    description="Course and Tutorial Management API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================
# CATEGORY ENDPOINTS
# ============================================

@app.get("/api/v1/admin/learn/categories")
def list_categories(
    include_hidden: bool = Query(False),
):
    """List all tutorial categories."""
    db = SessionLocal()
    try:
        query = db.query(TutorialCategory)
        if not include_hidden:
            query = query.filter(TutorialCategory.is_visible == True)
        query = query.order_by(TutorialCategory.display_order)
        categories = query.all()
        
        return [
            {
                "id": c.id,
                "name": c.name,
                "slug": c.slug,
                "description": c.description,
                "icon": c.icon,
                "color": c.color,
                "display_order": c.display_order,
                "parent_id": c.parent_id,
                "is_visible": c.is_visible,
                "thumbnail": c.thumbnail,
                "tutorial_count": len(c.tutorials) if c.tutorials else 0,
            }
            for c in categories
        ]
    finally:
        db.close()


@app.post("/api/v1/admin/learn/categories", status_code=201)
def create_category(
    name: str = Body(...),
    description: str = Body(None),
    icon: str = Body(None),
    color: str = Body("#0d47a1"),
    display_order: int = Body(0),
    parent_id: str = Body(None),
    thumbnail: str = Body(None),
):
    """Create a new tutorial category."""
    db = SessionLocal()
    try:
        slug = slugify(name)
        
        # Check if slug exists
        existing = db.query(TutorialCategory).filter(TutorialCategory.slug == slug).first()
        if existing:
            slug = f"{slug}-{str(uuid.uuid4())[:8]}"
        
        category = TutorialCategory(
            name=name,
            slug=slug,
            description=description,
            icon=icon,
            color=color,
            display_order=display_order,
            parent_id=parent_id,
            thumbnail=thumbnail,
        )
        db.add(category)
        db.commit()
        db.refresh(category)
        
        return {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
            "description": category.description,
            "icon": category.icon,
            "color": category.color,
            "display_order": category.display_order,
            "is_visible": category.is_visible,
        }
    finally:
        db.close()


@app.put("/api/v1/admin/learn/categories/{category_id}")
def update_category(
    category_id: str,
    name: str = Body(None),
    description: str = Body(None),
    icon: str = Body(None),
    color: str = Body(None),
    display_order: int = Body(None),
    is_visible: bool = Body(None),
    thumbnail: str = Body(None),
):
    """Update a tutorial category."""
    db = SessionLocal()
    try:
        category = db.query(TutorialCategory).filter(TutorialCategory.id == category_id).first()
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
        if thumbnail is not None:
            category.thumbnail = thumbnail
        
        db.commit()
        db.refresh(category)
        
        return {"message": "Category updated", "id": category.id}
    finally:
        db.close()


@app.delete("/api/v1/admin/learn/categories/{category_id}")
def delete_category(category_id: str):
    """Delete a tutorial category."""
    db = SessionLocal()
    try:
        category = db.query(TutorialCategory).filter(TutorialCategory.id == category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        db.delete(category)
        db.commit()
        
        return {"message": "Category deleted"}
    finally:
        db.close()


# ============================================
# TUTORIAL ENDPOINTS
# ============================================

@app.get("/api/v1/admin/learn/tutorials")
def list_tutorials(
    skip: int = Query(0),
    limit: int = Query(50),
    category_id: str = Query(None),
    status_filter: str = Query(None),
    search: str = Query(None),
):
    """List all tutorials."""
    db = SessionLocal()
    try:
        query = db.query(Tutorial)
        
        if category_id:
            query = query.filter(Tutorial.category_id == category_id)
        if status_filter:
            query = query.filter(Tutorial.status == status_filter)
        if search:
            query = query.filter(Tutorial.title.contains(search))
        
        query = query.order_by(Tutorial.created_at.desc())
        tutorials = query.offset(skip).limit(limit).all()
        
        return [
            {
                "id": t.id,
                "title": t.title,
                "slug": t.slug,
                "short_description": t.short_description,
                "category_id": t.category_id,
                "category_name": t.category.name if t.category else None,
                "difficulty": t.difficulty,
                "tags": t.tags,
                "thumbnail": t.thumbnail,
                "is_free": t.is_free,
                "price": t.price,
                "estimated_hours": t.estimated_hours,
                "total_sections": len(t.sections) if t.sections else 0,
                "total_lessons": sum(len(s.lessons) for s in t.sections) if t.sections else 0,
                "status": t.status,
                "is_featured": t.is_featured,
                "created_at": t.created_at.isoformat() if t.created_at else None,
            }
            for t in tutorials
        ]
    finally:
        db.close()


@app.post("/api/v1/admin/learn/tutorials", status_code=201)
def create_tutorial(
    title: str = Body(...),
    short_description: str = Body(None),
    full_description: str = Body(None),
    category_id: str = Body(None),
    difficulty: str = Body("beginner"),
    tags: str = Body(None),
    thumbnail: str = Body(None),
    is_free: bool = Body(True),
    price: float = Body(0.0),
    estimated_hours: float = Body(0),
    meta_title: str = Body(None),
    meta_description: str = Body(None),
):
    """Create a new tutorial."""
    db = SessionLocal()
    try:
        slug = slugify(title)
        
        # Check if slug exists
        existing = db.query(Tutorial).filter(Tutorial.slug == slug).first()
        if existing:
            slug = f"{slug}-{str(uuid.uuid4())[:8]}"
        
        tutorial = Tutorial(
            title=title,
            slug=slug,
            short_description=short_description,
            full_description=full_description,
            category_id=category_id,
            difficulty=difficulty,
            tags=tags,
            thumbnail=thumbnail,
            is_free=is_free,
            price=price,
            estimated_hours=estimated_hours,
            meta_title=meta_title,
            meta_description=meta_description,
        )
        db.add(tutorial)
        db.commit()
        db.refresh(tutorial)
        
        return {
            "id": tutorial.id,
            "title": tutorial.title,
            "slug": tutorial.slug,
            "status": tutorial.status,
        }
    finally:
        db.close()


@app.get("/api/v1/admin/learn/tutorials/{tutorial_id}")
def get_tutorial(tutorial_id: str):
    """Get tutorial with full details including sections and lessons."""
    db = SessionLocal()
    try:
        tutorial = db.query(Tutorial).filter(Tutorial.id == tutorial_id).first()
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        
        return {
            "id": tutorial.id,
            "title": tutorial.title,
            "slug": tutorial.slug,
            "short_description": tutorial.short_description,
            "full_description": tutorial.full_description,
            "category_id": tutorial.category_id,
            "category_name": tutorial.category.name if tutorial.category else None,
            "difficulty": tutorial.difficulty,
            "tags": tutorial.tags,
            "thumbnail": tutorial.thumbnail,
            "is_free": tutorial.is_free,
            "price": tutorial.price,
            "estimated_hours": tutorial.estimated_hours,
            "status": tutorial.status,
            "is_featured": tutorial.is_featured,
            "meta_title": tutorial.meta_title,
            "meta_description": tutorial.meta_description,
            "sections": [
                {
                    "id": s.id,
                    "title": s.title,
                    "description": s.description,
                    "display_order": s.display_order,
                    "is_free_preview": s.is_free_preview,
                    "estimated_minutes": s.estimated_minutes,
                    "lesson_count": len(s.lessons) if s.lessons else 0,
                    "lessons": [
                        {
                            "id": l.id,
                            "title": l.title,
                            "slug": l.slug,
                            "lesson_type": l.lesson_type,
                            "display_order": l.display_order,
                            "estimated_minutes": l.estimated_minutes,
                            "is_free_preview": l.is_free_preview,
                            "has_quiz": l.has_quiz,
                            "has_exercise": l.has_exercise,
                            "has_try_it": l.has_try_it,
                            "block_count": len(l.content_blocks) if l.content_blocks else 0,
                        }
                        for l in sorted(s.lessons, key=lambda x: x.display_order)
                    ]
                }
                for s in sorted(tutorial.sections, key=lambda x: x.display_order)
            ]
        }
    finally:
        db.close()


@app.put("/api/v1/admin/learn/tutorials/{tutorial_id}")
def update_tutorial(
    tutorial_id: str,
    title: str = Body(None),
    short_description: str = Body(None),
    full_description: str = Body(None),
    category_id: str = Body(None),
    difficulty: str = Body(None),
    tags: str = Body(None),
    thumbnail: str = Body(None),
    is_free: bool = Body(None),
    price: float = Body(None),
    estimated_hours: float = Body(None),
    status: str = Body(None),
    is_featured: bool = Body(None),
):
    """Update a tutorial."""
    db = SessionLocal()
    try:
        tutorial = db.query(Tutorial).filter(Tutorial.id == tutorial_id).first()
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        
        if title is not None:
            tutorial.title = title
            tutorial.slug = slugify(title)
        if short_description is not None:
            tutorial.short_description = short_description
        if full_description is not None:
            tutorial.full_description = full_description
        if category_id is not None:
            tutorial.category_id = category_id
        if difficulty is not None:
            tutorial.difficulty = difficulty
        if tags is not None:
            tutorial.tags = tags
        if thumbnail is not None:
            tutorial.thumbnail = thumbnail
        if is_free is not None:
            tutorial.is_free = is_free
        if price is not None:
            tutorial.price = price
        if estimated_hours is not None:
            tutorial.estimated_hours = estimated_hours
        if status is not None:
            tutorial.status = status
            if status == "published":
                tutorial.published_at = datetime.utcnow()
        if is_featured is not None:
            tutorial.is_featured = is_featured
        
        db.commit()
        
        return {"message": "Tutorial updated", "id": tutorial.id}
    finally:
        db.close()


@app.delete("/api/v1/admin/learn/tutorials/{tutorial_id}")
def delete_tutorial(tutorial_id: str):
    """Delete a tutorial and all its content."""
    db = SessionLocal()
    try:
        tutorial = db.query(Tutorial).filter(Tutorial.id == tutorial_id).first()
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        
        db.delete(tutorial)
        db.commit()
        
        return {"message": "Tutorial deleted"}
    finally:
        db.close()


# ============================================
# SECTION ENDPOINTS
# ============================================

@app.get("/api/v1/admin/learn/tutorials/{tutorial_id}/sections")
def list_sections(tutorial_id: str):
    """List sections for a tutorial."""
    db = SessionLocal()
    try:
        sections = db.query(TutorialSection).filter(
            TutorialSection.tutorial_id == tutorial_id
        ).order_by(TutorialSection.display_order).all()
        
        return [
            {
                "id": s.id,
                "tutorial_id": s.tutorial_id,
                "title": s.title,
                "description": s.description,
                "display_order": s.display_order,
                "is_free_preview": s.is_free_preview,
                "estimated_minutes": s.estimated_minutes,
                "is_published": s.is_published,
                "lesson_count": len(s.lessons) if s.lessons else 0,
            }
            for s in sections
        ]
    finally:
        db.close()


@app.post("/api/v1/admin/learn/tutorials/{tutorial_id}/sections", status_code=201)
def create_section(
    tutorial_id: str,
    title: str = Body(...),
    description: str = Body(None),
    display_order: int = Body(0),
    is_free_preview: bool = Body(False),
    estimated_minutes: int = Body(0),
):
    """Create a new section in a tutorial."""
    db = SessionLocal()
    try:
        tutorial = db.query(Tutorial).filter(Tutorial.id == tutorial_id).first()
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        
        section = TutorialSection(
            tutorial_id=tutorial_id,
            title=title,
            description=description,
            display_order=display_order,
            is_free_preview=is_free_preview,
            estimated_minutes=estimated_minutes,
        )
        db.add(section)
        db.commit()
        db.refresh(section)
        
        return {
            "id": section.id,
            "title": section.title,
            "display_order": section.display_order,
        }
    finally:
        db.close()


@app.put("/api/v1/admin/learn/sections/{section_id}")
def update_section(
    section_id: str,
    title: str = Body(None),
    description: str = Body(None),
    display_order: int = Body(None),
    is_free_preview: bool = Body(None),
    estimated_minutes: int = Body(None),
    is_published: bool = Body(None),
):
    """Update a section."""
    db = SessionLocal()
    try:
        section = db.query(TutorialSection).filter(TutorialSection.id == section_id).first()
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        
        if title is not None:
            section.title = title
        if description is not None:
            section.description = description
        if display_order is not None:
            section.display_order = display_order
        if is_free_preview is not None:
            section.is_free_preview = is_free_preview
        if estimated_minutes is not None:
            section.estimated_minutes = estimated_minutes
        if is_published is not None:
            section.is_published = is_published
        
        db.commit()
        
        return {"message": "Section updated", "id": section.id}
    finally:
        db.close()


@app.delete("/api/v1/admin/learn/sections/{section_id}")
def delete_section(section_id: str):
    """Delete a section and all its lessons."""
    db = SessionLocal()
    try:
        section = db.query(TutorialSection).filter(TutorialSection.id == section_id).first()
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        
        db.delete(section)
        db.commit()
        
        return {"message": "Section deleted"}
    finally:
        db.close()


# ============================================
# LESSON ENDPOINTS
# ============================================

@app.get("/api/v1/admin/learn/sections/{section_id}/lessons")
def list_lessons(section_id: str):
    """List lessons for a section."""
    db = SessionLocal()
    try:
        lessons = db.query(TutorialLesson).filter(
            TutorialLesson.section_id == section_id
        ).order_by(TutorialLesson.display_order).all()
        
        return [
            {
                "id": l.id,
                "section_id": l.section_id,
                "title": l.title,
                "slug": l.slug,
                "description": l.description,
                "display_order": l.display_order,
                "lesson_type": l.lesson_type,
                "estimated_minutes": l.estimated_minutes,
                "is_free_preview": l.is_free_preview,
                "is_required": l.is_required,
                "is_published": l.is_published,
                "has_quiz": l.has_quiz,
                "has_exercise": l.has_exercise,
                "has_try_it": l.has_try_it,
                "block_count": len(l.content_blocks) if l.content_blocks else 0,
            }
            for l in lessons
        ]
    finally:
        db.close()


@app.post("/api/v1/admin/learn/sections/{section_id}/lessons", status_code=201)
def create_lesson(
    section_id: str,
    title: str = Body(...),
    description: str = Body(None),
    display_order: int = Body(0),
    lesson_type: str = Body("article"),
    estimated_minutes: int = Body(10),
    is_free_preview: bool = Body(False),
    is_required: bool = Body(True),
    has_quiz: bool = Body(False),
    has_exercise: bool = Body(False),
    has_try_it: bool = Body(False),
):
    """Create a new lesson in a section."""
    db = SessionLocal()
    try:
        section = db.query(TutorialSection).filter(TutorialSection.id == section_id).first()
        if not section:
            raise HTTPException(status_code=404, detail="Section not found")
        
        lesson = TutorialLesson(
            section_id=section_id,
            title=title,
            slug=slugify(title),
            description=description,
            display_order=display_order,
            lesson_type=lesson_type,
            estimated_minutes=estimated_minutes,
            is_free_preview=is_free_preview,
            is_required=is_required,
            has_quiz=has_quiz,
            has_exercise=has_exercise,
            has_try_it=has_try_it,
        )
        db.add(lesson)
        db.commit()
        db.refresh(lesson)
        
        return {
            "id": lesson.id,
            "title": lesson.title,
            "slug": lesson.slug,
            "display_order": lesson.display_order,
        }
    finally:
        db.close()


@app.get("/api/v1/admin/learn/lessons/{lesson_id}")
def get_lesson(lesson_id: str):
    """Get lesson with all content blocks."""
    db = SessionLocal()
    try:
        lesson = db.query(TutorialLesson).filter(TutorialLesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        return {
            "id": lesson.id,
            "section_id": lesson.section_id,
            "title": lesson.title,
            "slug": lesson.slug,
            "description": lesson.description,
            "display_order": lesson.display_order,
            "lesson_type": lesson.lesson_type,
            "estimated_minutes": lesson.estimated_minutes,
            "is_free_preview": lesson.is_free_preview,
            "is_required": lesson.is_required,
            "is_published": lesson.is_published,
            "has_quiz": lesson.has_quiz,
            "has_exercise": lesson.has_exercise,
            "has_try_it": lesson.has_try_it,
            "content_blocks": [
                {
                    "id": b.id,
                    "block_type": b.block_type,
                    "display_order": b.display_order,
                    "content": b.content,
                    "settings": b.settings,
                    "code_content": b.code_content,
                    "code_language": b.code_language,
                    "default_code": b.default_code,
                    "expected_output": b.expected_output,
                    "result_type": b.result_type,
                    "media_url": b.media_url,
                    "alt_text": b.alt_text,
                    "caption": b.caption,
                    "header_level": b.header_level,
                    "quiz_data": b.quiz_data,
                }
                for b in sorted(lesson.content_blocks, key=lambda x: x.display_order)
            ]
        }
    finally:
        db.close()


@app.put("/api/v1/admin/learn/lessons/{lesson_id}")
def update_lesson(
    lesson_id: str,
    title: str = Body(None),
    description: str = Body(None),
    display_order: int = Body(None),
    lesson_type: str = Body(None),
    estimated_minutes: int = Body(None),
    is_free_preview: bool = Body(None),
    is_required: bool = Body(None),
    is_published: bool = Body(None),
    has_quiz: bool = Body(None),
    has_exercise: bool = Body(None),
    has_try_it: bool = Body(None),
):
    """Update a lesson."""
    db = SessionLocal()
    try:
        lesson = db.query(TutorialLesson).filter(TutorialLesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        if title is not None:
            lesson.title = title
            lesson.slug = slugify(title)
        if description is not None:
            lesson.description = description
        if display_order is not None:
            lesson.display_order = display_order
        if lesson_type is not None:
            lesson.lesson_type = lesson_type
        if estimated_minutes is not None:
            lesson.estimated_minutes = estimated_minutes
        if is_free_preview is not None:
            lesson.is_free_preview = is_free_preview
        if is_required is not None:
            lesson.is_required = is_required
        if is_published is not None:
            lesson.is_published = is_published
        if has_quiz is not None:
            lesson.has_quiz = has_quiz
        if has_exercise is not None:
            lesson.has_exercise = has_exercise
        if has_try_it is not None:
            lesson.has_try_it = has_try_it
        
        db.commit()
        
        return {"message": "Lesson updated", "id": lesson.id}
    finally:
        db.close()


@app.delete("/api/v1/admin/learn/lessons/{lesson_id}")
def delete_lesson(lesson_id: str):
    """Delete a lesson and all its content blocks."""
    db = SessionLocal()
    try:
        lesson = db.query(TutorialLesson).filter(TutorialLesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        db.delete(lesson)
        db.commit()
        
        return {"message": "Lesson deleted"}
    finally:
        db.close()


# ============================================
# CONTENT BLOCK ENDPOINTS
# ============================================

@app.post("/api/v1/admin/learn/lessons/{lesson_id}/blocks", status_code=201)
def create_content_block(
    lesson_id: str,
    block_type: str = Body(...),
    display_order: int = Body(0),
    content: str = Body(None),
    settings: str = Body(None),
    code_content: str = Body(None),
    code_language: str = Body(None),
    default_code: str = Body(None),
    expected_output: str = Body(None),
    result_type: str = Body(None),
    media_url: str = Body(None),
    alt_text: str = Body(None),
    caption: str = Body(None),
    header_level: int = Body(2),
    quiz_data: str = Body(None),
):
    """Create a new content block in a lesson."""
    db = SessionLocal()
    try:
        lesson = db.query(TutorialLesson).filter(TutorialLesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        
        block = ContentBlock(
            lesson_id=lesson_id,
            block_type=block_type,
            display_order=display_order,
            content=content,
            settings=settings,
            code_content=code_content,
            code_language=code_language,
            default_code=default_code,
            expected_output=expected_output,
            result_type=result_type,
            media_url=media_url,
            alt_text=alt_text,
            caption=caption,
            header_level=header_level,
            quiz_data=quiz_data,
        )
        db.add(block)
        db.commit()
        db.refresh(block)
        
        return {
            "id": block.id,
            "block_type": block.block_type,
            "display_order": block.display_order,
        }
    finally:
        db.close()


@app.put("/api/v1/admin/learn/blocks/{block_id}")
def update_content_block(
    block_id: str,
    display_order: int = Body(None),
    content: str = Body(None),
    settings: str = Body(None),
    code_content: str = Body(None),
    code_language: str = Body(None),
    default_code: str = Body(None),
    expected_output: str = Body(None),
    result_type: str = Body(None),
    media_url: str = Body(None),
    alt_text: str = Body(None),
    caption: str = Body(None),
    header_level: int = Body(None),
    quiz_data: str = Body(None),
):
    """Update a content block."""
    db = SessionLocal()
    try:
        block = db.query(ContentBlock).filter(ContentBlock.id == block_id).first()
        if not block:
            raise HTTPException(status_code=404, detail="Block not found")
        
        if display_order is not None:
            block.display_order = display_order
        if content is not None:
            block.content = content
        if settings is not None:
            block.settings = settings
        if code_content is not None:
            block.code_content = code_content
        if code_language is not None:
            block.code_language = code_language
        if default_code is not None:
            block.default_code = default_code
        if expected_output is not None:
            block.expected_output = expected_output
        if result_type is not None:
            block.result_type = result_type
        if media_url is not None:
            block.media_url = media_url
        if alt_text is not None:
            block.alt_text = alt_text
        if caption is not None:
            block.caption = caption
        if header_level is not None:
            block.header_level = header_level
        if quiz_data is not None:
            block.quiz_data = quiz_data
        
        db.commit()
        
        return {"message": "Block updated", "id": block.id}
    finally:
        db.close()


@app.delete("/api/v1/admin/learn/blocks/{block_id}")
def delete_content_block(block_id: str):
    """Delete a content block."""
    db = SessionLocal()
    try:
        block = db.query(ContentBlock).filter(ContentBlock.id == block_id).first()
        if not block:
            raise HTTPException(status_code=404, detail="Block not found")
        
        db.delete(block)
        db.commit()
        
        return {"message": "Block deleted"}
    finally:
        db.close()


# ============================================
# MEDIA LIBRARY ENDPOINTS
# ============================================

@app.get("/api/v1/admin/learn/media")
def list_media(
    media_type: str = Query(None),
    folder: str = Query(None),
    search: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
):
    """List media assets."""
    db = SessionLocal()
    try:
        query = db.query(MediaAsset)
        
        if media_type:
            query = query.filter(MediaAsset.media_type == media_type)
        if folder:
            query = query.filter(MediaAsset.folder == folder)
        if search:
            query = query.filter(MediaAsset.filename.contains(search))
        
        query = query.order_by(MediaAsset.created_at.desc())
        assets = query.offset(skip).limit(limit).all()
        
        return [
            {
                "id": a.id,
                "filename": a.filename,
                "original_filename": a.original_filename,
                "url": a.url,
                "media_type": a.media_type,
                "mime_type": a.mime_type,
                "file_size": a.file_size,
                "folder": a.folder,
                "alt_text": a.alt_text,
                "usage_count": a.usage_count,
            }
            for a in assets
        ]
    finally:
        db.close()


@app.post("/api/v1/admin/learn/media", status_code=201)
def create_media(
    filename: str = Body(...),
    url: str = Body(...),
    original_filename: str = Body(None),
    media_type: str = Body("image"),
    mime_type: str = Body(None),
    file_size: int = Body(0),
    folder: str = Body(None),
    alt_text: str = Body(None),
    description: str = Body(None),
    tags: str = Body(None),
):
    """Create a media asset record."""
    db = SessionLocal()
    try:
        asset = MediaAsset(
            filename=filename,
            original_filename=original_filename or filename,
            url=url,
            media_type=media_type,
            mime_type=mime_type,
            file_size=file_size,
            folder=folder,
            alt_text=alt_text,
            description=description,
            tags=tags,
        )
        db.add(asset)
        db.commit()
        db.refresh(asset)
        
        return {"id": asset.id, "filename": asset.filename, "url": asset.url}
    finally:
        db.close()


# ============================================
# CODE SNIPPET ENDPOINTS
# ============================================

@app.get("/api/v1/admin/learn/snippets")
def list_snippets(
    language: str = Query(None),
    search: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(50),
):
    """List code snippets."""
    db = SessionLocal()
    try:
        query = db.query(CodeSnippet)
        
        if language:
            query = query.filter(CodeSnippet.language == language)
        if search:
            query = query.filter(CodeSnippet.name.contains(search))
        
        query = query.order_by(CodeSnippet.created_at.desc())
        snippets = query.offset(skip).limit(limit).all()
        
        return [
            {
                "id": s.id,
                "name": s.name,
                "description": s.description,
                "language": s.language,
                "code": s.code,
                "category": s.category,
                "version": s.version,
                "usage_count": s.usage_count,
            }
            for s in snippets
        ]
    finally:
        db.close()


@app.post("/api/v1/admin/learn/snippets", status_code=201)
def create_snippet(
    name: str = Body(...),
    language: str = Body(...),
    code: str = Body(...),
    description: str = Body(None),
    category: str = Body(None),
    tags: str = Body(None),
):
    """Create a code snippet."""
    db = SessionLocal()
    try:
        snippet = CodeSnippet(
            name=name,
            description=description,
            language=language,
            code=code,
            category=category,
            tags=tags,
        )
        db.add(snippet)
        db.commit()
        db.refresh(snippet)
        
        return {"id": snippet.id, "name": snippet.name, "language": snippet.language}
    finally:
        db.close()


# ============================================
# STATS ENDPOINT
# ============================================

@app.get("/api/v1/admin/learn/stats")
def get_stats():
    """Get overall statistics."""
    db = SessionLocal()
    try:
        category_count = db.query(TutorialCategory).count()
        tutorial_count = db.query(Tutorial).count()
        section_count = db.query(TutorialSection).count()
        lesson_count = db.query(TutorialLesson).count()
        block_count = db.query(ContentBlock).count()
        
        return {
            "categories": category_count,
            "tutorials": tutorial_count,
            "sections": section_count,
            "lessons": lesson_count,
            "content_blocks": block_count,
        }
    finally:
        db.close()


# ============================================
# RUN SERVER
# ============================================

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🎓 VerTechie Learn Admin Server")
    print("="*60)
    print(f"Running on http://localhost:8001")
    print("API Docs: http://localhost:8001/docs")
    print("="*60 + "\n")
    uvicorn.run("learn_server:app", host="0.0.0.0", port=8001, reload=True)

