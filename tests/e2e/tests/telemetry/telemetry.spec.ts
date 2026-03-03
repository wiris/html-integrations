import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import { captureTelemetryRequests } from '../../helpers/network'
import Toolbar from '../../enums/toolbar'
import Equations from '../../enums/equations'

const editors = getEditorsFromEnv()

for (const editorName of editors) {
  test.describe('Telemetry', {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    test(`MTHTML-59 MathType all events testing: ${editorName} editor`, async ({ page, browserName }) => {
      // Skip Firefox as mentioned in original test
      test.skip(browserName === 'firefox', 'Telemetry tests are skipped on Firefox')
      
      const { editor, wirisEditor } = await setupEditor(page, editorName)

      // Enable Network Listener and capture all telemetry requests
      const foundEvents: string[] = []
      await captureTelemetryRequests(page, foundEvents)

      // Perform the actions that will trigger the telemetry events
      await editor.open()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.cancelButton.click()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
      await editor.waitForEquation(Equations.singleNumber)
      await editor.openWirisEditorForLastInsertedFormula(Toolbar.MATH, Equations.singleNumber)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.typeEquationViaKeyboard('+1')
      await wirisEditor.insertButton.click()
      await wirisEditor.waitUntilClosed()
      await editor.pause(1500) // This pause is needed to wait for the last event

      // Check that all events have been sent are the ones we expect, in the same order
      const expectEvents = ['STARTED_TELEMETRY_SESSION', 'CLOSED_MTCT_EDITOR', 'OPENED_MTCT_EDITOR', 'INSERTED_FORMULA', 'CLOSED_MTCT_EDITOR', 'OPENED_MTCT_EDITOR', 'INSERTED_FORMULA', 'CLOSED_MTCT_EDITOR']
      expect(JSON.stringify(expectEvents) === JSON.stringify(foundEvents)).toBeTruthy()
    })
  })
}