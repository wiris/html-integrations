import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import Equation from '../../interfaces/equation'
import TrackChangesOptions from '../../enums/track_changes_options'

const editors = getEditorsFromEnv()
const toolbars = Object.values(Toolbar)

for (const editorName of editors) {
  for (const toolbar of toolbars) {
    test.describe(`Track Changes Latex - ${editorName} editor`, {
      tag: [`@${editorName}`, '@regression'],
    }, () => {
      test(`Edit existing latex equation via MT/CT - ${toolbar} toolbar`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName);

        const hasTrackChanges = editor.getTrackChangesButton !== undefined;
        test.skip(!hasTrackChanges, `Track changes button not available in ${editorName} editor`);

        await editor.open()
        await editor.clear()
        await editor.appendText('$$ ' + Equations.squareRootY.latex + ' $$')

        await editor.clickTrackChanges()

        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.type('+5')
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.getLatexEquationsInEditField().then((latexEquations) => {
          let hasEditedEquationInTrackChanges = false;

          if (latexEquations) {
            hasEditedEquationInTrackChanges = latexEquations.some((latex) => latex.includes(Equations.squareRootYPlusFive.latex!));
          } else {
            hasEditedEquationInTrackChanges = false;
          }
          expect(hasEditedEquationInTrackChanges).toBeTruthy()
        })
      })

      test(`Edit existing latex equation manually and via MT/CT - ${toolbar} toolbar`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName);

        const hasTrackChanges = editor.getTrackChangesButton !== undefined;
        test.skip(!hasTrackChanges, `Track changes button not available in ${editorName} editor`);

        await editor.open()
        await editor.clear()
        await editor.appendText('$$' + Equations.squareRootY.latex + '$$')

        await editor.clickTrackChanges()

        await editor.press('ArrowLeft', { times: 2 })
        await editor.type('+')

        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.type('5')
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.waitForLatexExpression(Equations.squareRootYPlusFive.latex!)
      });
    });
  }
}
