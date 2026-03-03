import { test, expect } from '@playwright/test'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import { getEditorsFromEnv } from '../../helpers/test-setup'
import { setupEditor } from '../../helpers/test-setup'
import Equation from '../../interfaces/equation'

// Configure which editors to test via environment variables
const editors = getEditorsFromEnv()
const toolbars = Object.values(Toolbar)

for (const editorName of editors) {
  test.describe(`Edit equation via selection - ${editorName} editor`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    for (const toolbar of toolbars) {
      test(`@smoke MTHTML-8 Edit Math equation with ${toolbar}: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)

        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(Toolbar.MATH)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
        await editor.waitForEquation(Equations.singleNumber)

        await editor.openWirisEditorForLastInsertedFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.insertEquationViaKeyboard('+1')

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
        expect(isEquationPresent).toBeTruthy()
      })

      test(`@smoke MTHTML-8 Edit Chemistry equation with ${toolbar}: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)

        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(Toolbar.CHEMISTRY)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
        await editor.waitForEquation(Equations.singleNumber)

        await editor.openWirisEditorForLastInsertedFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.insertEquationViaKeyboard('+1')

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
        expect(isEquationPresent).toBeTruthy()
      })
    }
  })
}