"""
In-process code judge (Python, JavaScript, Java, C++).
Formerly a separate service on port 8001; same logic, callable via run_execute() or /api/v1/judge/execute.
"""

from __future__ import annotations

import os
import subprocess
import tempfile
import time
from typing import Dict, List, Optional

from pydantic import BaseModel


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
    status: str
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    runtime_ms: Optional[int] = None
    memory_kb: Optional[int] = None
    passed: Optional[int] = None
    tests: Optional[List[TestResult]] = None
    test_results: Optional[List[Dict]] = None
    summary: Optional[Dict] = None


def normalize_output(output: str) -> str:
    return output.strip().replace("\r\n", "\n").replace("\r", "\n")


def execute_python(code: str, input_data: str, time_limit_ms: int) -> Dict:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False, encoding="utf-8") as f:
        f.write(code)
        temp_file = f.name

    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    try:
        start_time = time.time()
        process = subprocess.run(
            ["python", temp_file],
            input=input_data,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=time_limit_ms / 1000.0,
            cwd=os.path.dirname(temp_file),
            env=env,
        )
        runtime_ms = int((time.time() - start_time) * 1000)
        return {
            "status": "success" if process.returncode == 0 else "runtime_error",
            "stdout": process.stdout,
            "stderr": process.stderr,
            "runtime_ms": runtime_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "time_limit",
            "stdout": "",
            "stderr": "Time limit exceeded",
            "runtime_ms": time_limit_ms,
        }
    except Exception as e:
        return {
            "status": "runtime_error",
            "stdout": "",
            "stderr": str(e),
            "runtime_ms": 0,
        }
    finally:
        if os.path.exists(temp_file):
            os.unlink(temp_file)


def execute_javascript(code: str, input_data: str, time_limit_ms: int) -> Dict:
    with tempfile.NamedTemporaryFile(mode="w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(code)
        temp_file = f.name

    try:
        start_time = time.time()
        process = subprocess.run(
            ["node", temp_file],
            input=input_data,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=time_limit_ms / 1000.0,
        )
        runtime_ms = int((time.time() - start_time) * 1000)
        return {
            "status": "success" if process.returncode == 0 else "runtime_error",
            "stdout": process.stdout,
            "stderr": process.stderr,
            "runtime_ms": runtime_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "time_limit",
            "stdout": "",
            "stderr": "Time limit exceeded",
            "runtime_ms": time_limit_ms,
        }
    except FileNotFoundError:
        return {
            "status": "compile_error",
            "stdout": "",
            "stderr": "Node.js is not installed. Please install Node.js to run JavaScript code.",
            "runtime_ms": 0,
        }
    except Exception as e:
        return {
            "status": "runtime_error",
            "stdout": "",
            "stderr": str(e),
            "runtime_ms": 0,
        }
    finally:
        if os.path.exists(temp_file):
            os.unlink(temp_file)


def execute_java(code: str, input_data: str, time_limit_ms: int) -> Dict:
    import re

    class_match = re.search(r"public\s+class\s+(\w+)", code)
    if not class_match:
        return {
            "status": "compile_error",
            "stdout": "",
            "stderr": "No public class found in code",
            "runtime_ms": 0,
        }

    class_name = class_match.group(1)
    temp_dir = tempfile.mkdtemp()
    java_file = os.path.join(temp_dir, f"{class_name}.java")

    try:
        with open(java_file, "w", encoding="utf-8") as f:
            f.write(code)

        compile_process = subprocess.run(
            ["javac", java_file],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=5.0,
            cwd=temp_dir,
        )

        if compile_process.returncode != 0:
            return {
                "status": "compile_error",
                "stdout": "",
                "stderr": compile_process.stderr,
                "runtime_ms": 0,
            }

        start_time = time.time()
        run_process = subprocess.run(
            ["java", "-cp", temp_dir, class_name],
            input=input_data,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=time_limit_ms / 1000.0,
        )
        runtime_ms = int((time.time() - start_time) * 1000)
        return {
            "status": "success" if run_process.returncode == 0 else "runtime_error",
            "stdout": run_process.stdout,
            "stderr": run_process.stderr,
            "runtime_ms": runtime_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "time_limit",
            "stdout": "",
            "stderr": "Time limit exceeded",
            "runtime_ms": time_limit_ms,
        }
    except FileNotFoundError:
        return {
            "status": "compile_error",
            "stdout": "",
            "stderr": "Java compiler (javac) or runtime (java) is not installed.",
            "runtime_ms": 0,
        }
    except Exception as e:
        return {
            "status": "runtime_error",
            "stdout": "",
            "stderr": str(e),
            "runtime_ms": 0,
        }
    finally:
        import shutil

        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


def execute_cpp(code: str, input_data: str, time_limit_ms: int) -> Dict:
    temp_dir = tempfile.mkdtemp()
    cpp_file = os.path.join(temp_dir, "main.cpp")
    exe_file = os.path.join(temp_dir, "main")

    try:
        with open(cpp_file, "w", encoding="utf-8") as f:
            f.write(code)

        compile_process = subprocess.run(
            ["g++", "-o", exe_file, cpp_file],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=5.0,
        )

        if compile_process.returncode != 0:
            return {
                "status": "compile_error",
                "stdout": "",
                "stderr": compile_process.stderr,
                "runtime_ms": 0,
            }

        start_time = time.time()
        run_process = subprocess.run(
            [exe_file],
            input=input_data,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=time_limit_ms / 1000.0,
            cwd=temp_dir,
        )
        runtime_ms = int((time.time() - start_time) * 1000)
        return {
            "status": "success" if run_process.returncode == 0 else "runtime_error",
            "stdout": run_process.stdout,
            "stderr": run_process.stderr,
            "runtime_ms": runtime_ms,
        }
    except subprocess.TimeoutExpired:
        return {
            "status": "time_limit",
            "stdout": "",
            "stderr": "Time limit exceeded",
            "runtime_ms": time_limit_ms,
        }
    except FileNotFoundError:
        return {
            "status": "compile_error",
            "stdout": "",
            "stderr": "C++ compiler (g++) is not installed.",
            "runtime_ms": 0,
        }
    except Exception as e:
        return {
            "status": "runtime_error",
            "stdout": "",
            "stderr": str(e),
            "runtime_ms": 0,
        }
    finally:
        import shutil

        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)


def run_execute(request: ExecutionRequest) -> dict:
    """Synchronous judge entrypoint; run via asyncio.to_thread from async routes."""
    language = request.language.lower()

    language_map = {
        "python": "python",
        "python3": "python",
        "javascript": "javascript",
        "js": "javascript",
        "node": "javascript",
        "java": "java",
        "cpp": "cpp",
        "c++": "cpp",
        "c": "cpp",
    }
    language = language_map.get(language, language)

    if request.test_cases:
        test_results: List[TestResult] = []
        execution_results = []
        passed = 0
        total_runtime = 0

        for test_case in request.test_cases:
            input_data = test_case.get("input", "")
            expected_output = test_case.get("expected_output", "")

            if language == "python":
                result = execute_python(request.code, input_data, request.time_limit_ms)
            elif language == "javascript":
                result = execute_javascript(request.code, input_data, request.time_limit_ms)
            elif language == "java":
                result = execute_java(request.code, input_data, request.time_limit_ms)
            elif language == "cpp":
                result = execute_cpp(request.code, input_data, request.time_limit_ms)
            else:
                return ExecutionResponse(
                    status="COMPILE_ERROR",
                    stderr=f"Unsupported language: {language}",
                ).model_dump()

            actual_output = normalize_output(result.get("stdout", ""))
            expected_output_normalized = normalize_output(expected_output)
            test_passed = actual_output == expected_output_normalized
            if result["status"] != "success":
                test_passed = False
            if test_passed:
                passed += 1
            total_runtime += result.get("runtime_ms", 0)

            test_results.append(
                TestResult(
                    passed=test_passed,
                    input=input_data,
                    expected=expected_output,
                    actual=actual_output,
                    runtime_ms=result.get("runtime_ms", 0),
                )
            )
            execution_results.append(result)

        has_runtime_error = any(r.get("status") == "runtime_error" for r in execution_results)
        has_time_limit = any(r.get("status") == "time_limit" for r in execution_results)
        has_compile_error = any(r.get("status") == "compile_error" for r in execution_results)

        if has_compile_error:
            st = "COMPILE_ERROR"
        elif passed == len(request.test_cases):
            st = "ACCEPTED"
        elif has_time_limit:
            st = "TIME_LIMIT"
        elif has_runtime_error:
            st = "RUNTIME_ERROR"
        else:
            st = "WRONG_ANSWER"

        test_results_dict = [t.model_dump() for t in test_results]
        n = len(test_results) or 1
        return ExecutionResponse(
            status=st,
            stdout="",
            stderr="",
            runtime_ms=total_runtime // n,
            memory_kb=0,
            passed=passed,
            tests=test_results_dict,
            test_results=test_results_dict,
            summary={
                "total": len(request.test_cases),
                "passed": passed,
                "runtime_ms": total_runtime // n,
            },
        ).model_dump()

    input_data = request.input or ""

    if language == "python":
        result = execute_python(request.code, input_data, request.time_limit_ms)
    elif language == "javascript":
        result = execute_javascript(request.code, input_data, request.time_limit_ms)
    elif language == "java":
        result = execute_java(request.code, input_data, request.time_limit_ms)
    elif language == "cpp":
        result = execute_cpp(request.code, input_data, request.time_limit_ms)
    else:
        return ExecutionResponse(
            status="COMPILE_ERROR",
            stderr=f"Unsupported language: {language}",
        ).model_dump()

    status_map = {
        "success": "ACCEPTED",
        "runtime_error": "RUNTIME_ERROR",
        "time_limit": "TIME_LIMIT",
        "compile_error": "COMPILE_ERROR",
    }

    return ExecutionResponse(
        status=status_map.get(result["status"], "RUNTIME_ERROR"),
        stdout=result.get("stdout", ""),
        stderr=result.get("stderr", ""),
        runtime_ms=result.get("runtime_ms", 0),
        memory_kb=0,
    ).model_dump()
