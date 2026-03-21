"""
Centralized logging for VerTechie FastAPI application.
Logs to both console and app.log with timestamp, level, and message.
Production-ready: rotating file handler, structured format.
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler

# Project root: app/core/logger.py -> app -> vertechie_fastapi
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
LOG_DIR = PROJECT_ROOT / "logs"
LOG_FILE = LOG_DIR / "app.log"
LOG_MAX_BYTES = 10 * 1024 * 1024  # 10 MB
LOG_BACKUP_COUNT = 5

# Format: timestamp, level, message (and optional module/line for file)
CONSOLE_FORMAT = "%(asctime)s | %(levelname)-8s | %(message)s"
FILE_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s:%(lineno)d | %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def setup_logging(
    level: str = "INFO",
    log_file: Path | None = None,
    max_bytes: int = LOG_MAX_BYTES,
    backup_count: int = LOG_BACKUP_COUNT,
) -> logging.Logger:
    """
    Configure and return the application logger.
    Outputs to both console and file. Creates log directory if needed.
    """
    log_file = log_file or LOG_FILE
    log_dir = log_file.parent
    log_dir.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger("vertechie")
    logger.setLevel(getattr(logging, level.upper(), logging.INFO))

    # Avoid duplicate handlers when called multiple times (e.g. reload)
    if logger.handlers:
        return logger

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(logging.Formatter(CONSOLE_FORMAT, datefmt=DATE_FORMAT))
    logger.addHandler(console_handler)

    # File handler (rotating)
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=max_bytes,
        backupCount=backup_count,
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(logging.Formatter(FILE_FORMAT, datefmt=DATE_FORMAT))
    logger.addHandler(file_handler)

    return logger


def get_logger(name: str | None = None) -> logging.Logger:
    """Return the app logger, or a child logger with the given name."""
    base = logging.getLogger("vertechie")
    if name:
        return base.getChild(name)
    return base


# Default instance for app-wide use (handlers added when setup_logging is called from main)
logger = get_logger()
