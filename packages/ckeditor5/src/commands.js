/* eslint-disable max-classes-per-file */
import Command from '@ckeditor/ckeditor5-core/src/command';
import CKEditor5Integration from './integration';

/**
 * Command for opening the MathType editor
 */
export class MathTypeCommand extends Command {
  execute(options = {}) {
    // Check we get a valid integration
    // eslint-disable-next-line no-prototype-builtins
    if (!options.hasOwnProperty('integration') || !(options.integration instanceof CKEditor5Integration)) {
      throw 'Must pass a valid CKEditor5Integration instance as attribute "integration" of options';
    }

    // Save the integration instance as a property of the command.
    this.integration = options.integration;

    // Set custom editor or disable it
    this.setEditor();

    // Open the editor
    this.openEditor();
  }

  /**
     * Sets the appropriate custom editor, if any, or disables them.
     */
  setEditor() {
    // It's possible that a custom editor was last used.
    // We need to disable it to avoid wrong behaviors.
    this.integration.core.getCustomEditors().disable();
  }

  /**
     * Checks whether we are editing an existing formula or a new one and opens the editor.
     */
  openEditor() {
    this.integration.core.editionProperties.dbclick = false;
    const image = this._getSelectedImage();
    if (typeof image !== 'undefined' && image !== null && image.classList.contains(WirisPlugin.Configuration.get('imageClassName'))) {
      this.integration.core.editionProperties.temporalImage = image;
      this.integration.openExistingFormulaEditor();
    } else {
      this.integration.openNewFormulaEditor();
    }
  }

  /**
     * Gets the currently selected formula image
     * @returns {Element} selected image, if any, undefined otherwise
     */
  _getSelectedImage() {
    const { selection } = this.editor.editing.view.document;

    // If we can not extract the formula, fall back to default behavior.
    if (selection.isCollapsed || selection.rangeCount !== 1) {
      return;
    }

    // Look for the <span> wrapping the formula and then for the <img/> inside

    const range = selection.getFirstRange();

    let image;

    for (const span of range) {
      if (span.item.name !== 'span') {
        return;
      }
      image = span.item.getChild(0);
      break;
    }

    if (!image) {
      return;
    }

    // eslint-disable-next-line consistent-return
    return this.editor.editing.view.domConverter.mapViewToDom(image);
  }
}

/**
 * Command for opening the ChemType editor
 */
export class ChemTypeCommand extends MathTypeCommand {
  setEditor() {
    this.integration.core.getCustomEditors().enable('chemistry');
  }
}
