// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  retries: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-report-latest.json' }],
  ],
  use: {
    baseURL: 'http://localhost/app',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
