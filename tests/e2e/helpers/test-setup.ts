import { Page } from '@playwright/test'
import EditorManager from '../page-objects/editor_manager'
import WirisEditor from '../page-objects/wiris_editor'
import BaseEditor from '../page-objects/base_editor'

export interface TestSetup {
  editor: BaseEditor
  wirisEditor: WirisEditor
}

export async function setupEditor(page: Page, editorName: string): Promise<TestSetup> {
  const editorManager = new EditorManager()
  const availableEditors = editorManager.getEditors(page)
  const editor = availableEditors.find(e => e.getName() === editorName)

  if (!editor) {
    throw new Error(`Editor ${editorName} not found`)
  }

  const wirisEditor = new WirisEditor(page)

  return { editor, wirisEditor }
}

export function getEditorsFromEnv(): string[] {
  if (!process.env.HTML_EDITOR) {
    throw new Error('Environment variable HTML_EDITOR is not set')
  }
  return process.env.HTML_EDITOR.split('|')
}
