"""
Optional standalone judge on port 8001 (legacy). The app embeds the same logic in app.services.code_judge
and exposes POST /api/v1/judge/execute on the main API (port 8000).

Run from `vertechie_fastapi` with PYTHONPATH set, e.g.:
  set PYTHONPATH=.
  python backup_folder/judge_service.py
"""

import asyncio

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.code_judge import ExecutionRequest, run_execute

app = FastAPI(title="VerTechie Judge Service (standalone)")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/execute")
async def execute_code(request: ExecutionRequest):
    return await asyncio.to_thread(run_execute, request)


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "judge"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
