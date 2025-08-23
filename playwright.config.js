import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Set baseURL from env or fallback
const baseURL = process.env.BASE_URL || 'https://template.postman-echo.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'API Tests',
      testDir: './tests/api',
      testMatch: /.*\.spec\.(js|ts)$/,
      use: {
        baseURL,
      },
    },
    {
      name: 'UI - Chromium',
      testDir: './tests/ui',
      testMatch: /.*\.spec\.(js|ts)$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL,
      },
    },
    // You can add more browser projects here (e.g., Firefox, WebKit)
  ],
});
