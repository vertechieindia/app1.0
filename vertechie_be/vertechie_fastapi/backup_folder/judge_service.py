"""
Simple Judge Service for Code Execution
Runs on port 8001 and handles code execution requests from the practice module.

Usage:
    python judge_service.py

This service:
- Executes code in multiple languages (Python, JavaScript, Java, C++)
- Runs test cases and evaluates results
- Returns execution results in the format expected by practice.py
"""

import asyncio
import subprocess
import tempfile
import os
import json
import time
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="VerTechie Judge Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExecutionRequest(BaseModel):
    language: str
    code: str
    problem_id: Optional[str] = None
    test_cases: Optional[List[Dict[str, str]]] = None
    input: Optional[str] = None
    time_limit_ms: int = 2000
    memory_limit_mb: int = 256


class TestResult(BaseModel):
    passed: bool
    input: str
    expected: str
    actual: str
    runtime_ms: int


class ExecutionResponse(BaseModel):
    status: str  # ACCEPTED, WRONG_ANSWER, RUNTIME_ERROR, TIME_LIMIT, COMPILE_ERROR
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    runtime_ms: Optional[int] = None
    memory_kb: Optional[int] = None
    passed: Optional[int] = None
    tests: Optional[List[TestResult]] = None
    test_results: Optional[List[Dict]] = None  # Alias for backend compatibility
    summary: Optional[Dict] = None


def normalize_output(output: str) -> str:
    """Normalize output for comparison (trim whitespace, handle newlines)."""
    return output.strip().replace('\r\n', '\n').replace('\r', '\n')


def execute_python(code: str, input_data: str, time_limit_ms: int) -> Dict:
    """Execute Python code."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
        f.write(code)
        temp_file = f.name
    
    # Use UTF-8 for subprocess pipes (avoids UnicodeEncodeError on Windows)
    env = os.environ.copy()
    env['PYTHONIOENCODING'] = 'utf-8'
    try:
        start_time = time.time()
        
        # Run Python code with timeout
        process = subprocess.run(
            ['python', temp_file],
            input=input_data,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=time_limit_ms / 1000.0,
            cwd=os.path.dirname(temp_file),
            env=env,
        )
        
        runtime_ms = int((time.time() - start_time) * 1000)
        
        return {
            'status': 'success' if process.returncode == 0 else 'runtime_error',
            'stdout': process.stdout,
            'stderr': process.stderr,
            'runtime_ms': runtime_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            'status': 'time_limit',
            'stdout': '',
            'stderr': 'Time limit exceeded',
            'runtime_ms': time_limit_ms,
        }
    except Exception as e:
        return {
            'status': 'runtime_error',
            'stdout': '',
            'stderr': str(e),
            'runtime_ms': 0,
        }
    finally:
        if os.path.exists(temp_file):
            os.unlink(temp_file)


def execute_javascript(code: str, input_data: str, time_limit_ms: int) -> Dict:
    """Execute JavaScript code using Node.js."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8') as f:
        f.write(code)
        temp_file = f.name
    
    try:
        start_time = time.time()
        
        process = subprocess.run(
            ['node', temp_file],
            input=input_data,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=time_limit_ms / 1000.0,
        )
        
        runtime_ms = int((time.time() - start_time) * 1000)
        
        return {
            'status': 'success' if process.returncode == 0 else 'runtime_error',
            'stdout': process.stdout,
            'stderr': process.stderr,
            'runtime_ms': runtime_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            'status': 'time_limit',
            'stdout': '',
            'stderr': 'Time limit exceeded',
            'runtime_ms': time_limit_ms,
        }
    except FileNotFoundError:
        return {
            'status': 'compile_error',
            'stdout': '',
            'stderr': 'Node.js is not installed. Please install Node.js to run JavaScript code.',
            'runtime_ms': 0,
        }
    except Exception as e:
        return {
            'status': 'runtime_error',
            'stdout': '',
            'stderr': str(e),
            'runtime_ms': 0,
        }
    finally:
        if os.path.exists(temp_file):
            os.unlink(temp_file)


def execute_java(code: str, input_data: str, time_limit_ms: int) -> Dict:
    """Execute Java code."""
    # Extract class name from code
    class_match = __import__('re').search(r'public\s+class\s+(\w+)', code)
    if not class_match:
        return {
            'status': 'compile_error',
            'stdout': '',
            'stderr': 'No public class found in code',
            'runtime_ms': 0,
        }
    
    class_name = class_match.group(1)
    temp_dir = tempfile.mkdtemp()
    java_file = os.path.join(temp_dir, f'{class_name}.java')
    
    try:
        with open(java_file, 'w', encoding='utf-8') as f:
            f.write(code)
        
        # Compile Java code
        compile_process = subprocess.run(
            ['javac', java_file],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=5.0,
            cwd=temp_dir
        )
        
        if compile_process.returncode != 0:
            return {
                'status': 'compile_error',
                'stdout': '',
                'stderr': compile_process.stderr,
                'runtime_ms': 0,
            }
        
        # Run Java code
        start_time = time.time()
        run_process = subprocess.run(
            ['java', '-cp', temp_dir, class_name],
            input=input_data,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=time_limit_ms / 1000.0,
        )
        
        runtime_ms = int((time.time() - start_time) * 1000)
        
        return {
            'status': 'success' if run_process.returncode == 0 else 'runtime_error',
            'stdout': run_process.stdout,
            'stderr': run_process.stderr,
            'runtime_ms': runtime_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            'status': 'time_limit',
            'stdout': '',
            'stderr': 'Time limit exceeded',
            'runtime_ms': time_limit_ms,
        }
    except FileNotFoundError:
        return {
            'status': 'compile_error',
            'stdout': '',
            'stderr': 'Java compiler (javac) or runtime (java) is not installed.',
            'runtime_ms': 0,
        }
    except Exception as e:
        return {
            'status': 'runtime_error',
            'stdout': '',
            'stderr': str(e),
            'runtime_ms': 0,
        }
    finally:
        # Cleanup
        import shutil
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


def execute_cpp(code: str, input_data: str, time_limit_ms: int) -> Dict:
    """Execute C++ code."""
    temp_dir = tempfile.mkdtemp()
    cpp_file = os.path.join(temp_dir, 'main.cpp')
    exe_file = os.path.join(temp_dir, 'main')
    
    try:
        with open(cpp_file, 'w', encoding='utf-8') as f:
            f.write(code)
        
        # Compile C++ code
        compile_process = subprocess.run(
            ['g++', '-o', exe_file, cpp_file],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=5.0,
        )
        
        if compile_process.returncode != 0:
            return {
                'status': 'compile_error',
                'stdout': '',
                'stderr': compile_process.stderr,
                'runtime_ms': 0,
            }
        
        # Run C++ executable
        start_time = time.time()
        run_process = subprocess.run(
            [exe_file],
            input=input_data,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=time_limit_ms / 1000.0,
            cwd=temp_dir
        )
        
        runtime_ms = int((time.time() - start_time) * 1000)
        
        return {
            'status': 'success' if run_process.returncode == 0 else 'runtime_error',
            'stdout': run_process.stdout,
            'stderr': run_process.stderr,
            'runtime_ms': runtime_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            'status': 'time_limit',
            'stdout': '',
            'stderr': 'Time limit exceeded',
            'runtime_ms': time_limit_ms,
        }
    except FileNotFoundError:
        return {
            'status': 'compile_error',
            'stdout': '',
            'stderr': 'C++ compiler (g++) is not installed.',
            'runtime_ms': 0,
        }
    except Exception as e:
        return {
            'status': 'runtime_error',
            'stdout': '',
            'stderr': str(e),
            'runtime_ms': 0,
        }
    finally:
        import shutil
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


@app.post("/execute")
async def execute_code(request: ExecutionRequest):
    """Execute code and return results."""
    import logging
    logger = logging.getLogger(__name__)
    
    language = request.language.lower()
    logger.info(f"Received execution request: language={language}, problem_id={request.problem_id}, test_cases={len(request.test_cases) if request.test_cases else 0}")
    
    # Map language names
    language_map = {
        'python': 'python',
        'python3': 'python',
        'javascript': 'javascript',
        'js': 'javascript',
        'node': 'javascript',
        'java': 'java',
        'cpp': 'cpp',
        'c++': 'cpp',
        'c': 'cpp',
    }
    
    language = language_map.get(language, language)
    
    # If test cases provided, run against all test cases
    if request.test_cases:
        logger.info(f"Running {len(request.test_cases)} test cases")
        test_results = []
        execution_results = []  # Store full execution results for status determination
        passed = 0
        total_runtime = 0
        
        for idx, test_case in enumerate(request.test_cases):
            input_data = test_case.get('input', '')
            expected_output = test_case.get('expected_output', '')
            logger.debug(f"Test case {idx + 1}: input={input_data[:50]}..., expected={expected_output[:50]}...")
            
            # Execute code with this test case
            if language == 'python':
                result = execute_python(request.code, input_data, request.time_limit_ms)
            elif language == 'javascript':
                result = execute_javascript(request.code, input_data, request.time_limit_ms)
            elif language == 'java':
                result = execute_java(request.code, input_data, request.time_limit_ms)
            elif language == 'cpp':
                result = execute_cpp(request.code, input_data, request.time_limit_ms)
            else:
                return ExecutionResponse(
                    status='COMPILE_ERROR',
                    stderr=f'Unsupported language: {language}'
                ).dict()
            
            # Check if output matches expected
            actual_output = normalize_output(result.get('stdout', ''))
            expected_output_normalized = normalize_output(expected_output)
            
            test_passed = actual_output == expected_output_normalized
            
            if result['status'] != 'success':
                test_passed = False
            
            if test_passed:
                passed += 1
            
            total_runtime += result.get('runtime_ms', 0)
            
            test_results.append(TestResult(
                passed=test_passed,
                input=input_data,
                expected=expected_output,
                actual=actual_output,
                runtime_ms=result.get('runtime_ms', 0)
            ))
            
            # Store execution result for status checking
            execution_results.append(result)
            
            # If any test fails, we can stop early (optional)
            # For now, run all tests
        
        # Determine overall status
        # Check if any test had runtime errors or time limits
        has_runtime_error = any(r.get('status') == 'runtime_error' for r in execution_results)
        has_time_limit = any(r.get('status') == 'time_limit' for r in execution_results)
        has_compile_error = any(r.get('status') == 'compile_error' for r in execution_results)
        
        if has_compile_error:
            status = 'COMPILE_ERROR'
        elif passed == len(request.test_cases):
            status = 'ACCEPTED'
        elif has_time_limit:
            status = 'TIME_LIMIT'
        elif has_runtime_error:
            status = 'RUNTIME_ERROR'
        else:
            status = 'WRONG_ANSWER'
        
        # Convert test results to dict format expected by backend
        test_results_dict = [t.dict() for t in test_results]
        
        logger.info(f"Execution complete: status={status}, passed={passed}/{len(request.test_cases)}")
        response = ExecutionResponse(
            status=status,
            stdout='',
            stderr='',
            runtime_ms=total_runtime // len(request.test_cases) if test_results else 0,
            memory_kb=0,  # Memory tracking not implemented
            passed=passed,
            tests=test_results_dict,
            test_results=test_results_dict,  # Backend expects this field name
            summary={
                'total': len(request.test_cases),
                'passed': passed,
                'runtime_ms': total_runtime // len(request.test_cases) if test_results else 0,
            }
        )
        return response.dict()
    
    # Single execution (no test cases)
    else:
        input_data = request.input or ''
        
        if language == 'python':
            result = execute_python(request.code, input_data, request.time_limit_ms)
        elif language == 'javascript':
            result = execute_javascript(request.code, input_data, request.time_limit_ms)
        elif language == 'java':
            result = execute_java(request.code, input_data, request.time_limit_ms)
        elif language == 'cpp':
            result = execute_cpp(request.code, input_data, request.time_limit_ms)
        else:
            return ExecutionResponse(
                status='COMPILE_ERROR',
                stderr=f'Unsupported language: {language}'
            )
        
        # Map result status
        status_map = {
            'success': 'ACCEPTED',
            'runtime_error': 'RUNTIME_ERROR',
            'time_limit': 'TIME_LIMIT',
            'compile_error': 'COMPILE_ERROR',
        }
        
        response = ExecutionResponse(
            status=status_map.get(result['status'], 'RUNTIME_ERROR'),
            stdout=result.get('stdout', ''),
            stderr=result.get('stderr', ''),
            runtime_ms=result.get('runtime_ms', 0),
            memory_kb=0,
        )
        return response.dict()


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "service": "judge"}


if __name__ == "__main__":
    import uvicorn
    import logging
    
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    print("🚀 Starting VerTechie Judge Service on http://localhost:8001")
    print("📝 Ready to execute code in Python, JavaScript, Java, and C++")
    print("💡 Make sure Python is installed. For other languages:")
    print("   - JavaScript: Install Node.js")
    print("   - Java: Install JDK")
    print("   - C++: Install GCC (g++)")
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
