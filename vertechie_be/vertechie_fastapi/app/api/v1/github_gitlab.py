"""
GitHub and GitLab Integration API endpoints.
GitHub uses OAuth for proper authentication and GraphQL for contribution data.
GitLab uses username-based public API access.
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

# GitHub OAuth configuration
GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"
GITHUB_USER_API = "https://api.github.com/user"

# OAuth state storage (in production, use Redis with expiry)
_oauth_states: Dict[str, str] = {}


class ConnectServiceRequest(BaseModel):
    """Request body for connecting GitLab (username-based)."""
    username: str


class GitHubOAuthCallbackRequest(BaseModel):
    """Request for GitHub OAuth callback."""
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
    Frontend should redirect user to this URL.
    """
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GitHub OAuth is not configured. Set GITHUB_CLIENT_ID in environment."
        )
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    _oauth_states[state] = str(current_user.id)
    
    # Build OAuth URL
    redirect = settings.GITHUB_CALLBACK_URL or (f"{settings.CORS_ORIGINS[0]}/github/callback" if settings.CORS_ORIGINS else "http://localhost:5173/github/callback")
    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "scope": "read:user",  # Minimal scope for contribution data
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
    """
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="GitHub OAuth is not configured"
        )
    
    # Verify state (CSRF protection)
    expected_user_id = _oauth_states.pop(body.state, None)
    if not expected_user_id or expected_user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OAuth state. Please try connecting again."
        )
    
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            # Exchange code for access token
            token_response = await client.post(
                GITHUB_TOKEN_URL,
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
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
# GITLAB (USERNAME-BASED)
# ============================================

@router.post("/gitlab/connect")
async def connect_gitlab(
    body: ConnectServiceRequest = Body(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Connect GitLab account using username (public API)."""
    username = (body.username or "").strip()
    if not username:
        raise HTTPException(status_code=400, detail="username is required")
    
    # Verify username exists on GitLab
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"https://gitlab.com/api/v4/users?username={username}",
                headers={"User-Agent": "VerTechie-App/1.0"},
            )
            if response.status_code != 200 or not response.json():
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"GitLab user '{username}' not found"
                )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="GitLab API timeout")
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"GitLab user verification failed: {e}")
    
    profile = await _ensure_profile(db, current_user.id)
    profile.activity_gitlab_username = username
    await db.commit()
    
    return {"status": "connected", "service": "gitlab", "username": username}


@router.delete("/gitlab/disconnect")
async def disconnect_gitlab(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, str]:
    """Disconnect GitLab account."""
    profile = await _get_profile(db, current_user.id)
    if profile:
        profile.activity_gitlab_username = None
        await db.commit()
    
    return {"status": "disconnected", "service": "gitlab"}


async def fetch_gitlab_contributions(username: str, year: int) -> Dict[str, Any]:
    """Fetch GitLab contribution data using public API."""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            events_url = f"https://gitlab.com/api/v4/users/{username}/events"
            response = await client.get(
                events_url,
                headers={"User-Agent": "VerTechie-App/1.0"},
            )
            
            if response.status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"GitLab user '{username}' not found"
                )
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"GitLab API error: {response.status_code}"
                )
            
            events = response.json()
            
            contributions: Dict[str, int] = {}
            start_date = datetime(year, 1, 1)
            end_date = datetime(year, 12, 31, 23, 59, 59)
            
            for event in events:
                action_name = event.get("action_name", "")
                if action_name in ["pushed", "opened", "closed", "commented", "created"]:
                    created_at = datetime.fromisoformat(event["created_at"].replace("Z", "+00:00"))
                    if start_date <= created_at <= end_date:
                        date_key = created_at.date().isoformat()
                        contributions[date_key] = contributions.get(date_key, 0) + 1
            
            # Build contribution data for full year
            contribution_data = []
            current_date = start_date.date()
            while current_date <= end_date.date():
                count = contributions.get(current_date.isoformat(), 0)
                level = 0
                if count > 0:
                    level = min(4, (count // 3) + 1)
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

    # Fetch GitLab contributions using public API
    if profile and profile.activity_gitlab_username:
        try:
            gitlab_data = await fetch_gitlab_contributions(
                profile.activity_gitlab_username,
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
        "gitlab_username": profile.activity_gitlab_username if profile else None,
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
            "connected": bool(profile and profile.activity_gitlab_username),
            "username": profile.activity_gitlab_username if profile else None,
        },
    }
