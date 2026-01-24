# Fix 500 Error for Events and Combinator

## Problem
The Events and Combinator endpoints are returning 500 errors because the database tables don't exist yet.

## Solution: Run Database Migrations

### Step 1: Navigate to the backend directory
```bash
cd vertechie_be/vertechie_fastapi
```

### Step 2: Run Alembic migrations
```bash
alembic upgrade head
```

This will create the following tables:
- `events`
- `event_registrations`
- `startup_ideas`
- `founder_matches`

### Step 3: Verify migrations ran successfully
```bash
alembic current
```

You should see the latest migration revision listed.

### Step 4: Restart your backend server
After running migrations, restart your FastAPI server.

## If Migrations Fail

### Check migration file exists
The migration file should be at:
```
alembic/versions/2026_01_24_003_add_events_combinator_tables.py
```

### Manual table creation (if needed)
If migrations don't work, you can manually create tables using the SQL in the migration file, or restart the backend server which should auto-create tables via `init_db()` if models are properly imported.

## Verify Tables Exist

You can check if tables exist by:
1. Opening your database (SQLite: `vertechie.db` or PostgreSQL)
2. Running: `SELECT name FROM sqlite_master WHERE type='table' AND name IN ('events', 'event_registrations', 'startup_ideas', 'founder_matches');`

## After Fixing

Once tables are created:
1. Restart backend server
2. Refresh frontend
3. Try accessing Events and Combinator pages
4. Errors should be resolved

## Error Messages

The endpoints now return helpful error messages:
- **503 Service Unavailable**: "Events table not found. Please run database migrations: alembic upgrade head"
- **503 Service Unavailable**: "Startup ideas table not found. Please run database migrations: alembic upgrade head"

These messages will guide you to run the migrations.
