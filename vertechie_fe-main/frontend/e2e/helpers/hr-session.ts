import type { Page } from '@playwright/test';

import { E2E_HR_USER_ID } from './jobs-api-mocks';

/**
 * Verified hiring manager profile for HR routes (`/hr/*`).
 * `groups` includes `hiring_manager` so `hasAccountRole` / redirect logic match production.
 */
export const e2eHrUser = {
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

export async function installHrSession(page: Page): Promise<void> {
  await page.addInitScript((user: typeof e2eHrUser) => {
    localStorage.setItem('authToken', 'e2e-playwright-hr-access-token');
    localStorage.setItem('refreshToken', 'e2e-playwright-hr-refresh-token');
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('profileCompletionShown', '1');
  }, e2eHrUser);
}
