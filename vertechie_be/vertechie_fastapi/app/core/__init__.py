"""Core application configuration and utilities.

Avoid importing `app.core.security` eagerly here because it imports DB
dependencies that may import `app.core.config` during initialization.
Using lazy attribute loading prevents circular imports (e.g. seed scripts).
"""

from app.core.config import settings

_SECURITY_EXPORTS = {
    "get_password_hash",
    "verify_password",
    "create_access_token",
    "create_refresh_token",
    "decode_token",
    "verify_token",
    "get_current_user",
    "get_current_admin_user",
    "get_optional_user",
}

__all__ = ["settings", *_SECURITY_EXPORTS]


def __getattr__(name: str):
    if name in _SECURITY_EXPORTS:
        from app.core import security as _security

        return getattr(_security, name)
    raise AttributeError(f"module 'app.core' has no attribute '{name}'")

