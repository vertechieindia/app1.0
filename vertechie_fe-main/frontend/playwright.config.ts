/// <reference types="node" />
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, devices } from '@playwright/test';

/** Directory containing this config (stable when run from repo root via re-export). */
const configDir = path.dirname(fileURLToPath(import.meta.url));

/** Separate from default Vite 5173 so Playwright can always spawn a server with E2E env while dev runs elsewhere. */
const PLAYWRIGHT_DEV_PORT = 5174;
const baseURL = `http://localhost:${PLAYWRIGHT_DEV_PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: path.join(configDir, 'e2e'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /** HTML report is written under `vertechie_fe-main/frontend/playwright-report/` (next to this config), not repo root. */
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: path.join(configDir, 'playwright-report'),
        open: 'never',
      },
    ],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    /** Parallel panel E2E can stress the single Vite webServer; avoid flaky timeouts. */
    navigationTimeout: 60_000,
    actionTimeout: 25_000,
  },
  /** Default test timeout (ms); long HR + techie flows override locally where needed. */
  timeout: 60_000,

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: `npm run dev -- --port ${PLAYWRIGHT_DEV_PORT}`,
    url: baseURL,
    cwd: configDir,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    /** Document stub + OTP bypass for signup E2E (`E2EDocumentStubStep`, `useOTPVerification`). */
    env: { ...process.env, VITE_E2E: 'true' },
  },
});
