"""API v1 routes - Complete VerTechie API."""

from fastapi import APIRouter

# Import all route modules
from app.api.v1 import (
    auth, users, jobs, courses, calendar, 
    chat, network, community,
    companies, schools, practice, hiring, blog, ide, learn, learn_admin, meetings
)

# Import admin routers
from app.api.v1.companies import admin_router as companies_admin_router
from app.api.v1.schools import admin_router as schools_admin_router
from app.api.v1.practice import admin_router as practice_admin_router
from app.api.v1.hiring import admin_router as hiring_admin_router
from app.api.v1.blog import admin_router as blog_admin_router

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

# New Migrated Features
api_router.include_router(companies.router)  # /companies
api_router.include_router(schools.router)    # /schools
api_router.include_router(practice.router)   # /practice
api_router.include_router(hiring.router)     # /hiring
api_router.include_router(blog.router)       # /blog
api_router.include_router(ide.router)        # /ide
api_router.include_router(learn.router, prefix="/learn", tags=["Learn"])  # /learn
api_router.include_router(meetings.router, prefix="/meetings", tags=["Meetings & Video Conferencing"])  # /meetings

# ============= Admin Routes =============

api_router.include_router(companies_admin_router)  # /admin/companies
api_router.include_router(schools_admin_router)    # /admin/schools
api_router.include_router(practice_admin_router)   # /admin/practice
api_router.include_router(hiring_admin_router)     # /admin/hiring
api_router.include_router(blog_admin_router)       # /admin/blog
api_router.include_router(learn_admin.router, prefix="/admin/learn", tags=["Learn Admin"])  # /admin/learn
