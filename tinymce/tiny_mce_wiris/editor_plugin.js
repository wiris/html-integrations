/* Including core.js */
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = tinymce.baseURL + '/plugins/tinyWIRIS/core/core.js';
document.getElementsByTagName('head')[0].appendChild(script);

/* Configuration */
var _wrs_conf_editorEnabled = true;		// Specifies if fomula editor is enabled
var _wrs_conf_CASEnabled = true;		// Specifies if WIRIS CAS is enabled

var _wrs_conf_imageMathmlAttribute = 'id';	// Specifies the image tag where we should save the formula editor mathml code
var _wrs_conf_CASMathmlAttribute = 'id';	// Specifies the image tag where we should save the WIRIS CAS mathml code

var _wrs_conf_editorPath = tinymce.baseURL + '/plugins/tinyWIRIS/integration/editor.php';						// Specifies where is the editor HTML code (for popup window)
var _wrs_conf_editorAttributes = 'width=500, height=400, scroll=no, resizable=yes';		// Specifies formula editor window options
var _wrs_conf_CASPath = tinymce.baseURL + '/plugins/tinyWIRIS/integration/cas.php';								// Specifies where is the WIRIS CAS HTML code (for popup window)
var _wrs_conf_CASAttributes = 'width=640, height=480, scroll=no, resizable=yes';		// Specifies WIRIS CAS window options

var _wrs_conf_createimagePath = tinymce.baseURL + '/plugins/tinyWIRIS/integration/createimage.php';			// Specifies where is createimage script
var _wrs_conf_createcasimagePath = tinymce.baseURL + '/plugins/tinyWIRIS/integration/createcasimage.php';	// Specifies where is createcasimage script

/* Vars */
var _wrs_int_editorIcon = tinymce.baseURL + '/plugins/tinyWIRIS/core/wiris-formula.gif';
var _wrs_int_CASIcon = tinymce.baseURL + '/plugins/tinyWIRIS/core/wiris-cas.gif';
var _wrs_int_temporalIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;

/* Plugin integration */
(function () {
	tinymce.create('tinymce.plugins.tinyWIRIS', {
		init: function (editor, url) {			
			var iframe;
			
			editor.onInit.add(function (editor) {
				iframe = editor.getContentAreaContainer().firstChild;
				wrs_addIframeEvents(iframe, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
			});
			
			if (_wrs_conf_editorEnabled) {
				editor.addCommand('tinyWIRIS_openFormulaEditor', function () {
					wrs_int_openNewFormulaEditor(iframe);
				});
			
				editor.addButton('tinyWIRIS_formulaEditor', {
					title: 'Formula Editor',
					cmd: 'tinyWIRIS_openFormulaEditor',
					image: url + '/core/wiris-formula.gif'
				});
			}
			
			if (_wrs_conf_CASEnabled) {
				editor.addCommand('tinyWIRIS_openCAS', function () {
					wrs_int_openNewCAS(iframe);
				});
			
				editor.addButton('tinyWIRIS_CAS', {
					title: 'WIRIS CAS',
					cmd: 'tinyWIRIS_openCAS',
					image: url + '/core/wiris-cas.gif'
				});
			}
		},

		getInfo: function () {
			return {
				longname : 'tinyWIRIS',
				author : 'Juan Lao Tebar - Maths for More',
				authorurl : 'http://www.wiris.com',
				infourl : 'http://www.mathsformore.com',
				version : '1.0'
			};
		}
	});

	tinymce.PluginManager.add('tinyWIRIS', tinymce.plugins.tinyWIRIS);
})();

/**
 * Fullscreen bug fix
 */
/*function wrs_int_fullscreen() {
	setTimeout(function () {
		if (_wrs_conf_editorEnabled) {
			var editorButton = wrs_int_addButton(document.getElementById('mce_fullscreen_toolbar1'), 'mce_fullscreen', true);
			wrs_int_addButtonEvents(editorButton, 'mce_fullscreen');
		}
		
		if (_wrs_conf_CASEnabled) {
			var CASButton = wrs_int_addButton(document.getElementById('mce_fullscreen_toolbar1'), 'mce_fullscreen', true, true);
			wrs_int_addButtonEvents(CASButton, 'mce_fullscreen', true);
		}
		
		var iframe = document.getElementById('mce_fullscreen_ifr');
		wrs_addIframeEvents(iframe, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
	}, 10);	// IE delay
}*/

/**
 * Opens formula editor.
 * @param string targetPrefix TinyMCE prefix
 */
function wrs_int_openNewFormulaEditor(iframe) {
	if (_wrs_int_window_opened) {
		_wrs_int_window.focus();
	}
	else {
		_wrs_int_window_opened = _wrs_isNewElement = true;
		_wrs_int_temporalIframe = iframe;
		_wrs_int_window = window.open(_wrs_conf_editorPath, 'WIRISFormulaEditor', _wrs_conf_editorAttributes);
	}
}

/**
 * Opens CAS.
 * @param string targetPrefix TinyMCE prefix
 */
function wrs_int_openNewCAS(iframe) {
	if (_wrs_int_window_opened) {
		_wrs_int_window.focus();
	}
	else {
		_wrs_int_window_opened = _wrs_isNewElement = true;
		_wrs_int_temporalIframe = iframe;
		_wrs_int_window = window.open(_wrs_conf_CASPath, 'WIRISCAS', _wrs_conf_CASAttributes);
	}
}

/**
 * Handles a double click on the iframe.
 * @param object iframe Target
 * @param object element Element double clicked
 */
function wrs_int_doubleClickHandler(iframe, element) {
	if (element.nodeName.toLowerCase() == 'img') {
		if (element.className == 'Wirisformula') {
			if (!_wrs_int_window_opened) {
				_wrs_temporalImage = element;
				wrs_int_openExistingFormulaEditor(iframe);
			}
			else {
				_wrs_int_window.focus();
			}
		}
		else if (element.className == 'Wiriscas') {
			if (!_wrs_int_window_opened) {
				_wrs_temporalImage = element;
				wrs_int_openExistingCAS(iframe);
			}
			else {
				_wrs_int_window.focus();
			}
		}
	}
}

/**
 * Opens formula editor to edit an existing formula.
 * @param string targetPrefix TinyMCE prefix
 */
function wrs_int_openExistingFormulaEditor(iframe) {
	_wrs_int_window_opened = true;
	_wrs_isNewElement = false;
	_wrs_int_temporalIframe = iframe;
	_wrs_int_window = window.open(_wrs_conf_editorPath, 'WIRISFormulaEditor', _wrs_conf_editorAttributes);
}

/**
 * Opens CAS to edit an existing formula.
 * @param string targetPrefix TinyMCE prefix
 */
function wrs_int_openExistingCAS(iframe) {
	_wrs_int_window_opened = true;
	_wrs_isNewElement = false;
	_wrs_int_temporalIframe = iframe;
	_wrs_int_window = window.open(_wrs_conf_CASPath, 'WIRISCAS', _wrs_conf_CASAttributes);
}

/**
 * Handles a mouse down event on the iframe.
 * @param object iframe Target
 * @param object element Element mouse downed
 */
function wrs_int_mousedownHandler(iframe, element) {
	if (element.nodeName.toLowerCase() == 'img') {
		if (element.className == 'Wirisformula' || element.className == 'Wiriscas') {
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
function wrs_int_updateFormula(mathml) {
	wrs_updateFormula(_wrs_int_temporalIframe, mathml);
}

/**
 * Calls wrs_updateCAS with well params.
 * @param string appletCode
 * @param string image
 * @param int width
 * @param int height
 */
function wrs_int_updateCAS(appletCode, image, width, height) {
	wrs_updateCAS(_wrs_int_temporalIframe, appletCode, image, width, height);
}

/**
 * Handles window closing.
 */
function wrs_int_notifyWindowClosed() {
	_wrs_int_window_opened = false;
}
