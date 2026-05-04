import { test, expect } from '@playwright/test';

import { E2E_JOB_ID, installJobsPortalMocks, uninstallJobsPortalMocks } from '../helpers/jobs-api-mocks';
import { routes } from '../helpers/routes';
import { installVerifiedTechieSession } from '../helpers/techie-session';

test.describe('Techie jobs browse (mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await installVerifiedTechieSession(page);
    await installJobsPortalMocks(page);
  });

  test.afterEach(async ({ page }) => {
    await uninstallJobsPortalMocks(page);
  });

  test('list shows mock job; detail shows role and Apply Now', async ({ page }) => {
    await page.goto(routes.techieJobs);

    await expect(page.getByText('Find Your Dream Tech Job')).toBeVisible();
    await expect(page.getByText('1 Active Jobs')).toBeVisible();
    await expect(page.getByText('E2E Senior React Developer')).toBeVisible();
    await expect(page.getByText('E2E Tech Corp')).toBeVisible();

    // Prefer the job card (not any duplicate text) so we do not hit a stray link.
    await page
      .locator('.MuiCard-root')
      .filter({ hasText: 'E2E Senior React Developer' })
      .filter({ hasText: 'E2E Tech Corp' })
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`${routes.techieJob(E2E_JOB_ID)}$`), { timeout: 15_000 });

    await expect(page.getByRole('heading', { name: 'E2E Senior React Developer' })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText('About This Role')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Apply Now' })).toBeVisible();
  });
});
