"""API v1 routes - Complete VerTechie API."""

from fastapi import APIRouter

# Import all route modules
from app.api.v1 import (
    auth, users, jobs, courses, calendar, 
    chat, network, community, unified_network,
    companies, schools, practice, hiring, blog, ide
)

api_router = APIRouter()

# ============= User Routes =============

# Auth & Users
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Core Features
api_router.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(calendar.router, prefix="/calendar", tags=["Calendar"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(network.router, prefix="/network", tags=["Network"])
api_router.include_router(community.router, prefix="/community", tags=["Community"])
api_router.include_router(unified_network.router, prefix="/unified-network", tags=["Unified Network"])

# Feature Modules
api_router.include_router(companies.router, prefix="/companies", tags=["Companies"])
api_router.include_router(schools.router, prefix="/schools", tags=["Schools"])
api_router.include_router(practice.router, prefix="/practice", tags=["Practice"])
api_router.include_router(hiring.router, prefix="/hiring", tags=["Hiring"])
api_router.include_router(blog.router, prefix="/blog", tags=["Blog"])
api_router.include_router(ide.router, prefix="/ide", tags=["IDE"])

# ============= Admin Routes =============

# Check if admin routers exist and include them
try:
    from app.api.v1.companies import admin_router as companies_admin_router
    api_router.include_router(companies_admin_router, prefix="/admin/companies", tags=["Admin - Companies"])
except ImportError:
    pass

try:
    from app.api.v1.schools import admin_router as schools_admin_router
    api_router.include_router(schools_admin_router, prefix="/admin/schools", tags=["Admin - Schools"])
except ImportError:
    pass

try:
    from app.api.v1.practice import admin_router as practice_admin_router
    api_router.include_router(practice_admin_router, prefix="/admin/practice", tags=["Admin - Practice"])
except ImportError:
    pass

try:
    from app.api.v1.hiring import admin_router as hiring_admin_router
    api_router.include_router(hiring_admin_router, prefix="/admin/hiring", tags=["Admin - Hiring"])
except ImportError:
    pass

try:
    from app.api.v1.blog import admin_router as blog_admin_router
    api_router.include_router(blog_admin_router, prefix="/admin/blog", tags=["Admin - Blog"])
except ImportError:
    pass

# Learn Admin - Course Management System
try:
    from app.api.v1 import learn_admin
    api_router.include_router(learn_admin.router, prefix="/admin/learn", tags=["Learn Admin"])
except ImportError as e:
    print(f"Learn Admin import error: {e}")
    pass

# Techie Admin Review - Profile Verification Workflow
try:
    from app.api.v1 import admin_review
    api_router.include_router(admin_review.router, tags=["Admin - Techie Review"])
except ImportError as e:
    print(f"Admin Review import error: {e}")
    pass

# Admin Dashboard - Groups, Permissions, Stats, etc.
try:
    from app.api.v1 import admin
    api_router.include_router(admin.router, tags=["Admin Dashboard"])
except ImportError as e:
    print(f"Admin Dashboard import error: {e}")
    pass
