// CKEditor imports
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import HtmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';
import XmlDataProcessor from '@ckeditor/ckeditor5-engine/src/dataprocessor/xmldataprocessor';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

// MathType API imports
import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel';
import Core from '@wiris/mathtype-html-integration-devkit/src/core.src';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser';
import Util from '@wiris/mathtype-html-integration-devkit/src/util';
import Image from '@wiris/mathtype-html-integration-devkit/src/image';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners';
import MathML from '@wiris/mathtype-html-integration-devkit/src/mathml';
import Latex from '@wiris/mathtype-html-integration-devkit/src/latex';
import StringManager from '@wiris/mathtype-html-integration-devkit/src/stringmanager';

// Local imports
import { MathTypeCommand, ChemTypeCommand } from './commands';
import CKEditor5Integration from './integration';

import mathIcon from '../theme/icons/formula.svg';
import chemIcon from '../theme/icons/chem.svg';

export let currentInstance = null; // eslint-disable-line import/no-mutable-exports

export default class MathType extends Plugin {
  static get requires() {
    return [Widget];
  }

  static get pluginName() {
    return 'MathType';
  }

  init() {
    // Create the MathType API Integration object
    const integration = this._addIntegration();
    currentInstance = integration;

    // Add the MathType and ChemType commands to the editor
    this._addCommands();

    // Add the buttons for MathType and ChemType
    this._addViews(integration);

    // Registers the <mathml> element in the schema
    this._addSchema();

    // Add the downcast and upcast converters
    this._addConverters();

    // Expose the WirisPlugin variable to the window
    this._exposeWiris();
  }

  /**
   * Inherited from Plugin class: Executed when CKEditor5 is destroyed
   */
  destroy() { // eslint-disable-line class-methods-use-this
    currentInstance.removeEvents();
  }

  /**
     * Create the MathType API Integration object
     * @returns {CKEditor5Integration} the integration object
     */
  _addIntegration() {
    const { editor } = this;

    /**
         * Integration model constructor attributes.
         * @type {integrationModelProperties}
         */
    const integrationProperties = {};
    integrationProperties.environment = {};
    integrationProperties.environment.editor = 'CKEditor5';
    integrationProperties.environment.editorVersion = '5.x';
    integrationProperties.editorObject = editor;
    integrationProperties.serviceProviderProperties = {};
    integrationProperties.serviceProviderProperties.URI = 'https://www.wiris.net/demo/plugins/app';
    integrationProperties.serviceProviderProperties.server = 'java';
    integrationProperties.target = editor.sourceElement;
    integrationProperties.scriptName = 'bundle.js';
    integrationProperties.managesLanguage = true;
    // etc

    // There are platforms like Drupal that initialize CKEditor but they hide or remove the container element.
    // To avoid a wrong behaviour, this integration only starts if the workspace container exists.
    let integration;
    if (integrationProperties.target) {
      // Instance of the integration associated to this editor instance
      integration = new CKEditor5Integration(integrationProperties);
      integration.init();
      integration.listeners.fire('onTargetReady', {});

      integration.checkElement();

      this.listenTo(editor.editing.view.document, 'click', (evt, data) => {
        // Is double click
        if (data.domEvent.detail === 2) {
          integration.doubleClickHandler(data.domTarget, data.domEvent);
          evt.stop();
        }
      }, { priority: 'highest' });
    }

    return integration;
  }

  /**
     * Add the MathType and ChemType commands to the editor
     */
  _addCommands() {
    const { editor } = this;

    // Add command to open the formula editor
    editor.commands.add('MathType', new MathTypeCommand(editor));

    // Add command to open the chemistry formula editor
    editor.commands.add('ChemType', new ChemTypeCommand(editor));
  }

  /**
     * Add the buttons for MathType and ChemType
     * @param {CKEditor5Integration} integration the integration object
     */
  _addViews(integration) {
    const { editor } = this;

    // Check if MathType editor is enabled
    if (Configuration.get('editorEnabled')) {
      // Add button for the formula editor
      editor.ui.componentFactory.add('MathType', (locale) => {
        const view = new ButtonView(locale);

        // View is enabled iff command is enabled
        view.bind('isEnabled').to(editor.commands.get('MathType'), 'isEnabled');

        view.set({
          label: StringManager.get('insert_math'),
          icon: mathIcon,
          tooltip: true,
        });

        // Callback executed once the image is clicked.
        view.on('execute', () => {
          editor.execute('MathType', {
            integration, // Pass integration as parameter
          });
        });

        return view;
      });
    }

    // Check if ChemType editor is enabled
    if (Configuration.get('chemEnabled')) {
      // Add button for the chemistry formula editor
      editor.ui.componentFactory.add('ChemType', (locale) => {
        const view = new ButtonView(locale);

        // View is enabled iff command is enabled
        view.bind('isEnabled').to(editor.commands.get('ChemType'), 'isEnabled');

        view.set({
          label: StringManager.get('insert_chem'),
          icon: chemIcon,
          tooltip: true,
        });

        // Callback executed once the image is clicked.
        view.on('execute', () => {
          editor.execute('ChemType', {
            integration, // Pass integration as parameter
          });
        });

        return view;
      });
    }

    // Observer for the double click event
    editor.editing.view.addObserver(ClickObserver);
  }

  /**
     * Registers the <mathml> element in the schema
     */
  _addSchema() {
    const { schema } = this.editor.model;

    schema.register('mathml', {
      allowWhere: '$text',
      isObject: true,
      isInline: true,
      allowAttributes: ['formula'],
    });
  }

  /**
     * Add the downcast and upcast converters
     */
  _addConverters() {
    const { editor } = this;

    // Editing view -> Model
    editor.conversion.for('upcast').elementToElement({
      view: {
        name: 'span',
        classes: 'ck-math-widget',
      },
      model: (viewElement, { writer: modelWriter }) => {
        const formula = MathML.safeXmlDecode(viewElement.getChild(0).getAttribute('data-mathml'));
        return modelWriter.createElement('mathml', {
          formula,
        });
      },
    });

    // Data view -> Model
    editor.data.upcastDispatcher.on('element:math', (evt, data, conversionApi) => {
      const { consumable, writer } = conversionApi;
      const { viewItem } = data;

      // When element was already consumed then skip it.
      if (!consumable.test(viewItem, { name: true })) {
        return;
      }

      // If we encounter any <math> with a LaTeX annotation inside,
      // convert it into a "$$...$$" string.
      const isLatex = mathIsLatex(viewItem); // eslint-disable-line no-use-before-define

      // Get the formula of the <math> (which is all its children).
      const processor = new XmlDataProcessor(editor.editing.view.document);

      // Only god knows why the following line makes viewItem lose all of its children,
      // so we obtain isLatex before doing this because we need viewItem's children for that.
      const upcastWriter = new UpcastWriter(editor.editing.view.document);
      const viewDocumentFragment = upcastWriter.createDocumentFragment(viewItem.getChildren());

      // and obtain the attributes of <math> too!
      const mathAttributes = [...viewItem.getAttributes()]
        .map(([key, value]) => ` ${key}="${value}"`)
        .join('');

      // We process the document fragment
      let formula = processor.toData(viewDocumentFragment) || '';

      // And obtain the complete formula
      formula = `<math${mathAttributes}>${formula}</math>`;

      /* Model node that contains what's going to actually be inserted. This can be either:
            - A <mathml> element with a formula attribute set to the given formula, or
            - If the original <math> had a LaTeX annotation, then the annotation surrounded by "$$...$$" */
      const modelNode = isLatex
        ? writer.createText(Parser.initParse(formula, editor.config.get('language')))
        : writer.createElement('mathml', { formula });

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
      consumable.consume(viewItem, { name: true });

      const parts = conversionApi.getSplitParts(modelNode);

      // Set conversion result range.
      data.modelRange = writer.createRange(
        conversionApi.writer.createPositionBefore(modelNode),
        conversionApi.writer.createPositionAfter(parts[parts.length - 1]),
      );

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

    /**
         * Whether the given view <math> element has a LaTeX annotation element.
         * @param {*} math
         * @returns {bool}
         */
    function mathIsLatex(math) {
      const semantics = math.getChild(0);
      if (!semantics || semantics.name !== 'semantics') return false;
      for (const child of semantics.getChildren()) {
        if (child.name === 'annotation' && child.getAttribute('encoding') === 'LaTeX') {
          return true;
        }
      }
      return false;
    }

    function createViewWidget(modelItem, { writer: viewWriter }) {
      const widgetElement = viewWriter.createContainerElement('span', {
        class: 'ck-math-widget',
      });

      const mathUIElement = createViewImage(modelItem, { writer: viewWriter }); // eslint-disable-line no-use-before-define

      viewWriter.insert(viewWriter.createPositionAt(widgetElement, 0), mathUIElement);

      return toWidget(widgetElement, viewWriter);
    }

    function createViewImage(modelItem, { writer: viewWriter }) {
      const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);

      const mathString = modelItem.getAttribute('formula');
      const imgHtml = Parser.initParse(mathString, editor.config.get('language'));
      const imgElement = htmlDataProcessor.toView(imgHtml).getChild(0);

      /* Although we use the HtmlDataProcessor to obtain the attributes,
            we must create a new EmptyElement which is independent of the
            DataProcessor being used by this editor instance */
      return viewWriter.createEmptyElement('img', imgElement.getAttributes(), {
        renderUnsafeAttributes: ['src'],
      });
    }

    // Model -> Editing view
    editor.conversion.for('editingDowncast').elementToElement({
      model: 'mathml',
      view: createViewWidget,
    });

    // Model -> Data view
    editor.conversion.for('dataDowncast').elementToElement({
      model: 'mathml',
      view: createDataString, // eslint-disable-line no-use-before-define
    });

    /**
         * Makes a copy of the given view node.
         * @param {module:engine/view/node~Node} sourceNode Node to copy.
         * @returns {module:engine/view/node~Node} Copy of the node.
         */
    function clone(viewWriter, sourceNode) {
      if (sourceNode.is('text')) {
        return viewWriter.createText(sourceNode.data);
      } if (sourceNode.is('element')) {
        if (sourceNode.is('emptyElement')) {
          return viewWriter.createEmptyElement(sourceNode.name, sourceNode.getAttributes());
        }
        const element = viewWriter.createContainerElement(sourceNode.name, sourceNode.getAttributes());
        for (const child of sourceNode.getChildren()) {
          viewWriter.insert(viewWriter.createPositionAt(element, 'end'), clone(viewWriter, child));
        }
        return element;
      }

      throw new Exception('Given node has unsupported type.'); // eslint-disable-line no-undef
    }

    function createDataString(modelItem, { writer: viewWriter }) {
      const htmlDataProcessor = new HtmlDataProcessor(viewWriter.document);

      let mathString = Parser.endParseSaveMode(modelItem.getAttribute('formula'));

      // Remove the traces from Hand. This code should be removed once PLUGINS-1307 is solved.
      if (!Configuration.get('saveHandTraces')) {
        mathString = MathML.removeAnnotation(mathString, 'application/json');
      }

      const sourceMathElement = htmlDataProcessor.toView(mathString).getChild(0);

      return clone(viewWriter, sourceMathElement);
    }

    // This stops the view selection getting into the <span>s and messing up caret movement
    editor.editing.mapper.on(
      'viewToModelPosition',
      viewToModelPositionOutsideModelElement(editor.model, (viewElement) => viewElement.hasClass('ck-math-widget')),
    );

    // Keep a reference to the original get function
    const { get } = editor.data;

    /**
         * Hack to transform $$latex$$ into <math> in editor.getData()'s output.
         */
    editor.data.get = (options) => {
      const output = get.bind(editor.data)(options);
      return Parser.endParse(output);
    };
  }

  /**
     * Expose the WirisPlugin variable to the window
     */
  // eslint-disable-next-line class-methods-use-this
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
      Latex,
    };
  }
}
