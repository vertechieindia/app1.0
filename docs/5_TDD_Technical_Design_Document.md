# VerTechie - Technical Design Document (TDD)

## Document Information
| Field | Value |
|-------|-------|
| **Document Title** | VerTechie Platform - Technical Design Document |
| **Version** | 1.0 |
| **Date** | January 2026 |
| **Status** | Complete |

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [System Design](#2-system-design)
3. [Database Design](#3-database-design)
4. [API Design](#4-api-design)
5. [Frontend Design](#5-frontend-design)
6. [Security Design](#6-security-design)
7. [Performance Design](#7-performance-design)
8. [Integration Design](#8-integration-design)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Design](#10-deployment-design)

---

## 1. Introduction

### 1.1 Purpose
This Technical Design Document (TDD) provides detailed technical specifications for implementing the VerTechie platform. It covers database schemas, API contracts, component designs, and implementation guidelines.

### 1.2 Technology Stack Summary

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React + TypeScript | 18.x / 5.x |
| Build Tool | Vite | 5.x |
| UI Library | Material-UI (MUI) | 5.x |
| Backend | FastAPI | 0.100+ |
| Database | PostgreSQL / SQLite | 15.x / 3.x |
| ORM | SQLAlchemy | 2.0 |
| Authentication | JWT (python-jose) | Latest |
| Password | bcrypt (passlib) | Latest |

---

## 2. System Design

### 2.1 Layered Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│   React Components → Pages → Layouts → UI Components            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                          │
│   Contexts → Hooks → Services → API Client (Axios)              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                │
│   FastAPI Routes → Dependency Injection → Middleware            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BUSINESS LAYER                            │
│   Service Functions → Business Logic → Validation               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                           │
│   SQLAlchemy Models → Queries → Database Session                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
│   PostgreSQL / SQLite → Tables → Indexes → Constraints          │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Module Dependencies

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         MODULE DEPENDENCY MAP                            │
└──────────────────────────────────────────────────────────────────────────┘

                              ┌─────────┐
                              │  Auth   │
                              │ Module  │
                              └────┬────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │    Users    │         │   Profile   │         │   Settings  │
    │   Module    │         │   Module    │         │   Module    │
    └──────┬──────┘         └──────┬──────┘         └─────────────┘
           │                       │
           │         ┌─────────────┴─────────────┐
           │         │                           │
           ▼         ▼                           ▼
    ┌─────────────────────┐              ┌─────────────────────┐
    │       Jobs          │              │      Learning       │
    │      Module         │              │       Module        │
    └──────────┬──────────┘              └──────────┬──────────┘
               │                                    │
               ▼                                    ▼
    ┌─────────────────────┐              ┌─────────────────────┐
    │        ATS          │              │      Practice       │
    │      Module         │              │       Module        │
    └──────────┬──────────┘              └─────────────────────┘
               │
               ▼
    ┌─────────────────────┐
    │       Video         │
    │   Conferencing      │
    │      Module         │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │      Calendar       │
    │       Module        │
    └─────────────────────┘
```

---

## 3. Database Design

### 3.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CORE ENTITIES                                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────┐       ┌───────────────────────┐
│        users          │       │      companies        │
├───────────────────────┤       ├───────────────────────┤
│ id (PK, UUID)         │       │ id (PK, UUID)         │
│ email (UNIQUE)        │       │ name                  │
│ hashed_password       │       │ logo_url              │
│ full_name             │──────►│ description           │
│ role                  │ 1:N   │ website               │
│ avatar_url            │       │ verified              │
│ is_active             │       │ admin_id (FK→users)   │
│ created_at            │       │ created_at            │
│ updated_at            │       │ updated_at            │
└───────────────────────┘       └───────────────────────┘
         │                               │
         │ 1:N                           │ 1:N
         ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐
│       profiles        │       │        jobs           │
├───────────────────────┤       ├───────────────────────┤
│ id (PK, UUID)         │       │ id (PK, UUID)         │
│ user_id (FK→users)    │       │ title                 │
│ headline              │       │ company_id (FK)       │
│ bio                   │       │ description           │
│ location              │       │ requirements (JSON)   │
│ skills (JSON)         │       │ location              │
│ experience (JSON)     │       │ job_type              │
│ education (JSON)      │       │ experience_level      │
│ social_links (JSON)   │       │ salary_min            │
│ created_at            │       │ salary_max            │
│ updated_at            │       │ is_remote             │
└───────────────────────┘       │ skills (JSON)         │
                                │ questions (JSON)      │
                                │ status                │
                                │ posted_by (FK→users)  │
                                │ created_at            │
                                │ expires_at            │
                                └───────────────────────┘
                                         │
                                         │ 1:N
                                         ▼
                                ┌───────────────────────┐
                                │    applications       │
                                ├───────────────────────┤
                                │ id (PK, UUID)         │
                                │ job_id (FK→jobs)      │
                                │ user_id (FK→users)    │
                                │ answers (JSON)        │
                                │ match_score           │
                                │ status                │
                                │ stage                 │
                                │ notes (JSON)          │
                                │ created_at            │
                                │ updated_at            │
                                └───────────────────────┘
```

### 3.2 Table Definitions

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Jobs Table
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    company_id UUID REFERENCES companies(id),
    description TEXT NOT NULL,
    requirements JSONB,
    location VARCHAR(200),
    job_type VARCHAR(50), -- full-time, part-time, contract
    experience_level VARCHAR(50), -- entry, mid, senior
    salary_min INTEGER,
    salary_max INTEGER,
    is_remote BOOLEAN DEFAULT false,
    skills JSONB,
    questions JSONB,
    status VARCHAR(50) DEFAULT 'active',
    posted_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    
    CONSTRAINT valid_salary CHECK (salary_max >= salary_min)
);

CREATE INDEX idx_jobs_company ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || description));
```

#### Applications Table
```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    answers JSONB,
    match_score DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'submitted',
    stage VARCHAR(50) DEFAULT 'applied',
    notes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(job_id, user_id)
);

CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_stage ON applications(stage);
```

#### Courses Table
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    thumbnail_url VARCHAR(500),
    duration_hours DECIMAL(4,1),
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_published ON courses(is_published);
```

#### Lessons Table
```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    section_id UUID REFERENCES sections(id),
    slug VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content JSONB,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(course_id, slug)
);

CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);
```

#### Meetings Table
```sql
CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    meeting_type VARCHAR(50), -- meeting, interview, webinar
    host_id UUID REFERENCES users(id),
    scheduled_at TIMESTAMP,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'scheduled',
    recording_url VARCHAR(500),
    notes JSONB,
    participants JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);

CREATE INDEX idx_meetings_host ON meetings(host_id);
CREATE INDEX idx_meetings_scheduled ON meetings(scheduled_at);
CREATE INDEX idx_meetings_room ON meetings(room_id);
```

### 3.3 JSON Schema Definitions

#### Job Questions Schema
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": { "type": "string" },
      "question": { "type": "string" },
      "type": { "enum": ["text", "yesno", "number", "choice"] },
      "required": { "type": "boolean" },
      "options": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["id", "question", "type"]
  }
}
```

#### Lesson Content Schema
```json
{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "type": { "enum": ["text", "code", "image", "video", "tryit", "quiz"] },
      "content": { "type": "string" },
      "language": { "type": "string" },
      "options": { "type": "object" }
    },
    "required": ["type"]
  }
}
```

---

## 4. API Design

### 4.1 API Standards

| Aspect | Standard |
|--------|----------|
| Base URL | `/api` |
| Versioning | URI path: `/api/v1/...` |
| Format | JSON |
| Authentication | Bearer Token (JWT) |
| Date Format | ISO 8601 (UTC) |
| Pagination | `page` and `limit` query params |

### 4.2 Authentication Endpoints

```yaml
POST /api/auth/register:
  description: Register new user
  request:
    body:
      email: string (required, email format)
      password: string (required, min 8 chars)
      full_name: string (required)
      role: string (optional, default: "user")
  response:
    201:
      access_token: string
      refresh_token: string
      token_type: "bearer"
      user: UserSchema
    400: ValidationError
    409: EmailExistsError

POST /api/auth/login:
  description: Authenticate user
  request:
    body:
      email: string (required)
      password: string (required)
  response:
    200:
      access_token: string
      refresh_token: string
      token_type: "bearer"
      user: UserSchema
    401: InvalidCredentialsError
    403: AccountLockedError

POST /api/auth/refresh:
  description: Refresh access token
  request:
    body:
      refresh_token: string (required)
  response:
    200:
      access_token: string
      token_type: "bearer"
    401: InvalidTokenError

GET /api/auth/me:
  description: Get current user
  headers:
    Authorization: Bearer <token>
  response:
    200: UserSchema
    401: UnauthorizedError
```

### 4.3 Jobs Endpoints

```yaml
GET /api/jobs:
  description: List jobs with filters
  query:
    q: string (search query)
    location: string
    job_type: string
    experience_level: string
    remote: boolean
    page: integer (default: 1)
    limit: integer (default: 20)
  response:
    200:
      jobs: JobSchema[]
      pagination: PaginationSchema

GET /api/jobs/{id}:
  description: Get job details
  params:
    id: UUID
  response:
    200: JobDetailSchema
    404: NotFoundError

POST /api/jobs:
  description: Create job posting
  auth: required (hiring_manager, company_admin, super_admin)
  request:
    body: JobCreateSchema
  response:
    201: JobSchema
    400: ValidationError

POST /api/jobs/{id}/apply:
  description: Apply to job
  auth: required
  params:
    id: UUID
  request:
    body:
      answers: AnswerSchema[] (if questions exist)
  response:
    201:
      application_id: UUID
      match_score: number
      message: string
    400: ValidationError
    409: AlreadyAppliedError
```

### 4.4 Meetings Endpoints

```yaml
POST /api/meetings/rooms:
  description: Create meeting room
  auth: required
  request:
    body:
      title: string (required)
      meeting_type: string (default: "meeting")
      scheduled_at: datetime (optional)
      duration_minutes: integer (default: 60)
      participants: string[] (emails, optional)
  response:
    201:
      meeting: MeetingSchema
      join_url: string

GET /api/meetings/rooms/{room_id}:
  description: Get meeting details
  auth: required
  params:
    room_id: string
  response:
    200: MeetingDetailSchema
    404: NotFoundError

POST /api/meetings/rooms/{room_id}/join:
  description: Join meeting
  auth: required
  params:
    room_id: string
  response:
    200:
      connection: ConnectionSchema
      ice_servers: ICEServerSchema[]
      token: string

POST /api/meetings/rooms/{room_id}/leave:
  description: Leave meeting
  auth: required
  params:
    room_id: string
  response:
    200: { message: "Left meeting" }

POST /api/meetings/rooms/{room_id}/notes:
  description: Add interview notes
  auth: required
  params:
    room_id: string
  request:
    body:
      notes: string
      rating: integer (1-5)
      candidate_id: UUID (optional)
  response:
    201: NoteSchema
```

### 4.5 Pydantic Schemas

```python
# schemas/user.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: UUID
    role: str
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
```

```python
# schemas/job.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class QuestionSchema(BaseModel):
    id: str
    question: str
    type: str  # text, yesno, number, choice
    required: bool = False
    options: Optional[List[str]] = None

class JobCreate(BaseModel):
    title: str
    description: str
    company_id: Optional[UUID] = None
    location: Optional[str] = None
    job_type: Optional[str] = None
    experience_level: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    is_remote: bool = False
    skills: List[str] = []
    questions: List[QuestionSchema] = []

class JobResponse(BaseModel):
    id: UUID
    title: str
    company: Optional[CompanyBriefSchema]
    location: Optional[str]
    job_type: Optional[str]
    experience_level: Optional[str]
    salary_min: Optional[int]
    salary_max: Optional[int]
    is_remote: bool
    skills: List[str]
    status: str
    created_at: datetime
    applicants_count: int = 0
    match_score: Optional[float] = None

    class Config:
        from_attributes = True
```

---

## 5. Frontend Design

### 5.1 Component Hierarchy

```
App
├── ThemeProvider
├── AuthProvider
├── BrowserRouter
│   └── Routes
│       ├── PublicLayout
│       │   ├── Navbar
│       │   ├── Home
│       │   ├── Login
│       │   ├── Signup
│       │   └── Footer
│       │
│       ├── AuthenticatedLayout
│       │   ├── AppHeader
│       │   │   ├── Logo
│       │   │   ├── SearchBar
│       │   │   ├── Notifications
│       │   │   ├── Messages
│       │   │   └── ProfileMenu
│       │   │
│       │   ├── MainContent
│       │   │   ├── NetworkLayout
│       │   │   │   ├── NetworkFeed
│       │   │   │   ├── MyNetwork
│       │   │   │   ├── Groups
│       │   │   │   ├── Events
│       │   │   │   └── Combinator
│       │   │   │
│       │   │   ├── Learn
│       │   │   │   ├── CourseCatalog
│       │   │   │   └── TutorialPage
│       │   │   │       ├── Sidebar
│       │   │   │       ├── LessonContent
│       │   │   │       └── CodeEditor
│       │   │   │
│       │   │   ├── Jobs
│       │   │   │   ├── JobListings
│       │   │   │   ├── JobDetails
│       │   │   │   └── JobApply
│       │   │   │
│       │   │   ├── ATS
│       │   │   │   ├── Pipeline
│       │   │   │   ├── JobPostings
│       │   │   │   ├── Calendar
│       │   │   │   └── Scheduling
│       │   │   │
│       │   │   ├── VideoRoom
│       │   │   ├── MeetingLobby
│       │   │   ├── IDE
│       │   │   └── Profile
│       │   │
│       │   └── BottomNav
│       │
│       └── AdminLayout
│           ├── SuperAdmin
│           └── LearnAdmin
```

### 5.2 State Management Pattern

```typescript
// AuthContext.tsx
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchCurrentUser();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    setState({
      user: response.data.user,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 5.3 API Service Pattern

```typescript
// services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('/auth/refresh', { refresh_token: refreshToken });
        localStorage.setItem('access_token', response.data.access_token);
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 5.4 Custom Hooks

```typescript
// hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useApi<T>(url: string, options = {}): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(url, options);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// hooks/useMutation.ts
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = async (variables: TVariables) => {
    try {
      setLoading(true);
      const result = await mutationFn(variables);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, data };
}
```

---

## 6. Security Design

### 6.1 Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │     │   API    │     │   Auth   │     │ Database │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │
     │ POST /login    │                │                │
     │───────────────►│                │                │
     │                │                │                │
     │                │ validate_user()│                │
     │                │───────────────►│                │
     │                │                │                │
     │                │                │ SELECT user    │
     │                │                │───────────────►│
     │                │                │                │
     │                │                │ user data      │
     │                │                │◄───────────────│
     │                │                │                │
     │                │ verify_password()               │
     │                │                │                │
     │                │ create_tokens()│                │
     │                │◄───────────────│                │
     │                │                │                │
     │ {access_token, │                │                │
     │  refresh_token}│                │                │
     │◄───────────────│                │                │
     │                │                │                │
```

### 6.2 JWT Token Structure

```python
# Access Token Payload
{
    "sub": "user_uuid",           # Subject (user ID)
    "email": "user@example.com",  # User email
    "role": "user",               # User role
    "iat": 1704326400,           # Issued at
    "exp": 1704412800,           # Expires (24h)
    "type": "access"             # Token type
}

# Refresh Token Payload
{
    "sub": "user_uuid",
    "iat": 1704326400,
    "exp": 1704931200,           # Expires (7d)
    "type": "refresh"
}
```

### 6.3 Password Security

```python
# Password hashing with bcrypt
from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12  # Cost factor
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Password validation
def validate_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[0-9]', password):
        return False
    return True
```

### 6.4 Rate Limiting

```python
# Rate limiting middleware
from fastapi import Request, HTTPException
from collections import defaultdict
import time

class RateLimiter:
    def __init__(self, requests_per_minute: int = 100):
        self.requests_per_minute = requests_per_minute
        self.requests = defaultdict(list)
    
    async def __call__(self, request: Request):
        client_ip = request.client.host
        now = time.time()
        
        # Clean old requests
        self.requests[client_ip] = [
            req_time for req_time in self.requests[client_ip]
            if now - req_time < 60
        ]
        
        if len(self.requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later."
            )
        
        self.requests[client_ip].append(now)
```

### 6.5 Input Sanitization

```python
import re
import html
from typing import Any

def sanitize_input(value: Any) -> Any:
    if isinstance(value, str):
        # Remove potential XSS
        value = html.escape(value)
        # Remove SQL injection patterns
        value = re.sub(r'[;\'"\\]', '', value)
        return value.strip()
    elif isinstance(value, dict):
        return {k: sanitize_input(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [sanitize_input(v) for v in value]
    return value
```

---

## 7. Performance Design

### 7.1 Caching Strategy

```python
# Redis caching implementation
import redis
import json
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache(ttl_seconds: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
            
            # Execute function
            result = await func(*args, **kwargs)
            
            # Store in cache
            redis_client.setex(cache_key, ttl_seconds, json.dumps(result))
            
            return result
        return wrapper
    return decorator

# Usage
@cache(ttl_seconds=300)
async def get_course_catalog():
    # Expensive database query
    return await db.query(Course).all()
```

### 7.2 Database Query Optimization

```python
# Eager loading relationships
from sqlalchemy.orm import selectinload, joinedload

# Bad: N+1 queries
jobs = await db.query(Job).all()
for job in jobs:
    print(job.company.name)  # Additional query per job

# Good: Single query with join
jobs = await db.query(Job).options(
    joinedload(Job.company)
).all()

# Pagination
async def get_paginated_jobs(page: int = 1, limit: int = 20):
    offset = (page - 1) * limit
    
    total = await db.query(func.count(Job.id)).scalar()
    jobs = await db.query(Job)\
        .options(joinedload(Job.company))\
        .order_by(Job.created_at.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()
    
    return {
        "items": jobs,
        "pagination": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    }
```

### 7.3 Frontend Performance

```typescript
// Code splitting with React.lazy
const VideoRoom = React.lazy(() => import('./pages/techie/VideoRoom'));
const IDE = React.lazy(() => import('./pages/techie/IDEPage'));

// Route-based splitting
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/meet/:roomId" element={<VideoRoom />} />
    <Route path="/ide" element={<IDE />} />
  </Routes>
</Suspense>

// Memoization
const JobCard = React.memo(({ job }: { job: Job }) => {
  return (
    <Card>
      <CardContent>
        <Typography>{job.title}</Typography>
      </CardContent>
    </Card>
  );
});

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

const JobsList = ({ jobs }) => (
  <FixedSizeList
    height={600}
    itemCount={jobs.length}
    itemSize={120}
  >
    {({ index, style }) => (
      <div style={style}>
        <JobCard job={jobs[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

---

## 8. Integration Design

### 8.1 WebRTC Video Conferencing

```typescript
// WebRTC Connection Setup
class WebRTCConnection {
  private peerConnection: RTCPeerConnection;
  private localStream: MediaStream;
  private signalingChannel: WebSocket;

  constructor(roomId: string) {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        // Add TURN server for production
        {
          urls: 'turn:turn.vertechie.com:3478',
          username: 'user',
          credential: 'pass'
        }
      ]
    });

    this.signalingChannel = new WebSocket(
      `wss://signal.vertechie.com/${roomId}`
    );

    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingChannel.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate
        }));
      }
    };

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      // Display remote video
    };

    // Handle signaling messages
    this.signalingChannel.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'offer':
          await this.handleOffer(message.offer);
          break;
        case 'answer':
          await this.handleAnswer(message.answer);
          break;
        case 'ice-candidate':
          await this.handleIceCandidate(message.candidate);
          break;
      }
    };
  }

  async startCall() {
    this.localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.signalingChannel.send(JSON.stringify({
      type: 'offer',
      offer: offer
    }));
  }
}
```

### 8.2 Calendar Integration (Google Calendar)

```python
# Google Calendar API integration
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

async def create_google_calendar_event(
    credentials: Credentials,
    event_data: dict
) -> dict:
    service = build('calendar', 'v3', credentials=credentials)
    
    event = {
        'summary': event_data['title'],
        'description': event_data.get('description', ''),
        'start': {
            'dateTime': event_data['start_time'].isoformat(),
            'timeZone': 'UTC',
        },
        'end': {
            'dateTime': event_data['end_time'].isoformat(),
            'timeZone': 'UTC',
        },
        'attendees': [
            {'email': attendee} 
            for attendee in event_data.get('attendees', [])
        ],
        'conferenceData': {
            'createRequest': {
                'conferenceSolutionKey': {'type': 'hangoutsMeet'},
                'requestId': str(uuid.uuid4())
            }
        } if event_data.get('add_video_link') else None
    }
    
    result = service.events().insert(
        calendarId='primary',
        body=event,
        conferenceDataVersion=1
    ).execute()
    
    return result
```

---

## 9. Testing Strategy

### 9.1 Test Pyramid

```
                    ┌───────────┐
                    │    E2E    │  (5%)
                    │   Tests   │
                ┌───┴───────────┴───┐
                │   Integration     │  (15%)
                │      Tests        │
            ┌───┴───────────────────┴───┐
            │       Unit Tests          │  (80%)
            │    (Components, Utils,    │
            │     Services, Hooks)      │
            └───────────────────────────┘
```

### 9.2 Backend Testing (Pytest)

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import get_db
from app.db.base import Base

SQLALCHEMY_TEST_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_TEST_URL)
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)

# tests/test_auth.py
def test_register_user(client):
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass123",
        "full_name": "Test User"
    })
    assert response.status_code == 201
    assert "access_token" in response.json()

def test_login_user(client):
    # First register
    client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass123",
        "full_name": "Test User"
    })
    
    # Then login
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "SecurePass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_invalid_credentials(client):
    response = client.post("/api/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "WrongPass"
    })
    assert response.status_code == 401
```

### 9.3 Frontend Testing (Jest + RTL)

```typescript
// __tests__/Login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../pages/Login';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  test('renders login form', () => {
    renderLogin();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('shows error on invalid credentials', async () => {
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid@test.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  test('redirects on successful login', async () => {
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'SecurePass123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(window.location.pathname).toBe('/techie');
    });
  });
});
```

---

## 10. Deployment Design

### 10.1 Environment Configuration

```yaml
# Development
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///./vertechie.db
SECRET_KEY=dev-secret-key
CORS_ORIGINS=["http://localhost:5173"]

# Staging
DEBUG=false
DATABASE_URL=postgresql+asyncpg://user:pass@staging-db:5432/vertechie
SECRET_KEY=${STAGING_SECRET_KEY}
CORS_ORIGINS=["https://staging.vertechie.com"]

# Production
DEBUG=false
DATABASE_URL=postgresql+asyncpg://user:pass@prod-db:5432/vertechie
SECRET_KEY=${PROD_SECRET_KEY}
CORS_ORIGINS=["https://vertechie.com","https://www.vertechie.com"]
```

### 10.2 Docker Configuration

```dockerfile
# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 10.3 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd vertechie_be
          pip install -r requirements.txt
          pip install pytest
      
      - name: Run tests
        run: |
          cd vertechie_be
          pytest

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: |
          docker build -t vertechie-backend ./vertechie_be
          docker build -t vertechie-frontend ./vertechie_fe-main/frontend
      
      - name: Push to registry
        run: |
          docker push vertechie-backend
          docker push vertechie-frontend
      
      - name: Deploy
        run: |
          # Deploy to cloud provider
```

---

*End of Technical Design Document*

