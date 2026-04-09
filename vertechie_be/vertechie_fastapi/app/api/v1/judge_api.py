"""HTTP endpoints for the embedded code judge (same contract as legacy port 8001)."""

import asyncio

from fastapi import APIRouter

from app.services.code_judge import ExecutionRequest, run_execute

router = APIRouter()


@router.post("/execute")
async def judge_execute(request: ExecutionRequest):
    return await asyncio.to_thread(run_execute, request)


@router.get("/health")
async def judge_health():
    return {"status": "healthy", "service": "judge", "embedded": True}
