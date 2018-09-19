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

        // Froala editor can be instantiated in images.
        if (this.target.tagName.toLowerCase() !== 'img') {
            var parsedContent = Parser.initParse(this.editorObject.html.get());
            this.editorObject.html.set(parsedContent);
        }
    }

    /**
     * @inheritdoc
     * @param {HTMLElement} element - DOM object target.
     */
    doubleClickHandler(element) {
        this.simulateClick(document);
        super.doubleClickHandler(element);
    }

    /**@inheritdoc */
    openExistingFormulaEditor() {
        this.simulateClick(document);
        super.openExistingFormulaEditor();
    }

    /**@inheritdoc */
    openNewFormulaEditor() {
        this.simulateClick(document);
        super.openNewFormulaEditor();
    }

    /**
     * Simulates a click in 'element'.
     * @param {HTMLElement} element - DOM object target.
     */
    simulateClick(element) {
        var dispatchMouseEvent = function(target) {
            var e = document.createEvent("MouseEvents");
            e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
            target.dispatchEvent(e);
        };
        dispatchMouseEvent(element, 'mouseover', true, true);
        dispatchMouseEvent(element, 'mousedown', true, true);
        dispatchMouseEvent(element, 'click', true, true);
        dispatchMouseEvent(element, 'mouseup', true, true);
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
        // Select target: choose between iframe, div or image.
        var target;
        if (editor.opts.iframe) {
            target = editor.$iframe[0];
        }
        else {
            // For div or image HTMLElement.
            target = editor.el;
        }

        var callbackMethodArguments = {};
        callbackMethodArguments.editor = editor;

        /**@type {integrationModelProperties} */
        var froalaIntegrationProperties = {};
        froalaIntegrationProperties.target = target;
        // If Froala is instantiated on image, the next style is needed to allow dbclick event
        // on formulas.
        if (target.nodeName.toLowerCase() === 'img') {
            if (!$('#wrs_style').get(0)) {
                $('head').append('<style id="wrs_style">.fr-image-resizer{pointer-events: none;}</style>');
            }
        }
        froalaIntegrationProperties.configurationService = '@param.js.configuration.path@';
        froalaIntegrationProperties.version = '@plugin.version@';
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
            currentFroalaIntegrationInstance.core.getCustomEditors().disable();
            var imageObject = currentFroalaIntegrationInstance.editorObject.image.get();
            if (typeof imageObject !== 'undefined' && imageObject !== null && imageObject.hasClass(WirisPlugin.Configuration.get('imageClassName'))) {
                currentFroalaIntegrationInstance.core.editionProperties.temporalImage = imageObject[0];
                currentFroalaIntegrationInstance.openExistingFormulaEditor();
            } else {
                currentFroalaIntegrationInstance.openNewFormulaEditor();
            }
            currentFroalaIntegrationInstance.simulateClick(document);
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
            currentFroalaIntegrationInstance.core.getCustomEditors().enable('chemistry');
            var imageObject = currentFroalaIntegrationInstance.editorObject.image.get();
            if (typeof imageObject !== 'undefined' && imageObject !== null && imageObject.hasClass(WirisPlugin.Configuration.get('imageClassName'))) {
                currentFroalaIntegrationInstance.core.editionProperties.temporalImage = imageObject[0];
                currentFroalaIntegrationInstance.openExistingFormulaEditor();
            } else {
                currentFroalaIntegrationInstance.openNewFormulaEditor();
            }
            currentFroalaIntegrationInstance.simulateClick(document);
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