import { test, expect } from '@playwright/test';

import { installTechieHomePanelApiMocks } from '../helpers/network-home-api-mocks';
import { routes } from '../helpers/routes';
import { installVerifiedTechieSession } from '../helpers/techie-session';

test.describe('Techie home panel (mocked API)', () => {
  test.beforeEach(async ({ page }) => {
    await installVerifiedTechieSession(page);
    await installTechieHomePanelApiMocks(page);
  });

  test.afterEach(async ({ page }) => {
    await page.unroute('**/api/v1/**');
  });

  test('feed loads with composer, mock post, and quick actions', async ({ page }) => {
    await page.goto(routes.techieHomeFeed);

    await expect(page.getByRole('heading', { name: 'Feed', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder(/Share your thoughts/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Photo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Video' })).toBeVisible();
    await expect(page.getByText('E2E Colleague')).toBeVisible();
    await expect(page.getByText('Hello from E2E mock feed.')).toBeVisible();
  });

  test('home area tabs navigate between feed, my network, groups, events, and combinator', async ({
    page,
  }) => {
    await page.goto(routes.techieHomeFeed);
    await expect(page).toHaveURL(new RegExp(`${routes.techieHomeFeed}$`));

    await page.getByRole('tab', { name: /My Network/i }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.techieHomeNetwork}$`));
    await expect(page.getByText('Find people to connect', { exact: true })).toBeVisible();

    await page.getByRole('tab', { name: /^Groups$/ }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.techieHomeGroups}$`));
    await expect(page.getByRole('heading', { name: /Discover Groups/i })).toBeVisible();

    await page.getByRole('tab', { name: /^Events$/ }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.techieHomeEvents}$`));
    await expect(page.getByRole('heading', { name: /Upcoming Events/i })).toBeVisible();
    await expect(page.getByText(/No upcoming events/i)).toBeVisible();

    await page.getByRole('tab', { name: /Combinator/i }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.techieHomeCombinator}$`));
    await expect(page.getByRole('heading', { name: '🚀 VerTechie Combinator' })).toBeVisible();

    await page.getByRole('tab', { name: /^Feed$/ }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.techieHomeFeed}$`));
    await expect(page.getByRole('heading', { name: 'Feed', exact: true })).toBeVisible();
  });
});
