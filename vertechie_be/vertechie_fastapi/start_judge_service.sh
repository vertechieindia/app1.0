#!/bin/bash
echo "Starting VerTechie Judge Service..."
echo ""
echo "This service handles code execution for practice problems."
echo "It will run on http://localhost:8001"
echo ""
cd "$(dirname "$0")"
python judge_service.py
