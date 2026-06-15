"""Per-company screening staff management API."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.company import Company
from app.models.screening import CompanyScreeningStaff, CompanyStaffRole
from app.models.user import User
from app.services.company_screening_service import (
    can_manage_company_screening_staff,
    get_user_staff_roles_summary,
)

router = APIRouter(tags=["Screening"])


class StaffAssignBody(BaseModel):
    email: str = Field(..., min_length=3)
    staff_role: CompanyStaffRole


@router.get("/me/staff-roles")
async def my_company_staff_roles(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Companies and roles for current user (recruiter/screener dashboards)."""
    return {"items": await get_user_staff_roles_summary(db, current_user.id)}


@router.get("/companies/{company_id}/staff")
async def list_company_screening_staff(
    company_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if not await can_manage_company_screening_staff(db, current_user, company_id):
        raise HTTPException(status_code=403, detail="Not authorized to manage this company")

    result = await db.execute(
        select(CompanyScreeningStaff)
        .options(selectinload(CompanyScreeningStaff.user))
        .where(CompanyScreeningStaff.company_id == company_id)
        .order_by(CompanyScreeningStaff.created_at.desc())
    )
    items = []
    for s in result.scalars().all():
        u = s.user
        items.append(
            {
                "id": str(s.id),
                "user_id": str(s.user_id),
                "email": u.email if u else "",
                "name": f"{getattr(u, 'first_name', '') or ''} {getattr(u, 'last_name', '') or ''}".strip(),
                "staff_role": s.staff_role.value if s.staff_role else None,
                "is_active": s.is_active,
            }
        )
    return {"items": items, "total": len(items)}


@router.post("/companies/{company_id}/staff")
async def assign_company_screening_staff(
    company_id: UUID,
    body: StaffAssignBody,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Company admin assigns recruiter, screener, or tech screener for this company."""
    if not await can_manage_company_screening_staff(db, current_user, company_id):
        raise HTTPException(status_code=403, detail="Not authorized to manage this company")

    comp = await db.execute(select(Company).where(Company.id == company_id))
    if not comp.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Company not found")

    email = body.email.strip().lower()
    user_row = await db.execute(select(User).where(func.lower(User.email) == email))
    target = user_row.scalar_one_or_none()
    if not target:
        raise HTTPException(
            status_code=404,
            detail="User not found. They must register on VerTechie first, then you can assign them.",
        )

    existing = await db.execute(
        select(CompanyScreeningStaff).where(
            CompanyScreeningStaff.company_id == company_id,
            CompanyScreeningStaff.user_id == target.id,
            CompanyScreeningStaff.staff_role == body.staff_role,
        )
    )
    row = existing.scalar_one_or_none()
    if row:
        row.is_active = True
        row.assigned_by_id = current_user.id
    else:
        row = CompanyScreeningStaff(
            company_id=company_id,
            user_id=target.id,
            staff_role=body.staff_role,
            assigned_by_id=current_user.id,
            is_active=True,
        )
        db.add(row)

    await db.commit()
    await db.refresh(row)
    return {
        "id": str(row.id),
        "user_id": str(target.id),
        "email": target.email,
        "staff_role": row.staff_role.value,
        "is_active": row.is_active,
    }


@router.delete("/companies/{company_id}/staff/{staff_id}")
async def remove_company_screening_staff(
    company_id: UUID,
    staff_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    if not await can_manage_company_screening_staff(db, current_user, company_id):
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await db.execute(
        select(CompanyScreeningStaff).where(
            CompanyScreeningStaff.id == staff_id,
            CompanyScreeningStaff.company_id == company_id,
        )
    )
    row = result.scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Staff assignment not found")
    row.is_active = False
    await db.commit()
    return {"status": "removed"}
