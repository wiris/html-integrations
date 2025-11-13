import { test, expect } from '@playwright/test'
import { setupEditor, getEditorsFromEnv } from '../../helpers/test-setup'
import Equations from '../../enums/equations'
import Toolbar from '../../enums/toolbar'
import Equation from '../../interfaces/equation'

const editors = getEditorsFromEnv()

for (const editorName of editors) { // TODO: review some flaky tests
  test.describe(`Copy/Cut/Paste/Drag&Drop - ${editorName} editor`, {
    tag: [`@${editorName}`, '@regression'],
  }, () => {
    test(`MTHTML-95 Copy-paste math formula with ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
      await editor.waitForEquation(Equations.singleNumber)
      await page.keyboard.type('___') // Sending some text to force the copy/paste. Issue in Tiny

      await editor.copyAllEditorContent()
      await editor.clear()
      await editor.paste()
      
      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationCopied = equationsInHTMLEditor.every((equation: Equation) => equation.altText === Equations.singleNumber.altText) && (equationsInHTMLEditor.length === 1)
      expect(isEquationCopied).toBeTruthy()
    })

    test(`MTHTML-96 Cut-paste math formula with ${editorName} editor`, async ({ page }) => {
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.singleNumber.mathml)
      await editor.waitForEquation(Equations.singleNumber)
      await page.keyboard.type('___') // Sending some text to force the copy/paste. Issue in Tiny

      await editor.cutAllEditorContent()
      await editor.paste()
      
      const equationsInHTMLEditor = await editor.getEquations()
      const isEquationCut = equationsInHTMLEditor.every((equation: Equation) => equation.altText === Equations.singleNumber.altText) && (equationsInHTMLEditor.length === 1)
      expect(isEquationCut).toBeTruthy()
    })

    test(`MTHTML-86 Drag-drop math formula with ${editorName} editor`, async ({ page }) => {
      test.fixme((editorName === 'ckeditor5' || editorName === 'generic') && test.info().project.name === 'firefox', `Drag and drop not working for ${editorName} in Firefox`) // TODO: fix drag and drop in Firefox for ckeditor5 and generic editor

      const unsupportedEditors = ['ckeditor4', 'tinymce5', 'tinymce6', 'tinymce7', 'tinymce8'] // WIP
      
      // Skip test for unsupported editors
      test.skip(unsupportedEditors.includes(editorName), `Drag and drop not supported for ${editorName}`)
      
      const { editor, wirisEditor } = await setupEditor(page, editorName)
      
      await editor.open()
      await editor.clear()
      const textToType = 'The equation will be relocated from after this text to before it'
      await editor.appendText(textToType)
      await editor.openWirisEditor(Toolbar.MATH)
      await wirisEditor.waitUntilLoaded()
      await wirisEditor.insertEquationUsingEntryForm(Equations.OnePlusOne.mathml)
      await editor.waitForEquation(Equations.OnePlusOne)

      await editor.dragDropLastFormula(Equations.OnePlusOne)
      await editor.waitForEquation(Equations.OnePlusOne)

      const isTextAfterEquation = await editor.isTextAfterEquation(textToType, Equations.OnePlusOne.altText)
      expect(isTextAfterEquation).toBeTruthy()
    })
  })
}