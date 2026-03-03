import { Page } from '@playwright/test'
import BaseEditor from '../base_editor'

class CKEditor5 extends BaseEditor {
  protected readonly wirisEditorButtonMathType = "[data-cke-tooltip-text='Insert a math equation - MathType']"
  protected readonly wirisEditorButtonChemType = "[data-cke-tooltip-text='Insert a chemistry formula - ChemType']"
  protected readonly sourceCodeEditorButton = "[data-cke-tooltip-text='Source']"
  protected readonly sourceCodeEditField = '.ck-source-editing-area'
  protected readonly editField = '.ck-editor__editable'
  protected readonly name = 'ckeditor5'

  constructor(page: Page) {
    super(page)
  }

  public getSourceCodeEditorButton(): string {
    return this.sourceCodeEditorButton
  }

  public getSourceCodeEditField(): string {
    return this.sourceCodeEditField
  }
}

export default CKEditor5