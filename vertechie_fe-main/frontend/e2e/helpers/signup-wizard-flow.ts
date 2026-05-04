import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import {
  enterHiringManagerSignupAfterCountry,
  enterTechieSignupAfterCountry,
  SIGNUP_COUNTRY,
} from './register-wizard';

export { SIGNUP_COUNTRY, enterTechieSignupAfterCountry, enterHiringManagerSignupAfterCountry };

export async function clickWizardNext(page: Page) {
  await page.getByRole('button', { name: /^Next$/ }).click();
}

export async function passDocumentStubStep(page: Page) {
  await expect(page.getByTestId('e2e-document-stub')).toBeVisible({ timeout: 15_000 });
  await clickWizardNext(page);
}

export type AfterPersonalStep = 'work-experience' | 'company-details';

/** US techie / HR personal step: fills required fields (E2E skips OTP when VITE_E2E=true). */
export async function fillUsPersonalInformationAndContinue(
  page: Page,
  email: string,
  after: AfterPersonalStep,
) {
  await expect(page.getByRole('heading', { name: /Personal Information/i })).toBeVisible({
    timeout: 30_000,
  });

  await page.locator('input[name="firstName"]').fill('Etwoe');
  await page.locator('input[name="lastName"]').fill('User');
  await page.locator('input[name="profileName"]').fill('Etwoe Profile');

  const dob = page.getByLabel(/Date of Birth/i);
  await dob.fill('');
  await dob.pressSequentially('01011990');

  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="phone"]').fill('5551234567');

  await page.locator('input[name="password"]').fill('Test@Pass1');
  await page.locator('input[name="confirmPassword"]').fill('Test@Pass1');

  await page.getByLabel(/Full Address/i).fill('1 Main Street, Austin, TX 78701');
  // Close AddressAutocomplete popper if still open — it often sits above the next row and intercepts clicks.
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');

  const workAuth = page.getByRole('combobox', { name: /Work Authorization/i });
  await workAuth.scrollIntoViewIfNeeded();
  await expect(workAuth).toBeVisible({ timeout: 15_000 });
  await workAuth.click({ force: true });
  await page.getByRole('option', { name: /US Citizen/i }).click();

  await clickWizardNext(page);

  if (after === 'work-experience') {
    await expect(
      page.getByRole('heading', { level: 5, name: 'Work Experience', exact: true }),
    ).toBeVisible({ timeout: 60_000 });
  } else {
    await expect(
      page.getByRole('heading', { level: 5, name: 'Company Details', exact: true }),
    ).toBeVisible({ timeout: 60_000 });
  }
}

export async function fillOneWorkExperienceAndContinue(page: Page) {
  await page.getByRole('button', { name: /Add Experience/i }).click();
  await page.getByRole('button', { name: /Agree and Accept/i }).click();

  const dlg = page.getByRole('dialog', { name: 'Add Work Experience' });
  await expect(dlg).toBeVisible();

  await dlg.getByLabel('Company Name *').fill('E2E Software Inc');
  await dlg.getByLabel('Work Location *').fill('Remote, United States');
  await dlg.getByLabel('Job Title *').fill('Senior Engineer');

  const fromExp = dlg.getByLabel('From Date *');
  await fromExp.fill('');
  await fromExp.pressSequentially('06012018');

  await dlg.getByRole('checkbox', { name: /Currently Working Here/i }).check();

  await dlg.getByRole('button', { name: /^Add Skill$/ }).click();
  const skillDlg = page.getByRole('dialog', { name: /Add Skill Details/i });
  await skillDlg.getByLabel('Skill Name *').fill('TypeScript');
  await skillDlg
    .getByLabel(/What exactly did you do with this skill/i)
    .fill('Built signup flows and API integration tests for the product.');
  await skillDlg.getByRole('button', { name: 'Add Skill' }).click();

  await dlg.getByLabel('Job Description *').click();
  await page.getByRole('button', { name: /I Understand & Agree/i }).click();
  await dlg
    .getByLabel('Job Description *')
    .fill('Implemented full stack features including React forms and REST clients end to end.');

  await dlg.getByLabel(/^Manager Name/i).fill('Jane');
  await dlg.getByLabel(/Manager Domain Email/i).fill('jane@e2esoftware.example');
  await dlg.getByLabel(/^Manager Phone Number/i).fill('5559876543');

  await dlg.getByRole('button', { name: /^Save$/ }).click();
  await expect(dlg).toBeHidden({ timeout: 30_000 });

  await clickWizardNext(page);
  await expect(
    page.getByRole('heading', { level: 5, name: 'Education Details', exact: true }),
  ).toBeVisible({ timeout: 30_000 });
}

export async function fillOneEducationAndContinue(page: Page) {
  await page.getByRole('button', { name: /Add Education/i }).click();
  const dlg = page.getByRole('dialog', { name: 'Add Education' });
  await expect(dlg).toBeVisible();

  await dlg.getByLabel('Institution Name *').fill('E2E University');
  await dlg.getByRole('combobox', { name: /Level of Education/i }).click();
  await page.getByRole('option', { name: /^Bachelors$/ }).click();
  await dlg.getByLabel('Field of Study *').fill('Computer Science');
  await dlg.locator('input[name="scoreValue"]').fill('8.5');

  const fromEdu = dlg.getByLabel('From Date *');
  await fromEdu.fill('');
  await fromEdu.pressSequentially('09012016');
  const toEdu = dlg.getByLabel('To Date *');
  await toEdu.fill('');
  await toEdu.pressSequentially('05012020');

  await dlg.getByRole('button', { name: /^Save$/ }).click();
  await expect(dlg).toBeHidden({ timeout: 30_000 });

  await clickWizardNext(page);
  await expect(page.getByRole('heading', { name: /Review & Submit/i })).toBeVisible({ timeout: 30_000 });
}

export async function fillHrCompanyDetailsAndContinue(page: Page) {
  await expect(
    page.getByRole('heading', { level: 5, name: 'Company Details', exact: true }),
  ).toBeVisible({ timeout: 60_000 });
  // UI label is "+ Add Company" (plus in accessible name)
  await page.locator('main').getByRole('button', { name: /Add Company/ }).click();

  const dlg = page.getByRole('dialog', { name: 'Add Company Details' });
  await expect(dlg).toBeVisible();
  await dlg.getByLabel(/Hiring Company Name/i).fill('E2E Hiring Company');
  await dlg.getByLabel(/Hiring Company Email ID/i).fill('team@e2e-hiring.example.com');
  await dlg.getByLabel(/Hiring Company Website URL/i).fill('https://e2e-hiring.example.com');
  await dlg.getByRole('button', { name: /^Save$/ }).click();
  await expect(dlg).toBeHidden({ timeout: 30_000 });

  await clickWizardNext(page);
  await expect(page.getByRole('heading', { name: /Review & Submit/i })).toBeVisible({ timeout: 30_000 });
}
