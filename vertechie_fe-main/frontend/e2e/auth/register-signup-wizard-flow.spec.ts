import { test, expect } from '@playwright/test';

import { installSignupFlowApiMocks } from '../helpers/signup-api-mocks';
import {
  enterHiringManagerSignupAfterCountry,
  enterTechieSignupAfterCountry,
  fillHrCompanyDetailsAndContinue,
  fillOneEducationAndContinue,
  fillOneWorkExperienceAndContinue,
  fillUsPersonalInformationAndContinue,
  passDocumentStubStep,
  SIGNUP_COUNTRY,
} from '../helpers/signup-wizard-flow';

test.describe('Register wizard full flow (E2E stub, mocked APIs)', () => {
  test.describe.configure({ mode: 'serial', timeout: 120_000 });

  test.beforeEach(async ({ page }) => {
    await installSignupFlowApiMocks(page);
  });

  test('techie US — personal, work experience, education, reaches review', async ({ page }) => {
    const email = `e2e-techie-${Date.now()}@example.com`;

    await enterTechieSignupAfterCountry(page, SIGNUP_COUNTRY.US);
    await passDocumentStubStep(page);
    await fillUsPersonalInformationAndContinue(page, email, 'work-experience');
    await fillOneWorkExperienceAndContinue(page);
    await fillOneEducationAndContinue(page);

    await expect(page.getByRole('checkbox', { name: /Terms and Conditions/i })).toBeVisible();
  });

  test('hiring manager US — personal, company details, reaches review', async ({ page }) => {
    const email = `e2e-hr-${Date.now()}@example.com`;

    await enterHiringManagerSignupAfterCountry(page, SIGNUP_COUNTRY.US);
    await passDocumentStubStep(page);
    await fillUsPersonalInformationAndContinue(page, email, 'company-details');
    await fillHrCompanyDetailsAndContinue(page);

    await expect(page.getByRole('checkbox', { name: /Terms and Conditions/i })).toBeVisible();
  });
});
