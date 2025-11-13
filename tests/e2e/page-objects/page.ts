import { Page } from '@playwright/test'

export default class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name?: string): Promise<Buffer> {
    return await this.page.screenshot({ 
      fullPage: true,
      path: name ? `screenshots/${name}.png` : undefined
    })
  }

  /**
   * Wait for a specific amount of time
   */
  async pause(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds)
  }
}