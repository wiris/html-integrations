import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()
const toolbars = Object.values(Toolbar)

for (const editorName of editors) {
  for (const toolbar of toolbars) {
    test.describe(`Insert equation - ${editorName} editor - ${toolbar}`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
      test(`@smoke MTHTML-1 Insert equation with ${toolbar} via keyboard: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)

        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()

        await wirisEditor.insertEquationViaKeyboard('1')
        await wirisEditor.pause(500) // Wait for the equation to be processed
        await editor.waitForEquation(Equations.singleNumber)

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
        expect(isEquationPresent).toBeTruthy()
      })

      test(`Insert equation with ${toolbar} using MathML: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.clear()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()

        await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
        await editor.waitForEquation(Equations.singleNumber)

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
        expect(isEquationPresent).toBeTruthy()
      })
    })
  }

  test.describe(`ALT Attribute - ${editorName} editor`, () => {
    test(`MTHTML-19 Formula - ALT attribute: ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()

      await wirisEditor.insertEquationViaKeyboard('1')
      await wirisEditor.pause(500) // Wait for the equation to be processed
      await editor.waitForEquation(Equations.singleNumber)

      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.singleNumber.altText)
      expect(isEquationPresent).toBeTruthy()
    })
  })
}