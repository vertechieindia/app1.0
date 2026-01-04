# VerTechie - Complete Architecture Document

## Document Information
| Field | Value |
|-------|-------|
| **Document Title** | VerTechie Platform - Architecture Document |
| **Version** | 1.0 |
| **Date** | January 2026 |
| **Status** | Complete |

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [System Architecture](#2-system-architecture)
3. [Frontend Architecture](#3-frontend-architecture)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Architecture](#5-database-architecture)
6. [API Architecture](#6-api-architecture)
7. [Security Architecture](#7-security-architecture)
8. [Infrastructure Architecture](#8-infrastructure-architecture)
9. [Module Architecture](#9-module-architecture)
10. [Data Flow Diagrams](#10-data-flow-diagrams)
11. [Technology Stack](#11-technology-stack)
12. [Deployment Architecture](#12-deployment-architecture)

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   │
│   │   Desktop   │   │   Mobile    │   │   Tablet    │   │   Admin     │   │
│   │   Browser   │   │   Browser   │   │   Browser   │   │   Panel     │   │
│   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘   │
│          │                 │                 │                 │           │
└──────────┼─────────────────┼─────────────────┼─────────────────┼───────────┘
           │                 │                 │                 │
           └─────────────────┼─────────────────┼─────────────────┘
                             │                 │
                             ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                    React SPA (Vite + TypeScript)                   │    │
│   ├───────────────────────────────────────────────────────────────────┤    │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│    │
│   │  │   MUI    │ │  Router  │ │  Axios   │ │  State   │ │  Hooks   ││    │
│   │  │Components│ │  DOM     │ │  Client  │ │  Context │ │  Custom  ││    │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘│    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTPS/WSS
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             API GATEWAY LAYER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────────────────────────────────────────────────────────┐    │
│   │                         FastAPI Application                        │    │
│   ├───────────────────────────────────────────────────────────────────┤    │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐│    │
│   │  │   CORS   │ │   Rate   │ │   Auth   │ │  Logging │ │ Security ││    │
│   │  │Middleware│ │  Limit   │ │Middleware│ │Middleware│ │ Headers  ││    │
│   │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘│    │
│   └───────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SERVICE LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│   │  Auth   │ │  Users  │ │  Jobs   │ │ Courses │ │Calendar │ │  Chat   │ │
│   │ Service │ │ Service │ │ Service │ │ Service │ │ Service │ │ Service │ │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│   │ Network │ │Community│ │Companies│ │ Schools │ │Practice │ │ Hiring  │ │
│   │ Service │ │ Service │ │ Service │ │ Service │ │ Service │ │ Service │ │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘ │
│                                                                             │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                          │
│   │  Blog   │ │   IDE   │ │  Learn  │ │Meetings │                          │
│   │ Service │ │ Service │ │ Service │ │ Service │                          │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             DATA LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐   │
│   │    PostgreSQL     │   │      Redis        │   │   File Storage    │   │
│   │   (Primary DB)    │   │     (Cache)       │   │   (Uploads/Media) │   │
│   └───────────────────┘   └───────────────────┘   └───────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

1. **Separation of Concerns** - Clear boundaries between layers
2. **Modularity** - Independent, reusable modules
3. **Scalability** - Horizontal scaling capability
4. **Security First** - Security at every layer
5. **Performance** - Optimized for speed
6. **Maintainability** - Clean, documented code

---

## 2. System Architecture

### 2.1 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VerTechie Platform                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         FRONTEND (React)                             │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │   │
│  │  │    Pages    │  │  Components │  │   Layouts   │  │  Contexts │ │   │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├───────────┤ │   │
│  │  │ - Home      │  │ - Header    │  │ - Public    │  │ - Auth    │ │   │
│  │  │ - Learn     │  │ - Footer    │  │ - Techie    │  │ - Theme   │ │   │
│  │  │ - Jobs      │  │ - Sidebar   │  │ - Admin     │  │ - User    │ │   │
│  │  │ - ATS       │  │ - Cards     │  │ - Network   │  │ - API     │ │   │
│  │  │ - Profile   │  │ - Dialogs   │  │ - SMS/CMS   │  │           │ │   │
│  │  │ - VideoRoom │  │ - Forms     │  │             │  │           │ │   │
│  │  │ - IDE       │  │ - Charts    │  │             │  │           │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    │ REST API / WebSocket                   │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         BACKEND (FastAPI)                            │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │   │
│  │  │  API Routes │  │   Models    │  │   Schemas   │  │   Core    │ │   │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤  ├───────────┤ │   │
│  │  │ - auth.py   │  │ - User      │  │ - Pydantic  │  │ - Config  │ │   │
│  │  │ - users.py  │  │ - Job       │  │ - Request   │  │ - Security│ │   │
│  │  │ - jobs.py   │  │ - Course    │  │ - Response  │  │ - Database│ │   │
│  │  │ - courses.py│  │ - Meeting   │  │             │  │ - Logging │ │   │
│  │  │ - meetings.py│ │ - Post      │  │             │  │           │ │   │
│  │  │ - ...       │  │ - ...       │  │             │  │           │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    │ SQLAlchemy ORM                         │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          DATABASE (PostgreSQL)                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Frontend Architecture

### 3.1 Directory Structure

```
vertechie_fe-main/frontend/
├── public/
│   ├── index.html
│   ├── logo.svg
│   └── assets/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── main.tsx               # Entry point
│   ├── index.css              # Global styles
│   │
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── TechieSignup.tsx
│   │   │   └── FaceVerification.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AppHeader.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── AuthenticatedLayout.tsx
│   │   ├── common/            # Common components
│   │   │   ├── ContributionHeatmap.tsx
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── pages/                 # Page components
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── SuperAdmin.tsx
│   │   │
│   │   ├── techie/            # Techie platform pages
│   │   │   ├── index.ts       # Barrel exports
│   │   │   ├── TechieDashboard.tsx
│   │   │   ├── Learn.tsx
│   │   │   ├── TutorialPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   ├── VideoRoom.tsx
│   │   │   ├── MeetingLobby.tsx
│   │   │   ├── ScheduleInterview.tsx
│   │   │   ├── IDEPage.tsx
│   │   │   ├── Blogs.tsx
│   │   │   ├── ProblemsPage.tsx
│   │   │   │
│   │   │   ├── ats/           # ATS sub-pages
│   │   │   │   ├── ATSLayout.tsx
│   │   │   │   ├── PipelinePage.tsx
│   │   │   │   ├── JobPostingsPage.tsx
│   │   │   │   ├── CalendarPage.tsx
│   │   │   │   └── SchedulingPage.tsx
│   │   │   │
│   │   │   ├── cms/           # Company Management
│   │   │   │   ├── CMSLayout.tsx
│   │   │   │   ├── CMSPosts.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── sms/           # School Management
│   │   │   │   ├── SMSLayout.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── network/       # Network sub-pages
│   │   │       ├── NetworkLayout.tsx
│   │   │       ├── NetworkFeed.tsx
│   │   │       ├── MyNetwork.tsx
│   │   │       ├── NetworkGroups.tsx
│   │   │       ├── NetworkEvents.tsx
│   │   │       └── Combinator.tsx
│   │   │
│   │   ├── user/              # User-facing pages
│   │   │   ├── JobListings.tsx
│   │   │   ├── JobDetails.tsx
│   │   │   ├── JobApply.tsx
│   │   │   └── CodingTest.tsx
│   │   │
│   │   ├── admin/             # Admin pages
│   │   │   ├── LearnAdmin.tsx
│   │   │   └── CourseManagement.tsx
│   │   │
│   │   └── ...
│   │
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── usePaginatedApi.ts
│   │
│   ├── services/              # API services
│   │   └── api.ts
│   │
│   ├── styles/                # Styling
│   │   └── theme.ts           # MUI theme configuration
│   │
│   ├── constants/             # Constants
│   │   └── techLogos.ts       # Technology logos
│   │
│   ├── utils/                 # Utilities
│   │   ├── logger.ts
│   │   └── helpers.ts
│   │
│   └── types/                 # TypeScript types
│       └── index.ts
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── .env
```

### 3.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.tsx                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    ThemeProvider                           │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │                   AuthProvider                       │  │ │
│  │  │  ┌───────────────────────────────────────────────┐  │  │ │
│  │  │  │                 BrowserRouter                  │  │  │ │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │  │ │
│  │  │  │  │                 Routes                   │  │  │  │ │
│  │  │  │  │  ┌───────────────────────────────────┐  │  │  │  │ │
│  │  │  │  │  │           PublicLayout            │  │  │  │  │ │
│  │  │  │  │  │  • Navbar                         │  │  │  │  │ │
│  │  │  │  │  │  • Page Content                   │  │  │  │  │ │
│  │  │  │  │  │  • Footer                         │  │  │  │  │ │
│  │  │  │  │  └───────────────────────────────────┘  │  │  │  │ │
│  │  │  │  │  ┌───────────────────────────────────┐  │  │  │  │ │
│  │  │  │  │  │       AuthenticatedLayout         │  │  │  │  │ │
│  │  │  │  │  │  • AppHeader                      │  │  │  │  │ │
│  │  │  │  │  │  • Sidebar (optional)             │  │  │  │  │ │
│  │  │  │  │  │  • Page Content                   │  │  │  │  │ │
│  │  │  │  │  │  • BottomNav                      │  │  │  │  │ │
│  │  │  │  │  └───────────────────────────────────┘  │  │  │  │ │
│  │  │  │  └─────────────────────────────────────────┘  │  │  │ │
│  │  │  └───────────────────────────────────────────────┘  │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                      State Management                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │   Global State      │  │        Local State               │  │
│  │   (React Context)   │  │        (useState/useReducer)     │  │
│  ├─────────────────────┤  ├─────────────────────────────────┤  │
│  │ • AuthContext       │  │ • Form states                   │  │
│  │   - user            │  │ • UI toggles                    │  │
│  │   - isAuthenticated │  │ • Page-specific data            │  │
│  │   - role            │  │ • Dialogs open/close            │  │
│  │   - login()         │  │ • Filters/Sorting               │  │
│  │   - logout()        │  │ • Temporary selections          │  │
│  │                     │  │                                 │  │
│  │ • ThemeContext      │  │                                 │  │
│  │   - mode            │  │                                 │  │
│  │   - toggleTheme()   │  │                                 │  │
│  └─────────────────────┘  └─────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   Server State                           │   │
│  │                   (API Data)                             │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ • useApi hook - Single fetch operations                 │   │
│  │ • usePaginatedApi hook - Paginated list fetches         │   │
│  │ • useMutation hook - POST/PUT/DELETE operations         │   │
│  │ • axios instance with interceptors                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Backend Architecture

### 4.1 Directory Structure

```
vertechie_be/
├── app/
│   ├── __init__.py
│   ├── main.py                # FastAPI application entry
│   │
│   ├── api/                   # API layer
│   │   ├── __init__.py
│   │   └── v1/                # API version 1
│   │       ├── __init__.py    # Router aggregation
│   │       ├── auth.py        # Authentication endpoints
│   │       ├── users.py       # User management
│   │       ├── jobs.py        # Job postings
│   │       ├── courses.py     # Courses
│   │       ├── calendar.py    # Calendar/scheduling
│   │       ├── chat.py        # Chat/messaging
│   │       ├── network.py     # Networking features
│   │       ├── community.py   # Community features
│   │       ├── companies.py   # Company management
│   │       ├── schools.py     # School management
│   │       ├── practice.py    # Coding practice
│   │       ├── hiring.py      # ATS/Hiring
│   │       ├── blog.py        # Blog posts
│   │       ├── ide.py         # IDE features
│   │       ├── learn.py       # Learning platform
│   │       ├── learn_admin.py # Learn admin
│   │       └── meetings.py    # Video conferencing
│   │
│   ├── core/                  # Core modules
│   │   ├── __init__.py
│   │   ├── config.py          # Configuration/Settings
│   │   ├── security.py        # Security utilities
│   │   └── security_enhanced.py # Enhanced security
│   │
│   ├── db/                    # Database
│   │   ├── __init__.py
│   │   ├── session.py         # Database session
│   │   └── base.py            # Base model
│   │
│   ├── models/                # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── job.py
│   │   ├── course.py
│   │   └── ...
│   │
│   ├── schemas/               # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── job.py
│   │   └── ...
│   │
│   ├── middleware/            # Middleware
│   │   ├── __init__.py
│   │   ├── cors.py
│   │   ├── rate_limit.py
│   │   └── logging.py
│   │
│   └── utils/                 # Utilities
│       ├── __init__.py
│       └── helpers.py
│
├── alembic/                   # Database migrations
│   ├── versions/
│   └── env.py
│
├── tests/                     # Test files
│   ├── __init__.py
│   ├── conftest.py
│   └── test_*.py
│
├── requirements.txt           # Dependencies
├── alembic.ini               # Alembic config
├── .env                      # Environment variables
└── SECURITY.md               # Security documentation
```

### 4.2 API Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Request Flow                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FastAPI Application                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Middleware Stack                                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ CORSMiddleware → RateLimitMiddleware → LoggingMiddleware  │ │
│  │      → SecurityHeadersMiddleware                          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  2. Request Validation (Pydantic)                              │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Automatic request body validation via Pydantic schemas    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  3. Dependency Injection                                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ get_db() → get_current_user() → other dependencies        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  4. Route Handler                                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Business logic execution                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  5. Database Operations (SQLAlchemy Async)                     │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Query → Execute → Commit/Rollback                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                │                                │
│                                ▼                                │
│  6. Response Serialization                                      │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Pydantic model → JSON response                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Endpoint Organization

```
API Base URL: /api

Authentication:
├── POST   /auth/register         # User registration
├── POST   /auth/login            # User login
├── POST   /auth/refresh          # Refresh token
├── POST   /auth/logout           # Logout
└── GET    /auth/me               # Current user

Users:
├── GET    /users                 # List users
├── GET    /users/{id}            # Get user
├── PATCH  /users/{id}            # Update user
└── DELETE /users/{id}            # Delete user

Jobs:
├── GET    /jobs                  # List jobs
├── POST   /jobs                  # Create job
├── GET    /jobs/{id}             # Get job
├── PATCH  /jobs/{id}             # Update job
├── DELETE /jobs/{id}             # Delete job
└── POST   /jobs/{id}/apply       # Apply to job

Courses:
├── GET    /courses               # List courses
├── GET    /courses/{id}          # Get course
├── GET    /courses/{id}/lessons  # Get lessons
└── POST   /courses/{id}/enroll   # Enroll in course

Calendar:
├── GET    /calendar/events       # List events
├── POST   /calendar/events       # Create event
├── PATCH  /calendar/events/{id}  # Update event
├── DELETE /calendar/events/{id}  # Delete event
└── POST   /calendar/scheduling-links # Create scheduling link

Meetings:
├── POST   /meetings/rooms        # Create meeting room
├── GET    /meetings/rooms        # List rooms
├── GET    /meetings/rooms/{id}   # Get room
├── POST   /meetings/rooms/{id}/join     # Join meeting
├── POST   /meetings/rooms/{id}/leave    # Leave meeting
├── POST   /meetings/rooms/{id}/record/start  # Start recording
├── POST   /meetings/rooms/{id}/record/stop   # Stop recording
├── POST   /meetings/schedule-interview       # Schedule interview
└── GET    /meetings/upcoming-interviews      # List upcoming

[... additional endpoints for other modules ...]
```

---

## 5. Database Architecture

### 5.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Database Schema (PostgreSQL)                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   users     │     │  companies  │     │   schools   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ email       │     │ name        │     │ name        │
│ password    │     │ logo        │     │ logo        │
│ full_name   │     │ verified    │     │ programs    │
│ role        │     │ admin_id(FK)│     │ admin_id(FK)│
│ avatar      │     │ created_at  │     │ created_at  │
│ created_at  │     └──────┬──────┘     └──────┬──────┘
└──────┬──────┘            │                   │
       │                   │                   │
       │    ┌──────────────┴───────────────────┘
       │    │
       ▼    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    jobs     │     │   courses   │     │   events    │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ title       │     │ title       │     │ title       │
│ company_id  │◄────│ category    │     │ date        │
│ description │     │ difficulty  │     │ time        │
│ requirements│     │ lessons     │     │ video_link  │
│ location    │     │ created_at  │     │ user_id(FK) │
│ salary      │     └─────────────┘     │ created_at  │
│ created_at  │                         └─────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│applications │     │   posts     │     │  messages   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ job_id (FK) │     │ author_id   │     │ sender_id   │
│ user_id(FK) │     │ content     │     │ receiver_id │
│ status      │     │ likes       │     │ content     │
│ match_score │     │ comments    │     │ chat_id     │
│ answers     │     │ created_at  │     │ created_at  │
│ created_at  │     └─────────────┘     └─────────────┘
└─────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  meetings   │     │ recordings  │     │meeting_notes│
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id (PK)     │     │ id (PK)     │     │ id (PK)     │
│ room_id     │     │ meeting_id  │     │ meeting_id  │
│ title       │     │ file_url    │     │ author_id   │
│ host_id     │     │ duration    │     │ content     │
│ type        │     │ created_at  │     │ rating      │
│ scheduled_at│     └─────────────┘     │ created_at  │
│ status      │                         └─────────────┘
│ created_at  │
└─────────────┘
```

### 5.2 Database Configuration

```python
# PostgreSQL (Production)
DATABASE_URL = "postgresql+asyncpg://user:password@host:5432/vertechie"

# SQLite (Development)
DATABASE_URL = "sqlite+aiosqlite:///./vertechie.db"

# Connection Pool Settings
pool_size = 20
max_overflow = 10
pool_timeout = 30
pool_recycle = 3600
```

---

## 6. API Architecture

### 6.1 Authentication Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │   API    │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │  POST /auth/login             │                               │
     │  {email, password}            │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │  SELECT user WHERE email      │
     │                               │──────────────────────────────>│
     │                               │                               │
     │                               │  user record                  │
     │                               │<──────────────────────────────│
     │                               │                               │
     │                               │  Verify password (bcrypt)     │
     │                               │  Generate JWT tokens          │
     │                               │                               │
     │  {access_token, refresh_token}│                               │
     │<──────────────────────────────│                               │
     │                               │                               │
     │  GET /protected-resource      │                               │
     │  Authorization: Bearer {token}│                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │  Verify JWT signature         │
     │                               │  Extract user claims          │
     │                               │                               │
     │  Protected resource data      │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

### 6.2 Request/Response Format

```json
// Successful Response
{
  "status": "success",
  "data": {
    "id": "123",
    "name": "Example"
  },
  "message": "Resource retrieved successfully"
}

// Error Response
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {"field": "email", "message": "Invalid email format"}
    ]
  }
}

// Paginated Response
{
  "status": "success",
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

---

## 7. Security Architecture

### 7.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Security Architecture                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Layer 1: Network Security                                                  │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ • HTTPS/TLS 1.3 encryption                                            │ │
│  │ • CORS policy (strict origin whitelist)                               │ │
│  │ • Rate limiting (100 requests/minute per IP)                          │ │
│  │ • DDoS protection (CDN/WAF)                                           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Layer 2: Application Security                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ • JWT authentication (24h access token, 7d refresh token)             │ │
│  │ • Role-based access control (RBAC)                                    │ │
│  │ • Input validation (Pydantic schemas)                                 │ │
│  │ • XSS prevention (input sanitization)                                 │ │
│  │ • CSRF protection                                                     │ │
│  │ • Security headers (CSP, HSTS, X-Frame-Options)                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Layer 3: Authentication Security                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ • Password hashing (bcrypt, 12 rounds)                                │ │
│  │ • Brute force protection (5 attempts = 15min lockout)                 │ │
│  │ • Face verification (liveness detection)                              │ │
│  │ • Session management                                                  │ │
│  │ • Copy-paste prevention (anti-AI dumping)                             │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Layer 4: Data Security                                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ • Encryption at rest (AES-256)                                        │ │
│  │ • Database connection encryption                                      │ │
│  │ • Sensitive data masking in logs                                      │ │
│  │ • Secrets management                                                  │ │
│  │ • Audit logging                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Layer 5: Infrastructure Security                                           │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ • Environment variable configuration                                  │ │
│  │ • Secrets stored in environment (not code)                            │ │
│  │ • Regular security updates                                            │ │
│  │ • Container security (non-root user)                                  │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1704326400,
  "exp": 1704412800
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

---

## 8. Infrastructure Architecture

### 8.1 Development Environment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Development Environment                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐   │
│   │   Frontend Dev    │   │   Backend Dev     │   │   Database        │   │
│   │   Server (Vite)   │   │   Server (Uvicorn)│   │   (SQLite)        │   │
│   │   Port: 5173      │   │   Port: 8000      │   │   File: vertechie │   │
│   └─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘   │
│             │                       │                       │             │
│             └───────────────────────┼───────────────────────┘             │
│                                     │                                     │
│                            Local Development                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Production Environment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Production Architecture                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌─────────────┐                                │
│                              │    Users    │                                │
│                              └──────┬──────┘                                │
│                                     │                                       │
│                                     ▼                                       │
│                           ┌─────────────────┐                               │
│                           │   CDN (Static   │                               │
│                           │   Assets/Cache) │                               │
│                           └────────┬────────┘                               │
│                                    │                                        │
│                                    ▼                                        │
│                         ┌───────────────────┐                               │
│                         │   Load Balancer   │                               │
│                         │   (HTTPS Term)    │                               │
│                         └─────────┬─────────┘                               │
│                                   │                                         │
│           ┌───────────────────────┼───────────────────────┐                │
│           │                       │                       │                │
│           ▼                       ▼                       ▼                │
│   ┌───────────────┐       ┌───────────────┐       ┌───────────────┐       │
│   │  App Server 1 │       │  App Server 2 │       │  App Server N │       │
│   │  (Frontend +  │       │  (Frontend +  │       │  (Frontend +  │       │
│   │   Backend)    │       │   Backend)    │       │   Backend)    │       │
│   └───────┬───────┘       └───────┬───────┘       └───────┬───────┘       │
│           │                       │                       │                │
│           └───────────────────────┼───────────────────────┘                │
│                                   │                                         │
│           ┌───────────────────────┼───────────────────────┐                │
│           │                       │                       │                │
│           ▼                       ▼                       ▼                │
│   ┌───────────────┐       ┌───────────────┐       ┌───────────────┐       │
│   │  PostgreSQL   │       │    Redis      │       │ File Storage  │       │
│   │  (Primary +   │       │   (Cache)     │       │ (S3/MinIO)    │       │
│   │   Replica)    │       │               │       │               │       │
│   └───────────────┘       └───────────────┘       └───────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Module Architecture

### 9.1 Video Conferencing Module

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Video Conferencing Architecture                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐        ┌─────────────┐        ┌─────────────┐            │
│  │  Browser A  │◄──────►│  Signaling  │◄──────►│  Browser B  │            │
│  │  (WebRTC)   │        │   Server    │        │  (WebRTC)   │            │
│  └──────┬──────┘        │  (WebSocket)│        └──────┬──────┘            │
│         │               └─────────────┘               │                   │
│         │                                             │                   │
│         │         Peer-to-Peer Connection            │                   │
│         │◄───────────────────────────────────────────►│                   │
│         │         (Video/Audio/Data Streams)          │                   │
│         │                                             │                   │
│  ┌──────┴──────┐                               ┌──────┴──────┐            │
│  │  Features:  │                               │  Features:  │            │
│  │ • Video     │                               │ • Video     │            │
│  │ • Audio     │                               │ • Audio     │            │
│  │ • Screen    │                               │ • Screen    │            │
│  │   Share     │                               │   Share     │            │
│  │ • Chat      │                               │ • Chat      │            │
│  └─────────────┘                               └─────────────┘            │
│                                                                             │
│  STUN/TURN Servers (for NAT traversal):                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ • stun:stun.l.google.com:19302                                      │  │
│  │ • stun:stun1.l.google.com:19302                                     │  │
│  │ • [Custom TURN server for production]                               │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Learning Platform Module

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Learning Platform Architecture                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Course Catalog                               │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │
│  │  │  HTML   │ │   CSS   │ │   JS    │ │   TS    │ │  React  │ ...  │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │   │
│  └───────┼──────────┼──────────┼──────────┼──────────┼────────────────┘   │
│          │          │          │          │          │                     │
│          └──────────┴──────────┴──────────┴──────────┘                     │
│                                │                                           │
│                                ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        Tutorial Page                                 │   │
│  │  ┌─────────────────┐  ┌──────────────────────────────────────────┐ │   │
│  │  │    Sidebar      │  │              Content Area                 │ │   │
│  │  │  ┌───────────┐  │  │  ┌──────────────────────────────────────┐ │ │   │
│  │  │  │ Sections  │  │  │  │           Lesson Content              │ │ │   │
│  │  │  ├───────────┤  │  │  │  • Text/Markdown                      │ │ │   │
│  │  │  │ Lesson 1  │  │  │  │  • Code examples                      │ │ │   │
│  │  │  │ Lesson 2  │◄─┼──┼──│  • Images                             │ │ │   │
│  │  │  │ Lesson 3  │  │  │  │  • Videos                             │ │ │   │
│  │  │  │ ...       │  │  │  └──────────────────────────────────────┘ │ │   │
│  │  │  └───────────┘  │  │                                          │ │   │
│  │  │                 │  │  ┌──────────────────────────────────────┐ │ │   │
│  │  │  Progress:      │  │  │        Try It Yourself                │ │ │   │
│  │  │  ████████░░ 80% │  │  │  ┌─────────────┬─────────────────┐   │ │ │   │
│  │  └─────────────────┘  │  │  │ Code Editor │    Preview      │   │ │ │   │
│  │                       │  │  │ (Monaco)    │   (iframe)      │   │ │ │   │
│  │                       │  │  │             │                 │   │ │ │   │
│  │                       │  │  └─────────────┴─────────────────┘   │ │ │   │
│  │                       │  └──────────────────────────────────────┘ │ │   │
│  │                       └──────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Data Flow Diagrams

### 10.1 User Registration Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User    │    │  Signup  │    │   Face   │    │  API     │    │ Database │
│          │    │   Form   │    │  Verify  │    │          │    │          │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │               │
     │ Fill form     │               │               │               │
     │──────────────>│               │               │               │
     │               │               │               │               │
     │               │ Validate      │               │               │
     │               │ inputs        │               │               │
     │               │               │               │               │
     │               │ Request face  │               │               │
     │               │ verification  │               │               │
     │               │──────────────>│               │               │
     │               │               │               │               │
     │               │               │ Capture       │               │
     │<──────────────┼───────────────│ photos        │               │
     │ Move head     │               │               │               │
     │──────────────>│──────────────>│               │               │
     │               │               │               │               │
     │               │               │ Verify        │               │
     │               │               │ complete      │               │
     │               │<──────────────│               │               │
     │               │               │               │               │
     │               │ POST /register│               │               │
     │               │──────────────────────────────>│               │
     │               │               │               │               │
     │               │               │               │ Create user   │
     │               │               │               │──────────────>│
     │               │               │               │               │
     │               │               │               │ User created  │
     │               │               │               │<──────────────│
     │               │               │               │               │
     │               │ Success       │               │               │
     │<──────────────│<──────────────────────────────│               │
     │               │               │               │               │
```

### 10.2 Job Application Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│Candidate │    │ Job Page │    │   API    │    │ Database │
└────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │               │               │               │
     │ View job      │               │               │
     │──────────────>│               │               │
     │               │ GET /jobs/{id}│               │
     │               │──────────────>│               │
     │               │               │ Query job     │
     │               │               │──────────────>│
     │               │               │ Job data      │
     │               │               │<──────────────│
     │               │ Job details   │               │
     │<──────────────│<──────────────│               │
     │               │               │               │
     │ Click Apply   │               │               │
     │──────────────>│               │               │
     │               │               │               │
     │               │ Show questions│               │
     │<──────────────│               │               │
     │               │               │               │
     │ Answer &      │               │               │
     │ Submit        │               │               │
     │──────────────>│               │               │
     │               │ POST /apply   │               │
     │               │──────────────>│               │
     │               │               │ Calculate     │
     │               │               │ match score   │
     │               │               │               │
     │               │               │ Save          │
     │               │               │ application   │
     │               │               │──────────────>│
     │               │               │               │
     │               │ Success       │               │
     │<──────────────│<──────────────│               │
     │               │               │               │
```

---

## 11. Technology Stack

### 11.1 Complete Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TECHNOLOGY STACK                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  FRONTEND                                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│  │ Framework    │ React 18.x                                              │ │
│  │ Build Tool   │ Vite 5.x                                                │ │
│  │ Language     │ TypeScript 5.x                                          │ │
│  │ UI Library   │ Material-UI (MUI) 5.x                                   │ │
│  │ Routing      │ React Router DOM 6.x                                    │ │
│  │ HTTP Client  │ Axios                                                   │ │
│  │ Styling      │ Emotion (CSS-in-JS), Styled Components                  │ │
│  │ Code Editor  │ Monaco Editor                                           │ │
│  │ Date/Time    │ date-fns                                                │ │
│  │ Face API     │ face-api.js                                             │ │
│  │ Webcam       │ react-webcam                                            │ │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  BACKEND                                                                    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  │ Framework    │ FastAPI 0.100+                                          │ │
│  │ Language     │ Python 3.11+                                            │ │
│  │ ORM          │ SQLAlchemy 2.0 (Async)                                  │ │
│  │ Validation   │ Pydantic 2.x                                            │ │
│  │ Auth         │ python-jose (JWT), passlib (bcrypt)                     │ │
│  │ Migrations   │ Alembic                                                 │ │
│  │ Server       │ Uvicorn (ASGI)                                          │ │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  DATABASE                                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│  │ Primary DB   │ PostgreSQL 15+ (Production)                             │ │
│  │ Dev DB       │ SQLite (Development)                                    │ │
│  │ Cache        │ Redis (Optional)                                        │ │
│  │ Driver       │ asyncpg (PostgreSQL), aiosqlite (SQLite)                │ │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  DEVOPS & TOOLS                                                             │
│  ─────────────────────────────────────────────────────────────────────────  │
│  │ Version Ctrl │ Git                                                     │ │
│  │ Containerize │ Docker, Docker Compose                                  │ │
│  │ Linting      │ ESLint, Prettier, Black, Flake8                         │ │
│  │ Testing      │ Pytest, Jest, React Testing Library                     │ │
│  │ API Docs     │ Swagger/OpenAPI (auto-generated)                        │ │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│  SECURITY                                                                   │
│  ─────────────────────────────────────────────────────────────────────────  │
│  │ Auth         │ JWT (RS256/HS256)                                       │ │
│  │ Password     │ bcrypt (12 rounds)                                      │ │
│  │ Transport    │ TLS 1.3                                                 │ │
│  │ CORS         │ Strict origin policy                                    │ │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Deployment Architecture

### 12.1 Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./vertechie_fe-main/frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://backend:8000/api

  backend:
    build: ./vertechie_be
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/vertechie
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=${SECRET_KEY}

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=vertechie

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 12.2 CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CI/CD Pipeline                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│   │   Push   │───>│   Build  │───>│   Test   │───>│  Deploy  │            │
│   │  to Git  │    │  & Lint  │    │          │    │          │            │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘            │
│                                                                             │
│   Stage 1: Build                                                            │
│   • npm install / pip install                                               │
│   • TypeScript compilation                                                  │
│   • ESLint / Black linting                                                  │
│                                                                             │
│   Stage 2: Test                                                             │
│   • Unit tests (Jest/Pytest)                                                │
│   • Integration tests                                                       │
│   • E2E tests (optional)                                                    │
│   • Security scan                                                           │
│                                                                             │
│   Stage 3: Deploy                                                           │
│   • Build Docker images                                                     │
│   • Push to container registry                                              │
│   • Deploy to staging/production                                            │
│   • Health check                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

*End of Architecture Document*

