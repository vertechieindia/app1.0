# VerTechie - Project Run Notes

## Quick Start

### Backend (FastAPI)

```bash
cd vertechie_be/vertechie_fastapi
source venv_run/bin/activate
python run.py

```
cd vertechie_be\vertechie_fastapi
venv\Scripts\Activate.ps1
python run.py
```

**Backend URL:** http://localhost:8000
**API Docs:** http://localhost:8000/docs

### Frontend (React + Vite)

```bash
cd vertechie_fe-main/frontend
npm install   # First time only
npm run dev
```

**Frontend URL:** http://localhost:5173

---

## Test Credentials

### Super Admin
| Field | Value |
|-------|-------|
| Email | `superadmin@vertechie.com` |
| Password | `superadmin@123!` |

### Hiring Manager
| Field | Value |
|-------|-------|
| Email | `hm@vertechie.com` |
| Password | `HiringManager@123` |

### Techie Users (12 dummy users)
| Password (all users) | `TechiePass@123` |
|----------------------|------------------|

Sample emails:
- `rahul.sharma@example.com`
- `priya.patel@example.com`
- `amit.kumar@example.com`
- `sneha.reddy@example.com`
- `vikram.singh@example.com`
- `ananya.gupta@example.com`

---

## Database

**Type:** PostgreSQL (using asyncpg driver)

**Config Location:** `vertechie_be/vertechie_fastapi/.env`

### Database Migrations (Alembic)

**Prerequisites:**
- PostgreSQL database must be running
- `.env` file must contain `DATABASE_URL=postgresql+asyncpg://user:password@host:port/database`

**Initial Setup:**
```bash
cd vertechie_be/vertechie_fastapi
source venv_run/bin/activate

# Verify Alembic setup (recommended first step)
python test_alembic_setup.py

# Check current migration status
alembic current

# View migration history
alembic history

# Apply all pending migrations
alembic upgrade head
```

**Creating New Migrations:**
```bash
# After changing models, generate a new migration
alembic revision --autogenerate -m "description_of_change"

# Review the generated migration file in alembic/versions/
# Then apply it
alembic upgrade head
```

**Migration Management:**
```bash
# Check current migration status
alembic current

# View migration history
alembic history

# Rollback one migration
alembic downgrade -1

# Rollback to specific revision
alembic downgrade <revision_id>

# View pending migrations
alembic heads
```

**Production Migrations:**
See `PRODUCTION_MIGRATIONS.md` for detailed production migration procedures, backup, and rollback instructions.

---

## Seed Scripts

Located in `vertechie_be/vertechie_fastapi/`:

| Script | Purpose |
|--------|---------|
| `create_superadmin.py` | Create super admin user |
| `create_hiring_manager.py` | Create hiring manager user |
| `create_dummy_techies.py` | Create 12 dummy techie users |
| `reset_superadmin.py` | Reset super admin password to `admin123` |
| `add_missing_user_columns.py` | Add missing DB columns (migration fix) |

Run with:
```bash
cd vertechie_be/vertechie_fastapi
source venv_run/bin/activate
python <script_name>.py
```

---

## Project Structure

```
app1.0/
├── docs/                           # Documentation
│   ├── 1_BRD_Business_Requirements_Document.md
│   ├── 2_Architecture_Document.md
│   ├── 3_Setup_and_TODO_Guide.md
│   ├── 4_FSD_Functional_Specification_Document.md
│   └── 5_TDD_Technical_Design_Document.md
│
├── vertechie_be/                   # Backend
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── vertechie_fastapi/          # Active FastAPI app
│       ├── app/                    # Application code
│       │   ├── api/v1/             # API endpoints
│       │   ├── core/               # Config, security
│       │   ├── db/                 # Database setup
│       │   ├── models/             # SQLAlchemy models
│       │   ├── schemas/            # Pydantic schemas
│       │   └── main.py             # FastAPI app entry
│       ├── alembic/                # Database migrations
│       ├── .env                    # Environment config
│       ├── run.py                  # Start server
│       └── venv_run/               # Python virtual env
│
└── vertechie_fe-main/              # Frontend
    └── frontend/
        ├── src/
        │   ├── pages/              # React pages
        │   ├── components/         # Reusable components
        │   ├── contexts/           # React contexts
        │   └── App.tsx             # Main app
        ├── package.json
        └── vite.config.ts
```

---

## Tech Stack

### Backend
- Python 3.9+
- FastAPI
- SQLAlchemy 2.0 (Async)
- PostgreSQL + asyncpg
- Alembic (migrations)
- Pydantic
- JWT authentication (python-jose)
- bcrypt (password hashing)

### Frontend
- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- React Router DOM
- Axios
- Monaco Editor

---

## Common Issues

### 1. Missing Database Columns
If you get `column does not exist` error:
```bash
cd vertechie_be/vertechie_fastapi
source venv_run/bin/activate
python add_missing_user_columns.py
```

### 2. Reset Super Admin Password
```bash
cd vertechie_be/vertechie_fastapi
source venv_run/bin/activate
python reset_superadmin.py
# New password: admin123
```

### 3. Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000
# Kill it
kill -9 <PID>
```

---

## API Endpoints Overview

| Module | Base Path |
|--------|-----------|
| Auth | `/api/v1/auth/` |
| Users | `/api/v1/users/` |
| Jobs | `/api/v1/jobs/` |
| Companies | `/api/v1/companies/` |
| Schools | `/api/v1/schools/` |
| Courses | `/api/v1/courses/` |
| Calendar | `/api/v1/calendar/` |
| Chat | `/api/v1/chat/` |
| Blog | `/api/v1/blog/` |
| Network | `/api/v1/network/` |
| Practice | `/api/v1/practice/` |
| Hiring/ATS | `/api/v1/hiring/` |
| Admin | `/api/v1/admin/` |
| Notifications | `/api/v1/notifications/` |

Full API docs available at: http://localhost:8000/docs

---

*Last updated: January 2026*
