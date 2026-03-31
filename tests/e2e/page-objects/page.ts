import { Page } from '@playwright/test'

export default class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Wait for a specific amount of time
   */
  async pause(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds)
  }

  public async press(key: string): Promise<void> {
    await this.page.keyboard.press(key)
  }

  public async type(text: string): Promise<void> {
    await this.page.keyboard.type(text)
  }
}
