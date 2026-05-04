import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { installJobsPortalMocks, uninstallJobsPortalMocks } from './jobs-api-mocks';
import { installVerifiedTechieSession } from './techie-session';

/** Cold Vite + ATS layout stats can exceed default 5s on first navigation. */
export const ATS_E2E_SHELL_TIMEOUT_MS = 25_000;

export async function setupTechieAtsE2E(page: Page): Promise<void> {
  await installVerifiedTechieSession(page);
  await installJobsPortalMocks(page);
}

export async function teardownTechieAtsE2E(page: Page): Promise<void> {
  await uninstallJobsPortalMocks(page);
}

export async function expectAtsShellVisible(page: Page, timeout = ATS_E2E_SHELL_TIMEOUT_MS): Promise<void> {
  await expect(page.getByRole('heading', { name: 'Applicant Tracking System' })).toBeVisible({ timeout });
  await expect(
    page.getByText('Manage your job postings and track candidates through the hiring pipeline')
  ).toBeVisible({ timeout });
}

/** Stable `candidateId` for `/techie/ats/candidate/:id` — backed by `jobs-api-mocks` user stubs. */
export const E2E_ATS_CANDIDATE_ID = 'e2e-ats-candidate';
