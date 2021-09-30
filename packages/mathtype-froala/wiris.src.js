import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser';
import Constants from '@wiris/mathtype-html-integration-devkit/src/constants';
import MathML from '@wiris/mathtype-html-integration-devkit/src/mathml';

import packageInfo from './package.json';

/**
 * This property contains all Froala Integration instances.
 * @type {Object}
 */
export const instances = {};

/**
 * This property contains the current Froala integration instance,
 * which is the instance of the active editor.
 * @type {IntegrationModel}
 */
export const currentInstance = null;

/**
 * Froala integration class.
 */
export class FroalaIntegration extends IntegrationModel {
  /**
     * IntegrationModel constructor.
     * @param {IntegrationModelProperties} froalaModelProperties
     */
  constructor(froalaModelProperties) {
    super(froalaModelProperties);

    /**
         * Mode when Froala is instantiated on an image.
         * @type {Boolean}
         */
    this.initOnImageMode = froalaModelProperties.initOnImageMode;
  }

  /**
     * Returns the language of the current Froala editor instance.
     * When no language is set, ckeditor sets the toolbar to english.
     */
  getLanguage() {
    try {
      return this.editorParameters.language;
    } catch (e) { console.error(); }
    if (this.editorObject.opts.language != null) {
      return this.editorObject.opts.language;
    }
    return super.getLanguage();
  }

  /** @inheritdoc */
  init() {
    // On focus in a Froala editor instance, is needed to update the
    // Current FroalaIntegration instance.
    this.editorObject.events.on('focus', function (editorObject) { // eslint-disable-line no-unused-vars
      WirisPlugin.currentInstance = WirisPlugin.instances[this.editorObject.id];
    }.bind(this, this.editorObject));

    // Update editor parameters.
    // The integration could contain an object with editor parameters. These parameters
    // have preference over the backend parameters so we need to update them.
    const editor = this.editorObject;
    if ('wiriseditorparameters' in editor.opts) {
      Configuration.update('editorParameters', editor.opts.wiriseditorparameters);
    }

    // As always. When the data of Froala is retrieved we need to Parse the content.
    editor.events.on('html.get', (e, editor, html) => Parser.endParse(e)); // eslint-disable-line no-unused-vars

    // Adding parse MathML to images after command event to prevent
    // lost image formulas.
    editor.events.on('commands.after', (cmd) => {
      if (cmd === 'html') {
        if (!editor.codeView.isActive()) {
          // Froala transform entities like &#62; to its equivalent ('<' in this case).
          // so MathML properties need to be parsed.
          const contentMathMLPropertiesEncoded = this.parseMathMLProperties(editor.html.get());
          const parsedContent = Parser.initParse(contentMathMLPropertiesEncoded, editor.opts.language);
          editor.html.set(parsedContent);
        }
      }
    });

    super.init();
  }

  /**
     * Encodes html entities in mathml properties ocurrences inside 'text'.
     * @param {String} text - text that can contain mathml elements or not.
     * @returns {String} - 'text' with all mathml properties html entity encoded.
     */
  // eslint-disable-next-line class-methods-use-this
  parseMathMLProperties(text) {
    const mathTagStart = `${Constants.xmlCharacters.tagOpener}math`;
    const mathTagEnd = `${Constants.xmlCharacters.tagOpener}/math${Constants.xmlCharacters.tagCloser}`;

    let output = '';
    let start = text.indexOf(mathTagStart);
    let end = 0;
    while (start !== -1) {
      // Add all the content between the past found mathml and the actual.
      output += text.substring(end, start);
      // Current mathml end.
      end = text.indexOf(mathTagEnd, start);
      const mathml = text.substring(start, end);
      const mathmlEntitiesParsed = MathML.encodeProperties(mathml);
      output += mathmlEntitiesParsed;
      // Next mathml first position.
      start = text.indexOf(mathTagStart, end);
    }

    output += text.substring(end, text.length);
    return output;
  }

  /** @inheritdoc */
  callbackFunction() {
    super.callbackFunction();
    // Parse content

    // Events. Froala malforms data-uri in images. We need to
    // rewrite them.
    if (Configuration.get('imageFormat') === 'svg') {
      this.editorObject.events.on('html.set', function () {
        const images = this.el.getElementsByClassName('Wirisformula');
        for (let i = 0; i < images.length; i++) {
          if (images[i].src.substr(0, 10) === 'data:image') {
            const firstPart = images[i].src.substr(0, 33);
            const secondPart = images[i].src.substr(33, images[i].src.length);
            images[i].src = firstPart + encodeURIComponent(decodeURIComponent(secondPart));
          }
        }
      });
    }

    // Froala editor can be instantiated in images.
    if (this.target.tagName.toLowerCase() !== 'img') {
      const parsedContent = Parser.initParse(this.editorObject.html.get());
      this.editorObject.html.set(parsedContent);
    }
  }

  /**
     * @inheritdoc
     * @param {HTMLElement} element - DOM object target.
     */
  doubleClickHandler(element) {
    // Save a image to a temporal register to detect when we want to
    // change between MT and CT.
    // Will be deleted when inserting the formula or canceling it
    this.core.editionProperties.temporalImage = element;
    super.doubleClickHandler(element);
  }

  /** @inheritdoc */
  openExistingFormulaEditor() {
    super.openExistingFormulaEditor();
  }

  /** @inheritdoc */
  openNewFormulaEditor() {
    // If it exists a temporal image saved, open the existing formula editor
    const image = this.core.editionProperties.temporalImage;
    if (image !== null && typeof image !== 'undefined' && image.classList.contains(WirisPlugin.Configuration.get('imageClassName'))) {
      this.openExistingFormulaEditor();
    } else {
      super.openNewFormulaEditor();
    }
  }

  /**
     * Hides the active Froala popups.
     */
  hidePopups() {
    this.editorObject.popups.hideAll();
  }

  /** @inheritdoc */
  insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
    // Due to insertFormula adds an image using pure JavaScript functions,
    // it is needed notificate to the editorObject that placeholder status
    // has to be updated.
    this.editorObject.events.trigger('contentChanged');
    const obj = super.insertFormula(focusElement, windowTarget, mathml, wirisProperties);
    // Delete temporal image when inserting a formula
    this.core.editionProperties.temporalImage = null;
    this.editorObject.placeholder.refresh();
    return obj;
  }

  /** @inheritdoc */
  getSelection() {
    // Focus editor object to create a selection.
    this.editorObject.el.focus();
    return this.editorObject.selection.get();
  }
}

(function ($) {
  /**
     * This method creates an instance of FroalaIntegration object extending necessary methods
     * to integrate the plugin into Froala editor.
     * @param {Object} editor - Froala editor object.
     */
  function createIntegrationModel(editor) {
    // Select target: choose between iframe, div or image.
    let target;
    if (editor.opts.iframe) {
      target = editor.$iframe[0]; // eslint-disable-line prefer-destructuring
    } else {
      // For div or image HTMLElement.
      target = editor.el;
    }

    const callbackMethodArguments = {};
    callbackMethodArguments.editor = editor;

    /** @type {integrationModelProperties} */
    const froalaIntegrationProperties = {};
    froalaIntegrationProperties.target = target;
    froalaIntegrationProperties.serviceProviderProperties = {};
    froalaIntegrationProperties.serviceProviderProperties.URI = 'https://www.wiris.net/demo/plugins/app';
    froalaIntegrationProperties.serviceProviderProperties.server = 'java';
    froalaIntegrationProperties.version = packageInfo.version;
    froalaIntegrationProperties.scriptName = 'wiris.js';
    froalaIntegrationProperties.environment = {};
    froalaIntegrationProperties.environment.editor = 'Froala';
    froalaIntegrationProperties.environment.editorVersion = '2.x';
    froalaIntegrationProperties.callbackMethodArguments = callbackMethodArguments;
    froalaIntegrationProperties.editorObject = editor;
    froalaIntegrationProperties.initOnImageMode = target.nodeName.toLowerCase() === 'img';

    // Updating integration paths if context path is overwritten by editor javascript configuration.
    if ('wiriscontextpath' in editor.opts) {
      froalaIntegrationProperties.configurationService = editor.opts.wiriscontextpath + froalaIntegrationProperties.configurationService;
      console.warn('Deprecated property wiriscontextpath. Use mathTypeParameters on instead.', editor.opts.wiriscontextpath);
    }

    // Overriding MathType integration parameters.
    if ('mathTypeParameters' in editor.opts) {
      froalaIntegrationProperties.integrationParameters = editor.opts.mathTypeParameters;
    }
    const froalaIntegrationInstance = new FroalaIntegration(froalaIntegrationProperties);
    froalaIntegrationInstance.init();
    froalaIntegrationInstance.listeners.fire('onTargetReady', {});
    WirisPlugin.instances[froalaIntegrationInstance.editorObject.id] = froalaIntegrationInstance;
    // The last instance as current instance.
    WirisPlugin.currentInstance = froalaIntegrationInstance;
  }

  $.FroalaEditor.PLUGINS.wiris = function (editor) {
    // Init method, here we create the instance of the FroalaIntegration class.
    function _init() {
      createIntegrationModel(editor);
    }

    return {
      _init,
    };
  };

  // Icon templates for MathType.
  $.FroalaEditor.DefineIconTemplate('wirisplugin', '<i class="icon icon-[NAME]"></i>');
  $.FroalaEditor.DefineIcon('wirisEditor', { NAME: 'mathtype-editor', template: 'wirisplugin' });

  // Command for MathType.
  $.FroalaEditor.RegisterCommand('wirisEditor', {
    title: 'Insert a math equation - MathType',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback(editorObject) { // eslint-disable-line no-unused-vars
      const currentFroalaIntegrationInstance = WirisPlugin.instances[this.id];
      currentFroalaIntegrationInstance.hidePopups();
      currentFroalaIntegrationInstance.core.getCustomEditors().disable();
      const imageObject = currentFroalaIntegrationInstance.editorObject.image.get();
      if (typeof imageObject !== 'undefined' && imageObject !== null && imageObject.hasClass(WirisPlugin.Configuration.get('imageClassName'))) {
        currentFroalaIntegrationInstance.core.editionProperties.temporalImage = imageObject[0]; // eslint-disable-line prefer-destructuring
        currentFroalaIntegrationInstance.openExistingFormulaEditor();
      } else {
        currentFroalaIntegrationInstance.openNewFormulaEditor();
      }
    },
  });

  // Prevent Froala to add it's own classes to the images generated with MathType.
  $.FroalaEditor.COMMANDS.wirisEditor.refresh = function ($btn) {
    const selectedImage = this.image.get();
    // Value can be undefined.
    if (selectedImage) {
      if (($btn.parent()[0].hasAttribute('class') && $btn.parent()[0].getAttribute('class').indexOf('fr-buttons') === -1) || (selectedImage[0]
                && ($(selectedImage[0]).hasClass(Configuration.get('imageClassName')) || $(selectedImage[0]).contents().hasClass(Configuration.get('imageClassName'))))) { // Is a MathType image.
        // Show MathType icons if previously were hiden.
        $btn.removeClass('fr-hidden');
        // Disable resize box.
        if (!$('#wrs_style').get(0)) {
          $('head').append('<style id="wrs_style">.fr-image-resizer {pointer-events: none;}</style>');
        }
      } else { // Is a non-MathType image.
        // Hide MathType icons.
        $btn.addClass('fr-hidden');
        // Enable resize box (if it was configured).
        if ($('#wrs_style').get(0)) {
          $('#wrs_style').get(0).remove();
        }
      }
    }
  };

  // Template for ChemType.
  $.FroalaEditor.DefineIcon('wirisChemistry', { NAME: 'mathtype-chemistry', template: 'wirisplugin' });

  // Command for ChemType.
  $.FroalaEditor.RegisterCommand('wirisChemistry', {
    title: 'Insert a chemistry formula - ChemType',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback() {
      const currentFroalaIntegrationInstance = WirisPlugin.instances[this.id];
      currentFroalaIntegrationInstance.hidePopups();
      currentFroalaIntegrationInstance.core.getCustomEditors().enable('chemistry');
      const imageObject = currentFroalaIntegrationInstance.editorObject.image.get();
      if (typeof imageObject !== 'undefined' && imageObject !== null && imageObject.hasClass(WirisPlugin.Configuration.get('imageClassName'))) {
        currentFroalaIntegrationInstance.core.editionProperties.temporalImage = imageObject[0]; // eslint-disable-line prefer-destructuring
        currentFroalaIntegrationInstance.openExistingFormulaEditor();
      } else {
        currentFroalaIntegrationInstance.openNewFormulaEditor();
      }
    },
  });

  // Prevent Froala to add it's own classes to the images generated with ChemType.
  $.FroalaEditor.COMMANDS.wirisChemistry.refresh = $.FroalaEditor.COMMANDS.wirisEditor.refresh;
}(jQuery)); // eslint-disable-line no-undef
