import { Page, Locator, expect, FrameLocator } from '@playwright/test'
import Toolbar from '../enums/toolbar'
import type Equation from '../interfaces/equation'
import BasePage from './page'
import page from './page'

/**
 * Abstract class used in each of the HTML editors which includes the methods for all the editors, and specifies the properties each editor needs.
 */
export default abstract class BaseEditor extends BasePage {
  protected readonly abstract wirisEditorButtonMathType: string
  protected readonly abstract wirisEditorButtonChemType: string
  protected readonly abstract name: string
  protected readonly abstract editField: string
  protected readonly iframe?: string

  constructor(page: Page) {
    super(page)
  }

  public getName(): string {
    return this.name
  }

  public getIframe(): string | undefined {
    return this.iframe
  }

  /**
   * Constructs the URL for the specific editor and opens it in the browser.
   * @returns {Promise<string>} The URL of the opened editor. **/
  public async open(): Promise<string> {
    const isStaging = process.env.USE_STAGING === 'true'

    let url: string

    if (isStaging) {
      url = `${process.env.TEST_BRANCH}/html/${this.getName()}/`
    } else {
      // Use localhost with each editor's corresponding port
      const editorPortMap = {
        'ckeditor4': 8001,
        'ckeditor5': 8002,
        'froala': 8003,
        'tinymce5': 8004,
        'tinymce6': 8005,
        'tinymce7': 8006,
        'generic': 8008,
      }

      const port = editorPortMap[this.getName() as keyof typeof editorPortMap]
      if (!port) {
        throw new Error(`No port mapping found for editor: ${this.getName()}`)
      }

      url = `http://localhost:${port}/`
    }

    await this.page.goto(url)
    await this.page.waitForLoadState('domcontentloaded')
    return this.page.url()
  }

  /**
   * Opens the Wiris editor based on a provided toolbar type.
   * @param {Toolbar} toolbar - The type of the toolbar to open, either Math or Chemistry.
   */
  public async openWirisEditor(toolbar: Toolbar): Promise<void> {
    switch (toolbar) {
      case Toolbar.CHEMISTRY:
        await this.page.locator(this.wirisEditorButtonChemType).waitFor({ state: 'visible' })
        await this.page.locator(this.wirisEditorButtonChemType).hover()
        await this.page.locator(this.wirisEditorButtonChemType).click()
        break
      default:

        await this.page.locator(this.wirisEditorButtonMathType).waitFor({ state: 'visible' })
        await this.page.locator(this.wirisEditorButtonMathType).hover()
        await this.page.locator(this.wirisEditorButtonMathType).click()
        break
    }
  }

  /**
   * Opens the source code editor
   */
  public async clickSourceCodeEditor(): Promise<void> {
    const sourceCodeButton = this.getSourceCodeEditorButton?.()
    if (sourceCodeButton) {
      await this.page.locator(sourceCodeButton).waitFor({ state: 'visible' })
      await this.page.locator(sourceCodeButton).click()
    }
  }

  public async typeSourceText(text: string): Promise<void> {
    const sourceCodeEditField = this.getSourceCodeEditField?.()
    if (!sourceCodeEditField) {
      throw new Error('Source code edit field selector is not defined.')
    }
    await this.page.locator(sourceCodeEditField).waitFor({ state: 'visible' })
    await this.page.locator(sourceCodeEditField).click()
    await this.pause(500)
    await this.page.keyboard.type(text)
  }

  /**
   * Retrieves all equations from the editor using the alt text and data-mathml DOM attributes.
   * @returns {Promise<Equation[]>} Array of equation interface.
   */
  public async getEquations(): Promise<Equation[]> {
    let frameOrPage: Page | FrameLocator
    if (this.iframe) {
      frameOrPage = this.page.frameLocator(this.iframe)
    } else {
      frameOrPage = this.page
    }

    await this.page.waitForTimeout(500)

    const equationsInEditor = await frameOrPage.locator(`${this.editField} img[alt][data-mathml]`)
    const count = await equationsInEditor.count()
    const equations: Equation[] = []

    for (let i = 0; i < count; i++) {
      const equation = equationsInEditor.nth(i)
      const altText = await equation.getAttribute('alt') || ''
      const mathml = await equation.getAttribute('data-mathml') || ''
      equations.push({ altText, mathml })
    }

    return equations
  }

  /**
   * Waits for a specific equation to appear in the editor.
   * @param {Equation} equation - The equation to wait for.
   */
  public async waitForEquation(equation: Equation): Promise<void> {
    await expect(async () => {
      const equations = await this.getEquations()
      expect(equations.some((eq) => eq.altText === equation.altText)).toBeTruthy()
    }).toPass({ timeout: 10000 })
  }

  /**
   * Gets a locator for the equation element within the DOM.
   * @param {Equation} equation - The equation to find in the DOM.
   * @returns {Locator} The Playwright locator representing the equation.
   */
  public getEquationElement(equation: Equation): Locator {
    if (this.iframe) {
      return this.page.frameLocator(this.iframe).locator(`${this.editField} img[alt="${equation.altText}"]`)
    }

    return this.page.locator(`${this.editField} img[alt="${equation.altText}"]`)
  }

  /**
   * Clicks on an element for a specified number of times. The reason for this function is to handle the iframe switching. Used for elements belonging to the editor.
   * @param {Locator} elementToClick - The element to click on.
   * @param {number} [numberOfTimes=1] - The number of times to click on the element.
   */
  public async clickElement(elementToClick: Locator, numberOfTimes: number = 1): Promise<void> {
    switch (numberOfTimes) {
      case 1:
        await elementToClick.click()
        break
      case 2:
        await elementToClick.dblclick()
        break
      default:
        for (let i = 0; i < numberOfTimes; i++) {
          await elementToClick.click()
          await this.pause(500)
        }
        break
    }
  }

  /**
   * Focuses the editing field within the editor.
   */
  public async focus(): Promise<void> {
    let editFieldLocator: Locator

    if (this.iframe) {
      editFieldLocator = this.page.frameLocator(this.iframe).locator(this.editField)
    } else {
      editFieldLocator = this.page.locator(this.editField)
    }
    await editFieldLocator.click()
    await this.pause(1000)
  }

  /**
   * Appends text at the bottom of the editor field. This uses the keyboard to go to the end of the edit field and append.
   * @param {string} textToInsert - The text to append.
   */
  public async appendText(textToInsert: string): Promise<void> {
    await this.focus()

    await this.page.keyboard.press('Control+End')
    await this.pause(500)
    await this.page.keyboard.type(textToInsert)
  }

  /**
   * Open the wiris Editor to edit the last item inserted
   * Uses selectItemAtCursor, but that's not compatible with froala, so in that case does a click in the contextual toolbar
   * @param {Toolbar} toolbar - toolbar of the test
   */
  public async openWirisEditorForLastInsertedFormula(toolbar: Toolbar, equation: Equation): Promise<void> {
    const isFroala = this.getName() === 'froala'

    if (isFroala) {
      const equationElement = this.getEquationElement(equation)
      await equationElement.click()

      const mathTypeButton = this.getContextualToolbarMathTypeButton?.()
      if (mathTypeButton) {
        await this.page.locator(mathTypeButton).click()
      }
    } else {
      await this.selectItemAtCursor()
      await this.openWirisEditor(toolbar)
    }
  }

  /**
   * Selects the item at the current cursor position within the editor. This uses shift + the left arrow key to select.
   */
  public async selectItemAtCursor(): Promise<void> {
    await this.page.keyboard.press('Shift+ArrowLeft')
  }

  /**
   * This gets all the text in the editor field
   * @returns boolean indicating if text appears after equation
   */
  public async isTextAfterEquation(typedText: string, altTextEquation: string): Promise<boolean> {
    let frameOrPage: Page | FrameLocator
    if (this.iframe) {
      frameOrPage = this.page.frameLocator(this.iframe)
    } else {
      frameOrPage = this.page
    }

    const html = await frameOrPage.locator(this.editField).innerHTML()
    const indexText = html.indexOf(typedText)
    const indexEquation = html.indexOf(altTextEquation)

    return indexEquation < indexText
  }

  /**
   * This gets all the latex equations $$ expression $$ from the edit field
   * It then trims whitespaces at beginning and end,
   * and replaces instances of $$ for blank text so as to get only the latex.
   * @returns an array of strings containing latex equations or undefined if there are none
   */
  public async getLatexEquationsInEditField(): Promise<string[] | undefined> {
    let frameOrPage: Page | FrameLocator
    if (this.iframe) {
      frameOrPage = this.page.frameLocator(this.iframe)
    } else {
      frameOrPage = this.page
    }

    const textContents = await frameOrPage.locator(this.editField).textContent()

    if (!textContents) {
      return undefined
    }

    const expressions = textContents.match(/\$\$.*?\$\$/g)?.map((latexEquation) => latexEquation.trim().replaceAll('$$', ''))

    return expressions
  }

  public async waitForLatexExpression(latexExpression: string): Promise<void> {
    await expect(async () => {
      const latexEquations = await this.getLatexEquationsInEditField()
      expect(latexEquations?.some((eq: string) => eq === latexExpression)).toBeTruthy()
    }).toPass({ timeout: 10000 })
  }

  public async copyAllEditorContent(): Promise<void> {
    await this.focus()
    await this.page.keyboard.press('Control+a')
    await this.setClipboardText('')
    await this.pause(500)
    await this.page.keyboard.press('Control+c')
  }

  public async cutAllEditorContent(): Promise<void> {
    await this.focus()
    await this.page.keyboard.press('Control+a')
    await this.setClipboardText('')
    await this.pause(500)
    await this.page.keyboard.press('Control+x')
  }

  async setClipboardText(text: string): Promise<void> {
    await this.page.evaluate(async (t) => {
      await (globalThis as any).navigator.clipboard.writeText(t);
    }, text);
  }

  public async dragDropLastFormula(equation: Equation): Promise<void> {
    await this.focus()

    const equationElement = this.getEquationElement(equation)
    let editDivElement: Locator

    if (this.iframe) {
      editDivElement = this.page.frameLocator(this.iframe).locator(this.editField)
    } else {
      editDivElement = this.page.locator(this.editField)
    }

    const equationBox = await equationElement.boundingBox()
    const editDivBox = await editDivElement.boundingBox()

    if (equationBox && editDivBox) {
      await this.page.mouse.move(equationBox.x + equationBox.width / 2, equationBox.y + equationBox.height / 2)
      //await this.page.mouse.click(equationBox.x + equationBox.width / 2, equationBox.y + equationBox.height / 2)
      await this.pause(500)
      await this.page.mouse.down()
      await this.pause(500)
      await this.page.mouse.move(editDivBox.x, editDivBox.y)
      await this.pause(500)
      await this.page.mouse.up()
    }
  }

  public async paste(): Promise<void> {
    await this.focus()
    await this.page.keyboard.press('Control+v')
  }

  public async undo(): Promise<void> {
    await this.focus()
    await this.page.keyboard.press('Control+z')
  }

  public async redo(): Promise<void> {
    await this.focus()
    await this.page.keyboard.press('Control+Shift+z')
  }

  public async clear(): Promise<void> {
    await this.focus()
    if (this.iframe) { await this.focus() } // avoids failing to clear in ckeditor4 if not focused
    await this.page.keyboard.press('Control+a')
    await this.pause(500)
    await this.page.keyboard.press('Delete')
  }

  public async isEditorCleared(): Promise<boolean> {
    let frameOrPage: Page | FrameLocator
    if (this.iframe) {
      frameOrPage = this.page.frameLocator(this.iframe)
    } else {
      frameOrPage = this.page
    }

    await this.pause(1000)

    const element = frameOrPage.locator(this.editField)
    const rawText = (await element.textContent()) ?? ''
    const normalized = rawText.replace(/[\s\uFEFF\xA0]+/g, '')
    const noTextInEditor = normalized === ''
    const equationElements = frameOrPage.locator(`${this.editField} img`)
    const noEquationsInEditor = (await equationElements.count()) === 0

    return noEquationsInEditor && noTextInEditor
  }

  public async getImageSize(equation: Equation): Promise<{ width: number; height: number } | null> {
    await this.focus()

    const equationElement = this.getEquationElement(equation)
    return await equationElement.boundingBox()
  }

  public async resizeImageEquation(equation: Equation): Promise<void> {
    await this.focus()

    const equationElement = this.getEquationElement(equation)
    await equationElement.click()

    const box = await equationElement.boundingBox()
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await this.pause(500)
      await this.page.mouse.down()
      await this.pause(500)
      await this.page.mouse.move(box.x - 10, box.y - 10)
      await this.pause(500)
      await this.page.mouse.up()
      }
    }

  public async applyStyle(): Promise<void> {
    await this.focus()
    await this.page.keyboard.press('Control+b') // Bold
    await this.pause(500)
    await this.page.keyboard.press('Control+i') // Italic
  }

  public async isTextBoldAndItalic(text: string): Promise<boolean> {
    await this.focus()

    let frameOrPage: Page | FrameLocator
    if (this.iframe) {
      frameOrPage = this.page.frameLocator(this.iframe)
    } else {
      frameOrPage = this.page
    }

    const isCkeditor5 = this.getName() === 'ckeditor5'
    if (isCkeditor5) {
      await this.page.keyboard.press('Enter')
      await this.pause(500)
      await this.page.keyboard.press('Backspace')
    }

    const elements = frameOrPage.locator(`${this.editField} >> text="${text}"`)
    const count = await elements.count()

    for (let i = 0; i < count; i++) {
      const element = elements.nth(i)
      const fontWeight = await element.evaluate((el) => (globalThis as any).getComputedStyle(el).fontWeight)
      const fontStyle = await element.evaluate((el) => (globalThis as any).getComputedStyle(el).fontStyle)

      const isBold = parseInt(fontWeight) >= 700
      const isItalic = fontStyle === 'italic'

      if (isBold && isItalic) {
        return true
      }
    }

    return false
  }

  public async moveCaret(): Promise<void> {
    await this.focus()
    for (let i = 0; i < 8; i++) {
      await this.page.keyboard.press('ArrowLeft')
    }
  }

  public async checkElementAlignment(): Promise<void> {
    await this.focus()

    let editContent: Locator

    if (this.iframe) {
      editContent = this.page.frameLocator(this.iframe).locator(this.editField)
    } else {
      editContent = this.page.locator(this.editField)
    }

    // Take screenshot for visual comparison
    await editContent.screenshot({
      path: `screenshots/${this.getName()}_alignment.png`
    })
  }

  public getContextualToolbarMathTypeButton?(): string

  public getContextualToolbarChemTypeButton?(): string

  public getSourceCodeEditorButton?(): string

  public getSourceCodeEditField?(): string
}
