#!/bin/bash
# Quick migration script - run after PostgreSQL is started

cd "$(dirname "$0")"

echo "=========================================="
echo "Alembic Migration Script"
echo "=========================================="
echo ""

# Activate virtual environment
if [ -d "venv_run" ]; then
    source venv_run/bin/activate
    echo "✅ Virtual environment activated"
else
    echo "❌ Virtual environment not found!"
    exit 1
fi

# Check database connection
echo ""
echo "Testing database connection..."
python check_db.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Database connection failed!"
    echo "Please ensure:"
    echo "  1. PostgreSQL server is running: brew services start postgresql@14"
    echo "  2. Database 'vertechie' exists"
    echo "  3. .env file has correct DATABASE_URL"
    exit 1
fi

# Show current status
echo ""
echo "Current migration status:"
alembic current

# Show available migrations
echo ""
echo "Available migrations:"
alembic history --verbose | head -20

# Run migrations
echo ""
echo "=========================================="
echo "Running migrations..."
echo "=========================================="
echo ""

alembic upgrade head

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✅ Migrations completed successfully!"
    echo "=========================================="
    echo ""
    echo "Final status:"
    alembic current
    echo ""
    echo "To view tables:"
    echo "  psql -U thenianandraj -d vertechie -c '\\dt'"
else
    echo ""
    echo "❌ Migrations failed. Check errors above."
    exit 1
fi
