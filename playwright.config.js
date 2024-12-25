// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'reports/playwright-report', open: 'never' }]
  ],

  use: {
    trace: 'on-first-retry',
    launchOptions: {
      args: ["--start-maximized"],
    }
  },

  // Disable last-run.json generation
  preserveOutput: 'never',

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
