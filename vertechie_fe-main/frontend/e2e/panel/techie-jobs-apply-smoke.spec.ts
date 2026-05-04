import { test, expect } from '@playwright/test';

import { E2E_JOB_ID, installJobsPortalMocks, uninstallJobsPortalMocks } from '../helpers/jobs-api-mocks';
import { routes } from '../helpers/routes';
import { installVerifiedTechieSession } from '../helpers/techie-session';

test.describe('Techie job apply smoke (mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await installVerifiedTechieSession(page);
    await installJobsPortalMocks(page);
  });

  test.afterEach(async ({ page }) => {
    await uninstallJobsPortalMocks(page);
  });

  test('submit application shows success confirmation', async ({ page }) => {
    await page.goto(routes.techieJobApply(E2E_JOB_ID));

    const submit = page.getByRole('button', { name: 'Submit Application' });
    await expect(submit).toBeVisible({ timeout: 30_000 });
    await submit.click();

    await expect(page.getByRole('heading', { name: 'Application Submitted!' })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(/submitted successfully/i)).toBeVisible();
  });
});
