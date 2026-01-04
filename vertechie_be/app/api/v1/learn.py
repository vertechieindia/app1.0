"""
Learn/Tutorial API routes - W3Schools-style learning platform.
Provides comprehensive curriculum data for frontend.
"""

from typing import Any, List, Optional, Dict
from datetime import datetime
from enum import Enum

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db import get_db
from app.models.user import User
from app.api.v1.auth import get_current_user

router = APIRouter()


# ============================================
# Static Tutorial Data (Would be DB-backed in production)
# ============================================

class DifficultyLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


# Comprehensive curriculum data
TUTORIALS_DATA = {
    "html": {
        "id": "html",
        "slug": "html",
        "title": "HTML Tutorial",
        "short_title": "HTML",
        "description": "Learn HTML, the standard markup language for creating web pages.",
        "icon": "🌐",
        "color": "#E44D26",
        "bg_color": "#FFF4F2",
        "difficulty": "beginner",
        "category": "web",
        "tags": ["HTML", "Web Development", "Frontend"],
        "total_lessons": 85,
        "total_hours": "12",
        "learners": 2500000,
        "rating": 4.9,
        "is_certified": True,
        "is_free": True,
        "chapters": [
            {
                "id": "html-intro",
                "title": "HTML Introduction",
                "description": "Get started with HTML basics",
                "lessons": [
                    {"id": "html-home", "title": "HTML HOME", "slug": "home", "duration": "5 min", "has_quiz": False, "has_exercise": False, "has_try_it": True},
                    {"id": "html-intro", "title": "HTML Introduction", "slug": "intro", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-editors", "title": "HTML Editors", "slug": "editors", "duration": "8 min", "has_quiz": False, "has_exercise": False, "has_try_it": True},
                    {"id": "html-basic", "title": "HTML Basic Examples", "slug": "basic", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-elements", "title": "HTML Elements", "slug": "elements", "duration": "12 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-attributes", "title": "HTML Attributes", "slug": "attributes", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "html-text",
                "title": "HTML Text Formatting",
                "description": "Format text in HTML",
                "lessons": [
                    {"id": "html-headings", "title": "HTML Headings", "slug": "headings", "duration": "8 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-paragraphs", "title": "HTML Paragraphs", "slug": "paragraphs", "duration": "8 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-styles", "title": "HTML Styles", "slug": "styles", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-formatting", "title": "HTML Formatting", "slug": "formatting", "duration": "12 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "html-links-images",
                "title": "HTML Links & Images",
                "description": "Add links and images to your pages",
                "lessons": [
                    {"id": "html-links", "title": "HTML Links", "slug": "links", "duration": "12 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-images", "title": "HTML Images", "slug": "images", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-tables", "title": "HTML Tables", "slug": "tables", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-lists", "title": "HTML Lists", "slug": "lists", "duration": "12 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "html-forms",
                "title": "HTML Forms",
                "description": "Create interactive forms",
                "lessons": [
                    {"id": "html-forms-intro", "title": "HTML Forms", "slug": "forms", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-form-elements", "title": "HTML Form Elements", "slug": "form-elements", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-input-types", "title": "HTML Input Types", "slug": "input-types", "duration": "25 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "html-semantic",
                "title": "HTML Semantic Elements",
                "description": "Modern semantic HTML5",
                "lessons": [
                    {"id": "html-semantic-intro", "title": "HTML Semantics", "slug": "semantics", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-layout", "title": "HTML Layout", "slug": "layout", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "html-responsive", "title": "HTML Responsive", "slug": "responsive", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
        ]
    },
    "css": {
        "id": "css",
        "slug": "css",
        "title": "CSS Tutorial",
        "short_title": "CSS",
        "description": "Learn CSS to style and layout web pages.",
        "icon": "🎨",
        "color": "#264DE4",
        "bg_color": "#F0F4FF",
        "difficulty": "beginner",
        "category": "web",
        "tags": ["CSS", "Web Development", "Frontend", "Styling"],
        "prerequisites": ["html"],
        "total_lessons": 120,
        "total_hours": "18",
        "learners": 2200000,
        "rating": 4.9,
        "is_certified": True,
        "is_free": True,
        "chapters": [
            {
                "id": "css-intro",
                "title": "CSS Introduction",
                "description": "Get started with CSS",
                "lessons": [
                    {"id": "css-home", "title": "CSS HOME", "slug": "home", "duration": "5 min", "has_quiz": False, "has_exercise": False, "has_try_it": True},
                    {"id": "css-intro", "title": "CSS Introduction", "slug": "intro", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "css-syntax", "title": "CSS Syntax", "slug": "syntax", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "css-selectors", "title": "CSS Selectors", "slug": "selectors", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "css-layout",
                "title": "CSS Layout",
                "description": "Page layout techniques",
                "lessons": [
                    {"id": "css-display", "title": "CSS Display", "slug": "display", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "css-position", "title": "CSS Position", "slug": "position", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "css-flexbox", "title": "CSS Flexbox", "slug": "flexbox", "duration": "30 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "css-grid", "title": "CSS Grid", "slug": "grid", "duration": "35 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
        ]
    },
    "javascript": {
        "id": "javascript",
        "slug": "javascript",
        "title": "JavaScript Tutorial",
        "short_title": "JavaScript",
        "description": "Learn JavaScript, the programming language of the web.",
        "icon": "⚡",
        "color": "#F7DF1E",
        "bg_color": "#FFFEF0",
        "difficulty": "beginner",
        "category": "web",
        "tags": ["JavaScript", "Web Development", "Frontend", "Programming"],
        "prerequisites": ["html", "css"],
        "total_lessons": 150,
        "total_hours": "25",
        "learners": 3100000,
        "rating": 4.9,
        "is_certified": True,
        "is_free": True,
        "chapters": [
            {
                "id": "js-intro",
                "title": "JavaScript Introduction",
                "description": "Get started with JavaScript",
                "lessons": [
                    {"id": "js-home", "title": "JS HOME", "slug": "home", "duration": "5 min", "has_quiz": False, "has_exercise": False, "has_try_it": True},
                    {"id": "js-intro", "title": "JS Introduction", "slug": "intro", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "js-where-to", "title": "JS Where To", "slug": "whereto", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "js-output", "title": "JS Output", "slug": "output", "duration": "12 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "js-variables",
                "title": "JS Variables & Data Types",
                "description": "Variables and data types in JS",
                "lessons": [
                    {"id": "js-variables", "title": "JS Variables", "slug": "variables", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "js-let", "title": "JS Let", "slug": "let", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "js-const", "title": "JS Const", "slug": "const", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "js-operators", "title": "JS Operators", "slug": "operators", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "js-functions",
                "title": "JS Functions",
                "description": "Creating and using functions",
                "lessons": [
                    {"id": "js-functions", "title": "JS Functions", "slug": "functions", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "js-arrow", "title": "JS Arrow Functions", "slug": "arrow", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "js-scope", "title": "JS Scope", "slug": "scope", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
        ]
    },
    "python": {
        "id": "python",
        "slug": "python",
        "title": "Python Tutorial",
        "short_title": "Python",
        "description": "Learn Python, a powerful and versatile programming language.",
        "icon": "🐍",
        "color": "#3776AB",
        "bg_color": "#F0F6FF",
        "difficulty": "beginner",
        "category": "programming",
        "tags": ["Python", "Programming", "Backend", "Data Science"],
        "total_lessons": 140,
        "total_hours": "22",
        "learners": 2800000,
        "rating": 4.9,
        "is_certified": True,
        "is_free": True,
        "chapters": [
            {
                "id": "py-intro",
                "title": "Python Introduction",
                "description": "Get started with Python",
                "lessons": [
                    {"id": "py-home", "title": "Python HOME", "slug": "home", "duration": "5 min", "has_quiz": False, "has_exercise": False, "has_try_it": True},
                    {"id": "py-intro", "title": "Python Intro", "slug": "intro", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "py-syntax", "title": "Python Syntax", "slug": "syntax", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "py-variables", "title": "Python Variables", "slug": "variables", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "py-datatypes",
                "title": "Python Data Types",
                "description": "Working with data types",
                "lessons": [
                    {"id": "py-datatypes", "title": "Python Data Types", "slug": "datatypes", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "py-strings", "title": "Python Strings", "slug": "strings", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "py-lists", "title": "Python Lists", "slug": "lists", "duration": "25 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "py-dictionaries", "title": "Python Dictionaries", "slug": "dictionaries", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "py-functions",
                "title": "Python Functions",
                "description": "Defining and using functions",
                "lessons": [
                    {"id": "py-functions", "title": "Python Functions", "slug": "functions", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "py-lambda", "title": "Python Lambda", "slug": "lambda", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "py-classes", "title": "Python Classes", "slug": "classes", "duration": "25 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
        ]
    },
    "react": {
        "id": "react",
        "slug": "react",
        "title": "React Tutorial",
        "short_title": "React",
        "description": "Learn React, the popular JavaScript library for building UIs.",
        "icon": "⚛️",
        "color": "#61DAFB",
        "bg_color": "#F0FCFF",
        "difficulty": "intermediate",
        "category": "web",
        "tags": ["React", "JavaScript", "Frontend", "Web Development"],
        "prerequisites": ["javascript", "html", "css"],
        "total_lessons": 80,
        "total_hours": "15",
        "learners": 1800000,
        "rating": 4.8,
        "is_certified": True,
        "is_free": True,
        "chapters": [
            {
                "id": "react-intro",
                "title": "React Introduction",
                "description": "Getting started with React",
                "lessons": [
                    {"id": "react-home", "title": "React HOME", "slug": "home", "duration": "5 min", "has_quiz": False, "has_exercise": False, "has_try_it": True},
                    {"id": "react-intro", "title": "React Intro", "slug": "intro", "duration": "10 min", "has_quiz": True, "has_exercise": False, "has_try_it": True},
                    {"id": "react-jsx", "title": "React JSX", "slug": "jsx", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "react-components",
                "title": "React Components",
                "description": "Building with components",
                "lessons": [
                    {"id": "react-components", "title": "React Components", "slug": "components", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "react-props", "title": "React Props", "slug": "props", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "react-state", "title": "React State", "slug": "state", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "react-hooks",
                "title": "React Hooks",
                "description": "Using React Hooks",
                "lessons": [
                    {"id": "react-usestate", "title": "React useState", "slug": "usestate", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "react-useeffect", "title": "React useEffect", "slug": "useeffect", "duration": "25 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "react-usecontext", "title": "React useContext", "slug": "usecontext", "duration": "20 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
        ]
    },
    "sql": {
        "id": "sql",
        "slug": "sql",
        "title": "SQL Tutorial",
        "short_title": "SQL",
        "description": "Learn SQL to manage and query databases.",
        "icon": "🗄️",
        "color": "#336791",
        "bg_color": "#F0F4F8",
        "difficulty": "beginner",
        "category": "database",
        "tags": ["SQL", "Database", "Backend", "Data"],
        "total_lessons": 70,
        "total_hours": "12",
        "learners": 1500000,
        "rating": 4.8,
        "is_certified": True,
        "is_free": True,
        "chapters": [
            {
                "id": "sql-intro",
                "title": "SQL Introduction",
                "description": "Getting started with SQL",
                "lessons": [
                    {"id": "sql-home", "title": "SQL HOME", "slug": "home", "duration": "5 min", "has_quiz": False, "has_exercise": False, "has_try_it": True},
                    {"id": "sql-intro", "title": "SQL Intro", "slug": "intro", "duration": "10 min", "has_quiz": True, "has_exercise": False, "has_try_it": True},
                    {"id": "sql-select", "title": "SQL SELECT", "slug": "select", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "sql-where", "title": "SQL WHERE", "slug": "where", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
            {
                "id": "sql-joins",
                "title": "SQL Joins",
                "description": "Combining tables",
                "lessons": [
                    {"id": "sql-join", "title": "SQL JOIN", "slug": "join", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "sql-inner", "title": "SQL INNER JOIN", "slug": "inner-join", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "sql-left", "title": "SQL LEFT JOIN", "slug": "left-join", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
        ]
    },
    "git": {
        "id": "git",
        "slug": "git",
        "title": "Git Tutorial",
        "short_title": "Git",
        "description": "Learn Git version control for tracking code changes.",
        "icon": "📦",
        "color": "#F05032",
        "bg_color": "#FFF5F0",
        "difficulty": "beginner",
        "category": "devops",
        "tags": ["Git", "Version Control", "DevOps", "GitHub"],
        "total_lessons": 45,
        "total_hours": "8",
        "learners": 1400000,
        "rating": 4.8,
        "is_certified": True,
        "is_free": True,
        "chapters": [
            {
                "id": "git-intro",
                "title": "Git Introduction",
                "description": "Getting started with Git",
                "lessons": [
                    {"id": "git-home", "title": "Git HOME", "slug": "home", "duration": "5 min", "has_quiz": False, "has_exercise": False, "has_try_it": True},
                    {"id": "git-intro", "title": "Git Intro", "slug": "intro", "duration": "10 min", "has_quiz": True, "has_exercise": False, "has_try_it": False},
                    {"id": "git-install", "title": "Git Install", "slug": "install", "duration": "10 min", "has_quiz": False, "has_exercise": True, "has_try_it": False},
                ]
            },
            {
                "id": "git-basics",
                "title": "Git Basics",
                "description": "Core Git commands",
                "lessons": [
                    {"id": "git-init", "title": "Git Init", "slug": "init", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "git-add", "title": "Git Add", "slug": "add", "duration": "10 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "git-commit", "title": "Git Commit", "slug": "commit", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                    {"id": "git-push", "title": "Git Push", "slug": "push", "duration": "15 min", "has_quiz": True, "has_exercise": True, "has_try_it": True},
                ]
            },
        ]
    },
}

CATEGORIES_DATA = [
    {
        "id": "web",
        "name": "Web Development",
        "description": "HTML, CSS, JavaScript, and modern frameworks",
        "icon": "🌐",
        "color": "#059669",
        "tutorials": ["html", "css", "javascript", "react"],
    },
    {
        "id": "programming",
        "name": "Programming Languages",
        "description": "Python, Java, C++, and more",
        "icon": "💻",
        "color": "#3776AB",
        "tutorials": ["python"],
    },
    {
        "id": "database",
        "name": "Database",
        "description": "SQL, MongoDB, PostgreSQL, and data management",
        "icon": "🗄️",
        "color": "#336791",
        "tutorials": ["sql"],
    },
    {
        "id": "devops",
        "name": "DevOps & Tools",
        "description": "Git, Docker, CI/CD, and deployment",
        "icon": "🔧",
        "color": "#F05032",
        "tutorials": ["git"],
    },
]


# ============================================
# API Routes
# ============================================

@router.get("/tutorials")
async def list_tutorials(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
) -> List[Dict[str, Any]]:
    """List all available tutorials."""
    tutorials = list(TUTORIALS_DATA.values())
    
    if category:
        tutorials = [t for t in tutorials if t["category"] == category]
    
    if difficulty:
        tutorials = [t for t in tutorials if t["difficulty"] == difficulty]
    
    if search:
        search_lower = search.lower()
        tutorials = [
            t for t in tutorials
            if search_lower in t["title"].lower() or
               search_lower in t["description"].lower() or
               any(search_lower in tag.lower() for tag in t["tags"])
        ]
    
    # Return simplified list (without full chapter data)
    return [
        {
            "id": t["id"],
            "slug": t["slug"],
            "title": t["title"],
            "short_title": t["short_title"],
            "description": t["description"],
            "icon": t["icon"],
            "color": t["color"],
            "bg_color": t["bg_color"],
            "difficulty": t["difficulty"],
            "category": t["category"],
            "tags": t["tags"],
            "total_lessons": t["total_lessons"],
            "total_hours": t["total_hours"],
            "learners": t["learners"],
            "rating": t["rating"],
            "is_certified": t["is_certified"],
            "is_free": t["is_free"],
        }
        for t in tutorials
    ]


@router.get("/tutorials/{slug}")
async def get_tutorial(slug: str) -> Dict[str, Any]:
    """Get full tutorial data including chapters and lessons."""
    if slug not in TUTORIALS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tutorial not found"
        )
    
    return TUTORIALS_DATA[slug]


@router.get("/tutorials/{slug}/lesson/{lesson_slug}")
async def get_lesson_content(slug: str, lesson_slug: str) -> Dict[str, Any]:
    """Get specific lesson content."""
    if slug not in TUTORIALS_DATA:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tutorial not found"
        )
    
    tutorial = TUTORIALS_DATA[slug]
    
    # Find the lesson
    for chapter in tutorial["chapters"]:
        for lesson in chapter["lessons"]:
            if lesson["slug"] == lesson_slug:
                return {
                    "tutorial": {
                        "slug": tutorial["slug"],
                        "title": tutorial["title"],
                        "short_title": tutorial["short_title"],
                        "icon": tutorial["icon"],
                        "color": tutorial["color"],
                    },
                    "chapter": {
                        "id": chapter["id"],
                        "title": chapter["title"],
                    },
                    "lesson": lesson,
                    "content": get_lesson_content_data(slug, lesson_slug),
                }
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Lesson not found"
    )


@router.get("/categories")
async def list_categories() -> List[Dict[str, Any]]:
    """List all tutorial categories."""
    categories_with_tutorials = []
    
    for cat in CATEGORIES_DATA:
        tutorials = [
            {
                "id": t["id"],
                "slug": t["slug"],
                "short_title": t["short_title"],
                "icon": t["icon"],
                "color": t["color"],
                "total_lessons": t["total_lessons"],
                "is_free": t["is_free"],
            }
            for t in TUTORIALS_DATA.values()
            if t["slug"] in cat["tutorials"]
        ]
        
        categories_with_tutorials.append({
            **cat,
            "tutorials": tutorials,
        })
    
    return categories_with_tutorials


@router.post("/progress/{tutorial_slug}/{lesson_slug}")
async def update_lesson_progress(
    tutorial_slug: str,
    lesson_slug: str,
    completed: bool = True,
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Update user's lesson progress."""
    # In production, this would save to the database
    return {
        "message": "Progress updated",
        "tutorial": tutorial_slug,
        "lesson": lesson_slug,
        "completed": completed,
        "user_id": str(current_user.id),
    }


@router.get("/progress")
async def get_user_progress(
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Get user's overall learning progress."""
    # In production, this would fetch from the database
    return {
        "user_id": str(current_user.id),
        "completed_lessons": 156,
        "quizzes_passed": 42,
        "certificates": 3,
        "current_streak": 12,
        "longest_streak": 21,
        "total_hours": 48,
        "karma_points": 4250,
        "rank": "Rising Star",
        "tutorial_progress": {
            "html": {"completed": 45, "total": 85, "percentage": 53},
            "css": {"completed": 30, "total": 120, "percentage": 25},
            "javascript": {"completed": 25, "total": 150, "percentage": 17},
        }
    }


def get_lesson_content_data(tutorial_slug: str, lesson_slug: str) -> Dict[str, Any]:
    """Get the actual content for a lesson."""
    # Sample content - in production, this would come from the database
    contents = {
        "html": {
            "home": {
                "title": "HTML Tutorial",
                "content_html": """
                    <h1>Welcome to HTML Tutorial</h1>
                    <p>HTML is the standard markup language for creating Web pages.</p>
                    <h2>What is HTML?</h2>
                    <ul>
                        <li>HTML stands for <strong>Hyper Text Markup Language</strong></li>
                        <li>HTML is the standard markup language for creating Web pages</li>
                        <li>HTML describes the structure of a Web page</li>
                        <li>HTML consists of a series of elements</li>
                    </ul>
                """,
                "try_it_code": """<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
</body>
</html>""",
            },
            "intro": {
                "title": "HTML Introduction",
                "content_html": """
                    <h1>HTML Introduction</h1>
                    <p>HTML is the standard markup language for Web pages.</p>
                    <h2>What You Will Learn</h2>
                    <ul>
                        <li>How to create and structure web pages</li>
                        <li>How to add headings, paragraphs, and lists</li>
                        <li>How to add links and images</li>
                        <li>How to create forms</li>
                    </ul>
                """,
                "try_it_code": """<!DOCTYPE html>
<html>
<body>
    <h1>This is a Heading</h1>
    <p>This is a paragraph.</p>
</body>
</html>""",
            },
        },
        "css": {
            "home": {
                "title": "CSS Tutorial",
                "content_html": """
                    <h1>CSS Tutorial</h1>
                    <p>CSS is the language we use to style a Web page.</p>
                    <h2>What is CSS?</h2>
                    <ul>
                        <li>CSS stands for <strong>Cascading Style Sheets</strong></li>
                        <li>CSS describes how HTML elements are to be displayed on screen</li>
                        <li>CSS saves a lot of work by controlling layout of multiple pages at once</li>
                    </ul>
                """,
                "try_it_code": """<!DOCTYPE html>
<html>
<head>
<style>
body {
    background-color: lightblue;
}
h1 {
    color: white;
    text-align: center;
}
</style>
</head>
<body>
    <h1>My First CSS Example</h1>
    <p>This is a paragraph.</p>
</body>
</html>""",
            },
        },
    }
    
    return contents.get(tutorial_slug, {}).get(lesson_slug, {
        "title": lesson_slug.title(),
        "content_html": f"<h1>{lesson_slug.title()}</h1><p>Content coming soon...</p>",
        "try_it_code": "<!-- Code example coming soon -->",
    })

