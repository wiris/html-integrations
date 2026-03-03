import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Toolbar from '../../enums/toolbar'

const editors = getEditorsFromEnv()

for (const editorName of editors) {
  test.describe(`Toolbar functions - ${editorName} editor`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    test(`MTHTML-13 When the modal is displayed and close button is clicked, wiris modal closes: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.closeButton.click()
      await wirisEditor.waitUntilClosed()

      await expect(wirisEditor.wirisEditorWindow).not.toBeVisible()
    })

    test(`When the modal is displayed and enable full screen button is clicked, display changes to full-screen: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.fullScreenButton.click()

      await expect(wirisEditor.modalOverlay).toBeVisible()
    })

    test(`When the modal is displayed in full screen mode and disable full-screen button is clicked, display changes to normal: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.fullScreenButton.click()

      await wirisEditor.exitFullScreenButton.click()

      await expect(wirisEditor.modalOverlay).not.toBeVisible()
    })

    // WIP
    test.fixme(`When the modal is displayed and minimize button is clicked, modal is minimized: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.minimizeButton.click()
      await editor.pause(1000)

      await expect(wirisEditor.wirisEditorWindow).not.toBeVisible()
    })

    // WIP
    test.fixme(`When the modal is minimized and user double clicks the banner, modal opens: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.minimizeButton.click()
      await wirisEditor.waitUntilClosed()

      await wirisEditor.modalTitle.click()

      await expect(wirisEditor.wirisEditorWindow).toBeVisible()
    })

    test.fixme(`When the modal is minimized from full-screen mode and user double clicks the banner, modal opens in full-screen mode: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.fullScreenButton.click()

      await wirisEditor.minimizeButton.click()
      // TODO: This test seems incomplete in the original WebDriverIO version
    })

    test(`MTHTML-15 When the modal is displayed and ESC key is pressed, wiris modal closes: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await page.keyboard.press('Escape')
      await wirisEditor.waitUntilClosed()

      await expect(wirisEditor.wirisEditorWindow).not.toBeVisible()
    })
  })
}