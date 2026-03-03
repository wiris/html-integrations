import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Toolbar from '../../enums/toolbar'
import Equations from '../../enums/equations'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()

for (const editorName of editors) {
  test.describe(`Confirmation dialog - ${editorName} editor`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    test(`MTHTML-11 When wiris editor contains no changes and user clicks the Cancel button, modal closes: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.cancelButton.click()

      await expect(wirisEditor.wirisEditorWindow).not.toBeVisible()
    })

    test(`MTHTML-3 When wiris editor contains changes and user clicks the Cancel button, modal displays confirmation dialog: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      const EQUATION_TO_TYPE_VIA_KEYBOARD = '111'
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.typeEquationViaKeyboard(EQUATION_TO_TYPE_VIA_KEYBOARD)

      await wirisEditor.cancelButton.click() // confirmation dialog should be displayed after this click!

      await expect(wirisEditor.wirisEditorWindow).toBeVisible()
      await expect(wirisEditor.confirmationDialog).toBeVisible()
    })

    test(`When confirmation dialog is displayed and user clicks cancel, confirmation dialog closes: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      const EQUATION_TO_TYPE_VIA_KEYBOARD = '221221'
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.typeEquationViaKeyboard(EQUATION_TO_TYPE_VIA_KEYBOARD)
      await wirisEditor.cancelButton.click() // confirmation dialog should be displayed after this click!

      await wirisEditor.confirmationDialogCancelButton.click()

      await expect(wirisEditor.confirmationDialog).not.toBeVisible()
      await expect(wirisEditor.wirisEditorWindow).toBeVisible()
    })

    test(`MTHTML-12 When confirmation dialog is displayed and user clicks the Close button, wiris editor closes: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      const EQUATION_TO_TYPE_VIA_KEYBOARD = '3'
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.typeEquationViaKeyboard(EQUATION_TO_TYPE_VIA_KEYBOARD)
      await wirisEditor.closeButton.click() // confirmation dialog should be displayed after this click!

      await wirisEditor.confirmationDialogCloseButton.click()

      await expect(wirisEditor.confirmationDialog).not.toBeVisible()
      await expect(wirisEditor.wirisEditorWindow).not.toBeVisible()
    })

    test(`MTHTML-14 When confirmation dialog is displayed and user press the ESC key, wiris editor closes: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      const EQUATION_TO_TYPE_VIA_KEYBOARD = '3'
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.typeEquationViaKeyboard(EQUATION_TO_TYPE_VIA_KEYBOARD)
      await page.keyboard.press('Escape') // confirmation dialog should be displayed after this!

      await wirisEditor.confirmationDialogCloseButton.click()

      await expect(wirisEditor.confirmationDialog).not.toBeVisible()
      await expect(wirisEditor.wirisEditorWindow).not.toBeVisible()
    })

    test(`MTHTML-29 Insert an equation after aborting the cancel: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      const EQUATION_TO_INSERT_VIA_KEYBOARD = '1'
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.typeEquationViaKeyboard(EQUATION_TO_INSERT_VIA_KEYBOARD)

      await wirisEditor.cancelButton.click() // confirmation dialog should be displayed after this click!
      await wirisEditor.confirmationDialogCancelButton.click()
      await wirisEditor.insertButton.click()
      await wirisEditor.waitUntilClosed()

      await editor.waitForEquation(Equations.singleNumber)
      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
      expect(isEquationPresent).toBeTruthy()
    })
  })
}