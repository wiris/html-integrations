import { Page } from '@playwright/test'
import BaseEditor from '../base_editor'

class TinyMCE7 extends BaseEditor {
  protected readonly wirisEditorButtonChemType = "[aria-label='Insert a chemistry formula - ChemType']"
  protected readonly wirisEditorButtonMathType = "[aria-label='Insert a math equation - MathType']"
  protected readonly editField = 'body'
  protected readonly iframe = "iframe[id='editor_ifr']"
  protected readonly name = 'tinymce7'

  constructor(page: Page) {
    super(page)
  }
}

export default TinyMCE7