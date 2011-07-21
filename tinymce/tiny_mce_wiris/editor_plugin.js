/* Enabling support for all tinyMCE versions */
var wrs_int_tinyManager = function () {};

wrs_int_tinyManager.baseURL = tinymce.baseURL;

wrs_int_tinyManager.addPlugin = function (pluginName, plugin) {
	tinymce.create('tinymce.plugins.' + pluginName, plugin);
	tinymce.PluginManager.add(pluginName, tinymce.plugins[pluginName]);
}

/* Including core.js */
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/core/core.js';
document.getElementsByTagName('head')[0].appendChild(script);

/* Configuration */
var _wrs_conf_editorEnabled = true;		// Specifies if fomula editor is enabled.
var _wrs_conf_CASEnabled = true;		// Specifies if WIRIS cas is enabled.

var _wrs_conf_imageMathmlAttribute = 'alt';	// Specifies the image tag where we should save the formula editor mathml code.
var _wrs_conf_CASMathmlAttribute = 'alt';	// Specifies the image tag where we should save the WIRIS cas mathml code.

var _wrs_conf_editorPath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/editor.php';				// Specifies where is the editor HTML code (for popup window).
var _wrs_conf_editorAttributes = 'width=500, height=400, scroll=no, resizable=yes';										// Specifies formula editor window options.
var _wrs_conf_CASPath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/cas.php';					// Specifies where is the WIRIS cas HTML code (for popup window).
var _wrs_conf_CASAttributes = 'width=640, height=480, scroll=no, resizable=yes';										// Specifies WIRIS cas window options.

var _wrs_conf_createimagePath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/createimage.php';			// Specifies where is the createimage script.
var _wrs_conf_createcasimagePath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/createcasimage.php';		// Specifies where is the createcasimage script.

var _wrs_conf_getmathmlPath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/getmathml.php';			// Specifies where is the getmathml script.
var _wrs_conf_getlatexPath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/getlatex.php';				// Specifies where is the getlatex script.

var _wrs_conf_editMode = ['images'];				// This value can contain 'images' and 'latex'.
var _wrs_conf_saveMode = 'tags';					// This value can be 'tags', 'xml' or 'safeXml'.

/* Vars */
var _wrs_int_editorIcon = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/core/wiris-formula.gif';
var _wrs_int_CASIcon = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/core/wiris-cas.gif';
var _wrs_int_temporalIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_wirisProperties;
var _wrs_int_language = 'en';

/* Plugin integration */
(function () {
	var plugin = {
		init: function (editor, url) {
			var iframe;
			
			editor.onInit.add(function (editor) {
				var textarea = editor.getElement();
				
				function whenDocReady() {
					if (window.wrs_initParse) {
						if (textarea.value == undefined) {
							textarea.value = wrs_initParse(editor.getContent());
						}
						else {
							textarea.value = wrs_initParse(textarea.value);
						}
						
						editor.load();
						iframe = editor.getContentAreaContainer().firstChild;
						
						wrs_addIframeEvents(iframe, function (iframe, element) {
							wrs_int_doubleClickHandler(editor, iframe, element);
						}, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
					}
					else {
						setTimeout(whenDocReady, 50);
					}
				}
				
				whenDocReady();
			});
			
			editor.onSaveContent.add(function (editor, params) {
				_wrs_int_wirisProperties = {
					'bgColor': editor.settings['wirisimagebgcolor'],
					'symbolColor': editor.settings['wirisimagesymbolcolor'],
					'transparency': editor.settings['wiristransparency'],
					'fontSize': editor.settings['wirisimagefontsize'],
					'numberColor': editor.settings['wirisimagenumbercolor'],
					'identColor': editor.settings['wirisimageidentcolor']
				};
				
				params.content = wrs_endParse(params.content);
			});
			
			if (_wrs_conf_editorEnabled) {
				editor.addCommand('tiny_mce_wiris_openFormulaEditor', function () {
					_wrs_int_wirisProperties = {
						'bgColor': editor.settings['wirisimagebgcolor'],
						'symbolColor': editor.settings['wirisimagesymbolcolor'],
						'transparency': editor.settings['wiristransparency'],
						'fontSize': editor.settings['wirisimagefontsize'],
						'numberColor': editor.settings['wirisimagenumbercolor'],
						'identColor': editor.settings['wirisimageidentcolor']
					};
					
					wrs_int_openNewFormulaEditor(iframe, editor.settings['wirisformulaeditorlang']);
				});
			
				editor.addButton('tiny_mce_wiris_formulaEditor', {
					title: 'WIRIS editor',
					cmd: 'tiny_mce_wiris_openFormulaEditor',
					image: url + '/core/wiris-formula.gif'
				});
			}
			
			if (_wrs_conf_CASEnabled) {
				editor.addCommand('tiny_mce_wiris_openCAS', function () {
					_wrs_int_language = editor.settings.language;
					wrs_int_openNewCAS(iframe);
				});
			
				editor.addButton('tiny_mce_wiris_CAS', {
					title: 'WIRIS cas',
					cmd: 'tiny_mce_wiris_openCAS',
					image: url + '/core/wiris-cas.gif'
				});
			}
		},
		
		// all versions
		getInfo: function () {
			return {
				longname : 'tiny_mce_wiris',
				author : 'Juan Lao Tebar - Maths for More',
				authorurl : 'http://www.wiris.com',
				infourl : 'http://www.mathsformore.com',
				version : '1.0'
			};
		}	
	};

	wrs_int_tinyManager.addPlugin('tiny_mce_wiris', plugin);
})();

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
		_wrs_int_window = wrs_openEditorWindow(language, iframe);
	}
}

/**
 * Opens CAS.
 * @param object iframe Target
 */
function wrs_int_openNewCAS(iframe) {
	if (_wrs_int_window_opened) {
		_wrs_int_window.focus();
	}
	else {
		_wrs_int_window_opened = true;
		_wrs_isNewElement = true;
		_wrs_int_temporalIframe = iframe;
		_wrs_int_window = wrs_openCASWindow(iframe);
	}
}

/**
 * Handles a double click on the iframe.
 * @param object iframe Target
 * @param object element Element double clicked
 */
function wrs_int_doubleClickHandler(editor, iframe, element) {
	if (element.nodeName.toLowerCase() == 'img') {
		if (wrs_containsClass(element, 'Wirisformula')) {
			_wrs_int_wirisProperties = {
				'bgColor': editor.settings['wirisimagebgcolor'],
				'symbolColor': editor.settings['wirisimagesymbolcolor'],
				'transparency': editor.settings['wiristransparency'],
				'fontSize': editor.settings['wirisimagefontsize'],
				'numberColor': editor.settings['wirisimagenumbercolor'],
				'identColor': editor.settings['wirisimageidentcolor']
			};
			
			if (!_wrs_int_window_opened) {
				_wrs_temporalImage = element;
				wrs_int_openExistingFormulaEditor(iframe, editor.settings['wirisformulaeditorlang']);
			}
			else {
				_wrs_int_window.focus();
			}
		}
		else if (wrs_containsClass(element, 'Wiriscas')) {
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
 * @param object iframe Target
 */
function wrs_int_openExistingFormulaEditor(iframe, language) {
	_wrs_int_window_opened = true;
	_wrs_isNewElement = false;
	_wrs_int_temporalIframe = iframe;
	_wrs_int_window = wrs_openEditorWindow(language);
}

/**
 * Opens CAS to edit an existing formula.
 * @param object iframe Target
 */
function wrs_int_openExistingCAS(iframe) {
	_wrs_int_window_opened = true;
	_wrs_isNewElement = false;
	_wrs_int_temporalIframe = iframe;
	_wrs_int_window = wrs_openCASWindow();
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
	wrs_updateFormula(_wrs_int_temporalIframe, mathml, _wrs_int_wirisProperties, editMode);
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
