/**
 * This class implements ModalContent interface. Manage the following:
 * - insertion in modal object (insert(modalObject) method)
 * - actions to be done once the modal object has been submited (submitAction() method)
 * - updates itself when modalObject is updated with a re-open action for example (update(modalObject) method)
 * - comunicates to modalObject if some changes have be done (hasChanges() method)
 *
 * @param {object} editorAttributes editor attributes. See http://docs.wiris.com/en/mathtype/mathtype_web/sdk-api/parameters
 * for further information.
 * @ignore
 */
class ModalPluginContent {
    // Editor listener.
    constructor(editorAttributes) {
        this.editorListener = new EditorListener();
        this.editor = null;
        this.editorAttributes = editorAttributes;
        this.lastImageWasNew = false;
        // Device properties
        var ua = navigator.userAgent.toLowerCase();
        this.deviceProperties = {};
        this.deviceProperties.isAndroid = ua.indexOf("android") > -1;
        this.deviceProperties.isIOS = ((ua.indexOf("ipad") > -1) || (ua.indexOf("iphone") > -1));
        // Toolbar
        this.toolbar = null;
        this.loadEditor();
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
     * watis until editor JavaScript is loaded to insert the editor into
     * contentContainer modal object element.
     * @ignore
     */
    insertEditor(modalObject) {
        // To know if editor JavaScript is loaded we need to wait until com.wiris.jsEditor namespace is ready.
        if ('com' in window && 'wiris' in window.com && 'jsEditor' in window.com.wiris) {
            this.editor = com.wiris.jsEditor.JsEditor.newInstance(this.editorAttributes);
            this.editor.insertInto(modalObject.contentContainer);
            this.editor.focus()

            // Editor listener: this object manages the changes logic of editor.
            this.editor.getEditorModel().addEditorListener(this.editorListener);

            // iOS events.
            if (modalObject.deviceProperties['isIOS']) {
                setTimeout(function() { _wrs_modalWindow.hideKeyboard() }, 300);
                var formulaDisplayDiv = document.getElementsByClassName('wrs_formulaDisplay')[0];
                wrs_addEvent(formulaDisplayDiv, 'focus', modalObject.openedIosSoftkeyboard.bind(modalObject));
                wrs_addEvent(formulaDisplayDiv, 'blur', modalObject.closedIosSoftkeyboard.bind(modalObject));
            }

            this.update(modalObject);
            this.editor.onContentChanged
        } else {
            setTimeout(ModalPluginContent.prototype.insertEditor.bind(this, modalObject), 100);
        }
    }

    /**
     * Loads MathType ediitor JavaScript.
     * @ignore
     */
    loadEditor() {
        var queryParams = window.location.search.substring(1).split("&");
        var version = "";
        for (var i = 0; i < queryParams.length; i++) {
            var pos = queryParams[i].indexOf("v=");
            if (pos >= 0) {
                version = queryParams[i].substring(2);
            }
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        var editorUrl = _wrs_conf_editorUrl;
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

        // Editor stats.
        var statEditor = _wrs_conf_editor;
        var statSaveMode = _wrs_conf_saveMode;
        var statVersion = _wrs_conf_version;

        script.src = editorUrl + "?lang=" + _wrs_int_langCode + '&stats-editor=' + statEditor + '&stats-mode=' + statSaveMode + '&stats-version=' + statVersion;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    /**
    * Set the editor initial content: an existing formula or a blank MathML
    */
    setInitialContent() {
        if (!_wrs_isNewElement) {
            var mathml = wrs_mathmlDecode(_wrs_temporalImage.getAttribute(_wrs_conf_imageMathmlAttribute));
            this.setMathML(mathml);
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
        // TODO: Not working.
        this.editor.setMathMLWithCallback(mathml, function() {
            setTimeout(this.editorListener.setWaitingForChanges.bind(this, true), 1000);
        }.bind(this));

        // In some scenarios - like closing modal object - editor mustn't be focused.
        if (!focusDisabled){
            this.focus();
        }
    }

    /**
     * Set focus on editor.
     * @ignore
     */
    focus() {
        // TODO: Check editor avaliable.
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
        var mathmlEntitiesEncoded = wrs_mathmlEntities(this.editor.getMathML());
        wrs_int_updateFormula(mathmlEntitiesEncoded, null, _wrs_int_langCode);
        wrs_int_disableCustomEditors();
        wrs_int_notifyWindowClosed();
        _wrs_editMode = (window._wrs_conf_defaultEditMode) ? _wrs_conf_defaultEditMode : 'images';

        // Set disabled focus to prevent lost focus.
        this.setEmptyMathML();
        wrs_int_disableCustomEditors();
        // Reconvering editing area focus.
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
            this.setMathML('<math><semantics><annotation encoding="application/json">[]</annotation></semantics></math>"', true);
        } else {
            this.setMathML('<math/>', true);
        }
    }

    /**
     * Mandatory method: modal object calls this method when is updated, for example re-editing a formula when the
     * editor is open with another formula. This method updates the editor content (with an empty MathML or an exising formula),
     * updates - if needed - the editor toolbar (math --> chem or chem --> math) and recover the focus.
     * @param {object} modalObject
     * @ignore
     */
    update(modalObject) {
        if (_wrs_isNewElement) {
            this.setEmptyMathML();
            this.lastImageWasNew = true;
        }
        else {
            this.setMathML(wrs_mathmlDecode(_wrs_temporalImage.getAttribute(_wrs_conf_imageMathmlAttribute)));
            this.lastImageWasNew = false;
        }
        this.updateToolbar(modalObject);
        this.focus();
    }

    /**
     * Sets the correct toolbar depending if exist other custom toolbars at the same time (e.g: Chemistry)
     * @ignore
     */
    updateToolbar(modalObject) {
        this.updateTitle(modalObject);
        var customEditor;
        if (customEditor = wrs_int_getCustomEditorEnabled()) {
            var toolbar = customEditor.toolbar ? customEditor.toolbar : _wrs_int_wirisProperties['toolbar'];
            if (this.toolbar == null || this.toolbar != toolbar) {
                this.setToolbar(toolbar);
            }
        } else {
            var toolbar = this.getToolbar();
            if (this.toolbar == null || this.toolbar != toolbar) {
                this.setToolbar(toolbar);
                wrs_int_disableCustomEditors();
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
        if (customEditor = wrs_int_getCustomEditorEnabled()) {
            modalObject.setTitle(customEditor.title);
        } else {
            modalObject.setTitle('MathType');
        }
    }
    /**
     * Returns toolbar depending on the configuration local or serverside.
     * @ignore
     */
    // TODO: Global variable
    getToolbar() {
        var toolbar = (typeof _wrs_conf_editorParameters == 'undefined' || typeof _wrs_conf_editorParameters['toolbar'] == 'undefined') ? 'general' : _wrs_conf_editorParameters['toolbar'];
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
