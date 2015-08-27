/* Configuration */
var _wrs_int_conf_file = "@param.js.configuration.path@";
var _wrs_int_conf_async = true;

// Stats editor (needed by core/editor.js)
var _wrs_conf_editor = "RadEditor";

// Including core.js

var col = document.getElementsByTagName("script");
for (i=0;i<col.length;i++) {
	var src = col[i].src;
	var j = src.lastIndexOf("radeditor.js");
	if (j >= 0) {baseURL = src.substr(0, j - 1);}
}
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = baseURL+'/core/core.js';
document.getElementsByTagName('head')[0].appendChild(script);

var _wrs_int_path = _wrs_int_conf_file.split("/");
_wrs_int_path.pop();
_wrs_int_path = _wrs_int_path.join("/");
_wrs_int_path =  _wrs_int_path.indexOf("/")==0 || _wrs_int_path.indexOf("http")==0 ? _wrs_int_path : baseURL + "/" + _wrs_int_path;

var _wrs_conf_editorEnabled = true; 			// Specifies if fomula editor is enabled.
var _wrs_conf_CASEnabled = true; 				// Specifies if WIRIS cas is enabled.

var _wrs_int_wirisProperties;

/* Vars */
var _wrs_int_temporalIframe;
var _wrs_int_currentEditor;
var _wrs_int_window_opened = false;
var _wrs_int_language;
var _wrs_int_radeditor_id;
var _wrs_int_temporalImageResizing;
var _wrs_int_directionality = '';

if (typeof currentLanguage != 'undefined'){
	_wrs_int_language = currentLanguage;
}else{
	_wrs_int_language = 'en';
}

/* Plugin integration */
function OnClientLoad(editor, args){
	var attribute;
	_wrs_int_currentEditor = editor;
	_wrs_int_temporalIframe = editor._contentAreaElement;

	_wrs_int_wirisProperties = {};
	attribute = editor.get_element().getAttribute("wiriseditorparameters");
	if (attribute != 'undefined') {
		_wrs_int_wirisProperties = attribute;
	} else {
		attribute = editor.get_element().getAttribute("wirisimagecolor");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['color'] = attribute;
		}

		attribute = editor.get_element().getAttribute("wirisimagebgcolor");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['bgColor'] = attribute;
		}

		attribute = editor.get_element().getAttribute("wirisimagebackgroundcolor");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['backgroundColor'] = attribute;
		}
		
		attribute = editor.get_element().getAttribute("wirisimagesymbolcolor");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['symbolColor'] = attribute;
		}

		attribute = editor.get_element().getAttribute("wirisimagenumbercolor");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['numberColor'] = attribute;
		}
		
		attribute = editor.get_element().getAttribute("wirisimageidentcolor");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['identColor'] = attribute;
		}
		
		attribute = editor.get_element().getAttribute("wiristransparency");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['transparency'] = attribute;
		}
		
		attribute = editor.get_element().getAttribute("wirisimagefontsize");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['fontSize'] = attribute;
		}
		
		attribute = editor.get_element().getAttribute("wirisdpi");
		if (attribute != 'undefined') {
			_wrs_int_wirisProperties['dpi'] = attribute;
		}
	}
	
	var lis = new Array();
	
	if (!_wrs_conf_CASEnabled) {
		var as = document.getElementsByTagName('a');
		for (var i = 0; i < as.length; i++){
			if (as[i].getAttribute('title') == 'WIRIScas'){
				var li = as[i].parentNode;
				lis.push(li);
				li.style.display = 'none';
			}
		}
	}

	if (!_wrs_conf_editorEnabled) {
		var as = document.getElementsByTagName('a');
		for (var i = 0; i < as.length; i++){
			if (as[i].getAttribute('title') == 'WIRISformula'){
				var li = as[i].parentNode;
				lis.push(li);
				li.style.display = 'none';
			}
		}
	}
	
	if (lis.length == 2){
		lis[0].parentNode.style.display = 'none';
	}
	
	editor.add_submit(function (){
		editor.set_html(wrs_endParse(editor.get_html(true), null, _wrs_int_language));
	});

	function whenDocReady() {
		if (window.wrs_initParse && typeof _wrs_conf_plugin_loaded != 'undefined') {
			wrs_addIframeEvents(_wrs_int_temporalIframe, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
//			editor.set_html(wrs_initParse(editor.get_html(), _wrs_int_language));
			editor.get_contentArea().innerHTML = wrs_initParse(editor.get_html(), _wrs_int_language);
		}
		else {
			setTimeout(whenDocReady, 50);
		}
	}
	
	whenDocReady();
}

Telerik.Web.UI.Editor.CommandList["WIRIScas"] = function(commandName, editor, args) {
    if (_wrs_conf_CASEnabled) {
        wrs_int_openNewCAS(editor._contentAreaElement, _wrs_int_language);
    }
};

Telerik.Web.UI.Editor.CommandList["WIRISformula"] = function(commandName, editor, args) {
    if (_wrs_conf_editorEnabled) {
        wrs_int_openNewFormulaEditor(editor._contentAreaElement, _wrs_int_language);
    }
};

function wrs_int_updateCAS(appletCode, image, width, height) {
	wrs_updateCAS(_wrs_int_temporalIframe.contentWindow, _wrs_int_temporalIframe.contentWindow, appletCode, image, width, height);
}

function wrs_int_updateFormula(mathml, editMode, language) {
	wrs_updateFormula(_wrs_int_temporalIframe.contentWindow, _wrs_int_temporalIframe.contentWindow, mathml, _wrs_int_wirisProperties, editMode, language);
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
function wrs_int_doubleClickHandler(Iframe, element) {
    if (element.nodeName.toLowerCase() == 'img') {
        if (wrs_containsClass(element, 'Wirisformula')) {
            if (!_wrs_int_window_opened) {
                _wrs_temporalImage = element;
                wrs_int_openExistingFormulaEditor(_wrs_int_temporalIframe, _wrs_int_language);
            }
            else {
                _wrs_int_window.focus();
            }
        }
        else if (wrs_containsClass(element, 'Wiriscas')) {
            if (!_wrs_int_window_opened) {
                _wrs_temporalImage = element;
                wrs_int_openExistingCAS(_wrs_int_temporalIframe, _wrs_int_language);
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
function wrs_int_mousedownHandler(Iframe, element) {
    if (element.nodeName.toLowerCase() == 'img') {
        if (wrs_containsClass(element, 'Wirisformula') || wrs_containsClass(element, 'Wiriscas')) {
            _wrs_int_temporalImageResizing = element;
        }
    }
}

/**
* Handles a mouse up event on the iframe.
*/
function wrs_int_mouseupHandler(Iframe, element) {
    if (_wrs_int_temporalImageResizing) {
        setTimeout(function() {
           	wrs_fixAfterResize(_wrs_int_temporalImageResizing);
        }, 10);
    }
}

/**
* Handles window closing.
*/
function wrs_int_notifyWindowClosed() {
    _wrs_int_window_opened = false;
}