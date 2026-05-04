import { test, expect } from '@playwright/test';

import { installTechieHomePanelApiMocks } from '../helpers/network-home-api-mocks';
import { routes } from '../helpers/routes';
import { installVerifiedTechieSession } from '../helpers/techie-session';

test.describe('Techie home tabs — data and interactions (mocked API)', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await installVerifiedTechieSession(page);
    await installTechieHomePanelApiMocks(page, 'interactions');
  });

  test.afterEach(async ({ page }) => {
    await page.unroute('**/api/v1/**');
  });

  test('Feed: like via picker, comment, save, create post, repost', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto(routes.techieHomeFeed);

    const postCard = page.locator('#post-e2e-post-1');

    await postCard.getByRole('button', { name: 'Like' }).click();
    await page.getByRole('menuitem', { name: 'Like' }).click();
    await expect(postCard.getByText(/1 likes/)).toBeVisible();

    await postCard.locator('button.MuiIconButton-root').nth(1).click();
    await expect(page.getByRole('alert').filter({ hasText: /Post saved/i })).toBeVisible();

    await postCard.getByRole('button', { name: 'Comment' }).click();
    await postCard.getByPlaceholder('Write a comment...').fill('Nice work on this update team.');
    await postCard.getByRole('button', { name: 'Post', exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: /Comment added/i })).toBeVisible();

    await page.getByPlaceholder(/Share your thoughts/i).click();
    await page.getByRole('dialog', { name: 'Create a Post' }).getByPlaceholder('What do you want to talk about?').fill(
      'Sharing an E2E update about our product quality, automation, and release confidence for the whole team.',
    );
    await page.getByRole('dialog', { name: 'Create a Post' }).getByRole('button', { name: 'Post', exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: /Post created successfully/i })).toBeVisible();
    await expect(
      page.getByText(/Sharing an E2E update about our product quality/i),
    ).toBeVisible();

    await postCard.getByRole('button', { name: 'Repost' }).click();
    await expect(page.getByRole('alert').filter({ hasText: /reposted/i })).toBeVisible();
  });

  test('My Network: shows connection from API and send connect from Find people', async ({ page }) => {
    await page.goto(routes.techieHomeNetwork);

    await expect(page.getByText('1 Connections')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('Peer User')).toBeVisible();

    await page.getByRole('button', { name: 'Connect' }).nth(1).click();
    await expect(page.getByRole('button', { name: 'Pending' }).first()).toBeVisible({ timeout: 10_000 });
  });

  test('Groups: list renders and Join succeeds', async ({ page }) => {
    await page.goto(routes.techieHomeGroups);

    await expect(page.getByRole('heading', { name: 'E2E Builders Club' })).toBeVisible();
    await page.getByRole('button', { name: 'Join', exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: /Joined group successfully/i })).toBeVisible();
  });

  test('Events: list renders and Register succeeds', async ({ page }) => {
    await page.goto(routes.techieHomeEvents);

    await expect(page.getByRole('heading', { name: 'E2E Future Webinar' })).toBeVisible();
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByRole('alert').filter({ hasText: /Registered for event/i })).toBeVisible();
  });

  test('Combinator: idea card and Connect succeeds', async ({ page }) => {
    await page.goto(routes.techieHomeCombinator);

    await expect(page.getByText('EcoTrack for cities')).toBeVisible();
    await page.getByRole('button', { name: 'Connect' }).last().click();
    await expect(page.getByRole('alert').filter({ hasText: /Connection request sent/i })).toBeVisible();
  });
});
