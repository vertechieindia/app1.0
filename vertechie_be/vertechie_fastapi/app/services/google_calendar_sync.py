"""
Google Calendar OAuth and sync helpers.
Uses Google Calendar API v3: OAuth2, events CRUD, incremental sync via syncToken.
"""
import logging
from datetime import datetime, timezone
from typing import Any, Optional

import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_CALENDAR_SCOPES = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar",
    "openid",
    "email",
]
CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3"


def get_google_calendar_authorize_url(redirect_uri: str, state: str) -> str:
    """Build Google OAuth2 authorize URL for Calendar."""
    base = (
        f"{GOOGLE_AUTH_URL}?response_type=code&client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}&scope={'+'.join(GOOGLE_CALENDAR_SCOPES)}&access_type=offline"
        f"&prompt=consent&state={state}"
    )
    return base


async def exchange_google_code_for_tokens(
    code: str, redirect_uri: str
) -> dict[str, Any]:
    """Exchange authorization code for access and refresh tokens."""
    async with httpx.AsyncClient() as client:
        r = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        r.raise_for_status()
        data = r.json()
    expires_in = data.get("expires_in", 3600)
    return {
        "access_token": data["access_token"],
        "refresh_token": data.get("refresh_token"),
        "expires_in": expires_in,
    }


async def refresh_google_tokens(refresh_token_value: str) -> dict[str, Any]:
    """Refresh Google access token."""
    async with httpx.AsyncClient() as client:
        r = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "refresh_token": refresh_token_value,
                "grant_type": "refresh_token",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        r.raise_for_status()
        data = r.json()
    return {
        "access_token": data["access_token"],
        "expires_in": data.get("expires_in", 3600),
    }


async def google_calendar_list_calendars(access_token: str) -> list[dict]:
    """List user's calendars."""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{CALENDAR_API_BASE}/users/me/calendarList",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        r.raise_for_status()
        data = r.json()
    return data.get("items", [])


async def google_calendar_create_event(
    access_token: str,
    calendar_id: str,
    summary: str,
    start: datetime,
    end: datetime,
    description: Optional[str] = None,
) -> dict[str, Any]:
    """Create an event on Google Calendar. Returns created event with id and etag."""
    start_dt = start.astimezone(timezone.utc) if start.tzinfo else start.replace(tzinfo=timezone.utc)
    end_dt = end.astimezone(timezone.utc) if end.tzinfo else end.replace(tzinfo=timezone.utc)
    body = {
        "summary": summary,
        "description": description or "Synced from VerTechie",
        "start": {"dateTime": start_dt.isoformat(), "timeZone": "UTC"},
        "end": {"dateTime": end_dt.isoformat(), "timeZone": "UTC"},
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{CALENDAR_API_BASE}/calendars/{calendar_id}/events",
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
            json=body,
        )
        r.raise_for_status()
        return r.json()


async def google_calendar_update_event(
    access_token: str,
    calendar_id: str,
    event_id: str,
    summary: str,
    start: datetime,
    end: datetime,
    description: Optional[str] = None,
) -> dict[str, Any]:
    """Update an event. Returns updated event with etag."""
    start_dt = start.astimezone(timezone.utc) if start.tzinfo else start.replace(tzinfo=timezone.utc)
    end_dt = end.astimezone(timezone.utc) if end.tzinfo else end.replace(tzinfo=timezone.utc)
    body = {
        "summary": summary,
        "description": description or "Synced from VerTechie",
        "start": {"dateTime": start_dt.isoformat(), "timeZone": "UTC"},
        "end": {"dateTime": end_dt.isoformat(), "timeZone": "UTC"},
    }
    async with httpx.AsyncClient() as client:
        r = await client.patch(
            f"{CALENDAR_API_BASE}/calendars/{calendar_id}/events/{event_id}",
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
            json=body,
        )
        r.raise_for_status()
        return r.json()


async def google_calendar_delete_event(
    access_token: str, calendar_id: str, event_id: str
) -> None:
    """Delete an event."""
    async with httpx.AsyncClient() as client:
        r = await client.delete(
            f"{CALENDAR_API_BASE}/calendars/{calendar_id}/events/{event_id}",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        r.raise_for_status()


async def google_calendar_list_events_changed(
    access_token: str,
    calendar_id: str,
    sync_token: Optional[str] = None,
    time_min: Optional[datetime] = None,
) -> tuple[list[dict], Optional[str]]:
    """
    List events (incremental with syncToken). Returns (events, next_sync_token).
    If sync_token is None, full sync; response includes nextSyncToken for future incremental.
    """
    params: dict[str, str] = {"singleEvents": "true"}
    if sync_token:
        params["syncToken"] = sync_token
    else:
        if time_min:
            params["timeMin"] = time_min.astimezone(timezone.utc).isoformat()
        params["orderBy"] = "startTime"
    async with httpx.AsyncClient() as client:
        r = await client.get(
            f"{CALENDAR_API_BASE}/calendars/{calendar_id}/events",
            headers={"Authorization": f"Bearer {access_token}"},
            params=params,
        )
        r.raise_for_status()
        data = r.json()
    events = data.get("items", [])
    next_token = data.get("nextSyncToken")
    return events, next_token
