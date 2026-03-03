import { Page } from '@playwright/test'
import BaseEditor from '../base_editor'

class Generic extends BaseEditor {
  protected readonly wirisEditorButtonChemType = '#chemistryIcon'
  protected readonly wirisEditorButtonMathType = '#editorIcon'
  protected readonly editField = '#editable'
  protected readonly name = 'generic'

  constructor(page: Page) {
    super(page)
  }
}

export default Generic