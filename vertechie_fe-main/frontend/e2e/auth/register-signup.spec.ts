import { test, expect } from '@playwright/test';

import {
  enterHiringManagerSignupAfterCountry,
  enterTechieSignupAfterCountry,
  expectFlowHeader,
  expectStepperIncludes,
  HR_FULL_STEP_LABELS,
  SIGNUP_COUNTRY,
  TECHIE_FULL_STEP_LABELS,
} from '../helpers/register-wizard';

test.describe('Register (signup wizard)', () => {
  test('techie — United States shows country header, stepper, and document step', async ({
    page,
  }) => {
    await enterTechieSignupAfterCountry(page, SIGNUP_COUNTRY.US);
    await expectFlowHeader(page, SIGNUP_COUNTRY.US);
    await expectStepperIncludes(page, TECHIE_FULL_STEP_LABELS);
    await expect(
      page.getByRole('heading', { name: 'Document Verification', exact: true }),
    ).toBeVisible();
  });

  test('hiring manager — United States shows country header and HR stepper', async ({ page }) => {
    await enterHiringManagerSignupAfterCountry(page, SIGNUP_COUNTRY.US);
    await expectFlowHeader(page, SIGNUP_COUNTRY.US);
    await expectStepperIncludes(page, HR_FULL_STEP_LABELS);
    await expect(
      page.getByRole('heading', { name: 'Document Verification', exact: true }),
    ).toBeVisible();
  });
});
