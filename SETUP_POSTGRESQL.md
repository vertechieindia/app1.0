# PostgreSQL Setup and Migration Guide

## Step 1: Install PostgreSQL (if not already installed)

You already have `psql` installed. Now we need to ensure PostgreSQL server is running.

### Check Installation
```bash
psql --version
# Should show: psql (PostgreSQL) 14.20 or similar
```

## Step 2: Start PostgreSQL Server

### Option A: Using Homebrew Services (Recommended)
```bash
# Start PostgreSQL
brew services start postgresql@14

# Or if you have a different version
brew services start postgresql

# Check status
brew services list | grep postgresql
```

### Option B: Manual Start
```bash
# Find PostgreSQL data directory
pg_config --sharedir

# Start manually (adjust path as needed)
pg_ctl -D /opt/homebrew/var/postgresql@14 start
# OR
pg_ctl -D /opt/homebrew/var/postgres start
```

### Verify Server is Running
```bash
pg_isready -h localhost -p 5432
# Should show: localhost:5432 - accepting connections
```

## Step 3: Create Database and User

```bash
# Connect to PostgreSQL (as your macOS user)
psql postgres

# Or if that doesn't work, try:
psql -U $(whoami) -d postgres
```

Once connected, run these SQL commands:

```sql
-- Create database
CREATE DATABASE vertechie;

-- Create user (if needed) - replace 'your_password' with your password
CREATE USER thenianandraj WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vertechie TO thenianandraj;

-- Connect to the new database
\c vertechie

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO thenianandraj;

-- Exit
\q
```

## Step 4: Configure .env File

Edit `vertechie_be/vertechie_fastapi/.env`:

```env
DATABASE_URL=postgresql+asyncpg://thenianandraj:your_password@localhost:5432/vertechie
```

Replace `your_password` with the actual password you set.

## Step 5: Run Migrations

```bash
cd vertechie_be/vertechie_fastapi

# Activate virtual environment
source venv_run/bin/activate

# Test database connection
python check_db.py

# Run migrations
alembic upgrade head
```

## Quick Commands Reference

```bash
# Start PostgreSQL
brew services start postgresql@14

# Stop PostgreSQL
brew services stop postgresql@14

# Check if running
pg_isready -h localhost -p 5432

# Connect to database
psql -U thenianandraj -d vertechie

# List tables
psql -U thenianandraj -d vertechie -c "\dt"

# View all tables
psql -U thenianandraj -d vertechie -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"
```

## Troubleshooting

### PostgreSQL won't start
```bash
# Check logs
tail -f /opt/homebrew/var/log/postgresql@14.log
# OR
tail -f /opt/homebrew/var/log/postgres.log

# Check if port is in use
lsof -i :5432

# Kill process if needed
kill -9 <PID>
```

### Permission denied
```bash
# Fix permissions
sudo chown -R $(whoami) /opt/homebrew/var/postgresql@14
# OR
sudo chown -R $(whoami) /opt/homebrew/var/postgres
```

### Database connection fails
- Verify database exists: `psql -l | grep vertechie`
- Check user exists: `psql -U postgres -c "\du"`
- Verify password in .env matches database password
