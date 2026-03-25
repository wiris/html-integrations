import { Page } from '@playwright/test'
import BaseEditor from '../base_editor'

class CKEditor4 extends BaseEditor {
  protected readonly wirisEditorButtonMathType = "[title='Insert a math equation - MathType']"
  protected readonly wirisEditorButtonChemType = "[title='Insert a chemistry formula - ChemType']"
  protected readonly editField = 'body'
  protected readonly iframe = "iframe[title='Editor, editor']"
  protected readonly name = 'ckeditor4'

  constructor(page: Page) {
    super(page)
  }
}

export default CKEditor4