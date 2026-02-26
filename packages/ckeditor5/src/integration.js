import IntegrationModel from "@wiris/mathtype-html-integration-devkit/src/integrationmodel.js";
import Util from "@wiris/mathtype-html-integration-devkit/src/util.js";
import Configuration from "@wiris/mathtype-html-integration-devkit/src/configuration.js";
import Latex from "@wiris/mathtype-html-integration-devkit/src/latex.js";
import MathML from "@wiris/mathtype-html-integration-devkit/src/mathml.js";
import Telemeter from "@wiris/mathtype-html-integration-devkit/src/telemeter.js";

/**
 * This class represents the MathType integration for CKEditor5.
 * @extends {IntegrationModel}
 */
export default class CKEditor5Integration extends IntegrationModel {
  constructor(ckeditorIntegrationModelProperties) {
    const editor = ckeditorIntegrationModelProperties.editorObject;

    if (typeof editor.config !== "undefined" && typeof editor.config.get("mathTypeParameters") !== "undefined") {
      ckeditorIntegrationModelProperties.integrationParameters = editor.config.get("mathTypeParameters");
    }
    /**
     * CKEditor5 Integration.
     *
     * @param {integrationModelProperties} integrationModelAttributes
     */
    super(ckeditorIntegrationModelProperties);

    /**
     * Folder name used for the integration inside CKEditor plugins folder.
     */
    this.integrationFolderName = "ckeditor_wiris";
  }

  /**
   * @inheritdoc
   * @returns {string} - The CKEditor instance language.
   * @override
   */
  getLanguage() {
    // Returns the CKEDitor instance language taking into account that the language can be an object.
    // Try to get editorParameters.language, fail silently otherwise
    try {
      return this.editorParameters.language;
    } catch (e) {}
    const languageObject = this.editorObject.config.get("language");
    if (languageObject != null) {
      if (typeof languageObject === "object") {
        if (Object.prototype.hasOwnProperty.call(languageObject, "ui")) {
          return languageObject.ui;
        }
        return this.editorObject.locale.uiLanguage;
      }
      return languageObject;
    }
    return super.getLanguage();
  }

  /**
   * Adds callbacks to the following CKEditor listeners:
   * - 'focus' - updates the current instance.
   * - 'contentDom' - adds 'doubleclick' callback.
   * - 'doubleclick' - sets to null data.dialog property to avoid modifications for MathType formulas.
   * - 'setData' - parses the data converting MathML into images.
   * - 'afterSetData' - adds an observer to MathType formulas to avoid modifications.
   * - 'getData' - parses the data converting images into selected save mode (MathML by default).
   * - 'mode' - recalculates the active element.
   */
  addEditorListeners() {
    const editor = this.editorObject;

    if (typeof editor.config.wirislistenersdisabled === "undefined" || !editor.config.wirislistenersdisabled) {
      this.checkElement();
    }
  }

  /**
   * Checks the current container and assign events in case that it doesn't have them.
   * CKEditor replaces several times the element element during its execution,
   * so we must assign the events again to editor element.
   */
  checkElement() {
    const editor = this.editorObject;
    const newElement = editor.sourceElement;

    // If the element wasn't treated, add the events.
    if (!newElement.wirisActive) {
      this.setTarget(newElement);
      this.addEvents();
      // Set the element as treated
      newElement.wirisActive = true;
    }
  }

  /**
   * @inheritdoc
   * @param {HTMLElement} element - HTMLElement target.
   * @param {MouseEvent} event - event which trigger the handler.
   */
  doubleClickHandler(element, event) {
    this.core.editionProperties.dbclick = true;
    if (this.editorObject.isReadOnly === false) {
      if (element.nodeName.toLowerCase() === "img") {
        if (Util.containsClass(element, Configuration.get("imageClassName"))) {
          // Some plugins (image2, image) open a dialog on Double-click. On formulas
          // doubleclick event ends here.
          if (typeof event.stopPropagation !== "undefined") {
            // old I.E compatibility.
            event.stopPropagation();
          } else {
            event.returnValue = false;
          }
          this.core.getCustomEditors().disable();
          const customEditorAttr = element.getAttribute(Configuration.get("imageCustomEditorName"));
          if (customEditorAttr) {
            this.core.getCustomEditors().enable(customEditorAttr);
          }
          this.core.editionProperties.temporalImage = element;
          this.openExistingFormulaEditor();
        }
      }
    }
  }

  /** @inheritdoc */
  static getCorePath() {
    return null; // TODO
  }

  /** @inheritdoc */
  callbackFunction() {
    super.callbackFunction();
    this.addEditorListeners();
  }

  openNewFormulaEditor() {
    // Store the editor selection as it will be lost upon opening the modal
    this.core.editionProperties.selection = this.editorObject.editing.view.document.selection;

    // Focus on the selected editor when multiple editor instances are present
    WirisPlugin.currentInstance = this;

    return super.openNewFormulaEditor();
  }

  /**
   * Replaces old formula with new MathML or inserts it in caret position if new
   * @param {String} mathml MathML to update old one or insert
   * @returns {module:engine/model/element~Element} The model element corresponding to the inserted image
   */
  insertMathml(mathml) {
    return this.editorObject.model.change((writer) => {
      const { isNewElement, temporalImage } = this.getCore().editionProperties;
      const selection = this.editorObject.model.document.selection;
      const attributes = Object.fromEntries(selection.getAttributes());
      const modelElementNew = writer.createElement("mathml", { formula: mathml, ...attributes });

      if (isNewElement) {
        return this.insertNewFormula(writer, mathml, modelElementNew);
      }

      return this.replaceExistingFormula(mathml, modelElementNew, temporalImage);
    });
  }

  /**
   * Inserts a new formula at the current selection position.
   */
  insertNewFormula(writer, mathml, modelElement) {
    if (!mathml) {
      return;
    }

    const viewSelection =
      this.core.editionProperties.selection || this.editorObject.editing.view.document.selection;
    const modelPosition = this.editorObject.editing.mapper.toModelPosition(viewSelection.getLastPosition());

    this.editorObject.model.insertObject(modelElement, modelPosition);
    this.deleteViewSelection(viewSelection);

    // Set carret after the formula.
    const position = this.editorObject.model.createPositionAfter(modelElement);
    writer.setSelection(position);

    return modelElement;
  }

  deleteViewSelection(viewSelection) {
    if (viewSelection.isCollapsed) {
      return;
    }

    for (const range of viewSelection.getRanges()) {
      const modelRange = this.editorObject.editing.mapper.toModelRange(range);
      const modelSelection = this.editorObject.model.createSelection(modelRange);

      this.editorObject.model.deleteContent(modelSelection);
    }
  }

  /**
   * Replaces an existing formula with updated MathML.
   */
  replaceExistingFormula(mathml, modelElement, temporalImage) {
    const viewNode = this.editorObject.editing.view.domConverter.domToView(temporalImage);

    // Check if image exists in view to do standard formula editing
    if (viewNode?.parent) {
      const modelElementOld = this.editorObject.editing.mapper.toModelElement(viewNode.parent);

      // Insert the new <mathml> and remove the old one
      const position = this.editorObject.model.createPositionBefore(modelElementOld);

      if (mathml) {
        this.editorObject.model.insertObject(modelElement, position);
      }

      this.editorObject.model.deleteContent(this.editorObject.model.createSelection(modelElementOld, "on"));
      return modelElement;
    }

    // Otherwise it's LaTeX editing, so we insert at current selection
    if (!mathml) {
      return;
    }

    this.editorObject.model.insertContent(modelElement);

    return modelElement;
  }

  /**
   * Finds the text node corresponding to given DOM text element.
   * @param {element} viewElement Element to find corresponding text node of.
   * @returns {module:engine/model/text~Text|undefined} Text node corresponding to the given element or undefined if it doesn't exist.
   */
  findText(viewElement) {
    // eslint-disable-line consistent-return
    // mapper always converts text nodes to *new* model elements so we need to convert the text's parents and then come back down
    let pivot = viewElement;
    let element;
    while (!element) {
      element = this.editorObject.editing.mapper.toModelElement(
        this.editorObject.editing.view.domConverter.domToView(pivot),
      );
      pivot = pivot.parentElement;
    }

    // Navigate through all the subtree under `pivot` in order to find the correct text node
    const range = this.editorObject.model.createRangeIn(element);
    const descendants = Array.from(range.getItems());
    for (const node of descendants) {
      let viewElementData = viewElement.data;
      if (viewElement.nodeType === 3) {
        // Remove invisible white spaces
        viewElementData = viewElementData.replaceAll(String.fromCharCode(8288), "");
      }
      if (node.is("textProxy") && node.data === viewElementData.replace(String.fromCharCode(160), " ")) {
        return node.textNode;
      }
    }
  }

  /** @inheritdoc */
  insertFormula(_focusElement, windowTarget, mathml, _wirisProperties) {
    // eslint-disable-line no-unused-vars
    const returnObject = {};
    let mathmlOrigin;

    if (!mathml) {
      this.insertMathml("");
    } else if (this.core.editMode === "latex") {
      this.handleLatexInsertion(returnObject, windowTarget, mathml);
    } else {
      mathmlOrigin = this.handleMathmlInsertion(returnObject, windowTarget, mathml);
    }

    const payload = {
      mathml: mathml ? MathML.safeXmlDecode(mathml) : undefined,
      elapsed_time: Date.now() - this.core.editionProperties.editionStartTime,
      toolbar: this.core.modalDialog.contentManager.toolbar,
      size: mathml?.length,
    };

    if (mathmlOrigin) {
      payload.mathml_origin = MathML.safeXmlDecode(mathmlOrigin);
    }

    try {
      Telemeter.telemeter.track("INSERTED_FORMULA", {
        ...payload,
      });
    } catch (error) {
      console.error("Error tracking INSERTED_FORMULA", error);
    }

    this.core.editionProperties.temporalImage = null;

    return returnObject;
  }

  handleLatexInsertion(returnObject, windowTarget, mathml) {
    returnObject.latex = Latex.getLatexFromMathML(mathml);
    returnObject.node = windowTarget.document.createTextNode(`$$${returnObject.latex}$$`);

    const { latexRange } = this.core.editionProperties;

    // When latexRange exists (meaning the whole LaTeX was selected or the editor was opened),
    // find the node contaning the LaTeX and replace it fully.
    if (latexRange) {
      const startNode = this.findText(latexRange.startContainer);
      const endNode = this.findText(latexRange.endContainer);

      // If nodes found, use standard replacement.
      if (startNode && endNode) {
        this.replaceLatexWithNodes(startNode, endNode, latexRange, returnObject.latex);
        return;
      }
    }

    this.replaceLatexUsingModelSearch(returnObject.latex);
  }

  handleMathmlInsertion(returnObject, windowTarget, mathml) {
    const mathmlOrigin = this.core.editionProperties.temporalImage?.dataset.mathml;

    try {
      const modelElement = this.insertMathml(mathml);
      const viewElement = this.editorObject.editing.mapper.toViewElement(modelElement);

      returnObject.node = this.editorObject.editing.view.domConverter.viewToDom(viewElement, windowTarget.document);
    } catch (error) {
      if (error.toString().includes("Cannot read property 'parent' of undefined")) {
        this.core.modalDialog.cancelAction();
      }
    }

    return mathmlOrigin;
  }

  /**
   * Gets selection attributes excluding track changes tags.
   */
  getCleanSelectionAttributes() {
    const attributes = {};

    for (const [key, value] of this.editorObject.model.document.selection.getAttributes()) {
      if (!key.startsWith("suggestion:") && !key.startsWith("comment:")) {
        attributes[key] = value;
      }
    }

    return attributes;
  }

  /**
   * Searches for the original LaTeX in the model and replaces it.
   * Fallback when findText() cannot locate DOM nodes (like when there are track changes modifications).
   */
  replaceLatexUsingModelSearch(newLatex) {
    const foundRange = this.findLatexBlockNearSelection();

    if (foundRange) {
      this.editorObject.model.change((writer) => writer.setSelection(foundRange));
      this.replaceRangeWithLatex(newLatex);
    } else {
      // Insert at current position as a last resort.
      this.editorObject.model.change((writer) => {
        const newLatexText = writer.createText(`$$${newLatex}$$`, this.getCleanSelectionAttributes());
        this.editorObject.model.insertContent(newLatexText);
      });
    }

    this.core.editionProperties.extractedLatex = null;
  }

  /**
   * Checks if a text proxy has a track changes deletion marker.
   */
  isDeletedText(text) {
    for (const [key, value] of text.getAttributes()) {
      if (key.startsWith("suggestion:") && value === "deletion") {
        return true;
      }
    }

    return false;
  }

  /**
   * Finds a LaTeX block ($$...$$) near the current selection.
   * Handles track changes by considering the "accepted" version of text.
   */
  findLatexBlockNearSelection() {
    const position = this.editorObject.model.document.selection.getFirstPosition();

    if (!position?.parent) {
      return;
    }

    // Build LaTeX with track changes accepted suggestions, if any.
    const { textParts, acceptedText } = this.collectTextParts(position.parent);

    if (!acceptedText.includes("$$")) {
      return;
    }

    // To handle multiple LaTeX on same line.
    const targetLatex = this.core.editionProperties.extractedLatex;
    const fullLatex = `$$${targetLatex}$$`;
    let startIndex = acceptedText.indexOf(fullLatex);

    // If exact match not found, try to find LaTeX boundaries using caret position
    if (startIndex === -1) {
      const latexBoundaries = this.findLatexBoundariesNearCaret(acceptedText, position);

      if (latexBoundaries) {
        startIndex = latexBoundaries.start;

        return this.convertAcceptedOffsetsToModelRange(textParts, {
          start: startIndex,
          end: latexBoundaries.end
        });
      }

      return;
    }

    const latexBoundaries = { start: startIndex, end: startIndex + fullLatex.length };

    return this.convertAcceptedOffsetsToModelRange(textParts, latexBoundaries);
  }

  /**
   * Finds LaTeX boundaries around the caret position when exact match fails.
   */
  findLatexBoundariesNearCaret(acceptedText, position) {
    // Calculate approximate caret position in accepted text
    const caretOffset = this.calculateCaretOffsetInAcceptedText(position);

    // Find the LaTeX block containing the caret
    let searchIndex = 0;
    while (searchIndex < acceptedText.length) {
      const openDelim = acceptedText.indexOf("$$", searchIndex);
      if (openDelim === -1) {
        break;
      }

      const closeDelim = acceptedText.indexOf("$$", openDelim + 2);
      if (closeDelim === -1) {
        break;
      }

      // Check if caret is within this LaTeX block
      if (caretOffset >= openDelim && caretOffset <= closeDelim + 2) {
        return { start: openDelim, end: closeDelim + 2 };
      }

      searchIndex = closeDelim + 2;
    }

    return null;
  }

  /**
   * Calculates the caret offset within the accepted text.
   */
  calculateCaretOffsetInAcceptedText(position) {
    let offset = 0;
    const range = this.editorObject.model.createRangeIn(position.parent);

    for (const item of range.getItems()) {
      if (item.is("$textProxy")) {
        const itemPosition = this.editorObject.model.createPositionAt(item.textNode.parent, item.startOffset);

        if (itemPosition.isAfter(position)) {
          break;
        }

        if (!this.isDeletedText(item)) {
          offset += item.data.length;
        }
      }
    }

    return offset;
  }

  /**
   * Collects all text fragments from a paragraph, tracking both model and accepted text positions.
   * This is necessary to handle track changes where some LaTeX may have suggestions.
   */
  collectTextParts(paragraph) {
    const textParts = [];
    let acceptedTextOffset = 0;
    let acceptedText = "";

    for (const item of this.editorObject.model.createRangeIn(paragraph).getItems()) {
      if (item.is("$textProxy")) {
        const isDeleted = this.isDeletedText(item);

        textParts.push({
          text: item.data,
          startOffset: item.startOffset,
          endOffset: item.startOffset + item.data.length,
          parent: item.textNode.parent,
          acceptedStart: isDeleted ? null : acceptedTextOffset,
          acceptedEnd: isDeleted ? null : acceptedTextOffset + item.data.length,
          isDeleted
        });

        if (!isDeleted) {
          acceptedText += item.data;
          acceptedTextOffset += item.data.length;
        }
      }
    }
    return { textParts, acceptedText };
  }

  /**
   * Converts LaTeX with track changes accepted suggestions to a CKEditor model Range.
   */
  convertAcceptedOffsetsToModelRange(textParts, latexBoundaries) {
    const boundaries = this.findLatexBoundariesInTextParts(textParts, latexBoundaries);
    if (!boundaries) {
      return;
    }

    const expandedBoundaries = this.expandRangeToIncludeLatexDeletions(textParts, boundaries);

    return this.createModelRangeFromBoundaries(textParts, expandedBoundaries);
  }

  /**
   * Finds which text parts contain the LaTeX block boundaries.
   */
  findLatexBoundariesInTextParts(textParts, latexBoundaries) {
    let startPartIndex = -1, endPartIndex = -1;
    let startOffsetInPart = 0, endOffsetInPart = 0;

    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i];
      if (part.isDeleted) continue;

      if (startPartIndex === -1 && this.isOffsetInPart(latexBoundaries.start, part)) {
        startPartIndex = i;
        startOffsetInPart = latexBoundaries.start - part.acceptedStart;
      }

      if (this.isOffsetInPart(latexBoundaries.end, part)) {
        endPartIndex = i;
        endOffsetInPart = latexBoundaries.end - part.acceptedStart;
      }
    }

    return startPartIndex !== -1 && endPartIndex !== -1
      ? { startPartIndex, endPartIndex, startOffsetInPart, endOffsetInPart }
      : null;
  }

  /**
   * Checks if an offset falls within a text part's accepted range.
   */
  isOffsetInPart(offset, part) {
    return offset >= part.acceptedStart && offset <= part.acceptedEnd;
  }

  /**
   * Expands range to include deleted LaTeX parts (like $ delimiters).
   */
  expandRangeToIncludeLatexDeletions(textParts, boundaries) {
    let { startPartIndex, endPartIndex, startOffsetInPart, endOffsetInPart } = boundaries;

    // Extend backwards for deleted LaTeX delimiters
    const backwardExpansion = this.findBackwardLatexDeletions(textParts, startPartIndex);
    if (backwardExpansion.found) {
      startPartIndex = backwardExpansion.index;
      startOffsetInPart = 0;
    }

    // Extend forwards for deleted LaTeX delimiters
    const forwardExpansion = this.findForwardLatexDeletions(textParts, endPartIndex);
    if (forwardExpansion.found) {
      endPartIndex = forwardExpansion.index;
      endOffsetInPart = textParts[forwardExpansion.index].text.length;
    }

    // Include any deleted parts within the range
    const internalExpansion = this.findInternalLatexDeletions(textParts, startPartIndex, endPartIndex);
    if (internalExpansion.startFound) {
      startPartIndex = internalExpansion.startIndex;
      startOffsetInPart = 0;
    }
    if (internalExpansion.endFound) {
      endPartIndex = internalExpansion.endIndex;
      endOffsetInPart = textParts[internalExpansion.endIndex].text.length;
    }

    return { startPartIndex, endPartIndex, startOffsetInPart, endOffsetInPart };
  }

  /**
   * Finds deleted LaTeX parts before the start boundary.
   */
  findBackwardLatexDeletions(textParts, startIndex) {
    for (let i = startIndex - 1; i >= 0 && textParts[i].isDeleted; i--) {
      if (textParts[i].text.includes('$')) {
        return { found: true, index: i };
      }
    }
    return { found: false };
  }

  /**
   * Finds deleted LaTeX parts after the end boundary.
   */
  findForwardLatexDeletions(textParts, endIndex) {
    for (let i = endIndex + 1; i < textParts.length && textParts[i].isDeleted; i++) {
      if (textParts[i].text.includes('$')) {
        return { found: true, index: i };
      }
    }
    return { found: false };
  }

  /**
   * Finds deleted LaTeX parts within the current range.
   */
  findInternalLatexDeletions(textParts, startIndex, endIndex) {
    let startFound = false, endFound = false;
    let startExpandIndex = startIndex, endExpandIndex = endIndex;

    for (let i = startIndex; i <= endIndex; i++) {
      if (textParts[i].isDeleted) {
        if (i < startIndex && !startFound) {
          startExpandIndex = i;
          startFound = true;
        }
        if (i > endIndex && !endFound) {
          endExpandIndex = i;
          endFound = true;
        }
      }
    }

    return { startFound, endFound, startIndex: startExpandIndex, endIndex: endExpandIndex };
  }

  /**
   * Creates a CKEditor model range from the calculated boundaries.
   */
  createModelRangeFromBoundaries(textParts, boundaries) {
    const { startPartIndex, endPartIndex, startOffsetInPart, endOffsetInPart } = boundaries;
    const startPart = textParts[startPartIndex];
    const endPart = textParts[endPartIndex];

    return this.editorObject.model.createRange(
      this.editorObject.model.createPositionAt(startPart.parent, startPart.startOffset + startOffsetInPart),
      this.editorObject.model.createPositionAt(endPart.parent, endPart.startOffset + endOffsetInPart)
    );
  }

  replaceRangeWithLatex(newLatex) {
    this.editorObject.model.change((writer) => {
      this.editorObject.model.deleteContent(this.editorObject.model.document.selection);

      const newLatexText = writer.createText(`$$${newLatex}$$`, this.getCleanSelectionAttributes());
      this.editorObject.model.insertContent(newLatexText);
    });
  }

  /**
   * Replaces the whole LaTeX in the CKEditor5 model.
   */
  replaceLatexWithNodes(startNode, endNode, latexRange, newLatex) {
    this.editorObject.model.change((writer) => {
      const startOffset = startNode.startOffset + latexRange.startOffset;
      const endOffset = endNode.startOffset + latexRange.endOffset;

      let startPosition = writer.createPositionAt(startNode.parent, startOffset);
      let endPosition = writer.createPositionAt(endNode.parent, endOffset);

      // Adjust positions when LaTeX is adjacent to a formula.
      const startContainer = latexRange.startContainer;
      if (startContainer.nodeType === Node.TEXT_NODE && startContainer.previousSibling?.nodeType === Node.ELEMENT_NODE) {
        const originalLatex = `$$${Latex.getLatexFromMathML(
          MathML.safeXmlDecode(this.core.editionProperties.temporalImage.dataset.mathml),
        )}$$`;
        const textData = startContainer.data.replaceAll(String.fromCodePoint(8288), "");
        const latexOffset = textData.indexOf(originalLatex);

        if (latexOffset !== -1) {
          const closingDelimiterOffset = textData.substring(latexOffset + 2).indexOf("$$") + 4;
          startPosition = writer.createPositionAt(startNode.parent, startNode.startOffset + latexOffset);
          endPosition = writer.createPositionAt(endNode.parent, endNode.startOffset + closingDelimiterOffset + latexOffset);
        }
      }

      writer.setSelection(writer.createRange(startPosition, endPosition));
    });

    this.replaceRangeWithLatex(newLatex);
  }

  /**
   * Inherited method from IntegrationModel.
   * Gets the MathML from a text node containing LaTeX.
   * Handles track changes by simulating "accept all changes" before conversion.
   */
  getMathmlFromTextNode(textNode, caretPosition) {
    const standardResult = Latex.getLatexFromTextNode(textNode, caretPosition);
    const acceptedLatex = this.extractAcceptedLatexFromDOM(textNode, caretPosition);

    // Prioritize accepted LaTeX if it differs from standard extraction (for track changes compatibility).
    // Important node: use explicit undefined check to allow empty LaTeX strings, otherwise it would not detect $$$$ as valid LaTeX.
    const latex = (acceptedLatex !== undefined && acceptedLatex !== standardResult?.latex)
      ? acceptedLatex
      : standardResult?.latex;

    // Do not continue if no LaTeX found by either method.
    // This is necessary since both parameters can be independently undefined in some edge cases.
    if (latex === undefined && acceptedLatex === undefined) {
      return;
    }

    // Verify caret is inside LaTeX block for track changes edge cases.
    if (!standardResult && acceptedLatex !== undefined && !this.isCaretInsideLatexBlock(textNode, caretPosition)) {
      return;
    }

    const finalLatex = latex === undefined ? acceptedLatex : latex;

    this.storeLatexRangeWithFallback(textNode, caretPosition, finalLatex);

    return Latex.getMathMLFromLatex(finalLatex);
  }

  isCaretInsideLatexBlock(textNode, caretPosition = 0) {
    // If LaTeX is found, the caret is inside one.
    return this.extractAcceptedLatexFromDOM(textNode, caretPosition) !== undefined;
  }

  /**
   * Stores the LaTeX range for its replacement later.
   */
  storeLatexRangeWithFallback(textNode, caretPosition, latex) {
    const parentTag = textNode.parentElement?.tagName?.toLowerCase();

    if (!textNode.parentElement || parentTag === "textarea") {
      return;
    }

    const latexResult = Latex.getLatexFromTextNode(textNode, caretPosition);

    if (latexResult) {
      const range = document.createRange();

      range.setStart(latexResult.startNode, latexResult.startPosition);
      range.setEnd(latexResult.endNode, latexResult.endPosition);
      this.core.editionProperties.latexRange = range;
    } else {
      this.core.editionProperties.latexRange = null;
    }

    this.core.editionProperties.extractedLatex = latex;
  }

  /**
   * Finds a container element containing a complete LaTeX block.
   * Necessary for track changes handling, to find the full LaTeX even with the suggestions.
   */
  findLatexContainerElement(textNode) {
    const MAX_DEPTH = 10; // Prevent excessive loops.
    let element = textNode.parentElement;

    for (let i = 0; i < MAX_DEPTH && element; i++) {
      const text = element.textContent || "";
      const openDelim = text.indexOf("$$");

      if (openDelim !== -1 && text.includes("$$", openDelim + 2)) {
        return element;
      }

      element = element.parentElement;
    }

    return null;
  }

  /**
   * Extracts LaTeX from DOM, skipping track changes deletion markers.
   */
  extractAcceptedLatexFromDOM(textNode, caretPositionInNode = 0) {
    const container = this.findLatexContainerElement(textNode);

    if (!container) {
      return;
    }

    const acceptedText = this.getAcceptedTextContent(container);

    // Calculate caret offset that will be used later to find the correct LaTeX block.
    // This includes all accepted text before textNode, plus the caret position within textNode.
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    let caretOffset = 0;

    while (node && node !== textNode) {
      if (!node.parentElement?.classList?.contains("ck-suggestion-marker-deletion")) {
        caretOffset += node.textContent?.length || 0;
      }

      node = walker.nextNode();
    }

    // Add the caret position within the text node, only if textNode is not deleted by Track Changes.
    if (node === textNode && !textNode.parentElement?.classList?.contains("ck-suggestion-marker-deletion")) {
      caretOffset += caretPositionInNode;
    }

    // Find the LaTeX block that contains the caret.
    let nextSearchIndex = 0;

    while (nextSearchIndex < acceptedText.length) {
      const openDelim = acceptedText.indexOf("$$", nextSearchIndex);

      if (openDelim === -1) {
        break;
      }

      const closeDelim = acceptedText.indexOf("$$", openDelim + 2);

      if (closeDelim === -1) {
        break;
      }

      if (caretOffset >= openDelim && caretOffset <= closeDelim + 2) {
        return acceptedText.substring(openDelim + 2, closeDelim);
      }

      nextSearchIndex = closeDelim + 2;
    }
  }

  /**
   * Recursively extracts text content, skipping track changes tags.
   */
  getAcceptedTextContent(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || "";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList?.contains("ck-suggestion-marker-deletion")) {
        return "";
      }

      return Array.from(node.childNodes).map((child) => this.getAcceptedTextContent(child)).join("");
    }

    return "";
  }

  /** Called when the modal window is closed. */
  notifyWindowClosed() {
    this.editorObject.editing.view.focus();
  }
}
