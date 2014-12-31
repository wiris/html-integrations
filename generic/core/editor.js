// ${license.statement}

var wrs_int_opener;
var closeFunction;

if (window.opener) {							// For popup mode
	wrs_int_opener = window.opener;
	closeFunction = window.close;
}
/* FCKeditor integration begin */
else {											// For iframe mode
	wrs_int_opener = window.parent;
	
	while (wrs_int_opener.InnerDialogLoaded) {
		wrs_int_opener = wrs_int_opener.parent;
	}
}

// Insert editor
var lang = new RegExp("lang=([^&]*)","i").exec(window.location);
lang = (lang!=null && lang.length>1) ? lang[1]:"en";
var script = document.createElement('script');
script.type = 'text/javascript';
var editorUrl = wrs_int_opener._wrs_conf_editorUrl;
// Change to https if necessary
if (window.location.href.indexOf("https://")==0) {
	if (editorUrl.indexOf("http://")==0) {
		editorUrl = "https"+editorUrl.substring(4);
	}
}
script.src = editorUrl+"?lang="+lang;
document.getElementsByTagName('head')[0].appendChild(script);

// Insert strings
var script = document.createElement('script');
script.type = 'text/javascript';
script.src = "../lang/"+lang+"/strings.js";
document.getElementsByTagName('head')[0].appendChild(script);
try { // Catch exception: window.opener.parent and radeditor in different domain (same origin policy)
	
	if (window.parent.InnerDialogLoaded) {			// iframe mode
		window.parent.InnerDialogLoaded();
		closeFunction = window.parent.Cancel;
	}
	else if (window.opener.parent.FCKeditorAPI) {	// popup mode
		wrs_int_opener = window.opener.parent;
	}
}
catch (e) {
}
/* FCKeditor integration end */

wrs_int_opener.wrs_addEvent(window, 'load', function () {
	var queryParams = wrs_int_opener.wrs_getQueryParams(window);
	var editor;
	
	wrs_attributes = wrs_int_opener._wrs_conf_editorParameters;
	wrs_attributes.language = queryParams['lang'];

	if (wrs_int_opener._wrs_conf_editorToolbar.length>0) {
		wrs_attributes['toolbar'] = wrs_int_opener._wrs_conf_editorToolbar;
	}

	if (com.wiris.jsEditor.defaultBasePath) {
		editor = com.wiris.jsEditor.JsEditor.newInstance(wrs_attributes);
	}	
	else {
		editor = new com.wiris.jsEditor.JsEditor('editor', null);
	}
	
	var editorElement = editor.getElement();
	var editorContainer = document.getElementById('editorContainer');
	editor.insertInto(editorContainer);
	//editorContainer.appendChild(editorElement);
	
	// Mathml content
	if (!wrs_int_opener._wrs_isNewElement) {
		var mathml;
		var attributeValue = wrs_int_opener._wrs_temporalImage.getAttribute(wrs_int_opener._wrs_conf_imageMathmlAttribute);
		
		if (attributeValue == null) {
			attributeValue = wrs_int_opener._wrs_temporalImage.getAttribute('alt');
		}
		
		if (wrs_int_opener._wrs_conf_useDigestInsteadOfMathml) {
			mathml = wrs_int_opener.wrs_getCode(wrs_int_opener._wrs_conf_digestPostVariable, attributeValue);
		}
		else {
			mathml = wrs_int_opener.wrs_mathmlDecode(attributeValue);
		}
		
		editor.setMathML(mathml);
	}
	
	if (typeof strings == 'undefined') {
		strings = new Object();
	}
	
	// Submit button.
	var controls = document.getElementById('controls');
	var submitButton = document.createElement('input');
	submitButton.type = 'button';
	if (strings['accept'] != null){
		submitButton.value = strings['accept'];
	}else{
		submitButton.value = 'Accept';
	}
	
	
	wrs_int_opener.wrs_addEvent(submitButton, 'click', function () {
		// In order to avoid n-formulas on n-clicks
		// submit button is disabled 1 second
		submitButton.disabled = true;

		setTimeout(function()
			{submitButton.disabled=false;
			}, 1000);

		var mathml = '';

		if (!editor.isFormulaEmpty()) {
			mathml += editor.getMathML();							// If isn't empty, get mathml code to mathml variable.
			mathml = wrs_int_opener.wrs_mathmlEntities(mathml);		// Apply a parse.
		}
	
		/* FCKeditor integration begin */
		if (window.parent.InnerDialogLoaded && window.parent.FCKBrowserInfo.IsIE) {			// On IE, we must close the dialog for push the caret on the correct position.
			closeFunction();
			wrs_int_opener.wrs_int_updateFormula(mathml, wrs_int_opener._wrs_editMode, queryParams['lang']);
		}
		/* FCKeditor integration end */
		else {
			if (wrs_int_opener.wrs_int_updateFormula) {
				wrs_int_opener.wrs_int_updateFormula(mathml, wrs_int_opener._wrs_editMode, queryParams['lang']);
			}
			
			closeFunction();
		}
	});
	
	controls.appendChild(submitButton);

	// Cancel button.
	var cancelButton = document.createElement('input');
	cancelButton.type = 'button';
	if (strings['cancel'] != null){
		cancelButton.value = strings['cancel'];
	}else{
		cancelButton.value = 'Cancel';
	}

	
	wrs_int_opener.wrs_addEvent(cancelButton, 'click', function () {
		closeFunction();
	});
	
	controls.appendChild(cancelButton);

	var manualLink = document.getElementById('a_manual');
	if (typeof manualLink != 'undefined' && strings['manual'] != null){
		manualLink.innerHTML = strings['manual'];
	}

	var latexLink = document.getElementById('a_latex');
	if (typeof latexLink != 'undefined' && strings['latex'] != null){
		latexLink.innerHTML = strings['latex'];
	}

	var queryLang = '';
	if ('lang' in queryParams){
		queryLang = queryParams['lang'].substr(0, 2);
	}
	
	if ((queryParams['dir'] == 'rtl') || ((queryLang == 'he' || queryLang == 'ar') && queryParams['dir'] != 'ltr')){
		var body = document.getElementsByTagName('BODY');
		body[0].setAttribute("dir","rtl");
		var links = document.getElementById('links');
		links.id = 'links_rtl';
		var controls = document.getElementById('controls');
		controls.id = 'controls_rtl';
	}
	
	// Auto resizing.
	setInterval(function () {
		editorElement.style.height = (document.getElementById('container').offsetHeight - controls.offsetHeight - 10) + 'px';
	}, 100);
	
	setTimeout(function () {
		editor.focus();
	}, 100);
});

wrs_int_opener.wrs_addEvent(window, 'unload', function () {
	wrs_int_opener.wrs_int_notifyWindowClosed();
});