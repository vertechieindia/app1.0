import type { Page } from '@playwright/test';

/** Stable id for mocked `/users/me` and `userData` in localStorage. */
export const E2E_VERIFIED_TECHIE_ID = 88801;

/** Minimal verified techie profile: matches `getRedirectPathForUser` after profile completion. */
export const e2eVerifiedTechieUser = {
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

/**
 * Seeds localStorage before the first navigation so `ProtectedRoute` and
 * profile-completion redirect see an approved techie with feed access.
 */
export async function installVerifiedTechieSession(page: Page): Promise<void> {
  await page.addInitScript((user: typeof e2eVerifiedTechieUser) => {
    localStorage.setItem('authToken', 'e2e-playwright-access-token');
    localStorage.setItem('refreshToken', 'e2e-playwright-refresh-token');
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('profileCompletionShown', '1');
  }, e2eVerifiedTechieUser);
}
