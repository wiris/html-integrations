import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()
const toolbars = Object.values(Toolbar)

for (const editorName of editors) {
  for (const toolbar of toolbars) {
    test.describe(`Insert equation (corner cases) - ${editorName} editor - ${toolbar}`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
      test(`MTHTML-80 Insert styled equation: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()

        await wirisEditor.insertEquationUsingEntryForm(Equations.styledOnePlusOne.mathml)
        await editor.waitForEquation(Equations.styledOnePlusOne)

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.styledOnePlusOne.altText)
        expect(isEquationPresent).toBeTruthy()
      })

      test(`MTHTML-68 Insert equation with special characters: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        await editor.open()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()

        await wirisEditor.insertEquationUsingEntryForm(Equations.specialCharacters.mathml)
        await editor.waitForEquation(Equations.specialCharacters)

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.specialCharacters.altText)
        expect(isEquationPresent).toBeTruthy()
      })

      test(`MTHTML-90 User inserts a formula when the editor input doesn't have focus: ${editorName} editor`, async ({ page }) => {
        const { editor, wirisEditor } = await setupEditor(page, editorName)
        
        // Insert a formula using only the keyboard (click MT button > type > tab to insert > enter) and keep writing
        await editor.open()
        await editor.openWirisEditor(toolbar)
        await wirisEditor.waitUntilLoaded()

        await wirisEditor.typeEquationViaKeyboard('1+1')
        await page.keyboard.press('Tab')
        await wirisEditor.pause(500)
        await page.keyboard.press('Enter')

        await editor.waitForEquation(Equations.OnePlusOne)

        const equationsInHTMLEditor = await editor.getEquations()
        const isEquationPresent = equationsInHTMLEditor.some((equation: Equation) => equation.altText === Equations.OnePlusOne.altText)
        expect(isEquationPresent).toBeTruthy()
      })
    })
  }
}