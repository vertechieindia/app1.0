import type { Page, Route } from '@playwright/test';

const E2E_ACCESS = 'e2e-signup-access-token';

function tryParseJson(route: Route): Record<string, unknown> {
  try {
    const raw = route.request().postData();
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function fulfillJson(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/**
 * Stubs signup-related FastAPI paths so wizard steps can run without a backend.
 * Scoped to `/api/v1/` only; other requests continue to the app.
 */
export async function installSignupFlowApiMocks(page: Page) {
  await page.route('**/api/v1/**', async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname.replace(/\/+$/, '') || url.pathname;
    const method = req.method();

    if (method === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*' } });
      return;
    }

    if (method === 'POST' && path.endsWith('/auth/register')) {
      const body = tryParseJson(route);
      const email = typeof body.email === 'string' ? body.email : 'e2e-user@test.local';
      await fulfillJson(route, 200, {
        message: 'ok',
        user_data: { id: 88001, email },
        user: { id: 88001, email },
      });
      return;
    }

    if (method === 'POST' && path.endsWith('/auth/login')) {
      const body = tryParseJson(route);
      const email = typeof body.email === 'string' ? body.email : 'e2e-user@test.local';
      await fulfillJson(route, 200, {
        access: E2E_ACCESS,
        refresh: 'e2e-refresh-token',
        user_data: {
          id: 88001,
          email,
          is_active: true,
          is_verified: false,
          verification_status: 'PENDING',
        },
      });
      return;
    }

    if (method === 'GET' && path.includes('/companies') && url.searchParams.has('search')) {
      await fulfillJson(route, 200, []);
      return;
    }

    if (method === 'GET' && path.includes('/places/autocomplete')) {
      await fulfillJson(route, 200, [
        {
          id: 'e2e-place-1',
          display_name: 'Austin, TX, USA',
          name: 'Austin',
          country_code: 'US',
        },
      ]);
      return;
    }

    if (method === 'GET' && path.includes('/schools') && url.searchParams.has('search')) {
      await fulfillJson(route, 200, []);
      return;
    }

    if (method === 'POST' && path.endsWith('/users/me/experiences')) {
      await fulfillJson(route, 201, { id: `exp-${Date.now()}` });
      return;
    }

    if (method === 'PATCH' && path.includes('/users/me/experiences/')) {
      await fulfillJson(route, 200, { id: path.split('/').pop() });
      return;
    }

    if (method === 'POST' && path.endsWith('/users/me/educations')) {
      await fulfillJson(route, 201, { id: `edu-${Date.now()}` });
      return;
    }

    if (method === 'PATCH' && path.includes('/users/me/educations/')) {
      await fulfillJson(route, 200, { id: path.split('/').pop() });
      return;
    }

    if (
      method === 'POST' &&
      /\/companies\/?$/.test(path) &&
      !path.includes('/invites') &&
      !path.includes('/signup')
    ) {
      await fulfillJson(route, 201, { id: 'e2e-company-1', company_id: 'e2e-company-1' });
      return;
    }

    if (method === 'PUT' && path.includes('/companies/')) {
      await fulfillJson(route, 200, { id: 'e2e-company-1' });
      return;
    }

    if (method === 'PUT' && path.includes('/users/me/profile')) {
      await fulfillJson(route, 200, { ok: true });
      return;
    }

    if (method === 'GET' && path.includes('/users/me/company')) {
      await fulfillJson(route, 200, []);
      return;
    }

    await route.continue();
  });
}
