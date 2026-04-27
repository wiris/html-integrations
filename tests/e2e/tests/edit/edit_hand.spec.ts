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
        await wirisEditor.pause(500) // Wait for the mode to switch
        await wirisEditor.drawStroke([
          { x: 300, y: 135 },
          { x: 350, y: 135 },
        ]);
        await wirisEditor.pause(100)
        await wirisEditor.drawStroke([
          { x: 325, y: 110 },
          { x: 325, y: 160 },
        ]);
        await wirisEditor.waitForHandwritingRecognition()
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.onePlus)

        await editor.openWirisEditorForLastInsertedFormula(toolbar, Equations.onePlus)
        await wirisEditor.waitUntilLoaded(TypingMode.HAND)
        await wirisEditor.pause(500) // Wait for the editor to be fully ready for input
        await wirisEditor.drawStroke([
          { x: 380, y: 60 },
          { x: 380, y: 185 },
        ]);
        await wirisEditor.pause(500) // Wait for the model to start processing the input
        await wirisEditor.waitForHandwritingRecognition()
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.OnePlusOne)

        await editor.openWirisEditorForLastInsertedFormula(toolbar, Equations.OnePlusOne)
        await wirisEditor.waitUntilLoaded(TypingMode.HAND)

        const typingMode = await wirisEditor.getMode()
        expect(typingMode).toBe(TypingMode.HAND)
      })
    }
  })
}
