import Core from './core.src.js';
import Image from './image.js';
import Listeners from './listeners.js';
import Util from './util.js';

/**
 * This class represents an integration model. This class allows the integration script to
 * communicate with Core class. Each integration must extend this class.
 */
export default class IntegrationModel {
    constructor(integrationModelProperties) {
        /**
         * Language. Needed for accessibility and locales. English by default.
         * @type {string} language - 'en' by default.
         */
        this.language = 'en';
        /**
         * Configuration service. Core needs this service as entry point to load all
         * service paths. Mandatory property.
         * @type {string} configurationService - configuration service path.
         */
        this.configurationService = '';
        if ('configurationService' in integrationModelProperties) {
            this.configurationService = integrationModelProperties.configurationService;
        }
        else {
            throw new Error('IntegrationModel constructor error: configurationService property missed.')
        }
        /**
         * Plugin version. Needed to stats and lazy caching.
         * @type {string} version - plugin version.
         */
        this.version = ('version' in integrationModelProperties ? integrationModelProperties.version : '');
        /**
         * DOM target in which the plugin should work to associate
         * events, insert formulas etc. Mandatory property.
         * @type {Object} target - plugin DOM target.
         */

        if ('target' in integrationModelProperties) {
            this.target = integrationModelProperties.target;
        }
        else {
            throw new Error('IntegrationModel constructor error: target property missed.')
        }
        /**
         * Integration script name. Needed to know the plugin path.
         * @type {string} script
         */
        if ('scriptName' in integrationModelProperties) {
            this.scriptName = integrationModelProperties.scriptName;
        }
        else {
            throw new Error('IntegrationModel constructor error: scriptName property missed.')
        }
        /**
         * Object containing the arguments needed by the callback function.
         * @type {object} callbackMethodArguments
         */
        this.callbackMethodArguments = {};
        if ('callbackMethodArguments' in integrationModelProperties) {
            this.callbackMethodArguments = integrationModelProperties.callbackMethodArguments;
        }
        /**
         * Contains information about the integration environment: like the name of the editor, the version, etc.
         * @type {object}
         * @property {string} editor - Name of the HTML editor.
         */
        this.environment = {};
        if ('environment' in integrationModelProperties) {
            this.environment = integrationModelProperties.environment;
        }
        /**
         * Language folder path. 'lang' by default.
         * @type {string}
         */
        this.langFolderName = 'lang';
        if ('langFolderName' in integrationModelProperties) {
            this.langFolderName = integrationModelProperties.langFolderName;
        }
        /**
         * Indicates if the DOM target is - or not - and iframe.
         * @type {boolean} isIframe
         */
        this.isIframe = false;
        if (this.target != null) {
            this.isIframe = (this.target.tagName.toUpperCase() === 'IFRAME');
        }
        /**
         * Instance of the integration editor object.
         * @type {object}
         */
        this.editorObject = null;
        if ('editorObject' in integrationModelProperties) {
            this.editorObject = integrationModelProperties.editorObject;
        }
        /**
         * Specifies if the direction of the text is RTL. false by default.
         * @type {bool}
         */
        this.rtl = false;
        if ('rtl' in integrationModelProperties) {
            this.rtl = integrationModelProperties.rtl;
        }
        /**
         * Indicates if an image is selected. Needed to resize the image to the original size in case
         * the image is resized.
         * @type {object} temporalImageResizing - selected image.
         */
        this.temporalImageResizing = null;
        /**
         * Core instance. The Core class instance associated to the integration model.
         * @type {Core} core - core instance.
         */
        this.core = null;

        /**
         * Integration model listeners.
         * @type {Listeners}
         */
        this.listeners = new Listeners();
    }

    /**
     * Init function. Usually this method is called from the integration side once the core.js file is loaded.
     * Is strongly recommended call this method by listening onload event when core.js is loaded.
     */
    init() {
        this.language = this.getLanguage();
        // We need to wait until Core class is loaded ('onLoad' event) before
        // call the callback method.
        var listener = Listeners.newListener('onLoad', function() {
            this.callbackFunction(this.callbackMethodArguments);
        }.bind(this));

        this.setCore(new Core());
        this.core.addListener(listener);
        this.core.language = this.language;

        // Initializing Core class.
        this.core.init(this.configurationService);
        this.core.setEnvironment(this.environment);
    }

    /**
     * Get absolute path of the integration script.
     * @return {string} - Absolute path for the integration script.
     */
    getPath() {
        var col = document.getElementsByTagName("script");
        var path = '';
        for (var i = 0; i < col.length; i++) {
            var j = col[i].src.lastIndexOf(this.scriptName);
            if (j >= 0) {
                path = col[i].src.substr(0, j - 1);
            }
        }
        return path;
    }

    /**
     * Sets language property.
     * @param {string} language
     */
    setLanguage(language) {
        this.language = language;
    }

    /**
     * Sets Core instance.
     * @param {Core} core - instance of Core class.
     */
    setCore(core) {
        this.core = core;
        core.setIntegrationModel(this);
    }

    /**
     * Gets Core instance.
     * @returns {Core} core - instance of Core class.
     */
    getCore() {
        return this.core;
    }

    /**
     * Sets the object target. Updates, if necessary,  isIframe property.
     * @param {object} target  - target object.
     */
    setTarget(target) {
        this.target = target;
        this.isIframe = (this.target.tagName.toUpperCase() === 'IFRAME');
    }

    /**
     * Sets the editor object.
     * @param {object} editorObject - The editor object.
     */
    setEditorObject(editorObject) {
        this.editorObject = editorObject;
    }

    /**
     * Opens formula editor to editing a new formula. Can be overwritten in order to make some
     * actions from integration part before the formula is edited.
     */
    openNewFormulaEditor() {
        this.core.editionProperties.isNewElement = true;
        this.core.openModalDialog(this.language, this.target, this.isIframe);
    }

    /**
     * Opens formula editor to editing an existing formula. Can be overwritten in order to make some
     * actions from integration part before the formula is edited.
     */
    openExistingFormulaEditor() {
        this.core.editionProperties.isNewElement = false;
        this.core.openModalDialog(this.language, this.target, this.isIframe);
    }

    /**
     * Inserts a new formula or updates an existing one inserting it in the DOM target. Can be overwritten in order
     * from the integration side.
     * @param {string} mathml - Formula MathML.
     * @param {string} editMode - Edit Mode (LaTeX or images).
     */
    updateFormula(mathml) {
        if (this.isIframe) {
            this.core.updateFormula(this.target.contentWindow, this.target.contentWindow, mathml, null);
        } else {
            this.core.updateFormula(this.target, window, mathml, null);
        }
    }

    /**
     * Gets the target selection.
     */
    getSelection() {
        if (this.isIframe) {
            this.target.contentWindow.focus();
            return this.target.contentWindow.getSelection();
        }
        else {
            this.target.focus();
            return window.getSelection();
        }
    }

    /**
     * Add events to formulas in the DOM target.
     */
    addEvents() {
        var eventTarget = this.isIframe ? this.target.contentWindow.document : this.target;
        Util.addElementEvents(
            eventTarget,
            function (element, event) {
                this.doubleClickHandler(element, event);
            }.bind(this),
            function (element, event) {
                this.mousedownHandler(element, event);
            }.bind(this),
            function (element, event) {
                this.mouseupHandler(element, event);
            }.bind(this)
        );
    }

    /**
     * Handles a double click on the target element..
     * @param {object} element - DOM object target.
     * @param {event} event - double click event.
     */
    doubleClickHandler(element, event) {
        if (element.nodeName.toLowerCase() == 'img') {
            this.core.getCustomEditors().disable();
            if (element.hasAttribute('data-custom-editor')) {
                var customEditor = element.getAttribute('data-custom-editor');
                this.core.getCustomEditors().enable(customEditor);
            }
            if (Util.containsClass(element, 'Wirisformula')) {
                    this.core.editionProperties.temporalImage = element;
                    this.core.editionProperties.isNewElement = true;
                    this.openExistingFormulaEditor();
            }
        }
    }

    /**
     * Handles a mouse down event on the iframe.
     * @param object iframe Target
     * @param object element Element mouse downed
     */
    mousedownHandler(element) {
        if (element.nodeName.toLowerCase() == 'img') {
            if (Util.containsClass(element, 'Wirisformula')) {
                this.temporalImageResizing = element;
            }
        }
    }

    /**
     * Returns the integration language. By default the browser agent. This method
     * should be overwritten to obtain the integration language, for example using the
     * plugin API of an HTML editor.
     * @returns {string} integration language.
     */
    getLanguage() {
        return this.getBrowserLanguage();
    }

    /**
     * Returns the browser language.
     * @returns {string} the browser language.
     */
    getBrowserLanguage() {
        var language = 'en';
        if (navigator.userLanguage) {
            language = navigator.userLanguage.substring(0, 2);
        }
        else if (navigator.language) {
            language = navigator.language.substring(0, 2);
        }
        else {
            language = 'en';
        }

        return language;
    }

    /**
     * Handles a mouse up event on the iframe.
     */
   mouseupHandler() {
        if (this.temporalImageResizing) {
            setTimeout(function () {
                Image.fixAfterResize(this.temporalImageResizing);
            }.bind(this), 10);
        }
    }

    /**
     * Callback function. This function will be called once the Core is loaded. IntegrationModel class
     * will fire this method once the 'onLoad' Core event is fired. This function should content all the logic to init
     * the integration.
     */
    callbackFunction() {
        var listener = Listeners.newListener('onTargetReady', function() {
            this.addEvents(this.target);
        }.bind(this));
        this.listeners.add(listener);
    }

    /**
     * Function called when the content submits an action.
     */
    notifyWindowClosed() {
        // Nothing.
    }

    /**
     * Core.js wrapper.
     * Extracts mathml of a determined text node. This function is used as a wrapper inside core.js
     * in order to get mathml from a text node that can contain normal LaTeX or other chosen text.
     * @param {string} textNode test to extract LaTeX
     * @param {int} caretPosition starting position to find LaTeX.
     * @return {string} mathml that it's inside the text node.
     * @ignore
     */
    getMathmlFromTextNode() {
        // Nothing.
    }

    /**
     * Core.js wrapper.
     * It fills wrs event object of nonLatex with the desired data.
     * @param {object} event event object.
     * @param {object} window dom window object.
     * @param {string} mathml valid mathml.
     */
    fillNonLatexNode(event, window, mathml) {
        // Nothing,
    }

    /**
     * Core.js wrapper.
     * Returns selected item from the target.
     * @param {DOM Element} target
     * @param {boolean} iframe
     */
    getSelectedItem(target, isIframe) {
        // Nothing.
    }
}

// To know if the integration that extends this class implements
// wrapper methods, they are set as undefined.
IntegrationModel.prototype.getMathmlFromTextNode = undefined;
IntegrationModel.prototype.fillNonLatexNode = undefined;
IntegrationModel.prototype.getSelectedItem = undefined;
