import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.resolve(__dirname, '.env')})

const enabledEditors = (process.env.HTML_EDITOR || '').split('|').filter(Boolean)

const createWebServer = (editor: string, port: number) => ({
  command: `yarn nx start html-${editor}`,
  port,
  reuseExistingServer: true,
  setTimeout: 30_000
})

// Map of editors to their ports, defined in their corresponding demo's webpack.config.js file
const editorPortMap = {
  'ckeditor4': 8001,
  'ckeditor5': 8002,
  'froala': 8003,
  'tinymce5': 8004,
  'tinymce6': 8005,
  'tinymce7': 8006,
  'tinymce8': 8007,
  'generic': 8007,
}

// Creates web servers only for enabled editors in the HTML_EDITOR env variable
const webServers = enabledEditors
  .filter(editor => editorPortMap[editor as keyof typeof editorPortMap])
  .map(editor => createWebServer(editor, editorPortMap[editor as keyof typeof editorPortMap]))

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: process.env.CI ? 'never' : 'on-failure', outputFolder: 'playwright-report/html' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    process.env.CI ? ['github'] : ['list'],
  ],
  use: {
    baseURL: process.env.USE_STAGING === 'true' ? 'https://integrations.wiris.kitchen' : '',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: process.env.USE_STAGING === 'true' ? undefined : webServers,
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
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
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
