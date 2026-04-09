"""
Evaluate job application coding answers against test cases (embedded judge, optional remote HTTP, or local SQL sandbox).
"""

from __future__ import annotations

import asyncio
import logging
import sqlite3
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


def _normalize_out(s: str) -> str:
    return (s or "").strip().replace("\r\n", "\n").replace("\r", "\n")


def _find_question(job_questions: List[dict], question_id: str) -> Optional[dict]:
    for q in job_questions or []:
        if str(q.get("id")) == str(question_id):
            return q
    return None


def _tests_from_question(q: dict) -> List[Dict[str, str]]:
    raw = q.get("testCases") or q.get("test_cases") or []
    out: List[Dict[str, str]] = []
    if not isinstance(raw, list):
        return out
    for tc in raw:
        if not isinstance(tc, dict):
            continue
        inp = tc.get("input", "")
        exp = tc.get("expectedOutput") or tc.get("expected_output") or ""
        out.append({"input": str(inp), "expected_output": str(exp)})
    return out


def evaluate_sql_local(code: str, test_cases: List[Dict[str, str]], schema_sql: Optional[str]) -> Dict[str, Any]:
    """Run candidate SQL against sqlite :memory:; compare last result set text to expected."""
    passed = 0
    details: List[Dict[str, Any]] = []
    for tc in test_cases:
        conn = sqlite3.connect(":memory:")
        conn.row_factory = sqlite3.Row
        try:
            if schema_sql:
                conn.executescript(schema_sql)
            cur = conn.cursor()
            actual = ""
            err = ""
            try:
                cur.execute(code)
                if cur.description:
                    rows = cur.fetchall()
                    actual = "\n".join("|".join(str(c) for c in row) for row in rows)
                else:
                    actual = ""
            except Exception as e:
                err = str(e)
                actual = ""
            exp = _normalize_out(tc.get("expected_output", ""))
            act = _normalize_out(actual)
            ok = not err and act == exp
            if ok:
                passed += 1
            details.append(
                {
                    "passed": ok,
                    "input": tc.get("input", ""),
                    "expected": exp,
                    "actual": act if not err else err,
                }
            )
        finally:
            conn.close()
    total = len(test_cases) or 1
    status = "ACCEPTED" if passed == len(test_cases) and test_cases else "WRONG_ANSWER"
    if not test_cases:
        status = "NO_TESTS"
    return {
        "status": status,
        "passed": passed,
        "total": len(test_cases),
        "tests": details,
        "language": "sql",
    }


_JUDGE_LANGS = frozenset({"python", "javascript", "java", "cpp"})


def _parse_judge_response_json(data: Dict[str, Any], test_cases: List[Dict[str, str]]) -> Dict[str, Any]:
    st = data.get("status") or "UNKNOWN"
    passed = data.get("passed")
    if passed is None and isinstance(data.get("summary"), dict):
        passed = data["summary"].get("passed")
    total = len(test_cases)
    if passed is None:
        passed = 0
    return {
        "status": st,
        "passed": int(passed),
        "total": total,
        "raw": data,
    }


async def _call_judge_execute(
    base_url: Optional[str], language: str, code: str, test_cases: List[Dict[str, str]], timeout: float = 45.0
) -> Dict[str, Any]:
    """Embedded judge when base_url is None; otherwise HTTP to remote judge."""
    import httpx

    from app.services.code_judge import ExecutionRequest, run_execute

    payload = {
        "language": language,
        "code": code,
        "test_cases": [{"input": t["input"], "expected_output": t["expected_output"]} for t in test_cases],
        "time_limit_ms": 5000,
        "memory_limit_mb": 256,
    }
    try:
        if not base_url:
            req = ExecutionRequest(**payload)
            data = await asyncio.to_thread(run_execute, req)
            return _parse_judge_response_json(data, test_cases)

        url = base_url.rstrip("/") + "/execute"
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                return {
                    "status": "JUDGE_ERROR",
                    "error": f"HTTP {resp.status_code}",
                    "passed": 0,
                    "total": len(test_cases),
                }
            data = resp.json()
            return _parse_judge_response_json(data, test_cases)
    except Exception as e:
        logger.warning("Judge execution error: %s", e)
        return {"status": "JUDGE_UNAVAILABLE", "error": str(e), "passed": 0, "total": len(test_cases)}


def map_lang_for_judge(lang: str) -> str:
    l = (lang or "python").lower()
    if l in ("typescript", "ts"):
        return "javascript"
    if l == "c":
        return "cpp"
    return l


async def evaluate_job_coding_submissions(
    job_coding_questions: Any,
    coding_answers: Any,
    judge_service_url: Optional[str],
) -> Dict[str, Any]:
    """
    Returns a dict safe to merge into application.answers:
    coding_evaluation, coding_test_score (0-100), coding_evaluation_status.
    """
    if not coding_answers or not isinstance(coding_answers, list):
        return {}

    questions = job_coding_questions if isinstance(job_coding_questions, list) else []
    by_question: List[Dict[str, Any]] = []
    scores: List[float] = []

    for ca in coding_answers:
        if not isinstance(ca, dict):
            continue
        qid = str(ca.get("questionId") or ca.get("question_id") or "")
        code = str(ca.get("code") or "")
        lang = str(ca.get("language") or "python")
        q = _find_question(questions, qid) or {}
        tests = _tests_from_question(q)
        lang_l = map_lang_for_judge(lang)

        if not tests:
            by_question.append(
                {
                    "questionId": qid,
                    "status": "NO_TESTS",
                    "passed": 0,
                    "total": 0,
                    "note": "No test cases configured for this question",
                }
            )
            scores.append(0.0)
            continue

        if lang_l == "sql":
            schema = q.get("sqlSchema") or q.get("sql_schema") or ""
            res = await asyncio.to_thread(evaluate_sql_local, code, tests, schema or None)
            by_question.append({"questionId": qid, **res})
            pct = (res["passed"] / res["total"]) * 100 if res.get("total") else 0
            scores.append(pct)
            continue

        if lang_l not in _JUDGE_LANGS:
            by_question.append(
                {
                    "questionId": qid,
                    "status": "UNSUPPORTED_FOR_AUTO_EVAL",
                    "passed": 0,
                    "total": len(tests),
                    "language": lang_l,
                }
            )
            scores.append(0.0)
            continue

        res = await _call_judge_execute(judge_service_url, lang_l, code, tests)
        by_question.append({"questionId": qid, **res})
        total = int(res.get("total") or len(tests)) or 1
        passed = int(res.get("passed") or 0)
        scores.append((passed / total) * 100)

    overall = int(round(sum(scores) / len(scores))) if scores else 0
    status = "evaluated" if scores else "pending"

    return {
        "coding_evaluation": {
            "questions": by_question,
            "evaluated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        },
        "coding_test_score": overall,
        "coding_evaluation_status": status,
    }


async def _call_judge_run_only(
    base_url: Optional[str],
    language: str,
    code: str,
    stdin: str,
    timeout: float = 45.0,
) -> Dict[str, Any]:
    """Single run with stdin, no test cases (embedded or remote /execute)."""
    import httpx

    from app.services.code_judge import ExecutionRequest, run_execute

    payload = {
        "language": language,
        "code": code,
        "input": stdin,
        "time_limit_ms": 5000,
        "memory_limit_mb": 256,
    }
    try:
        if not base_url:
            req = ExecutionRequest(**payload)
            data = await asyncio.to_thread(run_execute, req)
            return {
                "execution_available": True,
                "status": str(data.get("status") or "UNKNOWN"),
                "stdout": str(data.get("stdout") or ""),
                "stderr": str(data.get("stderr") or ""),
                "runtime_ms": data.get("runtime_ms"),
                "raw": data,
            }

        url = base_url.rstrip("/") + "/execute"
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                return {
                    "execution_available": True,
                    "status": "JUDGE_ERROR",
                    "stdout": "",
                    "stderr": f"HTTP {resp.status_code}",
                    "runtime_ms": None,
                }
            data = resp.json()
            return {
                "execution_available": True,
                "status": str(data.get("status") or "UNKNOWN"),
                "stdout": str(data.get("stdout") or ""),
                "stderr": str(data.get("stderr") or ""),
                "runtime_ms": data.get("runtime_ms"),
                "raw": data,
            }
    except Exception as e:
        logger.warning("Judge run-only error: %s", e)
        return {
            "execution_available": False,
            "status": "JUDGE_UNAVAILABLE",
            "message": "Execution service unreachable.",
            "stdout": "",
            "stderr": str(e),
            "runtime_ms": None,
        }


def _sql_preview_tests(question: dict, tests: List[Dict[str, str]], mode: str) -> List[Dict[str, str]]:
    if tests:
        return tests[:1] if mode == "run" else tests
    sample_in = str(question.get("sampleInput") or question.get("sample_input") or "")
    sample_out = str(question.get("sampleOutput") or question.get("sample_output") or "")
    return [{"input": sample_in, "expected_output": sample_out}]


def _format_sql_preview_dict(res: Dict[str, Any]) -> Dict[str, Any]:
    details: List[Dict[str, Any]] = []
    for t in res.get("tests") or []:
        if not isinstance(t, dict):
            continue
        details.append(
            {
                "passed": bool(t.get("passed")),
                "input": str(t.get("input", "")),
                "expected": str(t.get("expected", "")),
                "actual": str(t.get("actual", "")),
            }
        )
    lines = [f"Case {i + 1}: {d['actual']}" for i, d in enumerate(details)]
    return {
        "execution_available": True,
        "status": str(res.get("status") or "UNKNOWN"),
        "stdout": "\n".join(lines) if lines else "",
        "stderr": "",
        "passed": int(res.get("passed") or 0),
        "total": int(res.get("total") or len(details) or 0),
        "tests": details,
        "runtime_ms": None,
    }


async def run_assessment_preview(
    question: dict,
    code: str,
    language: str,
    mode: str,
    judge_service_url: Optional[str],
) -> Dict[str, Any]:
    """
    Lightweight preview for candidates during job coding assessment (not used for final scoring).
    mode: 'run' — stdin from sample input / first test; 'test' — all configured tests.
    """
    tests = _tests_from_question(question)
    lang_l = map_lang_for_judge(language)

    if lang_l == "sql":
        schema = question.get("sqlSchema") or question.get("sql_schema") or ""
        sql_tests = _sql_preview_tests(question, tests, mode)
        if mode == "test" and not tests:
            return {
                "execution_available": True,
                "status": "NO_TESTS",
                "message": "No test cases configured for this question.",
                "stdout": "",
                "stderr": "",
                "passed": 0,
                "total": 0,
                "tests": [],
            }
        res = await asyncio.to_thread(evaluate_sql_local, code, sql_tests, schema or None)
        return _format_sql_preview_dict(res)

    if lang_l not in _JUDGE_LANGS:
        return {
            "execution_available": False,
            "status": "UNSUPPORTED",
            "message": f"Live preview is not available for {language} in this environment.",
            "stdout": "",
            "stderr": "",
        }

    if mode == "run":
        stdin = str(question.get("sampleInput") or question.get("sample_input") or "")
        if not stdin.strip() and tests:
            stdin = str(tests[0].get("input", ""))
        out = await _call_judge_run_only(judge_service_url, lang_l, code, stdin)
        if not out.get("execution_available", True):
            return out
        return {
            "execution_available": True,
            "status": out.get("status"),
            "stdout": out.get("stdout") or "",
            "stderr": out.get("stderr") or "",
            "runtime_ms": out.get("runtime_ms"),
            "passed": None,
            "total": None,
            "tests": [],
        }

    # test mode
    if not tests:
        return {
            "execution_available": True,
            "status": "NO_TESTS",
            "message": "No test cases configured for this question.",
            "stdout": "",
            "stderr": "",
            "passed": 0,
            "total": 0,
            "tests": [],
        }

    res = await _call_judge_execute(judge_service_url, lang_l, code, tests)
    raw = res.get("raw") if isinstance(res.get("raw"), dict) else {}
    test_rows = raw.get("tests") or raw.get("test_results") or []
    details: List[Dict[str, Any]] = []
    if isinstance(test_rows, list):
        for tr in test_rows:
            if not isinstance(tr, dict):
                continue
            details.append(
                {
                    "passed": bool(tr.get("passed")),
                    "input": str(tr.get("input", "")),
                    "expected": str(tr.get("expected", "")),
                    "actual": str(tr.get("actual", "")),
                }
            )

    return {
        "execution_available": True,
        "status": str(res.get("status") or "UNKNOWN"),
        "stdout": str(raw.get("stdout") or ""),
        "stderr": str(raw.get("stderr") or ""),
        "runtime_ms": raw.get("runtime_ms"),
        "passed": int(res.get("passed") or 0),
        "total": len(tests),
        "tests": details,
    }
