// @ts-check
import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// ✅ Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, ".env") });

/**
 * Playwright Configuration
 * - Splits API & UI tests
 * - Loads BASE_URL from .env
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // ✅ Reporters
  reporter: [["list"], ["html", { open: "never" }]],

  // ✅ Default "use" for all tests
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },

  // ✅ Projects split: API vs UI
  projects: [
    {
      name: "API Tests",
      testDir: "./tests/api", // explicitly look into api folder
      testMatch: /.*\.spec\.(js|ts)$/, // run both JS & TS
      use: {
        baseURL: process.env.BASE_URL || "http://localhost:3000",
      },
    },
    {
      name: "chromium",
      testDir: "./tests/ui",
      testMatch: /.*\.spec\.(js|ts)$/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      testDir: "./tests/ui",
      testMatch: /.*\.spec\.(js|ts)$/,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      testDir: "./tests/ui",
      testMatch: /.*\.spec\.(js|ts)$/,
      use: { ...devices["Desktop Safari"] },
    },
  ],
});
