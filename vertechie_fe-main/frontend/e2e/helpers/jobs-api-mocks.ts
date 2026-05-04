import type { Page, Route } from '@playwright/test';

import { E2E_VERIFIED_TECHIE_ID } from './techie-session';

const JSON_CT = { 'Content-Type': 'application/json' };

/** Stable job id for list/detail/apply E2E. */
export const E2E_JOB_ID = 'e2e-job-1';

/** HR user id used with `?posted_by=` on dashboard job list. */
export const E2E_HR_USER_ID = 88802;

function apiPathFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const marker = '/api/v1';
  const i = pathname.indexOf(marker);
  if (i === -1) return pathname;
  let rest = pathname.slice(i + marker.length) || '/';
  if (rest.length > 1 && rest.endsWith('/')) rest = rest.slice(0, -1);
  return rest;
}

async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    headers: JSON_CT,
    body: JSON.stringify(body),
  });
}

function buildBackendJob(overrides: Record<string, unknown> = {}) {
  const now = new Date().toISOString();
  return {
    id: E2E_JOB_ID,
    title: 'E2E Senior React Developer',
    company_name: 'E2E Tech Corp',
    description:
      'Build modern web applications with our team. We care about testing, accessibility, and shipping quality software.',
    skills_required: ['React', 'TypeScript'],
    experience_level: 'mid',
    location: 'Remote',
    job_type: 'full-time',
    status: 'published',
    posted_by_id: String(E2E_HR_USER_ID),
    created_at: now,
    updated_at: now,
    applications_count: 0,
    coding_questions: [],
    screening_questions: [],
    collect_applicant_location: false,
    salary_min: null,
    salary_max: null,
    ...overrides,
  };
}

/**
 * Mocks job portal HTTP calls (`fetch` via `API_BASE_URL` → `/api/v1/...`).
 * Also stubs profile/experience/education and places autocomplete for Job Apply / HR create flows.
 */
/** Matches `installHrSession` bearer so `/users/me` does not overwrite HR `userData`. */
const E2E_HR_ACCESS_SUBSTR = 'e2e-playwright-hr-access-token';

/** Minimal `/users/me` for AppHeader merge (axios must not get real 401 → logout redirect). */
function usersMePayloadForAuthHeader(authHeader: string | undefined) {
  const h = authHeader || '';
  if (h.includes(E2E_HR_ACCESS_SUBSTR)) {
    return {
      id: E2E_HR_USER_ID,
      email: 'e2e-hr@example.com',
      username: 'e2ehr',
      first_name: 'E2E',
      last_name: 'Recruiter',
      is_active: true,
      is_verified: true,
      verification_status: 'APPROVED',
      groups: [{ id: 10, name: 'hiring_manager' }],
      user_type: 'hr',
      mobile_number: '',
      country: 'USA',
      current_company: 'E2E Hiring Co',
    };
  }
  return {
    id: E2E_VERIFIED_TECHIE_ID,
    email: 'e2e-techie@example.com',
    username: 'e2etechie',
    first_name: 'E2E',
    last_name: 'Techie',
    is_active: true,
    is_verified: true,
    verification_status: 'APPROVED',
    groups: [] as { id: number; name: string }[],
    mobile_number: '',
    country: 'USA',
  };
}

export async function installJobsPortalMocks(page: Page): Promise<void> {
  const techieJobList: ReturnType<typeof buildBackendJob>[] = [buildBackendJob()];
  const hrJobList: ReturnType<typeof buildBackendJob>[] = [];

  const fulfillJobList = async (route: Route, list: ReturnType<typeof buildBackendJob>[]) => {
    await fulfillJson(route, list);
  };

  await page.route('**/api/v1/auth/refresh**', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }
    let refreshToken = '';
    try {
      refreshToken = String(
        (route.request().postDataJSON() as { refresh_token?: string })?.refresh_token || ''
      );
    } catch {
      refreshToken = '';
    }
    if (refreshToken.includes('hr')) {
      await fulfillJson(route, {
        access_token: 'e2e-playwright-hr-access-token',
        refresh_token: 'e2e-playwright-hr-refresh-token',
        token_type: 'bearer',
      });
      return;
    }
    await fulfillJson(route, {
      access_token: 'e2e-playwright-access-token',
      refresh_token: 'e2e-playwright-refresh-token',
      token_type: 'bearer',
    });
  });

  await page.route('**/api/v1/chat/conversations/unread-count**', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, { unread_count: 0 });
      return;
    }
    await route.continue();
  });

  await page.route('**/api/v1/hiring/notifications/unread-count**', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, { unread_count: 0 });
      return;
    }
    await route.continue();
  });

  const isExactUsersMeGet = (url: URL) =>
    url.pathname.replace(/\/$/, '') === '/api/v1/users/me';

  await page.route(isExactUsersMeGet, async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    const auth = route.request().headers()['authorization'];
    await fulfillJson(route, usersMePayloadForAuthHeader(auth));
  });

  await page.route('**/api/v1/jobs**', async (route) => {
    const req = route.request();
    const method = req.method();
    const path = apiPathFromUrl(req.url());
    const url = new URL(req.url());
    const postedBy = url.searchParams.get('posted_by');

    if (method === 'GET' && path === '/jobs/title-autocomplete') {
      await fulfillJson(route, ['E2E Automation Engineer', 'E2E Senior React Developer']);
      return;
    }

    if (method === 'GET' && (path === '/jobs' || path === '/jobs/')) {
      if (postedBy === String(E2E_HR_USER_ID)) {
        await fulfillJobList(route, hrJobList);
        return;
      }
      await fulfillJobList(route, techieJobList);
      return;
    }

    const singleJobGet = path.match(/^\/jobs\/([^/]+)$/);
    if (method === 'GET' && singleJobGet) {
      const seg = singleJobGet[1];
      if (seg !== 'saved' && seg !== 'my' && seg !== 'title-autocomplete') {
        const merged = [...techieJobList, ...hrJobList];
        const found = merged.find((j) => j.id === seg);
        await fulfillJson(route, found || buildBackendJob({ id: seg }));
        return;
      }
    }

    if (method === 'GET' && path === '/jobs/saved') {
      await fulfillJson(route, []);
      return;
    }

    if (method === 'POST' && path === '/jobs/saved') {
      await fulfillJson(route, { ok: true });
      return;
    }

    if (method === 'DELETE' && path.startsWith('/jobs/saved/')) {
      await route.fulfill({ status: 204, headers: JSON_CT, body: '' });
      return;
    }

    if (method === 'GET' && path === '/jobs/my/applications') {
      await fulfillJson(route, []);
      return;
    }

    const applyMatch = path.match(/^\/jobs\/([^/]+)\/apply$/);
    if (method === 'POST' && applyMatch) {
      const jobId = applyMatch[1];
      await fulfillJson(route, {
        id: 'e2e-application-1',
        job_id: jobId,
        applicant_id: String(E2E_VERIFIED_TECHIE_ID),
        status: 'applied',
        submitted_at: new Date().toISOString(),
        answers: {},
        applicant: {
          id: E2E_VERIFIED_TECHIE_ID,
          first_name: 'E2E',
          last_name: 'Techie',
          email: 'e2e-techie@example.com',
        },
      });
      return;
    }

    if (method === 'POST' && (path === '/jobs' || path === '/jobs/')) {
      let body: Record<string, unknown> = {};
      try {
        body = req.postDataJSON() as Record<string, unknown>;
      } catch {
        body = {};
      }
      const newId = `e2e-job-${Date.now()}`;
      const row = {
        id: newId,
        title: String(body.title || 'New E2E Job'),
        company_name: String(body.company_name || 'Company'),
        description: String(body.description || 'Description'),
        skills_required: Array.isArray(body.skills_required) ? body.skills_required : ['React'],
        experience_level: String(body.experience_level || 'mid'),
        location: String(body.location || 'Remote'),
        job_type: String(body.job_type || 'full-time'),
        status: 'published',
        posted_by_id: String(E2E_HR_USER_ID),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        applications_count: 0,
        coding_questions: [],
        screening_questions: [],
        collect_applicant_location: false,
      };
      const typedRow = row as ReturnType<typeof buildBackendJob>;
      hrJobList.push(typedRow);
      // Published jobs are visible to applicants on the public list (same as production).
      techieJobList.push(typedRow);
      await fulfillJson(route, row);
      return;
    }

    if (method === 'GET') {
      await fulfillJson(route, []);
      return;
    }

    await fulfillJson(route, {});
  });

  await page.route('**/api/v1/places/autocomplete**', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, [{ display_name: 'Remote, United States' }]);
      return;
    }
    await route.continue();
  });

  await page.route('**/api/v1/users/me/profile', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, {});
      return;
    }
    await route.continue();
  });

  await page.route('**/api/v1/users/me/experiences**', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, []);
      return;
    }
    await route.continue();
  });

  await page.route('**/api/v1/users/me/educations**', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, []);
      return;
    }
    await route.continue();
  });

  /** ATS layout stats + pipeline page (fetch, not axios). */
  await page.route('**/api/v1/hiring/interviews**', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, []);
      return;
    }
    await route.continue();
  });

  await page.route('**/api/v1/hiring/pipeline/candidates**', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, []);
      return;
    }
    await route.continue();
  });

  await page.route('**/api/v1/hiring/analytics**', async (route) => {
    if (route.request().method() === 'GET') {
      await fulfillJson(route, {
        pipeline_metrics: [],
        job_performance: [],
        source_metrics: [],
        total_applicants: 0,
        interviews_scheduled: 0,
        offers_made: 0,
      });
      return;
    }
    await route.continue();
  });

  /** ATS Scheduling page (`calendarService` → axios `/calendar/...`). */
  await page.route('**/api/v1/calendar/**', async (route) => {
    const req = route.request();
    if (req.method() !== 'GET') {
      await route.continue();
      return;
    }
    const path = apiPathFromUrl(req.url());
    if (path === '/calendar/meeting-types' || path === '/calendar/meeting-types/') {
      await fulfillJson(route, []);
      return;
    }
    if (path.startsWith('/calendar/meeting-types/')) {
      await fulfillJson(route, {
        id: 'e2e-meeting-type-1',
        name: 'E2E Meeting',
        slug: 'e2e-meeting',
        description: null,
        duration_minutes: 30,
        location_type: 'video',
        color: '#0d47a1',
        is_active: true,
      });
      return;
    }
    if (path === '/calendar/scheduling-links' || path === '/calendar/scheduling-links/') {
      await fulfillJson(route, []);
      return;
    }
    if (path.startsWith('/calendar/scheduling-links/')) {
      await fulfillJson(route, {
        id: 'e2e-link-1',
        token: 'e2e-token',
        name: 'E2E Link',
        duration_minutes: 30,
        available_days: [1, 2, 3, 4, 5],
        start_date: null,
        end_date: null,
        max_bookings: null,
        bookings_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
      });
      return;
    }
    if (path === '/calendar/bookings' || path === '/calendar/bookings/' || path.startsWith('/calendar/bookings')) {
      await fulfillJson(route, []);
      return;
    }
    if (path === '/calendar/sync/status' || path === '/calendar/sync/status/') {
      await fulfillJson(route, { connections: [], sync_in_progress: false });
      return;
    }
    if (path === '/calendar/connections' || path === '/calendar/connections/') {
      await fulfillJson(route, []);
      return;
    }
    await fulfillJson(route, []);
  });

  /** Candidate profile smoke (`/techie/ats/candidate/e2e-ats-candidate`). */
  await page.route('**/api/v1/users/e2e-ats-candidate**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    const path = apiPathFromUrl(route.request().url());
    if (path === '/users/e2e-ats-candidate' || path === '/users/e2e-ats-candidate/') {
      await fulfillJson(route, {
        id: 'e2e-ats-candidate',
        email: 'e2e-candidate@example.com',
        first_name: 'E2E',
        last_name: 'Candidate',
        username: 'e2ecandidate',
        is_active: true,
        is_verified: true,
      });
      return;
    }
    if (path.includes('/profile')) {
      await fulfillJson(route, {});
      return;
    }
    if (path.includes('experiences')) {
      await fulfillJson(route, []);
      return;
    }
    if (path.includes('educations')) {
      await fulfillJson(route, []);
      return;
    }
    await fulfillJson(route, {});
  });
}

export async function uninstallJobsPortalMocks(page: Page): Promise<void> {
  await page.unroute('**/api/v1/jobs**');
  await page.unroute('**/api/v1/auth/refresh**');
  await page.unroute('**/api/v1/chat/conversations/unread-count**');
  await page.unroute('**/api/v1/hiring/notifications/unread-count**');
  await page.unroute(
    (url: URL) => url.pathname.replace(/\/$/, '') === '/api/v1/users/me'
  );
  await page.unroute('**/api/v1/places/autocomplete**');
  await page.unroute('**/api/v1/users/me/profile');
  await page.unroute('**/api/v1/users/me/experiences**');
  await page.unroute('**/api/v1/users/me/educations**');
  await page.unroute('**/api/v1/hiring/interviews**');
  await page.unroute('**/api/v1/hiring/pipeline/candidates**');
  await page.unroute('**/api/v1/hiring/analytics**');
  await page.unroute('**/api/v1/calendar/**');
  await page.unroute('**/api/v1/users/e2e-ats-candidate**');
}
