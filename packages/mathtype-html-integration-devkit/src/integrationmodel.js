import Core from './core.src.js';
import Image from './image.js';
import Listeners from './listeners.js';
import Util from './util.js';

/**
 * This class represents an integration model. This class allows the integration script to
 * communicate with Core class. Each integration must extend this class.
 */
IntegrationModel = function(integrationModelProperties) {
    /**
     * Language. Needed for accessibility and locales.
     * @type {string} language - 'en' by default.
    */
    this.language = this.getLanguage();
    /**
     * Configuration service. Core needs this service as entry point to load all
     * service paths. Mandatory property.
     * @type {string} configurationService - configuration service path.
     */
    this.configurationService = '';
    if ('configurationService' in integrationModelProperties) {
        this.configurationService = integrationModelProperties.configurationService;
    } else {
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
    } else {
        throw new Error('IntegrationModel constructor error: target property missed.')
    }
    /**
    * Integration script name. Needed to know the plugin path.
    * @type {string} script
    */
    if ('scriptName' in integrationModelProperties) {
        this.scriptName = integrationModelProperties.scriptName;
    } else {
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
     * Indicates if the DOM target is - or not - and iframe.
     * @type {boolean} isIframe
     */
    this.isIframe = (this.target.tagName.toUpperCase() === 'IFRAME');
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
     * This listener is atteched to Core class in order to launch it's callback function once
     * the 'onLoad' Core event is fired. Should be added from the integration side
     * (i.e in the IntegrationModel integration instance) and usually contains a callback function which parse
     * the document, assign command to buttons, etc. To call this methods is mandatory have the Core loaded.
     * @type {Listener} listener -
     */
    this.listener = null;
}

/**
 * Init function. Usually this method is called from the integration side once the core.js file is loaded.
 * Is strongly recommended call this method by listening onload event when core.js is loaded.
 * @param {object} target - DOM target
 * @param {string} lang - integration language.
 */
IntegrationModel.prototype.init = function() {
    // We need to wait until Core class is loaded ('onLoad' event) before
    // call the callback method.
    this.listener = Listeners.newListener('onLoad', function() {
        this.callbackFunction(this.callbackMethodArguments);
    }.bind(this));

    Core.addListener(this.listener);
    this.setCore(new Core());
    this.core.language = this.language;

    // Initializing Core class.
    this.core.init(this.configurationService);
    this.core.setEnvironment(this.environment);

}

/**
 * Get absolute path of the integration script.
 * @return {string} - Absolute path for the integration script.
 */
IntegrationModel.prototype.getPath = function() {
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
IntegrationModel.prototype.setLanguage = function(language) {
     this.language = language;
 }

 /**
  * Sets Core instance.
  * @param {Core} core - instance of Core class.
  */
IntegrationModel.prototype.setCore = function(core) {
     this.core = core;
     core.setIntegrationModel(this);
}

/**
 * Gets Core instance.
 * @returns {Core} core - instance of Core class.
 */
IntegrationModel.prototype.getCore = function() {
     return this.core;
}

/**
 * Sets the object target.
 * @param {object} target  - target object.
 */
IntegrationModel.prototype.setTarget = function(target) {
     this.target = target;
}

/**
 * Opens formula editor to editing a new formula. Can be overwritten in order to make some
 * actions from integration part before the formula is edited.
 */
IntegrationModel.prototype.openNewFormulaEditor = function() {
    this.core.editionProperties.isNewElement = true;
    this.core.openModalDialog(this.language, this.target, this.isIframe);
}

/**
 * Opens formula editor to editing an existing formula. Can be overwritten in order to make some
 * actions from integration part before the formula is edited.
 */
IntegrationModel.prototype.openExistingFormulaEditor = function() {
    this.core.editionProperties.isNewElement = false;
    this.core.openModalDialog(this.language, this.target, this.isIframe);
}

/**
 * Inserts a new formula or updates an existing one inserting it in the DOM target. Can be overwritten in order
 * from the integration side.
 * @param {string} mathml - Formula MathML.
 * @param {string} editMode - Edit Mode (LaTeX or images).
 */
IntegrationModel.prototype.updateFormula = function(mathml) {
    if (this.isIframe) {
        this.core.updateFormula(this.target.contentWindow, this.target.contentWindow, mathml, null);
    } else {
        this.core.updateFormula(this.target, window, mathml, null);
    }
}


/**
 * Add events to formulas in the DOM target.
 */
IntegrationModel.prototype.addEvents = function() {
    var eventTarget = this.isIframe ? this.target.contentWindow.document : target;
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
 * @param object iframe Target
 * @param object element Element double clicked
 */
IntegrationModel.prototype.doubleClickHandler = function(element) {
    if (element.nodeName.toLowerCase() == 'img') {
        this.core.getCustomEditors().disable();
        if (element.hasAttribute('data-custom-editor')) {
            var customEditor = element.getAttribute('data-custom-editor');
            this.core.getCustomEditors().enable(customEditor);
        }
        if (Util.containsClass(element, 'Wirisformula')) {
                this.core.editionProperties.temporalImage = element;
                this.openExistingFormulaEditor(this.target);
        }
    }
}

/**
 * Handles a mouse down event on the iframe.
 * @param object iframe Target
 * @param object element Element mouse downed
 */
IntegrationModel.prototype.mousedownHandler = function(element) {
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
IntegrationModel.prototype.getLanguage = function() {
    return this.getBrowserLanguage();
}

/**
 * Returns the browser language.
 * @returns {string} the browser language.
 */
IntegrationModel.prototype.getBrowserLanguage = function() {
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
IntegrationModel.prototype.mouseupHandler = function() {
    if (this.temporalImageResizing) {
        setTimeout(function () {
            Image.fixAfterResize(this.temporalImageResizing);
        }.bind(this), 10);
    }
}

IntegrationModel.prototype.callbackFunction = function() {
    this.addEvents(this.target);
}

IntegrationModel.prototype.notifyWindowClosed = function() {
}

var IntegrationModel = IntegrationModel;
export default IntegrationModel;
