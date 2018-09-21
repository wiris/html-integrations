import Util from './util.js';
import StringManager from './stringmanager.js';
import ContentManager from './contentmanager.js';
import ModalDialog from './modal.js';
import ServiceProvider from './serviceprovider.js';
import Parser from './parser.js';
import Latex from './latex.js';
import MathML from './mathml.js';
import CustomEditors from './customeditors.js';
import Configuration from './configuration.js';
import jsProperties from './jsvariables.js';
import Event from './event.js';
import Listeners from './listeners.js';
import IntegrationModel from './integrationmodel.js';

/**
 * Class representing MathType integration Core. This class is the integration entry point. Manages integration
 * initialization (services, languages), events, and the insertion of the formulas in the edit area.
 */
export default class Core {
    /**
     * Core class constructor. Admits a string containing the configurationjs service
     * which loads all JavaScript configuration generated in the backend. This file is needed
     * to instantiate the serviceProvider class (all services lives in the same path).
     */
    constructor() {
        /**
         * Language. Needed for accessibility and locales. 'en' by default.
         * @type {string}
         */
        this.language = 'en';

        /**
         * Edit mode. Admit 'images' and 'latex' values.
         * @type {string}
         */
        this.editMode = 'images';

        /**
         * Modal dialog instance.
         * @type {ModalDialog}
         */
        this.modalDialog = null;

        /**
         * Core custom editors. By default only chemistry editor.
         * @type {CustomEditors}
         */
        this.customEditors = new CustomEditors();
        var chemEditorParams = {
            name: 'Chemistry',
            toolbar: 'chemistry',
            icon: 'chem.png',
            confVariable: 'chemEnabled',
            title: 'ChemType',
            tooltip: 'Insert a chemistry formula - ChemType' // TODO: Localize tooltip.
        }
        this.customEditors.addEditor('chemistry', chemEditorParams);

        /**
         * Environment properties. This object contains data about the integration platform.
         * @type {Object}
         * @property {string} editor - Editor name. Usually the HTML editor.
         * @property {string} mode - Save mode. Xml by default
         * @property {string} version - Plugin version.
         */
        this.environment = {};

        /**
         * Edit properties.
         * @type {Object}
         * @property {boolean} isNewElement - Indicates if the edit formula is a new one or not.
         * @property {Img} temporalImage - Image of the formula edited. Null if the formula is a new one.
         * @property {Range} latexRange - LaTeX formula range.
         * @property {Range} range - Image range.
         * @property {string} editMode - Edition mode. Images by default.
         */
        this.editionProperties = {
            isNewElement: true,
            temporalImage: null,
            latexRange: null,
            range: null
        }

        /**
         * Integration model instance.
         * @type {IntegrationModel}
         */
        this.integrationModel = null;

        /**
         * ContentManager instance.
         * @type {ContentManager}
         */
        this.contentManager = null;

        /**
         * Information about the current browser.
         * @type {string}
         */
        this.browser = (
            function get_browser() {
                var ua = navigator.userAgent;
                if (ua.search("Edge/") >= 0) {
                    return "EDGE";
                } else if (ua.search("Chrome/") >= 0) {
                    return "CHROME";
                } else if (ua.search("Trident/") >= 0) {
                    return "IE";
                } else if (ua.search("Firefox/") >= 0) {
                    return "FIREFOX";
                } else if (ua.search("Safari/") >= 0) {
                    return "SAFARI";
                }
            }
        )();

        /**
         * Plugin listeners.
         * @type {Object[]}
         */
        this.listeners = new Listeners();
    }

    /**
     * Initializes the core.
     * @param {string} integrationPath - integration root folder path.
     */
    init(integrationPath) {
        this.load(integrationPath);
    }

    /**
     * Sets the instance of the integration model object.
     * @param {IntegrationModel} integrationModel - integrationModel instance.
     */
    setIntegrationModel(integrationModel) {
        this.integrationModel = integrationModel;
    }

    /**
     * This method set an object containing environment properties. The structure for the an
     * environment object is the following:
     * @param {Object} environmentObject - And object containing environment properties.
     * @param {string} environmentObject.editor - Integration editor (usually HTML editor).
     * @param {string} environmentObject.mode - Save mode.
     * @param {string} environmentObject.version - Integration version.
     */
    setEnvironment(environmentObject) {
        if ('editor' in environmentObject) {
            this.environment.editor = environmentObject.editor;
        }
        if ('mode' in environmentObject) {
            this.environment.mode = environmentObject.mode;
        }
        if ('version' in environmentObject) {
            this.environment.version = environmentObject.version;
        }
    }

    /**
     * Get modal dialog
     * @returns {ModalDialog} Modal Window core instance.
     */
    getModalDialog() {
        return this.modalDialog;
    }

    /**
     * This method inits the Core class doing the following:
     * - Calls (async) to configurationjs service, converting the response JSON into javascript variables.
     * - Updates Configuration class with the previous configuration properties.
     * - Updates the ServiceProvider class using configurationjs service path as reference.
     * - Load lang strings and CSS.
     * - Once the previous is ready fires 'onLoad' event.
     */
    load(integrationPath) {
        var httpRequest = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        this.integrationPath = integrationPath.indexOf("/") == 0 || integrationPath.indexOf("http") == 0 ? integrationPath : Util.concatenateUrl(this.integrationModel.getPath(), integrationPath);
        httpRequest.open('GET', this.integrationPath, false);
        // Async request.
        httpRequest.onload = function (e) {
            if (httpRequest.readyState === 4) {
                // Loading configuration variables.
                var jsonConfiguration = JSON.parse(httpRequest.responseText);
                var variables = Object.keys(jsonConfiguration);
                Configuration.addConfiguration(jsonConfiguration);
                // Adding JavaScript (not backend) configuration variables.
                Configuration.addConfiguration(jsProperties);
                // Load service paths.
                this.loadServicePaths();
                // Load lang file.
                this.loadLangFile();
                this.loadCSS();
                // Fire 'onLoad' event. All integration must listen this event in order to know if the plugin has been properly loaded.
                // We need to wait until stringManager has been loaded.
                if (Core.stringManager === null) {
                    var stringManagerListener = Listeners.newListener('onLoad', () => {
                        this.listeners.fire('onLoad', {});
                    })
                    Core.stringManager.addListener(stringManagerListener);
                }
                else {
                    this.listeners.fire('onLoad', {});
                }

            }
        }.bind(this);
        httpRequest.send(null);
    }

    /**
     * Instantiate a new ServiceProvider path (static) and calculate all the backend services
     * paths using Core integrationPath as base path.
     */
    loadServicePaths() {
        // Services path (tech dependant).
        var createImagePath = this.integrationPath.replace('configurationjs', 'createimage');
        var showImagePath = this.integrationPath.replace('configurationjs', 'showimage');
        var createImagePath = this.integrationPath.replace('configurationjs', 'createimage');
        var getMathMLPath = this.integrationPath.replace('configurationjs', 'getmathml');
        var servicePath = this.integrationPath.replace('configurationjs', 'service');

        // Some backend integrations (like Java o Ruby) have an absolute backend path,
        // for example: /app/service. For them we calculate the absolute URL path, i.e
        // protocol://domain:port/app/service
        if (this.integrationPath.indexOf("/") == 0) {
            var serverPath = this.getServerPath();
            showImagePath = serverPath + showImagePath;
            createImagePath = serverPath + createImagePath;
            getMathMLPath = serverPath + getMathMLPath;
            servicePath = serverPath + servicePath;
        }

        ServiceProvider.setServicePath('showimage', showImagePath);
        ServiceProvider.setServicePath('createimage', createImagePath);
        ServiceProvider.setServicePath('service', servicePath);
        ServiceProvider.setServicePath('getmathml', getMathMLPath);
    }

    /**
     * Returns the client side server path on integration script lives.
     * @return {string} client side server path.
     */
    getServerPath() {
        var url = this.integrationModel.getPath();
        var hostNameIndex = url.indexOf("/", url.indexOf("/") + 2);
        return url.substr(0, hostNameIndex);
    }

    /**
     * Loads language file using integration script path as base path. Then
     * load the string into the core StringManager instance.
     */
    loadLangFile() {
        // Translated languages.
        var languages = 'ar,ca,cs,da,de,en,es,et,eu,fi,fr,gl,he,hr,hu,it,ja,ko,nl,no,pl,pt,pt_br,ru,sv,tr,zh,el';

        var langArray = languages.split(',');
        var lang = this.language;

        if (langArray.indexOf(lang) == -1) {
            lang = lang.substr(0, 2);
        }

        if (langArray.indexOf(lang) == -1) {
            lang = 'en';
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.integrationModel.getPath() + '/' + this.integrationModel.langFolderName + '/' + lang + '/strings.js';
        // When strings are loaded, it loads into stringManager
        script.onload = function () {
            Core.getStringManager().loadStrings(wrs_strings);
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    /**
     * Appends CSS file to header.
     */
    loadCSS() {
        var fileRef = document.createElement("link");
        fileRef.setAttribute("rel", "stylesheet");
        fileRef.setAttribute("type", "text/css");
        fileRef.setAttribute("href", Util.concatenateUrl(this.integrationModel.getPath(), '/core/styles.css'));
        document.getElementsByTagName("head")[0].appendChild(fileRef);
    }

    /**
     * Adds a listener to Listeners core property.
     * @param {Object} listener - listener to be added.
     */
    addListener(listener) {
        this.listeners.add(listener);
    }

    /**
     * Adds a listener to global core listeners.
     * @param {Object} listener - listener to be added.
     * @static
     */
    static addGlobalListener(listener) {
        Core.globalListeners.add(listener);
    }

    /**
     * Transform a MathML into a image formula. Then the image formula is inserted in the specified target, creating
     * a new image (new formula) or updating an existing one.
     * @param {Object} focusElement - element to be focused
     * @param {Object} windowTarget - window where the editable content is
     * @param {string} mathml - Mathml code
     * @param {Object[]} wirisProperties - extra attributes for the formula (like background color or font size).
     */
    updateFormula(focusElement, windowTarget, mathml, wirisProperties) {
        /**
         * This event is fired after update the formula.
         * @type {Object}
         * @property {string} mathml - MathML to be transformed.
         * @property {string} editMode - edit mode.
         * @property {Object} wirisProperties - extra attributes for the formula.
         * @property {string} language - formula language.
         */
        var beforeUpdateEvent = new Event();

        beforeUpdateEvent.mathml = mathml;

        // Cloning wirisProperties object
        // We don't want wirisProperties object modified.
        beforeUpdateEvent.wirisProperties = {};

        for (var attr in wirisProperties) {
            beforeUpdateEvent.wirisProperties[attr] = wirisProperties[attr];
        }

        // Read only.
        beforeUpdateEvent.language = this.language;
        beforeUpdateEvent.editMode = this.editMode;

        if (this.listeners.fire('onBeforeFormulaInsertion', beforeUpdateEvent)) {
            return;
        }

        if (Core.globalListeners.fire('onBeforeFormulaInsertion', beforeUpdateEvent)) {
            return;
        }

        mathml = beforeUpdateEvent.mathml;
        wirisProperties = beforeUpdateEvent.wirisProperties;

        /**
         * This event is fired after update the formula.
         * @type {Object}
         * @param {string} editMode - edit mode.
         * @param {Object} windowTarget - target window.
         * @param {Object} focusElement - target element to be focused after update.
         * @param {string} latex - LaTeX generated by the formula (editMode=latex).
         * @param {Object} node - node generated after update the formula (text if LaTeX img otherwise).
         */
        var afterUpdateEvent = new Event();
        afterUpdateEvent.editMode = this.editMode;
        afterUpdateEvent.windowTarget = windowTarget;
        afterUpdateEvent.focusElement = focusElement;

        if (mathml.length == 0) {
            this.insertElementOnSelection(null, focusElement, windowTarget);
        }
        else if (this.editMode == 'latex') {
            afterUpdateEvent.latex = Latex.getLatexFromMathML(mathml);
            // this.integrationModel.getNonLatexNode is an integration wrapper to have special behaviours for nonLatex.
            // Not all the integrations have special behaviours for nonLatex.
            if (!!this.integrationModel.fillNonLatexNode && typeof afterUpdateEvent.latex === 'undefined') {
                this.integrationModel.fillNonLatexNode(afterUpdateEvent, windowTarget, mathml);
            }
            else {
                afterUpdateEvent.node = windowTarget.document.createTextNode('$$' + afterUpdateEvent.latex + '$$');
            }
            this.insertElementOnSelection(afterUpdateEvent.node, focusElement, windowTarget);
        }
        else if (this.editMode == 'iframes') {
            var iframe = wrs_mathmlToIframeObject(windowTarget, mathml);
            this.insertElementOnSelection(iframe, focusElement, windowTarget);
        }
        else {
            afterUpdateEvent.node = Parser.mathmlToImgObject(windowTarget.document, mathml, wirisProperties, this.language);
            this.insertElementOnSelection(afterUpdateEvent.node, focusElement, windowTarget);
        }

        if (this.listeners.fire('onAfterFormulaInsertion', afterUpdateEvent)) {
            return;
        }

        if (Core.globalListeners.fire('onAfterFormulaInsertion', afterUpdateEvent)) {
            return;
        }
    }

    /**
     * Sets the caret after 'node' and focus node owner document.
     * @param {Object} node - node that it will be behind the caret after the execution.
     */
    placeCaretAfterNode(node) {
        this.integrationModel.getSelection();
        const nodeDocument = node.ownerDocument;
        if (typeof nodeDocument.getSelection !== 'undefined') {
            const range = nodeDocument.createRange();
            range.setStartAfter(node);
            range.collapse(true);
            var selection = nodeDocument.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            nodeDocument.body.focus();
        }
    }

    /**
     * Replaces a selection with an element.
     * @param {Object} element - element to replace the selection.
     * @param {Object} focusElement - element to be focused after the replace.
     * @param {Object} windowTarget - target window.
     */
    insertElementOnSelection(element, focusElement, windowTarget) {
        if (this.editionProperties.isNewElement) {
            if (focusElement.type == "textarea") {
                Util.updateTextArea(focusElement, element.textContent);
            }
            else if (document.selection && document.getSelection == 0) {
                var range = windowTarget.document.selection.createRange();
                windowTarget.document.execCommand('InsertImage', false, element.src);

                if (!('parentElement' in range)) {
                    windowTarget.document.execCommand('delete', false);
                    range = windowTarget.document.selection.createRange();
                    windowTarget.document.execCommand('InsertImage', false, element.src);
                }

                if ('parentElement' in range) {
                    var temporalObject = range.parentElement();

                    if (temporalObject.nodeName.toUpperCase() == 'IMG') {
                        temporalObject.parentNode.replaceChild(element, temporalObject);
                    }
                    else {
                        // IE9 fix: parentNode() does not return the IMG node, returns the parent DIV node. In IE < 9, pasteHTML does not work well.
                        range.pasteHTML(Util.createObjectCode(element));
                    }
                }
            }
            else {
                const editorSelection = this.integrationModel.getSelection();
                let range;
                // In IE is needed keep the range due to after focus the modal window it can't be retrieved the last selection.
                if (this.editionProperties.range) {
                    range = this.editionProperties.range;
                    this.editionProperties.range = null;
                }
                else {
                    range = editorSelection.getRangeAt(0);
                }

                // Delete if something was surrounded.
                range.deleteContents();

                let node = range.startContainer;
                const position = range.startOffset;

                if (node.nodeType == 3) { // TEXT_NODE.
                    node = node.splitText(position);
                    node.parentNode.insertBefore(element, node);
                }
                else if (node.nodeType == 1) { // ELEMENT_NODE.
                    node.insertBefore(element, node.childNodes[position]);
                }

                this.placeCaretAfterNode(element);
            }
        }
        else if (this.editionProperties.latexRange) {
            if (document.selection && document.getSelection == 0) {
                this.editionProperties.isNewElement = true;
                this.editionProperties.latexRange.select();
                this.insertElementOnSelection(element, focusElement, windowTarget);
            }
            else {
                var parentNode = this.editionProperties.latexRange.startContainer;
                this.editionProperties.latexRange.deleteContents();
                this.editionProperties.latexRange.insertNode(element);
                this.placeCaretAfterNode(element);
            }
        }
        else if (focusElement.type == "textarea") {
            let item;
            // Wrapper for some integrations that can have special behaviours to show latex.
            if (typeof this.integrationModel.getSelectedItem !== 'undefined') {
                item = this.integrationModel.getSelectedItem(focusElement, false);
            }
            else {
                item = Util.getSelectedItemOnTextarea(focusElement);
            }
            Util.updateExistingTextOnTextarea(focusElement, element.textContent, item.startPosition, item.endPosition);
        }
        else {
            if (!element) { // Editor empty, formula has been erased on edit.
                this.editionProperties.temporalImage.parentNode.removeChild(this.editionProperties.temporalImage);
            }
            this.editionProperties.temporalImage.parentNode.replaceChild(element, this.editionProperties.temporalImage);
            this.placeCaretAfterNode(element);
        }
    }


    /**
     * Opens a new modal dialog.
     * @param {object} target - target element.
     * @param {boolean} isIframe - specifies if the target is an iframe.
     */
    openModalDialog(target, isIframe) {
        // Textarea elements don't have normal document ranges. It only accepts latex edit.
        this.editMode = 'images';

        // In IE is needed keep the range due to after focus the modal window it can't be retrieved the last selection.
        try {
            if (isIframe) {
                // Is needed focus the target first.
                target.contentWindow.focus()
                let selection = target.contentWindow.getSelection();
                this.editionProperties.range = selection.getRangeAt(0);
            }
            else {
                // Is needed focus the target first.
                target.focus()
                let selection = getSelection();
                this.editionProperties.range = selection.getRangeAt(0);
            }
        }
        catch (e) {
            this.editionProperties.range = null;
        }

        if (isIframe === undefined) {
            isIframe = true;
        }

        this.editionProperties.latexRange = null;

        if (target) {
            let selectedItem;
            if (typeof this.integrationModel.getSelectedItem !== 'undefined') {
                selectedItem = this.integrationModel.getSelectedItem(target, isIframe);
            }
            else {
                selectedItem = Util.getSelectedItem(target, isIframe);
            }

            // Check LaTeX if and only if the node is a text node (nodeType==3).
            if (selectedItem) {
                // Case when image was selected and button pressed.
                if (!selectedItem.caretPosition && Util.containsClass(selectedItem.node,  Configuration.get('imageClassName'))) {
                    this.editionProperties.temporalImage = selectedItem.node;
                    this.editionProperties.isNewElement = false;
                }
                else if (selectedItem.node.nodeType === 3) {
                    // If it's a text node means that editor is working with LaTeX.
                    if (!!this.integrationModel.getMathmlFromTextNode) {
                        // If integration has this function it isn't set range due to we don't
                        // know if it will be put into a textarea as a text or image.
                        const mathml = this.integrationModel.getMathmlFromTextNode(
                            selectedItem.node,
                            selectedItem.caretPosition
                        );
                        if (mathml) {
                            this.editMode = 'latex';
                            this.editionProperties.isNewElement = false;
                            this.editionProperties.temporalImage = document.createElement('img');
                            this.editionProperties.temporalImage.setAttribute(
                                Configuration.get('imageMathmlAttribute'),
                                MathML.safeXmlEncode(mathml)
                            );
                        }
                    }
                    else {
                        const latexResult = Latex.getLatexFromTextNode(
                            selectedItem.node,
                            selectedItem.caretPosition
                        );
                        if (latexResult) {
                            const mathml = Latex.getMathMLFromLatex(latexResult.latex);
                            this.editMode = 'latex';
                            this.editionProperties.isNewElement = false;
                            this.editionProperties.temporalImage = document.createElement('img');
                            this.editionProperties.temporalImage.setAttribute(
                                Configuration.get('imageMathmlAttribute'),
                                MathML.safeXmlEncode(mathml)
                            );
                            const windowTarget = isIframe ? target.contentWindow : window;

                            if (target.tagName.toLowerCase() !== 'textarea') {
                                if (document.selection) {
                                    let leftOffset = 0;
                                    let previousNode = latexResult.startNode.previousSibling;

                                    while (previousNode) {
                                        leftOffset += Util.getNodeLength(previousNode);
                                        previousNode = previousNode.previousSibling;
                                    }

                                    this.editionProperties.latexRange = windowTarget.document.selection.createRange();
                                    this.editionProperties.latexRange.moveToElementText(
                                        latexResult.startNode.parentNode
                                    );
                                    this.editionProperties.latexRange.move(
                                        'character',
                                        leftOffset + latexResult.startPosition
                                    );
                                    this.editionProperties.latexRange.moveEnd(
                                        'character',
                                        latexResult.latex.length + 4
                                    ); // Plus 4 for the '$$' characters.
                                }
                                else {
                                    this.editionProperties.latexRange = windowTarget.document.createRange();
                                    this.editionProperties.latexRange.setStart(
                                        latexResult.startNode,
                                        latexResult.startPosition
                                    );
                                    this.editionProperties.latexRange.setEnd(
                                        latexResult.endNode,
                                        latexResult.endPosition
                                    );
                                }
                            }
                        }
                    }
                }

            }
            else if (target.tagName.toLowerCase() === 'textarea') {
                // By default editMode is 'images', but when target is a textarea it needs to be 'latex'.
                this.editMode = 'latex';
            }

        }

        // Setting an object with the editor parameters.
        // Editor parameters can be customized in several ways:
        // 1 - editorAttributes: Contains the default editor attributes, usually the metrics in a comma separated string. Always exists.
        // 2 - editorParameters: Object containing custom editor parameters. These parameters are defined in the backend. So they affects
        //     all integration instances.

        // The backend send the default editor attributes in a coma separated with the following structure:
        // key1=value1,key2=value2...
        var defaultEditorAttributesArray = Configuration.get('editorAttributes').split(", ");
        var defaultEditorAttributes = {};
        for (var i = 0, len = defaultEditorAttributesArray.length; i < len; i++) {
            var tempAttribute = defaultEditorAttributesArray[i].split('=');
            var key = tempAttribute[0];
            var value = tempAttribute[1];
            defaultEditorAttributes[key] = value;
        }
        // Custom editor parameters.
        var editorAttributes = {};
        Object.assign(editorAttributes, defaultEditorAttributes, Configuration.get('editorParameters'));
        editorAttributes.language = this.language;
        editorAttributes.rtl = this.integrationModel.rtl;

        var contentManagerAttributes = {}
        contentManagerAttributes.editorAttributes = editorAttributes;
        contentManagerAttributes.language = this.language;
        contentManagerAttributes.customEditors = this.customEditors;
        contentManagerAttributes.environment = this.environment;

        if (this.modalDialog == null) {
            this.modalDialog = new ModalDialog(editorAttributes);
            this.contentManager = new ContentManager(contentManagerAttributes);
            // When an instance of ContentManager is created we need to wait until the ContentManager is ready
            // by listening 'onLoad' event.
            var listener = Listeners.newListener(
                'onLoad',
                function() {
                    this.contentManager.isNewElement = this.editionProperties.isNewElement;
                    if (this.editionProperties.temporalImage != null) {
                        var mathML = MathML.safeXmlDecode(this.editionProperties.temporalImage.getAttribute(Configuration.get('imageMathmlAttribute')));
                        this.contentManager.mathML = mathML;
                    }
                }.bind(this)
            );
            this.contentManager.addListener(listener);
            this.contentManager.init();
            this.modalDialog.setContentManager(this.contentManager);
            this.contentManager.setModalDialogInstance(this.modalDialog);
        } else {
            this.contentManager.isNewElement = this.editionProperties.isNewElement;
            if (this.editionProperties.temporalImage != null) {
                var mathML = MathML.safeXmlDecode(this.editionProperties.temporalImage.getAttribute(Configuration.get('imageMathmlAttribute')));
                this.contentManager.mathML = mathML;
            }
        }
        this.contentManager.setIntegrationModel(this.integrationModel);
        this.modalDialog.open();
    }

    /**
     * Returns the instance of the ServiceProvider class.
     * @returns {ServiceProvider} ServiceProvider instance.
     * @static
     */
    static getServiceProvider() {
        return Core.serviceProvider;
    }

    /**
     * Returns the instance of the StringManager class.
     * @returns {StringManager} StringManager instance
     */
    static getStringManager() {
        return Core.stringManager;
    }

    /**
     * Return an object with all instance custom editors.
     * @return {CustomEditors}
     */
    getCustomEditors() {
        return this.customEditors;
    }
}

/**
 * Plugin static listeners.
 * @type {Object[]}
 * @static
 */
Core.globalListeners = new Listeners();

/**
 * Class to manage plugin locales.
 * @type {StringManager}
 * @static
 */
Core.stringManager = new StringManager();