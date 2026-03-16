"""
Microsoft Graph Calendar OAuth and sync helpers.
Uses Microsoft Graph: OAuth2, calendar events CRUD, delta query for change tracking.
"""
import logging
from datetime import datetime, timezone
from typing import Any, Optional

import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

MS_AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
MS_TOKEN_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
MS_SCOPES = [
    "offline_access",
    "Calendars.ReadWrite",
    "User.Read",
]
GRAPH_BASE = "https://graph.microsoft.com/v1.0"


def get_microsoft_calendar_authorize_url(redirect_uri: str, state: str) -> str:
    """Build Microsoft OAuth2 authorize URL for Calendar."""
    scopes = " ".join(MS_SCOPES)
    return (
        f"{MS_AUTH_URL}?response_type=code&client_id={settings.MICROSOFT_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}&scope={scopes}&response_mode=query"
        f"&state={state}&prompt=consent"
    )


async def exchange_microsoft_code_for_tokens(
    code: str, redirect_uri: str
) -> dict[str, Any]:
    """Exchange authorization code for access and refresh tokens."""
    async with httpx.AsyncClient() as client:
        r = await client.post(
            MS_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.MICROSOFT_CLIENT_ID,
                "client_secret": settings.MICROSOFT_CLIENT_SECRET,
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


async def refresh_microsoft_tokens(refresh_token_value: str) -> dict[str, Any]:
    """Refresh Microsoft access token."""
    async with httpx.AsyncClient() as client:
        r = await client.post(
            MS_TOKEN_URL,
            data={
                "client_id": settings.MICROSOFT_CLIENT_ID,
                "client_secret": settings.MICROSOFT_CLIENT_SECRET,
                "refresh_token": refresh_token_value,
                "grant_type": "refresh_token",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        r.raise_for_status()
        data = r.json()
    return {
        "access_token": data["access_token"],
        "refresh_token": data.get("refresh_token") or refresh_token_value,
        "expires_in": data.get("expires_in", 3600),
    }


def _format_graph_datetime(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")


async def microsoft_calendar_create_event(
    access_token: str,
    subject: str,
    start: datetime,
    end: datetime,
    body_text: Optional[str] = None,
) -> dict[str, Any]:
    """Create an event in user's default calendar. Returns created event with id and changeKey."""
    payload = {
        "subject": subject,
        "body": {"contentType": "text", "content": body_text or "Synced from VerTechie"},
        "start": {"dateTime": _format_graph_datetime(start), "timeZone": "UTC"},
        "end": {"dateTime": _format_graph_datetime(end), "timeZone": "UTC"},
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{GRAPH_BASE}/me/calendar/events",
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
            json=payload,
        )
        r.raise_for_status()
        return r.json()


async def microsoft_calendar_update_event(
    access_token: str,
    event_id: str,
    subject: str,
    start: datetime,
    end: datetime,
    body_text: Optional[str] = None,
) -> dict[str, Any]:
    """Update an event. Returns updated event with changeKey."""
    payload = {
        "subject": subject,
        "body": {"contentType": "text", "content": body_text or "Synced from VerTechie"},
        "start": {"dateTime": _format_graph_datetime(start), "timeZone": "UTC"},
        "end": {"dateTime": _format_graph_datetime(end), "timeZone": "UTC"},
    }
    async with httpx.AsyncClient() as client:
        r = await client.patch(
            f"{GRAPH_BASE}/me/calendar/events/{event_id}",
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
            json=payload,
        )
        r.raise_for_status()
        return r.json()


async def microsoft_calendar_delete_event(
    access_token: str, event_id: str
) -> None:
    """Delete an event."""
    async with httpx.AsyncClient() as client:
        r = await client.delete(
            f"{GRAPH_BASE}/me/calendar/events/{event_id}",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        r.raise_for_status()


async def microsoft_calendar_delta(
    access_token: str, delta_link: Optional[str] = None
) -> tuple[list[dict], Optional[str]]:
    """
    Delta query for calendar events. Returns (events, next_delta_link).
    If delta_link is None, start from full sync; response includes @odata.deltaLink for next run.
    """
    url = delta_link or f"{GRAPH_BASE}/me/calendar/events/delta"
    events: list[dict] = []
    next_link: Optional[str] = url
    delta_link_result: Optional[str] = None

    async with httpx.AsyncClient() as client:
        while next_link:
            r = await client.get(
                next_link,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            r.raise_for_status()
            data = r.json()
            for item in data.get("value", []):
                odata_type = (item.get("@odata.type") or "").lower()
                if "event" in odata_type or (item.get("id") and "subject" in item):
                    events.append(item)
            next_link = data.get("@odata.nextLink")
            if data.get("@odata.deltaLink"):
                delta_link_result = data["@odata.deltaLink"]
    return events, delta_link_result
