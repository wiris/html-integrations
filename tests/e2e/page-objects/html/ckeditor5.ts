import { Page } from '@playwright/test'
import BaseEditor from '../base_editor'
import TrackChangesOptions from '../../enums/track_changes_options'

class CKEditor5 extends BaseEditor {
  protected readonly wirisEditorButtonMathType = "[data-cke-tooltip-text='Insert a math equation - MathType']"
  protected readonly wirisEditorButtonChemType = "[data-cke-tooltip-text='Insert a chemistry formula - ChemType']"
  protected readonly sourceCodeEditorButton = "[data-cke-tooltip-text='Source']"
  protected readonly sourceCodeEditField = '.ck-source-editing-area'
  protected readonly trackChangesButton = "[data-cke-tooltip-text='Track changes']"
  protected readonly trackChangesDropdown = '.ck-splitbutton__arrow';
  protected readonly trackChangesPreviewContainer = '.ck-track-changes-preview__root-container';
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

  public getTrackChangesButton(): string {
    return this.trackChangesButton
  }

  public getTrackChangesDropdown(): string {
    return this.trackChangesDropdown
  }

  public getTrackChangesPreviewContainer(): string {
    return this.trackChangesPreviewContainer
  }
}

export default CKEditor5
