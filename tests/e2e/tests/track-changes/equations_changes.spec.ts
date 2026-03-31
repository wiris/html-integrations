import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'

const editors = getEditorsFromEnv()
const toolbars = Object.values(Toolbar)

for (const editorName of editors) {
  for (const toolbar of toolbars) {
    test.describe(`Track Changes - ${editorName} editor`, {
      tag: [`@${editorName}`, '@regression'],
    }, () => {
      test(`Insert equation - ${toolbar} toolbar`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName);

        const hasTrackChanges = editor.getTrackChangesButton !== undefined;
        test.skip(!hasTrackChanges, `Track changes button not available in ${editorName} editor`);

        await editor.open()
        await editor.clear()
        await editor.clickTrackChanges()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.singleNumber.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.singleNumber)

        await editor.getTrackChangesItems().then(items => {
          const hasInsertedEquationInTrackChanges = items.some((item) => item.type === 'insertion' && item.altText === Equations.singleNumber.altText);
          expect(hasInsertedEquationInTrackChanges).toBeTruthy()
        })
      })

      test(`Delete equation - ${toolbar} toolbar`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName);

        const hasTrackChanges = editor.getTrackChangesButton !== undefined;
        test.skip(!hasTrackChanges, `Track changes button not available in ${editorName} editor`);

        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.singleNumber.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.singleNumber)

        await editor.clickTrackChanges()
        await editor.deleteEquation(Equations.singleNumber)

        await editor.getTrackChangesItems().then(items => {
          const hasDeletedEquationInTrackChanges = items.some((item) => item.type === 'deletion' && item.altText === Equations.singleNumber.altText);
          expect(hasDeletedEquationInTrackChanges).toBeTruthy()
        })
      })

      test(`Edit equation - ${toolbar} toolbar`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName);

        const hasTrackChanges = editor.getTrackChangesButton !== undefined;
        test.skip(!hasTrackChanges, `Track changes button not available in ${editorName} editor`);

        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.singleNumber.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.singleNumber)

        await editor.clickTrackChanges()
        await editor.openWirisEditorForLastInsertedFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationViaKeyboard('+1')
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.getTrackChangesItems().then(items => {
          const hasEditedEquationInTrackChanges = items.some((item) => item.type === 'insertion' && item.altText === Equations.OnePlusOne.altText);
          const hasDeletedEquationInTrackChanges = items.some((item) => item.type === 'deletion' && item.altText === Equations.singleNumber.altText);
          expect(hasEditedEquationInTrackChanges).toBeTruthy()
          expect(hasDeletedEquationInTrackChanges).toBeTruthy()
        })
      })
    })
  }
}
