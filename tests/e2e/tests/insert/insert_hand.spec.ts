import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import EquationEntryMode from '../../enums/equation_entry_mode'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()
const toolbars = Object.values(Toolbar)

for (const editorName of editors) {
  for (const toolbar of toolbars) {
    test.describe(`Insert equation via Hand - ${editorName} editor - ${toolbar}`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
      test(`@smoke MTHTML-20 Insert a handwritten equation using ${toolbar}: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.showEquationEntryForm(EquationEntryMode.MATHML)
        await wirisEditor.typeEquationUsingEntryForm(Equations.singleNumber.mathml)
        await wirisEditor.pause(500) // Wait for the equation to be processed
        await wirisEditor.handModeButton.click()
        await wirisEditor.pause(500)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
        expect(isEquationPresent).toBeTruthy()
      })
    })
  }
}