import Configuration from './configuration.js';
import EditorListener from './editorlistener.js';
import Listeners from './listeners.js';
import MathML from './mathml.js';
import Util from './util.js';

/**
 * This class implements ModalContent interface. Manage the following:
 * - insertion in modal object (insert(modalObject) method)
 * - actions to be done once the modal object has been submited (submitAction() method)
 * - updates itself when modalObject is updated with a re-open action for example (update(modalObject) method)
 * - comunicates to modalObject if some changes have be done (hasChanges() method)
 *
 * @ignore
 */
export default class ContentManager {
    /**
     * Class constructor
     * @param {object} contentManagerAttributes
     */
    constructor(contentManagerAttributes) {
        /**
         * Editor listener. Needed to get control about editor changes.
         * @type {EditorListener}
         */
        this.editorListener = new EditorListener();
        /**
         * MathType editor instance.
         * @type {JsEditor}
         */
        this.editor = null;
        /**
         * An object containing MathType editor parameters. See
         * http://docs.wiris.com/en/mathtype/mathtype_web/sdk-api/parameters for further information.
         * @type {object}
         */
        this.editorAttributes = contentManagerAttributes.editorAttributes;

        /**
         * User agent.
         * @type {string}
         */
        this.ua = navigator.userAgent.toLowerCase();
        /**
         * Mobile device properties object
         * @type {Object}
         * @property {boolean} isAndroid - True if the device is android. False otherwise.
         * @property {boolean} isIOS - True if the device is iOs. False otherwise.
         */
        this.deviceProperties = {};
        this.deviceProperties.isAndroid = this.ua.indexOf("android") > -1;
        this.deviceProperties.isIOS = ((this.ua.indexOf("ipad") > -1) || (this.ua.indexOf("iphone") > -1));
        /**
         * Custom editor toolbar.
         * @type {string} toolbar
         */
        this.toolbar = null;
        /**
         * Custom editors class instance.
         * @type {CustomEditors}
         */
        this.customEditors = contentManagerAttributes.customEditors;
        /**
		* Environment properties. This object contains data about the integration platform.
		* @type {Object}
		* @property {string} editor - Editor name. Usually the HTML editor.
		* @property {string} mode - Save mode. Xml by default
		* @property {string} version - Plugin version.
	    */
        this.environment = contentManagerAttributes.environment;
        /**
         * Integration language.
         * @type {string}
         */
        this.language = contentManagerAttributes.language;
        /**
         * Instance of the ModalDialog class associated to the ContentManager instance.
         * @type {ModalDialog}
         */
        this.modalDialogInstance = null;

        /**
         * ContentManager listeners. Fired on 'onLoad' event.
         * @type {Listeners}
         */
        this.listeners = new Listeners();
        /**
         * ContentManager MathML. null for new formulas.
         * @type {string}
         */
        this.mathML = null;
        /**
         * Indicates if the edited element is a new element or not.
         * @type {boolean}
         */
        this.isNewElement = true;
        /**
         * IntegrationModel instance. The integration model instance is needed
         * to call wrapper methods.
         * @type {IntegrationModel}
         */
        this.integrationModel = null;
    }

    /**
     * Add a new listener to ContentManager class.
     * @param {object} listener
     */
    addListener(listener) {
        this.listeners.add(listener);

    }

    /**
     * Set an instance of an IntegrationModel
     * @param {IntegrationModel} integrationModel
     */
    setIntegrationModel(integrationModel) {
        this.integrationModel = integrationModel;
    }

    /**
     * Sets a modal dialog instance.
     * @property {ModalDialog} modal dialog - a ModalDialog instance
     */
    setModalDialogInstance(modalDialogInstance) {
        this.modalDialogInstance = modalDialogInstance;
    }

    /**
     * Mandatory method: inserts editor into modal object content container.
     * @param {object} modalObject
     * @ignore
     */
    insert(modalObject) {
        // Before insert the editor we update the modal object title to avoid weird render display.
        this.updateTitle(modalObject);
        this.insertEditor(modalObject);
    }

    /**
     * Method to insert MathType into modal object. This method
     * waits until editor JavaScript is loaded to insert the editor into
     * contentContainer modal object element.
     * @ignore
     */
    insertEditor(modalObject) {
        // To know if editor JavaScript is loaded we need to wait until com.wiris.jsEditor namespace is ready.
        if ('com' in window && 'wiris' in window.com && 'jsEditor' in window.com.wiris) {
            this.editor = com.wiris.jsEditor.JsEditor.newInstance(this.editorAttributes);
            this.editor.insertInto(modalObject.contentContainer);
            this.editor.focus();
            // Setting div in rtl in case of it's activated.
            if (this.editor.getEditorModel().isRTL()) {
                this.editor.element.style.direction = 'rtl';
            }

            // Editor listener: this object manages the changes logic of editor.
            this.editor.getEditorModel().addEditorListener(this.editorListener);

            // iOS events.
            if (modalObject.deviceProperties['isIOS']) {
                setTimeout(function() { this.modalDialogInstance.hideKeyboard() }, 400);
                var formulaDisplayDiv = document.getElementsByClassName('wrs_formulaDisplay')[0];
                Util.addEvent(formulaDisplayDiv, 'focus', modalObject.openedIosSoftkeyboard.bind(modalObject));
                Util.addEvent(formulaDisplayDiv, 'blur', modalObject.closedIosSoftkeyboard.bind(modalObject));
            }

            this.onOpen(modalObject);
        } else {
            setTimeout(ContentManager.prototype.insertEditor.bind(this, modalObject), 100);
        }
    }

    /**
     * Loads MathType script.
     * @ignore
     */
    init() {
        var queryParams = window.location.search.substring(1).split("&");
        for (var i = 0; i < queryParams.length; i++) {
            var pos = queryParams[i].indexOf("v=");
            if (pos >= 0) {
                version = queryParams[i].substring(2);
            }
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        var editorUrl = Configuration.get('editorUrl');
        // Change to https if necessary.
        // We create an object url for parse url string and work more efficiently.
        var urlObject = document.createElement('a');
        urlObject.href = editorUrl;

        if (window.location.href.indexOf("https://") == 0) {
            // It check if browser is https and configuration is http. If this is so, we will replace protocol.
            if (urlObject.protocol == 'http:') {
                urlObject.protocol = 'https:';
            }
        }

        // Check protocol and remove port if it's standard.
        if (urlObject.port == '80' || urlObject.port == '443') {
            editorUrl = urlObject.protocol + '//' + urlObject.hostname + '/' + urlObject.pathname;
        } else {
            editorUrl = urlObject.protocol + '//' + urlObject.hostname + ':' + urlObject.port + '/' + urlObject.pathname;
        }

        // Editor stats. Use environment property to set it.
        var stats = {};
        if ('editor' in this.environment) {
            stats.editor = this.environment.editor;
        } else {
            stats.editor = 'unknown';
        }

        if ('mode' in this.environment) {
            stats.mode = this.environment.mode;
        } else {
            stats.mode = Configuration.get('saveMode');
        }

        if ('version' in this.environment) {
            stats.version = this.environment.version;
        } else {
            stats.version = Configuration.get('version');
        }

        // Load editor URL. We add stats as GET params.
        script.src = editorUrl +
                    "?lang=" + this.language +
                     '&stats-editor=' + stats.editor +
                     '&stats-mode=' + stats.mode +
                     '&stats-version=' + stats.version;

        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = function() {
           this.listeners.fire('onLoad', {});
        }.bind(this);
    }

    /**
    * Set the editor initial content: an existing formula or a blank MathML
    */
    setInitialContent() {
        if (!this.isNewElement) {
            this.setMathML(this.mathML);
        }
    }

    /**
     * Set a MathML into editor.
     * @param {string} mathml MathML string.
     * @param {bool} focusDisabled if true editor don't get focus after the MathML is set. false by default.
     * @ignore
     */
    setMathML(mathml, focusDisabled) {
        // By default focus is enabled
        if (typeof focusDisabled === 'undefined') {
            focusDisabled = false;
        }
        // Using setMathML method is not a change produced by the user but for the API
        // so we set to false the contentChange property of editorListener.
        this.editor.setMathMLWithCallback(mathml, function() {
            this.editorListener.setWaitingForChanges(true);
        }.bind(this));
        // We need to wait a little until the callback finish.
        setTimeout(function(){
            this.editorListener.setIsContentChanged(false);}.bind(this), 500);

        // In some scenarios - like closing modal object - editor mustn't be focused.
        if (!focusDisabled){
            this.onFocus();
        }
    }

    /**
     * Set focus on editor.
     * @ignore
     */
    onFocus() {
        if (typeof this.editor !== 'undefined' && this.editor != null) {
            this.editor.focus();
        }
    }

    /**
     * Mandatory method: modal object calls this method to execute a callback action
     * on submit.
     * This method updates the edition area (inserting a new formula or update an older one),
     * and focus the edition area too.
     * @ignore
     */
    submitAction() {
        var mathML = this.editor.getMathML();
        // Add class for custom editors.
        if (this.customEditors.getActiveEditor() != null) {
            mathML = MathML.addEditorAttribute(mathML, this.customEditors.getActiveEditor().toolbar);
        }
        var mathmlEntitiesEncoded = MathML.mathMLEntities(mathML);
        this.integrationModel.updateFormula(mathmlEntitiesEncoded);
        this.customEditors.disable();
        this.integrationModel.notifyWindowClosed();

        // Set disabled focus to prevent lost focus.
        this.setEmptyMathML();
        this.customEditors.disable();
        // Recovering editing area focus.
        setTimeout(
            function() {
                if (typeof _wrs_currentEditor !== 'undefined' && _wrs_currentEditor) {
                    _wrs_currentEditor.focus();
                }
            }, 100);
    }

    /**
     * Set an empty MathML into the editor in order to clean the edit area.
     * @ignore
     */
    setEmptyMathML() {
        // As second argument we pass
        if (this.deviceProperties.isAndroid || this.deviceProperties.isIOS) {
            // We need to set a empty annotation in order to maintain editor in Hand mode.
            // Adding dir rtl in case of it's activated.
            if (this.editor.getEditorModel().isRTL()) {
                this.setMathML('<math dir="rtl"><semantics><annotation encoding="application/json">[]</annotation></semantics></math>"', true);
            }else{
                this.setMathML('<math><semantics><annotation encoding="application/json">[]</annotation></semantics></math>"', true);
            }
        } else {
            if (this.editor.getEditorModel().isRTL()) {
                this.setMathML('<math dir="rtl"/>', true);
            }else{
                this.setMathML('<math/>', true);
            }
        }
    }

    /**
     * Mandatory method: modal object calls this method when is updated, for example re-editing a formula when the
     * editor is open with another formula. This method updates the editor content (with an empty MathML or an exising formula),
     * updates - if needed - the editor toolbar (math --> chem or chem --> math) and recover the focus.
     * @param {object} modalObject
     * @ignore
     */
    onOpen(modalObject) {
        if (this.isNewElement) {
            this.setEmptyMathML();
        }
        else {
            this.setMathML(this.mathML);
        }
        this.updateToolbar(modalObject);
        this.onFocus();
    }

    /**
     * Sets the correct toolbar depending if exist other custom toolbars at the same time (e.g: Chemistry)
     * @ignore
     */
    updateToolbar(modalObject) {
        this.updateTitle(modalObject);
        var customEditor;
        if (customEditor = this.customEditors.getActiveEditor()) {
            var toolbar = customEditor.toolbar ? customEditor.toolbar : _wrs_int_wirisProperties['toolbar'];
            if (this.toolbar == null || this.toolbar != toolbar) {
                this.setToolbar(toolbar);
            }
        } else {
            var toolbar = this.getToolbar();
            if (this.toolbar == null || this.toolbar != toolbar) {
                this.setToolbar(toolbar);
                this.customEditors.disable();
            }
        }
    }
    /**
     * Updates the modalObject title: if a custom editor (with a custom toolbar) is enabled
     * picks the custom editor title. Otherwise default title.
     * @param {object} modalObject
     * @ignore
     */
    updateTitle(modalObject) {
        var customEditor;
        if (customEditor = this.customEditors.getActiveEditor()) {
            modalObject.setTitle(customEditor.title);
        } else {
            modalObject.setTitle('MathType');
        }
    }
    /**
     * Returns toolbar depending on the configuration local or serverside.
     * @ignore
     */
    getToolbar() {
        var toolbar;
        if ('toolbar' in this.editorAttributes) {
            toolbar = this.editorAttributes.toolbar;
        } else {
            toolbar = "general";
        }
        // TODO: Change global integration variable for integration custom toolbar
        if(toolbar == 'general'){
            toolbar = (typeof _wrs_int_wirisProperties == 'undefined' || typeof _wrs_int_wirisProperties['toolbar'] == 'undefined') ? 'general' : _wrs_int_wirisProperties['toolbar'];
        }

        return toolbar;
    }

    /**
     * Set a toolbar into editor.
     * @param {string} toolbar toolbar name.
     * @ignore
     */
    setToolbar(toolbar) {
        this.toolbar = toolbar;
        this.editor.setParams({'toolbar': this.toolbar});
    }

    /**
     * Returns true if the content of the editor has been changed. The logic of the changes
     * is delegated to editorListener object.
     * @ignore
     */
    hasChanges() {
        return (!this.editor.isFormulaEmpty() && this.editorListener.getIsContentChanged());
    }
}