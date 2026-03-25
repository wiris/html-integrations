import { Page, Locator, expect } from '@playwright/test'
import BasePage from './page'

class EquationEntryForm extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  get editField(): Locator {
    return this.page.locator('textarea')
  }

  get submitButton(): Locator {
    return this.page.locator('input[type="submit"]')
  }

  public async isOpen(): Promise<boolean> {
    const context = this.page.context()
    const pages = context.pages()
    if (pages.length !== 2) return false;
    const editAreaVisible = await this.editField.isVisible()
    const submitButtonVisible = await this.submitButton.isVisible()
    return submitButtonVisible && editAreaVisible
  }

  public async setEquation(text: string): Promise<void> {
    await this.editField.fill(text)
    const closePromise = this.page.waitForEvent('close')
    await this.submitButton.click({ force: true }).catch(() => {}) // Ignore any errors from closing the popup
    await closePromise
  }

  public async getText(): Promise<string> {
    await expect(async () => {
      const text = await this.editField.inputValue()
      expect(text).not.toBe('')
    }).toPass({ timeout: 5000 })

    const text = await this.editField.inputValue()
    await this.submitButton.click()

    return text
  }
}

export default EquationEntryForm