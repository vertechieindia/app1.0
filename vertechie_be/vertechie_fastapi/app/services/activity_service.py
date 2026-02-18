"""
Activity and XP Service for Gamification
"""

from typing import Optional
from uuid import UUID
from datetime import datetime, date, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.activity import UserActivity, ActivityType
from app.models.user import UserProfile

# XP Constants
XP_MAP = {
    ActivityType.LOGIN: 5,
    ActivityType.PRACTICE: 50,
    ActivityType.LEARN: 30,
    ActivityType.POST: 20,
    ActivityType.COMMENT: 10,
    ActivityType.QUIZ: 40,
    ActivityType.PROJECT: 100,
    ActivityType.INTERVIEW: 200,
    ActivityType.COURSE_COMPLETION: 500
}

def calculate_level(xp: int) -> int:
    """Calculate level based on XP (standard RPG curve: level = sqrt(xp/100) + 1)."""
    if xp <= 0:
        return 1
    return int((xp / 100) ** 0.5) + 1

async def log_activity(
    db: AsyncSession,
    user_id: UUID,
    activity_type: ActivityType,
    data: Optional[dict] = None
) -> UserActivity:
    """Log user activity and award XP."""
    
    xp_to_award = XP_MAP.get(activity_type, 0)
    
    # Create activity log
    activity = UserActivity(
        user_id=user_id,
        activity_type=activity_type.value,
        data=data or {},
        xp_earned=xp_to_award
    )
    db.add(activity)
    
    # Update user profile XP and level
    result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        await db.flush()

    # Update streak
    today = date.today()
    if profile.last_activity_date:
        if profile.last_activity_date == today:
            # Already active today
            pass
        elif profile.last_activity_date == today - timedelta(days=1):
            # Continuous streak
            profile.streak_count += 1
        else:
            # Streak broken
            profile.streak_count = 1
    else:
        profile.streak_count = 1

    profile.last_activity_date = today
    profile.xp += xp_to_award
    profile.level = calculate_level(profile.xp)
        
    await db.flush()
    return activity

async def get_user_heatmap(
    db: AsyncSession,
    user_id: UUID,
    days: int = 365
) -> list:
    """Get activity counts grouped by day for heatmap."""
    query = (
        select(
            func.date(UserActivity.created_at).label('date'),
            func.count(UserActivity.id).label('count')
        )
        .where(UserActivity.user_id == user_id)
        .where(UserActivity.created_at >= datetime.utcnow() - timedelta(days=days))
        .group_by(func.date(UserActivity.created_at))
        .order_by('date')
    )
    
    result = await db.execute(query)
    return [{"date": row.date.isoformat(), "count": row.count} for row in result.all()]


async def get_user_gamification(
    db: AsyncSession,
    user_id: UUID
) -> dict:
    """Get XP, level, streak and engagement stats for a user."""
    profile_result = await db.execute(
        select(UserProfile).where(UserProfile.user_id == user_id)
    )
    profile = profile_result.scalar_one_or_none()

    if not profile:
        return {
            "xp": 0,
            "level": 1,
            "streak_count": 0,
            "next_level_xp": 100,
            "current_level_progress": 0,
            "activity_count_30d": 0,
            "activity_breakdown_30d": {},
        }

    level = max(1, int(profile.level or 1))
    current_level_xp = (level - 1) ** 2 * 100
    next_level_xp = level ** 2 * 100
    progress = 0
    if next_level_xp > current_level_xp:
        progress = int(((profile.xp - current_level_xp) / (next_level_xp - current_level_xp)) * 100)

    last_30_days = datetime.utcnow() - timedelta(days=30)
    activity_count_result = await db.execute(
        select(func.count(UserActivity.id))
        .where(UserActivity.user_id == user_id)
        .where(UserActivity.created_at >= last_30_days)
    )
    activity_count_30d = activity_count_result.scalar() or 0

    breakdown_result = await db.execute(
        select(UserActivity.activity_type, func.count(UserActivity.id).label("count"))
        .where(UserActivity.user_id == user_id)
        .where(UserActivity.created_at >= last_30_days)
        .group_by(UserActivity.activity_type)
    )
    breakdown_rows = breakdown_result.all()
    breakdown = {str(row.activity_type): int(row.count) for row in breakdown_rows}

    return {
        "xp": int(profile.xp or 0),
        "level": level,
        "streak_count": int(profile.streak_count or 0),
        "next_level_xp": next_level_xp,
        "current_level_progress": min(max(progress, 0), 100),
        "activity_count_30d": int(activity_count_30d),
        "activity_breakdown_30d": breakdown,
    }
