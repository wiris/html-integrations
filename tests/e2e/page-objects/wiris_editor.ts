import { Page, Locator, expect } from '@playwright/test'
import BasePage from './page'
import EquationEntryMode from '../enums/equation_entry_mode'
import TypingMode from '../enums/typing_mode'
import EquationEntryForm from './equation_entry_form'

class WirisEditor extends BasePage {
  private equationEntryForm: EquationEntryForm

  constructor(page: Page) {
    super(page)
    this.equationEntryForm = new EquationEntryForm(page)
  }

  get modalTitle(): Locator {
    return this.page.locator('.wrs_modal_title')
  }

  get wirisEditorWindow(): Locator {
    return this.page.locator('.wrs_content_container')
  }

  get insertButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-insert-button']")
  }

  get cancelButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-cancel-button']")
  }

  get handModeButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-key2hand-button']")
  }

  get closeButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-close-button']")
  }

  get fullScreenButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-fullscreen-enable-button']")
  }

  get exitFullScreenButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-minimize-button']")
  }

  get modalOverlay(): Locator {
    return this.page.locator('[id*=wrs_modal_overlay]')
  }

  get minimizeButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-fullscreen-disable-button']")
  }

  get mathInputField(): Locator {
    return this.page.locator('input[aria-label="Math input"]')
  }

  get confirmationDialog(): Locator {
    return this.page.locator('#wrs_popupmessage')
  }

  get confirmationDialogCancelButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-cd-cancel-button']")
  }

  get confirmationDialogCloseButton(): Locator {
    return this.page.locator("[data-testid='mtcteditor-cd-close-button']")
  }

  get handCanvas(): Locator {
    return this.page.locator('canvas.wrs_canvas')
  }

  /**
   * Checks if the wiris editor modal is open by checking for the presence of the modal window, cancel and insert buttons.
   */
  public async isOpen(): Promise<boolean> {
    return (await this.insertButton.isVisible()) && (await this.closeButton.isVisible() && (await this.wirisEditorWindow.isVisible()))
  }

  /**
   * This waits for the wiris editor modal to be open and for the cancel button to be displayed
   */
  public async waitUntilLoaded(typeMode?: TypingMode): Promise<void> {
    typeMode = typeMode ?? TypingMode.KEYBOARD
    await this.wirisEditorWindow.waitFor({ state: 'visible' })
    await this.insertButton.waitFor({ state: 'visible' })
    await this.handModeButton.waitFor({ state: 'visible' })
    await this.cancelButton.waitFor({ state: 'visible' })
    if (typeMode === TypingMode.KEYBOARD) {
      await this.mathInputField.waitFor({ state: 'visible' })
    } else {
      await this.handCanvas.waitFor({ state: 'visible' })
    }
  }

  /**
   * This waits for the wiris editor modal to be closed
   */
  public async waitUntilClosed(): Promise<void> {
    await this.wirisEditorWindow.waitFor({ state: 'hidden' })
  }

  /**
   * This performs select all and delete using Playwright keyboard, cross platform
   */
  public async deleteContents(): Promise<void> {
    await this.page.keyboard.press('Control+a')
    await this.page.keyboard.press('Delete')
  }

  /**
   * This types an equation into the edit field
   * @param keysToType This parameter specifies which keys will be typed in the editor.
   */
  public async typeEquationViaKeyboard(keysToType: string): Promise<void> {
    await this.mathInputField.click()
    await this.pause(500) // This wait is needed in order to simulate real typing
    await this.page.keyboard.type(keysToType)
    await this.pause(500) // If we don't wait, it crashes. This is typical also with a user that would type, wait a few seconds, then insert equation.
  }

  /**
   * The same as typeEquation, but this inserts the equation
   */
  public async insertEquationViaKeyboard(keysToType: string): Promise<void> {
    await this.typeEquationViaKeyboard(keysToType)
    await this.insertButton.click()
    await this.waitUntilClosed()
  }

  /**
   * @param entryMode (EquationEntryMode): This parameter specifies which mode the equation entry form will be opened in.
   * This presses ctrl shift X for MathML and L for latex to show the equation entry form.
   */
  public async showEquationEntryForm(entryMode: EquationEntryMode): Promise<void> {
    const popupPromise = this.page.waitForEvent('popup');
    switch (entryMode) {
      case EquationEntryMode.MATHML:
        await this.page.keyboard.press('Control+Shift+KeyX')
        break
      case EquationEntryMode.LATEX:
        await this.page.keyboard.press('Control+Shift+KeyL')
        break
    }
    const popup = await popupPromise;
    this.equationEntryForm = new EquationEntryForm(popup);
    expect(await this.equationEntryForm.isOpen()).toBeTruthy()
  }

  /**
   * This allows insertion of an equation by typing text into equation entry form to insert the equation. and automatically hit the insert button
   * @param text the text to type into the form
   * If the equation entry form is not open, it will open by default using MathML mode.
   */
  public async insertEquationUsingEntryForm(text: string): Promise<void> {
    await this.typeEquationUsingEntryForm(text)
    await this.pause(500) // TODO: Used to avoid click insert without formula submit, should be investigated further
    await this.insertButton.click()
    await this.waitUntilClosed()
  }

  /**
   * This allows insertion of an equation by typing text into equation entry form to insert the equation. It does not hit the insert button.
   * @param text the text to type into the form
   * If the equation entry form is not open, it will open by default using MathML mode.
   */
  public async typeEquationUsingEntryForm(text: string): Promise<void> {
    const entryFormVisible = await this.equationEntryForm.isOpen()

    if (!entryFormVisible) {
      await this.showEquationEntryForm(EquationEntryMode.MATHML)
    }

    await this.equationEntryForm.setEquation(text)
  }

  /**
   * This uses the equation entry form to get the MathML currently being used in the editor.
   * @returns a string with the MathML currently used in the rendered equation.
   */
  public async getMathML(): Promise<string> {
    const entryFormVisible = await this.equationEntryForm.isOpen()

    if (!entryFormVisible) {
      await this.showEquationEntryForm(EquationEntryMode.MATHML)
    }

    return await this.equationEntryForm.getText()
  }

  /**
   * Appends text at the bottom of the math input field. This uses the keyboard to go to the end of the edit field and append.
   * @param {string} textToInsert - The text to append.
   */
  public async appendText(textToInsert: string): Promise<void> {
    await this.mathInputField.click()
    await this.pause(500)
    await this.page.keyboard.press('End')
    await this.pause(500)
    await this.page.keyboard.type(textToInsert)
  }

  public async getMode(): Promise<TypingMode> {
    const title = await this.handModeButton.getAttribute('title')
    return title === 'Go to handwritten mode' ? TypingMode.KEYBOARD : 
           title === 'Use keyboard' ? TypingMode.HAND : 
           TypingMode.UNKNOWN
  }
}

export default WirisEditor