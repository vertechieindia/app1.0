# Complete Migration Steps

Follow these steps in order to set up PostgreSQL and run migrations.

## Step 1: Start PostgreSQL Server

You have PostgreSQL 14 installed. Start it:

```bash
brew services start postgresql@14
```

Wait a few seconds, then verify it's running:

```bash
pg_isready -h localhost -p 5432
```

Should show: `localhost:5432 - accepting connections`

## Step 2: Create Database (if it doesn't exist)

```bash
# Connect to PostgreSQL
psql postgres

# Or if that doesn't work:
psql -U $(whoami) -d postgres
```

Once connected, run:

```sql
-- Check if database exists
\l

-- If 'vertechie' doesn't exist, create it:
CREATE DATABASE vertechie;

-- Exit
\q
```

## Step 3: Verify .env Configuration

Check your `.env` file has the correct DATABASE_URL:

```bash
cd vertechie_be/vertechie_fastapi
cat .env | grep DATABASE_URL
```

It should be:
```
DATABASE_URL=postgresql+asyncpg://thenianandraj:YOUR_PASSWORD@localhost:5432/vertechie
```

If it's commented out or wrong, edit `.env` and uncomment/set the correct line.

## Step 4: Test Database Connection

```bash
cd vertechie_be/vertechie_fastapi
source venv_run/bin/activate
python check_db.py
```

Should show: `OK: Database is connected.`

## Step 5: Run Migrations

```bash
# Make sure you're in the project directory
cd vertechie_be/vertechie_fastapi
source venv_run/bin/activate

# Check current migration status
alembic current

# View available migrations
alembic history

# Run all migrations
alembic upgrade head
```

## Step 6: Verify Tables Were Created

```bash
# List all tables
psql -U thenianandraj -d vertechie -c "\dt"

# Or view in psql
psql -U thenianandraj -d vertechie
\dt
\q
```

## Quick One-Line Commands

```bash
# Start PostgreSQL and run migrations
brew services start postgresql@14 && sleep 3 && cd vertechie_be/vertechie_fastapi && source venv_run/bin/activate && alembic upgrade head
```

## Troubleshooting

### If PostgreSQL won't start:
```bash
# Check logs
tail -f /opt/homebrew/var/log/postgresql@14.log

# Try manual start
pg_ctl -D /opt/homebrew/var/postgresql@14 start
```

### If connection fails:
- Verify database exists: `psql -l | grep vertechie`
- Check .env file has correct credentials
- Test connection: `psql -U thenianandraj -d vertechie`

### If migrations fail:
- Check error messages
- Verify all dependencies: `pip install -r requirements.txt`
- Check Alembic setup: `alembic check`
