"""
Calendar sync API: Connect Google/Microsoft, OAuth callbacks, sync status, trigger sync.
"""
import secrets
import logging
from datetime import datetime, timezone, timedelta
from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.config import settings
from app.db.session import get_db
from app.models.calendar import (
    CalendarConnection,
    CalendarBlock,
    CalendarSyncMapping,
    CalendarProvider,
)
from app.models.user import User
from app.core.security import get_current_user
from app.services import google_calendar_sync as google_sync
from app.services import microsoft_calendar_sync as ms_sync

logger = logging.getLogger(__name__)

router = APIRouter()

# OAuth state storage (in production use Redis with expiry)
_google_oauth_states: dict[str, str] = {}
_microsoft_oauth_states: dict[str, str] = {}


def _redirect_uri(provider: str) -> str:
    base = settings.GOOGLE_CALENDAR_REDIRECT_URI if provider == "google" else settings.MICROSOFT_CALENDAR_REDIRECT_URI
    if base:
        return base
    origin = settings.FRONTEND_URL or (settings.CORS_ORIGINS[0] if settings.CORS_ORIGINS else "http://localhost:5173")
    return f"{origin.rstrip('/')}/calendar/callback/{provider}"


# ----- Schemas -----
class ConnectionResponse(BaseModel):
    id: str
    provider: str
    calendar_id: Optional[str] = None
    calendar_name: Optional[str] = None
    is_active: bool
    sync_enabled: bool
    last_synced_at: Optional[datetime] = None
    sync_status: Optional[str] = None
    last_sync_error: Optional[str] = None


class SyncStatusResponse(BaseModel):
    connections: List[ConnectionResponse]
    last_sync_at: Optional[datetime] = None
    sync_in_progress: bool = False


class ConnectGoogleResponse(BaseModel):
    auth_url: str
    state: str


class ConnectMicrosoftResponse(BaseModel):
    auth_url: str
    state: str


class CallbackRequest(BaseModel):
    code: str
    state: str


class CreateBlockRequest(BaseModel):
    title: str = "Busy"
    start_time: datetime
    end_time: datetime


# ----- Connect Google -----
@router.get("/connect/google", response_model=ConnectGoogleResponse)
async def connect_google_calendar_url(
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get Google Calendar OAuth URL. Frontend redirects user here."""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google Calendar is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
        )
    state = secrets.token_urlsafe(32)
    _google_oauth_states[state] = str(current_user.id)
    redirect_uri = _redirect_uri("google")
    auth_url = google_sync.get_google_calendar_authorize_url(redirect_uri, state)
    return {"auth_url": auth_url, "state": state}


@router.post("/callback/google")
async def google_calendar_callback(
    body: CallbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Exchange code for tokens and create/update calendar connection."""
    expected_user_id = _google_oauth_states.pop(body.state, None)
    if not expected_user_id or expected_user_id != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OAuth state.")
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Google Calendar not configured.")
    try:
        tokens = await google_sync.exchange_google_code_for_tokens(body.code, _redirect_uri("google"))
    except Exception as e:
        logger.exception("Google token exchange failed: %s", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get tokens from Google.")
    expires_at = datetime.utcnow() + timedelta(seconds=tokens.get("expires_in", 3600))
    # Get primary calendar id
    calendar_id = "primary"
    calendar_name = "Primary"
    try:
        calendars = await google_sync.google_calendar_list_calendars(tokens["access_token"])
        for cal in calendars:
            if cal.get("primary"):
                calendar_id = cal.get("id", "primary")
                calendar_name = cal.get("summary", "Primary")
                break
    except Exception:
        pass
    # Upsert connection
    result = await db.execute(
        select(CalendarConnection).where(
            CalendarConnection.user_id == current_user.id,
            CalendarConnection.provider == CalendarProvider.GOOGLE,
        )
    )
    conn = result.scalar_one_or_none()
    if conn:
        conn.access_token = tokens["access_token"]
        if tokens.get("refresh_token"):
            conn.refresh_token = tokens["refresh_token"]
        conn.token_expires_at = expires_at
        conn.calendar_id = calendar_id
        conn.calendar_name = calendar_name
        conn.is_active = True
        conn.sync_status = "idle"
        conn.last_sync_error = None
    else:
        conn = CalendarConnection(
            user_id=current_user.id,
            provider=CalendarProvider.GOOGLE,
            access_token=tokens["access_token"],
            refresh_token=tokens.get("refresh_token"),
            token_expires_at=expires_at,
            calendar_id=calendar_id,
            calendar_name=calendar_name,
            is_active=True,
            sync_enabled=True,
            sync_status="idle",
        )
        db.add(conn)
    await db.commit()
    await db.refresh(conn)
    return {"message": "Google Calendar connected", "connection_id": str(conn.id)}


# ----- Connect Microsoft -----
@router.get("/connect/microsoft", response_model=ConnectMicrosoftResponse)
async def connect_microsoft_calendar_url(
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get Microsoft Calendar OAuth URL."""
    if not settings.MICROSOFT_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Microsoft Calendar is not configured. Set MICROSOFT_CLIENT_ID and MICROSOFT_CLIENT_SECRET.",
        )
    state = secrets.token_urlsafe(32)
    _microsoft_oauth_states[state] = str(current_user.id)
    redirect_uri = _redirect_uri("microsoft")
    auth_url = ms_sync.get_microsoft_calendar_authorize_url(redirect_uri, state)
    return {"auth_url": auth_url, "state": state}


@router.post("/callback/microsoft")
async def microsoft_calendar_callback(
    body: CallbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Exchange code for tokens and create/update calendar connection."""
    expected_user_id = _microsoft_oauth_states.pop(body.state, None)
    if not expected_user_id or expected_user_id != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OAuth state.")
    if not settings.MICROSOFT_CLIENT_ID or not settings.MICROSOFT_CLIENT_SECRET:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Microsoft Calendar not configured.")
    try:
        tokens = await ms_sync.exchange_microsoft_code_for_tokens(body.code, _redirect_uri("microsoft"))
    except Exception as e:
        logger.exception("Microsoft token exchange failed: %s", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to get tokens from Microsoft.")
    expires_at = datetime.utcnow() + timedelta(seconds=tokens.get("expires_in", 3600))
    result = await db.execute(
        select(CalendarConnection).where(
            CalendarConnection.user_id == current_user.id,
            CalendarConnection.provider == CalendarProvider.MICROSOFT,
        )
    )
    conn = result.scalar_one_or_none()
    if conn:
        conn.access_token = tokens["access_token"]
        if tokens.get("refresh_token"):
            conn.refresh_token = tokens["refresh_token"]
        conn.token_expires_at = expires_at
        conn.calendar_id = None
        conn.calendar_name = "Outlook Calendar"
        conn.is_active = True
        conn.sync_status = "idle"
        conn.last_sync_error = None
    else:
        conn = CalendarConnection(
            user_id=current_user.id,
            provider=CalendarProvider.MICROSOFT,
            access_token=tokens["access_token"],
            refresh_token=tokens.get("refresh_token"),
            token_expires_at=expires_at,
            calendar_name="Outlook Calendar",
            is_active=True,
            sync_enabled=True,
            sync_status="idle",
        )
        db.add(conn)
    await db.commit()
    await db.refresh(conn)
    return {"message": "Microsoft Calendar connected", "connection_id": str(conn.id)}


# ----- List connections & sync status -----
@router.get("/connections", response_model=List[ConnectionResponse])
async def list_calendar_connections(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """List current user's calendar connections."""
    result = await db.execute(
        select(CalendarConnection)
        .where(CalendarConnection.user_id == current_user.id)
        .order_by(CalendarConnection.provider)
    )
    connections = result.scalars().all()
    return [
        ConnectionResponse(
            id=str(c.id),
            provider=c.provider.value,
            calendar_id=c.calendar_id,
            calendar_name=c.calendar_name,
            is_active=c.is_active,
            sync_enabled=c.sync_enabled,
            last_synced_at=c.last_synced_at,
            sync_status=c.sync_status,
            last_sync_error=c.last_sync_error,
        )
        for c in connections
    ]


@router.get("/sync/status", response_model=SyncStatusResponse)
async def get_sync_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get sync status and last sync time for all connections."""
    result = await db.execute(
        select(CalendarConnection)
        .where(CalendarConnection.user_id == current_user.id)
        .order_by(CalendarConnection.provider)
    )
    connections = result.scalars().all()
    last_sync_at = None
    sync_in_progress = any(c.sync_status == "syncing" for c in connections)
    for c in connections:
        if c.last_synced_at and (last_sync_at is None or c.last_synced_at > last_sync_at):
            last_sync_at = c.last_synced_at
    return SyncStatusResponse(
        connections=[
            ConnectionResponse(
                id=str(c.id),
                provider=c.provider.value,
                calendar_id=c.calendar_id,
                calendar_name=c.calendar_name,
                is_active=c.is_active,
                sync_enabled=c.sync_enabled,
                last_synced_at=c.last_synced_at,
                sync_status=c.sync_status,
                last_sync_error=c.last_sync_error,
            )
            for c in connections
        ],
        last_sync_at=last_sync_at,
        sync_in_progress=sync_in_progress,
    )


@router.delete("/connections/{connection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def disconnect_calendar(
    connection_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """Disconnect a calendar and remove stored tokens."""
    result = await db.execute(
        select(CalendarConnection).where(
            CalendarConnection.id == connection_id,
            CalendarConnection.user_id == current_user.id,
        )
    )
    conn = result.scalar_one_or_none()
    if not conn:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Connection not found.")
    await db.delete(conn)
    await db.commit()


# ----- Create block (app -> external push) -----
@router.post("/blocks", status_code=status.HTTP_201_CREATED)
async def create_calendar_block(
    body: CreateBlockRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create a calendar block in the app and push to all connected Google/Microsoft calendars."""
    start = body.start_time.astimezone(timezone.utc).replace(tzinfo=None) if body.start_time.tzinfo else body.start_time
    end = body.end_time.astimezone(timezone.utc).replace(tzinfo=None) if body.end_time.tzinfo else body.end_time
    block = CalendarBlock(
        user_id=current_user.id,
        title=body.title,
        start_time=start,
        end_time=end,
        source="app",
        last_updated_by="app",
    )
    db.add(block)
    await db.flush()
    result = await db.execute(
        select(CalendarConnection).where(
            CalendarConnection.user_id == current_user.id,
            CalendarConnection.is_active == True,
            CalendarConnection.sync_enabled == True,
        )
    )
    connections = result.scalars().all()
    for conn in connections:
        try:
            access_token = conn.access_token
            if conn.token_expires_at and conn.token_expires_at <= datetime.utcnow() and conn.refresh_token:
                if conn.provider == CalendarProvider.GOOGLE:
                    tok = await google_sync.refresh_google_tokens(conn.refresh_token)
                    access_token = tok["access_token"]
                    conn.access_token = access_token
                    conn.token_expires_at = datetime.utcnow() + timedelta(seconds=tok.get("expires_in", 3600))
                else:
                    tok = await ms_sync.refresh_microsoft_tokens(conn.refresh_token)
                    access_token = tok["access_token"]
                    conn.access_token = access_token
                    conn.token_expires_at = datetime.utcnow() + timedelta(seconds=tok.get("expires_in", 3600))
            if conn.provider == CalendarProvider.GOOGLE:
                ev = await google_sync.google_calendar_create_event(
                    access_token, conn.calendar_id or "primary", body.title, start, end
                )
                mapping = CalendarSyncMapping(
                    connection_id=conn.id,
                    internal_event_id=block.id,
                    provider=CalendarProvider.GOOGLE,
                    external_event_id=ev["id"],
                    etag=ev.get("etag"),
                    last_synced_at=datetime.utcnow(),
                )
                db.add(mapping)
            else:
                ev = await ms_sync.microsoft_calendar_create_event(
                    access_token, body.title, start, end
                )
                mapping = CalendarSyncMapping(
                    connection_id=conn.id,
                    internal_event_id=block.id,
                    provider=CalendarProvider.MICROSOFT,
                    external_event_id=ev["id"],
                    change_key=ev.get("changeKey"),
                    last_synced_at=datetime.utcnow(),
                )
                db.add(mapping)
        except Exception as e:
            logger.warning("Failed to push block to %s: %s", conn.provider.value, e)
    await db.commit()
    await db.refresh(block)
    return {"id": str(block.id), "title": block.title, "start_time": block.start_time, "end_time": block.end_time}


# ----- Trigger sync (runs in background) -----
async def _run_sync_for_user(user_id: UUID) -> None:
    """Background task: run full sync for a user (inbound from Google/Microsoft)."""
    from app.db.session import AsyncSessionLocal
    from sqlalchemy import select
    from app.models.calendar import CalendarConnection, CalendarBlock, CalendarSyncMapping, CalendarProvider
    from datetime import datetime, timezone

    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(
                select(CalendarConnection).where(
                    CalendarConnection.user_id == user_id,
                    CalendarConnection.is_active == True,
                    CalendarConnection.sync_enabled == True,
                )
            )
            connections = result.scalars().all()
            for conn in connections:
                try:
                    conn.sync_status = "syncing"
                    conn.last_sync_error = None
                    await session.commit()
                    access_token = conn.access_token
                    # Refresh token if expired
                    if conn.token_expires_at and conn.token_expires_at <= datetime.utcnow():
                        if conn.provider == CalendarProvider.GOOGLE and conn.refresh_token:
                            tok = await google_sync.refresh_google_tokens(conn.refresh_token)
                            access_token = tok["access_token"]
                            conn.access_token = access_token
                            conn.token_expires_at = datetime.utcnow() + timedelta(seconds=tok.get("expires_in", 3600))
                        elif conn.provider == CalendarProvider.MICROSOFT and conn.refresh_token:
                            tok = await ms_sync.refresh_microsoft_tokens(conn.refresh_token)
                            access_token = tok["access_token"]
                            conn.access_token = access_token
                            if tok.get("refresh_token"):
                                conn.refresh_token = tok["refresh_token"]
                            conn.token_expires_at = datetime.utcnow() + timedelta(seconds=tok.get("expires_in", 3600))
                        await session.commit()
                    if conn.provider == CalendarProvider.GOOGLE:
                        events, next_token = await google_sync.google_calendar_list_events_changed(
                            access_token, conn.calendar_id or "primary", sync_token=conn.sync_token
                        )
                        for ev in events:
                            if ev.get("status") == "cancelled":
                                # Mark internal as deleted or remove mapping
                                ext_id = ev.get("id")
                                map_r = await session.execute(
                                    select(CalendarSyncMapping).where(
                                        CalendarSyncMapping.connection_id == conn.id,
                                        CalendarSyncMapping.external_event_id == ext_id,
                                    )
                                )
                                m = map_r.scalar_one_or_none()
                                if m and m.internal_event_id:
                                    blk = await session.get(CalendarBlock, m.internal_event_id)
                                    if blk:
                                        blk.is_deleted = True
                                        blk.last_updated_by = "google"
                                continue
                            start = ev.get("start", {}).get("dateTime") or ev.get("start", {}).get("date")
                            end = ev.get("end", {}).get("dateTime") or ev.get("end", {}).get("date")
                            if not start or not end:
                                continue
                            from dateutil import parser as date_parser
                            try:
                                start_dt = date_parser.parse(start)
                                end_dt = date_parser.parse(end)
                            except Exception:
                                continue
                            summary = ev.get("summary") or "Busy"
                            ext_id = ev.get("id")
                            etag = ev.get("etag")
                            map_r = await session.execute(
                                select(CalendarSyncMapping).where(
                                    CalendarSyncMapping.connection_id == conn.id,
                                    CalendarSyncMapping.external_event_id == ext_id,
                                )
                            )
                            m = map_r.scalar_one_or_none()
                            if m:
                                blk = await session.get(CalendarBlock, m.internal_event_id)
                                if blk and blk.external_version == etag:
                                    continue
                                if blk:
                                    blk.title = summary
                                    blk.start_time = start_dt
                                    blk.end_time = end_dt
                                    blk.last_updated_by = "google"
                                    blk.external_version = etag
                                    blk.is_deleted = False
                                    m.etag = etag
                                    m.last_synced_at = datetime.utcnow()
                            else:
                                blk = CalendarBlock(
                                    user_id=user_id,
                                    title=summary,
                                    start_time=start_dt,
                                    end_time=end_dt,
                                    source="google",
                                    last_updated_by="google",
                                    external_version=etag,
                                )
                                session.add(blk)
                                await session.flush()
                                m = CalendarSyncMapping(
                                    connection_id=conn.id,
                                    internal_event_id=blk.id,
                                    provider=CalendarProvider.GOOGLE,
                                    external_event_id=ext_id,
                                    etag=etag,
                                    last_synced_at=datetime.utcnow(),
                                )
                                session.add(m)
                        if next_token:
                            conn.sync_token = next_token
                    elif conn.provider == CalendarProvider.MICROSOFT:
                        events, delta_link = await ms_sync.microsoft_calendar_delta(
                            access_token, conn.sync_token
                        )
                        for ev in events:
                            if ev.get("isCancelled"):
                                ext_id = ev.get("id")
                                map_r = await session.execute(
                                    select(CalendarSyncMapping).where(
                                        CalendarSyncMapping.connection_id == conn.id,
                                        CalendarSyncMapping.external_event_id == ext_id,
                                    )
                                )
                                m = map_r.scalar_one_or_none()
                                if m and m.internal_event_id:
                                    blk = await session.get(CalendarBlock, m.internal_event_id)
                                    if blk:
                                        blk.is_deleted = True
                                        blk.last_updated_by = "microsoft"
                                continue
                            start = (ev.get("start") or {}).get("dateTime")
                            end = (ev.get("end") or {}).get("dateTime")
                            if not start or not end:
                                continue
                            from dateutil import parser as date_parser
                            try:
                                start_dt = date_parser.parse(start)
                                end_dt = date_parser.parse(end)
                            except Exception:
                                continue
                            summary = ev.get("subject") or "Busy"
                            ext_id = ev.get("id")
                            change_key = ev.get("changeKey")
                            map_r = await session.execute(
                                select(CalendarSyncMapping).where(
                                    CalendarSyncMapping.connection_id == conn.id,
                                    CalendarSyncMapping.external_event_id == ext_id,
                                )
                            )
                            m = map_r.scalar_one_or_none()
                            if m:
                                blk = await session.get(CalendarBlock, m.internal_event_id)
                                if blk and blk.external_version == change_key:
                                    continue
                                if blk:
                                    blk.title = summary
                                    blk.start_time = start_dt
                                    blk.end_time = end_dt
                                    blk.last_updated_by = "microsoft"
                                    blk.external_version = change_key
                                    blk.is_deleted = False
                                    m.change_key = change_key
                                    m.last_synced_at = datetime.utcnow()
                            else:
                                blk = CalendarBlock(
                                    user_id=user_id,
                                    title=summary,
                                    start_time=start_dt,
                                    end_time=end_dt,
                                    source="microsoft",
                                    last_updated_by="microsoft",
                                    external_version=change_key,
                                )
                                session.add(blk)
                                await session.flush()
                                m = CalendarSyncMapping(
                                    connection_id=conn.id,
                                    internal_event_id=blk.id,
                                    provider=CalendarProvider.MICROSOFT,
                                    external_event_id=ext_id,
                                    change_key=change_key,
                                    last_synced_at=datetime.utcnow(),
                                )
                                session.add(m)
                        if delta_link:
                            conn.sync_token = delta_link
                    conn.last_synced_at = datetime.utcnow()
                    conn.sync_status = "idle"
                except Exception as e:
                    logger.exception("Sync failed for connection %s: %s", conn.id, e)
                    conn.sync_status = "error"
                    conn.last_sync_error = str(e)[:500]
                await session.commit()
        except Exception as e:
            logger.exception("Sync background task failed: %s", e)


@router.post("/sync/now", status_code=status.HTTP_202_ACCEPTED)
async def trigger_sync_now(
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Trigger a sync now (runs in background). Returns immediately."""
    background_tasks.add_task(_run_sync_for_user, current_user.id)
    return {"message": "Sync started in background. Check sync status for progress."}
