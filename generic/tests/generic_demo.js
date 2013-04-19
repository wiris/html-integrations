// Configuration
var _wrs_conf_editorEnabled = true;		// Specifies if fomula editor is enabled
var _wrs_conf_CASEnabled = true;		// Specifies if WIRIS cas is enabled

var _wrs_conf_imageMathmlAttribute = 'data-mathml';	// Specifies the image tag where we should save the formula editor mathml code
var _wrs_conf_CASMathmlAttribute = 'alt';	// Specifies the image tag where we should save the WIRIS cas mathml code

var _wrs_conf_editorPath = (_wrs_config_relative?_wrs_currentPath:"") + _wrs_config_script + '/editor' + _wrs_config_extension;	// Specifies where is the editor HTML code (for popup window)
var _wrs_conf_editorAttributes = 'width=570, height=450, scroll=no, resizable=yes';							// Specifies formula editor window options.
var _wrs_conf_CASPath = (_wrs_config_relative?_wrs_currentPath:"") + _wrs_config_script + '/cas' + _wrs_config_extension;			// Specifies where is the WIRIS cas HTML code (for popup window)
var _wrs_conf_CASAttributes = 'width=640, height=480, scroll=no, resizable=yes';		// Specifies WIRIS cas window options

var _wrs_conf_createimagePath = (_wrs_config_relative?_wrs_currentPath:"") + _wrs_config_script + '/createimage' + _wrs_config_extension;			// Specifies where is createimage script
var _wrs_conf_createcasimagePath = (_wrs_config_relative?_wrs_currentPath:"") + _wrs_config_script + '/createcasimage' + _wrs_config_extension;	// Specifies where is createcasimage script

var _wrs_conf_getmathmlPath = (_wrs_config_relative?_wrs_currentPath:"") + _wrs_config_script + '/getmathml' + _wrs_config_extension;			// Specifies where is the getmathml script.
var _wrs_conf_servicePath = (_wrs_config_relative?_wrs_currentPath:"") + _wrs_config_script + '/service' + _wrs_config_extension;				// Specifies where is the service script.

var _wrs_conf_saveMode = 'xml';					// this value can be 'tags', 'xml' or 'safeXml'.
var _wrs_conf_parseModes = ['latex'];				// This value can contain 'latex'.

var _wrs_conf_enableAccessibility = true;

// Vars
var _wrs_int_editorIcon = (_wrs_config_relative?_wrs_currentPath:"") + 'core/icons/formula.gif';
var _wrs_int_CASIcon = (_wrs_config_relative?_wrs_currentPath:"") + 'core/icons/cas.gif';
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

// Plugin integration

/**
 * Inits the WIRIS plugin for this demo.
 * @param string target Textarea target ID.
 */
function wrs_int_init(target) {
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
		formulaButton.src = _wrs_int_editorIcon;
		formulaButton.style.cursor = 'pointer';
		
		wrs_addEvent(formulaButton, 'click', function () {
			wrs_int_openNewFormulaEditor(iframe, _wrs_int_language);
		});
		
		toolbar.appendChild(formulaButton);
	}
	
	if (_wrs_conf_CASEnabled) {
		var CASButton = document.createElement('img');
		CASButton.src = _wrs_int_CASIcon;
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
			_wrs_int_temporalImageResizing.removeAttribute('style');
			_wrs_int_temporalImageResizing.removeAttribute('width');
			_wrs_int_temporalImageResizing.removeAttribute('height');
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
