/* Vars */
var _wrs_currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf('/') + 1);
var _wrs_isNewElement = true;
var _wrs_temporalImage;

/**
 * Cross-browser addEventListener/attachEvent function.
 * @param object element Element target
 * @param event event Event
 * @param function func Function to run
 */
function wrs_addEvent(element, event, func) {
	if (element.addEventListener) {
		element.addEventListener(event, func, false);
	}
	else if (element.attachEvent) {
		element.attachEvent('on' + event, func);
	}
}

/**
 * Adds iframe events.
 * @param object iframe Target
 * @param function doubleClickHandler Function to run when user double clicks the iframe
 * @param function mousedownHandler Function to run when user mousedowns the iframe
 * @param function mouseupHandler Function to run when user mouseups the iframe
 */
function wrs_addIframeEvents(iframe, doubleClickHandler, mousedownHandler, mouseupHandler) {
	if (doubleClickHandler) {
		wrs_addEvent(iframe.contentWindow.document, 'dblclick', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			doubleClickHandler(iframe, element);
		});
	}
	
	if (mousedownHandler) {
		wrs_addEvent(iframe.contentWindow.document, 'mousedown', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			mousedownHandler(iframe, element);
		});
	}
	
	if (mouseupHandler) {
		wrs_addEvent(iframe.contentWindow.document, 'mouseup', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			mouseupHandler(iframe, element);
		});
	}
}

/**
 * WIRIS special encoding.
 *  We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
 * @param string input
 * @return string
 */
function wrs_mathmlDecode(input) {
	input = input.split('«').join('<');
	input = input.split('»').join('>');
	input = input.split('¨').join('"');
	input = input.split('$').join('&');
	input = input.split('`').join("'");
	return input;
}

/**
 * WIRIS special encoding.
 *  We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
 * @param string input
 * @return string
 */
function wrs_mathmlEncode(input) {
	input = input.split('<').join('«');
	input = input.split('>').join('»');
	input = input.split('"').join('¨');
	input = input.split('&').join('$');
	input = input.split("'").join('`');
	return input;
}

/**
 * Converts special symbols (> 128) to entities.
 * @param string mathml
 * @return string
 */
function wrs_mathmlEntities(mathml) {
	var toReturn = '';
	for (var i = 0; i < mathml.length; ++i) {
		//parsing > 128 characters
		if (mathml.charCodeAt(i) > 128) {
			toReturn += '&#' + mathml.charCodeAt(i) + ';';
		}
		else {
			toReturn += mathml.charAt(i);
		}
	}
	return toReturn;
}

/**
 * Inserts or modifies formulas.
 * @param object iframe Target
 * @param string mathml Mathml code
 */
function wrs_updateFormula(iframe, mathml) {
	if (iframe && mathml) {
		iframe.contentWindow.focus();
		var imgObject = wrs_mathmlToImgObject(iframe.contentWindow.document, mathml);
		
		if (_wrs_isNewElement) {
			if (document.selection) {
				var range = iframe.contentWindow.document.selection.createRange();
				
				iframe.contentWindow.document.execCommand('insertimage', false, imgObject.src);

				if (range.parentElement) {
					var temporalImg = range.parentElement();

					with (temporalImg) {
						title = imgObject.title;
						className = imgObject.className;
						setAttribute(_wrs_conf_imageMathmlAttribute, imgObject.getAttribute(_wrs_conf_imageMathmlAttribute));
						setAttribute('align', imgObject.getAttribute('align'));
					}
				}
			}
			else {
				var sel = iframe.contentWindow.getSelection();
				try {
					var range = sel.getRangeAt(0);
				}
				catch (e) {
					var range = iframe.contentWindow.document.createRange();
				}
				
				sel.removeAllRanges();
				range.deleteContents();
				
				var node = range.startContainer;
				var pos = range.startOffset;
				
				if (node.nodeType == 3) {
					node = node.splitText(pos);
					node.parentNode.insertBefore(imgObject, node);
				}
				else if (node.nodeType == 1) {
					node.insertBefore(imgObject, node.childNodes[pos]);
				}
				
			}
		}
		else {
			_wrs_temporalImage.parentNode.insertBefore(imgObject, _wrs_temporalImage);
			_wrs_temporalImage.parentNode.removeChild(_wrs_temporalImage);
		}
	}
}

/**
 * Inserts or modifies CAS.
 * @param object iframe Target
 * @param string appletCode Applet code
 * @param string image Base 64 image stream
 * @param int imageWidth Image width
 * @param int imageHeight Image height
 */
function wrs_updateCAS(iframe, appletCode, image, imageWidth, imageHeight) {
	if (iframe && appletCode) {
		iframe.contentWindow.focus();
		var imgObject = wrs_appletCodeToImgObject(iframe.contentWindow.document, appletCode, image, imageWidth, imageHeight);
		
		if (_wrs_isNewElement) {
			if (document.selection) {
				var range = iframe.contentWindow.document.selection.createRange();
				
				iframe.contentWindow.document.execCommand('insertimage', false, imgObject.src);

				if (range.parentElement) {
					var temporalImg = range.parentElement();

					with (temporalImg) {
						width = imgObject.width;
						height = imgObject.height;
						setAttribute('align', imgObject.getAttribute('align'));
						setAttribute(_wrs_conf_CASMathmlAttribute, imgObject.getAttribute(_wrs_conf_CASMathmlAttribute));
						title = imgObject.title;
						className = imgObject.className;
					}
				}
			}
			else {
				var sel = iframe.contentWindow.getSelection();
				try {
					var range = sel.getRangeAt(0);
				}
				catch (e) {
					var range = iframe.contentWindow.document.createRange();
				}
				
				sel.removeAllRanges();
				range.deleteContents();
				
				var node = range.startContainer;
				var pos = range.startOffset;
				
				if (node.nodeType == 3) {
					node = node.splitText(pos);
					node.parentNode.insertBefore(imgObject, node);
				}
				else if (node.nodeType == 1) {
					node.insertBefore(imgObject, node.childNodes[pos]);
				}
				
			}
		}
		else {
			_wrs_temporalImage.parentNode.insertBefore(imgObject, _wrs_temporalImage);
			_wrs_temporalImage.parentNode.removeChild(_wrs_temporalImage);
		}
	}
}

/**
 * Converts mathml to img object.
 * @param object creator Object with "createElement" method
 * @param string mathml Mathml code
 * @return object
 */
function wrs_mathmlToImgObject(creator, mathml) {
	var imageSrc = wrs_createImageSrc(mathml);
	
	var imgObject = creator.createElement('img');

	with (imgObject) {
		setAttribute(_wrs_conf_imageMathmlAttribute, wrs_mathmlEncode(mathml));
		className = 'Wirisformula';
		title = 'Double click to edit';
		src = imageSrc;
		align = 'middle';
	}
	
	return imgObject;
}

/**
 * Gets formula image src with AJAX.
 * @param mathml Mathml code
 * @return string
 */
function wrs_createImageSrc(mathml) {
	var httpRequest = wrs_createHttpRequest();
	
	if (httpRequest) {
		var data = 'mml=' + wrs_urlencode(mathml);
		
		if (_wrs_conf_createimagePath.substr(0, 1) == '/') {
			httpRequest.open('POST', _wrs_conf_createimagePath, false);
		}
		else {
			httpRequest.open('POST', _wrs_currentPath + _wrs_conf_createimagePath, false);
		}
		
		httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
		httpRequest.send(data);
		return httpRequest.responseText;
	}
	else {
		alert('Your browser is not compatible with technology AJAX. Please, use the latest version of Mozilla Firefox.');
		return '';
	}
}

/**
 * Converts applet code to img object.
 * @param object creator Object with "createElement" method
 * @param string appletCode Applet code
 * @param string image Base 64 image stream
 * @param int imageWidth Image width
 * @param int imageHeight Image height
 * @return object
 */
function wrs_appletCodeToImgObject(creator, appletCode, image, imageWidth, imageHeight) {
	var imageSrc = wrs_createImageCASSrc(image);
	
	var imgObject = creator.createElement('img');
	
	with (imgObject) {
		setAttribute(_wrs_conf_CASMathmlAttribute, wrs_mathmlEncode(appletCode));
		className = 'Wiriscas';
		title = 'Double click to edit';
		src = imageSrc;
		align = 'middle';
		width = imageWidth;
		height = imageHeight;
	}
	
	return imgObject;
}

/**
 * Gets CAS image src with AJAX.
 * @param string image Base 64 image stream
 * @return string
 */
function wrs_createImageCASSrc(image) {
	var httpRequest = wrs_createHttpRequest();
	
	if (httpRequest) {
		var data = 'image=' + wrs_urlencode(image);
		
		if (_wrs_conf_createcasimagePath.substr(0, 1) == '/') {
			httpRequest.open('POST', _wrs_conf_createcasimagePath, false);
		}
		else {
			httpRequest.open('POST', _wrs_currentPath + _wrs_conf_createcasimagePath, false);
		}
		
		httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
		httpRequest.send(data);
		return httpRequest.responseText;
	}
	else {
		alert('Your browser is not compatible with technology AJAX. Please, use the latest version of Mozilla Firefox.');
		return '';
	}
}

/**
 * URL encode function
 * @param string clearString Input 
 * @return string
 */
function wrs_urlencode(clearString) {
	var output = '';
	var x = 0;
	clearString = clearString.toString();
	var regex = /(^[a-zA-Z0-9_.]*)/;
	
	var clearString_length = ((typeof clearString.length) == 'function') ? clearString.length() : clearString.length;

	while (x < clearString_length) {
		var match = regex.exec(clearString.substr(x));
		if (match != null && match.length > 1 && match[1] != '') {
			output += match[1];
			x += match[1].length;
		}
		else {
			var charCode = clearString.charCodeAt(x);
			var hexVal = charCode.toString(16);
			output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
			++x;
		}
	}
	
	return output;
}

/**
 * Cross-browser httpRequest creation.
 * @return object
 */
function wrs_createHttpRequest() {
	try {
		return new ActiveXObject('Msxml2.XMLHTTP');
	}
	catch (e) {
		try {
			return new ActiveXObject('Microsoft.XMLHTTP');
		}
		catch (oc) {
		}
	}

	if(typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	}
	
	return false;
}

/**
 * Creates new object using its html code.
 * @param string objectCode
 * @return object
 */
function wrs_createObject(objectCode) {
	var container = document.createElement('span');
	container.innerHTML = objectCode;
	return container.firstChild;
}
