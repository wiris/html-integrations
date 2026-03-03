import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()

for (const editorName of editors) {
  test.describe(`Edit equation via double click - ${editorName} editor`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    // Skip test for Froala as double click is not available
    test.skip(editorName === 'froala', `Double click not available in ${editorName}`)

    test(`@smoke MTHTML-2 Edit Math equation: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
      await editor.waitForEquation(Equations.singleNumber)

      const equationInDOM = editor.getEquationElement(Equations.singleNumber)
      await editor.clickElement(equationInDOM, 2)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationViaKeyboard('+1')

      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
      expect(isEquationPresent).toBeTruthy()
    })

    test(`@smoke MTHTML-2 Edit Chemistry equation: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.CHEMISTRY)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
      await editor.waitForEquation(Equations.singleNumber)

      const equationInDOM = editor.getEquationElement(Equations.singleNumber)
      await editor.clickElement(equationInDOM, 2)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationViaKeyboard('+1')

      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
      expect(isEquationPresent).toBeTruthy()
    })
  })
}