/* Enabling support for all tinyMCE versions */
var wrs_int_tinyManager = function () {};

if (!window.tinymce) {
	wrs_int_tinyManager.baseURL = tinyMCE.baseURL;
	wrs_int_tinyManager.addPlugin = function (pluginName, plugin) {
		tinyMCE.addPlugin(pluginName, plugin);
	}
}
else {
	wrs_int_tinyManager.baseURL = tinymce.baseURL;
	wrs_int_tinyManager.addPlugin = function (pluginName, plugin) {
		tinymce.create('tinymce.plugins.' + pluginName, plugin);
		tinymce.PluginManager.add(pluginName, tinymce.plugins[pluginName]);
	}
}

/* Including core.js */
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = wrs_int_tinyManager.baseURL + '/plugins/tinyWIRIS/core/core.js';
document.getElementsByTagName('head')[0].appendChild(script);

/* Configuration */
var _wrs_conf_editorEnabled = true;		// Specifies if fomula editor is enabled
var _wrs_conf_CASEnabled = true;		// Specifies if WIRIS CAS is enabled

var _wrs_conf_imageMathmlAttribute = 'alt';	// Specifies the image tag where we should save the formula editor mathml code
var _wrs_conf_CASMathmlAttribute = 'alt';	// Specifies the image tag where we should save the WIRIS CAS mathml code

var _wrs_conf_editorPath = wrs_int_tinyManager.baseURL + '/plugins/tinyWIRIS/integration/editor.php';			// Specifies where is the editor HTML code (for popup window)
var _wrs_conf_editorAttributes = 'width=500, height=400, scroll=no, resizable=yes';								// Specifies formula editor window options
var _wrs_conf_CASPath = wrs_int_tinyManager.baseURL + '/plugins/tinyWIRIS/integration/cas.php';					// Specifies where is the WIRIS CAS HTML code (for popup window)
var _wrs_conf_CASAttributes = 'width=640, height=480, scroll=no, resizable=yes';								// Specifies WIRIS CAS window options

var _wrs_conf_createimagePath = wrs_int_tinyManager.baseURL + '/plugins/tinyWIRIS/integration/createimage.php';			// Specifies where is createimage script
var _wrs_conf_createcasimagePath = wrs_int_tinyManager.baseURL + '/plugins/tinyWIRIS/integration/createcasimage.php';	// Specifies where is createcasimage script

/* Vars */
var _wrs_int_editorIcon = wrs_int_tinyManager.baseURL + '/plugins/tinyWIRIS/core/wiris-formula.gif';
var _wrs_int_CASIcon = wrs_int_tinyManager.baseURL + '/plugins/tinyWIRIS/core/wiris-cas.gif';
var _wrs_int_temporalIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;

/* Plugin integration */
(function () {
	var plugin = {
		// old versions
		initInstance : function (editor) {
			if (!editor.tinyWIRISApplied) {
				editor.tinyWIRISApplied = true;
				editor.oldTargetElement.value = wrs_initParse(editor.oldTargetElement.value);
				wrs_addIframeEvents(editor.iframeElement, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
			}
		},
	
		// new versions
		init: function (editor, url) {
			var iframe;
			
			editor.onInit.add(function (editor) {
				var textarea = editor.getElement();
				textarea.value = wrs_initParse(textarea.value);
				editor.load();

				iframe = editor.getContentAreaContainer().firstChild;
				wrs_addIframeEvents(iframe, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
			});
			
			editor.onSaveContent.add(function (editor, params) {
				params.content = wrs_endParse(params.content);
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
		
		// old versions
		getControlHTML : function (buttonName) {
			if (buttonName == 'tinyWIRIS_formulaEditor') {
				return tinyMCE.getButtonHTML(buttonName, 'Formula Editor', '{$pluginurl}/core/wiris-formula.gif', 'tinyWIRIS_openFormulaEditor');
			}
			
			if (buttonName == 'tinyWIRIS_CAS') {
				return tinyMCE.getButtonHTML(buttonName, 'WIRIS CAS', '{$pluginurl}/core/wiris-cas.gif', 'tinyWIRIS_openCAS');
			}
			
			return '';
		},
		
		// old versions
		execCommand : function (editor_id, element, command, user_interface, value) {
			if (command == 'tinyWIRIS_openFormulaEditor') {
				var iframe = tinyMCE.getInstanceById(editor_id).iframeElement;
				wrs_int_openNewFormulaEditor(iframe);
			}
			else if (command == 'tinyWIRIS_openCAS') {
				var iframe = tinyMCE.getInstanceById(editor_id).iframeElement;
				wrs_int_openNewCAS(iframe);
			}
		},

		// all versions
		getInfo: function () {
			return {
				longname : 'tinyWIRIS',
				author : 'Juan Lao Tebar - Maths for More',
				authorurl : 'http://www.wiris.com',
				infourl : 'http://www.mathsformore.com',
				version : '1.0'
			};
		}	
	};

	wrs_int_tinyManager.addPlugin('tinyWIRIS', plugin);
})();

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
