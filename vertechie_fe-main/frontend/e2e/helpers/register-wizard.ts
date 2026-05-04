import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { routes } from './routes';

/** Display names from `Signup.tsx` country cards (`Select {name} as your country`). */
export const SIGNUP_COUNTRY = {
  US: 'United States',
  IN: 'India',
} as const;

/** Techie signup (US/IN/UK): document → personal → work → education → review */
export const TECHIE_FULL_STEP_LABELS = [
  'Document Verification',
  'Personal Information',
  'Work Experience',
  'Education Details',
  'Review & Submit',
] as const;

/** Hiring manager: document → personal → company → review */
export const HR_FULL_STEP_LABELS = [
  'Document Verification',
  'Personal Information',
  'Company Details',
  'Review & Submit',
] as const;

export async function openSignup(page: Page) {
  await page.goto(routes.signup);
}

export async function selectTechieRole(page: Page) {
  await page.getByRole('button', { name: /Select Tech Professional role/i }).click();
}

export async function selectHiringManagerRole(page: Page) {
  await page.getByRole('button', { name: /Select Hiring Manager role/i }).click();
}

/** Country cards use `role="button"` + aria-label: `Select {Full Name} as your country` */
export async function selectCountryByFullName(page: Page, countryFullName: string) {
  await page
    .getByRole('button', { name: new RegExp(`Select ${escapeRegExp(countryFullName)} as your country`, 'i') })
    .click();
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Flow header uses `getCountryName(location)` — US/IN/UK map cleanly; CA/DE use code in UI. */
export async function enterTechieSignupAfterCountry(page: Page, countryFullName: string) {
  await openSignup(page);
  await selectTechieRole(page);
  await selectCountryByFullName(page, countryFullName);
}

export async function enterHiringManagerSignupAfterCountry(page: Page, countryFullName: string) {
  await openSignup(page);
  await selectHiringManagerRole(page);
  await selectCountryByFullName(page, countryFullName);
}

/** Top flow title is `Typography variant="h4"` (not document `h5` subheads). */
export async function expectFlowHeader(page: Page, expectedHeading: string) {
  await expect(
    page.getByRole('heading', { level: 4, name: expectedHeading, exact: true }),
  ).toBeVisible();
}

/** Stepper captions use full step labels from `stepConfig`. */
export async function expectStepperIncludes(page: Page, labels: readonly string[]) {
  for (const label of labels) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }
}
