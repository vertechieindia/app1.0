import { test, expect, type Page } from '@playwright/test';

import { routes } from '../helpers/routes';

function isAuthLoginUrl(url: URL): boolean {
  return url.pathname.endsWith('/auth/login') || url.pathname.endsWith('/auth/login/');
}

/** Same shape as login mock; used to stub GET /users/… so merges never drop `is_active` under parallel E2E load. */
const pendingUserApiBody = {
  id: 999,
  email: 'pending@example.com',
  username: 'pending',
  first_name: 'E2E',
  last_name: 'User',
  is_active: true,
  is_verified: false,
  verification_status: 'PENDING',
  groups: [],
  mobile_number: '',
  country: 'USA',
};

/** Stub GET /api/v1/users/999/, /users/me/profile, /users/me when backend is down (avoids flaky proxy delays). */
async function routePendingUserFollowUpGets(page: Page) {
  await page.route('**/api/v1/users/**', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }
    const pathname = new URL(route.request().url()).pathname;
    if (pathname.includes('/users/me/profile')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
      return;
    }
    if (pathname.endsWith('/users/me') || pathname.endsWith('/users/me/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(pendingUserApiBody),
      });
      return;
    }
    if (pathname.includes('/users/999')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(pendingUserApiBody),
      });
      return;
    }
    await route.continue();
  });
}

async function resetAuthState(page: Page) {
  await page.goto(routes.login);
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(routes.login);
}

async function fillAndSubmitLogin(page: Page, email: string, password: string) {
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
}

const realLoginEmail = process.env.PLAYWRIGHT_LOGIN_EMAIL?.trim();
const realLoginPassword = process.env.PLAYWRIGHT_LOGIN_PASSWORD?.trim();
const realLoginExpectedPath = process.env.PLAYWRIGHT_LOGIN_EXPECT_PATH?.trim();
const hasRealLoginCreds = Boolean(realLoginEmail && realLoginPassword);

test.describe('Login UI and mocked auth behavior', () => {
  // Serial: one Vite dev server + parallel workers caused occasional 30s timeouts on pending-login flow.
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await resetAuthState(page);
  });

  test('shows welcome heading, email, password, and sign in', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Welcome Back/i })).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('Create an Account goes to signup', async ({ page }) => {
    await page.getByRole('link', { name: /Create an Account/i }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.signup}$`));
  });

  test('invalid credentials show an error alert', async ({ page }) => {
    // Use 400, not 401: axios interceptor treats 401 without refresh as hard logout + redirect.
    await page.route(isAuthLoginUrl, async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Invalid email or password' }),
      });
    });

    await fillAndSubmitLogin(page, 'nobody@example.com', 'wrong-password');

    await expect(page.getByRole('alert')).toContainText(/invalid/i);
  });

  test('successful login for pending user redirects to status processing', async ({ page }) => {
    await routePendingUserFollowUpGets(page);

    await page.route(isAuthLoginUrl, async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mock-access-token',
          refresh: 'mock-refresh-token',
          user_data: pendingUserApiBody,
        }),
      });
    });

    await fillAndSubmitLogin(page, 'pending@example.com', 'any-password');

    await expect(page).toHaveURL(/\/status\/processing/, { timeout: 30_000 });
    await expect(
      page.getByRole('heading', { name: /Your Account is Being Processed/i }),
    ).toBeVisible({ timeout: 15_000 });
  });
});

test.describe('Login real backend flow', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Real login runs only on Chromium to avoid multi-browser state conflicts.');
    test.skip(!hasRealLoginCreds, 'Set PLAYWRIGHT_LOGIN_EMAIL and PLAYWRIGHT_LOGIN_PASSWORD to run real login E2E.');
    await resetAuthState(page);
  });

  test('logs in with a real account without stalling on the login page', async ({ page }) => {
    await fillAndSubmitLogin(page, realLoginEmail!, realLoginPassword!);

    await expect(page).not.toHaveURL(new RegExp(`${routes.login}$`), { timeout: 30_000 });

    if (realLoginExpectedPath) {
      await expect(page).toHaveURL(new RegExp(realLoginExpectedPath), { timeout: 30_000 });
    }

    await expect
      .poll(async () => {
        return await page.evaluate(() => ({
          authToken: localStorage.getItem('authToken'),
          userData: localStorage.getItem('userData'),
        }));
      }, { timeout: 15_000 })
      .toMatchObject({
        authToken: expect.any(String),
        userData: expect.any(String),
      });
  });
});
