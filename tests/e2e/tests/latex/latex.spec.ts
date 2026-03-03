import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import EquationEntryMode from '../../enums/equation_entry_mode'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()

for (const editorName of editors) {
  test.describe(`LaTeX - ${editorName} editor`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    test(`Validate LaTeX formula detection: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.appendText('$$ ' + Equations.squareRootY.latex + '$$')

      await editor.selectItemAtCursor()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertButton.click()
      await editor.waitForLatexExpression('\\sqrt y')

      const latexEquations = await editor.getLatexEquationsInEditField()
      expect(latexEquations).toContain('\\sqrt y')
    })

    test(`Insert formula using LaTeX equation entry form: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.showEquationEntryForm(EquationEntryMode.LATEX)
      await wirisEditor.insertEquationUsingEntryForm(Equations.squareRootY.latex ?? (() => { throw new Error('LaTeX equation is undefined') })())
      await wirisEditor.pause(500) // Wait for the equation to be processed
      await editor.waitForEquation(Equations.squareRootY)

      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.squareRootY.altText)
      expect(isEquationPresent).toBeTruthy()
    })

    test(`@smoke MTHTML-10 Edit LaTeX equation: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.appendText('$$ ' + Equations.squareRootY.latex + '$$')
      await editor.selectItemAtCursor()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.appendText('+5')
      await wirisEditor.pause(500)
      await wirisEditor.insertButton.click()
      await wirisEditor.waitUntilClosed()

      await editor.waitForLatexExpression(Equations.squareRootYPlusFive.latex ?? (() => { throw new Error('LaTeX equation is undefined') })())
      const latexEquations = await editor.getLatexEquationsInEditField()
      expect(latexEquations).toContain(Equations.squareRootYPlusFive.latex ?? (() => { throw new Error('LaTeX equation is undefined') })())
    })

    test(`Edit empty LaTeX equation: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      const INPUT_FORMULA = 'sin x'
      
      await editor.open()
      await editor.clear()
      await editor.appendText('$$$$')
      await editor.selectItemAtCursor()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.insertEquationViaKeyboard(INPUT_FORMULA)

      await editor.waitForLatexExpression('\\sin\\;x')
      const latexEquations = await editor.getLatexEquationsInEditField()
      expect(latexEquations).toContain('\\sin\\;x')
    })
  })
}