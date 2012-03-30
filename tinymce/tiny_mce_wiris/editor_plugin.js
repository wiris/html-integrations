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
var _wrs_conf_CASEnabled = @CAS_ENABLED@;		// Specifies if WIRIS cas is enabled.

var _wrs_conf_imageMathmlAttribute = '@IMAGE_MATHML_ATTRIBUTE@';	// Specifies the image tag where we should save the formula editor mathml code.
var _wrs_conf_CASMathmlAttribute = 'alt';	// Specifies the image tag where we should save the WIRIS cas mathml code.

var _wrs_conf_editorPath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/editor.php';				// Specifies where is the editor HTML code (for popup window).
var _wrs_conf_editorAttributes = 'width=@EDITOR_WINDOW_WIDTH@, height=@EDITOR_WINDOW_HEIGHT@, scroll=no, resizable=yes';							// Specifies formula editor window options.
var _wrs_conf_CASPath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/cas.php';					// Specifies where is the WIRIS cas HTML code (for popup window).
var _wrs_conf_CASAttributes = 'width=640, height=480, scroll=no, resizable=yes';										// Specifies WIRIS cas window options.

var _wrs_conf_createimagePath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/createimage.php';			// Specifies where is the createimage script.
var _wrs_conf_createcasimagePath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/createcasimage.php';		// Specifies where is the createcasimage script.

var _wrs_conf_getmathmlPath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/getmathml.php';			// Specifies where is the getmathml script.
var _wrs_conf_servicePath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/service.php';				// Specifies where is the service script.
var _wrs_conf_getconfigPath = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/integration/getconfig.php';			// Specifies from where it returns the configuration using AJAX

var _wrs_conf_saveMode = '@SAVE_MODE@';					// This value can be 'tags', 'xml' or 'safeXml'.
var _wrs_conf_parseModes = [@PARSE_LATEX@];				// This value can contain 'latex'.
var _wrs_conf_defaultEditMode = '@DEFAULT_EDIT_MODE@';				// This value can be 'images', 'latex' or 'iframes'.

var _wrs_conf_enableAccessibility = @ACCESSIBILITY_STATE@;

/* Vars */
var _wrs_int_editorIcon = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/core/icons/tiny_mce/formula.gif';
var _wrs_int_CASIcon = wrs_int_tinyManager.baseURL + '/plugins/tiny_mce_wiris/core/icons/tiny_mce/cas.gif';
var _wrs_int_temporalIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_wirisProperties;

/* Configuration loading */
var configuration = {};

if (_wrs_conf_getconfigPath.substr(_wrs_conf_getconfigPath.length - 4) == '.php') {
	var httpRequest;

	if (typeof XMLHttpRequest != 'undefined') {
		httpRequest = new XMLHttpRequest();
	}
	else {
		try {
			httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
		}
		catch (e) {
			try {
				httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
			}
			catch (oc) {
			}
		}
	}

	if (_wrs_conf_getconfigPath.substr(0, 1) == '/' || _wrs_conf_getconfigPath.substr(0, 7) == 'http://' || _wrs_conf_getconfigPath.substr(0, 8) == 'https://') {
		httpRequest.open('GET', _wrs_conf_getconfigPath, false);
	}
	else {
		httpRequest.open('GET', _wrs_currentPath + _wrs_conf_getconfigPath, false);
	}
	
	httpRequest.send(null);

	try {
		configuration = eval('(' + httpRequest.responseText + ')');
	}
	catch (e) {
	}
}

if (configuration.wirisparselatex == 'false') {
	var pos = _wrs_conf_parseModes.indexOf('latex');
	if (pos != -1){
		_wrs_conf_parseModes.splice(pos, 1);
	}
}else if (configuration.wirisparselatex == 'true') {
	var pos = _wrs_conf_parseModes.indexOf('latex');
	if (pos == -1){
		_wrs_conf_parseModes.push('latex');
	}
}
if ('wirisformulaeditoractive' in configuration) {
	_wrs_conf_editorEnabled = (configuration.wirisformulaeditoractive == 'true');
}
if ('wiriscasactive' in configuration) {
	_wrs_conf_CASEnabled = (configuration.wiriscasactive == 'true');
}

/* Plugin integration */
(function () {
	var plugin = {
		init: function (editor, url) {
			var iframe;
			
			editor.onInit.add(function (editor) {
				var textarea = editor.getElement();
				
				function whenDocReady() {
					if (window.wrs_initParse) {
						var language = editor.settings.language;
				
						if (editor.settings['wirisformulaeditorlang']) {
							language = editor.settings['wirisformulaeditorlang'];
						}
				
						editor.setContent(wrs_initParse(textarea.value, language));
						iframe = editor.getContentAreaContainer().firstChild;
						wrs_initParseImgToIframes(iframe.contentWindow);
						
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
				
				var language = editor.settings.language;
				
				if (editor.settings['wirisformulaeditorlang']) {
					language = editor.settings['wirisformulaeditorlang'];
				}
				
				params.content = wrs_endParse(params.content, _wrs_int_wirisProperties, language);
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

					var language = editor.settings.language;
					
					if (editor.settings['wirisformulaeditorlang']) {
						language = editor.settings['wirisformulaeditorlang'];
					}
					
					wrs_int_openNewFormulaEditor(iframe, language);
				});
			
				editor.addButton('tiny_mce_wiris_formulaEditor', {
					title: 'WIRIS editor',
					cmd: 'tiny_mce_wiris_openFormulaEditor',
					image: _wrs_int_editorIcon
				});
			}
			
			if (_wrs_conf_CASEnabled) {
				editor.addCommand('tiny_mce_wiris_openCAS', function () {
					var language = editor.settings.language;
				
					if (editor.settings['wirisformulaeditorlang']) {
						language = editor.settings['wirisformulaeditorlang'];
					}
					
					wrs_int_openNewCAS(iframe, language);
				});
			
				editor.addButton('tiny_mce_wiris_CAS', {
					title: 'WIRIS cas',
					cmd: 'tiny_mce_wiris_openCAS',
					image: _wrs_int_CASIcon
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
		_wrs_int_window = wrs_openEditorWindow(language, iframe, true);
	}
}

/**
 * Opens CAS.
 * @param object iframe Target
 * @param string language
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
function wrs_int_doubleClickHandler(editor, iframe, element) {
	var elementName = element.nodeName.toLowerCase();
	
	if (elementName == 'img' || elementName == 'iframe') {
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
				var language = editor.settings.language;
			
				if (editor.settings['wirisformulaeditorlang']) {
					language = editor.settings['wirisformulaeditorlang'];
				}
				
				_wrs_temporalImage = element;
				wrs_int_openExistingFormulaEditor(iframe, language);
			}
			else {
				_wrs_int_window.focus();
			}
		}
		else if (wrs_containsClass(element, 'Wiriscas')) {
			if (!_wrs_int_window_opened) {
				var language = editor.settings.language;
			
				if (editor.settings['wirisformulaeditorlang']) {
					language = editor.settings['wirisformulaeditorlang'];
				}
				
				_wrs_temporalImage = element;
				wrs_int_openExistingCAS(iframe, language);
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
 * @parma string language
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
function wrs_int_updateFormula(mathml, editMode, language) {
	wrs_updateFormula(_wrs_int_temporalIframe.contentWindow, _wrs_int_temporalIframe.contentWindow, mathml, _wrs_int_wirisProperties, editMode, language);
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
