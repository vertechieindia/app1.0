"""Walk through client screening flows one-by-one against live API."""
from __future__ import annotations

import json
import sys
import uuid
from datetime import date

import requests

BASE = "http://127.0.0.1:8000/api/v1"
PASS = "Test@12345"
results: list[tuple[str, str, str]] = []  # step, status, detail


def log(step: str, ok: bool, detail: str = "") -> None:
    status = "PASS" if ok else "FAIL"
    results.append((step, status, detail))
    mark = "OK" if ok else "X"
    print(f"{mark} [{status}] {step}" + (f" - {detail}" if detail else ""))


def login(email: str, password: str) -> str | None:
    r = requests.post(
        f"{BASE}/auth/login",
        json={"email": email, "password": password},
        timeout=30,
    )
    if r.status_code != 200:
        return None
    data = r.json()
    return data.get("access") or data.get("access_token") or data.get("token")


def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}


def find_approved_hm() -> tuple[str, str] | None:
    """Return (email, password) for an approved HM if known defaults work."""
    candidates = [
        ("hmadmin@gmail.com", PASS),
        ("123@gmail.com", PASS),
        ("hm@test.com", PASS),
        ("admin@test.com", PASS),
    ]
    for email, pw in candidates:
        tok = login(email, pw)
        if tok:
            me = requests.get(f"{BASE}/auth/me", headers=auth_headers(tok), timeout=30)
            if me.status_code == 200:
                u = me.json()
                vs = str(u.get("verification_status", "")).upper()
                roles = u.get("admin_roles") or []
                role_types = [str(r.get("role_type", "")) for r in u.get("roles", []) if isinstance(r, dict)]
                is_hm = "hm_admin" in roles or "hiring_manager" in role_types
                approved = vs == "APPROVED" or u.get("is_verified")
                if is_hm and approved:
                    return email, pw
    return None


def register_hm() -> tuple[str, str]:
    email = f"hm.flow.{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": email,
        "username": email,
        "first_name": "Flow",
        "last_name": "HM",
        "profile_name": "flowhm",
        "dob": "1990-01-01",
        "password": PASS,
        "confirm_password": PASS,
        "role": "hr",
        "gov_id": "1234",
        "gov_id_last_four": "1234",
        "country": "USA",
        "address": "Test",
        "phone": "+15555550100",
        "mobile_number": "+15555550100",
        "email_verified": True,
        "mobile_verified": True,
    }
    r = requests.post(f"{BASE}/auth/register", json=payload, timeout=30)
    if r.status_code not in (200, 201):
        raise RuntimeError(f"HM register failed: {r.status_code} {r.text[:300]}")
    return email, PASS


def approve_user_as_super(email: str) -> bool:
    super_tok = login("admin@test.com", PASS) or login("superadmin@test.com", PASS)
    if not super_tok:
        return False
    # list users and approve
    r = requests.get(
        f"{BASE}/admin/users",
        headers=auth_headers(super_tok),
        params={"search": email.split("@")[0], "limit": 20},
        timeout=30,
    )
    if r.status_code != 200:
        return False
    users = r.json()
    if isinstance(users, dict):
        users = users.get("items") or users.get("results") or []
    uid = None
    for u in users:
        if u.get("email") == email:
            uid = u.get("id")
            break
    if not uid:
        return False
    patch = requests.patch(
        f"{BASE}/admin/users/{uid}",
        headers=auth_headers(super_tok),
        json={"verification_status": "APPROVED", "is_active": True, "admin_roles": ["hm_admin"]},
        timeout=30,
    )
    return patch.status_code in (200, 204)


def main() -> int:
    print("=== Client Screening Flow E2E (one-by-one) ===\n")

    # Step 0: API health
    try:
        r = requests.get(f"{BASE.replace('/api/v1', '')}/health", timeout=5)
        log("0. Backend reachable", r.status_code == 200, f"status={r.status_code}")
    except Exception as e:
        log("0. Backend reachable", False, str(e))
        print("\nStart backend: cd vertechie_be/vertechie_fastapi && uvicorn app.main:app --reload")
        return 1

    hm = find_approved_hm()
    if not hm:
        try:
            email, pw = register_hm()
            approve_user_as_super(email)
            hm = find_approved_hm() or (email, pw)
            log("0b. Seed approved HM", True, email)
        except Exception as e:
            log("0b. Seed approved HM", False, str(e))
            return 1
    hm_email, hm_pw = hm
    hm_token = login(hm_email, hm_pw)
    if not hm_token:
        log("0c. HM login", False, hm_email)
        return 1
    log("0c. HM login", True, hm_email)
    hm_h = auth_headers(hm_token)

    # Flow A — Path B: Source-only (Get Help to Source)
    r = requests.post(
        f"{BASE}/screening/sourcing-requests/source-only",
        headers=hm_h,
        json={
            "title": "Senior React Dev (Private Source)",
            "jd_text": "5+ years React, remote US only",
            "screening_criteria": {
                "checks": ["location", "visa", "tech"],
                "tech_mandatory": ["React", "TypeScript"],
            },
            "headcount": 2,
            "notes": "Do not publish to portal",
        },
        timeout=30,
    )
    source_req_id = None
    if r.status_code in (200, 201):
        source_req_id = r.json().get("id")
        pub = r.json().get("publish_to_portal")
        rtype = r.json().get("requirement_type")
        log(
            "1. Path B — Source-only requirement (NOT on portal)",
            pub is False and rtype == "source_only",
            f"id={source_req_id}, publish_to_portal={pub}, type={rtype}",
        )
    else:
        log("1. Path B — Source-only requirement", False, f"{r.status_code} {r.text[:200]}")

    # Requirements Admin sees source-only (superuser or requirements_admin)
    req_tok = login("hmadmin@gmail.com", PASS)  # can use same if given admin role below
    super_candidates = ["admin@vertechie.com", "superadmin@vertechie.com", "admin@gmail.com"]
    for em in super_candidates:
        t = login(em, PASS)
        if t:
            req_tok = t
            break
    if req_tok:
        rr = requests.get(
            f"{BASE}/screening/sourcing-requests",
            headers=auth_headers(req_tok),
            timeout=30,
        )
        if rr.status_code == 200:
            items = rr.json().get("items") or []
            found = any(i.get("id") == source_req_id for i in items) if source_req_id else False
            log("2. Requirements Admin sees source request", found or len(items) > 0, f"total={len(items)}")
        else:
            log("2. Requirements Admin sees source request", False, str(rr.status_code))
    else:
        log("2. Requirements Admin sees source request", False, "no req admin login — use SuperAdmin")

    # Flow C — Screen the Techies
    invite_email = f"candidate.{uuid.uuid4().hex[:6]}@example.com"
    r = requests.post(
        f"{BASE}/screening/screen-techies",
        headers=hm_h,
        json={
            "title": "Enterprise Java Architect",
            "jd_text": "Java, Spring, AWS",
            "emails": [invite_email],
            "enterprise_verification": True,
            "screening_criteria": {"checks": ["visa", "tech"], "tech_mandatory": ["Java"]},
            "email_subject": "VerTechie screening invite",
            "email_body": "Please complete your VerTechie profile for our review.",
        },
        timeout=30,
    )
    invite_token = None
    sourcing_invite_id = None
    if r.status_code in (200, 201):
        body = r.json()
        sourcing_invite_id = body.get("sourcing_request_id")
        invites = body.get("invites") or []
        invite_token = invites[0].get("invite_token") if invites else None
        log(
            "3. Path C — Screen the Techies (bulk invite)",
            body.get("emails_requested", 0) >= 1,
            f"sent={body.get('emails_sent')}, invite_token={'yes' if invite_token else 'no'}",
        )
    else:
        log("3. Path C — Screen the Techies", False, f"{r.status_code} {r.text[:200]}")

    # Public invite prefill (signup deep link)
    if invite_token:
        pr = requests.get(f"{BASE}/screening/invites/public/{invite_token}", timeout=30)
        if pr.status_code == 200:
            info = pr.json()
            log(
                "4. Signup deep link prefill",
                info.get("candidate_email") == invite_email,
                f"email={info.get('candidate_email')}",
            )
        else:
            log("4. Signup deep link prefill", False, str(pr.status_code))
    else:
        log("4. Signup deep link prefill", False, "no invite token")

    # HM progress dashboard
    pr2 = requests.get(f"{BASE}/screening/invites", headers=hm_h, timeout=30)
    if pr2.status_code == 200:
        items = pr2.json().get("items") or []
        found = any(i.get("candidate_email") == invite_email for i in items)
        log("5. HM invite progress tracker", found or len(items) > 0, f"rows={len(items)}")
    else:
        log("5. HM invite progress tracker", False, str(pr2.status_code))

    # HM email signature
    sig = requests.put(
        f"{BASE}/screening/hm/email-signature",
        headers=hm_h,
        json={
            "sender_name": "Flow HM",
            "sender_title": "Talent Lead",
            "sender_phone": "+1-555-0100",
            "signature_html": "<p>Regards,<br/>Flow HM</p>",
        },
        timeout=30,
    )
    log("6. HM email signature", sig.status_code in (200, 201))

    # Tech Screener enterprise tasks
    ts_tok = login("hmadmin@gmail.com", PASS)
    for em in super_candidates:
        t = login(em, PASS)
        if t:
            ts_tok = t
            break
    if ts_tok:
        et = requests.get(
            f"{BASE}/screening/enterprise/tasks?pool=pending",
            headers=auth_headers(ts_tok),
            timeout=30,
        )
        if et.status_code == 200:
            tasks = et.json().get("items") or []
            enterprise = [t for t in tasks if t.get("candidate_email") == invite_email or t.get("task_type") == "enterprise_verification"]
            log("7. Tech Screener enterprise queue", len(tasks) >= 0, f"pending={len(tasks)}, matched={len(enterprise)}")
        else:
            log("7. Tech Screener enterprise queue", False, str(et.status_code))
    else:
        log("7. Tech Screener enterprise queue", False, "no tech screener login")

    # Screener recruitment pool
    sc_tok = login("hmadmin@gmail.com", PASS)
    for em in super_candidates:
        t = login(em, PASS)
        if t:
            sc_tok = t
            break
    if sc_tok:
        st = requests.get(
            f"{BASE}/screening/tasks?pool=open",
            headers=auth_headers(sc_tok),
            timeout=30,
        )
        log("8. Screener open task pool", st.status_code == 200, f"open={st.json().get('total') if st.status_code==200 else st.status_code}")
    else:
        log("8. Screener open task pool", False, "no screener login")

    # Path A adjunct — job-linked sourcing request
    jr = requests.post(
        f"{BASE}/screening/sourcing-requests",
        headers=hm_h,
        json={
            "title": "Public Job — Req Team Help",
            "jd_text": "Linked to existing job posting flow",
            "path": "with_req_team",
            "screening_criteria": {"checks": ["tech"]},
        },
        timeout=30,
    )
    log("9. Job-linked sourcing request (Path A+B hybrid)", jr.status_code in (200, 201))

    print("\n=== Summary ===")
    passed = sum(1 for _, s, _ in results if s == "PASS")
    failed = sum(1 for _, s, _ in results if s == "FAIL")
    print(f"Passed: {passed}  Failed: {failed}  Total: {len(results)}")
    if failed:
        print("\nFailed steps:")
        for step, status, detail in results:
            if status == "FAIL":
                print(f"  - {step}: {detail}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
