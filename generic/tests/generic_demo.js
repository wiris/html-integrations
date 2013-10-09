// Configuration
var _wrs_int_conf_async = true;
var _wrs_int_editorIcon = '/core/icons/formula.gif';
var _wrs_int_CASIcon = '/core/icons/cas.gif';
var _wrs_int_temporalIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_language;
var _wrs_int_directionality = '';


if (navigator.userLanguage) {
	_wrs_int_language = navigator.userLanguage;
}
else if (navigator.language) {
	_wrs_int_language = navigator.language.substring(0, 2);
}
else {
	_wrs_int_language = 'en';
}

// Get _wrs_conf_path (plugin URL)
var col = document.getElementsByTagName("script");
var scriptName = "generic_demo.js";
for (i=0;i<col.length;i++) {
	j = col[i].src.lastIndexOf(scriptName);
	if (j >= 0) baseURL = col[i].src.substr(0, j - 1);
}
_wrs_conf_path = baseURL + "/..";

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
 * @param string target Textarea target ID.
 */
function wrs_int_init(target) {
	wrs_int_init0 = function() {
		if (typeof _wrs_conf_core_loaded == 'undefined') {
			setTimeout(wrs_int_init0,100);
		} else {
			wrs_int_init_handler(target);
		}
	}
	wrs_int_init0();
}

function wrs_int_init_handler(target) {
	/* Assigning events to the WYSIWYG editor */
	var iframe = document.getElementById(target + '_iframe');
	wrs_addIframeEvents(iframe, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
	
	/* Parsing input text */
	var textarea = document.getElementById(target);
	iframe.contentWindow.document.body.innerHTML = wrs_initParse(textarea.value);
	
	/* Creating an event for parse the output text */
	var form = textarea.form;
	
	wrs_addEvent(form, 'submit', function (e) {
		// In our case the plugin is who sets the textarea content. And it takes the opportunity to apply the final parser.
		textarea.value = wrs_endParse(iframe.contentWindow.document.body.innerHTML);
	});
	
	/* Creating toolbar buttons */
	var toolbar = document.getElementById(target + '_toolbar');
	
	if (_wrs_conf_editorEnabled) {
		var formulaButton = document.createElement('img');
		formulaButton.src = _wrs_conf_path + _wrs_int_editorIcon;
		formulaButton.style.cursor = 'pointer';
		
		wrs_addEvent(formulaButton, 'click', function () {
			wrs_int_openNewFormulaEditor(iframe, _wrs_int_language);
		});
		
		toolbar.appendChild(formulaButton);
	}
	
	if (_wrs_conf_CASEnabled) {
		var CASButton = document.createElement('img');
		CASButton.src = _wrs_conf_path + _wrs_int_CASIcon;
		CASButton.style.cursor = 'pointer';
		
		wrs_addEvent(CASButton, 'click', function () {
			wrs_int_openNewCAS(iframe, _wrs_int_language);
		});
		
		toolbar.appendChild(CASButton);
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
