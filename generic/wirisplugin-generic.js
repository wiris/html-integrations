// Configuration
var _wrs_int_conf_file = "@param.js.configuration.path@";
var _wrs_int_conf_async = true;

// Stats editor (needed by core/editor.js)
var _wrs_conf_editor = "GenericHTML";

// Get _wrs_conf_path (plugin URL)
var col = document.getElementsByTagName("script");
var scriptName = "wirisplugin-generic.js";
for (i=0;i<col.length;i++) {
	j = col[i].src.lastIndexOf(scriptName);
	if (j >= 0) baseURL = col[i].src.substr(0, j - 1);
}
_wrs_conf_path = baseURL; //  + "/..";

if (_wrs_int_conf_file.indexOf("@")==0 && typeof _wrs_int_conf_file_override != 'undefined') {
	// _wrs_int_conf_file_override is defined only for testing
	_wrs_int_conf_file = _wrs_int_conf_file_override;
}


var _wrs_int_path = _wrs_int_conf_file.split("/");
_wrs_int_path.pop();
_wrs_int_path = _wrs_int_path.join("/");
_wrs_int_path =  _wrs_int_path.indexOf("/")==0 || _wrs_int_path.indexOf("http")==0 ? _wrs_int_path : _wrs_conf_path + "/" + _wrs_int_path;

// Load configuration synchronously
if (!_wrs_int_conf_async) {
	var httpRequest = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
	var configUrl = _wrs_int_conf_file.indexOf("/")==0 || _wrs_int_conf_file.indexOf("http")==0 ? _wrs_int_conf_file : _wrs_conf_path + "/" + _wrs_int_conf_file;
	httpRequest.open('GET', configUrl, false);
	httpRequest.send(null);
	eval(httpRequest.responseText);
}

var _wrs_int_editorIcon = '/core/icons/formula.gif';
var _wrs_int_CASIcon = '/core/icons/cas.gif';
var _wrs_int_temporalIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_language;
var _wrs_int_directionality = '';
// Custom Editors: 
var _wrs_int_customEditors = {chemistry : {name: 'Chemistry', toolbar : 'chemistry', icon : 'chem.gif', enabled : false, confVariable : '_wrs_conf_chemEnabled'}}

if (navigator.userLanguage) {
	_wrs_int_language = navigator.userLanguage;
}
else if (navigator.language) {
	_wrs_int_language = navigator.language.substring(0, 2);
}
else {
	_wrs_int_language = 'en';
}

// Including core.js
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = _wrs_conf_path + '/core/core.js';
document.getElementsByTagName('head')[0].appendChild(script);

// Load configuration synchronously
if (!_wrs_int_conf_async) {
	var httpRequest = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest():new ActiveXObject('Msxml2.XMLHTTP');
	var configUrl = _wrs_int_conf_file.indexOf("/")==0 || _wrs_int_conf_file.indexOf("http")==0 ? _wrs_int_conf_file : _wrs_conf_path + "/" + _wrs_int_conf_file;
	httpRequest.open('GET', configUrl, false);
	httpRequest.send(null);
	eval(httpRequest.responseText);
}

// Plugin integration

/**
 * Inits the WIRIS plugin for this demo.
 * @param iframe editable iframe
 * @param toolbar HTML element where icons will be inserted
 */
function wrs_int_init(target,toolbar) {
	wrs_int_init0 = function() {
		if (typeof _wrs_conf_plugin_loaded == 'undefined') {
			setTimeout(wrs_int_init0,100);
		} else {
			wrs_int_init_handler(target,toolbar);
		}
	}
	wrs_int_init0();
}

function wrs_int_init_handler(target,toolbar) {
	/* Assigning events to the WYSIWYG editor */
	wrs_addIframeEvents(target, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);

	/* Parsing input text */
	target.contentWindow.document.body.innerHTML = wrs_initParse(target.contentWindow.document.body.innerHTML);

	/* Creating toolbar buttons */
	if (toolbar != null) {

		if (_wrs_conf_editorEnabled) {
			var formulaButton = document.createElement('img');
			formulaButton.id = "editorIcon";
			formulaButton.src = _wrs_conf_path + _wrs_int_editorIcon;
			formulaButton.style.cursor = 'pointer';
			
			wrs_addEvent(formulaButton, 'click', function () {
				wrs_int_openNewFormulaEditor(target, _wrs_int_language);
			});
			
			toolbar.appendChild(formulaButton);
		}
		
		if (_wrs_conf_CASEnabled) {
			var CASButton = document.createElement('img');
			CASButton.src = _wrs_conf_path + _wrs_int_CASIcon;
			CASButton.id = "casIcon";
			CASButton.style.cursor = 'pointer';
			
			wrs_addEvent(CASButton, 'click', function () {
				wrs_int_openNewCAS(target, _wrs_int_language);
			});
			
			toolbar.appendChild(CASButton);
		}

		// Dynamic customEditors buttons.
		for (var key in _wrs_int_customEditors) {
			if (_wrs_int_customEditors.hasOwnProperty(key)) {
				if (window[_wrs_int_customEditors[key].confVariable]) {
					var customEditorButton = document.createElement('img');
					customEditorButton.src = _wrs_conf_path + '/core/icons/' + _wrs_int_customEditors[key].icon;
					customEditorButton.id = key + "Icon";
					customEditorButton.style.cursor = 'pointer';

					wrs_addEvent(customEditorButton, 'click', function () {
						wrs_int_enableCustomEditor(key);
						wrs_int_openNewFormulaEditor(target, _wrs_int_language);
					});

					toolbar.appendChild(customEditorButton);
				}
			}
		}
	}
}


/**
 * Opens formula editor.
 * @param object iframe Target
 */
function wrs_int_openNewFormulaEditor(iframe, language) {
	if (_wrs_int_window_opened) {
		_wrs_int_window.focus();
	}
	else {
		_wrs_int_window_opened = true;
		_wrs_isNewElement = true;
		_wrs_int_temporalIframe = iframe;
		_wrs_int_window = wrs_openEditorWindow(language, iframe, true);
	}
}

/**
 * Opens CAS.
 * @param object iframe Target
 */
function wrs_int_openNewCAS(iframe, language) {
	if (_wrs_int_window_opened) {
		_wrs_int_window.focus();
	}
	else {
		_wrs_int_window_opened = true;
		_wrs_isNewElement = true;
		_wrs_int_temporalIframe = iframe;
		_wrs_int_window = wrs_openCASWindow(iframe, true, language);
	}
}

/**
 * Handles a double click on the iframe.
 * @param object iframe Target
 * @param object element Element double clicked
 */
function wrs_int_doubleClickHandler(iframe, element) {
	if (element.nodeName.toLowerCase() == 'img') {
		if (customEditor = element.getAttribute('data-custom-editor')) {
			wrs_int_enableCustomEditor(customEditor);
		}
		if (wrs_containsClass(element, 'Wirisformula')) {
			if (!_wrs_int_window_opened) {
				_wrs_temporalImage = element;
				wrs_int_openExistingFormulaEditor(iframe, _wrs_int_language);
			}
			else {
				_wrs_int_window.focus();
			}
		}
		else if (wrs_containsClass(element, 'Wiriscas')) {
			if (!_wrs_int_window_opened) {
				_wrs_temporalImage = element;
				wrs_int_openExistingCAS(iframe, _wrs_int_language);
			}
			else {
				_wrs_int_window.focus();
			}
		}
	}
}

/**
 * Opens formula editor to edit an existing formula.
 * @param object iframe Target
 */
function wrs_int_openExistingFormulaEditor(iframe, language) {
	_wrs_int_window_opened = true;
	_wrs_isNewElement = false;
	_wrs_int_temporalIframe = iframe;
	_wrs_int_window = wrs_openEditorWindow(language, iframe, true);
}

/**
 * Opens CAS to edit an existing formula.
 * @param object iframe Target
 */
function wrs_int_openExistingCAS(iframe, language) {
	_wrs_int_window_opened = true;
	_wrs_isNewElement = false;
	_wrs_int_temporalIframe = iframe;
	_wrs_int_window = wrs_openCASWindow(iframe, true, language);
}

/**
 * Handles a mouse down event on the iframe.
 * @param object iframe Target
 * @param object element Element mouse downed
 */
function wrs_int_mousedownHandler(iframe, element) {
	if (element.nodeName.toLowerCase() == 'img') {
		if (wrs_containsClass(element, 'Wirisformula') || wrs_containsClass(element, 'Wiriscas')) {
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
function wrs_int_updateFormula(mathml, editMode) {
	wrs_updateFormula(_wrs_int_temporalIframe.contentWindow, _wrs_int_temporalIframe.contentWindow, mathml, null, editMode);
}

/**
 * Calls wrs_updateCAS with well params.
 * @param string appletCode
 * @param string image
 * @param int width
 * @param int height
 */
function wrs_int_updateCAS(appletCode, image, width, height) {
	wrs_updateCAS(_wrs_int_temporalIframe.contentWindow, _wrs_int_temporalIframe.contentWindow, appletCode, image, width, height);
}

/**
 * Handles window closing.
 */
function wrs_int_notifyWindowClosed() {
	_wrs_int_window_opened = false;
}

/**
 * Get custom active editor
 */
function wrs_int_getCustomEditorEnabled() {
	var customEditorEnabled = null;
	Object.keys(_wrs_int_customEditors).forEach(function(key) {		
			if (_wrs_int_customEditors[key].enabled) {
				customEditorEnabled = _wrs_int_customEditors[key]
			}
	});

	return customEditorEnabled;	
}

/**
 * Disable all custom editors
 */
function wrs_int_disableCustomEditors(){
	Object.keys(_wrs_int_customEditors).forEach(function(key) {
			_wrs_int_customEditors[key].enabled = false;								
	}); 
}

/**
 * Enable a custom editor
 * @param string editor
 */
function wrs_int_enableCustomEditor(editor) {
	// Only one custom editor enabled at the same time.
	wrs_int_disableCustomEditors();
	if (_wrs_int_customEditors[editor]) {
		_wrs_int_customEditors[editor].enabled = true;
	}
}
