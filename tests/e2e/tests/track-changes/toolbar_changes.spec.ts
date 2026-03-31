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
    test.describe(`Track Changes Options - ${editorName} editor`, {
      tag: [`@${editorName}`, '@regression'],
    }, () => {
      test(`Accept all suggestions - ${toolbar} toolbar`, async ({ page }) => {
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

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.OnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.OnePlusOne)

        await editor.clickTrackChanges()

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.styledOnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.deleteEquation(Equations.OnePlusOne)

        await editor.openWirisEditorForFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationViaKeyboard('+1')
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.clickTrackChangeOption(TrackChangesOptions.ACCEPT_ALL)

        await editor.getEquations().then((equations: Equation[]) => {
          const hasSingleNumber = equations.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
          const hasOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
          const hasStyledOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.styledOnePlusOne.altText)
          expect(hasSingleNumber).toBeFalsy()
          expect(hasOnePlusOne).toBeTruthy()
          expect(hasStyledOnePlusOne).toBeTruthy()
          expect(equations.length).toBe(2)
        })
        expect(await editor.getTrackChangesItems()).toEqual([])
      })

      test(`Discard all suggestions - ${toolbar} toolbar`, async ({ page }) => {
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

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.OnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.OnePlusOne)

        await editor.clickTrackChanges()

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.styledOnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.deleteEquation(Equations.OnePlusOne)

        await editor.openWirisEditorForFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationViaKeyboard('+1')
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.clickTrackChangeOption(TrackChangesOptions.DISCARD_ALL)

        await editor.getEquations().then((equations: Equation[]) => {
          const hasSingleNumber = equations.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
          const hasOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
          const hasStyledOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.styledOnePlusOne.altText)
          expect(hasSingleNumber).toBeTruthy()
          expect(hasOnePlusOne).toBeTruthy()
          expect(hasStyledOnePlusOne).toBeFalsy()
          expect(equations.length).toBe(2)
        })
        expect(await editor.getTrackChangesItems()).toEqual([])
      })

      test(`Accept all selected suggestions - ${toolbar} toolbar`, async ({ page }) => {
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

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.OnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.OnePlusOne)

        await editor.clickTrackChanges()

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.styledOnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.deleteEquation(Equations.OnePlusOne)

        await editor.openWirisEditorForFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationViaKeyboard('+1')
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.clickTrackChangeOption(TrackChangesOptions.ACCEPT_SELECTED)

        await editor.getEquations().then((equations: Equation[]) => {
          const hasSingleNumber = equations.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
          const hasOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
          const hasStyledOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.styledOnePlusOne.altText)
          expect(hasSingleNumber).toBeFalsy()
          expect(hasOnePlusOne).toBeTruthy()
          expect(hasStyledOnePlusOne).toBeTruthy()
          expect(equations.length).toBe(3)
        })
        await editor.getTrackChangesItems().then(items => {
          const hasDeletedSingleNumberInTrackChanges = items.some((item) => item.type === 'deletion' && item.altText === Equations.singleNumber.altText);
          const hasInsertedOnePlusOneInTrackChanges = items.some((item) => item.type === 'insertion' && item.altText === Equations.OnePlusOne.altText);
          const hasDeletedOnePlusOneInTrackChanges = items.some((item) => item.type === 'deletion' && item.altText === Equations.OnePlusOne.altText);
          const hasInsertedStyledOnePlusOneInTrackChanges = items.some((item) => item.type === 'insertion' && item.altText === Equations.styledOnePlusOne.altText);
          expect(hasDeletedSingleNumberInTrackChanges).toBeFalsy()
          expect(hasInsertedOnePlusOneInTrackChanges).toBeFalsy()
          expect(hasDeletedOnePlusOneInTrackChanges).toBeTruthy()
          expect(hasInsertedStyledOnePlusOneInTrackChanges).toBeTruthy()
          expect(items.length).toBe(2)
        })
      })

      test(`Discard all selected suggestions - ${toolbar} toolbar`, async ({ page }) => {
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

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.OnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.OnePlusOne)

        await editor.clickTrackChanges()

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.styledOnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.deleteEquation(Equations.OnePlusOne)

        await editor.openWirisEditorForFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationViaKeyboard('+1')
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.clickTrackChangeOption(TrackChangesOptions.DISCARD_SELECTED)

        await editor.getEquations().then((equations: Equation[]) => {
          const hasSingleNumber = equations.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
          const hasOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
          const hasStyledOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.styledOnePlusOne.altText)
          expect(hasSingleNumber).toBeTruthy()
          expect(hasOnePlusOne).toBeTruthy()
          expect(hasStyledOnePlusOne).toBeTruthy()
          expect(equations.length).toBe(3)
        })
        await editor.getTrackChangesItems().then(items => {
          const hasDeletedSingleNumberInTrackChanges = items.some((item) => item.type === 'deletion' && item.altText === Equations.singleNumber.altText);
          const hasInsertedOnePlusOneInTrackChanges = items.some((item) => item.type === 'insertion' && item.altText === Equations.OnePlusOne.altText);
          const hasDeletedOnePlusOneInTrackChanges = items.some((item) => item.type === 'deletion' && item.altText === Equations.OnePlusOne.altText);
          const hasInsertedStyledOnePlusOneInTrackChanges = items.some((item) => item.type === 'insertion' && item.altText === Equations.styledOnePlusOne.altText);
          expect(hasDeletedSingleNumberInTrackChanges).toBeFalsy()
          expect(hasInsertedOnePlusOneInTrackChanges).toBeFalsy()
          expect(hasDeletedOnePlusOneInTrackChanges).toBeTruthy()
          expect(hasInsertedStyledOnePlusOneInTrackChanges).toBeTruthy()
          expect(items.length).toBe(2)
        })
      })

      test(`Preview final result - ${toolbar} toolbar`, async ({ page }) => {
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

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.OnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()
        await editor.waitForEquation(Equations.OnePlusOne)

        await editor.clickTrackChanges()

        await editor.press('Enter')
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationUsingEntryForm(Equations.styledOnePlusOne.mathml)
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.deleteEquation(Equations.OnePlusOne)

        await editor.openWirisEditorForFormula(toolbar, Equations.singleNumber)
        await wirisEditor.waitUntilLoaded()
        await wirisEditor.typeEquationViaKeyboard('+1')
        await wirisEditor.insertButton.click()
        await wirisEditor.waitUntilClosed()

        await editor.clickTrackChangeOption(TrackChangesOptions.PREVIEW_FINAL)

        await editor.getEquations().then((equations: Equation[]) => {
          const hasSingleNumber = equations.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
          const hasOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
          const hasStyledOnePlusOne = equations.some((equation: Equation) => equation.altText === Equations.styledOnePlusOne.altText)
          expect(hasSingleNumber).toBeTruthy()
          expect(hasOnePlusOne).toBeTruthy()
          expect(hasStyledOnePlusOne).toBeTruthy()
          expect(equations.length).toBe(6)
        })
        await editor.getTrackChangesPreviewEquations().then(items => {
          const hasSingleNumberInPreviewTrackChanges = items.some((item) => item.altText === Equations.singleNumber.altText);
          const hasOnePlusOneInPreviewTrackChanges = items.some((item) => item.altText === Equations.OnePlusOne.altText);
          const hasStyledOnePlusOneInPreviewTrackChanges = items.some((item) => item.altText === Equations.styledOnePlusOne.altText);
          expect(hasSingleNumberInPreviewTrackChanges).toBeFalsy()
          expect(hasOnePlusOneInPreviewTrackChanges).toBeTruthy()
          expect(hasStyledOnePlusOneInPreviewTrackChanges).toBeTruthy()
          expect(items.length).toBe(2)
        })
      })
    })
  }
}
