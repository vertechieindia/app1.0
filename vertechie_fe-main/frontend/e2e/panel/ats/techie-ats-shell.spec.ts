import { test, expect } from '@playwright/test';

import {
  ATS_E2E_SHELL_TIMEOUT_MS,
  E2E_ATS_CANDIDATE_ID,
  expectAtsShellVisible,
  setupTechieAtsE2E,
  teardownTechieAtsE2E,
} from '../../helpers/ats-e2e-setup';
import { routes } from '../../helpers/routes';

test.describe('Techie ATS (mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await setupTechieAtsE2E(page);
  });

  test.afterEach(async ({ page }) => {
    await teardownTechieAtsE2E(page);
  });

  test('default ATS route loads pipeline', async ({ page }) => {
    await page.goto(routes.techieAts);
    await expectAtsShellVisible(page);
    await expect(page.getByPlaceholder('Search candidates...')).toBeVisible({
      timeout: ATS_E2E_SHELL_TIMEOUT_MS,
    });
    await expect(page.getByText('New Applicants', { exact: true })).toBeVisible();
  });

  test('job postings shows mock job card', async ({ page }) => {
    await page.goto(routes.techieAtsJobPostings);
    await expectAtsShellVisible(page);
    await expect(page.getByPlaceholder('Search jobs...')).toBeVisible({
      timeout: ATS_E2E_SHELL_TIMEOUT_MS,
    });
    await expect(
      page.locator('.MuiCard-root').filter({ hasText: 'E2E Senior React Developer' }).first()
    ).toBeVisible({ timeout: ATS_E2E_SHELL_TIMEOUT_MS });
  });

  test('all candidates table shell', async ({ page }) => {
    await page.goto(routes.techieAtsAllCandidates);
    await expectAtsShellVisible(page);
    await expect(page.getByRole('button', { name: 'Export' })).toBeVisible({
      timeout: ATS_E2E_SHELL_TIMEOUT_MS,
    });
    await expect(page.getByText('No candidates found')).toBeVisible();
  });

  test('interviews schedule shell', async ({ page }) => {
    await page.goto(routes.techieAtsInterviews);
    await expectAtsShellVisible(page);
    await expect(page.getByRole('heading', { name: 'Interview Schedule' })).toBeVisible({
      timeout: ATS_E2E_SHELL_TIMEOUT_MS,
    });
    await expect(page.getByRole('button', { name: 'Calendar View' })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Today \(\d+\)/ })).toBeVisible();
  });

  test('scheduling shell', async ({ page }) => {
    await page.goto(routes.techieAtsScheduling);
    await expectAtsShellVisible(page);
    await expect(page.getByRole('heading', { name: 'Calendar & Scheduling' })).toBeVisible({
      timeout: ATS_E2E_SHELL_TIMEOUT_MS,
    });
    await expect(page.getByText('Your Scheduling Link', { exact: true })).toBeVisible();
  });

  test('calendar shell', async ({ page }) => {
    await page.goto(routes.techieAtsCalendar);
    await expectAtsShellVisible(page);
    await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible({
      timeout: ATS_E2E_SHELL_TIMEOUT_MS,
    });
  });

  test('analytics shell', async ({ page }) => {
    await page.goto(routes.techieAtsAnalytics);
    await expectAtsShellVisible(page);
    await expect(page.getByRole('heading', { name: 'Hiring Analytics' })).toBeVisible({
      timeout: ATS_E2E_SHELL_TIMEOUT_MS,
    });
    await expect(
      page.getByText('No pipeline data yet. Create jobs and receive applications to see metrics.')
    ).toBeVisible();
  });

  test('candidate profile loads mock candidate', async ({ page }) => {
    await page.goto(routes.techieAtsCandidate(E2E_ATS_CANDIDATE_ID));
    await expectAtsShellVisible(page);
    await expect(page.getByRole('heading', { name: 'E2E Candidate' })).toBeVisible({
      timeout: ATS_E2E_SHELL_TIMEOUT_MS,
    });
    await expect(page.getByText('e2e-candidate@example.com')).toBeVisible();
  });

  test('ATS sub-nav moves between pipeline and job postings', async ({ page }) => {
    await page.goto(routes.techieAtsJobPostings);
    await expectAtsShellVisible(page);

    await page.getByText('Pipeline', { exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.techieAtsPipeline}$`));
    await expect(page.getByPlaceholder('Search candidates...')).toBeVisible();
    await expect(page.getByText('New Applicants', { exact: true })).toBeVisible();

    await page.getByText('Job Postings', { exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.techieAtsJobPostings}$`));
    await expect(page.getByPlaceholder('Search jobs...')).toBeVisible();
    await expect(page.getByText('E2E Senior React Developer')).toBeVisible();
  });
});
