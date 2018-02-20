// Define variables needed by core/core.js.
var _wrs_int_conf_file = "@param.js.configuration.path@";
var _wrs_plugin_version = "@plugin.version@";
var _wrs_int_conf_async = true;
var _wrs_baseURL;

// Stats editor (needed by core/editor.js).
var _wrs_conf_editor = "TinyMCE";

// Define _wrs_conf_path (path where configuration is found).
if (typeof _wrs_isMoodle24 == 'undefined') {
    _wrs_baseURL = tinymce.baseURL;
    _wrs_conf_path = _wrs_baseURL + '/plugins/tiny_mce_wiris/'; // TODO use the same variable name always.
}else{
    var base = tinymce.baseURL;
    var search = 'lib/editor/tinymce';
    var pos = base.indexOf(search);
    _wrs_baseURL = tinymce.baseURL.substr(0, pos + search.length);
    _wrs_conf_path = _wrs_baseURL + '/plugins/tiny_mce_wiris/tinymce/'; // TODO use the same variable name always
    _wrs_int_conf_async = false; // For sure!
}

var _wrs_int_path = wrs_intPath(_wrs_int_conf_file, _wrs_conf_path);

// Load configuration synchronously.
if (!_wrs_int_conf_async) {
    var httpRequest = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    var configUrl = _wrs_int_conf_file.indexOf("/") == 0 || _wrs_int_conf_file.indexOf("http") == 0 ? _wrs_int_conf_file : _wrs_conf_path + "/" + _wrs_int_conf_file;
    httpRequest.open('GET', configUrl, false);
    httpRequest.send(null);

    var jsonConfiguration = JSON.parse(httpRequest.responseText);

    // JSON structure: {{jsVariableName, jsVariableValue}}.

    variables = Object.keys(jsonConfiguration);

    for (variable in variables) {
        window[variables[variable]] = jsonConfiguration[variables[variable]];
    }

    _wrs_conf_configuration_loaded = true;
}

var _wrs_conf_pluginBasePath = _wrs_conf_path;

/* Vars */
var _wrs_int_editorIcon;
var _wrs_int_temporalIframe;
var _wrs_int_temporalElementIsIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_wirisProperties;
var _wrs_int_directionality;
var _wrs_int_imagesDataimgFilterBackup = [];
// Custom Editors.
var _wrs_int_customEditors = {chemistry : {name: 'Chemistry', toolbar : 'chemistry', icon : 'chem.png', enabled : false, confVariable : '_wrs_conf_chemEnabled', tooltip: 'Insert a chemistry formula - ChemType', title : 'ChemType'}}

// Variable to control first wrs_initParse call.
var _wrs_int_initParsed = false;

// Core added to queue.
var _wrs_addCoreQueue = typeof _wrs_addCoreQueue == 'undefined' ? false : _wrs_addCoreQueue;

// Lang.
var _wrs_int_langCode = 'en';

/* Plugin integration */
(function () {
    tinymce.create('tinymce.plugins.tiny_mce_wiris', {
        init: function (editor, url) {
             _wrs_currentEditor = editor;
            // Var to access to selected element from all the WIRIS tiny mce functions.
            var element;

            _wrs_int_imagesDataimgFilterBackup[editor.id] = editor.settings.images_dataimg_filter;
            editor.settings.images_dataimg_filter = function(img) {
                if (img.hasAttribute('class') && img.getAttribute('class').indexOf('Wirisformula') != -1) {
                    return img.hasAttribute('internal-blob');
                }
                else {
                    // If the client put an image data filter, run. Otherwise default behaviour (put blob).
                    if (typeof _wrs_int_imagesDataimgFilterBackup[editor.id] != 'undefined') {
                        return _wrs_int_imagesDataimgFilterBackup[editor.id](img);
                    }
                    return true;
                }
            }

            // Including core.js
            // First of all: recalculating _wrs_conf_path if MathType for TinyMCE has been loaded as an external plugin.
            // Cant access editor params since now.
            if (typeof editor.getParam('external_plugins') != 'undefined' && editor.getParam('external_plugins') != null && typeof editor.getParam('external_plugins')['tiny_mce_wiris'] != 'undefined') {
                var external_url = editor.getParam('external_plugins')['tiny_mce_wiris'];
                _wrs_conf_path = external_url.substring(0,external_url.lastIndexOf("/") + 1)
                // New int path.
                // Absolute URL path needed: integration files are in the same external_url domain.
                if (_wrs_int_conf_file.indexOf('/') == 0) {
                    _wrs_int_conf_file = _wrs_conf_path.split('/')[0] + '//' + _wrs_conf_path.split('/')[2] + _wrs_int_conf_file;
                }
                _wrs_int_path = wrs_intPath(_wrs_int_conf_file, _wrs_conf_path);
            }
            if (typeof _wrs_conf_hostPlatform != 'undefined' && _wrs_conf_hostPlatform == 'Moodle' && _wrs_conf_versionPlatform < 2013111800) {
                _wrs_int_editorIcon = _wrs_conf_path + 'icons/tinymce3/formula.png';
            } else {
                _wrs_int_editorIcon = _wrs_conf_path + 'icons/formula.png';
            }

            // Fix a Moodle 2.4 bug. data-mathml was lost without this.
            if (typeof _wrs_isMoodle24 !== 'undefined' && _wrs_isMoodle24){
                editor.settings.extended_valid_elements += ',img[*]';

                // Conflict between tinyMCE Moodle scriptLoader. Create a new one.
                // When multiple editors are loaded (an essay for example)
                // Moodle call scriptLoader multiple times. _wrs_addCoreQueue global variable avoid core multiple loading.
                if (!_wrs_addCoreQueue) {
                    var scriptLoader = new tinymce.dom.ScriptLoader();
                    scriptLoader.add(_wrs_conf_path + 'core/core.js?v=' + _wrs_plugin_version);
                    scriptLoader.loadQueue();
                    _wrs_addCoreQueue = true;
                }
            } else {
                if (!_wrs_addCoreQueue) {
                    tinymce.ScriptLoader.load(_wrs_conf_path + 'core/core.js?v=' + _wrs_plugin_version);
                    tinymce.ScriptLoader.loadQueue();
                    _wrs_addCoreQueue = true;
                }
            }

            editor.settings.extended_valid_elements += ",math[*],menclose[*],merror[*],mfenced[*],mfrac[*],mglyph[*],mi[*],mlabeledtr[*],mmultiscripts[*],mn[*],mo[*],mover[*],mpadded[*],mphantom[*],mroot[*],mrow[*],ms[*],mspace[*],msqrt[*],mstyle[*],msub[*],msubsup[*],msup[*],mtable[*],mtd[*],mtext[*],mtr[*],munder[*],munderover[*],semantics[*],maction[*]";
            editor.settings.extended_valid_elements += ",annotation[*]"; // LaTeX parse.

            var onInit = function (editor) {

                function whenDocReady() {
                    if (window.wrs_initParse && typeof _wrs_conf_plugin_loaded != 'undefined') {
                        var language = editor.getParam('language');
                        // The file editor.js gets this variable _wrs_int_langCode variable to set
                        // MathType for TinyMCE lang.
                        _wrs_int_langCode = language;
                        _wrs_int_directionality = editor.getParam('directionality');

                        if ('wiriseditorparameters' in editor.settings) {
                            _wrs_int_wirisProperties = editor.settings['wiriseditorparameters'];
                        } else {
                            _wrs_int_wirisProperties = {
                                'bgColor': editor.settings['wirisimagebgcolor'],
                                'symbolColor': editor.settings['wirisimagesymbolcolor'],
                                'transparency': editor.settings['wiristransparency'],
                                'fontSize': editor.settings['wirisimagefontsize'],
                                'numberColor': editor.settings['wirisimagenumbercolor'],
                                'identColor': editor.settings['wirisimageidentcolor'],
                                'color' : editor.settings['wirisimagecolor'],
                                'dpi' : editor.settings['wirisdpi'],
                                'backgroundColor' : editor.settings['wirisimagebackgroundcolor'],
                                'fontFamily' : editor.settings['wirisfontfamily']
                            };
                        }

                        if (editor.settings['wirisformulaeditorlang']) {
                            language = editor.settings['wirisformulaeditorlang'];
                        }

                        var content = editor.getContent();

                        // Bug fix: In Moodle2.x when TinyMCE is set to full screen
                        // the content doesn't need to be filtered.
                        if (!editor.getParam('fullscreen_is_enabled') && content !== ""){

                            // We set content in html because other tiny plugins need data-mce
                            // and this is not posibil with raw format
                            editor.setContent(wrs_initParse(content, language), {format: "html"});
                            // This clean undoQueue for prevent onChange and Dirty state.
                            editor.undoManager.clear();
                            // Init parsing OK. If a setContent method is called
                            // wrs_initParse is called again.
                            // Now if source code is edited the returned code is parsed.
                            _wrs_int_initParsed = true;
                        }

                        if (!editor.inline) {
                            element = editor.getContentAreaContainer().firstChild;
                            wrs_initParseImgToIframes(element.contentWindow);
                            wrs_addIframeEvents(element, function (iframe, element) {
                                wrs_int_doubleClickHandler(editor, iframe, true, element);
                            }, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
                            // Attaching obsevers to wiris images.
                            if (typeof wrs_observer != 'undefined') {
                                Array.prototype.forEach.call(element.contentDocument.getElementsByClassName(_wrs_conf_imageClassName), function(wirisImages){
                                    wrs_observer.observe(wirisImages, wrs_observer_config);
                                });
                            }
                        } else { // Inline.
                            element = editor.getElement();
                            wrs_addElementEvents(element, function (div, element) {
                                wrs_int_doubleClickHandler(editor, div, false, element);
                            },  wrs_int_mousedownHandler, wrs_int_mouseupHandler);
                            // Attaching observers to wiris images.
                            Array.prototype.forEach.call(document.getElementsByClassName(_wrs_conf_imageClassName), function(wirisImages) {
                                wrs_observer.observe(wirisImages, wrs_observer_config);
                            });
                        }

                    }
                    else {
                        setTimeout(whenDocReady, 50);
                    }
                }

                whenDocReady();
            }

            if ('onInit' in editor) {
                editor.onInit.add(onInit);
            }
            else {
                editor.on('init', function () {
                    onInit(editor);
                });
            }

            if ('onActivate' in editor) {
                editor.onActivate.add( function (editor) {
                    _wrs_currentEditor = editor;
                });
            }
            else {
                editor.on('focus', function (event) {
                    _wrs_currentEditor = tinymce.activeEditor;
                });
            }

            var onSave = function (editor, params) {
                if (typeof _wrs_conf_plugin_loaded !== 'undefined') {
                    var language = editor.getParam('language');
                    _wrs_int_directionality = editor.getParam('directionality');

                    if (editor.settings['wirisformulaeditorlang']) {
                        language = editor.settings['wirisformulaeditorlang'];
                    }

                    params.content = wrs_endParse(params.content, _wrs_int_wirisProperties, language);
                }
            }

            if ('onSaveContent' in editor) {
                editor.onSaveContent.add(onSave);
            }
            else {
                editor.on('saveContent', function (params) {
                    onSave(editor, params);
                });
            }

            if ('onGetContent' in editor) {
                editor.onGetContent.add(onSave);
            } else {
                editor.on('getContent', function(params) {
                    onSave(editor, params);
                });
            }

            if ('onBeforeSetContent' in editor) {
                editor.onBeforeSetContent.add(function(e,params) {
                    if (_wrs_int_initParsed) {
                        params.content = wrs_initParse(params.content, editor.getParam('language'));
                    }
                });
            } else {
                editor.on('beforeSetContent', function(params){
                    if (_wrs_int_initParsed) {
                        params.content = wrs_initParse(params.content, editor.getParam('language'));
                    }
                });
            }
            // We use a mutation to oberseve iframe of tiny and filter to remove data-mce
            const observerConfig = { attributes: true, childList: true, characterData: true, subtree: true };
            function onMutations(mutations) {
                Array.prototype.forEach.call(mutations,function(mutation) {
                    Array.prototype.forEach.call(mutation.addedNodes,function(node) {
                        // We search only in element nodes
                        if(node.nodeType == 1){
                            Array.prototype.forEach.call(node.getElementsByClassName(_wrs_conf_imageClassName),function(image) {
                                image.removeAttribute('data-mce-src');
                                image.removeAttribute('data-mce-style');
                            });
                        }
                    });
                });
            }
            var mutationInstance = new MutationObserver(onMutations);
            // We wait for iframe definition for observe this
            function waitForIframeBody() {
                if(typeof editor.contentDocument != 'undefined') {
                    mutationInstance.observe(editor.getBody(), observerConfig);
                }else{
                    setTimeout(waitForIframeBody, 50);
                }
            }
            waitForIframeBody();
            if (_wrs_int_conf_async || _wrs_conf_editorEnabled) {
                editor.addCommand('tiny_mce_wiris_openFormulaEditor', function () {
                    if ('wiriseditorparameters' in editor.settings) {
                        _wrs_int_wirisProperties = editor.settings['wiriseditorparameters'];
                    } else {
                        _wrs_int_wirisProperties = {
                            'bgColor': editor.settings['wirisimagebgcolor'],
                            'symbolColor': editor.settings['wirisimagesymbolcolor'],
                            'transparency': editor.settings['wiristransparency'],
                            'fontSize': editor.settings['wirisimagefontsize'],
                            'numberColor': editor.settings['wirisimagenumbercolor'],
                            'identColor': editor.settings['wirisimageidentcolor'],
                            'color' : editor.settings['wirisimagecolor'],
                            'dpi' : editor.settings['wirisdpi'],
                            'backgroundColor' : editor.settings['wirisimagebackgroundcolor'],
                            'fontFamily' : editor.settings['wirisfontfamily']
                        };
                    }

                    var language = editor.getParam('language');
                    _wrs_int_directionality = editor.getParam('directionality');

                    if (editor.settings['wirisformulaeditorlang']) {
                        language = editor.settings['wirisformulaeditorlang'];
                    }
                    wrs_int_disableCustomEditors();
                    wrs_int_openNewFormulaEditor(element, language, editor.inline ? false : true);
                });

                editor.addButton('tiny_mce_wiris_formulaEditor', {
                    title: 'Insert a math equation - MathType',
                    cmd: 'tiny_mce_wiris_openFormulaEditor',
                    image: _wrs_int_editorIcon
                });
            }

            // Dynamic customEditors buttons.
            for (var key in _wrs_int_customEditors) {
                if (_wrs_int_customEditors.hasOwnProperty(key)) {
                    if (_wrs_int_conf_async || window[_wrs_int_customEditors[key].confVariable]) {

                        var cmd = 'tiny_mce_wiris_openFormulaEditor' + _wrs_int_customEditors[key].name;
                        editor.addCommand(cmd, function () {
                            if ('wiriseditorparameters' in editor.settings) {
                                _wrs_int_wirisProperties = editor.settings['wiriseditorparameters'];
                            } else {
                                _wrs_int_wirisProperties = {
                                    'bgColor': editor.settings['wirisimagebgcolor'],
                                    'symbolColor': editor.settings['wirisimagesymbolcolor'],
                                    'transparency': editor.settings['wiristransparency'],
                                    'fontSize': editor.settings['wirisimagefontsize'],
                                    'numberColor': editor.settings['wirisimagenumbercolor'],
                                    'identColor': editor.settings['wirisimageidentcolor'],
                                    'color' : editor.settings['wirisimagecolor'],
                                    'dpi' : editor.settings['wirisdpi'],
                                    'backgroundColor' : editor.settings['wirisimagebackgroundcolor'],
                                    'fontFamily' : editor.settings['wirisfontfamily']
                                };
                            }

                            var language = editor.getParam('language');
                            _wrs_int_directionality = editor.getParam('directionality');

                            if (editor.settings['wirisformulaeditorlang']) {
                                language = editor.settings['wirisformulaeditorlang'];
                            }
                            wrs_int_enableCustomEditor(key);
                            wrs_int_openNewFormulaEditor(element, language, editor.inline ? false : true);
                        });

                        var imagePath;
                        if (typeof _wrs_conf_hostPlatform != 'undefined' && _wrs_conf_hostPlatform == 'Moodle' && _wrs_conf_versionPlatform < 2013111800) {
                            imagePath = _wrs_conf_path + 'icons/tinymce3/' + _wrs_int_customEditors[key].icon;
                        } else {
                            imagePath = _wrs_conf_path + 'icons/' + _wrs_int_customEditors[key].icon;
                        }

                        editor.addButton('tiny_mce_wiris_formulaEditor' + _wrs_int_customEditors[key].name, {
                            title:  _wrs_int_customEditors[key].tooltip,
                            cmd: cmd,
                            image: imagePath
                        });

                    }
                }
            }
        },

        // All versions.
        getInfo: function () {
            return {
                longname : 'tiny_mce_wiris',
                author : 'Maths for More',
                authorurl : 'http://www.wiris.com',
                infourl : 'http://www.wiris.com',
                version : '1.0'
            };
        }
    });

    tinymce.PluginManager.add('tiny_mce_wiris', tinymce.plugins.tiny_mce_wiris);
})();

function wrs_intPath(intFile, confPath) {
    var intPath = intFile.split("/");
    intPath.pop();
    intPath = intPath.join("/");
    intPath = intPath.indexOf("/") == 0 || intPath.indexOf("http") == 0 ? intPath : confPath + intPath;
    return intPath;
}

/**
 * Opens formula editor.
 * @param object element Target
 * @param string language
 * @param bool isIframe
 */
function wrs_int_openNewFormulaEditor(element, language, isIframe) {
    if (_wrs_int_window_opened && !_wrs_conf_modalWindow) {
        _wrs_int_window.focus();
    }
    else {
        _wrs_int_window_opened = true;
        _wrs_isNewElement = true;
        _wrs_int_temporalIframe = element;
        _wrs_int_temporalElementIsIframe = isIframe;
        _wrs_int_window = wrs_openEditorWindow(language, element, isIframe);
    }
}

/**
 * Handles a double click on the target.
 * @param object editor tinymce active editor
 * @param object target Target
 * @param object element Element double clicked
 * @param bool isIframe target is an iframe or not
 */
function wrs_int_doubleClickHandler(editor, target, isIframe, element) {
    // This loop allows the double clicking on the formulas represented with span's.

    while (!wrs_containsClass(element, 'Wirisformula') && element.parentNode) {
        element = element.parentNode;
    }

    var elementName = element.nodeName.toLowerCase();

    if (elementName == 'img' || elementName == 'iframe' || elementName == 'span') {
        if (wrs_containsClass(element, 'Wirisformula')) {
            if (customEditor = element.getAttribute('data-custom-editor')) {
                if (window[_wrs_int_customEditors[customEditor].confVariable]) {
                    wrs_int_enableCustomEditor(customEditor);
                }
            }
            if ('wiriseditorparameters' in editor.settings) {
                _wrs_int_wirisProperties = editor.settings['wiriseditorparameters'];
            } else {
                _wrs_int_wirisProperties = {
                    'bgColor': editor.settings['wirisimagebgcolor'],
                    'symbolColor': editor.settings['wirisimagesymbolcolor'],
                    'transparency': editor.settings['wiristransparency'],
                    'fontSize': editor.settings['wirisimagefontsize'],
                    'numberColor': editor.settings['wirisimagenumbercolor'],
                    'identColor': editor.settings['wirisimageidentcolor'],
                    'color' : editor.settings['wirisimagecolor'],
                    'dpi' : editor.settings['wirisdpi'],
                    'backgroundColor' : editor.settings['wirisimagebackgroundcolor'],
                    'fontFamily' : editor.settings['wirisfontfamily']
                };
            }

            if (!_wrs_int_window_opened || _wrs_conf_modalWindow) {
                var language = editor.settings.language;

                if (editor.settings['wirisformulaeditorlang']) {
                    language = editor.settings['wirisformulaeditorlang'];
                }

                _wrs_temporalImage = element;
                wrs_int_openExistingFormulaEditor(target, isIframe, language);
            }
            else {
                _wrs_int_window.focus();
            }
        }
    }
}

/**
 * Opens formula editor to edit an existing formula.
 * @param object element Target
 * @param bool isIframe
 */
function wrs_int_openExistingFormulaEditor(element, isIframe, language) {
    _wrs_int_window_opened = true;
    _wrs_isNewElement = false;
    _wrs_int_temporalIframe = element;
    _wrs_int_temporalElementIsIframe = isIframe;
    _wrs_int_window = wrs_openEditorWindow(language, element, isIframe);
}

/**
 * Handles a mouse down event on the iframe.
 * @param object iframe Target
 * @param object element Element mouse downed
 */
function wrs_int_mousedownHandler(iframe, element) {
    if (element.nodeName.toLowerCase() == 'img') {
        if (wrs_containsClass(element, 'Wirisformula')) {
            _wrs_int_temporalImageResizing = element;
        }
    }
}

/**
 * Handles a mouse up event on the iframe.
 */
function wrs_int_mouseupHandler() {
    if (_wrs_int_temporalImageResizing) {
        setTimeout(function () {
            wrs_fixAfterResize(_wrs_int_temporalImageResizing);
        }, 10);
    }
}

/**
 * Calls wrs_updateFormula with well params.
 * @param string mathml
 */
function wrs_int_updateFormula(mathml, editMode, language) {
    // Var _wrs_int_wirisProperties contains some js render params. Since mathml can support render params, js params should be send only to editor, not to render.
    if (_wrs_int_temporalElementIsIframe) {
        wrs_updateFormula(_wrs_int_temporalIframe.contentWindow, _wrs_int_temporalIframe.contentWindow, mathml, {}, editMode, language);
    }
    else {
        wrs_updateFormula(_wrs_int_temporalIframe, window, mathml, {}, editMode, language);
    }

    if (typeof tinymce.activeEditor.fire != 'undefined') {
        tinymce.activeEditor.fire('change');
        tinymce.activeEditor.fire('ExecCommand', {command: "wrs_int_updateFormula", value: mathml});
    }
}

/**
 * Handles window closing.
 */
function wrs_int_notifyWindowClosed() {
    _wrs_int_window_opened = false;
}
