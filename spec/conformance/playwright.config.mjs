// Eureka conformance suite configuration.
//
// CONFORMANCE_TARGET selects the implementation under test:
//   v2  (default) the Eureka 2.0 build in client/build, served by the fixture server
//   v3  the v3 element demo page (not yet available)
// Requirements the baseline is known not to meet are skipped per test with
// `v3only()`; axe violations are reported but only fail for v3.
import { defineConfig, devices } from '@playwright/test';

export const TARGET = process.env.CONFORMANCE_TARGET ?? 'v2';
const PORT = Number(process.env.PORT ?? 3101);
const targets = {
  v2: { args: '--static ../../client/build --nojs ../fixtures/snapshots/v2-nojs-table.html' },
  v3: { args: '--static ../../packages/element/demo --render v3' }
};
const t = targets[TARGET];

export default defineConfig({
  testDir: './tests',
  outputDir: 'results/artifacts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 20000,
  expect: { timeout: 5000 },
  reporter: [['list'], ['html', { outputFolder: 'results/html', open: 'never' }], ['json', { outputFile: `results/${TARGET}.json` }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'en-US',
    timezoneId: 'UTC'
  },
  webServer: {
    command: `node fixture-server.mjs --port ${PORT} ${t.args}`,
    url: `http://localhost:${PORT}/__fixtures/listings`,
    reuseExistingServer: true,
    timeout: 10000
  },
  projects: [
    {
      name: 'level0',
      testMatch: /level0\/.*\.spec\.mjs/,
      use: { ...devices['Desktop Chrome'], javaScriptEnabled: false }
    },
    {
      name: 'enhanced',
      testMatch: /(level1|level2)\/.*\.spec\.mjs/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'enhanced-narrow',
      testMatch: /level1\/layout\.spec\.mjs/,
      use: { ...devices['Pixel 7'] }
    }
  ]
});
