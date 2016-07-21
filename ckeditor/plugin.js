// Define variables needed by core/core.js
var _wrs_int_conf_file;
// Searching wiriscontextpath on CKEditor config.
var _wrs_cont_contextPath = CKEDITOR.config.wiriscontextpath;
for(var id in CKEDITOR.instances) {
		if (CKEDITOR.instances[id].config.wiriscontextpath) _wrs_cont_contextPath = CKEDITOR.instances[id].config.wiriscontextpath
}
_wrs_int_conf_file = (_wrs_cont_contextPath) ? _wrs_cont_contextPath + "@param.js.configuration.path@" : "@param.js.configuration.path@";



// Check if the synchronous request has a 200 status.
var _wrs_int_conf_file_loaded = false;

var _wrs_int_conf_async = false;

var _wrs_conf_path = CKEDITOR.plugins.getPath('ckeditor_wiris');

// Stats editor (needed by core/editor.js)
var _wrs_conf_editor = "CKEditor4";

var _wrs_int_path = _wrs_int_conf_file.split("/");
_wrs_int_path.pop();
_wrs_int_path = _wrs_int_path.join("/");
_wrs_int_path =  _wrs_int_path.indexOf("/")==0 || _wrs_int_path.indexOf("http")==0 ? _wrs_int_path : _wrs_conf_path + _wrs_int_path;

// Load configuration synchronously
if (!_wrs_int_conf_async) {
	var httpRequest = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
	var configUrl = _wrs_int_conf_file.indexOf("/")==0 || _wrs_int_conf_file.indexOf("http")==0 ? _wrs_int_conf_file : _wrs_conf_path +  _wrs_int_conf_file;
	httpRequest.open('GET', configUrl, false);
	httpRequest.send(null);
	
	if (httpRequest.status == 200) {
		eval(httpRequest.responseText);
		_wrs_int_conf_file_loaded = true;
	}
}

// Including core.js
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = CKEDITOR.plugins.getPath('ckeditor_wiris') + './core/core.js';
document.getElementsByTagName('head')[0].appendChild(script);

// Define variables needed at initialization time
// var _wrs_conf_editorEnabled = true;		// Specifies if formula editor is enabled.
// var _wrs_conf_CASEnabled = true;		// Specifies if WIRIS cas is enabled.

// Vars
var _wrs_int_editorIcon = CKEDITOR.plugins.getPath('ckeditor_wiris') + './icons/formula.png';
var _wrs_int_CASIcon = CKEDITOR.plugins.getPath('ckeditor_wiris') + './icons/cas.png';
var _wrs_int_temporalElement;
var _wrs_int_temporalElementIsIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_wirisProperties;
var _wrs_int_directionality;
var _wrs_int_disableDoubleClick = false;
// Custom Editors: 
var _wrs_int_customEditors = {chemistry : {name: 'Chemistry', toolbar : 'chemistry', icon : 'chem.png', enabled : false, confVariable : '_wrs_conf_chemEnabled'}}

// Plugin integration
CKEDITOR.plugins.add('ckeditor_wiris', {
	'init': function (editor) {
		// Synchronous request failed, avoid 
		// CKEDITOR loading fails.
		if (! _wrs_int_conf_file_loaded) {
			return;
		}
		// Current editor 
		// This global variable will be use only on non modal window mode.
		if (!_wrs_conf_modalWindow) {			
			for(var id in CKEDITOR.instances) {
			  CKEDITOR.instances[id].on('focus', function(e) {
			    // Fill some ugly global var here
			    window._wrs_currentEditor = e.editor;
			});
			}
		}

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
	
		// If wirislistenerdisabled=true all listeners should be disabled.
		// If this happens user should use wrs_initParse() and wrs_endParse() method
		if (typeof editor.config.wirislistenersdisabled == 'undefined' || !editor.config.wirislistenersdisabled) {

			editor.on('dataReady', function (e) {
				lastDataSet = editor.getData();
			});
		} else {
			lastDataSet = editor.getData();
		}
		
		editor.on('doubleclick', function (event) {
			if (event.data.element.$.nodeName.toLowerCase() == 'img' && wrs_containsClass(event.data.element.$, _wrs_conf_imageClassName) || wrs_containsClass(event.data.element.$, _wrs_conf_CASClassName)) {
				event.data.dialog = null;
			}
		});
		
		var element = null;
		// Avoid WIRIS images to be upcasted.
		if (typeof editor.widgets != 'undefined') {
			editor.widgets.addUpcastCallback( function( element ) {
			    if ( element.name == 'img' && element.hasClass(_wrs_conf_imageClassName) )
			        return false;
			} );
		}
		function whenDocReady() {
			if (window.wrs_initParse && typeof _wrs_conf_configuration_loaded != 'undefined' && lastDataSet != null) { // WIRIS plugin core.js and configuration loaded properly
				
				// If wirislistenerdisabled=true all listeners should be disabled.
				// If this happens user should use wrs_initParse() and wrs_endParse() methods.
				if (typeof editor.config.wirislistenersdisabled == 'undefined' || !editor.config.wirislistenersdisabled) {
					editor.on('setData', function (e) {
							e.data.dataValue= wrs_initParse(e.data.dataValue || "");
					});

					editor.on('afterSetData', function(e){
						if (typeof wrs_observer != 'undefined') {
							Array.prototype.forEach.call(document.getElementsByClassName("Wirisformula"), function(wirisImages){
								wrs_observer.observe(wirisImages, wrs_observer_config);
							});
						}
					});


					editor.on('getData', function (e) {
						e.data.dataValue = wrs_endParse(e.data.dataValue || "");
					});

					editor.setData(lastDataSet);
				}
				// CKEditor replaces several times the element element during its execution, so we must assign the events again.
				// We need to set a callback function to set "element" variable inside CKEDITOR.plugins.add scope.
				setInterval(checkElement(editor, element, function(el){element = el;}, 500));
				editor.resetDirty();
			}
			else {
				setTimeout(whenDocReady, 50);
			}
		}
		// CKEditor bug #10501.
		// whenDocReady() first calls could cause a crash if ckeditor event's (like setData) are not loaded so we put a 500 ms timeout.
		setTimeout(whenDocReady, 500);
		
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
					wrs_int_openNewFormulaEditor(element, editor.langCode, editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && !divIframe );
				}
			});
			
			editor.ui.addButton('ckeditor_wiris_formulaEditor', {
				'label': 'WIRIS editor',
				'command': 'ckeditor_wiris_openFormulaEditor',
				'icon': _wrs_int_editorIcon
			});

			if ('wiriseditorparameters' in editor.config) {
				_wrs_int_wirisProperties = editor.config['wiriseditorparameters']
			} else {
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
					wrs_int_openNewCAS(element, editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && !divIframe , editor.langCode);
				}
			});
			
			editor.ui.addButton('ckeditor_wiris_CAS', {
				'label': 'WIRIS cas',
				'command': 'ckeditor_wiris_openCAS',
				'icon': _wrs_int_CASIcon
			});
		}

		// Dynamic customEditors buttons.

		for (var key in _wrs_int_customEditors) {
			if (_wrs_int_customEditors.hasOwnProperty(key)) {
				if (window[_wrs_int_customEditors[key].confVariable]) {
					var allowedContent = 'img[align,' + _wrs_conf_imageMathmlAttribute + ',src,alt](!Wirisformula)';
					var command = 'ckeditor_wiris_openFormulaEditor' + _wrs_int_customEditors[key].name;
					editor.addCommand(command, {
						'async': false,
						'canUndo': true,
						'editorFocus': true,
						'allowedContent': allowedContent,
						'requiredContent': allowedContent,
						'exec': function (editor) {
							wrs_int_enableCustomEditor(key);
							wrs_int_openNewFormulaEditor(element, editor.langCode, editor.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && !divIframe );
						}
					});

					var buttonName = 'ckeditor_wiris_formulaEditor' + _wrs_int_customEditors[key].name; 
					editor.ui.addButton(buttonName, {
						'label': 'WIRIS editor',
						'command': command,
						'icon': CKEDITOR.plugins.getPath('ckeditor_wiris') +'/icons/' + _wrs_int_customEditors[key].icon
					});
				}
			}
		}

		if ('wiriseditorparameters' in editor.config) {
			_wrs_int_wirisProperties = editor.config['wiriseditorparameters']
		} else {
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
			// Some plugins (image2, image) open a dialog on double click. On Wiris formulas
			// doubleclick event ends here.
			if (typeof event.stopPropagation != 'undefined') { // old I.E compatibility.
				event.stopPropagation();
			} else {
				event.returnValue = false;
			}
			
			if (customEditor = element.getAttribute('data-custom-editor')) {
				wrs_int_enableCustomEditor(customEditor);
			}
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
			wrs_fixAfterResize(_wrs_int_temporalImageResizing);
		}, 10);
	}
}

/**
 * Calls wrs_updateFormula with well params.
 * @param string mathml
 */
function wrs_int_updateFormula(mathml, editMode, language) {
	// _wrs_int_wirisProperties contains some js render params. Since mathml can support render params, js params should be send only to editor, not to render.
	if (_wrs_int_temporalElementIsIframe) {
		// wrs_updateFormula(_wrs_int_temporalElement.contentWindow, _wrs_int_temporalElement.contentWindow, mathml, _wrs_int_wirisProperties, editMode, language);
		wrs_updateFormula(_wrs_int_temporalElement.contentWindow, _wrs_int_temporalElement.contentWindow, mathml, {}, editMode, language);
	}
	else {
		// wrs_updateFormula(_wrs_int_temporalElement, window, mathml, _wrs_int_wirisProperties, editMode, language);
		wrs_updateFormula(_wrs_int_temporalElement, window, mathml, {}, editMode, language);
	}

	// Fire onchange event.
	// Try to use first CKEDITOR default method currenInstance first (only works if editor has been focused).	
	if (CKEDITOR.currentInstance != null && CKEDITOR.currentInstance && CKEDITOR.currentInstance.fire('change'))
		 {
		 	CKEDITOR.currentInstance.fire('change')
		 }
	else if (typeof _wrs_currentEditor != 'undefined' && _wrs_currentEditor.fire) {
		_wrs_currentEditor.fire('change');
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

/**
 * CKEditor replaces several times the element element during its execution, 
 * so we must assign the events again to editor element.
 * @param  {object}   editor   current CKEDITOR instance.
 * @param  {object}   element  last html editor element.
 * @param  {Function} callback optional callback. Necessary to replace the last calculated element on a setInterval method.
 */
function checkElement(editor, element, callback) {
	try {
		var newElement;
		divIframe = false;

		if (editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
			newElement = editor.element.$;
		}
		else {
			var elem = document.getElementById('cke_contents_' + editor.name) ? document.getElementById('cke_contents_' + editor.name) : document.getElementById('cke_' + editor.name);
			newElement = elem.getElementsByTagName('iframe')[0];
		}

		if (newElement == null) { // On this case, ckeditor uses a div area instead of and iframe as the editable area. Events must be integrated on the div area.
			newElement = document.getElementById('cke_contents_' + editor.name) ? document.getElementById('cke_contents_' + editor.name) : document.getElementById('cke_' + editor.name);
			divIframe = true;
		}

		if ((!newElement.wirisActive && element == null) || newElement != element) {
			if (editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE) {
				if (newElement.tagName == 'TEXTAREA') { // Inline editor from a textarea element. In this case the textarea will be replaced by a div element with inline editing enabled.
					var eventElements = document.getElementsByClassName("cke_textarea_inline");
					Array.prototype.forEach.call(eventElements, function(entry) {
						wrs_addElementEvents(entry, function (div, element, event) {
						wrs_int_doubleClickHandlerForDiv(editor, div, element, event);
						}, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
					});
				} else {
					wrs_addElementEvents(newElement, function (div, element, event) {
						wrs_int_doubleClickHandlerForDiv(editor, div, element, event);
					}, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
				}
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
			else if (divIframe) {
				wrs_addElementEvents(newElement, function (div, element, event) {
					wrs_int_doubleClickHandlerForDiv(editor, div, element, event);
				}, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
				newElement.wirisActive = true;
				element = newElement;
			}
		}
		callback(element);
	}
	catch (e) {
	}
}

/**
 * This function is called from wrs_insertElementOnSelection on core.js
 * Uses CKEDITOR focus method to focus on current editor area.
 */
function wrs_int_insertElementOnSelection() {
	if (typeof _wrs_currentEditor != 'undefined') {
		_wrs_currentEditor.focus();
	}
}