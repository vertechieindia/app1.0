import { test, expect } from '@playwright/test';

import { installHrSession } from '../helpers/hr-session';
import { installJobsPortalMocks, uninstallJobsPortalMocks } from '../helpers/jobs-api-mocks';
import { routes } from '../helpers/routes';

test.describe('HR create job smoke (mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await installHrSession(page);
    await installJobsPortalMocks(page);
  });

  test.afterEach(async ({ page }) => {
    await uninstallJobsPortalMocks(page);
  });

  test('create job shows success and navigates to dashboard', async ({ page }) => {
    await page.goto(routes.hrCreateJob);

    await expect(page.getByText('Create Job Post')).toBeVisible();

    await page.getByLabel('Job Title').fill('E2E Playwright QA Engineer');
    await expect(page.getByLabel('Company Name')).toHaveValue(/E2E Hiring Co/);

    await page.getByLabel('Location').fill('Rem');
    await expect(page.getByRole('option', { name: /Remote, United States/i })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('option', { name: /Remote, United States/i }).click();

    await page
      .getByLabel('Job Description')
      .fill('End-to-end testing with Playwright. Collaborate with engineering to keep releases stable.');

    await page.getByLabel('Add a skill').fill('Playwright');
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Playwright' })).toBeVisible();

    const createBtn = page.getByRole('button', { name: 'Create Job' });
    await createBtn.evaluate((el: HTMLButtonElement) => {
      el.scrollIntoView({ block: 'center' });
      el.click();
    });

    await expect(page).toHaveURL(new RegExp(`${routes.hrDashboard}$`), { timeout: 20_000 });
    await expect(page.getByText('WELCOME BACK')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'E2E Recruiter' })).toBeVisible();
  });
});
