import { Command } from "ckeditor5/src/core.js";

export default class MathTypeCommand extends Command {
  constructor(editor, mathTypePlugin) {
    super(editor);
    this.mathTypePlugin = mathTypePlugin;
  }

  execute() {
    const mathml = this._getSelectedFormulaMathML();

    this.mathTypePlugin.openEditor(mathml);
  }

  _getSelectedFormulaMathML() {
    const { selection } = this.editor.model.document;
    const selectedElement = selection.getSelectedElement();

    if (selectedElement?.name === "mathml") {
      return selectedElement.getAttribute("formula") || null;
    }

    return null;
  }
}
