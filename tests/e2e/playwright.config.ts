import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config()

const enabledEditors = (process.env.HTML_EDITOR || '').split('|').filter(Boolean)

const createWebServer = (editor: string, port: number) => ({
  command: `yarn nx start html-${editor}`,
  port,
  reuseExistingServer: true,
})

const editorPortMap = {
  'ckeditor4': 8001,
  'ckeditor5': 8002,
  'froala': 8003,
  'tinymce5': 8004,
  'tinymce6': 8005,
  'tinymce7': 8006,
  'tinymce8': 8007,
  'generic': 8008,
}

const webServers = enabledEditors
  .filter(editor => editorPortMap[editor])
  .map(editor => createWebServer(editor, editorPortMap[editor]))

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? '80%' : undefined,
  reporter: [
    ['html', { open: process.env.CI ? 'never' : 'on-failure', outputFolder: 'playwright-report/html' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: process.env.USE_STAGING === 'TRUE' ? 'https://integrations.wiris.kitchen' : '',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: webServers,
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
