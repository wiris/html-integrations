import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import TypingMode from '../../enums/typing_mode'

const editors = getEditorsFromEnv()
const toolbars = Object.values(Toolbar)

for (const editorName of editors) {
  test.describe(`Edit equation by hand - ${editorName} editor`,{
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    for (const toolbar of toolbars) {
      test(`@smoke MTHTML-8 Edit Hand equation with ${toolbar}: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.singleNumber.mathml)
        await wirisEditor.pause(1000) // Wait for the equation to be processed
        await wirisEditor.handModeButton.click()
        await wirisEditor.pause(500)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.singleNumber)

        await editor.openWirisEditorForLastInsertedFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded(TypingMode.HAND)

        const typingMode = await wirisEditor.getMode()
        expect(typingMode).toBe(TypingMode.HAND)
      })
    }
  })
}