import { test, expect } from '@playwright/test';

import { installHrSession } from '../helpers/hr-session';
import { installJobsPortalMocks, uninstallJobsPortalMocks } from '../helpers/jobs-api-mocks';
import { routes } from '../helpers/routes';
import { installVerifiedTechieSession } from '../helpers/techie-session';

/** Unique title so the techie list assertion cannot collide with the default mock job. */
const HR_CREATED_TITLE = `E2E HR Posted Role ${Date.now()}`;

test.describe('HR create job → visible on techie jobs list', () => {
  test.beforeEach(async ({ page }) => {
    await installJobsPortalMocks(page);
  });

  test.afterEach(async ({ page }) => {
    await uninstallJobsPortalMocks(page);
  });

  test('HR creates a job; techie browse list shows that job', async ({ page }) => {
    await installHrSession(page);
    await page.goto(routes.hrCreateJob);

    await expect(page.getByRole('heading', { name: 'Create Job Post' })).toBeVisible();

    await page.getByLabel('Job Title').fill(HR_CREATED_TITLE);
    await page.getByLabel('Location').fill('Rem');
    await expect(page.getByRole('option', { name: /Remote, United States/i })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('option', { name: /Remote, United States/i }).click();

    await page
      .getByLabel('Job Description')
      .fill('Role created by HR E2E; must appear for applicants browsing jobs.');

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

    await installVerifiedTechieSession(page);
    await page.goto(routes.techieJobs, { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Find Your Dream Tech Job')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText(HR_CREATED_TITLE)).toBeVisible();
    await expect(page.getByText('E2E Senior React Developer')).toBeVisible();
  });
});
