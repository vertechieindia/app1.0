# VerTechie - Functional Specification Document (FSD)

## Document Information
| Field | Value |
|-------|-------|
| **Document Title** | VerTechie Platform - Functional Specification Document |
| **Version** | 1.0 |
| **Date** | January 2026 |
| **Status** | Complete |
| **Classification** | Internal |

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [User Personas](#2-user-personas)
3. [User Stories](#3-user-stories)
4. [Functional Specifications](#4-functional-specifications)
5. [Screen Specifications](#5-screen-specifications)
6. [Workflow Specifications](#6-workflow-specifications)
7. [Business Rules](#7-business-rules)
8. [Acceptance Criteria](#8-acceptance-criteria)
9. [Error Handling](#9-error-handling)
10. [Appendix](#10-appendix)

---

## 1. Introduction

### 1.1 Purpose
This Functional Specification Document (FSD) provides detailed functional descriptions of the VerTechie platform, including user interactions, system behaviors, and feature specifications. It serves as a bridge between business requirements and technical implementation.

### 1.2 Scope
This document covers all functional aspects of the VerTechie platform including:
- User authentication and authorization
- Learning platform functionality
- Job portal and application process
- Video conferencing features
- Social networking capabilities
- Administrative functions

### 1.3 Definitions

| Term | Definition |
|------|------------|
| Techie | A registered user of the platform (tech professional) |
| ATS | Applicant Tracking System for managing job applications |
| CMS | Company Management System for employer pages |
| SMS | School Management System for educational institutions |
| WebRTC | Web Real-Time Communication for video calls |

---

## 2. User Personas

### 2.1 Primary Personas

#### Persona 1: Alex - The Job Seeker
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ALEX - Junior Software Developer                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  Age: 24          Location: Bangalore, India         Experience: 2 years    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Goals:                                                                     │
│  • Find a better job opportunity                                            │
│  • Learn new technologies (React, TypeScript)                               │
│  • Build a strong professional network                                      │
│  • Showcase projects and skills                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  Pain Points:                                                               │
│  • Too many job portals, scattered applications                             │
│  • No feedback on applications                                              │
│  • Learning resources are expensive or outdated                             │
│  • Difficult to practice coding regularly                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Platform Usage:                                                            │
│  • Daily: Learning tutorials, coding practice                               │
│  • Weekly: Job applications, networking                                     │
│  • Monthly: Profile updates, blog reading                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Persona 2: Sarah - The Hiring Manager
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SARAH - Engineering Manager at Tech Startup                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Age: 35          Location: San Francisco, USA       Experience: 12 years   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Goals:                                                                     │
│  • Hire qualified developers quickly                                        │
│  • Reduce time-to-hire                                                      │
│  • Improve candidate quality                                                │
│  • Build employer brand                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Pain Points:                                                               │
│  • Too many unqualified applicants                                          │
│  • Scheduling interviews is time-consuming                                  │
│  • No integrated video interview solution                                   │
│  • Difficult to assess technical skills                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Platform Usage:                                                            │
│  • Daily: Review applications, schedule interviews                          │
│  • Weekly: Video interviews, pipeline management                            │
│  • Monthly: Analytics review, job posting updates                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Persona 3: Dr. Kumar - School Administrator
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  DR. KUMAR - Placement Director at Engineering College                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  Age: 52          Location: Chennai, India          Experience: 25 years    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Goals:                                                                     │
│  • Improve student placement rates                                          │
│  • Track alumni success                                                     │
│  • Connect students with companies                                          │
│  • Showcase institution achievements                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  Pain Points:                                                               │
│  • Manual tracking of placements                                            │
│  • Limited industry connections                                             │
│  • No centralized alumni network                                            │
│  • Difficulty measuring program effectiveness                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  Platform Usage:                                                            │
│  • Daily: Student management, placement updates                             │
│  • Weekly: Program management, company outreach                             │
│  • Monthly: Analytics, report generation                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Persona 4: Mike - The Content Learner
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  MIKE - Career Changer (Finance to Tech)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  Age: 30          Location: London, UK              Experience: 0 in tech   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Goals:                                                                     │
│  • Learn web development from scratch                                       │
│  • Build portfolio projects                                                 │
│  • Get first tech job                                                       │
│  • Connect with tech community                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  Pain Points:                                                               │
│  • Overwhelmed by learning resources                                        │
│  • Not sure where to start                                                  │
│  • No hands-on practice environment                                         │
│  • No guidance on career path                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│  Platform Usage:                                                            │
│  • Daily: Learning tutorials (2-3 hours)                                    │
│  • Weekly: Coding challenges, project building                              │
│  • Monthly: Community events, networking                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. User Stories

### 3.1 Authentication Module

| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| US-AUTH-01 | As a new user, I want to register with my email so that I can access the platform | High | Email verification sent, profile created |
| US-AUTH-02 | As a user, I want to login with my credentials so that I can access my account | High | JWT token generated, redirected to dashboard |
| US-AUTH-03 | As a user, I want to reset my password if I forget it | Medium | Reset email sent, password updated successfully |
| US-AUTH-04 | As a new user, I want to complete face verification so that my identity is confirmed | High | 5 positions captured, verification complete |
| US-AUTH-05 | As a user, I want to logout securely so that my session ends | High | Token invalidated, redirected to login |

### 3.2 Learning Module

| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| US-LEARN-01 | As a learner, I want to browse available courses so that I can choose what to learn | High | Courses displayed with categories, difficulty levels |
| US-LEARN-02 | As a learner, I want to read interactive tutorials so that I can learn step by step | High | Tutorial loads with sidebar, progress tracked |
| US-LEARN-03 | As a learner, I want to practice code in the browser so that I can apply what I learned | High | Code editor works, output previews correctly |
| US-LEARN-04 | As a learner, I want to track my progress so that I know how much I've completed | Medium | Progress bar shows, completed lessons marked |
| US-LEARN-05 | As a learner, I want to take quizzes so that I can test my knowledge | Medium | Quiz loads, score calculated, feedback shown |
| US-LEARN-06 | As a learner, I want to earn certificates so that I can showcase my skills | Low | Certificate generated after completion |

### 3.3 Jobs Module

| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| US-JOBS-01 | As a job seeker, I want to search jobs by keywords so that I find relevant positions | High | Search returns matching jobs, filters work |
| US-JOBS-02 | As a job seeker, I want to filter jobs by location, type, and experience so that I narrow down options | High | Filters apply correctly, results update |
| US-JOBS-03 | As a job seeker, I want to view job details so that I understand the requirements | High | Full job description, requirements, benefits shown |
| US-JOBS-04 | As a job seeker, I want to apply to a job so that I can be considered for the position | High | Application submitted, confirmation shown |
| US-JOBS-05 | As a job seeker, I want to answer screening questions so that the employer can assess my fit | High | Questions displayed, answers saved |
| US-JOBS-06 | As a job seeker, I want to see my match score so that I know how qualified I am | Medium | Match percentage calculated and displayed |
| US-JOBS-07 | As a job seeker, I want to bookmark jobs so that I can apply later | Low | Bookmark saved, appears in saved list |

### 3.4 ATS Module (Hiring Manager)

| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| US-ATS-01 | As a hiring manager, I want to post a new job so that I can attract candidates | High | Job created with all details, visible to users |
| US-ATS-02 | As a hiring manager, I want to view applicants in a pipeline so that I can manage recruitment | High | Kanban board shows stages, candidates displayed |
| US-ATS-03 | As a hiring manager, I want to move candidates through stages so that I track their progress | High | Drag-drop works, stage updated |
| US-ATS-04 | As a hiring manager, I want to schedule interviews so that I can meet with candidates | High | Interview scheduled, calendar event created |
| US-ATS-05 | As a hiring manager, I want to conduct video interviews so that I can assess candidates remotely | High | Video call works, notes can be taken |
| US-ATS-06 | As a hiring manager, I want to rate candidates so that I can compare them | Medium | Rating saved, visible in candidate profile |
| US-ATS-07 | As a hiring manager, I want to view analytics so that I understand my hiring performance | Medium | Charts show metrics, data is accurate |

### 3.5 Video Conferencing Module

| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| US-VIDEO-01 | As a user, I want to test my camera/mic before joining so that I'm prepared | High | Preview works, device selection available |
| US-VIDEO-02 | As a user, I want to join a video call so that I can meet with others | High | Video/audio streams work, participants visible |
| US-VIDEO-03 | As a user, I want to mute/unmute myself so that I control when I'm heard | High | Audio toggles correctly, status shown |
| US-VIDEO-04 | As a user, I want to turn my camera on/off so that I control my video | High | Video toggles correctly, avatar shown when off |
| US-VIDEO-05 | As a user, I want to share my screen so that I can present content | High | Screen shared, visible to others |
| US-VIDEO-06 | As a user, I want to chat during the call so that I can share text/links | Medium | Chat works, messages appear in real-time |
| US-VIDEO-07 | As an interviewer, I want to take notes so that I remember key points | Medium | Notes saved, accessible after call |
| US-VIDEO-08 | As an interviewer, I want to rate the candidate so that I record my assessment | Medium | Rating saved with notes |

### 3.6 Network Module

| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| US-NET-01 | As a user, I want to see a news feed so that I stay updated | High | Posts load, sorted by recency/relevance |
| US-NET-02 | As a user, I want to create posts so that I share with my network | High | Post created, visible in feed |
| US-NET-03 | As a user, I want to like and comment so that I engage with content | High | Reactions saved, comments appear |
| US-NET-04 | As a user, I want to connect with others so that I grow my network | High | Connection request sent, status tracked |
| US-NET-05 | As a user, I want to join groups so that I engage with communities | Medium | Group joined, posts visible |
| US-NET-06 | As a user, I want to create events so that I organize meetups | Medium | Event created, RSVPs collected |

### 3.7 Profile Module

| ID | User Story | Priority | Acceptance Criteria |
|----|------------|----------|---------------------|
| US-PROF-01 | As a user, I want to edit my profile so that I showcase my skills | High | Changes saved, profile updated |
| US-PROF-02 | As a user, I want to add my experience so that employers see my history | High | Experience added, displayed correctly |
| US-PROF-03 | As a user, I want to list my skills so that I'm found in searches | High | Skills added, endorsements enabled |
| US-PROF-04 | As a user, I want to see my contribution heatmap so that I track my activity | Medium | Heatmap renders, syncs with activity |
| US-PROF-05 | As a user, I want to share my profile URL so that others can view it | Medium | URL works, public profile loads |

---

## 4. Functional Specifications

### 4.1 Authentication Functions

#### FS-AUTH-01: User Registration

**Function Name:** Register New User

**Description:** Allows new users to create an account on the platform.

**Input:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format, unique |
| password | string | Yes | Min 8 chars, 1 uppercase, 1 number |
| full_name | string | Yes | 2-100 characters |
| role | string | Yes | Enum: user, company_admin, school_admin |

**Process:**
1. Validate all input fields
2. Check email uniqueness in database
3. Hash password using bcrypt (12 rounds)
4. Create user record with status "pending"
5. Initiate face verification flow
6. Upon face verification completion, update status to "active"
7. Generate JWT tokens
8. Return tokens and user profile

**Output:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

**Error Cases:**
| Error Code | Condition | Message |
|------------|-----------|---------|
| 400 | Invalid email format | "Invalid email format" |
| 400 | Weak password | "Password must be at least 8 characters with 1 uppercase and 1 number" |
| 409 | Email exists | "Email already registered" |
| 500 | Server error | "Registration failed. Please try again." |

---

#### FS-AUTH-02: User Login

**Function Name:** Authenticate User

**Description:** Validates user credentials and issues authentication tokens.

**Input:**
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Non-empty |

**Process:**
1. Check if account is locked (brute force protection)
2. Retrieve user by email
3. Verify password hash
4. If failed: record attempt, check lockout threshold
5. If success: reset failed attempts, generate tokens
6. Return tokens and user data

**Output:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

**Error Cases:**
| Error Code | Condition | Message |
|------------|-----------|---------|
| 401 | Invalid credentials | "Invalid email or password" |
| 403 | Account locked | "Account locked. Try again in 15 minutes." |
| 404 | User not found | "Invalid email or password" |

---

### 4.2 Learning Platform Functions

#### FS-LEARN-01: Get Course Catalog

**Function Name:** List All Courses

**Description:** Retrieves all available courses with filtering options.

**Input:**
| Field | Type | Required | Default |
|-------|------|----------|---------|
| category | string | No | All |
| difficulty | string | No | All |
| search | string | No | None |
| page | int | No | 1 |
| limit | int | No | 20 |

**Process:**
1. Build query with filters
2. Execute paginated query
3. Include course metadata (lessons count, duration, rating)
4. Return course list with pagination info

**Output:**
```json
{
  "courses": [
    {
      "id": "html-fundamentals",
      "title": "HTML Fundamentals",
      "category": "Frontend",
      "difficulty": "Beginner",
      "lessons_count": 25,
      "duration_hours": 4,
      "rating": 4.8,
      "enrolled_count": 15000,
      "thumbnail": "/images/courses/html.png"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

#### FS-LEARN-02: Get Lesson Content

**Function Name:** Retrieve Lesson

**Description:** Gets the content of a specific lesson including interactive elements.

**Input:**
| Field | Type | Required |
|-------|------|----------|
| course_id | string | Yes |
| lesson_slug | string | Yes |

**Process:**
1. Validate course and lesson exist
2. Check user enrollment (if required)
3. Retrieve lesson content blocks
4. Include code examples, exercises
5. Get adjacent lessons (prev/next)
6. Return complete lesson data

**Output:**
```json
{
  "lesson": {
    "id": "html-introduction",
    "title": "Introduction to HTML",
    "content": [
      {
        "type": "text",
        "content": "HTML stands for HyperText Markup Language..."
      },
      {
        "type": "code",
        "language": "html",
        "code": "<!DOCTYPE html>\n<html>..."
      },
      {
        "type": "try-it-yourself",
        "initial_code": "<h1>Hello</h1>",
        "expected_output": "rendered HTML"
      }
    ],
    "prev_lesson": "getting-started",
    "next_lesson": "html-elements"
  },
  "progress": {
    "completed": false,
    "course_progress": 15
  }
}
```

---

### 4.3 Jobs Functions

#### FS-JOBS-01: Search Jobs

**Function Name:** Search Job Listings

**Description:** Searches and filters job listings based on criteria.

**Input:**
| Field | Type | Required | Default |
|-------|------|----------|---------|
| query | string | No | None |
| location | string | No | All |
| job_type | string | No | All |
| experience_level | string | No | All |
| salary_min | int | No | None |
| salary_max | int | No | None |
| remote | boolean | No | false |
| page | int | No | 1 |
| limit | int | No | 20 |

**Process:**
1. Build search query with full-text search
2. Apply all filters
3. Sort by relevance/date
4. Calculate match score for authenticated users
5. Return paginated results

**Output:**
```json
{
  "jobs": [
    {
      "id": "job-123",
      "title": "Senior Frontend Developer",
      "company": {
        "id": "comp-456",
        "name": "TechCorp",
        "logo": "/logos/techcorp.png",
        "verified": true
      },
      "location": "San Francisco, CA",
      "job_type": "Full-time",
      "experience_level": "Senior",
      "salary_range": "$120k - $160k",
      "remote": true,
      "posted_at": "2026-01-01T10:00:00Z",
      "applicants_count": 45,
      "match_score": 85
    }
  ],
  "pagination": {
    "total": 250,
    "page": 1,
    "limit": 20,
    "pages": 13
  }
}
```

---

#### FS-JOBS-02: Apply to Job

**Function Name:** Submit Job Application

**Description:** Submits a user's application to a job with screening question answers.

**Input:**
| Field | Type | Required |
|-------|------|----------|
| job_id | string | Yes |
| answers | array | Yes (if questions exist) |

**Process:**
1. Validate job exists and is active
2. Check user hasn't already applied
3. Validate all required questions answered
4. Calculate profile match score
5. Create application record
6. Notify hiring manager (async)
7. Return confirmation

**Match Score Calculation:**
```
score = 0
for each required_skill in job.skills:
    if required_skill in user.skills:
        score += skill_weight
        
for each requirement in job.requirements:
    if user.experience matches requirement:
        score += experience_weight
        
final_score = (score / max_possible_score) * 100
```

**Output:**
```json
{
  "application_id": "app-789",
  "status": "submitted",
  "match_score": 85,
  "message": "Application submitted successfully!",
  "next_steps": "The hiring manager will review your application."
}
```

---

### 4.4 Video Conferencing Functions

#### FS-VIDEO-01: Create Meeting Room

**Function Name:** Create Video Meeting

**Description:** Creates a new video conferencing room.

**Input:**
| Field | Type | Required | Default |
|-------|------|----------|---------|
| title | string | Yes | - |
| meeting_type | string | No | "meeting" |
| scheduled_at | datetime | No | null (instant) |
| duration_minutes | int | No | 60 |
| participants | array | No | [] |

**Process:**
1. Generate unique room ID
2. Create meeting record
3. Generate join URL
4. Send invitations (if participants provided)
5. Return meeting details

**Output:**
```json
{
  "meeting": {
    "id": "mtg-abc123",
    "room_id": "vt-interview-abc123",
    "title": "Technical Interview",
    "type": "interview",
    "host_id": "user-123",
    "join_url": "https://vertechie.com/techie/lobby/vt-interview-abc123",
    "scheduled_at": "2026-01-15T14:00:00Z",
    "duration_minutes": 60,
    "status": "scheduled"
  }
}
```

---

#### FS-VIDEO-02: Join Meeting

**Function Name:** Join Video Call

**Description:** Joins an existing video meeting room.

**Input:**
| Field | Type | Required |
|-------|------|----------|
| room_id | string | Yes |
| audio_enabled | boolean | No |
| video_enabled | boolean | No |

**Process:**
1. Validate room exists
2. Check user permissions
3. Get ICE server configuration
4. Generate connection token
5. Update participant count
6. Return connection details

**Output:**
```json
{
  "connection": {
    "signaling_server": "wss://signal.vertechie.com",
    "ice_servers": [
      {"urls": "stun:stun.l.google.com:19302"},
      {"urls": "turn:turn.vertechie.com", "username": "...", "credential": "..."}
    ],
    "token": "connection-token-xyz",
    "room_info": {
      "id": "vt-interview-abc123",
      "participants": 2,
      "is_recording": false
    }
  }
}
```

---

### 4.5 Calendar Functions

#### FS-CAL-01: Create Calendar Event

**Function Name:** Create Event

**Description:** Creates a new calendar event with optional video link.

**Input:**
| Field | Type | Required |
|-------|------|----------|
| title | string | Yes |
| date | string | Yes |
| time | string | Yes |
| duration | int | Yes |
| category | string | No |
| location | string | No |
| description | string | No |
| attendees | array | No |
| generate_video_link | boolean | No |

**Process:**
1. Validate event details
2. Check for conflicts (optional)
3. If generate_video_link: create meeting room
4. Create calendar event
5. Send invitations to attendees
6. Return event with video link

**Output:**
```json
{
  "event": {
    "id": "evt-123",
    "title": "Technical Interview - John Doe",
    "date": "2026-01-15",
    "time": "14:00",
    "duration": 60,
    "category": "interview",
    "video_link": "https://vertechie.com/techie/lobby/vt-abc123",
    "attendees": [
      {"email": "interviewer@company.com", "status": "pending"},
      {"email": "candidate@email.com", "status": "pending"}
    ]
  }
}
```

---

## 5. Screen Specifications

### 5.1 Login Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LOGIN SCREEN                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          [Logo] VerTechie                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Email Address *                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │  user@example.com                                                │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  Password *                                                           │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │  ••••••••                                              [👁️]     │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  [Forgot Password?]                                                   │   │
│  │                                                                       │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │   │
│  │  │                         SIGN IN                                  │ │   │
│  │  └─────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                       │   │
│  │  ─────────────────────── OR ───────────────────────                  │   │
│  │                                                                       │   │
│  │  [Create an Account]                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Elements:
1. Logo (clickable → home)
2. Email input (required, email validation)
3. Password input (required, toggle visibility)
4. Forgot password link (→ password reset)
5. Sign In button (primary action)
6. Create Account link (→ signup)

Behaviors:
- Enter key submits form
- Show loading spinner on submit
- Display error messages inline
- Lock after 5 failed attempts
```

---

### 5.2 Dashboard Screen (Techie)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [≡] VerTechie    [🔍 Search...]                    [🔔] [💬] [👤 Profile] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐  ┌────────────────────────────────────────────────────┐  │
│  │  NAVIGATION  │  │                    MAIN CONTENT                     │  │
│  │              │  │                                                      │  │
│  │  🏠 Home     │  │  Welcome back, Alex!                                │  │
│  │  📚 Learn    │  │                                                      │  │
│  │  💻 Practice │  │  ┌──────────────────┐ ┌──────────────────┐          │  │
│  │  💼 Jobs     │  │  │  Continue        │ │  Your Stats      │          │  │
│  │  📝 Blogs    │  │  │  Learning        │ │                  │          │  │
│  │  📊 ATS      │  │  │                  │ │  Problems: 45    │          │  │
│  │  📅 Calendar │  │  │  [React Course]  │ │  Streak: 7 days  │          │  │
│  │  ⚙️ Settings │  │  │  Progress: 65%   │ │  Rank: 1,234     │          │  │
│  │              │  │  └──────────────────┘ └──────────────────┘          │  │
│  │              │  │                                                      │  │
│  │              │  │  ┌────────────────────────────────────────────────┐ │  │
│  │              │  │  │           CONTRIBUTION HEATMAP                  │ │  │
│  │              │  │  │  [GitHub-style activity visualization]          │ │  │
│  │              │  │  └────────────────────────────────────────────────┘ │  │
│  │              │  │                                                      │  │
│  │              │  │  ┌──────────────────┐ ┌──────────────────┐          │  │
│  │              │  │  │  Recommended     │ │  Recent Activity │          │  │
│  │              │  │  │  Jobs (5)        │ │                  │          │  │
│  │              │  │  │                  │ │  - Applied to... │          │  │
│  │              │  │  │  [View All →]    │ │  - Completed...  │          │  │
│  │              │  │  └──────────────────┘ └──────────────────┘          │  │
│  └──────────────┘  └────────────────────────────────────────────────────┘  │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [🏠 Home] [📚 Learn] [💻 Practice] [💼 Jobs] [👤 Profile]                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.3 Video Room Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔴 Recording   🔒 Encrypted   Technical Interview            ⏱️ 00:15:32  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │                     ┌─────────────────────┐                        │   │
│  │                     │                     │                        │   │
│  │                     │    PARTICIPANT 1    │                        │   │
│  │                     │    (Main Speaker)   │                        │   │
│  │                     │                     │                        │   │
│  │                     │    [Video Feed]     │                        │   │
│  │                     │                     │                        │   │
│  │                     │    John Smith       │                        │   │
│  │                     │    🎤 Speaking      │                        │   │
│  │                     └─────────────────────┘                        │   │
│  │                                                                     │   │
│  │   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                 │   │
│  │   │  You    │ │ Sarah   │ │  Mike   │ │  Lisa   │                 │   │
│  │   │ (Host)  │ │         │ │  🔇     │ │  📷 Off │                 │   │
│  │   └─────────┘ └─────────┘ └─────────┘ └─────────┘                 │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   [🎤 Mute]  [📷 Video]  │  [🖥️ Share]  [⏺️ Record]  [✋ Raise]  [😊]     │
│                          │                                                  │
│   [💬 Chat (3)]  [👥 Participants (4)]  [⚙️ Settings]  │  [📞 Leave]      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.4 Tutorial Page Screen

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [≡] VerTechie                                           [🔔] [💬] [👤]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐  ┌───────────────────────────────────────────────┐   │
│  │   HTML Tutorial  │  │                LESSON CONTENT                  │   │
│  │   ───────────────│  │                                                │   │
│  │                  │  │  HTML Introduction                             │   │
│  │  📖 Introduction │  │  ═══════════════════                          │   │
│  │     ✅ What is   │  │                                                │   │
│  │     ✅ Editors   │  │  HTML is the standard markup language for     │   │
│  │     → Elements   │  │  creating web pages.                          │   │
│  │     ○ Attributes │  │                                                │   │
│  │     ○ Headings   │  │  • HTML stands for Hyper Text Markup Language │   │
│  │                  │  │  • HTML describes the structure of a web page │   │
│  │  📖 Basic HTML   │  │  • HTML elements tell the browser how to      │   │
│  │     ○ Paragraphs │  │    display content                            │   │
│  │     ○ Formatting │  │                                                │   │
│  │     ○ Links      │  │  ┌─────────────────────────────────────────┐  │   │
│  │                  │  │  │  Example Code                           │  │   │
│  │  📖 Forms        │  │  │  ```html                                │  │   │
│  │  📖 Tables       │  │  │  <!DOCTYPE html>                        │  │   │
│  │  📖 Semantics    │  │  │  <html>                                 │  │   │
│  │                  │  │  │    <head>                               │  │   │
│  │  ───────────────│  │  │      <title>My Page</title>             │  │   │
│  │  Progress: 12%   │  │  │    </head>                              │  │   │
│  │  ████░░░░░░░░░░░│  │  │    <body>                               │  │   │
│  │                  │  │  │      <h1>Hello World</h1>               │  │   │
│  │                  │  │  │    </body>                              │  │   │
│  │                  │  │  │  </html>                                │  │   │
│  │                  │  │  │  ```                                    │  │   │
│  │                  │  │  └─────────────────────────────────────────┘  │   │
│  │                  │  │                                                │   │
│  │                  │  │  ┌────────────────────┬────────────────────┐  │   │
│  │                  │  │  │   TRY IT YOURSELF  │      RESULT        │  │   │
│  │                  │  │  ├────────────────────┼────────────────────┤  │   │
│  │                  │  │  │ <h1>Hello</h1>     │  Hello             │  │   │
│  │                  │  │  │ <p>World</p>       │  World             │  │   │
│  │                  │  │  │                    │                    │  │   │
│  │                  │  │  │ [Run Code]         │                    │  │   │
│  │                  │  │  └────────────────────┴────────────────────┘  │   │
│  │                  │  │                                                │   │
│  │                  │  │  [◀ Previous]                    [Next ▶]     │   │
│  └──────────────────┘  └───────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Workflow Specifications

### 6.1 User Registration Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        USER REGISTRATION WORKFLOW                            │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   START     │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────┐
    │  User lands on      │
    │  Signup Page        │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Select Role        │
    │  • Techie           │
    │  • Company Admin    │
    │  • School Admin     │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Fill Registration  │
    │  Form               │
    │  • Full Name        │
    │  • Email            │
    │  • Password         │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐     ┌──────────────────┐
    │  Validate Input     │────►│  Show Errors     │
    └──────────┬──────────┘ No  │  Fix and Retry   │
               │                └────────┬─────────┘
               │ Yes                      │
               ▼                          │
    ┌─────────────────────┐              │
    │  Face Verification  │◄─────────────┘
    │  (5 Positions)      │
    │  • Center           │
    │  • Look Up          │
    │  • Look Down        │
    │  • Look Left        │
    │  • Look Right       │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐     ┌──────────────────┐
    │  Verification       │────►│  Retry Face      │
    │  Passed?            │ No  │  Verification    │
    └──────────┬──────────┘     └──────────────────┘
               │ Yes
               ▼
    ┌─────────────────────┐
    │  Create Account     │
    │  Generate JWT       │
    │  Store in DB        │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Redirect to        │
    │  Dashboard          │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────┐
    │    END      │
    └─────────────┘
```

---

### 6.2 Job Application Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        JOB APPLICATION WORKFLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐
    │   START     │
    └──────┬──────┘
           │
           ▼
    ┌─────────────────────┐
    │  User views Job     │
    │  Details page       │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Click "Apply Now"  │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐     ┌──────────────────┐
    │  Already Applied?   │────►│  Show "Already   │
    └──────────┬──────────┘ Yes │  Applied" Status │
               │                └──────────────────┘
               │ No
               ▼
    ┌─────────────────────┐
    │  Has Screening      │
    │  Questions?         │
    └──────────┬──────────┘
               │
         ┌─────┴─────┐
         │           │
    Yes  ▼           ▼ No
    ┌────────────┐   │
    │ Display    │   │
    │ Questions  │   │
    │ Form       │   │
    └─────┬──────┘   │
          │          │
          ▼          │
    ┌────────────┐   │
    │ User       │   │
    │ Answers    │   │
    │ Questions  │   │
    └─────┬──────┘   │
          │          │
          └────┬─────┘
               │
               ▼
    ┌─────────────────────┐
    │  Calculate Match    │
    │  Score based on:    │
    │  • Skills match     │
    │  • Experience match │
    │  • Requirements     │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Submit Application │
    │  • Save answers     │
    │  • Store score      │
    │  • Update status    │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Notify Hiring      │
    │  Manager (async)    │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │  Show Success       │
    │  • Match Score: 85% │
    │  • Application ID   │
    │  • Next Steps       │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────┐
    │    END      │
    └─────────────┘
```

---

### 6.3 Video Interview Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        VIDEO INTERVIEW WORKFLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

HIRING MANAGER FLOW                     CANDIDATE FLOW
─────────────────────                   ─────────────────

┌─────────────────┐                     
│ Schedule        │                     
│ Interview       │                     
└────────┬────────┘                     
         │                              
         ▼                              
┌─────────────────┐                     
│ System creates  │                     
│ meeting room &  │────────────────────►┌─────────────────┐
│ sends invite    │                     │ Candidate       │
└────────┬────────┘                     │ receives email  │
         │                              │ with link       │
         │                              └────────┬────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│ At scheduled    │                     │ Click link to   │
│ time, click     │                     │ join meeting    │
│ join link       │                     └────────┬────────┘
└────────┬────────┘                              │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│ MEETING LOBBY   │                     │ MEETING LOBBY   │
│ • Test camera   │                     │ • Test camera   │
│ • Test mic      │                     │ • Test mic      │
│ • Select devices│                     │ • Select devices│
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         └───────────────┬───────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │    VIDEO ROOM       │
              │ ┌─────────────────┐ │
              │ │ Participants    │ │
              │ │ connected via   │ │
              │ │ WebRTC          │ │
              │ └─────────────────┘ │
              │                     │
              │ Features:           │
              │ • Video/Audio       │
              │ • Screen Share      │
              │ • Chat              │
              │ • Recording         │
              └──────────┬──────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│ Interviewer     │             │ Candidate       │
│ takes notes     │             │ answers         │
│ • Technical     │             │ questions       │
│ • Behavioral    │             └─────────────────┘
│ • Rating        │             
└────────┬────────┘             
         │                      
         ▼                      
┌─────────────────┐             
│ End meeting     │             
│ Save notes      │             
│ Update pipeline │             
└─────────────────┘             
```

---

## 7. Business Rules

### 7.1 Authentication Rules

| ID | Rule | Description |
|----|------|-------------|
| BR-AUTH-01 | Password Complexity | Minimum 8 characters, at least 1 uppercase, 1 number |
| BR-AUTH-02 | Account Lockout | Lock account after 5 failed login attempts for 15 minutes |
| BR-AUTH-03 | Token Expiry | Access tokens expire in 24 hours, refresh tokens in 7 days |
| BR-AUTH-04 | Session Limit | Maximum 5 active sessions per user |
| BR-AUTH-05 | Face Verification | Required for all new registrations, 5 positions must be captured |

### 7.2 Learning Rules

| ID | Rule | Description |
|----|------|-------------|
| BR-LEARN-01 | Progress Tracking | Lesson marked complete only after viewing all content |
| BR-LEARN-02 | Quiz Attempts | Unlimited quiz attempts allowed |
| BR-LEARN-03 | Certificate Eligibility | Complete 100% of course and pass final quiz (≥70%) |
| BR-LEARN-04 | Course Order | Lessons within a section must be completed in order |

### 7.3 Jobs Rules

| ID | Rule | Description |
|----|------|-------------|
| BR-JOBS-01 | Single Application | Users can apply to a job only once |
| BR-JOBS-02 | Active Jobs | Only active jobs are visible in search results |
| BR-JOBS-03 | Job Expiry | Jobs auto-expire after 60 days if not renewed |
| BR-JOBS-04 | Match Score | Calculate based on skills (60%) + experience (30%) + education (10%) |
| BR-JOBS-05 | Required Questions | All required screening questions must be answered to submit |

### 7.4 Video Conferencing Rules

| ID | Rule | Description |
|----|------|-------------|
| BR-VIDEO-01 | Host Required | Meeting cannot start without the host |
| BR-VIDEO-02 | Recording Consent | All participants notified when recording starts |
| BR-VIDEO-03 | Maximum Participants | 50 participants per meeting room |
| BR-VIDEO-04 | Meeting Duration | Maximum 4 hours per meeting |
| BR-VIDEO-05 | Recording Retention | Recordings auto-deleted after 90 days |

### 7.5 ATS Rules

| ID | Rule | Description |
|----|------|-------------|
| BR-ATS-01 | Pipeline Stages | Default stages: Applied → Screening → Interview → Offer → Hired |
| BR-ATS-02 | Stage Movement | Candidates can only move forward or be rejected |
| BR-ATS-03 | Rejection Notification | Notify candidates when rejected (optional by employer) |
| BR-ATS-04 | Job Posting | Jobs require: title, description, at least 1 requirement |

---

## 8. Acceptance Criteria

### 8.1 User Registration Acceptance

```gherkin
Feature: User Registration
  As a new user
  I want to register on the platform
  So that I can access features

  Scenario: Successful registration
    Given I am on the signup page
    And I have selected "Techie" as my role
    When I fill in "Full Name" with "John Doe"
    And I fill in "Email" with "john@example.com"
    And I fill in "Password" with "SecurePass123"
    And I fill in "Confirm Password" with "SecurePass123"
    And I click "Continue"
    And I complete face verification for all 5 positions
    Then I should see "Registration successful"
    And I should be redirected to the dashboard
    And I should receive a welcome email

  Scenario: Registration with existing email
    Given I am on the signup page
    When I fill in "Email" with "existing@example.com"
    And I click "Continue"
    Then I should see "Email already registered"
    And I should remain on the signup page

  Scenario: Registration with weak password
    Given I am on the signup page
    When I fill in "Password" with "weak"
    Then I should see "Password must be at least 8 characters"
```

### 8.2 Job Application Acceptance

```gherkin
Feature: Job Application
  As a job seeker
  I want to apply to jobs
  So that I can be considered for positions

  Scenario: Successful job application
    Given I am logged in as a job seeker
    And I am viewing a job posting for "Frontend Developer"
    When I click "Apply Now"
    And I answer all screening questions
    And I click "Submit Application"
    Then I should see "Application submitted successfully"
    And I should see my match score percentage
    And the job should appear in "My Applications"
    And the hiring manager should be notified

  Scenario: Apply to already applied job
    Given I am logged in as a job seeker
    And I have already applied to "Frontend Developer" job
    When I view the job posting
    Then I should see "Applied" badge
    And the "Apply Now" button should be disabled
```

### 8.3 Video Conferencing Acceptance

```gherkin
Feature: Video Conferencing
  As a meeting participant
  I want to join video calls
  So that I can communicate remotely

  Scenario: Join scheduled interview
    Given I have received an interview invitation
    When I click the meeting link
    Then I should see the meeting lobby
    And I should see my video preview
    And I should be able to test my microphone
    When I click "Join Meeting"
    Then I should enter the video room
    And I should see other participants

  Scenario: Screen sharing during call
    Given I am in an active video call
    When I click "Share Screen"
    And I select a screen to share
    Then my screen should be visible to others
    And I should see "Sharing Screen" indicator
    When I click "Stop Sharing"
    Then screen sharing should stop
```

---

## 9. Error Handling

### 9.1 Error Categories

| Category | HTTP Code | Description |
|----------|-----------|-------------|
| Validation | 400 | Invalid input data |
| Authentication | 401 | Missing or invalid credentials |
| Authorization | 403 | Insufficient permissions |
| Not Found | 404 | Resource does not exist |
| Conflict | 409 | Resource already exists |
| Rate Limit | 429 | Too many requests |
| Server Error | 500 | Internal server error |

### 9.2 Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format",
        "code": "INVALID_FORMAT"
      }
    ]
  },
  "request_id": "req-abc123",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

### 9.3 User-Facing Error Messages

| Error Code | Technical Message | User-Friendly Message |
|------------|-------------------|----------------------|
| AUTH_001 | Invalid credentials | "The email or password you entered is incorrect." |
| AUTH_002 | Account locked | "Your account has been temporarily locked. Please try again in 15 minutes." |
| AUTH_003 | Token expired | "Your session has expired. Please log in again." |
| JOBS_001 | Already applied | "You have already applied to this position." |
| JOBS_002 | Job not found | "This job posting is no longer available." |
| VIDEO_001 | Camera not found | "We couldn't access your camera. Please check your permissions." |
| VIDEO_002 | Meeting full | "This meeting has reached its maximum capacity." |

---

## 10. Appendix

### 10.1 Glossary

| Term | Definition |
|------|------------|
| JWT | JSON Web Token - used for authentication |
| WebRTC | Technology for peer-to-peer video communication |
| STUN | Session Traversal Utilities for NAT |
| TURN | Traversal Using Relays around NAT |
| Kanban | Visual project management method |
| Match Score | Percentage indicating job-candidate fit |

### 10.2 References

- Business Requirements Document (BRD)
- Architecture Document
- API Documentation (Swagger)
- UI/UX Design Specifications

### 10.3 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | VerTechie Team | Initial release |

---

*End of Functional Specification Document*

