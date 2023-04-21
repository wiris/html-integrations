import IntegrationModel from '@wiris/mathtype-html-integration-devkit/src/integrationmodel';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser';
import Util from '@wiris/mathtype-html-integration-devkit/src/util';
import Listeners from '@wiris/mathtype-html-integration-devkit/src/listeners';
import StringManager from '@wiris/mathtype-html-integration-devkit/src/stringmanager';

import packageInfo from './package.json';

/**
 * TinyMCE integration class. This class extends IntegrationModel class.
 */
export class TinyMceIntegration extends IntegrationModel {
  constructor(integrationModelProperties) {
    super(integrationModelProperties);
    /**
     * Indicates if the content of the TinyMCe editor has
     * been parsed.
     * @type {Boolean}
     */
    this.initParsed = integrationModelProperties.initParsed;
    /**
     * Indicates if the TinyMCE is integrated in Moodle.
     * @type {Boolean}
     */
    this.isMoodle = integrationModelProperties.isMoodle;
    /**
     * Indicates if the plugin is loaded as an external plugin by TinyMCE.
     * @type {Boolean}
     */
    this.isExternal = integrationModelProperties.isExternal;
  }

  /**
   * Returns the absolute path of the integration script. Depends on
   * TinyMCE integration (Moodle or standard).
   * @returns {Boolean} - Absolute path for the integration script.
   */
  getPath() {
    if (this.isMoodle) {
      // return '/lib/editor/tinymce/plugins/tiny_mce_wiris/tinymce/';
      const search = 'lib/editor/tinymce';
      const pos = tinymce.baseURL.indexOf(search);
      const baseURL = tinymce.baseURL.substr(0, pos + search.length);
      return `${baseURL}/plugins/tiny_mce_wiris/tinymce/`;
    } if (this.isExternal) {
      const externalUrl = this.editorObject.options.get('external_plugins').tiny_mce_wiris;
      return externalUrl.substring(0, externalUrl.lastIndexOf('/') + 1);
    }
    return `${tinymce.baseURL}/plugins/tiny_mce_wiris/`;
  }

  /**
   * Returns the absolute path of plugin icons. A set of different
   * icons is needed for TinyMCE and Moodle 2.5-
   * @returns {String} - Absolute path of the icons folder.
   */
  getIconsPath() {
    if (this.isMoodle && Configuration.get('versionPlatform') < 2013111800) {
      return `${this.getPath()}icons/tinymce3/`;
    }
    return `${this.getPath()}icons/`;
  }

  /**
   * Returns the integration language. TinyMCE language is inherited.
   * When no language is set, TinyMCE sets the toolbar to english.
   * @returns {String} - Integration language.
   */
  getLanguage() {
    const editorSettings = this.editorObject;
    try {
      return editorSettings.options.get('mathTypeParameters').editorParameters.language;
    } catch (e) { console.error(); }
    // Get the deprecated wirisformulaeditorlang
    if (editorSettings.options.get('wirisformulaeditorlang')) {
      console.warn('Deprecated property wirisformulaeditorlang. Use mathTypeParameters on instead.');
      return editorSettings.options.get('wirisformulaeditorlang');
    }
    const langParam = this.editorObject.options.get('language');
    return langParam || super.getLanguage();
  }

  /**
   * Callback function called before 'onTargetLoad' is fired. All the logic here is to
   * avoid TinyMCE change MathType formulas.
   */
  callbackFunction() {
    const dataImgFiltered = [];
    super.callbackFunction();

    // Avoid to change class of image formulas.
    const imageClassName = Configuration.get('imageClassName');
    if (this.isIframe) {
      // Attaching observers to wiris images.
      if (typeof Parser.observer !== 'undefined') {
        Array.prototype.forEach.call(this.target.contentDocument.getElementsByClassName(imageClassName), (wirisImages) => {
          Parser.observer.observe(wirisImages);
        });
      }
    } else { // Inline.
      // Attaching observers to wiris images.
      Array.prototype.forEach.call(document.getElementsByClassName(imageClassName), (wirisImages) => {
        Parser.observer.observe(wirisImages);
      });
    }

    // When a formula is updated TinyMCE 'Change' event must be fired.
    // See https://www.tiny.cloud/docs/advanced/events/#change for further information.
    const listener = Listeners.newListener('onAfterFormulaInsertion', () => {
      if (typeof this.editorObject.fire !== 'undefined') {
        this.editorObject.fire('Change');
      }
    });
    this.getCore().addListener(listener);

    // Deprecated part on TinyMCE6; We need to find a workaround
    // Avoid filter formulas with performance enabled.
    dataImgFiltered[this.editorObject.id] = this.editorObject.images_dataimg_filter;
    this.editorObject.images_dataimg_filter = (img) => {
      if (img.hasAttribute('class') && img.getAttribute('class').indexOf(Configuration.get('imageClassName')) !== -1) {
        return img.hasAttribute('internal-blob');
      }
      // If the client put an image data filter, run. Otherwise default behaviour (put blob).
      if (typeof dataImgFiltered[this.editorObject.id] !== 'undefined') {
        return dataImgFiltered[this.editorObject.id](img);
      }
      return true;
    };
  }

  /**
   * Fires the event ExecCommand and transform a MathML into an image formula.
   * @param {string} mathml - MathML to generate the formula and can be caught with the event.
   */
  updateFormula(mathml) {
    if (typeof this.editorObject.fire !== 'undefined') {
      this.editorObject.fire('ExecCommand', { command: 'updateFormula', value: mathml });
    }
    super.updateFormula(mathml);
  }
}

/**
 * Object containing all TinyMCE integration instances. One for each TinyMCE editor.
 * @type {Object}
 */
export const instances = {};

/**
 * TinyMCE integration current instance. The current instance
 * is the instance related with the focused editor.
 * @type {TinyMceIntegration}
 */
export const currentInstance = null;

/*
  Note: We have included the plugin in the same JavaScript file as the TinyMCE
  instance for display purposes only. Tiny recommends not maintaining the plugin
  with the TinyMCE instance and using the `external_plugins` option.
*/
(function () {
  tinymce.PluginManager.add('tiny_mce_wiris', (editor, url) => ({ // eslint-disable-line no-unused-vars
    init(editor) {
      const callbackMethodArguments = {};

      /**
         * Integration model properties
         * @type {Object}
         * @property {Object} target - Integration DOM target.
         * @property {String} configurationService - Configuration integration service.
         * @property {String} version - Plugin version.
         * @property {String} scriptName - Integration script name.
         * @property {Object} environment - Integration environment properties.
         * @property {String} editor - Editor name.
      */
      const integrationModelProperties = {};
      integrationModelProperties.serviceProviderProperties = {
        URI: process.env.SERVICE_PROVIDER_URI,
        server: process.env.SERVICE_PROVIDER_SERVER,
      };
      integrationModelProperties.version = packageInfo.version;
      integrationModelProperties.isMoodle = (!!((typeof M === 'object' && M !== null))); // eslint-disable-line no-undef
      if (integrationModelProperties.isMoodle) {
        // eslint-disable-next-line no-undef
        integrationModelProperties.configurationService = M.cfg.wwwroot + '/filter/wiris/integration/configurationjs.php'; // eslint-disable-line prefer-template
      }
      if (typeof (editor.options.get('wiriscontextpath')) !== 'undefined') {
        integrationModelProperties.configurationService = Util.concatenateUrl(editor.options.get('wiriscontextpath'), integrationModelProperties.configurationService);
        `${editor.options.get('wiriscontextpath')}/${integrationModelProperties.configurationService}`; // eslint-disable-line no-unused-expressions
        console.warn('Deprecated property wiriscontextpath. Use mathTypeParameters instead.', editor.opts.wiriscontextpath);
      }

      // Overriding MathType integration parameters.

      // Register our custom parameters inside TinyMCE's options
      editor.options.register('mathTypeParameters', {
        processor: 'object',
        default: {},
      });

      if (editor.options.isRegistered('mathTypeParameters')) {
        integrationModelProperties.integrationParameters = editor.options.get('mathTypeParameters');
      }

      integrationModelProperties.scriptName = 'plugin.min.js';
      integrationModelProperties.environment = {};

      integrationModelProperties.environment.editor = 'TinyMCE 6.x';
      integrationModelProperties.environment.editorVersion = `${tinymce.majorVersion}.${tinymce.minorVersion}`;

      integrationModelProperties.callbackMethodArguments = callbackMethodArguments;
      integrationModelProperties.editorObject = editor;
      integrationModelProperties.initParsed = false;
      // We need to create the instance before TinyMce initialization in order to register commands.
      // However, as TinyMCE is not initialized at this point the HTML target is not created.
      // Here we create the target as null and onInit object the target is updated.
      integrationModelProperties.target = null;
      const isExternalPlugin = typeof (editor.options.get('external_plugins')) !== 'undefined' && 'tiny_mce_wiris' in editor.options.get('external_plugins');
      integrationModelProperties.isExternal = isExternalPlugin;
      integrationModelProperties.rtl = (editor.options.get('directionality') === 'rtl');

      // GenericIntegration instance.
      const tinyMceIntegrationInstance = new TinyMceIntegration(integrationModelProperties);
      tinyMceIntegrationInstance.init();
      WirisPlugin.instances[tinyMceIntegrationInstance.editorObject.id] = tinyMceIntegrationInstance;
      WirisPlugin.currentInstance = tinyMceIntegrationInstance;

      const onInit = function (editor) { // eslint-disable-line no-shadow
        const integrationInstance = WirisPlugin.instances[tinyMceIntegrationInstance.editorObject.id];
        if (!editor.inline) {
          integrationInstance.setTarget(editor.getContentAreaContainer().firstChild);
        } else {
          integrationInstance.setTarget(editor.getElement());
        }
        integrationInstance.setEditorObject(editor);
        integrationInstance.listeners.fire('onTargetReady', {});
        if (editor.options.isRegistered('mathTypeParameters')) {
          Configuration.update('editorParameters', editor.options.get('mathTypeParameters'));
        }

        // Prevent TinyMCE attributes insertion.
        // TinyMCE insert attributes only when a new node is inserted.
        // For this reason, the mutation observer only acts on addedNodes.
        const mutationInstance = new MutationObserver(function (editor, mutations) { // eslint-disable-line no-shadow
          Array.prototype.forEach.call(mutations, function (editor, mutation) { // eslint-disable-line no-shadow
            Array.prototype.forEach.call(mutation.addedNodes, function (editor, node) { // eslint-disable-line no-shadow
              if (node.nodeType === 1) {
                // Act only in our own formulas.
                Array.prototype.forEach.call(node.querySelectorAll(`.${WirisPlugin.Configuration.get('imageClassName')}`), ((editor, image) => { // eslint-disable-line no-shadow
                  // This only is executed due to init parse.
                  image.removeAttribute('data-mce-src');
                  image.removeAttribute('data-mce-style');
                }).bind(this, editor));
              }
            }.bind(this, editor));
          }.bind(this, editor));
        }.bind(this, editor));
        mutationInstance.observe(editor.getBody(), {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
        });

        const content = editor.getContent();
        // We set content in html because other tiny plugins need data-mce
        // and this is not possible with raw format.
        editor.setContent(Parser.initParse(content, editor.options.get('language')), { format: 'html' });
        // This clean undoQueue for prevent onChange and Dirty state.
        editor.undoManager.clear();
        // Init parsing OK. If a setContent method is called
        // wrs_initParse is called again.
        // Now if source code is edited the returned code is parsed.
        // PLUGINS-1070: We set this variable out of condition to parse content after.
        WirisPlugin.instances[editor.id].initParsed = true;
      };

      if ('onInit' in editor) {
        editor.onInit.add(onInit);
      } else {
        editor.on('init', () => {
          onInit(editor);
        });
      }

      if ('onActivate' in editor) {
        editor.onActivate.add((editor) => { // eslint-disable-line no-unused-vars, no-shadow
          WirisPlugin.currentInstance = WirisPlugin.instances[tinymce.activeEditor.id];
        });
      } else {
        editor.on('focus', (event) => { // eslint-disable-line no-unused-vars, no-shadow
          WirisPlugin.currentInstance = WirisPlugin.instances[tinymce.activeEditor.id];
        });
      }

      const onSave = function (editor, params) { // eslint-disable-line no-shadow
        params.content = Parser.endParse(params.content, editor.options.get('language'));
      };

      if ('onSaveContent' in editor) {
        editor.onSaveContent.add(onSave);
      } else {
        editor.on('saveContent', (params) => {
          onSave(editor, params);
        });
      }

      if ('onGetContent' in editor) {
        editor.onGetContent.add(onSave);
      } else {
        editor.on('getContent', (params) => {
          onSave(editor, params);
        });
      }

      if ('onBeforeSetContent' in editor) {
        editor.onBeforeSetContent.add((e, params) => {
          if (WirisPlugin.instances[editor.id].initParsed) {
            params.content = Parser.initParse(params.content, editor.options.get('language'));
          }
        });
      } else {
        editor.on('beforeSetContent', (params) => {
          if (WirisPlugin.instances[editor.id].initParsed) {
            params.content = Parser.initParse(params.content, editor.options.get('language'));
          }
        });
      }

      function openFormulaEditorFunction() {
        const tinyMceIntegrationInstance = WirisPlugin.instances[editor.id]; // eslint-disable-line no-shadow
        // Disable previous custom editors.
        tinyMceIntegrationInstance.core.getCustomEditors().disable();
        tinyMceIntegrationInstance.openNewFormulaEditor();
      }

      const commonEditor = editor.ui.registry;
      const mathTypeIcon = 'mathtypeicon';
      const chemTypeIcon = 'chemtypeicon';
      const mathTypeIconSvg = '<svg width="16" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 300 261.7" style="enable-background:new 0 0 300 261.7;" xml:space="preserve"><g id=icon-wirisformula stroke="none" stroke-width="1" fill-rule="evenodd"><g><path class="st1" d="M90.2,257.7c-11.4,0-21.9-6.4-27-16.7l-60-119.9c-7.5-14.9-1.4-33.1,13.5-40.5c14.9-7.5,33.1-1.4,40.5,13.5l27.3,54.7L121.1,39c5.3-15.8,22.4-24.4,38.2-19.1c15.8,5.3,24.4,22.4,19.1,38.2l-59.6,179c-3.9,11.6-14.3,19.7-26.5,20.6C91.6,257.7,90.9,257.7,90.2,257.7"/></g></g><g><g><path class="st2" d="M300,32.8c0-16.4-13.4-29.7-29.9-29.7c-2.9,0-7.2,0.8-7.2,0.8c-37.9,9.1-71.3,14-112,14c-0.3,0-0.6,0-1,0c-16.5,0-29.9,13.3-29.9,29.7c0,16.4,13.4,29.7,29.9,29.7l0,0c45.3,0,83.1-5.3,125.3-15.3h0C289.3,59.5,300,47.4,300,32.8"/></g></g></svg>'; // eslint-disable-line max-len
      const chemTypeIconSvg = '<svg width="16" height="16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve">  <image id="image0" width="16" height="16" x="0" y="0"href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiChwSIwERK9BGAAABfklEQVQoz12RvUtbcRiFn/uRXKNJNCJSokFFqoKDIjHEqKA4WRAc/AsUKl2Ck5ODIKKDm4v+BbqIEr8WQ+hgQSgOElGJgkPTih+3tUabeL3353A1CX3Hcx7OC+dIAIL3CwXEmJU6XBHWuyIVgIjrOcoUblCTrolE/D+gc0QsUJePEtrGh+jajzcg1GQu0W87ldl7zZQAtPP9Dh5lADNm25rx+Xb7ZdWMCAARyHXhVQD8iwAD+qLV61B++U4Hb5pKS9Tx3w05Umr+K3Mlsk6SfY7x9oX7OvDiwlEEoLPLNkdc4yRJG9WkuCoCxBV7JMhg8cgRl7h44m9xwhM3PLyVYnBni3LBX64p4MHGYLSzOV9UWDd8AO608iW+2eP5NyVN4JR/7rRU2T0MzVRmATI197FIInsmTeIErcwTxqcAxHPDFdLHE4cJmPV4AAKZ+XStyrkCMC00K8Qnj+6+kAFKjfE/sw6/zAXf7bFUqmill+5v7es+vzVqlhukOWCLr6/ZMH/PRaOKYwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0xMC0yOVQwMTozNTowMS0wNzowMOC+eEAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMTAtMjlUMDE6MzU6MDEtMDc6MDCR48D8AAAAAElFTkSuQmCC" /></svg>'; // eslint-disable-line max-len

      commonEditor.addIcon(mathTypeIcon, mathTypeIconSvg);
      commonEditor.addIcon(chemTypeIcon, chemTypeIconSvg);

      // The next two blocks create menu items to give the possibility
      // of add MathType in the menubar.
      commonEditor.addMenuItem('tiny_mce_wiris_formulaEditor', {
        text: 'MathType',
        icon: mathTypeIcon,
        onAction: openFormulaEditorFunction,
      });

      // Dynamic customEditors buttons.
      const customEditors = WirisPlugin.instances[editor.id].getCore().getCustomEditors();
      Object.keys(customEditors.editors).forEach((customEditor) => {
        if (customEditors.editors[customEditor].confVariable) {
          commonEditor.addMenuItem(`tiny_mce_wiris_formulaEditor${customEditors.editors[customEditor].name}`, {
            text: customEditors.editors[customEditor].title,
            icon: chemTypeIcon, // Parametrize when other custom editors are added.
            onAction: () => {
              customEditors.enable(customEditor);
              WirisPlugin.instances[editor.id].openNewFormulaEditor();
            },
          });
        }
      });

      // Get editor language code
      let lang_code = editor.options.get('language');
      lang_code = (lang_code.split("-")[0]).split("_")[0];

      // MathType button.
      commonEditor.addButton('tiny_mce_wiris_formulaEditor', {
        tooltip: StringManager.get('insert_math', lang_code),
        image: `${WirisPlugin.instances[editor.id].getIconsPath()}formula.png`,
        onAction: openFormulaEditorFunction,
        icon: mathTypeIcon,
      });

      // Dynamic customEditors buttons.
      for (const customEditor in customEditors.editors) {
        if (customEditors.editors[customEditor].confVariable) {
          const cmd = `tiny_mce_wiris_openFormulaEditor${customEditors.editors[customEditor].name}`;
          // eslint-disable-next-line no-inner-declarations, no-loop-func
          function commandFunction() {
            customEditors.enable(customEditor);
            WirisPlugin.instances[editor.id].openNewFormulaEditor(); // eslint-disable-line no-undef
          }
          editor.addCommand(cmd, commandFunction);
          commonEditor.addButton(`tiny_mce_wiris_formulaEditor${customEditors.editors[customEditor].name}`, {
            tooltip: StringManager.get('insert_chem', lang_code),
            onAction: commandFunction,
            image: WirisPlugin.instances[editor.id].getIconsPath() + customEditors.editors[customEditor].icon,
            icon: chemTypeIcon, // At the moment only chemTypeIcon because of the provisional solution for TinyMCE6.
          });
        }
      }
    },

    // All versions.
    getMetadata() {
      return {
        longname: 'tiny_mce_wiris',
        name: 'Maths for More',
        url: 'http://www.wiris.com',
        version: packageInfo.version,
      };
    },
  }));
}());
