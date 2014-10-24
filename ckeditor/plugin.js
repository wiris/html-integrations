// Define variables needed by core/core.js
var _wrs_int_conf_file = "@param.js.configuration.path@";
var _wrs_int_conf_async = false;

var _wrs_conf_path = CKEDITOR.basePath + '/plugins/ckeditor_wiris';

if (window._wrs_int_path == null) {
	window._wrs_int_path = _wrs_conf_path;
}


// Load configuration synchronously
if (!_wrs_int_conf_async) {
	var httpRequest = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
	var configUrl = _wrs_int_conf_file.indexOf("/")==0 || _wrs_int_conf_file.indexOf("http")==0 ? _wrs_int_conf_file : _wrs_conf_path + "/" + _wrs_int_conf_file;
	httpRequest.open('GET', configUrl, false);
	httpRequest.send(null);
	eval(httpRequest.responseText);
}

// Including core.js
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = _wrs_conf_path + '/core/core.js';
document.getElementsByTagName('head')[0].appendChild(script);

// Define variables needed at initialization time
// var _wrs_conf_editorEnabled = true;		// Specifies if formula editor is enabled.
// var _wrs_conf_CASEnabled = true;		// Specifies if WIRIS cas is enabled.

// Vars
var _wrs_int_editorIcon = CKEDITOR.basePath + '/plugins/ckeditor_wiris/core/icons/formula.gif';
var _wrs_int_CASIcon = CKEDITOR.basePath + '/plugins/ckeditor_wiris/core/icons/cas.gif';
var _wrs_int_temporalElement;
var _wrs_int_temporalElementIsIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_wirisProperties;
var _wrs_int_directionality;
var _wrs_int_disableDoubleClick = false;

// Plugin integration
CKEDITOR.plugins.add('ckeditor_wiris', {
	'init': function (editor) {
		var iframe;
		
		if (parseFloat(CKEDITOR.version) < 4.0){
			/*
			 * Fix for a bug in CKEditor 3.x when there is more than one editor in the same page
			 * It removes wiris element from config array when more than one is found
			 */
			var _wrs_toolbarName = 'toolbar_' + editor.config.toolbar;
			
			if (CKEDITOR.config[_wrs_toolbarName]) {
				var wirisButtonIncluded = false;
				
				for (var i = 0; i < CKEDITOR.config[_wrs_toolbarName].length; ++i) {
					if (CKEDITOR.config[_wrs_toolbarName][i].name == 'wiris') {
						if (!wirisButtonIncluded) {
							wirisButtonIncluded = true;
						}
						else {
							CKEDITOR.config[_wrs_toolbarName].splice(i, 1);
							i--;
						}
					}
				}
			}
		}
		
		_wrs_int_directionality = editor.config.contentsLangDirection;
		
		var lastDataSet = null;
		
		editor.on('dataReady', function (e) {
			lastDataSet = editor.getData();
		});
		
		editor.on('doubleclick', function (event) {
			if (event.data.element.$.nodeName.toLowerCase() == 'img' && wrs_containsClass(event.data.element.$, _wrs_conf_imageClassName) || wrs_containsClass(event.data.element.$, _wrs_conf_CASClassName)) {
				event.data.dialog = null;
			}
		});
		
		var element = null;
		
		function whenDocReady() {
			if (window.wrs_initParse && typeof _wrs_conf_configuration_loaded != 'undefined' && lastDataSet != null) { // WIRIS plugin core.js and configuration loaded properly
				editor.setData(wrs_initParse(lastDataSet), function () {
					var changingMode = false;
					
					editor.on('beforeSetMode', function (e) {
						changingMode = true;
					});
					
					editor.on('mode', function (e) {
						changingMode = false;
					});
					
					editor.on('getData', function (e) {
						if (changingMode) {
							return;
						}
						
						e.data.dataValue = wrs_endParse(e.data.dataValue);
					});
					
					function checkElement() {
						try {
							var newElement;
							
							if (editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
								newElement = editor.element.$;
							}
							else {
								var elem = document.getElementById('cke_contents_' + editor.name) ? document.getElementById('cke_contents_' + editor.name) : document.getElementById('cke_' + editor.name);
								newElement = elem.getElementsByTagName('iframe')[0];
							}
							
							if (!newElement.wirisActive) {
								if (editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
									wrs_addElementEvents(newElement, function (div, element, event) {
										wrs_int_doubleClickHandlerForDiv(editor, div, element, event);
									}, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
									
									newElement.wirisActive = true;
									element = newElement;
								}
								else if (newElement.contentWindow != null) {
									wrs_addIframeEvents(newElement, function (iframe, element, event) {
										wrs_int_doubleClickHandlerForIframe(editor, iframe, element, event);
									}, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
									
									newElement.wirisActive = true;
									element = newElement;
								}
							}
						}
						catch (e) {
						}
					}
					
					// CKEditor replaces several times the element element during its execution, so we must assign the events again.
					setInterval(checkElement, 500);
				});
			}
			else {
				setTimeout(whenDocReady, 50);
			}
		}
		
		whenDocReady();
		
		// editor command
		
		if (_wrs_conf_editorEnabled) {
			var allowedContent = 'img[align,' + _wrs_conf_imageMathmlAttribute + ',src,alt](!Wirisformula)';
			
			editor.addCommand('ckeditor_wiris_openFormulaEditor', {
				'async': false,
				'canUndo': true,
				'editorFocus': true,
				'allowedContent': allowedContent,
				'requiredContent': allowedContent,
				
				'exec': function (editor) {
					wrs_int_openNewFormulaEditor(element, editor.langCode, editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE);
				}
			});
			
			editor.ui.addButton('ckeditor_wiris_formulaEditor', {
				'label': 'WIRIS editor',
				'command': 'ckeditor_wiris_openFormulaEditor',
				'icon': _wrs_int_editorIcon
			});
			
			_wrs_int_wirisProperties = {};

			if ('wirisimagecolor' in editor.config) {
				_wrs_int_wirisProperties['color'] = editor.config['wirisimagecolor'];
			}			
			
			if ('wirisimagebgcolor' in editor.config) {
				_wrs_int_wirisProperties['bgColor'] = editor.config['wirisimagebgcolor'];
			}

			if ('wirisbackgroundcolor' in editor.config) {
				_wrs_int_wirisProperties['backgroundColor'] = editor.config['wirisbackgroundcolor'];
			}
			
			if ('wirisimagesymbolcolor' in editor.config) {
				_wrs_int_wirisProperties['symbolColor'] = editor.config['wirisimagesymbolcolor'];
			}

			if ('wirisimagenumbercolor' in editor.config) {
				_wrs_int_wirisProperties['numberColor'] = editor.config['wirisimagenumbercolor'];
			}

			if ('wirisimageidentcolor' in editor.config) {
				_wrs_int_wirisProperties['identColor'] = editor.config['wirisimageidentcolor'];
			}
			
			if ('wiristransparency' in editor.config) {
				_wrs_int_wirisProperties['transparency'] = editor.config['wiristransparency'];
			}
			
			if ('wirisimagefontsize' in editor.config) {
				_wrs_int_wirisProperties['fontSize'] = editor.config['wirisimagefontsize'];
			}

			if ('wirisdpi' in editor.config) {
				_wrs_int_wirisProperties['dpi'] = editor.config['wirisdpi'];
			}
		}
		
		// CAS command
		
		if (_wrs_conf_CASEnabled) {
			allowedContent = 'img[width,height,align,src,' + _wrs_conf_CASMathmlAttribute + '](!Wiriscas); ';
			allowedContent += 'applet[width,height,align,code,archive,codebase,alt,src](!Wiriscas); ';
			allowedContent += 'param[name,value]';
			
			editor.addCommand('ckeditor_wiris_openCAS', {
				'async': false,								// The command need some time to complete after exec function returns.
				'canUndo': true,
				'editorFocus': true,
				'allowedContent': allowedContent,
				'requiredContent': allowedContent,
				
				'exec': function (editor) {
					wrs_int_openNewCAS(element, editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE, editor.langCode);
				}
			});
			
			editor.ui.addButton('ckeditor_wiris_CAS', {
				'label': 'WIRIS cas',
				'command': 'ckeditor_wiris_openCAS',
				'icon': _wrs_int_CASIcon
			});
		}
	}
})

/**
 * Opens formula editor.
 * @param object element Target
 */
function wrs_int_openNewFormulaEditor(element, language, isIframe) {
	if (_wrs_int_window_opened) {
		_wrs_int_window.focus();
	}
	else {
		_wrs_int_window_opened = true;
		_wrs_isNewElement = true;
		_wrs_int_temporalElement = element;
		_wrs_int_temporalElementIsIframe = isIframe;
		_wrs_int_window = wrs_openEditorWindow(language, element, isIframe);
	}
}

/**
 * Opens CAS.
 * @param object element Target
 */
function wrs_int_openNewCAS(element, isIframe, language) {
	if (_wrs_int_window_opened) {
		_wrs_int_window.focus();
	}
	else {
		_wrs_int_window_opened = true;
		_wrs_isNewElement = true;
		_wrs_int_temporalElement = element;
		_wrs_int_temporalElementIsIframe = isIframe;
		_wrs_int_window = wrs_openCASWindow(element, isIframe, language);
	}
}

/**
 * Handles a double click on the contentEditable div.
 * @param object div Target
 * @param object element Element double clicked
 */
function wrs_int_doubleClickHandlerForDiv(editor, div, element, event) {
	wrs_int_doubleClickHandler(editor, div, false, element, event);
}

/**
 * Handles a double click on the iframe.
 * @param object div Target
 * @param object element Element double clicked
 */
function wrs_int_doubleClickHandlerForIframe(editor, iframe, element, event) {
	wrs_int_doubleClickHandler(editor, iframe, true, element, event);
}

/**
 * Handles a double click.
 * @param object target Target
 * @param object element Element double clicked
 */
function wrs_int_doubleClickHandler(editor, target, isIframe, element, event) {
	if (element.nodeName.toLowerCase() == 'img') {
		if (wrs_containsClass(element, _wrs_conf_imageClassName)) {
			if (!_wrs_int_window_opened) {
				_wrs_temporalImage = element;
				wrs_int_openExistingFormulaEditor(target, isIframe, editor.langCode);
			}
			else {
				_wrs_int_window.focus();
			}
		}
		else if (wrs_containsClass(element, _wrs_conf_CASClassName)) {
			if (!_wrs_int_window_opened) {
				_wrs_temporalImage = element;
				wrs_int_openExistingCAS(target, isIframe, editor.langCode);
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
 * @param boolean isIframe
 */
function wrs_int_openExistingFormulaEditor(element, isIframe, language) {
	_wrs_int_window_opened = true;
	_wrs_isNewElement = false;
	_wrs_int_temporalElement = element;
	_wrs_int_temporalElementIsIframe = isIframe;
	_wrs_int_window = wrs_openEditorWindow(language, element, isIframe);
}

/**
 * Opens CAS to edit an existing formula.
 * @param object iframe Target
 */
function wrs_int_openExistingCAS(element, isIframe, language) {
	_wrs_int_window_opened = true;
	_wrs_isNewElement = false;
	_wrs_int_temporalElement = element;
	_wrs_int_temporalElementIsIframe = isIframe;
	_wrs_int_window = wrs_openCASWindow(element, isIframe, language);
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
	if (_wrs_int_temporalElementIsIframe) {
		wrs_updateFormula(_wrs_int_temporalElement.contentWindow, _wrs_int_temporalElement.contentWindow, mathml, _wrs_int_wirisProperties, editMode, language);
	}
	else {
		wrs_updateFormula(_wrs_int_temporalElement, window, mathml, _wrs_int_wirisProperties, editMode, language);
	}
}

/**
 * Calls wrs_updateCAS with well params.
 * @param string appletCode
 * @param string image
 * @param int width
 * @param int height
 */
function wrs_int_updateCAS(appletCode, image, width, height) {
	if (_wrs_int_temporalElementIsIframe) {
		wrs_updateCAS(_wrs_int_temporalElement.contentWindow, _wrs_int_temporalElement.contentWindow, appletCode, image, width, height);
	}
	else {
		wrs_updateCAS(_wrs_int_temporalElement, window, appletCode, image, width, height);
	}
}

/**
 * Handles window closing.
 */
function wrs_int_notifyWindowClosed() {
	_wrs_int_window_opened = false;
}
