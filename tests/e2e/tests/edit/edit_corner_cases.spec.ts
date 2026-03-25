import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()

for (const editorName of editors) {
  test.describe(`Edit equation (corner cases) - ${editorName} editor`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    test(`MTHTML-81 Edit styled equation: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.styledSingleNumber.mathml)
      await editor.waitForEquation(Equations.styledSingleNumber)

      await editor.openWirisEditorForLastInsertedFormula(Toolbar.MATH, Equations.styledSingleNumber)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.typeEquationViaKeyboard('+1')
      await wirisEditor.insertButton.click()
      await wirisEditor.waitUntilClosed()

      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.styledOnePlusOne.altText)
      expect(isEquationPresent).toBeTruthy()
    })

    test(`MTHTML-85 User edits a formula and continues typing text: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
      await editor.waitForEquation(Equations.singleNumber)

      await editor.openWirisEditorForLastInsertedFormula(Toolbar.MATH, Equations.singleNumber)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationViaKeyboard('+1')

      const textToType = 'I can keep typing in the Editor'
      await editor.pause(500)
      await page.keyboard.type(textToType)

      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
      expect(isEquationPresent).toBeTruthy()

      const isTextAfterEquation = await editor.isTextAfterEquation(textToType, Equations.OnePlusOne.altText)
      expect(isTextAfterEquation).toBeTruthy()
    })

    test(`MTHTML-100 User edits a formula deleted during edition: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
      await editor.waitForEquation(Equations.singleNumber)

      await editor.openWirisEditorForLastInsertedFormula(Toolbar.MATH, Equations.singleNumber)
      await wirisEditor.waitUntilLoaded()
      await editor.clear() // Delete the formula in the background

      // We continue with the insert in the wiris editor
      await wirisEditor.insertEquationViaKeyboard('+1')

      // No error should be visible, and the editor should be blank
      expect(await editor.isEditorCleared()).toBeTruthy()
      
      // Again, we do an insert + edit so we assure everything works as expected
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
      await editor.waitForEquation(Equations.singleNumber)

      await editor.openWirisEditorForLastInsertedFormula(Toolbar.MATH, Equations.singleNumber)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.pause(1000)
      await wirisEditor.insertEquationViaKeyboard('+1')

      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
      expect(isEquationPresent).toBeTruthy()
    })
  })
}