#!/bin/bash
# Script to setup PostgreSQL connection and run Alembic migrations

set -e  # Exit on error

echo "=========================================="
echo "PostgreSQL Setup and Migration Script"
echo "=========================================="
echo ""

# Navigate to project directory
cd "$(dirname "$0")"
PROJECT_DIR=$(pwd)

echo "Project directory: $PROJECT_DIR"
echo ""

# Check if virtual environment exists
if [ ! -d "venv_run" ]; then
    echo "❌ Virtual environment 'venv_run' not found!"
    echo "Please create it first: python3 -m venv venv_run"
    exit 1
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv_run/bin/activate

# Check PostgreSQL installation
echo ""
echo "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. Installing PostgreSQL..."
    echo "Run: brew install postgresql@15"
    exit 1
else
    PSQL_VERSION=$(psql --version)
    echo "✅ PostgreSQL found: $PSQL_VERSION"
fi

# Check if PostgreSQL server is running
echo ""
echo "Checking PostgreSQL server status..."
if pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "✅ PostgreSQL server is running"
else
    echo "⚠️  PostgreSQL server is not running"
    echo ""
    echo "Starting PostgreSQL server..."
    brew services start postgresql@15 2>/dev/null || brew services start postgresql 2>/dev/null || {
        echo "❌ Could not start PostgreSQL server"
        echo "Please start it manually:"
        echo "  brew services start postgresql@15"
        echo "  OR"
        echo "  pg_ctl -D /opt/homebrew/var/postgresql@15 start"
        exit 1
    }
    sleep 2
    echo "✅ PostgreSQL server started"
fi

# Check database connection
echo ""
echo "Testing database connection..."
if [ -f .env ]; then
    # Extract database info from .env
    DB_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    
    if [ -z "$DB_URL" ]; then
        echo "❌ DATABASE_URL not found in .env file"
        exit 1
    fi
    
    # Extract components from URL
    # Format: postgresql+asyncpg://user:password@host:port/database
    if [[ $DB_URL =~ postgresql\+asyncpg://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+) ]]; then
        DB_USER="${BASH_REMATCH[1]}"
        DB_PASS="${BASH_REMATCH[2]}"
        DB_HOST="${BASH_REMATCH[3]}"
        DB_PORT="${BASH_REMATCH[4]}"
        DB_NAME="${BASH_REMATCH[5]}"
        
        echo "Database: $DB_NAME"
        echo "User: $DB_USER"
        echo "Host: $DB_HOST:$DB_PORT"
        
        # Test connection
        export PGPASSWORD="$DB_PASS"
        if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" &> /dev/null; then
            echo "✅ Database connection successful"
        else
            echo "❌ Database connection failed"
            echo "Please check your .env file and ensure:"
            echo "  1. Database '$DB_NAME' exists"
            echo "  2. User '$DB_USER' has access"
            echo "  3. Password is correct"
            exit 1
        fi
    else
        echo "⚠️  Could not parse DATABASE_URL, continuing anyway..."
    fi
else
    echo "⚠️  .env file not found, using default connection"
fi

# Check Alembic installation
echo ""
echo "Checking Alembic installation..."
if ! command -v alembic &> /dev/null; then
    echo "❌ Alembic not found in virtual environment"
    echo "Installing dependencies..."
    pip install -q alembic psycopg2-binary
    echo "✅ Dependencies installed"
else
    ALEMBIC_VERSION=$(alembic --version | head -1)
    echo "✅ Alembic found: $ALEMBIC_VERSION"
fi

# Check current migration status
echo ""
echo "Checking current migration status..."
CURRENT_VERSION=$(alembic current 2>&1 | grep -oP '^\s*\K[0-9a-f_]+' || echo "none")
if [ "$CURRENT_VERSION" != "none" ]; then
    echo "Current migration version: $CURRENT_VERSION"
else
    echo "No migrations applied yet"
fi

# Show migration history
echo ""
echo "Available migrations:"
alembic history | head -10

# Run migrations
echo ""
echo "=========================================="
echo "Running Alembic Migrations"
echo "=========================================="
echo ""

alembic upgrade head

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ Migrations completed successfully!"
    echo "=========================================="
    echo ""
    
    # Show final status
    echo "Final migration status:"
    alembic current
    
    echo ""
    echo "You can now:"
    echo "  1. View tables in pgAdmin: http://localhost:5050"
    echo "  2. Connect via psql: psql -U $DB_USER -d $DB_NAME"
    echo "  3. List tables: psql -U $DB_USER -d $DB_NAME -c '\\dt'"
else
    echo ""
    echo "=========================================="
    echo "❌ Migrations failed!"
    echo "=========================================="
    echo ""
    echo "Please check the error messages above"
    exit 1
fi
