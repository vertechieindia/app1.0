@echo off
echo Starting VerTechie Judge Service...
echo.
echo This service handles code execution for practice problems.
echo It will run on http://localhost:8001
echo.
cd /d "%~dp0"
python judge_service.py
pause
