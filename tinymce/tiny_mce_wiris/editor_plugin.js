var _wrs_int_conf_file = "@param.js.configuration.path@";
var _wrs_int_conf_async = true;
var _wrs_baseURL;

// Define _wrs_conf_path (path where configuration is found)
if (typeof _wrs_isMoodle24 == 'undefined') {
	_wrs_baseURL = tinymce.baseURL;
	_wrs_conf_path = _wrs_baseURL + '/plugins/tiny_mce_wiris/'; // TODO use the same variable name always
}else{
	var base = tinymce.baseURL;
	var search = 'lib/editor/tinymce';
	var pos = base.indexOf(search);
	_wrs_baseURL = tinymce.baseURL.substr(0, pos + search.length);
	_wrs_conf_path = _wrs_baseURL + '/plugins/tiny_mce_wiris/tinymce/'; // TODO use the same variable name always
	_wrs_int_conf_async = false; // For sure!
}

// Load configuration synchronously
if (!_wrs_int_conf_async) {
	var httpRequest = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
	var configUrl = _wrs_int_conf_file.indexOf("/")==0 || _wrs_int_conf_file.indexOf("http")==0 ? _wrs_int_conf_file : _wrs_conf_path + "/" + _wrs_int_conf_file;
	httpRequest.open('GET', configUrl, false);
	httpRequest.send(null);
	eval(httpRequest.responseText);
}

/* Including core.js */
tinymce.ScriptLoader.load(_wrs_conf_path + 'core/core.js');
while (tinymce.ScriptLoader.isDone(_wrs_conf_path + 'core/core.js'));

var _wrs_conf_pluginBasePath = _wrs_conf_path; // _wrs_baseURL + '/plugins/tiny_mce_wiris';

/* Vars */
var _wrs_int_editorIcon = _wrs_conf_path + 'core/icons/tiny_mce/formula.gif';
var _wrs_int_CASIcon = _wrs_conf_path + 'core/icons/tiny_mce/cas.gif';
var _wrs_int_temporalIframe;
var _wrs_int_window;
var _wrs_int_window_opened = false;
var _wrs_int_temporalImageResizing;
var _wrs_int_wirisProperties;
var _wrs_int_directionality; 

/* Plugin integration */
(function () {
	tinymce.create('tinymce.plugins.tiny_mce_wiris', {
		init: function (editor, url) {
			var iframe;
			
			//Fix a Moodle 2.4 bug. data-mathml was lost without this.
			if (typeof _wrs_isMoodle24 !== 'undefined' && _wrs_isMoodle24){
				editor.settings.extended_valid_elements += ',img[*]';    
			}
			
			editor.onInit.add(function (editor) {
				var editorElement = editor.getElement();
				var content = ('value' in editorElement) ? editorElement.value : editorElement.innerHTML;
				
				function whenDocReady() {
					if (typeof _wrs_conf_plugin_loaded!= 'undefined') {
						var language = editor.getParam('language');
						_wrs_int_directionality = editor.getParam('directionality');
				
						if (editor.settings['wirisformulaeditorlang']) {
							language = editor.settings['wirisformulaeditorlang'];
						}
						
						/* if (true || configuration.wirisparselatex == false) {
							var pos = wrs_arrayContains(_wrs_conf_parseModes, 'latex');
							if (pos != -1){
								_wrs_conf_parseModes.splice(pos, 1);
							}
						}else if (true || configuration.wirisparselatex == true) {
							var pos = wrs_arrayContains(_wrs_conf_parseModes, 'latex');
							if (pos == -1){
								_wrs_conf_parseModes.push('latex');
							}
						} */	
				
						//Bug fix: In Moodle2.x when TinyMCE is set to full screen 
						//the content doesn't need to be filtered.
						if (!editor.getParam('fullscreen_is_enabled')){
							editor.setContent(wrs_initParse(content, language));
						}

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
					'identColor': editor.settings['wirisimageidentcolor'],
					'color' : editor.settings['wirisimagecolor'],
					'dpi' : editor.settings['wirisdpi'],
					'backgroundColor' : editor.settings['wirisimagebackgroundcolor'],
					'fontFamily' : editor.settings['wirisfontfamily']
				};
				
				var language = editor.getParam('language');
				_wrs_int_directionality = editor.getParam('directionality');
				
				if (editor.settings['wirisformulaeditorlang']) {
					language = editor.settings['wirisformulaeditorlang'];
				}
				
				params.content = wrs_endParse(params.content, _wrs_int_wirisProperties, language);
			});
			
			
			if (_wrs_int_conf_async || _wrs_conf_editorEnabled) {
				editor.addCommand('tiny_mce_wiris_openFormulaEditor', function () {
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

					var language = editor.getParam('language');
					_wrs_int_directionality = editor.getParam('directionality');
					
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

			if (_wrs_int_conf_async || _wrs_conf_CASEnabled) {
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
	});

	tinymce.PluginManager.add('tiny_mce_wiris', tinymce.plugins.tiny_mce_wiris);
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
	// This loop allows the double clicking on the formulas represented with span's.
	
	while (!wrs_containsClass(element, 'Wirisformula') && !wrs_containsClass(element, 'Wiriscas') && element.parentNode) {
		element = element.parentNode;
	}
	
	var elementName = element.nodeName.toLowerCase();
	
	if (elementName == 'img' || elementName == 'iframe' || elementName == 'span') {
		if (wrs_containsClass(element, 'Wirisformula')) {
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
			wrs_fixAfterResize(_wrs_int_temporalImageResizing);
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
