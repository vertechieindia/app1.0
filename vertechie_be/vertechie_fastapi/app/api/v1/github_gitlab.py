"""
GitHub and GitLab Integration API endpoints.
Both use OAuth for authentication. GitHub uses GraphQL for contributions; GitLab uses Events API.
"""

from typing import Any, Optional, Dict
from datetime import datetime, timedelta
from urllib.parse import urlencode
import secrets

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import httpx
import logging

from app.core.config import settings
from app.core.security import get_current_user
from app.models.user import User, UserProfile
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

logger = logging.getLogger(__name__)

router = APIRouter()

# GitHub OAuth
GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"
GITHUB_USER_API = "https://api.github.com/user"

# GitLab OAuth
GITLAB_OAUTH_URL = "https://gitlab.com/oauth/authorize"
GITLAB_TOKEN_URL = "https://gitlab.com/oauth/token"
GITLAB_USER_API = "https://gitlab.com/api/v4/user"
GITLAB_EVENTS_API = "https://gitlab.com/api/v4/events"

# OAuth state storage (in production, use Redis with expiry)
_oauth_states: Dict[str, str] = {}
_gitlab_oauth_states: Dict[str, str] = {}


def _is_production() -> bool:
    """True when ENVIRONMENT is production (use production OAuth apps)."""
    env = (getattr(settings, "ENVIRONMENT", None) or "development").strip().lower()
    return env == "production"


def _github_credentials() -> tuple:
    """Return (client_id, client_secret, callback_url) for current environment."""
    if _is_production():
        cid = (getattr(settings, "GITHUB_CLIENT_ID_PRODUCTION", None) or "").strip()
        secret = (getattr(settings, "GITHUB_CLIENT_SECRET_PRODUCTION", None) or "").strip()
        url = (getattr(settings, "GITHUB_CALLBACK_URL_PRODUCTION", None) or "").strip()
        return cid, secret, url or None
    cid = (getattr(settings, "GITHUB_CLIENT_ID", None) or "").strip()
    secret = (getattr(settings, "GITHUB_CLIENT_SECRET", None) or "").strip()
    url = (getattr(settings, "GITHUB_CALLBACK_URL", None) or "").strip()
    return cid, secret, url or None


def _gitlab_credentials() -> tuple:
    """Return (client_id, client_secret, callback_url) for current environment."""
    if _is_production():
        cid = (getattr(settings, "GITLAB_CLIENT_ID_PRODUCTION", None) or "").strip()
        secret = (getattr(settings, "GITLAB_CLIENT_SECRET_PRODUCTION", None) or "").strip()
        url = (getattr(settings, "GITLAB_CALLBACK_URL_PRODUCTION", None) or "").strip()
        return cid, secret, url or None
    cid = (getattr(settings, "GITLAB_CLIENT_ID", None) or "").strip()
    secret = (getattr(settings, "GITLAB_CLIENT_SECRET", None) or "").strip()
    url = (getattr(settings, "GITLAB_CALLBACK_URL", None) or "").strip()
    return cid, secret, url or None


class GitHubOAuthCallbackRequest(BaseModel):
    """Request for GitHub OAuth callback."""
    code: str
    state: str


class GitLabOAuthCallbackRequest(BaseModel):
    """Request for GitLab OAuth callback."""
    code: str
    state: str


# ============================================
# HELPER FUNCTIONS
# ============================================

async def _get_profile(db: AsyncSession, user_id) -> Optional[UserProfile]:
    """Helper to fetch user profile."""
    result = await db.execute(select(UserProfile).where(UserProfile.user_id == user_id))
    return result.scalar_one_or_none()


async def _ensure_profile(db: AsyncSession, user_id) -> UserProfile:
    """Get or create user profile."""
    profile = await _get_profile(db, user_id)
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        await db.flush()
    return profile


# ============================================
# GITHUB OAUTH ENDPOINTS
# ============================================

@router.get("/github/auth")
async def github_auth_url(
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """
    Get GitHub OAuth authorization URL.
    Uses development or production credentials based on ENVIRONMENT.
    """
    cid, _, _ = _github_credentials()
    if not cid:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GitHub OAuth is not configured. Set GITHUB_CLIENT_ID (or GITHUB_CLIENT_ID_PRODUCTION when ENVIRONMENT=production)."
        )

    state = secrets.token_urlsafe(32)
    _oauth_states[state] = str(current_user.id)

    _, __, callback_url = _github_credentials()
    redirect = callback_url or "http://localhost:5173/github/callback"
    params = {
        "client_id": cid,
        "scope": "read:user",
        "state": state,
        "redirect_uri": redirect,
    }
    auth_url = f"{GITHUB_OAUTH_URL}?{urlencode(params)}"
    return {"auth_url": auth_url, "state": state}


@router.post("/github/callback")
async def github_oauth_callback(
    body: GitHubOAuthCallbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Handle GitHub OAuth callback.
    Exchange authorization code for access token and store it.
    Uses development or production credentials based on ENVIRONMENT.
    """
    cid, secret, callback_url = _github_credentials()
    if not cid or not secret:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GitHub OAuth is not configured"
        )

    expected_user_id = _oauth_states.pop(body.state, None)
    if not expected_user_id or expected_user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OAuth state. Please try connecting again."
        )

    redirect = callback_url or "http://localhost:5173/github/callback"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            token_response = await client.post(
                GITHUB_TOKEN_URL,
                data={
                    "client_id": cid,
                    "client_secret": secret,
                    "code": body.code,
                },
                headers={"Accept": "application/json"},
            )
            
            if token_response.status_code != 200:
                logger.error(f"GitHub token exchange failed: {token_response.text}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to exchange GitHub authorization code"
                )
            
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                error = token_data.get("error_description", token_data.get("error", "Unknown error"))
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"GitHub OAuth error: {error}"
                )
            
            # Get GitHub user info
            user_response = await client.get(
                GITHUB_USER_API,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                    "User-Agent": "VerTechie-App/1.0",
                },
            )
            
            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to fetch GitHub user info"
                )
            
            github_user = user_response.json()
            github_login = github_user.get("login")
            github_id = str(github_user.get("id"))
            
            # Store in profile
            profile = await _ensure_profile(db, current_user.id)
            profile.github_access_token = access_token  # In production, encrypt this
            profile.github_username = github_login
            profile.github_user_id = github_id
            profile.github_connected_at = datetime.utcnow()
            
            await db.commit()
            await db.refresh(profile)
            
            return {
                "status": "connected",
                "service": "github",
                "username": github_login,
                "user_id": github_id,
            }
            
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="GitHub API request timed out"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"GitHub OAuth error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete GitHub authorization"
        )


@router.delete("/github/disconnect")
async def disconnect_github(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """Disconnect GitHub account and revoke access."""
    profile = await _get_profile(db, current_user.id)
    if profile:
        profile.github_access_token = None
        profile.github_username = None
        profile.github_user_id = None
        profile.github_connected_at = None
        await db.commit()
    
    return {"status": "disconnected", "service": "github"}


@router.get("/github/status")
async def github_connection_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Check GitHub connection status."""
    profile = await _get_profile(db, current_user.id)
    
    if profile and profile.github_access_token and profile.github_username:
        return {
            "connected": True,
            "username": profile.github_username,
            "connected_at": profile.github_connected_at.isoformat() if profile.github_connected_at else None,
        }
    
    return {"connected": False}


# ============================================
# GITLAB OAUTH ENDPOINTS
# ============================================

@router.get("/gitlab/auth")
async def gitlab_auth_url(
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """Get GitLab OAuth authorization URL. Uses dev or prod credentials based on ENVIRONMENT."""
    cid, _, _ = _gitlab_credentials()
    if not cid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitLab OAuth is not configured. Add GITLAB_CLIENT_ID (or GITLAB_CLIENT_ID_PRODUCTION when ENVIRONMENT=production)."
        )
    state = secrets.token_urlsafe(32)
    _gitlab_oauth_states[state] = str(current_user.id)
    _, __, callback_url = _gitlab_credentials()
    redirect = callback_url or "http://localhost:5173/gitlab/callback"
    params = {
        "client_id": cid,
        "redirect_uri": redirect,
        "response_type": "code",
        "state": state,
        "scope": "read_user read_api",
    }
    auth_url = f"{GITLAB_OAUTH_URL}?{urlencode(params)}"
    return {"auth_url": auth_url, "state": state}


@router.post("/gitlab/callback")
async def gitlab_oauth_callback(
    body: GitLabOAuthCallbackRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Handle GitLab OAuth callback. Uses dev or prod credentials based on ENVIRONMENT."""
    cid, secret, callback_url = _gitlab_credentials()
    if not cid or not secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GitLab OAuth is not configured. Add GITLAB_CLIENT_ID (or GITLAB_CLIENT_ID_PRODUCTION when ENVIRONMENT=production)."
        )
    expected_user_id = _gitlab_oauth_states.pop(body.state, None)
    if not expected_user_id or expected_user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OAuth state. Please try connecting again."
        )
    redirect = callback_url or "http://localhost:5173/gitlab/callback"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            token_response = await client.post(
                GITLAB_TOKEN_URL,
                data={
                    "client_id": cid,
                    "client_secret": secret,
                    "code": body.code,
                    "grant_type": "authorization_code",
                    "redirect_uri": redirect,
                },
                headers={"Accept": "application/json"},
            )
            if token_response.status_code != 200:
                error_text = token_response.text
                logger.error(f"GitLab token exchange failed (status {token_response.status_code}): {error_text}")
                try:
                    error_json = token_response.json()
                    error_detail = error_json.get("error_description", error_json.get("error", "Unknown error"))
                except:
                    error_detail = error_text[:200] if error_text else "Unknown error"
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"GitLab OAuth failed: {error_detail}"
                )
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            if not access_token:
                error = token_data.get("error_description", token_data.get("error", "Unknown error"))
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"GitLab OAuth error: {error}"
                )
            user_response = await client.get(
                GITLAB_USER_API,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "User-Agent": "VerTechie-App/1.0",
                },
            )
            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to fetch GitLab user info"
                )
            gitlab_user = user_response.json()
            gitlab_username = gitlab_user.get("username")
            gitlab_id = str(gitlab_user.get("id"))
            profile = await _ensure_profile(db, current_user.id)
            profile.gitlab_access_token = access_token
            profile.gitlab_username = gitlab_username
            profile.gitlab_user_id = gitlab_id
            profile.gitlab_connected_at = datetime.utcnow()
            await db.commit()
            await db.refresh(profile)
            return {
                "status": "connected",
                "service": "gitlab",
                "username": gitlab_username,
                "user_id": gitlab_id,
            }
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="GitLab API request timed out"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"GitLab OAuth error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to complete GitLab authorization"
        )


@router.delete("/gitlab/disconnect")
async def disconnect_gitlab(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """Disconnect GitLab account."""
    profile = await _get_profile(db, current_user.id)
    if profile:
        profile.gitlab_access_token = None
        profile.gitlab_username = None
        profile.gitlab_user_id = None
        profile.gitlab_connected_at = None
        await db.commit()
    return {"status": "disconnected", "service": "gitlab"}


@router.get("/gitlab/status")
async def gitlab_connection_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Check GitLab connection status."""
    profile = await _get_profile(db, current_user.id)
    if profile and profile.gitlab_access_token and profile.gitlab_username:
        return {
            "connected": True,
            "username": profile.gitlab_username,
            "connected_at": profile.gitlab_connected_at.isoformat() if profile.gitlab_connected_at else None,
        }
    return {"connected": False}


# ============================================
# GITHUB GRAPHQL CONTRIBUTIONS FETCH
# ============================================

async def fetch_github_contributions_graphql(access_token: str, username: str, year: int) -> Dict[str, Any]:
    """
    Fetch GitHub contributions using GraphQL API.
    This provides the exact same data as GitHub's contribution graph.
    """
    # Build date range for the year
    from_date = f"{year}-01-01T00:00:00Z"
    to_date = f"{year}-12-31T23:59:59Z"
    
    query = """
    query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            date
                            contributionCount
                            contributionLevel
                        }
                    }
                }
            }
        }
    }
    """
    
    variables = {
        "username": username,
        "from": from_date,
        "to": to_date,
    }
    
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                GITHUB_GRAPHQL_URL,
                json={"query": query, "variables": variables},
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json",
                    "User-Agent": "VerTechie-App/1.0",
                },
            )
            
            if response.status_code == 401:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="GitHub token expired. Please reconnect your GitHub account."
                )
            
            if response.status_code != 200:
                logger.error(f"GitHub GraphQL error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"GitHub API error: {response.status_code}"
                )
            
            data = response.json()
            
            if "errors" in data:
                error_msg = data["errors"][0].get("message", "GraphQL error")
                logger.error(f"GitHub GraphQL query error: {error_msg}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"GitHub API error: {error_msg}"
                )
            
            user_data = data.get("data", {}).get("user")
            if not user_data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"GitHub user '{username}' not found"
                )
            
            calendar = user_data["contributionsCollection"]["contributionCalendar"]
            total = calendar["totalContributions"]
            
            # Flatten weeks into daily contributions
            contributions = []
            level_map = {
                "NONE": 0,
                "FIRST_QUARTILE": 1,
                "SECOND_QUARTILE": 2,
                "THIRD_QUARTILE": 3,
                "FOURTH_QUARTILE": 4,
            }
            
            for week in calendar["weeks"]:
                for day in week["contributionDays"]:
                    contributions.append({
                        "date": day["date"],
                        "count": day["contributionCount"],
                        "level": level_map.get(day["contributionLevel"], 0),
                    })
            
            return {
                "username": username,
                "year": year,
                "contributions": contributions,
                "total": total,
                "source": "github",
            }
            
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="GitHub API request timed out"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"GitHub GraphQL fetch error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch GitHub contributions: {str(e)}"
        )


# ============================================
# GITLAB CONTRIBUTIONS (OAUTH TOKEN)
# ============================================

async def fetch_gitlab_contributions(access_token: str, username: str, year: int) -> Dict[str, Any]:
    """Fetch GitLab contribution data using OAuth token and Events API."""
    start_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31, 23, 59, 59)
    after = start_date.strftime("%Y-%m-%dT00:00:00Z")
    before = end_date.strftime("%Y-%m-%dT23:59:59Z")
    contributions: Dict[str, int] = {}
    page = 1
    per_page = 100
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            while True:
                response = await client.get(
                    GITLAB_EVENTS_API,
                    params={"per_page": per_page, "page": page, "after": after, "before": before},
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "User-Agent": "VerTechie-App/1.0",
                    },
                )
                if response.status_code == 401:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="GitLab token expired. Please reconnect your GitLab account."
                    )
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"GitLab API error: {response.status_code}"
                    )
                events = response.json()
                if not events:
                    break
                for event in events:
                    action_name = event.get("action_name", "")
                    if action_name in ["pushed", "opened", "closed", "commented", "created", "merged"]:
                        created_at = datetime.fromisoformat(event["created_at"].replace("Z", "+00:00"))
                        if start_date <= created_at <= end_date:
                            date_key = created_at.date().isoformat()
                            contributions[date_key] = contributions.get(date_key, 0) + 1
                if len(events) < per_page:
                    break
                page += 1
                if page > 50:
                    break
        contribution_data = []
        current_date = start_date.date()
        while current_date <= end_date.date():
            count = contributions.get(current_date.isoformat(), 0)
            level = min(4, (count // 3) + 1) if count > 0 else 0
            contribution_data.append({
                "date": current_date.isoformat(),
                "count": count,
                "level": level
            })
            current_date += timedelta(days=1)
        return {
            "username": username,
            "year": year,
            "contributions": contribution_data,
            "total": sum(contributions.values()),
            "source": "gitlab"
        }
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="GitLab API request timed out"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"GitLab fetch error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch GitLab contributions: {str(e)}"
        )


# ============================================
# UNIFIED CONTRIBUTIONS ENDPOINT
# ============================================

@router.get("/contributions")
async def get_user_contributions(
    year: int = Query(None, ge=2020, le=2030),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Get contribution data from connected GitHub and/or GitLab accounts.
    GitHub uses OAuth + GraphQL for accurate data.
    GitLab uses public API.
    """
    if year is None:
        year = datetime.now().year

    profile = await _get_profile(db, current_user.id)
    github_data = None
    gitlab_data = None
    github_error = None
    gitlab_error = None

    # Fetch GitHub contributions using OAuth token + GraphQL
    if profile and profile.github_access_token and profile.github_username:
        try:
            github_data = await fetch_github_contributions_graphql(
                profile.github_access_token,
                profile.github_username,
                year
            )
        except HTTPException as e:
            github_error = e.detail
            logger.warning(f"GitHub contributions fetch failed: {e.detail}")
        except Exception as e:
            github_error = str(e)
            logger.warning(f"GitHub contributions fetch failed: {e}")

    # Fetch GitLab contributions using OAuth token + Events API
    if profile and profile.gitlab_access_token and profile.gitlab_username:
        try:
            gitlab_data = await fetch_gitlab_contributions(
                profile.gitlab_access_token,
                profile.gitlab_username,
                year
            )
        except HTTPException as e:
            gitlab_error = e.detail
            logger.warning(f"GitLab contributions fetch failed: {e.detail}")
        except Exception as e:
            gitlab_error = str(e)
            logger.warning(f"GitLab contributions fetch failed: {e}")
    
    # Merge contributions from both sources
    contributions_map: Dict[str, int] = {}
    levels_map: Dict[str, int] = {}
    
    if github_data:
        for contrib in github_data["contributions"]:
            date = contrib["date"]
            contributions_map[date] = contributions_map.get(date, 0) + contrib["count"]
            # Use GitHub's level as primary (more accurate from GraphQL)
            levels_map[date] = max(levels_map.get(date, 0), contrib["level"])
    
    if gitlab_data:
        for contrib in gitlab_data["contributions"]:
            date = contrib["date"]
            contributions_map[date] = contributions_map.get(date, 0) + contrib["count"]
            if date not in levels_map:
                levels_map[date] = contrib["level"]
    
    # Build final contribution data
    start_date = datetime(year, 1, 1).date()
    end_date = datetime(year, 12, 31).date()
    contribution_data = []
    
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.isoformat()
        count = contributions_map.get(date_str, 0)
        level = levels_map.get(date_str, 0)
        
        # Recalculate level if only GitLab data (for consistency)
        if count > 0 and level == 0:
            level = min(4, (count // 3) + 1)
        
        contribution_data.append({
            "date": date_str,
            "count": count,
            "level": level
        })
        current_date += timedelta(days=1)
    
    return {
        "year": year,
        "contributions": contribution_data,
        "total": sum(contributions_map.values()),
        "sources": {
            "github": github_data is not None,
            "gitlab": gitlab_data is not None
        },
        "github_username": profile.github_username if profile else None,
        "gitlab_username": profile.gitlab_username if profile else None,
        "errors": {
            "github": github_error,
            "gitlab": gitlab_error,
        } if github_error or gitlab_error else None,
    }


# ============================================
# CONNECTION STATUS ENDPOINT
# ============================================

@router.get("/status")
async def get_connection_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Get connection status for all services."""
    profile = await _get_profile(db, current_user.id)
    
    return {
        "github": {
            "connected": bool(profile and profile.github_access_token),
            "username": profile.github_username if profile else None,
            "connected_at": profile.github_connected_at.isoformat() if profile and profile.github_connected_at else None,
        },
        "gitlab": {
            "connected": bool(profile and profile.gitlab_access_token),
            "username": profile.gitlab_username if profile else None,
            "connected_at": profile.gitlab_connected_at.isoformat() if profile and profile.gitlab_connected_at else None,
        },
    }
