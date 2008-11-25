function htmlentities(input) {
    var container = document.createElement('span');
    var text = document.createTextNode(input);
    container.appendChild(text);
    return container.innerHTML.split('"').join('&quot;');
}

function getMathmlFromAppletCode(appletCode) {
	var optionForm = document.getElementById('optionForm');
	var appletObject = opener.wrs_createObject(appletCode);
	
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

opener.wrs_addEvent(window, 'load', function () {
	// Waiting for applet load
	var applet = document.getElementById('applet');
	
	/* Getting possible mathml for CAS editing */
	if (!opener._wrs_isNewElement) {
		var appletCode = opener._wrs_temporalImage.getAttribute(opener._wrs_conf_CASMathmlAttribute);
		var mathml = getMathmlFromAppletCode(opener.wrs_mathmlDecode(appletCode));
		applet.setXML(mathml);
	}
	
	opener.wrs_addEvent(document.getElementById('submit'), 'click', function () {
		/* Creating new applet code */
		var optionForm = document.getElementById('optionForm');
		var newWidth = parseInt(optionForm.width.value);
		var newHeight = parseInt(optionForm.height.value);
		
		var appletCode = '<applet alt="WIRIS CAS" class="Wiriscas" align="middle" ';
		appletCode += 'codebase="' + applet.getAttribute('codebase') + '" ';
		appletCode += 'archive="' + applet.getAttribute('archive') + '" ';
		appletCode += 'code="' + applet.getAttribute('code') + '" ';
		appletCode += 'width="' + newWidth + '" height="' + newHeight + '">';
		
		appletCode += '<param name="requestfirstevaluation" value="' + (optionForm.executeonload.checked ? 'true' : 'false') + '"/>';
		appletCode += '<param name="toolbar" value="' + (optionForm.toolbar.checked ? 'true' : 'floating') + '"/>';
		appletCode += '<param name="requestfocus" value="' + (optionForm.focusonload.checked ? 'true' : 'false') + '"/>';
		appletCode += '<param name="level" value="' + (optionForm.level.checked ? 'primary' : 'false') + '"/>';
		appletCode += '<param name="xmlinitialtext" value="' + htmlentities(applet.getXML()) + '"/>';
		appletCode += '<param name="interface" value="false"/><param name="commands" value="false"/><param name="command" value="false"/>';
		
		appletCode += '</applet>';
		
		/* Getting the image */
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
			
				/* Posting formula */
				opener.wrs_int_updateCAS(appletCode, image, newWidth, newHeight);
				window.close();
			}
		}
		
		finish();
	});

	opener.wrs_addEvent(document.getElementById('cancel'), 'click', function () {
		window.close();
	});
});

opener.wrs_addEvent(window, 'unload', function () {
	opener.wrs_int_notifyWindowClosed();
});
