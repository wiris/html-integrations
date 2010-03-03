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

if (window.parent.InnerDialogLoaded) {			// iframe mode
	window.parent.InnerDialogLoaded();
	closeFunction = window.parent.Cancel;
}
else if (window.opener.parent.FCKeditorAPI) {	// popup mode
	wrs_int_opener = window.opener.parent;
}
/* FCKeditor integration end */

function htmlentities(input) {
    var container = document.createElement('span');
    var text = document.createTextNode(input);
    container.appendChild(text);
    return container.innerHTML.split('"').join('&quot;');
}

function getMathmlFromAppletCode(appletCode) {
	var optionForm = document.getElementById('optionForm');
	var appletObject = wrs_int_opener.wrs_createObject(appletCode);
	
	optionForm.width.value = parseInt(appletObject.width);
	optionForm.height.value = parseInt(appletObject.height);
	
	var params = appletObject.childNodes;
	var mathml = '';
	
	for (var i = 0; i < params.length; ++i) {
		if (params[i].name == 'xmlinitialtext') {
			mathml = params[i].value;
		}
		else if (params[i].name == 'requestfirstevaluation') {
			optionForm.executeonload.checked = (params[i].value == 'true') ? true : false;
		}
		else if (params[i].name == 'toolbar') {
			optionForm.toolbar.checked = (params[i].value == 'floating') ? false : true;
		}
		else if (params[i].name == 'requestfocus') {
			optionForm.focusonload.checked = (params[i].value == 'true') ? true : false;
		}
		else if (params[i].name == 'level') {
			optionForm.level.checked = (params[i].value == 'primary') ? true : false;
		}
	}
	
	return mathml;
}

wrs_int_opener.wrs_addEvent(window, 'load', function () {
	// Waiting for applet load
	var applet = document.getElementById('applet');
	
	// Getting possible mathml for CAS editing
	if (!wrs_int_opener._wrs_isNewElement) {
		var appletCode = wrs_int_opener._wrs_temporalImage.getAttribute(wrs_int_opener._wrs_conf_CASMathmlAttribute);
		var mathml = getMathmlFromAppletCode(wrs_int_opener.wrs_mathmlDecode(appletCode));
		
		function setAppletMathml() {
			// Internet explorer fails on "applet.isActive". It only supports "applet.isActive()"
			try {
				if (applet.isActive && applet.isActive()) {
					applet.setXML(mathml);
				}
				else {
					setTimeout(setAppletMathml, 50);
				}
			}
			catch (e) {
				if (applet.isActive()) {
					applet.setXML(mathml);
				}
				else {
					setTimeout(setAppletMathml, 50);
				}
			}
		}

		setAppletMathml();
	}
	
	wrs_int_opener.wrs_addEvent(document.getElementById('submit'), 'click', function () {
		// Creating new applet code
		var optionForm = document.getElementById('optionForm');
		var newWidth = parseInt(optionForm.width.value);
		var newHeight = parseInt(optionForm.height.value);
		
		var appletCode = '<applet alt="WIRIS CAS" class="Wiriscas" align="middle" ';
		appletCode += 'codebase="' + applet.getAttribute('codebase') + '" ';
		appletCode += 'archive="' + applet.getAttribute('archive') + '" ';
		appletCode += 'code="' + applet.getAttribute('code') + '" ';
		appletCode += 'width="' + newWidth + '" height="' + newHeight + '">';
		
		appletCode += '<param name="requestfirstevaluation" value="' + (optionForm.executeonload.checked ? 'true' : 'false') + '"></param>';
		appletCode += '<param name="toolbar" value="' + (optionForm.toolbar.checked ? 'true' : 'floating') + '"></param>';
		appletCode += '<param name="requestfocus" value="' + (optionForm.focusonload.checked ? 'true' : 'false') + '"></param>';
		appletCode += '<param name="level" value="' + (optionForm.level.checked ? 'primary' : 'false') + '"></param>';
		appletCode += '<param name="xmlinitialtext" value="' + htmlentities(applet.getXML()) + '"></param>';
		appletCode += '<param name="interface" value="false"></param><param name="commands" value="false"></param><param name="command" value="false"></param>';
		
		appletCode += '</applet>';
		
		// Getting the image
		// First, resize applet
		applet.width = newWidth;
		applet.height = newHeight;
		
		// Waiting for applet resizing
		function finish() {
			if (applet.getSize().width != applet.width || applet.getSize().height != applet.height) {
				setTimeout(finish, 100);
			}
			else {
				// Getting the image
				var image = applet.getImageBase64('png');
				
				/* FCKeditor integration begin */
				if (window.parent.InnerDialogLoaded && window.parent.FCKBrowserInfo.IsIE) {			// On IE, we must close the dialog for push the caret on the correct position.
					closeFunction();
					wrs_int_opener.wrs_int_updateCAS(appletCode, image, newWidth, newHeight);
				}
				/* FCKeditor integration end */
				else {
					wrs_int_opener.wrs_int_updateCAS(appletCode, image, newWidth, newHeight);
					closeFunction();
				}
			}
		}
		
		finish();
	});

	wrs_int_opener.wrs_addEvent(document.getElementById('cancel'), 'click', function () {
		closeFunction();
	});
});

wrs_int_opener.wrs_addEvent(window, 'unload', function () {
	wrs_int_opener.wrs_int_notifyWindowClosed();
});
