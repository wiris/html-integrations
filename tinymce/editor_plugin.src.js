import IntegrationModel from './core/src/integrationmodel.js';
import Configuration from './core/src/configuration.js';
import Parser from './core/src/parser.js';
import Util from './core/src/util';
import Listeners from './core/src/listeners';

/**
 * TinyMCE integration class. This class extends IntegrationModel class.
 */
export default class TinyMceIntegration extends IntegrationModel {

    constructor(integrationModelProperties) {
        super(integrationModelProperties);
        /**
         * Indicates if the content of the TinyMCe editor has
         * been parsed.
         * @type {boolean}
         */
        this.initParsed = integrationModelProperties.initParsed;
        /**
         * Indicates if the TinyMCE is integrated in Moodle.
         * @type {boolean}
         */
        this.isMoodle = integrationModelProperties.isMoodle;
        /**
         * Indicates if the plugin is loaded as an external plugin by TinyMCE.
         * @type {boolean}
         */
        this.isExternal = integrationModelProperties.isExternal;
    }


    /**
     * Returns the absolute path of the integration script. Depends on
     * TinyMCE integration (Moodle or standard).
     * @returns {boolean} - Absolute path for the integration script.
     */
    getPath() {
        if (this.isMoodle) {
            var search = 'lib/editor/tinymce';
            var pos = tinymce.baseURL.indexOf(search);
            var baseURL = tinymce.baseURL.substr(0, pos + search.length);
            return baseURL + '/plugins/tiny_mce_wiris/tinymce/';
        } else if (this.isExternal) {
            var externalUrl = this.editorObject.getParam('external_plugins')['tiny_mce_wiris'];
            return externalUrl.substring(0, externalUrl.lastIndexOf('/')+1)

        } else {
            return tinymce.baseURL + '/plugins/tiny_mce_wiris/';
        }
    }

    /**
     * Returns the absolute path of plugin icons. A set of different
     * icons is needed for TinyMCE and Moodle 2.5-
     * @returns {string} - Absolute path of the icons folder.
     */
    getIconsPath() {
        if (this.isMoodle && Configuration.get('versionPlatform') < 2013111800) {
            return this.getPath() + 'icons/tinymce3/';
        } else {
            return this.getPath() + 'icons/';
        }

    }

    /**
     * Returns the integration language. TinyMCE language is inherited.
     * @returns {string} - Integration language.
     */
    getLanguage() {
        if (this.editorObject.settings['wirisformulaeditorlang']) {
            return editor.settings['wirisformulaeditorlang'];
        }
        return this.editorObject.getParam('language');
    }

    /**
     * Callback function called before 'onTargetLoad' is fired. All the logic here is to
     * avoid TinyMCE change MathType formulas.
     */
    callbackFunction() {
        var dataImgFiltered = [];
        super.callbackFunction();

        // Avoid to change class of image formulas.
        var imageClassName = Configuration.get('imageClassName');
        if (this.isIframe) {
            // Attaching observers to wiris images.
            if (typeof Parser.observer != 'undefined') {
                Array.prototype.forEach.call(this.target.contentDocument.getElementsByClassName(imageClassName), function(wirisImages) {
                    Parser.observer.observe(wirisImages);
                });
            }
        } else { // Inline.
            // Attaching observers to wiris images.
            Array.prototype.forEach.call(document.getElementsByClassName(imageClassName), function(wirisImages) {
                Parser.observer.observe(wirisImages);
            });
        }

        // When a formula is updated TinyMCE 'Change' event must be fired.
        // See https://www.tiny.cloud/docs/advanced/events/#change for further information.
        var listener = Listeners.newListener('onAfterFormulaInsertion', function() {
            if (typeof this.editorObject.fire != 'undefined') {
                this.editorObject.fire('Change');
            }
        }.bind(this));
        this.getCore().addListener(listener);

        // Avoid filter formulas with performance enabled.
        dataImgFiltered[this.editorObject.id] = this.editorObject.settings.images_dataimg_filter;
        this.editorObject.settings.images_dataimg_filter = function(img) {
            if (img.hasAttribute('class') && img.getAttribute('class').indexOf(Configuration.get(imageClassName)) != -1) {
                return img.hasAttribute('internal-blob');
            }
            else {
                // If the client put an image data filter, run. Otherwise default behaviour (put blob).
                if (typeof dataImgFiltered[this.editorObject.id] != 'undefined') {
                    return dataImgFiltered[this.editorObject.id](img);
                }
                return true;
            }
        }
    }
}

/**
 * Object containing all TinyMCE integration instances. One for each TinyMCE editor.
 * @type {Object}
 */
export var instances = {};
/**
 * TinyMCE integration current instance. The current instance
 * is the instance related with the focused editor.
 * @type {TinyMceIntegration}
 */
export var currentInstance = null;

/* Plugin integration */
(function () {
    tinymce.create('tinymce.plugins.tiny_mce_wiris', {
        init: function (editor, url) {

            // Array with MathML valid alements.
            var validMathML = [
                            'math[*]',
                            'maction[*]]',
                            'malignmark[*]',
                            'maligngroup[*]',
                            'menclose[*]',
                            'merror[*]',
                            'mfenced[*]',
                            'mfrac[*]',
                            'mglyph[*]',
                            'mi[*]',
                            'mlabeledtr[*]',
                            'mlongdiv[*]',
                            'mmultiscripts[*]',
                            'mn[*]',
                            'mo[*]',
                            'mover[*]',
                            'mpadded[*]',
                            'mphantom[*]',
                            'mprescripts[*]',
                            'mroot[*]',
                            'mrow[*]',
                            'ms[*]',
                            'mscarries[*]',
                            'mscarry[*]',
                            'msgroup[*]',
                            'msline[*]',
                            'mspace[*]',
                            'msqrt[*]',
                            'msrow[*]',
                            'mstack[*]',
                            'mstyle[*]',
                            'msub[*]',
                            'msubsup[*]',
                            'msup[*]',
                            'mtable[*]',
                            'mtd[*]',
                            'mtext[*]',
                            'mtr[*]',
                            'munder[*]',
                            'munderover[*]',
                            'semantics[*]',
                            'annotation[*]',
                           ];

            editor.settings.extended_valid_elements += ',' + validMathML.join();

            var callbackMethodArguments = {};

            /**
             * Integration model properties
             * @type {object}
             * @property {object} target - Integration DOM target.
             * @property {string} configurationService - Configuration integration service.
             * @property {string} version - Plugin version.
             * @property {string} scriptName - Integration script name.
             * @property {object} environment - Integration environment properties.
             * @property {string} editor - Editor name.
             */
            var integrationModelProperties = {};
            integrationModelProperties.configurationService = '@param.js.configuration.path@';
            integrationModelProperties.version = '@plugin.version@';
            integrationModelProperties.isMoodle = @param.js.isMoodle@;
            if (typeof(editor.getParam('wiriscontextpath')) !== 'undefined') {
                integrationModelProperties.configurationService = Util.concatenateUrl(editor.getParam('wiriscontextpath'), integrationModelProperties.configurationService);
                editor.getParam('wiriscontextpath') + '/' + integrationModelProperties.configurationService;
            }
            integrationModelProperties.version = '7.5.0.1414';
            integrationModelProperties.scriptName = "plugin.min.js";
            integrationModelProperties.environment = {};
            integrationModelProperties.environment.editor = "TinyMCE 4.x";
            integrationModelProperties.callbackMethodArguments = callbackMethodArguments;
            integrationModelProperties.editorObject = editor;
            integrationModelProperties.initParsed = false;
            // We need to create the instance before TinyMce initialization in order to register commands.
            // However, as TinyMCE is not initialized at this point the HTML target is not created.
            // Here we create the target as null and onInit object the target is updated.
            integrationModelProperties.target = null;
            var isExternalPlugin = typeof(editor.getParam('external_plugins')) !== 'undefined' && 'tiny_mce_wiris' in editor.getParam('external_plugins');
            integrationModelProperties.isExternal = isExternalPlugin;
            integrationModelProperties.rtl = (editor.getParam('directionality') === 'rtl');


            // GenericIntegration instance.
            var tinyMceIntegrationInstance = new TinyMceIntegration(integrationModelProperties);
            tinyMceIntegrationInstance.init();
            WirisPlugin.instances[tinyMceIntegrationInstance.editorObject.id] = tinyMceIntegrationInstance;
            WirisPlugin.currentInstance = tinyMceIntegrationInstance;

            var onInit = function (editor) {
                var integrationInstance = WirisPlugin.instances[tinyMceIntegrationInstance.editorObject.id];
                if (!editor.inline) {
                    integrationInstance.setTarget(editor.getContentAreaContainer().firstChild);
                } else {
                    integrationInstance.setTarget(editor.getElement());
                }
                integrationInstance.setEditorObject(editor);
                integrationInstance.listeners.fire('onTargetReady', {});
                if ('wiriseditorparameters' in editor.settings) {
                    Configuration.update('_wrs_conf_editorParameters', editor.settings.wiriseditorparameters);
                }

                var content = editor.getContent();

                // Bug fix: In Moodle2.x when TinyMCE is set to full screen
                // the content doesn't need to be filtered.
                if (!editor.getParam('fullscreen_is_enabled') && content !== "") {
                    // We set content in html because other tiny plugins need data-mce
                    // and this is not posibil with raw format.
                    editor.setContent(Parser.initParse(content, editor.getParam('language')), {format: "html"});
                    // This clean undoQueue for prevent onChange and Dirty state.
                    editor.undoManager.clear();
                }

                // Init parsing OK. If a setContent method is called
                // wrs_initParse is called again.
                // Now if source code is edited the returned code is parsed.
                // PLUGINS-1070: We set this variable out of condition to parse content after.
                WirisPlugin.instances[editor.id].initParsed = true;
            }

            if ('onInit' in editor) {
                editor.onInit.add(onInit);
            }
            else {
                editor.on('init', function () {
                    onInit(editor);
                });
            }

            if ('onActivate' in editor) {
                editor.onActivate.add( function (editor) {
                    WirisPlugin.currentInstance = WirisPlugin.instances[tinymce.activeEditor.id];
                });
            }
            else {
                editor.on('focus', function (event) {
                    WirisPlugin.currentInstance = WirisPlugin.instances[tinymce.activeEditor.id];
                });
            }

            var onSave = function (editor, params) {
                    params.content = Parser.endParse(params.content, editor.getParam('language'));
            }

            if ('onSaveContent' in editor) {
                editor.onSaveContent.add(onSave);
            }
            else {
                editor.on('saveContent', function (params) {
                    onSave(editor, params);
                });
            }

            if ('onGetContent' in editor) {
                editor.onGetContent.add(onSave);
            } else {
                editor.on('getContent', function(params) {
                    onSave(editor, params);
                });
            }

            if ('onBeforeSetContent' in editor) {
                editor.onBeforeSetContent.add(function(e,params) {
                    if (WirisPlugin.currentInstance.initParsed) {
                        params.content = Parse.initParse(params.content, editor.getParam('language'));
                    }
                });
            } else {
                editor.on('beforeSetContent', function(params) {
                    if (WirisPlugin.currentInstance.initParsed) {
                        params.content = Parser.initParse(params.content, editor.getParam('language'));
                    }
                });
            }
            // We use a mutation to observe iframe of tiny and filter to remove data-mce.
            const observerConfig = { attributes: true, childList: true, characterData: true, subtree: true };
            function onMutations(mutations) {
                Array.prototype.forEach.call(mutations,function(mutation) {
                    Array.prototype.forEach.call(mutation.addedNodes,function(node) {
                        // We search only in element nodes.
                        if (node.nodeType == 1) {
                            Array.prototype.forEach.call(node.getElementsByClassName(WirisPlugin.Configuration.get('imageMathmlAttribute')),function(image) {
                                image.removeAttribute('data-mce-src');
                                image.removeAttribute('data-mce-style');
                            });
                        }
                    });
                });
            }
            var mutationInstance = new MutationObserver(onMutations);
            // We wait for iframe definition for observe this.
            function waitForIframeBody() {
                if (typeof editor.contentDocument != 'undefined') {
                    mutationInstance.observe(editor.getBody(), observerConfig);
                } else {
                    setTimeout(waitForIframeBody, 50);
                }
            }
            waitForIframeBody();

            // MathType button.
            editor.addCommand('tiny_mce_wiris_openFormulaEditor', function () {
                WirisPlugin.currentInstance.openNewFormulaEditor();
            });

            editor.addButton('tiny_mce_wiris_formulaEditor', {
                title: 'Insert a math equation - MathType',
                cmd: 'tiny_mce_wiris_openFormulaEditor',
                image: WirisPlugin.currentInstance.getIconsPath() + 'formula.png'
            });
            // }

            // Dynamic customEditors buttons.
            var customEditors = WirisPlugin.currentInstance.getCore().getCustomEditors();

            for (var customEditor in customEditors.editors) {
                if (customEditors.editors[customEditor].confVariable) {
                    var cmd = 'tiny_mce_wiris_openFormulaEditor' + customEditors.editors[customEditor].name;
                    editor.addCommand(cmd, function () {
                        customEditors.enable(customEditor);
                        WirisPlugin.currentInstance.openNewFormulaEditor();
                    });

                    editor.addButton('tiny_mce_wiris_formulaEditor' + customEditors.editors[customEditor].name, {
                        title:  customEditors.editors[customEditor].tooltip,
                        cmd: cmd,
                        image: WirisPlugin.currentInstance.getIconsPath() + customEditors.editors[customEditor].icon
                    });
                }

            }
        },

        // All versions.
        getInfo: function () {
            return {
                longname : 'tiny_mce_wiris',
                author : 'Maths for More',
                authorurl : 'http://www.wiris.com',
                infourl : 'http://www.wiris.com',
                version : '@plugin.version@'
            };
        }
    });

    tinymce.PluginManager.add('tiny_mce_wiris', tinymce.plugins.tiny_mce_wiris);
})();


