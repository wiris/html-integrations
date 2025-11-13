import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()

for (const editorName of editors) {
  test.describe(`Editor functionality - ${editorName} editor`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    test.describe('Undo and Redo', () => {
      const isKnownIssue = editorName === 'generic';
      test(`MTHTML-78 Undo and redo math formula with ${editorName} editor`, { tag: isKnownIssue ? ['@knownissue'] : [] } , async ({ page }) => {
        test.fail(isKnownIssue, 'Known issue: generic editors fails to undo equation');

        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(Toolbar.MATH)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
        await editor.waitForEquation(Equations.singleNumber)

        await editor.undo()
        if ((await editor.getEquations()).length === 0) {
          await editor.redo()
        }
        const isEquationRedone = ((await editor.getEquations()).length === 1)
        expect(isEquationRedone).toBeTruthy()
      })
    })

    test.describe('Resize', () => {
      test(`MTHTML-22 Formulas cannot be resized ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(Toolbar.MATH)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.insertEquationUsingEntryForm(Equations.OnePlusOne.mathml)
        await editor.waitForEquation(Equations.OnePlusOne)

        const sizeBefore = await editor.getImageSize(Equations.OnePlusOne)
        await editor.resizeImageEquation(Equations.OnePlusOne)
        const sizeAfter = await editor.getImageSize(Equations.OnePlusOne)

        const sameSize = sizeBefore?.height === sizeAfter?.height && sizeBefore?.width === sizeAfter?.width
        expect(sameSize).toBeTruthy()
      })
    })

    test.describe('Source code', () => {
      test(`MTHTML-87 Edit source code of a math formula with ${editorName} editor`, async ({ page }) => {
        const { editor } = await setupEditor(page, editorName)
        
        // Skip test if editor doesn't support source code editing
        const hasSourceCodeButton = editor.getSourceCodeEditorButton !== undefined
        test.skip(!hasSourceCodeButton, `Source code editing not supported for ${editorName}`)
        
        await editor.open()
        await editor.clear()
        //await editor.openWirisEditor(Toolbar.MATH) TODO: review if we want to open the wiris editor first, fails tests in some editors
        await editor.clickSourceCodeEditor()
        await editor.typeSourceText('<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>1</mn><mo>+</mo><mn>1</mn></math>')
        await editor.clickSourceCodeEditor()
        const sourceCodeEquation = await editor.getEquations()
        expect(sourceCodeEquation[0].altText).toBe('1 plus 1')
      })
    })

    test.describe('Styled text', () => {
      test(`MTHTML-79 Validate formula insertion after typing text that contains styles: ${editorName} editor`, async ({ page }) => {
        test.fixme((editorName === 'generic') && test.info().project.name === 'firefox', `Ctrl+B and Ctrl+I not working for generic editor on Firefox`)
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.clear()
        const textBeginning = 'Text_Beginning'
        const textEnd = 'Text_End' // The text with spaces brings some errors since the keys are sent without spaces

        await editor.applyStyle() // TODO: not applying style in generic editor on firefox, ctrl+B opens bookmarks menu and ctrl+I opens page info
        await page.keyboard.type(textBeginning)
        await editor.openWirisEditor(Toolbar.MATH)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.insertEquationUsingEntryForm(Equations.OnePlusOne.mathml)
        await editor.waitForEquation(Equations.OnePlusOne)

        await page.keyboard.type(textEnd)

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
        expect(isEquationPresent).toBeTruthy()

        const isTextBeginningBoldAndItalic = await editor.isTextBoldAndItalic(textBeginning)
        expect(isTextBeginningBoldAndItalic).toBeTruthy()

        const isTextEndBoldAndItalic = await editor.isTextBoldAndItalic(textEnd)
        expect(isTextEndBoldAndItalic).toBeTruthy()
      })
    })

    test.describe('Text Alignment', () => {
      test(`MTHTML-23 Validate formula alignment: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.clear()
        await page.keyboard.type('___')
        await editor.openWirisEditor(Toolbar.MATH)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.insertEquationUsingEntryForm(Equations.OnePlusOne.mathml)
        await editor.waitForEquation(Equations.OnePlusOne)
        await page.keyboard.type('___')

        await editor.checkElementAlignment()
        // Note: Playwright doesn't have a direct equivalent to visual comparison
        // TODO: This would need to be implemented using screenshot comparison libraries
      })
    })
  })
}