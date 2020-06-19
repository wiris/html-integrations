import IntegrationModel, { integrationModelProperties } from '@wiris/mathtype-html-integration-devkit/src/integrationmodel.js';
import Configuration from '@wiris/mathtype-html-integration-devkit/src/configuration.js';
import Parser from '@wiris/mathtype-html-integration-devkit/src/parser.js';
import Constants from '@wiris/mathtype-html-integration-devkit/src/constants.js';
import MathML from '@wiris/mathtype-html-integration-devkit/src/mathml.js';

import {version as pluginVersion} from './package.json';

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
        if (this.editorObject.opts.language != null) {
            return this.editorObject.opts.language;
        } else {
            return 'en';
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
            Configuration.update('editorParameters', editor.opts.wiriseditorparameters);
        }

        // As always. When the data of Froala is retrieved we need to Parse the content.
        editor.events.on('html.get', function(e, editor, html) {
            return Parser.endParse(e);
        });

        // Adding parse MathML to images after command event to prevent
        // lost image formulas.
        editor.events.on('commands.after', (cmd) => {
            if(cmd == "html"){
                if(!editor.codeView.isActive()){
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
     * FIXME: This method is a temporal solution while Froala is working to fix
     * the bug that cause a continuous focus when is used the plugin 'Init On Image'.
     * Froala's ticket is Ticket #5322.
     * Simulates a click in 'element'. Only executes additional code when
     * initOnImageMode is enabled.
     * @param {HTMLElement} element - DOM object target.
     */
    simulateClick(element) {
        const dispatchMouseEvent = function(target) {
            const e = document.createEvent("MouseEvents");
            e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
            target.dispatchEvent(e);
        };
        dispatchMouseEvent(element, 'mouseover', true, true);
        dispatchMouseEvent(element, 'mousedown', true, true);
        dispatchMouseEvent(element, 'click', true, true);
        dispatchMouseEvent(element, 'mouseup', true, true);
    }

    /**
     * Hides the active Froala popups.
     */
    hidePopups() {
        this.editorObject.popups.hideAll();
    }

    /**@inheritdoc */
    insertFormula(focusElement, windowTarget, mathml, wirisProperties) {
        // Due to insertFormula adds an image using pure JavaScript functions,
        // it is needed notificate to the editorObject that placeholder status
        // has to be updated.
        this.editorObject.events.trigger('contentChanged');
        const obj = super.insertFormula(focusElement, windowTarget, mathml, wirisProperties);
        this.editorObject.placeholder.refresh();
        return obj;
    }
}

(function (FroalaEditor) {
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
        froalaIntegrationProperties.serviceProviderProperties = {};
        froalaIntegrationProperties.serviceProviderProperties.URI = 'https://www.wiris.net/demo/plugins/app';
        froalaIntegrationProperties.serviceProviderProperties.server = 'java';
        froalaIntegrationProperties.version = pluginVersion;
        froalaIntegrationProperties.scriptName = "wiris.js";
        froalaIntegrationProperties.environment = {};
        froalaIntegrationProperties.environment.editor = "Froala3";
        froalaIntegrationProperties.environment.editorVersion = "3" + '.x';
        froalaIntegrationProperties.callbackMethodArguments = callbackMethodArguments;
        froalaIntegrationProperties.editorObject = editor;
        froalaIntegrationProperties.initOnImageMode = target.nodeName.toLowerCase() === 'img';

        // Updating integration paths if context path is overwritten by editor javascript configuration.
        if ('wiriscontextpath' in editor.opts) {
            froalaIntegrationProperties.configurationService  = editor.opts.wiriscontextpath + froalaIntegrationProperties.configurationService;
            console.warn('Deprecated property wiriscontextpath. Use mathTypeParameters on instead.', editor.opts.wiriscontextpath)
        }

        // Overriding MathType integration parameters.
        if ('mathTypeParameters' in editor.opts) {
            froalaIntegrationProperties.integrationParameters = editor.opts.mathTypeParameters;
        }
        var froalaIntegrationInstance = new FroalaIntegration(froalaIntegrationProperties);
        froalaIntegrationInstance.init();
        froalaIntegrationInstance.listeners.fire('onTargetReady', {});
        WirisPlugin.instances[froalaIntegrationInstance.editorObject.id] = froalaIntegrationInstance;
        // The last instance as current instance.
        WirisPlugin.currentInstance = froalaIntegrationInstance;
    }

    FroalaEditor.PLUGINS.wiris = function (editor) {
        // Init method, here we create the instance of the FroalaIntegration class.
        function _init() {
            createIntegrationModel(editor);
        }

        return {
            _init: _init,
        }
    }

    // Icon templates for MathType.
    FroalaEditor.DefineIconTemplate('wirisplugin', '<i class="icon icon-[NAME]"></i>');
    FroalaEditor.DefineIcon('wirisEditor', {NAME: 'mathtype-editor', template: 'wirisplugin'});

    // Command for MathType.
    FroalaEditor.RegisterCommand('wirisEditor', {
    title: 'Insert a math equation - MathType',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback:
        function (editorObject) {
            var currentFroalaIntegrationInstance = WirisPlugin.instances[this.id];
            currentFroalaIntegrationInstance.hidePopups();
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
    FroalaEditor.COMMANDS.wirisEditor.refresh = function ($btn) {
        const selectedImage = this.image.get();
        // Value can be undefined.
        if (!!selectedImage) {
            if (($btn.parent()[0].hasAttribute('class') && $btn.parent()[0].getAttribute('class').indexOf('fr-buttons') == -1) || (selectedImage[0] &&
                ($(selectedImage[0]).hasClass(Configuration.get('imageClassName')) || $(selectedImage[0]).contents().hasClass(Configuration.get('imageClassName'))))) { // Is a MathType image.

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
                if (!!$('#wrs_style').get(0)) {
                    $('#wrs_style').get(0).remove();
                }
            }
        }
    };

    // Template for ChemType.
    FroalaEditor.DefineIcon('wirisChemistry', {NAME: 'mathtype-chemistry', template: 'wirisplugin'});

    // Command for ChemType.
    FroalaEditor.RegisterCommand('wirisChemistry', {
    title: 'Insert a chemistry formula - ChemType',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback:
        function () {
            var currentFroalaIntegrationInstance = WirisPlugin.instances[this.id];
            currentFroalaIntegrationInstance.hidePopups();
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
    FroalaEditor.COMMANDS.wirisChemistry.refresh = FroalaEditor.COMMANDS.wirisEditor.refresh;
})(FroalaEditor);