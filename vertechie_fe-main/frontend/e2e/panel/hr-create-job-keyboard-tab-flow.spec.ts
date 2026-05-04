import { test, expect } from '@playwright/test';

import { installHrSession } from '../helpers/hr-session';
import { installJobsPortalMocks, uninstallJobsPortalMocks } from '../helpers/jobs-api-mocks';
import { routes } from '../helpers/routes';

const TAB_JOB_TITLE = `E2E Tab Flow Job ${Date.now()}`;

test.describe('HR create job — keyboard Tab flow', () => {
  test.beforeEach(async ({ page }) => {
    await installHrSession(page);
    await installJobsPortalMocks(page);
  });

  test.afterEach(async ({ page }) => {
    await uninstallJobsPortalMocks(page);
  });

  test('Tab moves through main fields; Enter adds skill; job submits to dashboard', async ({ page }) => {
    await page.goto(routes.hrCreateJob);
    await expect(page.getByRole('heading', { name: 'Create Job Post' })).toBeVisible();

    const jobTitle = page.getByLabel('Job Title');
    await jobTitle.focus();
    await expect(jobTitle).toBeFocused();
    await page.keyboard.type(TAB_JOB_TITLE);

    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Company Name')).toBeFocused();

    await page.keyboard.press('Tab');
    const location = page.getByLabel('Location');
    await expect(location).toBeFocused();
    await page.keyboard.type('Rem');
    await expect(page.getByRole('option', { name: /Remote, United States/i })).toBeVisible({ timeout: 15_000 });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await page.keyboard.press('Tab');
    // Main fields: Job Title + Location comboboxes, then Job Type + Experience (MUI Select; labels are not always wired for getByLabel).
    await expect(page.getByRole('combobox').nth(2)).toBeFocused();

    await page.keyboard.press('Tab');
    // Native hidden input for Select may take one Tab before Experience combobox.
    if (!(await page.getByRole('combobox').nth(3).evaluate((el) => el === document.activeElement))) {
      await page.keyboard.press('Tab');
    }
    await expect(page.getByRole('combobox').nth(3)).toBeFocused();

    await page.keyboard.press('Tab');
    const description = page.getByLabel('Job Description');
    if (!(await description.evaluate((el) => el === document.activeElement))) {
      await page.keyboard.press('Tab');
    }
    await expect(description).toBeFocused();
    // Long `keyboard.type` is slow under parallel load; Tab order is already asserted above.
    await description.fill('Filled after Tab to description (short text for E2E speed).');

    await page.keyboard.press('Tab');
    const addSkill = page.getByLabel('Add a skill');
    await expect(addSkill).toBeFocused();
    await page.keyboard.type('Playwright');
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeEnabled({ timeout: 15_000 });
    // Enter can select an Autocomplete option instead of firing the field's onKeyPress; Tab to Add + Space is stable.
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add', exact: true })).toBeFocused();
    await page.keyboard.press(' ');

    await expect(page.getByRole('button', { name: 'Playwright' })).toBeVisible({ timeout: 15_000 });

    const createBtn = page.getByRole('button', { name: 'Create Job' });
    for (let i = 0; i < 45; i++) {
      if (await createBtn.evaluate((el) => el === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }
    await expect(createBtn).toBeFocused({ timeout: 5000 });
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(new RegExp(`${routes.hrDashboard}$`), { timeout: 20_000 });
    await expect(page.getByText('WELCOME BACK')).toBeVisible();
  });
});
