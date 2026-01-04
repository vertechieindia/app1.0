# VerTechie - Setup & TODO Guide

## Document Information
| Field | Value |
|-------|-------|
| **Document Title** | VerTechie Platform - Setup & TODO Guide |
| **Version** | 1.0 |
| **Date** | January 2026 |
| **Purpose** | Complete guide to run and deploy the application |

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Local Development Setup](#2-local-development-setup)
3. [Database Setup](#3-database-setup)
4. [Running the Application](#4-running-the-application)
5. [Configuration](#5-configuration)
6. [Production Deployment](#6-production-deployment)
7. [TODO Checklist](#7-todo-checklist)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

### 1.1 Required Software

| Software | Version | Purpose | Download Link |
|----------|---------|---------|---------------|
| Node.js | 18.x or higher | Frontend runtime | https://nodejs.org |
| npm | 9.x or higher | Package manager | (comes with Node.js) |
| Python | 3.11 or higher | Backend runtime | https://python.org |
| pip | Latest | Python package manager | (comes with Python) |
| Git | Latest | Version control | https://git-scm.com |
| PostgreSQL | 15.x | Production database | https://postgresql.org |
| Redis | 7.x | Cache (optional) | https://redis.io |

### 1.2 Recommended Tools

| Tool | Purpose |
|------|---------|
| VS Code | Code editor |
| Postman / Insomnia | API testing |
| pgAdmin / DBeaver | Database management |
| Docker Desktop | Containerization |

### 1.3 System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 8 GB | 16 GB |
| CPU | 4 cores | 8 cores |
| Disk | 20 GB | 50 GB |
| OS | macOS, Windows 10+, Linux | macOS, Linux |

---

## 2. Local Development Setup

### 2.1 Clone the Repository

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd Verte
```

### 2.2 Frontend Setup

```bash
# Navigate to frontend directory
cd vertechie_fe-main/frontend

# Install dependencies
npm install

# Install additional required packages
npm install @mui/x-date-pickers date-fns

# Create environment file
cp .env.example .env
# OR create manually:
echo "VITE_API_URL=http://localhost:8000/api" > .env
```

### 2.3 Backend Setup

```bash
# Navigate to backend directory
cd vertechie_be

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# OR create manually with required variables (see Section 5)
```

### 2.4 Project Structure After Setup

```
Verte/
├── vertechie_fe-main/
│   └── frontend/
│       ├── node_modules/          # ✅ Created after npm install
│       ├── src/
│       ├── public/
│       ├── package.json
│       ├── vite.config.ts
│       └── .env                   # ✅ Create this file
│
├── vertechie_be/
│   ├── venv/                      # ✅ Created after venv setup
│   ├── app/
│   ├── alembic/
│   ├── requirements.txt
│   └── .env                       # ✅ Create this file
│
└── docs/                          # ✅ Documentation files
    ├── 1_BRD_Business_Requirements_Document.md
    ├── 2_Architecture_Document.md
    └── 3_Setup_and_TODO_Guide.md
```

---

## 3. Database Setup

### 3.1 Option A: SQLite (Development - Default)

SQLite is used by default for development. No additional setup required.

```bash
# The database file will be created automatically at:
# vertechie_be/vertechie.db
```

### 3.2 Option B: PostgreSQL (Production)

#### Install PostgreSQL

```bash
# macOS (using Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### Create Database

```bash
# Access PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE vertechie;
CREATE USER vertechie_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE vertechie TO vertechie_user;
\q
```

#### Update .env

```bash
# In vertechie_be/.env
DATABASE_URL=postgresql+asyncpg://vertechie_user:your_secure_password@localhost:5432/vertechie
```

### 3.3 Run Database Migrations

```bash
cd vertechie_be

# Activate virtual environment
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Run migrations (if using Alembic)
alembic upgrade head

# OR let FastAPI create tables automatically on startup
# (Tables are created in the lifespan handler)
```

---

## 4. Running the Application

### 4.1 Start Backend Server

```bash
# Terminal 1: Backend
cd vertechie_be

# Activate virtual environment
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Expected output:
# INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
# INFO:     Started reloader process [xxxxx]
# 🚀 Starting VerTechie API...
# ✅ Database tables created
# 📚 API docs available at: http://localhost:8000/docs
```

### 4.2 Start Frontend Server

```bash
# Terminal 2: Frontend
cd vertechie_fe-main/frontend

# Start the development server
npm run dev

# Expected output:
#   VITE v5.x.x  ready in xxx ms
#   ➜  Local:   http://localhost:5173/
#   ➜  Network: http://192.168.x.x:5173/
```

### 4.3 Access the Application

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Frontend application |
| http://localhost:8000/docs | API documentation (Swagger) |
| http://localhost:8000/redoc | API documentation (ReDoc) |
| http://localhost:8000/api | API base URL |

### 4.4 Create Test User

#### Option 1: Via API

```bash
# Register a new user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "full_name": "Test User"
  }'
```

#### Option 2: Via Super Admin

1. Start the backend server
2. A default superuser is created automatically:
   - Email: `admin@vertechie.com`
   - Password: `admin123`
3. Login at http://localhost:5173/login
4. Navigate to Super Admin dashboard
5. Create new users with various roles

### 4.5 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@vertechie.com | admin123 |
| Test User | test@example.com | Test123! |

---

## 5. Configuration

### 5.1 Frontend Environment Variables

Create file: `vertechie_fe-main/frontend/.env`

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Optional: Analytics
VITE_GA_TRACKING_ID=

# Optional: Feature flags
VITE_ENABLE_FACE_VERIFICATION=true
VITE_ENABLE_VIDEO_CONFERENCING=true
```

### 5.2 Backend Environment Variables

Create file: `vertechie_be/.env`

```env
# Application
APP_NAME=VerTechie
APP_VERSION=1.0.0
DEBUG=true
ENVIRONMENT=development

# Server
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=sqlite+aiosqlite:///./vertechie.db
# For PostgreSQL:
# DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/vertechie

# Security
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]

# Optional: Redis
REDIS_URL=redis://localhost:6379

# Optional: Email
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=noreply@vertechie.com

# Optional: External APIs
GIPHY_API_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### 5.3 Generate Secret Key

```python
# Run this Python code to generate a secure secret key:
import secrets
print(secrets.token_urlsafe(32))
```

Or use terminal:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 6. Production Deployment

### 6.1 Using Docker

#### Create Dockerfile for Frontend

```dockerfile
# vertechie_fe-main/frontend/Dockerfile
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

#### Create Dockerfile for Backend

```dockerfile
# vertechie_be/Dockerfile
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

#### Create docker-compose.yml

```yaml
# docker-compose.yml (root directory)
version: '3.8'

services:
  frontend:
    build: ./vertechie_fe-main/frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:8000/api

  backend:
    build: ./vertechie_be
    ports:
      - "8000:8000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql+asyncpg://vertechie:password@db:5432/vertechie
      - SECRET_KEY=${SECRET_KEY}
      - CORS_ORIGINS=["http://localhost","http://localhost:80"]
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=vertechie
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=vertechie
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Run with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 6.2 Cloud Deployment Options

| Platform | Frontend | Backend | Database |
|----------|----------|---------|----------|
| AWS | S3 + CloudFront | ECS/EKS/Lambda | RDS PostgreSQL |
| Google Cloud | Cloud Storage | Cloud Run/GKE | Cloud SQL |
| Azure | Blob Storage | App Service/AKS | Azure PostgreSQL |
| Vercel | Vercel | - | - |
| Railway | - | Railway | Railway PostgreSQL |
| Render | Render Static | Render Web Service | Render PostgreSQL |
| DigitalOcean | App Platform | App Platform | Managed PostgreSQL |

### 6.3 Production Checklist

- [ ] Change all default passwords
- [ ] Generate new SECRET_KEY
- [ ] Set DEBUG=false
- [ ] Configure proper CORS_ORIGINS
- [ ] Enable HTTPS (TLS)
- [ ] Set up database backups
- [ ] Configure monitoring (logs, metrics)
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting
- [ ] Set up CDN for static assets
- [ ] Configure firewall rules

---

## 7. TODO Checklist

### 7.1 Immediate Actions (Before First Run)

```
✅ Prerequisites
├── [ ] Install Node.js 18+
├── [ ] Install Python 3.11+
├── [ ] Install Git
└── [ ] (Optional) Install PostgreSQL

✅ Setup
├── [ ] Clone repository
├── [ ] Run `npm install` in frontend directory
├── [ ] Create Python virtual environment
├── [ ] Run `pip install -r requirements.txt`
├── [ ] Create frontend .env file
├── [ ] Create backend .env file
└── [ ] Generate SECRET_KEY

✅ Run Application
├── [ ] Start backend: `uvicorn app.main:app --reload`
├── [ ] Start frontend: `npm run dev`
├── [ ] Access http://localhost:5173
└── [ ] Login with default admin account
```

### 7.2 Optional Enhancements

```
🔧 Database
├── [ ] Set up PostgreSQL for production
├── [ ] Configure database backups
├── [ ] Set up read replicas (scaling)
└── [ ] Configure connection pooling

🔧 Caching
├── [ ] Install and configure Redis
├── [ ] Enable API response caching
└── [ ] Configure session store in Redis

🔧 Email
├── [ ] Set up SMTP provider (SendGrid, AWS SES, etc.)
├── [ ] Configure email templates
├── [ ] Enable email notifications
└── [ ] Set up password reset emails

🔧 File Storage
├── [ ] Set up cloud storage (S3, GCS, etc.)
├── [ ] Configure file upload limits
├── [ ] Enable CDN for media files
└── [ ] Set up backup for uploads

🔧 Video Conferencing
├── [ ] Set up TURN server for WebRTC
├── [ ] Configure recording storage
├── [ ] Enable transcription (optional)
└── [ ] Set up media server for large calls

🔧 Integrations
├── [ ] Configure GitHub OAuth
├── [ ] Configure Google OAuth
├── [ ] Set up Google Calendar API
├── [ ] Set up Microsoft Graph API
└── [ ] Configure GIPHY API key

🔧 Security
├── [ ] Enable SSL/TLS in production
├── [ ] Set up WAF (Web Application Firewall)
├── [ ] Configure DDoS protection
├── [ ] Enable security scanning
├── [ ] Set up penetration testing
└── [ ] Review OWASP compliance

🔧 Monitoring
├── [ ] Set up application logging (ELK/CloudWatch)
├── [ ] Configure error tracking (Sentry)
├── [ ] Set up performance monitoring (APM)
├── [ ] Configure uptime monitoring
└── [ ] Set up alerting

🔧 CI/CD
├── [ ] Set up GitHub Actions / GitLab CI
├── [ ] Configure automated testing
├── [ ] Set up staging environment
├── [ ] Configure automated deployments
└── [ ] Set up rollback procedures
```

### 7.3 Feature Development TODO

```
📱 Phase 2 Features
├── [ ] Mobile app (React Native / Flutter)
├── [ ] Push notifications
├── [ ] Payment integration (Stripe/Razorpay)
├── [ ] AI-powered features
│   ├── [ ] Resume parsing
│   ├── [ ] Job recommendations
│   ├── [ ] Code review assistance
│   └── [ ] Chat assistant
├── [ ] Advanced analytics dashboard
├── [ ] Multi-tenant architecture
├── [ ] Internationalization (i18n)
└── [ ] Accessibility improvements (WCAG AAA)
```

### 7.4 Content TODO

```
📚 Learning Content
├── [ ] Complete Python advanced topics
├── [ ] Add Java course
├── [ ] Add Node.js course
├── [ ] Add DevOps course
├── [ ] Add System Design course
├── [ ] Add Data Structures & Algorithms
├── [ ] Create video tutorials
└── [ ] Add more coding challenges

📝 Documentation
├── [ ] API documentation
├── [ ] User guide
├── [ ] Admin guide
├── [ ] Developer documentation
└── [ ] Video tutorials
```

---

## 8. Troubleshooting

### 8.1 Common Issues

#### Issue: "Module not found" error in frontend

```bash
# Solution: Reinstall dependencies
cd vertechie_fe-main/frontend
rm -rf node_modules package-lock.json
npm install
```

#### Issue: "Failed to resolve import '@mui/x-date-pickers'"

```bash
# Solution: Install the package
npm install @mui/x-date-pickers date-fns
```

#### Issue: Backend won't start - "Address already in use"

```bash
# Solution: Kill the process using port 8000
# On macOS/Linux:
lsof -i :8000
kill -9 <PID>

# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

#### Issue: Database connection error

```bash
# Solution 1: Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Solution 2: Verify DATABASE_URL in .env
# Solution 3: Fall back to SQLite for development
DATABASE_URL=sqlite+aiosqlite:///./vertechie.db
```

#### Issue: CORS errors in browser

```bash
# Solution: Verify CORS_ORIGINS in backend .env
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

#### Issue: Face verification not working

```bash
# Solution 1: Check if camera permissions are granted
# Solution 2: Ensure HTTPS or localhost (WebRTC requires secure context)
# Solution 3: Check browser console for errors
```

#### Issue: Video call not connecting

```bash
# Solution 1: Check browser permissions for camera/microphone
# Solution 2: Verify WebRTC STUN/TURN server configuration
# Solution 3: Check firewall settings (WebRTC uses UDP)
```

### 8.2 Log Locations

| Component | Log Location |
|-----------|--------------|
| Frontend (Vite) | Terminal output + Browser console |
| Backend (Uvicorn) | Terminal output |
| PostgreSQL | /var/log/postgresql/ or pg_log |
| Docker | `docker-compose logs -f` |

### 8.3 Getting Help

1. Check the error message carefully
2. Search existing issues in the repository
3. Check the documentation
4. Create a new issue with:
   - Steps to reproduce
   - Error message
   - Environment details
   - Screenshots (if applicable)

---

## Quick Reference Commands

```bash
# === FRONTEND ===
cd vertechie_fe-main/frontend
npm install                    # Install dependencies
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview               # Preview production build

# === BACKEND ===
cd vertechie_be
source venv/bin/activate      # Activate venv (macOS/Linux)
.\venv\Scripts\activate       # Activate venv (Windows)
pip install -r requirements.txt  # Install dependencies
uvicorn app.main:app --reload    # Start dev server
alembic upgrade head          # Run migrations
alembic revision --autogenerate -m "message"  # Create migration

# === DOCKER ===
docker-compose up --build     # Build and start
docker-compose up -d          # Start in background
docker-compose down           # Stop all services
docker-compose logs -f        # View logs

# === DATABASE ===
psql -U postgres              # Access PostgreSQL
\l                            # List databases
\c vertechie                  # Connect to database
\dt                           # List tables
\q                            # Quit
```

---

## Support

For additional support:
- 📧 Email: support@vertechie.com
- 📖 Documentation: /docs folder
- 🐛 Issues: GitHub Issues
- 💬 Community: Discord/Slack (if applicable)

---

*End of Setup & TODO Guide*

