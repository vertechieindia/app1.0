"""Per-company screening staff: recruiters, screeners, tech screeners."""

from __future__ import annotations

from typing import Any, Optional, Set
from uuid import UUID

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import CompanyAdmin
from app.models.job import Job
from app.models.screening import (
    CompanyScreeningStaff,
    CompanyStaffRole,
    ScreeningInvite,
    ScreeningTask,
    SourcingRequest,
)
from app.models.user import User
from app.services.screening_service import get_role_slugs, is_super_or_admin


def is_platform_requirements_admin(user: User) -> bool:
    return "requirements_admin" in get_role_slugs(user)


def is_platform_screener_admin(user: User) -> bool:
    return "screener_admin" in get_role_slugs(user)


def is_platform_tech_screener_admin(user: User) -> bool:
    return "tech_screener_admin" in get_role_slugs(user)


async def get_company_ids_for_staff(
    db: AsyncSession,
    user_id: UUID,
    role: CompanyStaffRole,
    *,
    active_only: bool = True,
) -> Set[UUID]:
    q = select(CompanyScreeningStaff.company_id).where(
        CompanyScreeningStaff.user_id == user_id,
        CompanyScreeningStaff.staff_role == role,
    )
    if active_only:
        q = q.where(CompanyScreeningStaff.is_active.is_(True))
    result = await db.execute(q)
    return {row[0] for row in result.all()}


async def user_has_company_staff_role(
    db: AsyncSession,
    user_id: UUID,
    role: CompanyStaffRole,
) -> bool:
    ids = await get_company_ids_for_staff(db, user_id, role)
    return len(ids) > 0


async def is_any_company_screening_staff(db: AsyncSession, user_id: UUID) -> bool:
    row = await db.execute(
        select(CompanyScreeningStaff.id)
        .where(
            CompanyScreeningStaff.user_id == user_id,
            CompanyScreeningStaff.is_active.is_(True),
        )
        .limit(1)
    )
    return row.scalar_one_or_none() is not None


async def resolve_user_company_id(db: AsyncSession, user: User) -> Optional[UUID]:
    """Primary company for HM / company admin (for auto-tagging sourcing requests)."""
    row = await db.execute(
        select(CompanyAdmin.company_id)
        .where(CompanyAdmin.user_id == user.id)
        .limit(1)
    )
    cid = row.scalar_one_or_none()
    if cid:
        return cid

    from app.models.screening import CompanyHmInvite

    inv = await db.execute(
        select(CompanyHmInvite.company_id)
        .where(CompanyHmInvite.user_id == user.id, CompanyHmInvite.status == "accepted")
        .limit(1)
    )
    cid = inv.scalar_one_or_none()
    if cid:
        return cid

    staff = await db.execute(
        select(CompanyScreeningStaff.company_id)
        .where(CompanyScreeningStaff.user_id == user.id, CompanyScreeningStaff.is_active.is_(True))
        .limit(1)
    )
    return staff.scalar_one_or_none()


async def can_manage_company_screening_staff(
    db: AsyncSession,
    user: User,
    company_id: UUID,
) -> bool:
    if user.is_superuser:
        return True
    row = await db.execute(
        select(CompanyAdmin).where(
            CompanyAdmin.user_id == user.id,
            CompanyAdmin.company_id == company_id,
        )
    )
    admin = row.scalar_one_or_none()
    if admin:
        return True
    if "company_admin" in get_role_slugs(user):
        row2 = await db.execute(
            select(CompanyAdmin.company_id).where(CompanyAdmin.user_id == user.id).limit(1)
        )
        return row2.scalar_one_or_none() == company_id
    return False


async def company_scope_for_recruiter(
    db: AsyncSession,
    user: User,
) -> Optional[Set[UUID]]:
    """
    None = platform-wide (super / platform requirements admin).
    Set = company-scoped company recruiter only.
    Empty set = no recruiter access.
    """
    if is_super_or_admin(user):
        return None
    if is_platform_requirements_admin(user):
        return None
    return await get_company_ids_for_staff(db, user.id, CompanyStaffRole.RECRUITER)


async def company_scope_for_screener(
    db: AsyncSession,
    user: User,
) -> Optional[Set[UUID]]:
    if is_super_or_admin(user):
        return None
    if is_platform_screener_admin(user):
        return None
    return await get_company_ids_for_staff(db, user.id, CompanyStaffRole.SCREENER)


async def company_scope_for_tech_screener(
    db: AsyncSession,
    user: User,
) -> Optional[Set[UUID]]:
    if is_super_or_admin(user):
        return None
    if is_platform_tech_screener_admin(user):
        return None
    return await get_company_ids_for_staff(db, user.id, CompanyStaffRole.TECH_SCREENER)


def sourcing_request_company_filter(company_ids: Set[UUID]):
    return SourcingRequest.company_id.in_(company_ids)


def screening_task_company_filter(company_ids: Set[UUID]):
    """Tasks tied to company via sourcing request, invite, or job."""
    return or_(
        SourcingRequest.company_id.in_(company_ids),
        ScreeningInvite.company_id.in_(company_ids),
        Job.company_id.in_(company_ids),
    )


async def can_access_recruiter_portal(db: AsyncSession, user: User) -> bool:
    if is_super_or_admin(user) or is_platform_requirements_admin(user):
        return True
    return await user_has_company_staff_role(db, user.id, CompanyStaffRole.RECRUITER)


async def can_access_screener_portal(db: AsyncSession, user: User) -> bool:
    from app.services.screening_service import is_screener

    if is_screener(user):
        return True
    return await user_has_company_staff_role(db, user.id, CompanyStaffRole.SCREENER)


async def can_access_tech_screener_portal(db: AsyncSession, user: User) -> bool:
    from app.services.screening_service import is_tech_screener

    if is_tech_screener(user):
        return True
    return await user_has_company_staff_role(db, user.id, CompanyStaffRole.TECH_SCREENER)


async def require_screening_dashboard_user(db: AsyncSession, user: User) -> None:
    """Company screening staff may access dashboards before techie/HM verification completes."""
    from app.services.screening_service import require_staff_approved

    if await is_any_company_screening_staff(db, user.id):
        return
    require_staff_approved(user)


async def can_access_any_screening_portal(db: AsyncSession, user: User) -> bool:
    from app.services.screening_service import is_hiring_manager, is_super_or_admin

    if is_super_or_admin(user):
        return True
    if is_hiring_manager(user):
        return True
    if await can_access_recruiter_portal(db, user):
        return True
    if await can_access_screener_portal(db, user):
        return True
    if await can_access_tech_screener_portal(db, user):
        return True
    return False


async def get_user_staff_roles_summary(db: AsyncSession, user_id: UUID) -> list[dict[str, Any]]:
    from app.models.company import Company

    rows = await db.execute(
        select(CompanyScreeningStaff, Company.name)
        .join(Company, Company.id == CompanyScreeningStaff.company_id)
        .where(
            CompanyScreeningStaff.user_id == user_id,
            CompanyScreeningStaff.is_active.is_(True),
        )
    )
    out = []
    for staff, company_name in rows.all():
        out.append(
            {
                "company_id": str(staff.company_id),
                "company_name": company_name,
                "staff_role": staff.staff_role.value if staff.staff_role else None,
            }
        )
    return out


async def assert_recruiter_can_access_sourcing(
    db: AsyncSession,
    user: User,
    sr: SourcingRequest,
) -> None:
    from fastapi import HTTPException

    if is_super_or_admin(user) or is_platform_requirements_admin(user):
        return
    scope = await get_company_ids_for_staff(db, user.id, CompanyStaffRole.RECRUITER)
    if not scope:
        return
    if not sr.company_id or sr.company_id not in scope:
        raise HTTPException(status_code=403, detail="Not authorized for this company's requests")


async def assert_screener_can_access_task(
    db: AsyncSession,
    user: User,
    task: ScreeningTask,
) -> None:
    from fastapi import HTTPException

    scope = await company_scope_for_screener(db, user)
    if scope is None:
        return
    if not scope:
        raise HTTPException(status_code=403, detail="Screener access only")
    company_id = await _task_company_id(db, task)
    if company_id not in scope:
        raise HTTPException(status_code=403, detail="Not authorized for this company's tasks")


async def assert_tech_screener_can_access_task(
    db: AsyncSession,
    user: User,
    task: ScreeningTask,
) -> None:
    from fastapi import HTTPException

    scope = await company_scope_for_tech_screener(db, user)
    if scope is None:
        return
    if not scope:
        raise HTTPException(status_code=403, detail="Tech screener access only")
    company_id = await _task_company_id(db, task)
    if company_id not in scope:
        raise HTTPException(status_code=403, detail="Not authorized for this company's tasks")


async def apply_task_company_scope(query, scope: Optional[Set[UUID]]):
    """Narrow ScreeningTask query to company-scoped tasks when scope is a set."""
    if scope is None:
        return query
    if not scope:
        from fastapi import HTTPException

        raise HTTPException(status_code=403, detail="No company access")
    sr_ids = select(SourcingRequest.id).where(SourcingRequest.company_id.in_(scope))
    inv_ids = select(ScreeningInvite.id).where(ScreeningInvite.company_id.in_(scope))
    job_ids = select(Job.id).where(Job.company_id.in_(scope))
    return query.where(
        or_(
            ScreeningTask.sourcing_request_id.in_(sr_ids),
            ScreeningTask.screening_invite_id.in_(inv_ids),
            ScreeningTask.job_id.in_(job_ids),
        )
    )


async def _task_company_id(db: AsyncSession, task: ScreeningTask) -> Optional[UUID]:
    if task.sourcing_request_id:
        row = await db.execute(
            select(SourcingRequest.company_id).where(SourcingRequest.id == task.sourcing_request_id)
        )
        cid = row.scalar_one_or_none()
        if cid:
            return cid
    if task.screening_invite_id:
        row = await db.execute(
            select(ScreeningInvite.company_id).where(ScreeningInvite.id == task.screening_invite_id)
        )
        cid = row.scalar_one_or_none()
        if cid:
            return cid
    if task.job_id:
        row = await db.execute(select(Job.company_id).where(Job.id == task.job_id))
        return row.scalar_one_or_none()
    return None
