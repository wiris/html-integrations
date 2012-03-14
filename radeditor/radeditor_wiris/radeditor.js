/* Configuration */
var _wrs_conf_imageMathmlAttribute = 'alt'; // Specifies the image tag where we should save the formula editor mathml code
var _wrs_conf_CASMathmlAttribute = 'alt'; // Specifies the image tag where we should save the WIRIS CAS mathml code

var _wrs_conf_editorPath = _wrs_currentPath + 'radeditor_wiris/integration/editor.aspx'; // Specifies where is the editor HTML code (for popup window)
var _wrs_conf_CASPath = _wrs_currentPath + 'radeditor_wiris/integration/cas.aspx'; 		// Specifies where is the WIRIS CAS HTML code (for popup window)

var _wrs_conf_createimagePath = _wrs_currentPath + 'radeditor_wiris/integration/createimage.aspx'; 		// Specifies where is createimage script
var _wrs_conf_createcasimagePath = _wrs_currentPath + 'radeditor_wiris/integration/createcasimage.aspx'; // Specifies where is createcasimage script

var _wrs_int_language = 'en';
var _wrs_int_window_opened = false;

var _wrs_conf_editorEnabled = true; 	// Specifies if fomula editor is enabled.
var _wrs_conf_CASEnabled = true; 	// Specifies if WIRIS cas is enabled.

var _wrs_conf_getmathmlPath = _wrs_currentPath + '/radeditor_wiris/integration/getmathml.aspx';			// Specifies where is the getmathml script.

var _wrs_int_temporalIframe;
var _wrs_int_currentEditor;
var _wrs_conf_CASAttributes = 'width=640, height=480, scroll=no, resizable=yes'; 						// Specifies WIRIS cas window options.
var _wrs_conf_editorAttributes = 'width=500, height=400, scroll=no, resizable=yes'; 						// Specifies formula editor window options.

var _wrs_conf_parseModes = ['latex'];				// This value can contain 'latex'.
//var _wrs_conf_saveMode = '@SAVE_MODE@';			// This value can be 'tags', 'xml' or 'safeXml'.


function WIRIScas_CallbackFunction(appletCode, image, width, height) {
    if (appletCode) {
        var imgObject = wrs_appletCodeToImgObject(_wrs_int_currentEditor.get_document(), appletCode, image, width, height);
        _wrs_int_currentEditor.pasteHtml($telerik.getOuterHtml(imgObject));
    }
}

function WIRISformula_CallbackFunction(mathml, editMode) {
    if (mathml) {
        var imgObject = wrs_mathmlToImgObject(_wrs_int_currentEditor.get_document(), mathml);
        _wrs_int_currentEditor.pasteHtml($telerik.getOuterHtml(imgObject));
    }
}

function OnClientLoad(editor, args){

	editor.add_submit(function (){
		editor.set_html(wrs_endParse(editor.get_html(true)));
	});

	function whenDocReady() {
		if (window.wrs_initParse) {
			editor.set_html(wrs_initParse(editor.get_html()));

			/*
			iframe = editor.getContentAreaContainer().firstChild;
			
			wrs_addIframeEvents(iframe, function (iframe, element) {
				wrs_int_doubleClickHandler(editor, iframe, element);
			}, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
			*/
		}
		else {
			setTimeout(whenDocReady, 50);
		}
	}
	
	whenDocReady();
}

Telerik.Web.UI.Editor.CommandList["WIRIScas"] = function(commandName, editor, args) {
    _wrs_int_currentEditor = editor;
    var newIframe = document.getElementsByTagName('iframe')[0];
    wrs_addIframeEvents(newIframe, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);
    
    if (_wrs_conf_CASEnabled) {
        wrs_int_openNewCAS(newIframe);
    }
};

Telerik.Web.UI.Editor.CommandList["WIRISformula"] = function(commandName, editor, args) {
    _wrs_int_currentEditor = editor;

    var newIframe = document.getElementsByTagName('iframe')[0];
    wrs_addIframeEvents(newIframe, wrs_int_doubleClickHandler, wrs_int_mousedownHandler, wrs_int_mouseupHandler);

    if (_wrs_conf_editorEnabled) {
        wrs_int_openNewFormulaEditor(newIframe);
    }
};

function wrs_int_updateCAS(appletCode, image, width, height) {
    WIRIScas_CallbackFunction(appletCode, image, width, height);
}

function wrs_int_updateFormula(mathml, editMode) {
    WIRISformula_CallbackFunction(mathml, editMode);
}

/**
* Opens formula editor.
* @param object iframe Target
*/
function wrs_int_openNewFormulaEditor(iframe) {
    if (_wrs_int_window_opened) {
        _wrs_int_window.focus();
    }
    else {
        _wrs_int_window_opened = true;
        _wrs_isNewElement = true;
        _wrs_int_temporalIframe = iframe;
        _wrs_int_window = wrs_openEditorWindow(null, iframe, true);
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
        _wrs_int_window = wrs_openCASWindow(iframe, true);
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
                wrs_int_openExistingFormulaEditor(_wrs_int_temporalIframe);
            }
            else {
                _wrs_int_window.focus();
            }
        }
        else if (wrs_containsClass(element, 'Wiriscas')) {
            if (!_wrs_int_window_opened) {
                _wrs_temporalImage = element;
                wrs_int_openExistingCAS(_wrs_int_temporalIframe);
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
function wrs_int_openExistingFormulaEditor(iframe) {
    _wrs_int_window_opened = true;
    _wrs_isNewElement = false;
    _wrs_int_temporalIframe = iframe;
    _wrs_int_window = wrs_openEditorWindow(null, iframe, true);
}

/**
* Opens CAS to edit an existing formula.
* @param object iframe Target
*/
function wrs_int_openExistingCAS(iframe) {
    _wrs_int_window_opened = true;
    _wrs_isNewElement = false;
    _wrs_int_temporalIframe = iframe;
    _wrs_int_window = wrs_openCASWindow(iframe, true);
}


/**
* Handles a mouse down event on the iframe.
* @param object iframe Target
* @param object element Element mouse downed
*/
function wrs_int_mousedownHandler(Iframe, element) {
    /*if (element.nodeName.toLowerCase() == 'img') {
        if (wrs_containsClass(element, 'Wirisformula') || wrs_containsClass(element, 'Wiriscas')) {
            _wrs_int_temporalImageResizing = element;
        }
    }*/
}

/**
* Handles a mouse up event on the iframe.
*/
function wrs_int_mouseupHandler(Iframe, element) {
    /*if (_wrs_int_temporalImageResizing) {
        setTimeout(function() {
            _wrs_int_temporalImageResizing.removeAttribute('style');
            _wrs_int_temporalImageResizing.removeAttribute('width');
            _wrs_int_temporalImageResizing.removeAttribute('height');
        }, 10);
    }*/
}

/**
* Handles window closing.
*/
function wrs_int_notifyWindowClosed() {
    _wrs_int_window_opened = false;
}