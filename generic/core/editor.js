var _wrs_isNewElement; // Unfortunately we need this variabels as global variable for old I.E compatibility.

(function(){
    var editor;
    // Set wrs_int_opener variable and close method.
    // For popup window opener is window.opener. For modal window window.parent.
    var wrs_int_opener = window.opener ? window.opener : window.parent;
    var _wrs_closeFunction = window.opener ? window.close : function() {getMethod(null, 'wrs_closeModalWindow', [], null)};
    var _wrs_callbacks = [];
    var _wrs_callId = 0;
    var _wrs_int_loaded = false;
    var _wrs_temporalImageAttribute = null;
    // Variables needed for core.js (or not core.js depending). This variables are loaded first of all.
    var _wrs_int_vars = ['_wrs_editMode',
                         '_wrs_isNewElement',
                         '_wrs_conf_editor',
                         '_wrs_conf_imageMathmlAttribute',
                         '_wrs_int_conf_file',
                         '_wrs_int_path' ,
                         '_wrs_int_wirisProperties',
                         '_wrs_int_customEditors',
                         '_wrs_modalWindowProperties',
                         '_wrs_int_langCode'
                        ];

    // Sometimes (yes, sometimes) internet explorer security policies hides popups
    // popup window focus should be called from child window.
    if (window.opener) {
        window.focus();
    }

    // Loading core.js dependent variables (defined on _wrs_int_vars).
    // Using getVars method for safely cross-origin communication.
    getVars(_wrs_int_vars, function(object) { // Callback method to set variables.
        for (var varName in object) {
            window[varName] = object[varName]; // Variables set as global variables on window (core.js is on window can't change the scope).
        }
        if (!_wrs_isNewElement) {
            // If is not a new image we need to load mathml image attribute using a postMessage method
            // to avoid CORS policies.
            getMethod('_wrs_temporalImage', 'getAttribute', [_wrs_conf_imageMathmlAttribute], function(imageAttribute){
                if (imageAttribute == null) {
                    getMethod('_wrs_temporalImage', 'getAttribute', ['alt'], function(imageAttributeAlt){
                        _wrs_temporalImageAttribute = imageAttributeAlt;
                        _wrs_int_loaded = true;
                    });
                } else {
                    _wrs_temporalImageAttribute = imageAttribute;
                    _wrs_int_loaded = true;
                }
            });
        }
        _wrs_int_loaded = true;
    });

    // Asyn methods
    // waitForIntVariables loads core.js. Don't start until _wrs_int_vars has been loaded from _wrs_int_opener.
    wrs_waitForIntVariables();
    // Method waitForCore() loads WIRIS editor. Don't start until core.js has been loaded.
    wrs_waitForCore();

    /**
     * Pass a wrs_int_opener variable to a callback function using postMessage method in order to avoid
     * javascript CORS issues when wrs_int_opener and html editor page are on differents domains (like tinyMCE external plugin).
     * For old I.E versions (7,8 & 9) wrs_int_opener is directly called so CORS don't work for them.
     *
     * @param  {String}   varName  wrs_int_opener variable name.
     * @param  {Function} callback callback function.
     */
    function getVars(varNames, callback) {
        _wrs_callbacks.push({
            'isWirisMessage': true,
            'id': _wrs_callId,
            'callback': callback
        });

        try {
            wrs_int_opener.postMessage({'isWirisMessage': true, 'id': _wrs_callId++, 'varNames' : varNames}, '*');
        }
        catch (err) { // Method postMessage not defined (I.E 7 & 8 ) or not competible with window object (I.E 9).
            _wrs_callbacks.splice(_wrs_callId, 1);
            var varObject = {};
            for (var i = 0; i < varNames.length; i++) {
                varObject[varNames[i]] = wrs_int_opener[varNames[i]];
            }
            callback(varObject);
        }
    }

    /**
     * Call a wrs_int_opener method and pass the result to a callback function using postMessage method in order to avoid
     * javascript CORS issues when wrs_int_opener and html editor page are on differents domains (like tinyMCE external plugin).
     * For old I.E versions (7,8 & 9) wrs_int_opener is directly called so CORS don't work for them. It is possible to call an object
     * method using objectName variable.
     *
     * @param  {String}   objectName object name (null to call a wrs_int_opener method).
     * @param  {String}   methodName method name.
     * @param  {Array}    argumentss  method arguments ([arg1,..,argn])
     * @param  {Function} callback   callback function.
     */
    function getMethod(objectName, methodName, argumentss, callback) {
        _wrs_callbacks.push({
            'isWirisMessage': true,
            'id': _wrs_callId,
            'callback': callback
        });
        try {
            wrs_int_opener.postMessage({'isWirisMessage': true, 'id': _wrs_callId++, 'objectName': objectName, 'methodName' : methodName, 'arguments': argumentss}, '*');
        }
        catch (err) { // Method postMessage not defined (I.E 7 & 8 ) or not competible with window object (I.E 9).
            var object = (objectName == null) ? wrs_int_opener : wrs_int_opener[objectName];
            if (objectName == null) {
                callback(object[methodName].apply(object, argumentss));
            } else { // Can't call apply method from some objects on old I.E.
                var argumentsStrings = argumentss.join(',');
                var result = object[methodName](argumentsStrings);
                callback(result);
            }
            _wrs_callbacks.splice(_wrs_callId, 1);
        }
    }

    /**
     * Load core.js library.
     *
     */
    function wrs_loadCore() {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "core.js";
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    /**
     * Load core.js when int variables has been loaded.
     *
     */
    function wrs_waitForIntVariables() {
        if (_wrs_int_loaded) {
            wrs_loadCore();
        } else {
            setTimeout(wrs_waitForIntVariables, 100);
        }
    }

    /**
     * Cross-browser addEventListener/attachEvent function.
     * @param object element Element target
     * @param event event Event
     * @param function func Function to run
     */
    function wrs_addEvent(element, event, func) {
        if (element.addEventListener) {
            element.addEventListener(event, func, true);
        }
        else if (element.attachEvent) {
            element.attachEvent('on' + event, func);
        }
    }

    /**
     * Load editor from _wrs_conf_editorUrl when core.js has been loaded.
     * @return {[type]} [description]
     */
    function wrs_waitForCore() {
        if (typeof _wrs_conf_core_loaded != 'undefined' && typeof _wrs_conf_configuration_loaded != 'undefined' && _wrs_conf_configuration_loaded == true) {
            // Insert editor.
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
            statEditor = _wrs_conf_editor;
            statSaveMode = _wrs_conf_saveMode;
            statVersion = _wrs_conf_version;

            script.src = editorUrl + "?lang=" + _wrs_int_langCode + '&stats-editor=' + statEditor + '&stats-mode=' + statSaveMode + '&stats-version=' + statVersion;
            document.getElementsByTagName('head')[0].appendChild(script);

            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = "../";
            // Get lang path.
            var webScripts = document.getElementsByTagName("script");
            var scriptName = "strings.js";
            var found = false;
            var i = 0;
            while (!found && i < webScripts.length) {
                if (webScripts[i].src.indexOf(scriptName) != -1) {
                    var pathArray = webScripts[i].src.split("/");
                    // We need to get the lang folder name of "../[lang_folder]/[lang_code]/strings.js".
                    script.src += pathArray[pathArray.length - 3 ] + "/" + _wrs_int_langCode + "/strings.js";
                    found = true;
                }
                i++
            }
            document.getElementsByTagName('head')[0].appendChild(script);
        } else {
            setTimeout(wrs_waitForCore, 200);
        }
    }

    // Adding events:
    // 1.- onMessage event: for enable cross-origin communication between editor window and _wrs_int_opener.
    // 2.- onLoad event: inserts WIRIS editor into editor.html DOM.
    // 3.- onUnload: communicates _wrs_int_opener that editor has been closed.

    wrs_addEvent(window, 'message', function (e) { // Safely enable cross-origin communication.
        for (var i = 0; i < _wrs_callbacks.length; ++i) {
            if (_wrs_callbacks[i].id == e.data.id && _wrs_callbacks[i].callback != null) {
                _wrs_callbacks[i].callback(e.data.value);
                _wrs_callbacks.splice(i, 1);
                break;
            }
        }
    });
    wrs_addEvent(window, 'load', function () {
        function wrs_waitForEditor() {
            if ((typeof _wrs_conf_core_loaded != 'undefined') && ('com' in window && 'wiris' in window.com && 'jsEditor' in window.com.wiris)) {

                var queryParams = wrs_getQueryParams(window);
                var customEditor;

                wrs_attributes = _wrs_conf_editorParameters;
                wrs_attributes.language = queryParams['lang'];

                if (typeof wrs_attributes['toolbar'] == 'undefined' &&  _wrs_conf_editorToolbar.length > 0) {
                    wrs_attributes['toolbar'] = _wrs_conf_editorToolbar;
                }

                if (typeof(_wrs_int_wirisProperties) != 'undefined') {
                    for (var key in _wrs_int_wirisProperties) {
                        if (_wrs_int_wirisProperties.hasOwnProperty(key) && typeof(_wrs_int_wirisProperties[key]) != 'undefined') {
                            wrs_attributes[key] = _wrs_int_wirisProperties[key];
                        }
                    }
                }

                if (customEditor = wrs_int_getCustomEditorEnabled()) {
                    wrs_attributes['toolbar'] = customEditor.toolbar ? customEditor.toolbar : wrs_attributes['toolbar'];
                }

                if (com.wiris.jsEditor.defaultBasePath) {
                    editor = com.wiris.jsEditor.JsEditor.newInstance(wrs_attributes);
                }
                else {
                    editor = new com.wiris.jsEditor.JsEditor('editor', null);
                }

                // Set ModalWindow editor attribute.

                var ua = navigator.userAgent.toLowerCase();
                var isAndroid = ua.indexOf("android") > -1;
                var isIOS = ((ua.indexOf("ipad") > -1) || (ua.indexOf("iphone") > -1));

                var editorElement = editor.getElement();
                var editorContainer = document.getElementById('editorContainer');
                if (isIOS) {
                    editorContainer.className += ' wrs_editorContainer wrs_modalIos';
                }
                editor.insertInto(editorContainer);

                // Mathml content.
                if (!_wrs_isNewElement) {
                    var mathml;

                    if (typeof _wrs_conf_useDigestInsteadOfMathml != 'undefined' && _wrs_conf_useDigestInsteadOfMathml) {
                        mathml = wrs_getCode(_wrs_conf_digestPostVariable, _wrs_temporalImageAttribute);
                    }
                    else {
                        mathml = wrs_mathmlDecode(_wrs_temporalImageAttribute);
                    }
                    if (wrs_int_getCustomEditorEnabled() == null && mathml.indexOf('class="wrs_') != -1) {
                        var classIndexStart = mathml.indexOf('class="wrs_');
                        classIndexEnd = mathml.indexOf(" ", classIndexStart);
                        mathml = mathml.substring(0, classIndexStart) + mathml.substring(classIndexEnd, mathml.length);
                    }

                    editor.setMathMLWithCallback(mathml, function(){window.editorListener.setWaitingForChanges(true);});
                }

                if (typeof strings == 'undefined') {
                    strings = new Object();
                }

                var popup = new PopUpMessage(strings);

                if (isIOS) {
                    // Editor and controls container.
                    var editorAndControlsContainer = document.getElementById('container');
                    editorAndControlsContainer.className += ' wrs_container wrs_modalIos';
                }

                // Submit button.
                var controls = document.getElementById('controls');
                if (isIOS) {
                    controls.className += ' wrs_controls wrs_modalIos';
                }
                var submitButton = document.createElement('input');
                submitButton.type = 'button';
                submitButton.className = 'wrs_button_accept';
                submitButton.background = '#778e9a';
                submitButton.color = '#ffffff'

                if (strings['accept'] != null){
                    submitButton.value = strings['accept'];
                }else{
                    submitButton.value = 'Accept';
                }

                wrs_addEvent(window, 'beforeunload', function() {
                    getMethod(null, 'wrs_int_disableCustomEditors', [], function(){
                    });
                });

                wrs_addEvent(submitButton, 'click', function () {

                    // In order to avoid n-formulas on n-clicks
                    // submit button is disabled 1 second.
                    submitButton.disabled = true;

                    setTimeout(function() {
                        submitButton.disabled = false;
                    }, 1000);

                    // There are vars that are updated during the execution in core.js, we need to sync.
                    var varsToUpdate = ['_wrs_int_customEditors'];
                    getVars(varsToUpdate, function(object) { // Callback method to set variables.
                        for (var varName in object) {
                            window[varName] = object[varName]; // Variables set as global variables on window (core.js is on window can't change the scope).
                        }

                        var mathml = '';

                        if (!editor.isFormulaEmpty()) {
                            mathml += editor.getMathML(); // If isn't empty, get mathml code to mathml variable.
                            if (wrs_int_getCustomEditorEnabled() != null) {
                                mathml = wrs_mathmlAddEditorAttribute(mathml);
                            }
                            else {
                                var startIndex = mathml.indexOf(' class="');
                                if (startIndex != -1) {
                                    var lastIndex = mathml.indexOf('"', startIndex + 8);
                                    mathml = mathml.substring(0, startIndex) + mathml.substring(lastIndex + 1);
                                }
                            }
                            mathml = wrs_mathmlEntities(mathml);    // Apply a parse.
                        }

                        getMethod(null, 'wrs_int_updateFormula', [mathml, null, queryParams['lang']], function(){
                                _wrs_closeFunction();
                        });
                    });

                    // Control buttons need to cause a editor blur in order to reset the state for the next time that it is opened.
                    editor.blur();
                });

                var buttonContainer = document.getElementById('buttonContainer');
                buttonContainer.appendChild(submitButton);

                // Cancel button.
                var cancelButton = document.createElement('input');
                cancelButton.type = 'button';
                cancelButton.className = 'wrs_button_cancel';

                if (strings['cancel'] != null) {
                    cancelButton.value = strings['cancel'];
                } else {
                    cancelButton.value = 'Cancel';
                }

                wrs_addEvent(cancelButton, 'click', function () {
                    _wrs_closeFunction();
                    // Control buttons need to cause a editor blur in order to reset the state for the next time that it is opened.
                    editor.blur();
                });

                buttonContainer.appendChild(cancelButton);

                // Class for modal dialog.
                if (_wrs_conf_modalWindow) {
                    if (_wrs_modalWindowProperties.device == 'android') {
                        buttonContainer.className = buttonContainer.className + ' wrs_modalAndroid';
                    } else {
                        buttonContainer.className = buttonContainer.className + ' wrs_modalDesktop';
                    }
                }

                var queryLang = '';
                if ('lang' in queryParams){
                    queryLang = queryParams['lang'].substr(0, 2);
                }

                if ((queryParams['dir'] == 'rtl') || ((queryLang == 'he' || queryLang == 'ar') && queryParams['dir'] != 'ltr')){
                    var body = document.getElementsByTagName('BODY');
                    body[0].setAttribute("dir","rtl");
                    var links = document.getElementById('links');
                    links.id = 'links_rtl';
                    var controls = document.getElementById('buttonContainer');
                    controls.id = 'controls_rtl';
                }

                window.editorListener = new EditorListener();
                editor.getEditorModel().addEditorListener(window.editorListener);
                if(_wrs_isNewElement){
                    window.editorListener.setWaitingForChanges(true);
                }

                // At this point we listen to execute editor methods or fire editor events.
                wrs_addEvent(window, 'message', function (e) {
                    if (e.data.objectName != 'undefined' && e.data.objectName == 'editor') {
                        editor[e.data.methodName].apply(editor, e.data.arguments);
                    }else if (e.data.objectName != 'undefined' && e.data.objectName == 'editorCallback') {
                        editor.setMathMLWithCallback(e.data.arguments[0], function(){window.editorListener.setIsContentChanged(false);window.editorListener.setWaitingForChanges(true);});
                    }else if (e.data.objectName != 'undefined' && e.data.objectName == 'editorEvent') {
                        wrs_fireEvent(window.document, e.data.eventName);
                    }else if (e.data.objectName != 'undefined' && e.data.objectName == 'editorClose') {
                        window.editorListener.setWaitingForChanges(false);
                        window.editorListener.setIsContentChanged(false);
                    }
                });

                wrs_addEvent(window, 'mouseup', function(e) {
                    if (_wrs_conf_modalWindow) {
                        getMethod('_wrs_modalWindow', 'stopDrag', [], null);
                    }
                });

                wrs_addEvent(window, 'mousedown', function(e) {
                    if (_wrs_conf_modalWindow) {
                        getMethod('_wrs_modalWindow', 'setOverlayDiv', [], null);
                    }
                });

                // Dynamic resize when it is a phone with float keyboard
                if (_wrs_conf_modalWindow && isIOS) {
                    var formulaDisplayDiv = document.getElementsByClassName('wrs_formulaDisplay')[0];
                    wrs_addEvent(formulaDisplayDiv, 'focus', function (e) {
                        if (_wrs_conf_modalWindow) {
                            getMethod('_wrs_modalWindow', 'addClassVirtualKeyboard', [], null);
                            editorElement.style.height = '100%';
                        }
                    });

                    wrs_addEvent(formulaDisplayDiv, 'blur', function (e) {
                        if (_wrs_conf_modalWindow) {
                            getMethod('_wrs_modalWindow', 'removeClassVirtualKeyboard', [], null);
                            editorElement.style.height = '10%';
                        }
                    });
                }

                // Event for close window and trap focus
                wrs_addEvent(window, 'keydown', function(e) {
                    if (_wrs_conf_modalWindow) {
                        if (e.keyCode !== undefined && e.keyCode === 27 && e.repeat === false) {
                            if (editor.isFormulaEmpty() || window.editorListener.getIsContentChanged() === false) {
                                _wrs_closeFunction();
                            }else{
                                popup.show();
                            }
                        }
                    }
                });

                // Auto resizing.
                setInterval(function () {
                    editorElement.style.height = (document.getElementById('container').offsetHeight - controls.offsetHeight - 10) + 'px';
                }, 100);

                // Due to IOS use soft keyboard, we don't want to move the cursor to WIRIS editor.
                if (!isIOS) {
                    editor.focus();
                }
            } else {
                setTimeout(wrs_waitForEditor, 100);
            }

        }
        wrs_waitForEditor();
    });
    wrs_addEvent(window, 'unload', function () {
        getMethod(null, 'wrs_int_notifyWindowClosed', [], function(wrs_int_notifyWindowClosed){
        });
    });
    // PopUpMessageClass definition
    // This class generate a modal message to show information to user
    // We should send a language strings to show messages
    function PopUpMessage(strings)
    {
        this.strings = strings;
        this.overlayEnvolture = document.body.appendChild(document.createElement("DIV"));
        this.overlayEnvolture.setAttribute("style", "display: none;");

        this.message = this.overlayEnvolture.appendChild(document.createElement("DIV"));
        this.message.setAttribute("style", "margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;background: white;width: 65%;height: 69px;border-radius: 2px;padding: 20px;font-family: sans-serif;font-size: 15px;text-align: left;color: #2e2e2e;z-index: 5;");

        var overlay = this.overlayEnvolture.appendChild(document.createElement("DIV"));
        overlay.setAttribute("style", "position: fixed; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 4; cursor: pointer;");
        self = this;
        // We create a overlay that close popup message on click in there
        overlay.addEventListener("click", function(){self.close();});

        this.buttonArea = this.message.appendChild(document.createElement('p'));
        // By default, popupwindow give close modal message with close and cancel buttons
        // You can set other message with other buttons
        this.setOptions('close_modal_warning','close,cancel');
    }
    PopUpMessage.prototype.setOptions = function(messageKey,values){
        this.message.removeChild(this.buttonArea);
        if(typeof this.strings[messageKey] != 'undefined'){
            this.message.innerHTML = this.strings[messageKey];
        }
        this.buttonArea = this.message.appendChild(document.createElement('p'));
        var types = values.split(',');
        self = this;
        // This is definition of buttons. You can create others.
        types.forEach(function(type){
            if(type == "close"){
                var buttonClose = self.buttonArea.appendChild(document.createElement("BUTTON"));
                buttonClose.setAttribute("style","margin: 0px;border: 0px;background: #567e93;border-radius: 4px;padding: 7px 11px;color: white;");
                buttonClose.addEventListener('click',function(){self.close();_wrs_closeFunction();})
                if(typeof this.strings['close'] != 'undefined'){
                    buttonClose.innerHTML = this.strings['close'];
                }
            }
            if(type == 'cancel'){
                var buttonCancel = self.buttonArea.appendChild(document.createElement("BUTTON"));
                buttonCancel.setAttribute("style","margin: 0px;border: 0px;border-radius: 4px;padding: 7px 11px;color: white;color: black;border: 1px solid silver;margin: 0px 5px;");
                buttonCancel.addEventListener("click", function(){self.close();});
                if(typeof this.strings['cancel'] != 'undefined'){
                    buttonCancel.innerHTML = this.strings['cancel'];
                }
            }
        });
    }
    // This method show popup message.
    PopUpMessage.prototype.show = function(){
        this.overlayEnvolture.setAttribute('style','display: block;')
    }
    // This method hide popup message
    PopUpMessage.prototype.close = function(){
        this.overlayEnvolture.setAttribute('style','display: none;')
    }
})();
