# PostgreSQL Commands for VerTechie

## Connect to Database

```bash
# Connect to vertechie database
psql -U thenianandraj -d vertechie

# Connect with host specified
psql -h localhost -U thenianandraj -d vertechie

# Connect using connection string
psql "postgresql://thenianandraj:PASSWORD@localhost:5432/vertechie"
```

---

## Basic Navigation

```sql
-- List all databases
\l

-- Connect to a database
\c vertechie

-- List all tables
\dt

-- List tables with sizes
\dt+

-- Describe a table structure
\d users
\d+ users   -- with more details

-- List all schemas
\dn

-- Current database and user
SELECT current_database(), current_user;
```

---

## Table Operations

```sql
-- Show all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Count tables
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';

-- Show columns of a table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users';

-- Show table size
SELECT pg_size_pretty(pg_total_relation_size('users'));
```

---

## User Queries

```sql
-- List all users
SELECT id, email, first_name, last_name, is_active, is_verified 
FROM users LIMIT 20;

-- Find super admin
SELECT id, email, first_name, is_superuser, admin_roles 
FROM users WHERE is_superuser = true;

-- Find hiring managers
SELECT u.id, u.email, u.first_name 
FROM users u 
JOIN user_roles ur ON u.id = ur.user_id 
JOIN user_role r ON ur.role_id = r.id 
WHERE r.role_type = 'hiring_manager';

-- Count users by verification status
SELECT verification_status, COUNT(*) 
FROM users 
GROUP BY verification_status;

-- Find user by email
SELECT * FROM users WHERE email = 'superadmin@vertechie.com';
```

---

## Job Queries

```sql
-- List all jobs
SELECT id, title, company_id, status, created_at 
FROM jobs ORDER BY created_at DESC LIMIT 20;

-- Jobs with company names
SELECT j.id, j.title, c.name as company 
FROM jobs j 
JOIN companies c ON j.company_id = c.id;

-- Count applications per job
SELECT j.title, COUNT(ja.id) as applications 
FROM jobs j 
LEFT JOIN job_applications ja ON j.id = ja.job_id 
GROUP BY j.id, j.title;
```

---

## Company Queries

```sql
-- List companies
SELECT id, name, industry, is_verified 
FROM companies LIMIT 20;

-- Verified companies
SELECT name, industry FROM companies WHERE is_verified = true;
```

---

## Migration Table

```sql
-- Check current alembic version
SELECT * FROM alembic_version;

-- View migration history (if tracked)
SELECT version_num FROM alembic_version;
```

---

## Data Manipulation

```sql
-- Update user (example: make someone admin)
UPDATE users 
SET is_superuser = true, admin_roles = '["superadmin", "admin"]'::jsonb 
WHERE email = 'user@example.com';

-- Reset password (need to use Python for hashing)
-- See reset_superadmin.py script instead

-- Delete user (careful!)
DELETE FROM users WHERE email = 'test@example.com';

-- Soft delete (if is_active column exists)
UPDATE users SET is_active = false WHERE email = 'test@example.com';
```

---

## Database Maintenance

```sql
-- Vacuum (clean up dead tuples)
VACUUM;
VACUUM ANALYZE;  -- also update statistics

-- Reindex
REINDEX DATABASE vertechie;

-- Check database size
SELECT pg_size_pretty(pg_database_size('vertechie'));

-- Check table sizes
SELECT 
    relname as table,
    pg_size_pretty(pg_total_relation_size(relid)) as size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;
```

---

## Backup & Restore

```bash
# Backup database
pg_dump -U thenianandraj -d vertechie > backup.sql
pg_dump -U thenianandraj -d vertechie -F c > backup.dump  # custom format

# Restore database
psql -U thenianandraj -d vertechie < backup.sql
pg_restore -U thenianandraj -d vertechie backup.dump  # custom format

# Backup specific table
pg_dump -U thenianandraj -d vertechie -t users > users_backup.sql
```

---

## Useful Shortcuts in psql

| Command | Description |
|---------|-------------|
| `\q` | Quit psql |
| `\l` | List databases |
| `\dt` | List tables |
| `\d table` | Describe table |
| `\du` | List users/roles |
| `\dn` | List schemas |
| `\df` | List functions |
| `\di` | List indexes |
| `\x` | Toggle expanded display |
| `\timing` | Toggle query timing |
| `\i file.sql` | Execute SQL file |
| `\o file.txt` | Output to file |
| `\?` | Help on psql commands |
| `\h SELECT` | Help on SQL commands |

---

## Quick Reference

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Stop PostgreSQL
brew services stop postgresql

# Check if running
brew services list | grep postgres

# Or using pg_ctl
pg_ctl -D /usr/local/var/postgres start
pg_ctl -D /usr/local/var/postgres stop
```

---

*For VerTechie Project - Database: vertechie*
