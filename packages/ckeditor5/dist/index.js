import { Command, Plugin } from '@ckeditor/ckeditor5-core/dist/index.js';
import { ButtonView } from '@ckeditor/ckeditor5-ui/dist/index.js';
import { ClickObserver, XmlDataProcessor, ViewUpcastWriter, HtmlDataProcessor } from '@ckeditor/ckeditor5-engine/dist/index.js';
import { Widget, viewToModelPositionOutsideModelElement, toWidget } from '@ckeditor/ckeditor5-widget/dist/index.js';
import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel.js';
import Core from '@wiris/mathtype-html-integration-devkit/src/core.src.js';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser.js';
import Util from '@wiris/mathtype-html-integration-devkit/src/util.js';
import Image from '@wiris/mathtype-html-integration-devkit/src/image.js';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration.js';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners.js';
import MathML from '@wiris/mathtype-html-integration-devkit/src/mathml.js';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex.js';
import StringManager from '@wiris/mathtype-html-integration-devkit/src/stringmanager.js';
import '@wiris/mathtype-html-integration-devkit/src/md5.js';
import Telemeter from '@wiris/mathtype-html-integration-devkit/src/telemeter.js';

/**
 * This class represents the MathType integration for CKEditor5.
 * @extends {IntegrationModel}
 */ class CKEditor5Integration extends IntegrationModel {
    constructor(ckeditorIntegrationModelProperties){
        const editor = ckeditorIntegrationModelProperties.editorObject;
        if (typeof editor.config !== "undefined" && typeof editor.config.get("mathTypeParameters") !== "undefined") {
            ckeditorIntegrationModelProperties.integrationParameters = editor.config.get("mathTypeParameters");
        }
        /**
     * CKEditor5 Integration.
     *
     * @param {integrationModelProperties} integrationModelAttributes
     */ super(ckeditorIntegrationModelProperties);
        /**
     * Folder name used for the integration inside CKEditor plugins folder.
     */ this.integrationFolderName = "ckeditor_wiris";
    }
    /**
   * @inheritdoc
   * @returns {string} - The CKEditor instance language.
   * @override
   */ getLanguage() {
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
   */ addEditorListeners() {
        const editor = this.editorObject;
        if (typeof editor.config.wirislistenersdisabled === "undefined" || !editor.config.wirislistenersdisabled) {
            this.checkElement();
        }
    }
    /**
   * Checks the current container and assign events in case that it doesn't have them.
   * CKEditor replaces several times the element element during its execution,
   * so we must assign the events again to editor element.
   */ checkElement() {
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
   */ doubleClickHandler(element, event) {
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
    /** @inheritdoc */ static getCorePath() {
        return null; // TODO
    }
    /** @inheritdoc */ callbackFunction() {
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
   */ insertMathml(mathml) {
        return this.editorObject.model.change((writer)=>{
            const { isNewElement, temporalImage } = this.getCore().editionProperties;
            const selection = this.editorObject.model.document.selection;
            const attributes = Object.fromEntries(selection.getAttributes());
            const modelElementNew = writer.createElement("mathml", {
                formula: mathml,
                ...attributes
            });
            if (isNewElement) {
                return this.insertNewFormula(writer, mathml, modelElementNew);
            }
            return this.replaceExistingFormula(mathml, modelElementNew, temporalImage);
        });
    }
    /**
   * Inserts a new formula at the current selection position.
   */ insertNewFormula(writer, mathml, modelElement) {
        if (!mathml) {
            return;
        }
        const viewSelection = this.core.editionProperties.selection || this.editorObject.editing.view.document.selection;
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
        for (const range of viewSelection.getRanges()){
            const modelRange = this.editorObject.editing.mapper.toModelRange(range);
            const modelSelection = this.editorObject.model.createSelection(modelRange);
            this.editorObject.model.deleteContent(modelSelection);
        }
    }
    /**
   * Replaces an existing formula with updated MathML.
   */ replaceExistingFormula(mathml, modelElement, temporalImage) {
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
   */ findText(viewElement) {
        // eslint-disable-line consistent-return
        // mapper always converts text nodes to *new* model elements so we need to convert the text's parents and then come back down
        let pivot = viewElement;
        let element;
        while(!element){
            element = this.editorObject.editing.mapper.toModelElement(this.editorObject.editing.view.domConverter.domToView(pivot));
            pivot = pivot.parentElement;
        }
        // Navigate through all the subtree under `pivot` in order to find the correct text node
        const range = this.editorObject.model.createRangeIn(element);
        const descendants = Array.from(range.getItems());
        for (const node of descendants){
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
    /** @inheritdoc */ insertFormula(_focusElement, windowTarget, mathml, _wirisProperties) {
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
            size: mathml?.length
        };
        if (mathmlOrigin) {
            payload.mathml_origin = MathML.safeXmlDecode(mathmlOrigin);
        }
        try {
            Telemeter.telemeter.track("INSERTED_FORMULA", {
                ...payload
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
   */ getCleanSelectionAttributes() {
        const attributes = {};
        for (const [key, value] of this.editorObject.model.document.selection.getAttributes()){
            if (!key.startsWith("suggestion:") && !key.startsWith("comment:")) {
                attributes[key] = value;
            }
        }
        return attributes;
    }
    /**
   * Searches for the original LaTeX in the model and replaces it.
   * Fallback when findText() cannot locate DOM nodes (like when there are track changes modifications).
   */ replaceLatexUsingModelSearch(newLatex) {
        const foundRange = this.findLatexBlockNearSelection();
        if (foundRange) {
            this.editorObject.model.change((writer)=>writer.setSelection(foundRange));
            this.replaceRangeWithLatex(newLatex);
        } else {
            // Insert at current position as a last resort.
            this.editorObject.model.change((writer)=>{
                const newLatexText = writer.createText(`$$${newLatex}$$`, this.getCleanSelectionAttributes());
                this.editorObject.model.insertContent(newLatexText);
            });
        }
        this.core.editionProperties.extractedLatex = null;
    }
    /**
   * Checks if a text proxy has a track changes deletion marker.
   */ isDeletedText(text) {
        for (const [key, value] of text.getAttributes()){
            if (key.startsWith("suggestion:") && value === "deletion") {
                return true;
            }
        }
        return false;
    }
    /**
   * Finds a LaTeX block ($$...$$) near the current selection.
   * Handles track changes by considering the "accepted" version of text.
   */ findLatexBlockNearSelection() {
        const position = this.editorObject.model.document.selection.getFirstPosition();
        if (!position?.parent) {
            return;
        }
        // Build LaTeX with track changes accepted suggestions, if any.
        const { textParts, acceptedText } = this.collectTextParts(position.parent);
        if (!acceptedText.includes("$$")) {
            return;
        }
        // Use the stored LaTeX to find the correct block (handles multiple LaTeX on same line)
        const targetLatex = this.core.editionProperties.extractedLatex;
        const fullLatex = `$$${targetLatex}$$`;
        const startIndex = acceptedText.indexOf(fullLatex);
        if (startIndex === -1) {
            return;
        }
        const latexBoundaries = {
            start: startIndex,
            end: startIndex + fullLatex.length
        };
        return this.convertAcceptedOffsetsToModelRange(textParts, latexBoundaries);
    }
    /**
   * Collects all text fragments from a paragraph, tracking both model and accepted text positions.
   * This is necessary to handle track changes where some LaTeX may have suggestions.
   */ collectTextParts(paragraph) {
        const textParts = [];
        let acceptedTextOffset = 0;
        let acceptedText = "";
        for (const item of this.editorObject.model.createRangeIn(paragraph).getItems()){
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
        return {
            textParts,
            acceptedText
        };
    }
    /**
   * Converts LaTeX with track changes accepted suggestions to a CKEditor model Range.
   */ convertAcceptedOffsetsToModelRange(textParts, latexBoundaries) {
        let startPartIndex = -1, endPartIndex = -1;
        let startOffsetInPart = 0, endOffsetInPart = 0;
        // Find which text parts contain the LaTeX block boundaries
        for(let i = 0; i < textParts.length; i++){
            const part = textParts[i];
            if (part.isDeleted) continue;
            if (startPartIndex === -1 && latexBoundaries.start >= part.acceptedStart && latexBoundaries.start <= part.acceptedEnd) {
                startPartIndex = i;
                startOffsetInPart = latexBoundaries.start - part.acceptedStart;
            }
            if (latexBoundaries.end >= part.acceptedStart && latexBoundaries.end <= part.acceptedEnd) {
                endPartIndex = i;
                endOffsetInPart = latexBoundaries.end - part.acceptedStart;
            }
        }
        if (startPartIndex === -1 || endPartIndex === -1) {
            return;
        }
        // Extend range to include any consecutive deleted parts after the block.
        let finalEndIndex = endPartIndex;
        let finalEndOffset = endOffsetInPart;
        for(let i = endPartIndex + 1; i < textParts.length && textParts[i].isDeleted; i++){
            finalEndIndex = i;
            finalEndOffset = textParts[i].text.length;
        }
        const startPart = textParts[startPartIndex];
        const endPart = textParts[finalEndIndex];
        return this.editorObject.model.createRange(this.editorObject.model.createPositionAt(startPart.parent, startPart.startOffset + startOffsetInPart), this.editorObject.model.createPositionAt(endPart.parent, endPart.startOffset + finalEndOffset));
    }
    replaceRangeWithLatex(newLatex) {
        this.editorObject.model.change((writer)=>{
            this.editorObject.model.deleteContent(this.editorObject.model.document.selection);
            const newLatexText = writer.createText(`$$${newLatex}$$`, this.getCleanSelectionAttributes());
            this.editorObject.model.insertContent(newLatexText);
        });
    }
    /**
   * Replaces the whole LaTeX in the CKEditor5 model.
   */ replaceLatexWithNodes(startNode, endNode, latexRange, newLatex) {
        this.editorObject.model.change((writer)=>{
            const startOffset = startNode.startOffset + latexRange.startOffset;
            const endOffset = endNode.startOffset + latexRange.endOffset;
            let startPosition = writer.createPositionAt(startNode.parent, startOffset);
            let endPosition = writer.createPositionAt(endNode.parent, endOffset);
            // Adjust positions when LaTeX is adjacent to a formula.
            const startContainer = latexRange.startContainer;
            if (startContainer.nodeType === Node.TEXT_NODE && startContainer.previousSibling?.nodeType === Node.ELEMENT_NODE) {
                const originalLatex = `$$${Latex.getLatexFromMathML(MathML.safeXmlDecode(this.core.editionProperties.temporalImage.dataset.mathml))}$$`;
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
   */ getMathmlFromTextNode(textNode, caretPosition) {
        const standardResult = Latex.getLatexFromTextNode(textNode, caretPosition);
        const acceptedLatex = this.extractAcceptedLatexFromDOM(textNode);
        // Prioritize accepted LaTeX if it differs from standard extraction (for track changes compatibility).
        const latex = acceptedLatex && acceptedLatex !== standardResult?.latex ? acceptedLatex : standardResult?.latex;
        if (!latex && !acceptedLatex) {
            return;
        }
        // Verify caret is inside LaTeX block for track changes edge cases.
        if (!standardResult && acceptedLatex && !this.isCaretInsideLatexBlock(textNode)) {
            return;
        }
        this.storeLatexRangeWithFallback(textNode, caretPosition, latex || acceptedLatex);
        return Latex.getMathMLFromLatex(latex || acceptedLatex);
    }
    isCaretInsideLatexBlock(textNode) {
        // If extractAcceptedLatexFromDOM finds a LaTeX, the caret is inside one
        return !!this.extractAcceptedLatexFromDOM(textNode);
    }
    /**
   * Stores the LaTeX range for its replacement later.
   */ storeLatexRangeWithFallback(textNode, caretPosition, latex) {
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
   */ findLatexContainerElement(textNode) {
        const MAX_DEPTH = 10; // Prevent excessive loops.
        let element = textNode.parentElement;
        for(let i = 0; i < MAX_DEPTH && element; i++){
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
   * Finds the LaTeX block containing the caret position.
   */ extractAcceptedLatexFromDOM(textNode) {
        const container = this.findLatexContainerElement(textNode);
        if (!container) {
            return;
        }
        const acceptedText = this.getAcceptedTextContent(container);
        // Calculate caret offset by summing text lengths before the caret's text node
        let caretOffset = 0;
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while(node && node !== textNode){
            if (!node.parentElement?.classList?.contains("ck-suggestion-marker-deletion")) {
                caretOffset += node.textContent?.length || 0;
            }
            node = walker.nextNode();
        }
        // Find the LaTeX block that contains the caret
        let searchStart = 0;
        while(searchStart < acceptedText.length){
            const openDelim = acceptedText.indexOf("$$", searchStart);
            if (openDelim === -1) break;
            const closeDelim = acceptedText.indexOf("$$", openDelim + 2);
            if (closeDelim === -1) break;
            if (caretOffset >= openDelim && caretOffset <= closeDelim + 2) {
                return acceptedText.substring(openDelim + 2, closeDelim);
            }
            searchStart = closeDelim + 2;
        }
    }
    /**
   * Recursively extracts text content, skipping track changes tags.
   */ getAcceptedTextContent(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || "";
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList?.contains("ck-suggestion-marker-deletion")) {
                return "";
            }
            return Array.from(node.childNodes).map((child)=>this.getAcceptedTextContent(child)).join("");
        }
        return "";
    }
    /** Called when the modal window is closed. */ notifyWindowClosed() {
        this.editorObject.editing.view.focus();
    }
}

/**
 * Command for opening the MathType editor
 */ class MathTypeCommand extends Command {
    execute(options = {}) {
        // Check we get a valid integration
        // eslint-disable-next-line no-prototype-builtins
        if (!options.hasOwnProperty("integration") || !(options.integration instanceof CKEditor5Integration)) {
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
   */ setEditor() {
        // It's possible that a custom editor was last used.
        // We need to disable it to avoid wrong behaviors.
        this.integration.core.getCustomEditors().disable();
    }
    /**
   * Checks whether we are editing an existing formula or a new one and opens the editor.
   */ openEditor() {
        this.integration.core.editionProperties.dbclick = false;
        const image = this._getSelectedImage();
        if (typeof image !== "undefined" && image !== null && image.classList.contains(WirisPlugin.Configuration.get("imageClassName"))) {
            this.integration.core.editionProperties.temporalImage = image;
            this.integration.openExistingFormulaEditor();
        } else {
            this.integration.openNewFormulaEditor();
        }
    }
    /**
   * Gets the currently selected formula image
   * @returns {Element} selected image, if any, undefined otherwise
   */ _getSelectedImage() {
        const { selection } = this.editor.editing.view.document;
        // If we can not extract the formula, fall back to default behavior.
        if (selection.isCollapsed || selection.rangeCount !== 1) {
            return;
        }
        // Look for the <span> wrapping the formula and then for the <img/> inside
        const range = selection.getFirstRange();
        let image;
        for (const span of range){
            if (span.item.name !== "span") {
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
 */ class ChemTypeCommand extends MathTypeCommand {
    setEditor() {
        this.integration.core.getCustomEditors().enable("chemistry");
    }
}

var mathIcon = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 300 261.7\" style=\"enable-background:new 0 0 300 261.7;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:#FFFFFF;}\n\t.st1{fill:#EF4A5F;}\n\t.st2{fill:#C8202F;}\n</style>\n<path class=\"st0\" d=\"M300,32.8c0-16.4-13.4-29.7-29.9-29.7c-2.9,0-7.2,0.8-7.2,0.8c-37.9,9.1-71.3,14-112,14c-0.3,0-0.6,0-1,0\n\tc-16.5,0-29.9,13.3-29.9,29.7c0,16.4,13.4,29.7,29.9,29.7l0,0c45.3,0,83.1-5.3,125.3-15.3h0C289.3,59.5,300,47.4,300,32.8\"/>\n<path class=\"st0\" d=\"M90.2,257.7c-11.4,0-21.9-6.4-27-16.7l-60-119.9c-7.5-14.9-1.4-33.1,13.5-40.5c14.9-7.5,33.1-1.4,40.5,13.5\n\tl27.3,54.7L121.1,39c5.3-15.8,22.4-24.4,38.2-19.1c15.8,5.3,24.4,22.4,19.1,38.2l-59.6,179c-3.9,11.6-14.3,19.7-26.5,20.6\n\tC91.6,257.7,90.9,257.7,90.2,257.7\"/>\n<g>\n\t<g>\n\t\t<path class=\"st1\" d=\"M90.2,257.7c-11.4,0-21.9-6.4-27-16.7l-60-119.9c-7.5-14.9-1.4-33.1,13.5-40.5c14.9-7.5,33.1-1.4,40.5,13.5\n\t\t\tl27.3,54.7L121.1,39c5.3-15.8,22.4-24.4,38.2-19.1c15.8,5.3,24.4,22.4,19.1,38.2l-59.6,179c-3.9,11.6-14.3,19.7-26.5,20.6\n\t\t\tC91.6,257.7,90.9,257.7,90.2,257.7\"/>\n\t</g>\n</g>\n<g>\n\t<g>\n\t\t<path class=\"st2\" d=\"M300,32.8c0-16.4-13.4-29.7-29.9-29.7c-2.9,0-7.2,0.8-7.2,0.8c-37.9,9.1-71.3,14-112,14c-0.3,0-0.6,0-1,0\n\t\t\tc-16.5,0-29.9,13.3-29.9,29.7c0,16.4,13.4,29.7,29.9,29.7l0,0c45.3,0,83.1-5.3,125.3-15.3h0C289.3,59.5,300,47.4,300,32.8\"/>\n\t</g>\n</g>\n</svg>\n";

var chemIcon = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<!-- Generator: Adobe Illustrator 22.0.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t viewBox=\"0 0 40.3 49.5\" style=\"enable-background:new 0 0 40.3 49.5;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n\t.st0{fill:#A4CF61;}\n</style>\n<path class=\"st0\" d=\"M39.2,12.1c0-1.9-1.1-3.6-2.7-4.4L24.5,0.9l0,0c-0.7-0.4-1.5-0.6-2.4-0.6c-0.9,0-1.7,0.2-2.4,0.6l0,0L2.3,10.8\n\tl0,0C0.9,11.7,0,13.2,0,14.9h0v19.6h0c0,1.7,0.9,3.3,2.3,4.1l0,0l17.4,9.9l0,0c0.7,0.4,1.5,0.6,2.4,0.6c0.9,0,1.7-0.2,2.4-0.6l0,0\n\tl12.2-6.9h0c1.5-0.8,2.6-2.5,2.6-4.3c0-2.7-2.2-4.9-4.9-4.9c-0.9,0-1.8,0.3-2.5,0.7l0,0l-9.7,5.6l-12.3-7V17.8l12.3-7l9.9,5.7l0,0\n\tc0.7,0.4,1.5,0.6,2.4,0.6C37,17,39.2,14.8,39.2,12.1\"/>\n</svg>\n";

var version = "8.15.1";
var packageInfo = {
	version: version};

// CKEditor imports
let currentInstance = null; // eslint-disable-line import/no-mutable-exports
class MathType extends Plugin {
    static get requires() {
        return [
            Widget
        ];
    }
    static get pluginName() {
        return "MathType";
    }
    init() {
        // Create the MathType API Integration object
        const integration = this._addIntegration();
        currentInstance = integration;
        // Add the MathType and ChemType commands to the editor
        this._addCommands(integration);
        // Add the track changes feature integration
        this._addTrackChangesIntegration(integration);
        // Add the buttons for MathType and ChemType
        this._addViews(integration);
        // Registers the <mathml> element in the schema
        this._addSchema();
        // Add the downcast and upcast converters
        this._addConverters(integration);
        // Expose the WirisPlugin variable to the window
        this._exposeWiris();
    }
    /**
   * Inherited from Plugin class: Executed when CKEditor5 is destroyed
   */ destroy() {
        // eslint-disable-line class-methods-use-this
        currentInstance?.destroy();
    }
    /**
   * Create the MathType API Integration object
   * @returns {CKEditor5Integration} the integration object
   */ _addIntegration() {
        const { editor } = this;
        /**
     * Integration model constructor attributes.
     * @type {integrationModelProperties}
     */ const integrationProperties = {};
        integrationProperties.environment = {};
        integrationProperties.environment.editor = "CKEditor5";
        integrationProperties.environment.editorVersion = "5.x";
        integrationProperties.version = packageInfo.version;
        integrationProperties.editorObject = editor;
        integrationProperties.serviceProviderProperties = {};
        integrationProperties.serviceProviderProperties.URI = "https://www.wiris.net/demo/plugins/app";
        integrationProperties.serviceProviderProperties.server = "java";
        integrationProperties.target = editor.sourceElement;
        integrationProperties.scriptName = "bundle.js";
        integrationProperties.managesLanguage = true;
        // etc
        // There are platforms like Drupal that initialize CKEditor but they hide or remove the container element.
        // To avoid a wrong behavior, this integration only starts if the workspace container exists.
        let integration;
        if (integrationProperties.target) {
            // Instance of the integration associated to this editor instance
            integration = new CKEditor5Integration(integrationProperties);
            integration.init();
            integration.listeners.fire("onTargetReady", {});
            integration.checkElement();
            this.listenTo(editor.editing.view.document, "click", (evt, data)=>{
                // Is Double-click
                if (data.domEvent.detail === 2) {
                    integration.doubleClickHandler(data.domTarget, data.domEvent);
                    evt.stop();
                }
            }, {
                priority: "highest"
            });
        }
        return integration;
    }
    /**
   * Add the MathType and ChemType commands to the editor
   */ _addCommands() {
        const { editor } = this;
        // Add command to open the formula editor
        editor.commands.add("MathType", new MathTypeCommand(editor));
        // Add command to open the chemistry formula editor
        editor.commands.add("ChemType", new ChemTypeCommand(editor));
    }
    /**
   * Add the buttons for MathType and ChemType
   * @param {CKEditor5Integration} integration the integration object
   */ _addViews(integration) {
        const { editor } = this;
        // Check if MathType editor is enabled
        if (Configuration.get("editorEnabled")) {
            // Add button for the formula editor
            editor.ui.componentFactory.add("MathType", (locale)=>{
                const view = new ButtonView(locale);
                // View is enabled iff command is enabled
                view.bind("isEnabled").to(editor.commands.get("MathType"), "isEnabled");
                view.set({
                    label: StringManager.get("insert_math", integration.getLanguage()),
                    icon: mathIcon,
                    tooltip: true
                });
                // Callback executed once the image is clicked.
                view.on("execute", ()=>{
                    editor.execute("MathType", {
                        integration
                    });
                });
                return view;
            });
        }
        // Check if ChemType editor is enabled
        if (Configuration.get("chemEnabled")) {
            // Add button for the chemistry formula editor
            editor.ui.componentFactory.add("ChemType", (locale)=>{
                const view = new ButtonView(locale);
                // View is enabled iff command is enabled
                view.bind("isEnabled").to(editor.commands.get("ChemType"), "isEnabled");
                view.set({
                    label: StringManager.get("insert_chem", integration.getLanguage()),
                    icon: chemIcon,
                    tooltip: true
                });
                // Callback executed once the image is clicked.
                view.on("execute", ()=>{
                    editor.execute("ChemType", {
                        integration
                    });
                });
                return view;
            });
        }
        // Observer for the Double-click event
        editor.editing.view.addObserver(ClickObserver);
    }
    /**
   * Registers the <mathml> element in the schema
   */ _addSchema() {
        const { schema } = this.editor.model;
        schema.register("mathml", {
            inheritAllFrom: "$inlineObject",
            allowAttributes: [
                "formula",
                "htmlContent"
            ]
        });
    }
    /**
   * Add the downcast and upcast converters
   */ _addConverters(integration) {
        const { editor } = this;
        // Editing view -> Model
        editor.conversion.for("upcast").elementToElement({
            view: {
                name: "span",
                classes: "ck-math-widget"
            },
            model: (viewElement, { writer: modelWriter })=>{
                const formula = MathML.safeXmlDecode(viewElement.getChild(0).getAttribute("data-mathml"));
                return modelWriter.createElement("mathml", {
                    formula
                });
            }
        });
        // Data view -> Model
        editor.data.upcastDispatcher.on("element:math", (evt, data, conversionApi)=>{
            const { consumable, writer } = conversionApi;
            const { viewItem } = data;
            // When element was already consumed then skip it.
            if (!consumable.test(viewItem, {
                name: true
            })) {
                return;
            }
            // If we encounter any <math> with a LaTeX annotation inside,
            // convert it into a "$$...$$" string.
            const isLatex = mathIsLatex(viewItem); // eslint-disable-line no-use-before-define
            // Get the formula of the <math> (which is all its children).
            const processor = new XmlDataProcessor(editor.editing.view.document);
            // Only god knows why the following line makes viewItem lose all of its children,
            // so we obtain isLatex before doing this because we need viewItem's children for that.
            const upcastWriter = new ViewUpcastWriter(editor.editing.view.document);
            const viewDocumentFragment = upcastWriter.createDocumentFragment(viewItem.getChildren());
            // and obtain the attributes of <math> too!
            const mathAttributes = [
                ...viewItem.getAttributes()
            ].map(([key, value])=>` ${key}="${value}"`).join("");
            // We process the document fragment
            let formula = processor.toData(viewDocumentFragment) || "";
            // And obtain the complete formula
            formula = Util.htmlSanitize(`<math${mathAttributes}>${formula}</math>`);
            // Replaces the < & > characters to its HTMLEntity to avoid render issues.
            formula = formula.replaceAll('"<"', '"&lt;"').replaceAll('">"', '"&gt;"').replaceAll("><<", ">&lt;<");
            /* Model node that contains what's going to actually be inserted. This can be either:
            - A <mathml> element with a formula attribute set to the given formula, or
            - If the original <math> had a LaTeX annotation, then the annotation surrounded by "$$...$$" */ const modelNode = isLatex ? writer.createText(Parser.initParse(formula, integration.getLanguage())) : writer.createElement("mathml", {
                formula
            });
            // Find allowed parent for element that we are going to insert.
            // If current parent does not allow to insert element but one of the ancestors does
            // then split nodes to allowed parent.
            const splitResult = conversionApi.splitToAllowedParent(modelNode, data.modelCursor);
            // When there is no split result it means that we can't insert element to model tree, so let's skip it.
            if (!splitResult) {
                return;
            }
            // Insert element on allowed position.
            conversionApi.writer.insert(modelNode, splitResult.position);
            // Consume appropriate value from consumable values list.
            consumable.consume(viewItem, {
                name: true
            });
            const parts = conversionApi.getSplitParts(modelNode);
            // Set conversion result range.
            data.modelRange = writer.createRange(conversionApi.writer.createPositionBefore(modelNode), conversionApi.writer.createPositionAfter(parts[parts.length - 1]));
            // Now we need to check where the `modelCursor` should be.
            if (splitResult.cursorParent) {
                // If we split parent to insert our element then we want to continue conversion in the new part of the split parent.
                //
                // before: <allowed><notAllowed>foo[]</notAllowed></allowed>
                // after:  <allowed><notAllowed>foo</notAllowed><converted></converted><notAllowed>[]</notAllowed></allowed>
                data.modelCursor = conversionApi.writer.createPositionAt(splitResult.cursorParent, 0);
            } else {
                // Otherwise just continue after inserted element.
                data.modelCursor = data.modelRange.end;
            }
        });
        // Data view -> Model
        editor.data.upcastDispatcher.on("element:img", (evt, data, conversionApi)=>{
            const { consumable, writer } = conversionApi;
            const { viewItem } = data;
            // Only upcast when is wiris formula
            if (viewItem.getClassNames().next().value !== "Wirisformula") {
                return;
            }
            //  The following code ensures that the element's name, attributes, and classes are consumed.
            // This means that they are marked as handled so that other parts of the system or plugins don't process them again.
            // Check if we can consume the element name.
            if (!consumable.test(viewItem, {
                name: true
            })) {
                return;
            }
            // Consume the name, attributes, and classes so nothing else processes it.
            consumable.consume(viewItem, {
                name: true
            });
            for (const attrName of viewItem.getAttributes()){
                consumable.consume(viewItem, {
                    attributes: [
                        attrName
                    ]
                });
            }
            for (const className of viewItem.getClassNames()){
                consumable.consume(viewItem, {
                    classes: [
                        className
                    ]
                });
            }
            const mathAttributes = [
                ...viewItem.getAttributes()
            ].map(([key, value])=>` ${key}="${value}"`).join("");
            const htmlContent = Util.htmlSanitize(`<img${mathAttributes}>`);
            const modelNode = writer.createElement("mathml", {
                htmlContent
            });
            // Find allowed parent for element that we are going to insert.
            // If current parent does not allow to insert element but one of the ancestors does
            // then split nodes to allowed parent.
            const splitResult = conversionApi.splitToAllowedParent(modelNode, data.modelCursor);
            // When there is no split result it means that we can't insert element to model tree, so let's skip it.
            if (!splitResult) {
                return;
            }
            // Insert element on allowed position.
            conversionApi.writer.insert(modelNode, splitResult.position);
            // Consume appropriate value from consumable values list.
            consumable.consume(viewItem, {
                name: true
            });
            const parts = conversionApi.getSplitParts(modelNode);
            // Set conversion result range.
            data.modelRange = writer.createRange(conversionApi.writer.createPositionBefore(modelNode), conversionApi.writer.createPositionAfter(parts[parts.length - 1]));
            // Now we need to check where the `modelCursor` should be.
            if (splitResult.cursorParent) {
                // If we split parent to insert our element then we want to continue conversion in the new part of the split parent.
                //
                // before: <allowed><notAllowed>foo[]</notAllowed></allowed>
                // after:  <allowed><notAllowed>foo</notAllowed><converted></converted><notAllowed>[]</notAllowed></allowed>
                data.modelCursor = conversionApi.writer.createPositionAt(splitResult.cursorParent, 0);
            } else {
                // Otherwise just continue after inserted element.
                data.modelCursor = data.modelRange.end;
            }
        }, // Ensures MathType processes the Wiris formulas before other plugins, preventing conflicts.
        {
            priority: "high"
        });
        /**
     * Whether the given view <math> element has a LaTeX annotation element.
     * @param {*} math
     * @returns {bool}
     */ function mathIsLatex(math) {
            const semantics = math.getChild(0);
            if (!semantics || semantics.name !== "semantics") return false;
            for (const child of semantics.getChildren()){
                if (child.name === "annotation" && child.getAttribute("encoding") === "LaTeX") {
                    return true;
                }
            }
            return false;
        }
        function createViewWidget(modelItem, { writer: viewWriter }) {
            const widgetElement = viewWriter.createContainerElement("span", {
                class: "ck-math-widget"
            });
            const mathUIElement = createViewImage(modelItem, {
                writer: viewWriter
            }); // eslint-disable-line no-use-before-define
            if (mathUIElement) {
                viewWriter.insert(viewWriter.createPositionAt(widgetElement, 0), mathUIElement);
            }
            return toWidget(widgetElement, viewWriter);
        }
        function createViewImage(modelItem, { writer: viewWriter }) {
            const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);
            const formula = modelItem.getAttribute("formula");
            const htmlContent = modelItem.getAttribute("htmlContent");
            if (!formula && !htmlContent) {
                return null;
            }
            let imgElement = null;
            if (htmlContent) {
                imgElement = htmlDataProcessor.toView(htmlContent).getChild(0);
            } else if (formula) {
                const mathString = formula.replaceAll('ref="<"', 'ref="&lt;"');
                const lang = integration?.getLanguage() || "en"; // Safe fallback to 'en' in case integration is undefined.
                const imgHtml = Parser.initParse(mathString, lang);
                imgElement = htmlDataProcessor.toView(imgHtml).getChild(0);
                // Add HTML element (<img>) to model
                viewWriter.setAttribute("htmlContent", imgHtml, modelItem);
            }
            /* Although we use the HtmlDataProcessor to obtain the attributes,
       *  we must create a new EmptyElement which is independent of the
       *  DataProcessor being used by this editor instance
       */ if (imgElement) {
                return viewWriter.createEmptyElement("img", imgElement.getAttributes(), {
                    renderUnsafeAttributes: [
                        "src"
                    ]
                });
            }
            return null;
        }
        // Model -> Editing view
        editor.conversion.for("editingDowncast").elementToElement({
            model: "mathml",
            view: createViewWidget
        });
        // Model -> Data view
        editor.conversion.for("dataDowncast").elementToElement({
            model: "mathml",
            view: createDataString
        });
        /**
     * Makes a copy of the given view node.
     * @param {module:engine/view/node~Node} sourceNode Node to copy.
     * @returns {module:engine/view/node~Node} Copy of the node.
     */ function clone(viewWriter, sourceNode) {
            if (sourceNode.is("text")) {
                return viewWriter.createText(sourceNode.data);
            }
            if (sourceNode.is("element")) {
                if (sourceNode.is("emptyElement")) {
                    return viewWriter.createEmptyElement(sourceNode.name, sourceNode.getAttributes());
                }
                const element = viewWriter.createContainerElement(sourceNode.name, sourceNode.getAttributes());
                for (const child of sourceNode.getChildren()){
                    viewWriter.insert(viewWriter.createPositionAt(element, "end"), clone(viewWriter, child));
                }
                return element;
            }
            throw new Exception("Given node has unsupported type."); // eslint-disable-line no-undef
        }
        function createDataString(modelItem, { writer: viewWriter }) {
            const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);
            // Load img element
            const mathString = modelItem.getAttribute("htmlContent") || Parser.endParseSaveMode(modelItem.getAttribute("formula"));
            const sourceMathElement = htmlDataProcessor.toView(mathString).getChild(0);
            return clone(viewWriter, sourceMathElement);
        }
        // This stops the view selection getting into the <span>s and messing up caret movement
        editor.editing.mapper.on("viewToModelPosition", viewToModelPositionOutsideModelElement(editor.model, (viewElement)=>viewElement.hasClass("ck-math-widget")));
        // Keep a reference to the original get and set function.
        const { get, set } = editor.data;
        // Listen to the preview command execution to set a flag in localStorage.
        // This flag will be used in the getData() to prevent converting formulas while generating the preview.
        // This is necessary because the preview command uses editor.getData() multiple times internally.
        const previewCommand = editor.commands.get("previewFinalContent");
        if (previewCommand) {
            this.listenTo(previewCommand, "execute", ()=>{
                localStorage.setItem("isGeneratingPreview", true);
                setTimeout(()=>{
                    localStorage.setItem("isGeneratingPreview", false);
                }, 1000);
            }, {
                priority: "high"
            });
        }
        /**
     * Listener for getData() that handles Track Changes and semantics cleanup.
     *
     * This listener intercepts the getData() call and processes the output differently
     * depending on whether we're generating a preview or performing a save operation:
     *
     * - Preview Mode: Removes deleted formulas (marked with Track Changes deletion attributes)
     *   while preserving formula images for visual representation.
     * - Save Mode: Converts formulas to clean MathML by removing semantic annotations
     *   and handwritten data, ensuring clean storage format.
     */ editor.data.on("get", (e)=>{
            const output = e.return;
            // Check if we're in preview mode (flag set by previewFinalContent command)
            const isGeneratingPreview = localStorage.getItem("isGeneratingPreview");
            if (isGeneratingPreview === "true") {
                // Wrap a <span> around all img elements to preserve Track Changes visibility for formulas.
                // Span must contain all the img attributes to avoid render issues.
                const attributesToPreserve = [
                    "data-suggestion-",
                    "data-comment-"
                ];
                const previewOutput = output.replace(/<img([^>]*class="Wirisformula"[^>]*)>/g, (match, attributes)=>{
                    // Extract Track Changes attributes
                    const trackChangesAttrs = [];
                    attributesToPreserve.forEach((prefix)=>{
                        const regex = new RegExp(`(${prefix}[^=]*="[^"]*")`, "g");
                        let attrMatch;
                        while((attrMatch = regex.exec(attributes)) !== null){
                            trackChangesAttrs.push(attrMatch[1]);
                        }
                    });
                    const spanAttrs = trackChangesAttrs.length > 0 ? ` ${trackChangesAttrs.join(" ")}` : "";
                    return `<span${spanAttrs}>${match}</span>`;
                });
                // Cleans all the semantics tag for safexml
                // including the handwritten data points
                e.return = MathML.removeSafeXMLSemantics(previewOutput);
                return;
            }
            // Clean track changes markers only from LaTeX content before converting to MathML.
            const latexParsedOutput = this._endParseEditModeWithTrackChangesSupport(output);
            // Convert formula images to MathML. It's important to use the save mode to prevent issues.
            const parsedResult = Parser.endParseSaveMode(latexParsedOutput);
            // Remove all semantic annotations (including handwritten data points)
            // to ensure clean, standard MathML format for storage
            e.return = MathML.removeSafeXMLSemantics(parsedResult);
        }, {
            priority: "low"
        });
        /**
     * Hack to transform <math> with LaTeX into $$LaTeX$$ and formula images in editor.setData().
     */ editor.data.on("set", (e, args)=>{
            // Retrieve the data to be set on the CKEditor.
            let modifiedData = args[0];
            // Regex to find all mathml formulas.
            const regexp = /(<img\b[^>]*>)|(<math(.*?)<\/math>)/gm;
            const formulas = [];
            let formula;
            // Both data.set from the source plugin and console command are taken into account as the data received is MathML or an image containing the MathML.
            while((formula = regexp.exec(modifiedData)) !== null){
                formulas.push(formula[0]);
            }
            // Loop to find LaTeX and formula images and replace the MathML for the both.
            formulas.forEach((formula)=>{
                if (formula.includes('encoding="LaTeX"')) {
                    // LaTeX found.
                    const latex = `$$$${Latex.getLatexFromMathML(formula)}$$$`; // We add $$$ instead of $$ because the replace function ignores one $.
                    modifiedData = modifiedData.replace(formula, latex);
                } else if (formula.includes("<img")) {
                    // If we found a formula image, we should find MathML data, and then substitute the entire image.
                    const regexp = /«math\b[^»]*»(.*?)«\/math»/g;
                    const safexml = formula.match(regexp);
                    if (safexml !== null) {
                        const decodeXML = MathML.safeXmlDecode(safexml[0]);
                        modifiedData = modifiedData.replace(formula, decodeXML);
                    }
                }
            });
            args[0] = modifiedData;
        }, {
            priority: "high"
        });
    }
    /**
   * When track changes markers are present inside a LaTeX block:
   * - The LaTeX is preserved as text (not converted to MathML) to maintain suggestions.
   * - It also prevents the issue where the suggestions were placed as MathML tags.
   *
   * When no track changes markers are inside a LaTeX block:
   * - The LaTeX is converted to MathML normally. (previous default behavior)
   *
   * This is to ensure that:
   * 1. LaTeX without suggestions gets converted to MathML for final output.
   * 2. LaTeX with pending suggestions is preserved so setData(getData()) works correctly.
   */ _endParseEditModeWithTrackChangesSupport(code) {
        if (!Configuration.get("parseModes").includes("latex")) {
            return code;
        }
        const latexBlockRegex = /\$\$([\s\S]*?)\$\$/g;
        const trackChangesRegex = /<(suggestion|comment)-(start|end)/i;
        //TODO: Validate if replace all is needed instead of just replace when it is all implemented.
        return code.replace(latexBlockRegex, (fullMatch, latexContent)=>{
            // Check if this LaTeX contains track changes markers to prevent conversion.
            if (trackChangesRegex.test(latexContent)) {
                return fullMatch;
            }
            // When LaTeX has no suggestion, it can be converted to MathML.
            const decodedLatex = Util.htmlEntitiesDecode(latexContent);
            let mathml = Util.htmlSanitize(Latex.getMathMLFromLatex(decodedLatex, true));
            if (!Configuration.get("saveHandTraces")) {
                mathml = MathML.removeAnnotation(mathml, "application/json");
            }
            return mathml;
        });
    }
    /**
   * Expose the WirisPlugin variable to the window
   */ // eslint-disable-next-line class-methods-use-this
    _exposeWiris() {
        window.WirisPlugin = {
            Core,
            Parser,
            Image,
            MathML,
            Util,
            Configuration,
            Listeners,
            IntegrationModel,
            currentInstance,
            Latex
        };
    }
    _addTrackChangesIntegration(integration) {
        const { editor } = this;
        if (editor.plugins.has("TrackChangesEditing")) {
            const trackChangesEditing = editor.plugins.get("TrackChangesEditing");
            // Makes MathType and ChemType buttons available when editor is in the track changes mode
            trackChangesEditing.enableCommand("MathType");
            trackChangesEditing.enableCommand("ChemType");
            // Adds custom label replacing the default 'mathml'.
            // Handles both singular and plural forms.
            trackChangesEditing.descriptionFactory.registerElementLabel("mathml", (quantity)=>(quantity > 1 ? `${quantity} ` : "") + StringManager.get(quantity > 1 ? "formulas" : "formula", integration?.getLanguage() || "en"));
            this._registerLatexTrackChangesAdapter(integration);
        }
    }
    /**
   * Register a custom adapter for handling LaTeX text changes.
   * This ensures that LaTeX formulas ($$...$$) are treated as atomic units
   * when used by the track changes feature and avoid partial edits.
   */ _registerLatexTrackChangesAdapter(integration) {
        const { editor } = this;
        editor.model.document.on("change:data", ()=>{
            if (integration) {
                integration._trackChangesEnabled = editor.commands.get("trackChanges")?.value ?? false;
            }
        });
    }
}

export { CKEditor5Integration, ChemTypeCommand, MathTypeCommand, MathType as default };
//# sourceMappingURL=index.js.map
