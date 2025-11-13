import { Page } from '@playwright/test'
import Generic from './html/generic'
import CKEditor5 from './html/ckeditor5'
import CKEditor4 from './html/ckeditor4'
import Froala from './html/froala'
import TinyMCE5 from './html/tinymce5'
import TinyMCE6 from './html/tinymce6'
import TinyMCE7 from './html/tinymce7'
import TinyMCE8 from './html/tinymce8'

import type BaseEditor from './base_editor'

class EditorManager {
  private editorsInConfiguration: string[] | undefined

  public getEditors(page: Page): BaseEditor[] {
  
    const availableEditors: BaseEditor[] = [
      new Generic(page),
      new CKEditor5(page),
      new CKEditor4(page),
      new Froala(page),
      new TinyMCE5(page),
      new TinyMCE6(page),
      new TinyMCE7(page),
      new TinyMCE8(page),
    ]

    this.editorsInConfiguration = process.env.HTML_EDITOR?.split('|')
    const editorsToUse = availableEditors.filter((editor) => 
      ((this.editorsInConfiguration?.includes(editor.getName())) ?? false)
    )

    if (editorsToUse.length === 0) {
      throw new Error(`No valid editors found in current configuration: ${process.env.HTML_EDITOR}`)
    }

    return editorsToUse
  }
}

export default EditorManager