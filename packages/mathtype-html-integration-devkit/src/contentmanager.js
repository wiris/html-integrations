import Configuration from './configuration.js';
import EditorListener from './editorlistener.js';
import Listeners from './listeners.js';
import MathML from './mathml.js';
import Util from './util.js';

/**
 * This class represents the content of a ModalDialog class managing the following:
 * - Insertion in the ModalDialog.
 * - Actions to be done once the modal object has been submitted (submitAction() method).
 * - Updates itself when ModalDialog is updated, for example when ModalDialog
 *   is re-opened (update(modalObject) method).
 * - Communicates ModalDialog if some changes have be done (hasChanges() method).
 */
export default class ContentManager {
    /**
     * Class constructor
     * @param {Object} contentManagerAttributes - Object containing all attributes needed to
     * create a new instance of ContentManager class.
     * @param {Object} contentManagerAttributes.editorAttributes - Object containing MathType editor parameters.
     */
    constructor(contentManagerAttributes) {
        /**
         * An object containing MathType editor parameters. See
         * http://docs.wiris.com/en/mathtype/mathtype_web/sdk-api/parameters for further information.
         * @type {Object}
         */
        this.contentManagerAttributes = {};
        if ('editorAttributes' in contentManagerAttributes) {
            this.editorAttributes = contentManagerAttributes.editorAttributes;
        } else {
            throw new Error('ContentManager constructor error: editorAttributes property missed.')
        }

        /**
         * CustomEditors instance. Contains the custom editors.
         * @type {CustomEditors}
         */
        this.customEditors = null;
        if ('customEditors' in contentManagerAttributes) {
            this.customEditors = contentManagerAttributes.customEditors;
        }

        /**
		* Environment properties. This object contains data about the integration platform.
		* @type {Object}
		* @property {string} editor - Editor name. Usually the HTML editor.
		* @property {string} mode - Save mode. Xml by default
		* @property {string} version - Plugin version.
	    */
       this.environment = {};
       if ('environment' in contentManagerAttributes) {
            this.environment = contentManagerAttributes.environment;
       } else {
            throw new Error('ContentManager constructor error: environment property missed');
       }

       /**
         * ContentManager language.
         * @type {string}
         */
        this.language = '';
        if ('language' in contentManagerAttributes) {
            this.language = contentManagerAttributes.language;
        } else {
            throw new Error('ContentManager constructor error: language property missed');
        }

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
         * Navigator user agent.
         * @type {string}
         */
        this.ua = navigator.userAgent.toLowerCase();

        /**
         * Mobile device properties object
         * @type {Object}
         * @property {boolean} isAndroid - True if the device is android. False otherwise.
         * @property {boolean} isIOS - True if the device is iOS. False otherwise.
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
         * Instance of the ModalDialog class associated to the ContentManager instance.
         * @type {ModalDialog}
         */
        this.modalDialogInstance = null;

        /**
         * ContentManager listeners.
         * @type {Listeners}
         */
        this.listeners = new Listeners();

        /**
         * MathML associated to the ContentManager instance.
         * @type {string}
         */
        this.mathML = null;

        /**
         * Indicates if the edited element is a new element or not.
         * @type {boolean}
         */
        this.isNewElement = true;

        /**
         * IntegrationModel instance. Needed to call wrapper methods.
         * @type {IntegrationModel}
         */
        this.integrationModel = null;

        /**
         * Indicates if the editor is loaded.
         * @type {boolean}
         */
        this.isEditorLoaded = false;
    }

    /**
     * Add a new listener to ContentManager class.
     * @param {Object} listener - listener to be added.
     */
    addListener(listener) {
        this.listeners.add(listener);

    }

    /**
     * Sets an instance of an IntegrationModel
     * @param {IntegrationModel} integrationModel
     */
    setIntegrationModel(integrationModel) {
        this.integrationModel = integrationModel;
    }

    /**
     * Sets a modal dialog instance.
     * @param {ModalDialog} - a ModalDialog instance
     */
    setModalDialogInstance(modalDialogInstance) {
        this.modalDialogInstance = modalDialogInstance;
    }

    /**
     * Mandatory method. Inserts editor into modal object content container.
     */
    insert() {
        // Before insert the editor we update the modal object title to avoid weird render display.
        this.updateTitle(this.modalDialogInstance);
        this.insertEditor(this.modalDialogInstance);
    }

    /**
     * Method to insert MathType into modal object. This method
     * waits until editor JavaScript is loaded to insert the editor into
     * contentContainer modal object element.
     */
    insertEditor() {
        // To know if editor JavaScript is loaded we need to wait until com.wiris.jsEditor namespace is ready.
        if ('com' in window && 'wiris' in window.com && 'jsEditor' in window.com.wiris) {
            this.editor = com.wiris.jsEditor.JsEditor.newInstance(this.editorAttributes);
            this.editor.insertInto(this.modalDialogInstance.contentContainer);
            this.editor.focus();
            if (this.modalDialogInstance.rtl) {
                this.editor.action('rtl');
            }
            // Setting div in rtl in case of it's activated.
            if (this.editor.getEditorModel().isRTL()) {
                this.editor.element.style.direction = 'rtl';
            }

            // Editor listener: this object manages the changes logic of editor.
            this.editor.getEditorModel().addEditorListener(this.editorListener);

            // iOS events.
            if (this.modalDialogInstance.deviceProperties['isIOS']) {
                setTimeout(function() { this.modalDialogInstance.hideKeyboard() }, 400);
                var formulaDisplayDiv = document.getElementsByClassName('wrs_formulaDisplay')[0];
                Util.addEvent(formulaDisplayDiv, 'focus', this.modalDialogInstance.openedIosSoftkeyboard.bind());
                Util.addEvent(formulaDisplayDiv, 'blur', this.modalDialogInstance.closedIosSoftkeyboard.bind());
            }
            // Fire onLoad event. Necessary to set the MathML into the editor
            // after is loaded.
            this.listeners.fire('onLoad', {});
            this.isEditorLoaded = true;
        } else {
            setTimeout(ContentManager.prototype.insertEditor.bind(this, this.modalDialogInstance), 100);
        }
    }

    /**
     * Loads MathType script.
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
        // We create an object url for parse url string and work more efficiently.
        var urlObject = document.createElement('a');
        urlObject.href = editorUrl;

        // Change to https if necessary.
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
     * @param {string} mathml - MathML string.
     * @param {bool} focusDisabled - if true editor don't get focus after the MathML is set. false by default.
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
     */
    submitAction() {
        var mathML = this.editor.getMathML();
        // Add class for custom editors.
        if (this.customEditors.getActiveEditor() != null) {
            mathML = MathML.addCustomEditorClassAttribute(mathML, this.customEditors.getActiveEditor().toolbar);
        } else {
            // We need - if exists - the editor name from MathML
            // class attribute.
            for (var key in this.customEditors.editors) {
                mathML = MathML.removeCustomEditorClassAttribute(mathML, key);
            }
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
     */
    setEmptyMathML() {
        // As second argument we pass
        if (this.deviceProperties.isAndroid || this.deviceProperties.isIOS) {
            // We need to set a empty annotation in order to maintain editor in Hand mode.
            // Adding dir rtl in case of it's activated.
            if (this.editor.getEditorModel().isRTL()) {
                this.setMathML('<math dir="rtl"><semantics><annotation encoding="application/json">[]</annotation></semantics></math>"', true);
            } else {
                this.setMathML('<math><semantics><annotation encoding="application/json">[]</annotation></semantics></math>"', true);
            }
        } else {
            if (this.editor.getEditorModel().isRTL()) {
                this.setMathML('<math dir="rtl"/>', true);
            } else {
                this.setMathML('<math/>', true);
            }
        }
    }

    /**
     * Mandatory method: modal object calls this method when is updated, for example re-editing a formula when the
     * editor is open with another formula. This method updates the editor content (with an empty MathML or an existing formula),
     * updates - if needed - the editor toolbar (math --> chem or chem --> math) and recover the focus.
     */
    onOpen() {
        if (this.isNewElement) {
            this.setEmptyMathML();
        }
        else {
            this.setMathML(this.mathML);
        }
        this.updateToolbar();
        this.onFocus();
    }

    /**
     * Sets the correct toolbar depending if exist other custom toolbars at the same time (e.g: Chemistry)
     */
    updateToolbar() {
        this.updateTitle(this.modalDialogInstance);
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
     */
    updateTitle() {
        var customEditor;
        if (customEditor = this.customEditors.getActiveEditor()) {
            this.modalDialogInstance.setTitle(customEditor.title);
        } else {
            this.modalDialogInstance.setTitle('MathType');
        }
    }
    /**
     * Returns toolbar depending on the configuration local or server side.
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
     * @param {string} toolbar - toolbar name.
     */
    setToolbar(toolbar) {
        this.toolbar = toolbar;
        this.editor.setParams({'toolbar': this.toolbar});
    }

    /**
     * Returns true if the content of the editor has been changed. The logic of the changes
     * is delegated to editorListener object.
     */
    hasChanges() {
        return (!this.editor.isFormulaEmpty() && this.editorListener.getIsContentChanged());
    }
}