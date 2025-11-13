import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? '80%' : undefined,
  reporter: [
    ['html', { open: process.env.CI ? 'never' : 'on-failure' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://integrations.wiris.kitchen/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        permissions: ['clipboard-read', 'clipboard-write']
      }
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      }
    }
  ],
  outputDir: 'test-results',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },

})