import { Page } from '@playwright/test'
import BaseEditor from '../base_editor'

class Froala extends BaseEditor {
  protected readonly wirisEditorButtonMathType = '.fr-btn-grp.fr-float-left >> #wirisEditor-1'
  protected readonly wirisEditorButtonChemType = '.fr-btn-grp.fr-float-left >> #wirisChemistry-1'
  protected readonly editField = '.fr-element'
  protected readonly name = 'froala'

  constructor(page: Page) {
    super(page)
  }

  public getContextualToolbarMathTypeButton(): string {
    return '.fr-buttons #wirisEditor-1'
  }

  public getContextualToolbarChemTypeButton(): string {
    return '.fr-buttons #wirisChemistry-1'
  }
}

export default Froala