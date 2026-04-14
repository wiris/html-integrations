import { Plugin } from "ckeditor5/src/core.js";
import { ButtonView } from "ckeditor5/src/ui.js";
import { HtmlDataProcessor, XmlDataProcessor, ViewUpcastWriter } from "ckeditor5/src/engine.js";
import { Widget, toWidget, viewToModelPositionOutsideModelElement } from "ckeditor5/src/widget.js";

import SDK, { HTMLImage } from "@wiris/mathtype.integrations.sdk";

import MathTypeCommand from "./command.js";

import mathIcon from "../theme/icons/ckeditor5-formula.svg";
import "../theme/styles.css";

/**
 * Cache for rendered formula images.
 */
const renderCache = new Map();

/**
 * CKEditor5 MathType plugin for the SDK.
 */
export default class MathType extends Plugin {
  static get requires() {
    return [Widget];
  }

  static get pluginName() {
    return "MathType";
  }

  init() {
    const { editor } = this;
    const userConfig = editor.config.get("mathTypeParameters") || {};
    const sdkConfig = {
      url: "https://www.wiris.net/demo/editor",
      variant: "modern",
      environment: "production",
      ...userConfig.sdkConfig,
    };

    const sdk = new SDK(sdkConfig);

    const editorLanguage = this.getEditorLanguage();
    const editorModalConfig = {
      editorConfig: {
        language: editorLanguage,
        ...userConfig.editorModalConfig?.editorConfig,
      },
      modalConfig: {
        ...userConfig.editorModalConfig?.modalConfig,
      },
    };

    const editorModal = sdk.createEditorModal(editorModalConfig);

    this.sdk = sdk;
    this.editorModal = editorModal;
    this.editorModalInitialized = false;

    editorModal.on("InsertFormulaRequested", (mathml) => {
      this.insertFormula(mathml);
    });

    // Adds the MathType command.
    this.addCommand();

    // Add the MathType toolbar button.
    this.addView();

    // Register the <mathml> element in the ck5 schema.
    this.addSchema();

    // Add upcast/downcast converters for the formulas.
    this.addConverters();
  }

  destroy() {
    if (this.editorModal) {
      this.editorModal.destroy();
    }
  }

  // TODO: Copy from old plugin. needs improvements.
  getEditorLanguage() {
    const { editor } = this;
    const languageObject = editor.config.get("language");

    if (languageObject != null) {
      if (typeof languageObject === "object") {
        if (Object.hasOwn(languageObject, "ui")) {
          return languageObject.ui;
        }
        return editor.locale?.uiLanguage || "en";
      }
      return languageObject;
    }

    return "en";
  }

  /**
   * Validate EditorModal is initialized before showing it since there are lots of async operations.
   */
  ensureEditorModalInitialized() {
    if (!this.editorModalInitialized) {
      this.editorModal.init();
      this.editorModalInitialized = true;
    }
  }

  /**
   * Opens the MathType editor modal. Can be empty or with an existing formula to edit.
   */
  openEditor(mathml = null) {
    this.ensureEditorModalInitialized();

    this.isNewFormula = !mathml;

    this.savedSelection = this.editor.editing.view.document.selection;

    if (mathml) {
      this.editorModal.setMathML(mathml);
    } else {
      this.editorModal.setEmptyEditor();
    }

    this.editorModal.show();
  }

  /**
   * Renders the formula to an image, then inserts into the ck5 model.
   */
  async insertFormula(mathml) {
    if (!mathml) {
      return;
    }

    const renderedImage = await this.renderMathMLToImgHtml(mathml);

    this.editor.model.change((writer) => {
      const selection = this.editor.model.document.selection;
      const attributes = Object.fromEntries(selection.getAttributes());
      const modelElement = writer.createElement("mathml", {
        formula: mathml,
        htmlContent: renderedImage,
        ...attributes,
      });

      if (this.isNewFormula) {
        // Insert new formula at the saved selection position.
        const viewSelection = this.savedSelection || this.editor.editing.view.document.selection;
        const modelPosition = this.editor.editing.mapper.toModelPosition(viewSelection.getLastPosition());

        this.editor.model.insertObject(modelElement, modelPosition);

        // Delete any existing view selection content. This is needed to simulate the default ck5 behavior of inserting an object which replaces the selection.
        if (viewSelection && !viewSelection.isCollapsed) {
          for (const range of viewSelection.getRanges()) {
            const modelRange = this.editor.editing.mapper.toModelRange(range);
            const modelSelection = this.editor.model.createSelection(modelRange);

            this.editor.model.deleteContent(modelSelection);
          }
        }

        const position = this.editor.model.createPositionAfter(modelElement);

        writer.setSelection(position);
      } else {
        // Replace existing formula by finding the currently selected mathml element.
        const selectedElement = selection.getSelectedElement();

        if (selectedElement?.name === "mathml") {
          const position = writer.createPositionBefore(selectedElement);

          writer.remove(selectedElement);
          writer.insert(modelElement, position);
        } else {
          this.editor.model.insertObject(modelElement);
        }
      }
    });

    this.savedSelection = null;
    this.isNewFormula = true;
  }

  /**
   * Adds the MathType command to the editor.
   */
  addCommand() {
    const { editor } = this;
    editor.commands.add("MathType", new MathTypeCommand(editor, this));
  }

  /**
   * Adds the MathType toolbar button.
   */
  addView() {
    const { editor } = this;

    editor.ui.componentFactory.add("MathType", (locale) => {
      const view = new ButtonView(locale);

      view.bind("isEnabled").to(editor.commands.get("MathType"), "isEnabled");
      view.set({
        label: "Insert MathType formula",
        icon: mathIcon,
        tooltip: true,
      });

      view.on("execute", () => {
        editor.execute("MathType");
      });

      return view;
    });

    this.sdk.on("MathExpressionDetected", ({ mathML, detection_mode }) => {
      if (detection_mode === "double-click") {
        if (mathML) {
          this.isNewFormula = false;
          this.openEditor(mathML);
        }
      }
    });
  }

  /**
   * Registers the <mathml> element in the editor schema.
   */
  addSchema() {
    const { schema } = this.editor.model;

    schema.register("mathml", {
      inheritAllFrom: "$inlineObject",
      allowAttributes: ["formula", "htmlContent"],
    });

    // Trigger reconversion of the editing view when htmlContent changes.
    this.editor.conversion.for("editingDowncast").add((dispatcher) => {
      dispatcher.on("attribute:htmlContent:mathml", (evt, data, conversionApi) => {
        conversionApi.convertItem(data.item);
      });
    });
  }

  /**
   * Adds upcast and downcast converters for MathML formulas.
   */
  addConverters() {
    const { editor } = this;

    // Editing view -> Model (span.ck-math-widget wrapping an img).
    editor.conversion.for("upcast").elementToElement({
      view: {
        name: "span",
        classes: "ck-math-widget",
      },
      model: (viewElement, { writer: modelWriter }) => {
        const imgChild = viewElement.getChild(0);
        const formula = imgChild?.getAttribute("data-mathml") ?? "";
        return modelWriter.createElement("mathml", { formula });
      },
    });

    // Data view -> Model (upcast <math> elements).
    editor.data.upcastDispatcher.on("element:math", (evt, data, conversionApi) => {
      const { consumable, writer } = conversionApi;
      const { viewItem } = data;

      if (!consumable.test(viewItem, { name: true })) {
        return;
      }

      // Get the formula from the <math> element
      const upcastWriter = new ViewUpcastWriter(editor.editing.view.document);
      const viewDocumentFragment = upcastWriter.createDocumentFragment(viewItem.getChildren());

      const mathAttributes = [...viewItem.getAttributes()].map(([key, value]) => ` ${key}="${value}"`).join("");

      const processor = new XmlDataProcessor(editor.editing.view.document);
      let formula = processor.toData(viewDocumentFragment) || "";
      formula = `<math${mathAttributes}>${formula}</math>`;

      const modelNode = writer.createElement("mathml", { formula });

      const splitResult = conversionApi.splitToAllowedParent(modelNode, data.modelCursor);
      if (!splitResult) {
        return;
      }

      conversionApi.writer.insert(modelNode, splitResult.position);
      consumable.consume(viewItem, { name: true });

      const parts = conversionApi.getSplitParts(modelNode);
      data.modelRange = writer.createRange(
        conversionApi.writer.createPositionBefore(modelNode),
        conversionApi.writer.createPositionAfter(parts[parts.length - 1]),
      );

      if (splitResult.cursorParent) {
        data.modelCursor = conversionApi.writer.createPositionAt(splitResult.cursorParent, 0);
      } else {
        data.modelCursor = data.modelRange.end;
      }
    });

    // Data view -> Model (upcast <img class="Wirisformula"> elements).
    editor.data.upcastDispatcher.on(
      "element:img",
      (evt, data, conversionApi) => {
        const { consumable, writer } = conversionApi;
        const { viewItem } = data;

        const classNames = [...viewItem.getClassNames()];
        if (!classNames.includes("Wirisformula")) {
          return;
        }

        if (!consumable.test(viewItem, { name: true })) {
          return;
        }

        consumable.consume(viewItem, { name: true });
        for (const attrName of viewItem.getAttributes()) {
          consumable.consume(viewItem, { attributes: [attrName] });
        }
        for (const className of viewItem.getClassNames()) {
          consumable.consume(viewItem, { classes: [className] });
        }

        const mathAttributes = [...viewItem.getAttributes()].map(([key, value]) => ` ${key}="${value}"`).join("");
        const htmlContent = `<img${mathAttributes}>`;
        const modelNode = writer.createElement("mathml", { htmlContent });

        const splitResult = conversionApi.splitToAllowedParent(modelNode, data.modelCursor);
        if (!splitResult) {
          return;
        }

        conversionApi.writer.insert(modelNode, splitResult.position);
        consumable.consume(viewItem, { name: true });

        const parts = conversionApi.getSplitParts(modelNode);
        data.modelRange = writer.createRange(
          conversionApi.writer.createPositionBefore(modelNode),
          conversionApi.writer.createPositionAfter(parts[parts.length - 1]),
        );

        if (splitResult.cursorParent) {
          data.modelCursor = conversionApi.writer.createPositionAt(splitResult.cursorParent, 0);
        } else {
          data.modelCursor = data.modelRange.end;
        }
      },
      { priority: "high" },
    );

    // Model -> Editing view (creates the widget)
    // The downcast is synchronous, so we first render from htmlContent (if available)
    // or show a placeholder and kick off an async render.
    editor.conversion.for("editingDowncast").elementToElement({
      model: "mathml",
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = viewWriter.createContainerElement("span", {
          class: "ck-math-widget",
        });

        const htmlContent = modelItem.getAttribute("htmlContent");
        const formula = modelItem.getAttribute("formula");

        if (htmlContent) {
          const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);
          const parsedImg = htmlDataProcessor.toView(htmlContent).getChild(0);

          if (parsedImg) {
            const imgElement = viewWriter.createEmptyElement("img", parsedImg.getAttributes(), {
              renderUnsafeAttributes: ["src"],
            });
            viewWriter.insert(viewWriter.createPositionAt(widgetElement, 0), imgElement);
          }
        } else if (formula) {
          // No pre-rendered image yet: create a placeholder and render async.
          const placeholderAttrs = {
            class: "Wirisformula",
            role: "math",
            alt: "Loading formula...",
            src: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            "data-mathml": formula,
          };

          const placeholderImg = viewWriter.createEmptyElement("img", placeholderAttrs, {
            renderUnsafeAttributes: ["src"],
          });

          viewWriter.insert(viewWriter.createPositionAt(widgetElement, 0), placeholderImg);

          this.renderAndUpdateModel(modelItem, formula);
        }

        return toWidget(widgetElement, viewWriter);
      },
    });

    // Model -> Data view (outputs MathML for storage, or falls back to img)
    editor.conversion.for("dataDowncast").elementToElement({
      model: "mathml",
      view: (modelItem, { writer: viewWriter }) => {
        const formula = modelItem.getAttribute("formula");
        const htmlContent = modelItem.getAttribute("htmlContent");
        const outputString = htmlContent || formula;

        if (!outputString) {
          return viewWriter.createContainerElement("span");
        }

        const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);
        const sourceElement = htmlDataProcessor.toView(outputString).getChild(0);

        if (sourceElement) {
          return this.cloneViewElement(viewWriter, sourceElement);
        }

        return viewWriter.createContainerElement("span");
      },
    });

    // Prevent the selection from getting inside <span class="ck-math-widget">
    editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement(editor.model, (viewElement) => viewElement.hasClass("ck-math-widget")),
    );
  }

  /**
   * Renders a MathML formula to an image html string.
   * Results are cached so repeated renders of the same formula are instant.
   */
  async renderMathMLToImgHtml(mathml) {
    if (renderCache.has(mathml)) {
      return renderCache.get(mathml);
    }

    try {
      const renderer = this.sdk.renderer;
      const accessibility = this.sdk.accessibility;
      const language = this.getEditorLanguage();

      // Render and get accessible text.
      const [renderResult, accessibilityResult] = await Promise.all([
        renderer.fromMathML({ expression: mathml, format: "svg" }),
        accessibility.fromMathML(mathml, language),
      ]);

      if (renderResult.status === "OK" && renderResult.result) {
        const altText = accessibilityResult.status === "OK" ? accessibilityResult.result : mathml;
        const imgElement = HTMLImage.create(altText, renderResult.result);

        imgElement.dataset.mathml = mathml;

        const htmlContent = imgElement.outerHTML;

        renderCache.set(mathml, htmlContent);

        return htmlContent;
      }
    } catch (error) {
      console.warn("MathType SDK: failed to render formula, using fallback.", error);
    }

    // Fallback: return a basic img tag so the formula is at least visible as text.
    const fallbackHtml = `<img class="Wirisformula" role="math" data-mathml="${mathml.replaceAll('"', "&quot;")}" alt="${mathml.replaceAll('"', "&quot;")}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">`;

    return fallbackHtml;
  }

  /**
   * Renders a formula and updates the model's `htmlContent` attribute,
   * which triggers a re-downcast so the placeholder image is replaced with the real one.
   */
  async renderAndUpdateModel(modelItem, formula) {
    const htmlContent = await this.renderMathMLToImgHtml(formula);

    // This triggers a re-downcast that now has htmlContent
    this.editor.model.change((writer) => {
      // Verify the model element is still in the document before writing.
      if (modelItem.root.rootName) {
        writer.setAttribute("htmlContent", htmlContent, modelItem);
      }
    });
  }

  /**
   * Deep-clones a view element.
   */
  cloneViewElement(viewWriter, sourceNode) {
    if (sourceNode.is("text")) {
      return viewWriter.createText(sourceNode.data);
    }

    if (sourceNode.is("element")) {
      if (sourceNode.is("emptyElement")) {
        return viewWriter.createEmptyElement(sourceNode.name, sourceNode.getAttributes());
      }

      const element = viewWriter.createContainerElement(sourceNode.name, sourceNode.getAttributes());

      for (const child of sourceNode.getChildren()) {
        viewWriter.insert(viewWriter.createPositionAt(element, "end"), this.cloneViewElement(viewWriter, child));
      }

      return element;
    }

    throw new Error("Given node has unsupported type.");
  }
}
