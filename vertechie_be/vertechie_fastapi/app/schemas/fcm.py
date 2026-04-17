"""Schemas for FCM device registration."""

from pydantic import BaseModel, Field


class FcmTokenRegister(BaseModel):
    token: str = Field(..., min_length=10, max_length=512)


class FcmTokenUnregister(BaseModel):
    token: str = Field(..., min_length=10, max_length=512)
