import IntegrationModel, { integrationModelProperties } from './core/src/integrationmodel.js';
import Configuration from './core/src/configuration.js';
import Parser from './core/src/parser.js';

/**
 * This property contains all Froala Integration instances.
 * @type {Object}
 */
export var instances = {};
/**
 * This property contains the current Froala integration instance,
 * which is the instance of the active editor.
 * @type {IntegrationModel}
 */
export var currentInstance = null;

/**
 * Froala integration class.
 */
export class FroalaIntegration extends IntegrationModel {
    /**
     * Returns the language of the current Froala editor instance.
     */
    getLanguage() {
        if (this.editorObject.opts.language != null) {
            return this.editorObject.opts.language;
        } else {
            return this.getBrowserLanguage();
        }
    }

    /**@inheritdoc */
    init() {
        // On focus in a Froala editor instance, is needed to update the
        // Current FroalaIntegration instance.
        this.editorObject.events.on('focus', function(editorObject) {
            WirisPlugin.currentInstance = WirisPlugin.instances[this.editorObject.id];
        }.bind(this, this.editorObject));

        // Update editor parameters.
        // The integration could contain an object with editor parameters. These parameters
        // have preference over the backend parameters so we need to update them.
        var editor = this.editorObject;
        if ('wiriseditorparameters' in editor.opts) {
            Configuration.update('_wrs_conf_editorParameters', editor.opts.wiriseditorparameters);
        }

        // As always. When the data of Froala is retrieved we need to Parse the content.
        editor.events.on('html.get', function(e, editor, html) {
            return Parser.endParse(e);
        });

        // Adding parse MathML to images after command event to prevent
        // lost image formulas.
        editor.events.on('commands.after', function (cmd) {
            if(cmd == "html"){
                if(!editor.codeView.isActive()){
                    var parsedContent = Parser.initParse(editor.html.get(), editor.opts.language);
                    editor.html.set(parsedContent);
                }
            }
        });

        super.init();
    }

    /**@inheritdoc */
    callbackFunction() {
        super.callbackFunction();
        // Parse content

        // Events. Froala malforms data-uri in images. We need to
        // rewrite them.
        if (Configuration.get('imageFormat') == "svg") {
            this.editorObject.events.on('html.set', function () {
            var images = this.el.getElementsByClassName('Wirisformula');
            for (var i = 0; i < images.length; i++) {
                if (images[i].src.substr(0, 10) == "data:image") {
                var firstPart = images[i].src.substr(0, 33);
                var secondPart = images[i].src.substr(33, images[i].src.length);
                images[i].src = firstPart + encodeURIComponent(decodeURIComponent(secondPart));
                }
            }
            });
        }

        var parsedContent = Parser.initParse(this.editorObject.html.get());
        this.editorObject.html.set(parsedContent);
    }


    /**
     * Hide the active Froala popups.
     */
    hidePopups() {
        var instances =  $.FroalaEditor.INSTANCES;
        for (var i = 0; i < instances.length; i++) {
            instances[i].popups.hideAll();
        }
    }
}

(function ($) {
    /**
     * Auxiliary method. Returns the path of wiris.js script. Needed to load
     * CSS styles and core.js
     * @returns {string} - "wiris.js" file path.
     */
    function getScriptPath() {
        var scriptUrl;
        var scripts = document.getElementsByTagName("script");
        var scriptName = "wiris.js";
        for (var i = 0; i < scripts.length; i++) {
            var j = scripts[i].src.lastIndexOf(scriptName);
            if (j >= 0) {
                scriptUrl = scripts[i].src.substr(0, j - 1);
            }
        }
        return scriptUrl;
    }

    /**
     * This method creates an instance of FroalaIntegration object extending necessary methods
     * to integrate the plugin into Froala editor.
     * @param {Object} editor - Froala editor object.
     */
    function createIntegrationModel(editor) {
        // Select target: choose between iframe or div editable.
        var target;
        if (editor.opts.iframe) {
            target = editor.$iframe[0];
        } else {
            target = editor.$box[0]
        }

        var callbackMethodArguments = {};
        callbackMethodArguments.editor = editor;

        /**@type {integrationModelProperties} */
        var froalaIntegrationProperties = {};
        froalaIntegrationProperties.target = target;
        froalaIntegrationProperties.configurationService = 'integration/configurationjs.php';
        froalaIntegrationProperties.version = '7.5.0.1497';
        froalaIntegrationProperties.scriptName = "wiris.js";
        froalaIntegrationProperties.environment = {};
        froalaIntegrationProperties.environment.editor = "Froala";
        froalaIntegrationProperties.callbackMethodArguments = callbackMethodArguments;
        froalaIntegrationProperties.editorObject = editor;

        // Updating integration paths if context path is overwrited by editor javascript configuration.
        if ('wiriscontextpath' in editor.opts) {
            froalaIntegrationProperties.configurationService  = editor.opts.wiriscontextpath + froalaIntegrationProperties.configurationService;
        }
        var froalaIntegrationInstance = new FroalaIntegration(froalaIntegrationProperties);
        froalaIntegrationInstance.init();
        froalaIntegrationInstance.listeners.fire('onTargetReady', {});
        WirisPlugin.instances[froalaIntegrationInstance.editorObject.id] = froalaIntegrationInstance;
        // The last instance as current instance.
        WirisPlugin.currentInstance = froalaIntegrationInstance;
    }

    $.FroalaEditor.PLUGINS.wiris = function (editor) {
        // Init method, here we create the instance of the FroalaIntegration class.
        function _init() {
            $('head').append('<link rel="stylesheet" href="' + getScriptPath() + '/icons/font/css/wirisplugin.css">');

            // No custom option.
            $.FroalaEditor.DEFAULTS = $.extend($.FroalaEditor.DEFAULTS, {
                myOption: false
            });

            createIntegrationModel(editor);
        }

        return {
            _init: _init,
        }
    }

    // Icon templates for MathType.
    $.FroalaEditor.DefineIconTemplate('wirisplugin', '<i class="icon icon-[NAME]"></i>');
    $.FroalaEditor.DefineIcon('wirisEditor', {NAME: 'editor', template: 'wirisplugin'});

    // Command for MathType.
    $.FroalaEditor.RegisterCommand('wirisEditor', {
    title: 'Insert a math equation - MathType',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback:
        function (editorObject) {
            var currentFroalaIntegrationInstance = WirisPlugin.currentInstance;
            currentFroalaIntegrationInstance.hidePopups();
            currentFroalaIntegrationInstance.core.getCustomEditors().disable();
            var imageObject = currentFroalaIntegrationInstance.editorObject.image.get();
            if (typeof imageObject !== 'undefined' && imageObject !== null && imageObject.hasClass(WirisPlugin.Configuration.get('imageClassName'))) {
                currentFroalaIntegrationInstance.core.editionProperties.temporalImage = imageObject[0];
                currentFroalaIntegrationInstance.openExistingFormulaEditor(currentFroalaIntegrationInstance.target);
            } else {
                currentFroalaIntegrationInstance.openNewFormulaEditor();
            }
        }
    });

    // Prevent Froala to add it's own classes to the images generated with MathType.
    $.FroalaEditor.COMMANDS.wirisEditor.refresh = function ($btn) {
        var selectedImage = WirisPlugin.currentInstance.editorObject.image.get();
        if (($btn.parent()[0].hasAttribute('class') && $btn.parent()[0].getAttribute('class').indexOf('fr-buttons') == -1) || (selectedImage[0] &&
            ($(selectedImage[0]).hasClass(Configuration.get('imageClassName')) || $(selectedImage[0]).contents().hasClass(Configuration.get('imageClassName'))))) {
        $btn.removeClass('fr-hidden');
        }
        else {
        $btn.addClass('fr-hidden');
        }
    };

    // Template for ChemType.
    $.FroalaEditor.DefineIcon('wirisChemistry', {NAME: 'chemistry', template: 'wirisplugin'});

    // Command for ChemType.
    $.FroalaEditor.RegisterCommand('wirisChemistry', {
    title: 'Insert a chemistry formula - ChemType',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback:
        function () {
            var currentFroalaIntegrationInstance = WirisPlugin.currentInstance;
            currentFroalaIntegrationInstance.hidePopups();
            currentFroalaIntegrationInstance.core.getCustomEditors().enable('chemistry');
            var imageObject = currentFroalaIntegrationInstance.editorObject.image.get();
            if (typeof imageObject !== 'undefined' && imageObject !== null && imageObject.hasClass(WirisPlugin.Configuration.get('imageClassName'))) {
                currentFroalaIntegrationInstance.core.editionProperties.temporalImage = imageObject[0];
                currentFroalaIntegrationInstance.openExistingFormulaEditor(currentFroalaIntegrationInstance.target);
            } else {
                currentFroalaIntegrationInstance.openNewFormulaEditor();
            }
        }
    });

    // Prevent Froala to add it's own classes to the images generated with ChemType.
    $.FroalaEditor.COMMANDS.wirisChemistry.refresh = function ($btn) {
        var selectedImage = WirisPlugin.currentInstance.editorObject.image.get();
        if (($btn.parent()[0].hasAttribute('class') && $btn.parent()[0].getAttribute('class').indexOf('fr-buttons') == -1) || (selectedImage[0] &&
            ($(selectedImage[0]).hasClass(WirisPlugin.Configuration.get('imageClassName')) || $(selectedImage[0]).contents().hasClass(WirisPlugin.Configuration.get('imageClassName'))))) {
            $btn.removeClass('fr-hidden');
        }
        else {
            $btn.addClass('fr-hidden');
        }
    };
})(jQuery);