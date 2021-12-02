import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser';
import Util from '@wiris/mathtype-html-integration-devkit/src/util';
import formulaIcon from './icons/formula.png';
import chemIcon from './icons/chem.png';

import packageInfo from './package.json';

/**
 * This property contains the current Generic integration instance,
 * which is the instance of the active editor.
 * @type {IntegrationModel}
 */
export const currentInstance = null;

/**
 * Inits MathType creating an object with all properties that the IntegrationModel class
 * needs to initialize the plugin and create an instance of IntegrationModel child.
 * @param {HTMLElement} target - DOM target, in this integration the editable iframe.
 * @param {HTMLElement} toolbar - DOM element where icons will be inserted.
 */
export function wrsInitEditor(target, toolbar, mathtypeProperties) {
  /**
     * @type {integrationModelProperties}
     */
  const genericIntegrationProperties = {};
  genericIntegrationProperties.target = target;
  genericIntegrationProperties.toolbar = toolbar;
  if (typeof mathtypeProperties !== 'undefined') {
    genericIntegrationProperties.integrationParameters = mathtypeProperties;
  }

  // GenericIntegration instance.
  const genericIntegrationInstance = new GenericIntegration(genericIntegrationProperties); // eslint-disable-line no-use-before-define
  genericIntegrationInstance.init();
  genericIntegrationInstance.listeners.fire('onTargetReady', {});

  WirisPlugin.currentInstance = genericIntegrationInstance;
}

/**
 * Gets the html content of the Generic editor and parses it to transform the latex
 * $$$$ into a mathml image
 * @param {HTMLElement} target - DOM target, in this integration the editable iframe
 * @returns {HTMLElement} The html content of the target parsed with the wiris funcions
 */
export function wrsGetTargetHtml(target) {
  const html = target.innerHTML;
  return WirisPlugin.Parser.endParse(html);
}

/**
 * Backwards compatibility init method.
 */
window.wrs_int_init = wrsInitEditor;
/**
 * IntegrationModel constructor. This method sets the dependant
 * integration properties needed by the IntegrationModel class to init the plugin.
 */
export default class GenericIntegration extends IntegrationModel {
  /**
     * @constructs
     * @param {IntegrationModelProperties} integrationModelProperties
     */
  constructor(integrationModelProperties) {
    if (typeof (integrationModelProperties.serviceProviderProperties) === 'undefined') {
      integrationModelProperties.serviceProviderProperties = {};
      integrationModelProperties.serviceProviderProperties.URI = 'https://www.wiris.net/demo/plugins/app';
      integrationModelProperties.serviceProviderProperties.server = 'java';
    }
    integrationModelProperties.version = packageInfo.version;
    integrationModelProperties.scriptName = 'wirisplugin-generic.js';
    integrationModelProperties.environment = {};
    integrationModelProperties.environment.editor = 'GenericHTML';
    integrationModelProperties.environment.editorVersion = '1.0.0';

    super(integrationModelProperties);

    this.toolbar = null;
    this.toolbar = integrationModelProperties.toolbar;
    if (typeof integrationModelProperties.configurationService !== 'undefined') {
      this.configurationService = integrationModelProperties.configurationService;
    }
  }

  /**
     * Returns the demo language, stored in _wrs_int_langCode variable. If the language
     * is no set set, calls parent getLanguage() method.
     * @returns {string} demo language.
     */
  getLanguage() {
    try {
      return this.editorParameters.language;
    } catch (e) { console.error(); }
    if (typeof _wrs_int_langCode !== 'undefined') { // eslint-disable-line camelcase
      console.warn('Deprecated property wirisformulaeditorlang. Use mathTypeParameters on instead.');
      return _wrs_int_langCode; // eslint-disable-line camelcase, no-undef
    }
    return super.getLanguage();
  }

  /** @inheritdoc */
  callbackFunction() {
    // Call parent callbackFunction in order to addEvents to integration target.
    super.callbackFunction();
    /* Parsing input text */
    if (this.isIframe) {
      this.target.contentWindow.document.body.innerHTML = Parser.initParse(this.target.contentWindow.document.body.innerHTML);
    } else {
      this.target.innerHTML = Parser.initParse(this.target.innerHTML);
    }

    /* Creating toolbar buttons */
    const formulaButton = document.createElement('img');
    formulaButton.id = 'editorIcon';
    formulaButton.src = formulaIcon;
    formulaButton.style.cursor = 'pointer';

    Util.addEvent(formulaButton, 'click', () => {
      this.core.getCustomEditors().disable();
      this.openNewFormulaEditor();
    });

    this.toolbar.appendChild(formulaButton);

    // Dynamic customEditors buttons.
    const customEditors = this.getCore().getCustomEditors();
    // Iterate from all custom editors.
    for (const customEditor in customEditors.editors) {
      if (customEditors.editors[customEditor].confVariable) {
        const customEditorButton = document.createElement('img');
        // TODO make this work and add promises polyfill
        // import('./icons/' + customEditors.editors[customEditor].icon).then(({default: customEditorIcon}) => {
        //     customEditorButton.src = customEditorIcon;
        // });
        // Horrible hard-coded temporary fix
        if (customEditor === 'chemistry') {
          customEditorButton.src = chemIcon;
        }
        customEditorButton.id = `${customEditor}Icon`;
        customEditorButton.style.cursor = 'pointer';

        Util.addEvent(customEditorButton, 'click', () => {
          customEditors.enable(customEditor);
          this.openNewFormulaEditor();
        });

        this.toolbar.appendChild(customEditorButton);
      }
    }
  }

  /**
     * @inheritdoc
     * @param {HTMLElement} element - DOM object target.
     */
  doubleClickHandler(element) {
    this.core.editionProperties.temporalImage = element;
    super.doubleClickHandler(element);
  }

  /** @inheritdoc */
  openNewFormulaEditor() {
    // If it exists a temporal image saved, open the existing formula editor
    const image = this.core.editionProperties.temporalImage;
    if (image !== null && typeof image !== 'undefined') {
      super.openExistingFormulaEditor();
    } else {
      super.openNewFormulaEditor();
    }
  }

  insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
    const obj = super.insertFormula(focusElement, windowTarget, mathml, wirisProperties);

    // Delete temporal image when inserting a formula
    this.core.editionProperties.temporalImage = null;
    return obj;
  }
}
