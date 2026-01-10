"""Legacy v_auth API endpoints for backwards compatibility."""

from fastapi import APIRouter
from app.api.v_auth.auth import router as auth_router

router = APIRouter()
router.include_router(auth_router, prefix="/auth", tags=["Legacy Auth"])

