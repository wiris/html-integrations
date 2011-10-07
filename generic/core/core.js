// Vars
var _wrs_currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf('/') + 1);
var _wrs_editMode;
var _wrs_isNewElement = true;
var _wrs_temporalImage;
var _wrs_temporalFocusElement;

var _wrs_xmlCharacters = {
	'tagOpener': '<',		// \x3C
	'tagCloser': '>',		// \x3E
	'doubleQuote': '"',		// \x22
	'ampersand': '&',		// \x26
	'quote': '\''			// \x27
};

var _wrs_safeXmlCharacters = {
	'tagOpener': '«',		// \xAB
	'tagCloser': '»',		// \xBB
	'doubleQuote': '¨',		// \xA8
	'ampersand': '§',		// \xA7
	'quote': '`'			// \xB4
};

var _wrs_safeXmlCharactersEntities = {
	'tagOpener': '&laquo;',
	'tagCloser': '&raquo;',
	'doubleQuote': '&uml;'
}

var _wrs_staticNodeLengths = {
	'IMG': 1,
	'BR': 1
}

/**
 * Adds element events.
 * @param object target Target
 * @param function doubleClickHandler Function to run when user double clicks the element
 * @param function mousedownHandler Function to run when user mousedowns the element
 * @param function mouseupHandler Function to run when user mouseups the element
 */
function wrs_addElementEvents(target, doubleClickHandler, mousedownHandler, mouseupHandler) {
	if (doubleClickHandler) {
		wrs_addEvent(target, 'dblclick', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			doubleClickHandler(target, element, realEvent);
		});
	}
	
	if (mousedownHandler) {
		wrs_addEvent(target, 'mousedown', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			_wrs_temporalFocusElement = element;
			mousedownHandler(target, element, realEvent);
		});
	}
	
	if (mouseupHandler) {
		wrs_addEvent(target, 'mouseup', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			mouseupHandler(target, element, realEvent);
		});
	}
}

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
	wrs_addElementEvents(iframe.contentWindow.document, function (target, element, event) {
			doubleClickHandler(iframe, element, event);
		}, function (target, element, event) {
			mousedownHandler(iframe, element, event);
		}, function (target, element, event) {
			mouseupHandler(iframe, element, event);
		}
	);
}

/**
 * Adds textarea events.
 * @param object textarea Target
 * @param function clickHandler Function to run when user clicks the textarea.
 */
function wrs_addTextareaEvents(textarea, clickHandler) {
	if (clickHandler) {
		wrs_addEvent(textarea, 'click', function (event) {
			var realEvent = (event) ? event : window.event;
			clickHandler(textarea, realEvent);
		});
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
	imgObject.title = 'Double click to edit';
	imgObject.src = imageSrc;
	imgObject.align = 'middle';
	imgObject.width = imageWidth;
	imgObject.height = imageHeight;
	imgObject.setAttribute(_wrs_conf_CASMathmlAttribute, wrs_mathmlEncode(appletCode));
	imgObject.className = 'Wiriscas';
	
	return imgObject;
}

/**
 * Checks if a determined array contains a determined element.
 * @param array stack
 * @param object element
 * @return bool
 */
function wrs_arrayContains(stack, element) {
	for (var i = stack.length - 1; i >= 0; --i) {
		if (stack[i] == element) {
			return true;
		}
	}
	
	return false;
}

/**
 * Checks if an element contains a class.
 * @param object element
 * @param string className
 * @return bool
 */
function wrs_containsClass(element, className) {
	var currentClasses = element.className.split(' ');
	
	for (var i = currentClasses.length - 1; i >= 0; --i) {
		if (currentClasses[i] == className) {
			return true;
		}
	}
	
	return false;
}

/**
 * Cross-browser solution for creating new elements.
 * 
 * It fixes some browser bugs.
 *
 * @param string elementName The tag name of the wished element.
 * @param object attributes An object where each key is a wished attribute name and each value is its value.
 * @param object creator Optional param. If supplied, this function will use the "createElement" method from this param. Else, "document" will be used.
 * @return object The DOM element with the specified attributes assignated.
 */
function wrs_createElement(elementName, attributes, creator) {
	if (attributes === undefined) {
		attributes = {};
	}
	
	if (creator === undefined) {
		creator = document;
	}
	
	var element;
	
	/*
	 * Internet Explorer fix:
	 * If you create a new object dynamically, you can't set a non-standard attribute.
	 * For example, you can't set the "src" attribute on an "applet" object.
	 * Other browsers will throw an exception and will run the standard code.
	 */
	
	try {
		var html = '<' + elementName;
		
		for (var attributeName in attributes) {
			html += ' ' + attributeName + '="' + wrs_htmlentities(attributes[attributeName]) + '"';
		}
		
		html += '>';
		element = creator.createElement(html);
	}
	catch (e) {
		element = creator.createElement(elementName);
		
		for (var attributeName in attributes) {
			element.setAttribute(attributeName, attributes[attributeName]);
		}
	}
	
	return element;
}

/**
 * Cross-browser httpRequest creation.
 * @return object
 */
function wrs_createHttpRequest() {
	if (typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	}
			
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
	
	return false;
}

/**
 * Gets CAS image src with AJAX.
 * @param string image Base 64 image stream
 * @return string
 */
function wrs_createImageCASSrc(image, appletCode) {
	var data = {
		'image': image,
		'mml': appletCode
	};
	
	return wrs_getContent(_wrs_conf_createcasimagePath, data);
}

/**
 * Gets formula image src with AJAX.
 * @param mathml Mathml code
 * @param wirisProperties
 * @return string Image src
 */
function wrs_createImageSrc(mathml, wirisProperties) {
	var data = (wirisProperties) ? wirisProperties : {};
	data['mml'] = mathml;
	
	if (window._wrs_conf_useDigestInsteadOfMathml && _wrs_conf_useDigestInsteadOfMathml) {
		data['returnDigest'] = 'true';
	}
	
	return wrs_getContent(_wrs_conf_createimagePath, data);
}

/**
 * Creates new object using its html code.
 * @param string objectCode
 * @return object
 */
function wrs_createObject(objectCode, creator) {
	if (creator === undefined) {
		creator = document;
	}

	// Internet Explorer can't include "param" tag when is setting an innerHTML property.
	objectCode = objectCode.split('<applet ').join('<span wirisObject="WirisApplet" ').split('<APPLET ').join('<span wirisObject="WirisApplet" ');	// It is a 'span' because 'span' objects can contain 'br' nodes.
	objectCode = objectCode.split('</applet>').join('</span>').split('</APPLET>').join('</span>');
	
	objectCode = objectCode.split('<param ').join('<br wirisObject="WirisParam" ').split('<PARAM ').join('<br wirisObject="WirisParam" ');			// It is a 'br' because 'br' can't contain nodes.
	objectCode = objectCode.split('</param>').join('</br>').split('</PARAM>').join('</br>');
	
	var container = wrs_createElement('div', {}, creator);
	container.innerHTML = objectCode;
	
	function recursiveParamsFix(object) {
		if (object.getAttribute && object.getAttribute('wirisObject') == 'WirisParam') {
			var attributesParsed = {};
			
			for (var i = 0; i < object.attributes.length; ++i) {
				if (object.attributes[i].nodeValue !== null) {
					attributesParsed[object.attributes[i].nodeName] = object.attributes[i].nodeValue;
				}
			}
			
			var param = wrs_createElement('param', attributesParsed, creator);
			
			// IE fix
			if (param.NAME) {
				param.name = param.NAME;
				param.value = param.VALUE;
			}
			
			param.removeAttribute('wirisObject');
			object.parentNode.replaceChild(param, object);
		}
		else if (object.getAttribute && object.getAttribute('wirisObject') == 'WirisApplet') {
			var attributesParsed = {};
			
			for (var i = 0; i < object.attributes.length; ++i) {
				if (object.attributes[i].nodeValue !== null) {
					attributesParsed[object.attributes[i].nodeName] = object.attributes[i].nodeValue;
				}
			}
			
			var applet = wrs_createElement('applet', attributesParsed, creator);
			applet.removeAttribute('wirisObject');
			
			for (var i = 0; i < object.childNodes.length; ++i) {
				recursiveParamsFix(object.childNodes[i]);

				if (object.childNodes[i].nodeName.toLowerCase() == 'param') {
					applet.appendChild(object.childNodes[i]);
					--i;	// When we insert the object child into the applet, object loses one child.
				}
			}

			object.parentNode.replaceChild(applet, object);
		}
		else {
			for (var i = 0; i < object.childNodes.length; ++i) {
				recursiveParamsFix(object.childNodes[i]);
			}
		}
	}
	
	recursiveParamsFix(container);
	return container.firstChild;
}

/**
 * Converts an object to its HTML code.
 * @param object object
 * @return string
 */
function wrs_createObjectCode(object) {
	if (object.nodeType == 1) {		// ELEMENT_NODE
		var output = '<' + object.tagName;

		for (var i = 0; i < object.attributes.length; ++i) {
			if (object.attributes[i].specified) {
				output += ' ' + object.attributes[i].name + '="' + wrs_htmlentities(object.attributes[i].value) + '"';
			}
		}
		
		if (object.childNodes.length > 0) {
			output += '>';
			
			for (var i = 0; i < object.childNodes.length; ++i) {
				output += wrs_createObjectCode(object.childNodes[i]);
			}
			
			output += '</' + object.tagName + '>';
		}
		else if (object.nodeName == 'DIV' || object.nodeName == 'SCRIPT') {
			output += '></' + object.tagName + '>';
		}
		else {
			output += '/>';
		}

		return output;
	}
	
	if (object.nodeType == 3) {		// TEXT_NODE
		return wrs_htmlentities(object.nodeValue);
	}
	
	return '';
}

/**
 * Parses end HTML code.
 * @param string code
 * @return string
 */
function wrs_endParse(code, wirisProperties) {
	code = wrs_endParseEditMode(code);
	return wrs_endParseSaveMode(code);
}

/**
 * Parses end HTML code depending on the edit mode.
 * @param string code
 * @return string
 */
function wrs_endParseEditMode(code, wirisProperties) {
	if (window._wrs_conf_parseModes !== undefined && wrs_arrayContains(_wrs_conf_parseModes, 'latex')) {
		var output = '';
		var endPosition = 0;
		var startPosition = code.indexOf('$$');
		
		while (startPosition != -1) {
			output += code.substring(endPosition, startPosition);
			endPosition = code.indexOf('$$', startPosition + 2);
			
			if (endPosition == -1) {
				endPosition = code.length;
			}
			else {
				var latex = code.substring(startPosition + 2, endPosition);
				latex = wrs_htmlentitiesDecode(latex);
				var mathml = wrs_getMathMLFromLatex(latex, true);
				var imgObject = wrs_mathmlToImgObject(document, mathml, wirisProperties);
				output += wrs_createObjectCode(imgObject);
				endPosition += 2;
			}
			
			startPosition = code.indexOf('$$', endPosition);
		}
		
		output += code.substring(endPosition, code.length);
		return output;
	}
	
	return code;
}

/**
 * Parses end HTML code depending on the save mode.
 * @param string code
 * @return string
 */
function wrs_endParseSaveMode(code) {
	var output = '';
	var convertToXml = false;
	var convertToSafeXml = false;
	
	if (window._wrs_conf_saveMode) {
		if (_wrs_conf_saveMode == 'safeXml') {
			convertToXml = true;
			convertToSafeXml = true;
		}
		else if (_wrs_conf_saveMode == 'xml') {
			convertToXml = true;
		}
	}
	
	var upperCaseCode = code.toUpperCase();
	var endPosition = 0;
	var startPosition = upperCaseCode.indexOf('<IMG');
	
	while (startPosition != -1) {
		output += code.substring(endPosition, startPosition);
		var i = startPosition + 1;
		
		while (i < code.length && endPosition <= startPosition) {
			var character = code.charAt(i);
			
			if (character == '"' || character == '\'') {
				var characterNextPosition = upperCaseCode.indexOf(character, i + 1);
				
				if (characterNextPosition == -1) {
					i = code.length;		// End while.
				}
				else {
					i = characterNextPosition;
				}
			}
			else if (character == '>') {
				endPosition = i + 1;
			}
			
			++i;
		}
		
		if (endPosition < startPosition) {		// The img tag is stripped.
			output += code.substring(startPosition, code.length);
			return output;
		}
		
		var imgCode = code.substring(startPosition, endPosition);
		output += wrs_getWIRISImageOutput(imgCode, convertToXml, convertToSafeXml);
		startPosition = upperCaseCode.indexOf('<IMG', endPosition);
	}
	
	output += code.substring(endPosition, code.length);
	return output;
}

/**
 * Gets the formula mathml or CAS appletCode using its image hash code.
 * @param string variableName Variable to send on POST query to the server.
 * @param string imageHashCode
 * @return string
 */
function wrs_getCode(variableName, imageHashCode) {
	var data = {};
	data[variableName] = imageHashCode;
	return wrs_getContent(_wrs_conf_getmathmlPath, data);
}

/**
 * Gets the content from an URL.
 * @param string url
 * @param object postVariables Null if a GET query should be done.
 * @return string
 */
function wrs_getContent(url, postVariables) {
	var httpRequest = wrs_createHttpRequest();
	
	if (httpRequest) {
		if (url.substr(0, 1) == '/' || url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://') {
			httpRequest.open('POST', url, false);
		}
		else {
			httpRequest.open('POST', _wrs_currentPath + url, false);
		}
		
		if (postVariables !== undefined) {
			httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
			httpRequest.send(wrs_httpBuildQuery(postVariables));
		}
		else {
			httpRequest.send(null);
		}
		
		return httpRequest.responseText;
	}
	
	alert('Your browser is not compatible with AJAX technology. Please, use the latest version of Mozilla Firefox.');
	return '';
}

/**
 * Generates the innerHTML of an element.
 * @param object element
 * @return string
 */
function wrs_getInnerHTML(element) {
	var innerHTML = '';
	
	for (var i = 0; i < element.childNodes.length; ++i) {
		innerHTML += wrs_createObjectCode(element.childNodes[i]);
	}
	
	return innerHTML;
}

/**
 * Converts MathML to LaTeX.
 * @param string mathml
 * @return string
 */
function wrs_getLatexFromMathML(mathml) {
	var data = {
		'mml': mathml
	};
	
	return wrs_getContent(_wrs_conf_getlatexPath, data);
}

/**
 * Extracts the latex of a determined position in a text.
 * @param string text
 * @param int caretPosition
 * @return object An object with 3 keys: 'latex', 'start' and 'end'. Null if latex is not found.
 */
function wrs_getLatexFromTextNode(textNode, caretPosition) {
	// Looking for the first textNode.
	var startNode = textNode;
	
	while (startNode.previousSibling && startNode.previousSibling.nodeType == 3) {		// TEXT_NODE
		startNode = startNode.previousSibling;
	}
	
	// Finding latex.
	
	function getNextLatexPosition(currentNode, currentPosition) {
		var position = currentNode.nodeValue.indexOf('$$', currentPosition);
		
		while (position == -1) {
			currentNode = currentNode.nextSibling;
			
			if (!currentNode || currentNode.nodeType != 3) {		// TEXT_NODE
				return null;		// Not found.
			}
			
			position = currentNode.nodeValue.indexOf('$$');
		}
		
		return {
			'node': currentNode,
			'position': position
		};
	}
	
	function isPrevious(node, position, endNode, endPosition) {
		if (node == endNode) {
			return (position <= endPosition);
		}
		
		while (node && node != endNode) {
			node = node.nextSibling;
		}
		
		return (node == endNode);
	}
	
	var start;
	
	var end = {
		'node': startNode,
		'position': 0
	};
	
	do {
		var start = getNextLatexPosition(end.node, end.position);
		
		if (start == null || isPrevious(textNode, caretPosition, start.node, start.position)) {
			return null;
		}
		
		var end = getNextLatexPosition(start.node, start.position + 2);
		
		if (end == null) {
			return null;
		}
		
		end.position += 2;
	} while (isPrevious(end.node, end.position, textNode, caretPosition));
	
	// Isolating latex.
	var latex;
	
	if (start.node == end.node) {
		latex = start.node.nodeValue.substring(start.position + 2, end.position - 2);
	}
	else {
		latex = start.node.nodeValue.substring(start.position + 2, start.node.nodeValue.length);
		var currentNode = start.node;
		
		do {
			currentNode = currentNode.nextSibling;
			
			if (currentNode == end.node) {
				latex += end.node.nodeValue.substring(0, end.position - 2);
			}
			else {
				latex += currentNode.nodeValue;
			}
		} while (currentNode != end.node);
	}
	
	return {
		'latex': latex,
		'startNode': start.node,
		'startPosition': start.position,
		'endNode': end.node,
		'endPosition': end.position
	};
}

/**
 * Converts LaTeX to MathML.
 * @param string latex
 * @return string
 */
function wrs_getMathMLFromLatex(latex, includeLatexOnSemantics) {
	var data = {
		'latex': latex
	};
	
	if (includeLatexOnSemantics) {
		data['saveLatex'] = '';
	}
	
	var mathML = wrs_getContent(_wrs_conf_getmathmlPath, data);
	return mathML.split("\r").join('').split("\n").join('');
}

/**
 * Gets the node length in characters.
 * @param object node
 * @return int
 */
function wrs_getNodeLength(node) {
	if (node.nodeType == 3) {		// TEXT_NODE
		return node.nodeValue.length;
	}
	
	if (node.nodeType == 1) {		// ELEMENT_NODE
		var length = _wrs_staticNodeLengths[node.nodeName.toUpperCase()];
		
		if (length === undefined) {
			length = 0;
		}
		
		for (var i = 0; i < node.childNodes.length; ++i) {
			length += wrs_getNodeLength(node.childNodes[i]);
		}
		
		return length;
	}
	
	return 0;
}

/**
 * Gets the selected node or text.
 * If the caret is on a text node, concatenates it with all the previous and next text nodes.
 * @param object target The editable element
 * @param boolean isIframe Specifies if the target is an iframe or not
 * @return object An object with the 'node' key setted if the item is an element or the keys 'node' and 'caretPosition' if the element is text
 */
function wrs_getSelectedItem(target, isIframe) {
	var windowTarget;
	
	if (isIframe) {
		windowTarget = target.contentWindow;
		windowTarget.focus();
	}
	else {
		windowTarget = window;
		target.focus();
	}
	
	if (document.selection) {
		var range = windowTarget.document.selection.createRange();

		if (range.parentElement) {
			if (range.text.length > 0) {
				return null;
			}

			windowTarget.document.execCommand('InsertImage', false, '#');
			var temporalObject = range.parentElement();
			
			if (temporalObject.nodeName.toUpperCase() != 'IMG') {
				// IE9 fix: parentElement() does not return the IMG node, returns the parent DIV node. In IE < 9, pasteHTML does not work well.
				range.pasteHTML('<span id="wrs_openEditorWindow_temporalObject"></span>');
				temporalObject = windowTarget.document.getElementById('wrs_openEditorWindow_temporalObject');
			}
			
			var node;
			var caretPosition;
			
			if (temporalObject.nextSibling && temporalObject.nextSibling.nodeType == 3) {				// TEXT_NODE
				node = temporalObject.nextSibling;
				caretPosition = 0;
			}
			else if (temporalObject.previousSibling && temporalObject.previousSibling.nodeType == 3) {	// TEXT_NODE
				node = temporalObject.previousSibling;
				caretPosition = node.nodeValue.length;
			}
			else {
				node = windowTarget.document.createTextNode('');
				temporalObject.parentNode.insertBefore(node, temporalObject);
				caretPosition = 0;
			}
			
			temporalObject.parentNode.removeChild(temporalObject);
			
			return {
				'node': node,
				'caretPosition': caretPosition
			};
		}
		
		if (range.length > 1) {
			return null;
		}
		
		return {
			'node': range.item(0)
		};
	}
	
	var selection = windowTarget.getSelection();
	
	try {
		var range = selection.getRangeAt(0);
	}
	catch (e) {
		var range = windowTarget.document.createRange();
	}
	
	var node = range.startContainer;
	
	if (node.nodeType == 3) {		// TEXT_NODE
		if (range.startOffset != range.endOffset) {
			return null;
		}
		
		return {
			'node': node,
			'caretPosition': range.startOffset
		};
	}
	
	if (node.nodeType == 1) {	// ELEMENT_NODE
		var position = range.startOffset;
		
		if (node.childNodes[position]) {
			return {
				'node': node.childNodes[position]
			};
		}
	}
	
	return null;
}

/**
 * Converts the HTML of a image into the output code that WIRIS must return.
 * @param string imgCode
 * @return string
 */
function wrs_getWIRISImageOutput(imgCode, convertToXml, convertToSafeXml) {
	var imgObject = wrs_createObject(imgCode);
	
	if (imgObject) {
		if (imgObject.className == 'Wirisformula') {
			if (!convertToXml) {
				return imgCode;
			}
			
			var xmlCode = imgObject.getAttribute(_wrs_conf_imageMathmlAttribute);
			
			if (!convertToSafeXml) {
				xmlCode = wrs_mathmlDecode(xmlCode);
			}
			
			return xmlCode;
		}
		else if (imgObject.className == 'Wiriscas') {
			var appletCode = imgObject.getAttribute(_wrs_conf_CASMathmlAttribute);
			appletCode = wrs_mathmlDecode(appletCode);
			var appletObject = wrs_createObject(appletCode);
			appletObject.setAttribute('src', imgObject.src);
			var object = appletObject;
			var appletCodeToBeInserted = wrs_createObjectCode(appletObject);
			
			if (convertToSafeXml) {
				appletCodeToBeInserted = wrs_mathmlEncode(appletCodeToBeInserted);
			}
			
			return appletCodeToBeInserted;
		}
	}
	
	return imgCode;
}

/**
 * Parses a text and replaces all HTML special characters by their entities.
 * @param string input
 * @return string
 */
function wrs_htmlentities(input) {
    return input.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
}

/**
 * Parses a text and replaces all the HTML entities by their characters.
 * @param string input
 * @return string
 */
function wrs_htmlentitiesDecode(input) {
	return input.split('&quot;').join('"').split('&gt;').join('>').split('&lt;').join('<').split('&amp;').join('&');
}

/**
 * Converts a hash to a HTTP query.
 * @param hash properties
 * @return string
 */
function wrs_httpBuildQuery(properties) {
	var result = '';
	
	for (i in properties) {
		if (properties[i] != null) {
			result += wrs_urlencode(i) + '=' + wrs_urlencode(properties[i]) + '&';
		}
	}
	
	return result;
}

/**
 * Parses initial HTML code.
 * @param string code
 * @return string
 */
function wrs_initParse(code) {
	code = wrs_initParseEditMode(code);
	return wrs_initParseSaveMode(code);
}

/**
 * Parses initial HTML code depending on the edit mode.
 * @param string code
 * @return string
 */
function wrs_initParseEditMode(code) {
	var container = wrs_createObject('<div>' + code + '</div>');
	var imgList = container.getElementsByTagName('img');
	var token = 'encoding="LaTeX">';
	
	for (var i = 0; i < imgList.length; ++i) {
		if (imgList[i].className == 'Wirisformula') {
			var mathml = wrs_mathmlDecode(imgList[i].getAttribute(_wrs_conf_CASMathmlAttribute));
			var latexStartPosition = mathml.indexOf(token);
			
			if (latexStartPosition != -1) {
				latexStartPosition += token.length;
				var latexEndPosition = mathml.indexOf('</annotation>', latexStartPosition);
				var latex = mathml.substring(latexStartPosition, latexEndPosition);
				var textNode = document.createTextNode('$$' + wrs_htmlentitiesDecode(latex) + '$$');
				imgList[i].parentNode.replaceChild(textNode, imgList[i]);
				--i;		// An image has been replaced.
			}
		}
	}
	
	return container.innerHTML;
}

/**
 * Parses initial HTML code depending on the save mode.
 * @param string code
 * @return string
 */
function wrs_initParseSaveMode(code) {
	if (window._wrs_conf_saveMode) {
		var safeXml = (_wrs_conf_saveMode == 'safeXml');
		var characters = _wrs_xmlCharacters;
		
		if (safeXml) {
			characters = _wrs_safeXmlCharacters;
			code = wrs_parseSafeAppletsToObjects(code);
		}
		
		if (safeXml || _wrs_conf_saveMode == 'xml') {
			// Converting XML to tags.
			code = wrs_parseMathmlToImg(code, characters);
		}
	}
	
	var container = wrs_createObject('<div>' + code + '</div>');
	var appletList = container.getElementsByTagName('applet');
	
	for (var i = 0; i < appletList.length; ++i) {
		if (appletList[i].className == 'Wiriscas' || appletList[i].getAttribute('class') == 'Wiriscas') {		// Internet Explorer can't read className correctly
			var imgObject = wrs_createElement('img');
			imgObject.title = 'Double click to edit';
			imgObject.src = appletList[i].getAttribute('src');
			imgObject.align = 'middle';
			
			var appletCode = wrs_createObjectCode(appletList[i]);
			imgObject.setAttribute(_wrs_conf_CASMathmlAttribute, wrs_mathmlEncode(appletCode));
			imgObject.className = 'Wiriscas';
			
			appletList[i].parentNode.replaceChild(imgObject, appletList[i]);
			--i;		// An applet has been replaced.
		}
	}
	
	return container.innerHTML;
}

/**
 * Replaces a selection with an element.
 * @param object element Element
 * @param object focusElement Element to be focused
 * @param object windowTarget Target
 */
function wrs_insertElementOnSelection(element, focusElement, windowTarget) {
	try {
		focusElement.focus();
		
		if (_wrs_isNewElement) {
			if (document.selection) {
				var range = windowTarget.document.selection.createRange();
				windowTarget.document.execCommand('InsertImage', false, element.src);

				if (range.parentElement) {
					var temporalObject = range.parentElement();
					
					if (temporalObject.nodeName.toUpperCase() == 'IMG') {
						temporalObject.parentNode.replaceChild(element, temporalObject);
					}
					else {
						// IE9 fix: parentNode() does not return the IMG node, returns the parent DIV node. In IE < 9, pasteHTML does not work well.
						range.pasteHTML(wrs_createObjectCode(element));
					}
				}
			}
			else {
				var selection = windowTarget.getSelection();
				
				try {
					var range = selection.getRangeAt(0);
				}
				catch (e) {
					var range = windowTarget.document.createRange();
				}
				
				selection.removeAllRanges();
				range.deleteContents();
				
				var node = range.startContainer;
				var position = range.startOffset;
				
				if (node.nodeType == 3) {		// TEXT_NODE
					node = node.splitText(position);
					node.parentNode.insertBefore(element, node);
				}
				else if (node.nodeType == 1) {	// ELEMENT_NODE
					node.insertBefore(element, node.childNodes[position]);
				}
			}
		}
		else if (_wrs_temporalRange) {
			if (document.selection) {
				_wrs_isNewElement = true;
				_wrs_temporalRange.select();
				wrs_insertElementOnSelection(element, focusElement, windowTarget);
			}
			else {
				var parentNode = _wrs_temporalRange.startContainer;
				_wrs_temporalRange.deleteContents();
				_wrs_temporalRange.insertNode(element);
			}
		}
		else {
			_wrs_temporalImage.parentNode.replaceChild(element, _wrs_temporalImage);
		}
	}
	catch (e) {
	}
}

/**
 * WIRIS special encoding.
 * We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
 * @param string input
 * @return string
 */
function wrs_mathmlDecode(input) {
	// Decoding entities.
	input = input.split(_wrs_safeXmlCharactersEntities.tagOpener).join(_wrs_safeXmlCharacters.tagOpener);
	input = input.split(_wrs_safeXmlCharactersEntities.tagCloser).join(_wrs_safeXmlCharacters.tagCloser);
	input = input.split(_wrs_safeXmlCharactersEntities.doubleQuote).join(_wrs_safeXmlCharacters.doubleQuote);

	// Decoding characters.
	input = input.split(_wrs_safeXmlCharacters.tagOpener).join(_wrs_xmlCharacters.tagOpener);
	input = input.split(_wrs_safeXmlCharacters.tagCloser).join(_wrs_xmlCharacters.tagCloser);
	input = input.split(_wrs_safeXmlCharacters.doubleQuote).join(_wrs_xmlCharacters.doubleQuote);
	input = input.split(_wrs_safeXmlCharacters.ampersand).join(_wrs_xmlCharacters.ampersand);
	input = input.split(_wrs_safeXmlCharacters.quote).join(_wrs_xmlCharacters.quote);
	
	// We are replacing $ by & for retrocompatibility. Now, the standard is replace § by &
	input = input.split('$').join('&');
	
	return input;
}

/**
 * WIRIS special encoding.
 * We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
 * @param string input
 * @return string
 */
function wrs_mathmlEncode(input) {
	input = input.split(_wrs_xmlCharacters.tagOpener).join(_wrs_safeXmlCharacters.tagOpener);
	input = input.split(_wrs_xmlCharacters.tagCloser).join(_wrs_safeXmlCharacters.tagCloser);
	input = input.split(_wrs_xmlCharacters.doubleQuote).join(_wrs_safeXmlCharacters.doubleQuote);
	input = input.split(_wrs_xmlCharacters.ampersand).join(_wrs_safeXmlCharacters.ampersand);
	input = input.split(_wrs_xmlCharacters.quote).join(_wrs_safeXmlCharacters.quote);
	
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
 * Converts entities to symbols.
 * @param string mathml
 * @return string
 */
function wrs_mathmlEntitiesDecode(mathml) {
	mathml = mathml.split('&nbsp;').join(' ');
	var output = '';
	var parsing = false;
	var number;
	
	for (var i = 0; i < mathml.length; ++i) {
		var character = mathml.charAt(i);
		
		if (parsing) {
			if (character == '#') {
				number = '';
			}
			else if (character == ';') {
				if (number.charAt(0) == 'x') {
					number = parseInt('0' + number, 16);
				}
				
				output += String.fromCharCode(number);
				parsing = false;
			}
			else {
				number += character;
			}
		}
		else if (character == '&') {
			parsing = true;
		}
		else {
			output += character;
		}
	}
	
	return output;
}

/**
 * Converts mathml to img object.
 * @param object creator Object with "createElement" method
 * @param string mathml Mathml code
 * @return object
 */
function wrs_mathmlToImgObject(creator, mathml, wirisProperties) {
	var imgObject = creator.createElement('img');
	imgObject.title = 'Double click to edit';
	imgObject.align = 'middle';
	imgObject.className = 'Wirisformula';
	
	var result = wrs_createImageSrc(mathml, wirisProperties);
	
	if (window._wrs_conf_useDigestInsteadOfMathml && _wrs_conf_useDigestInsteadOfMathml) {
		var parts = result.split(':', 2);
		imgObject.setAttribute(_wrs_conf_imageMathmlAttribute, parts[0]);
		imgObject.src = parts[1];
	}
	else {
		imgObject.setAttribute(_wrs_conf_imageMathmlAttribute, wrs_mathmlEncode(mathml));
		imgObject.src = result;
	}
	
	return imgObject;
}

/**
 * Opens a new CAS window.
 * @param object target The editable element
 * @param boolean isIframe Specifies if target is an iframe or not
 * @return object The opened window
 */
function wrs_openCASWindow(target, isIframe) {
	if (isIframe === undefined) {
		isIframe = true;
	}
	
	_wrs_temporalRange = null;
	
	if (target) {
		var selectedItem = wrs_getSelectedItem(target, isIframe);
		
		if (selectedItem != null && selectedItem.caretPosition === undefined && selectedItem.node.nodeName.toUpperCase() == 'IMG' && selectedItem.node.className == 'Wiriscas') {
			_wrs_temporalImage = selectedItem.node;
			_wrs_isNewElement = false;
		}
	}

	return window.open(_wrs_conf_CASPath, 'WIRISCAS', _wrs_conf_CASAttributes);
}

/**
 * Opens a new editor window.
 * @param string language Language code for the editor
 * @param object target The editable element
 * @param boolean isIframe Specifies if the target is an iframe or not
 * @return object The opened window
 */
function wrs_openEditorWindow(language, target, isIframe) {
	if (isIframe === undefined) {
		isIframe = true;
	}
	
	var path = _wrs_conf_editorPath;
	
	if (language) {
		path += '?lang=' + language;
	}
	
	_wrs_editMode = 'images';
	_wrs_temporalRange = null;
	
	if (target) {
		var selectedItem = wrs_getSelectedItem(target, isIframe);
		
		if (selectedItem != null) {
			if (selectedItem.caretPosition === undefined) {
				if (selectedItem.node.nodeName.toUpperCase() == 'IMG' && selectedItem.node.className == 'Wirisformula') {
					_wrs_temporalImage = selectedItem.node;
					_wrs_isNewElement = false;
				}
			}
			else {
				var latexResult = wrs_getLatexFromTextNode(selectedItem.node, selectedItem.caretPosition);

				if (latexResult != null) {
					_wrs_editMode = 'latex';
					
					var mathml = wrs_getMathMLFromLatex(latexResult.latex);
					_wrs_isNewElement = false;
					
					_wrs_temporalImage = document.createElement('img');
					_wrs_temporalImage.setAttribute(_wrs_conf_imageMathmlAttribute, wrs_mathmlEncode(mathml));
					var windowTarget = (isIframe) ? target.contentWindow : window;
					
					if (document.selection) {
						var leftOffset = 0;
						var previousNode = latexResult.startNode.previousSibling;
						
						while (previousNode) {
							leftOffset += wrs_getNodeLength(previousNode);
							previousNode = previousNode.previousSibling;
						}
					
						_wrs_temporalRange = windowTarget.document.selection.createRange();
						_wrs_temporalRange.moveToElementText(latexResult.startNode.parentNode);
						_wrs_temporalRange.move('character', leftOffset + latexResult.startPosition);
						_wrs_temporalRange.moveEnd('character', latexResult.latex.length + 4);		// +4 for the '$$' characters.
					}
					else {
						_wrs_temporalRange = windowTarget.document.createRange();
						_wrs_temporalRange.setStart(latexResult.startNode, latexResult.startPosition);
						_wrs_temporalRange.setEnd(latexResult.endNode, latexResult.endPosition);
					}
				}
			}
		}
	}
	
	return window.open(path, 'WIRISeditor', _wrs_conf_editorAttributes);
}

/**
 * Converts all occurrences of mathml code to the corresponding image.
 * @param string content
 * @return string
 */
function wrs_parseMathmlToImg(content, characters) {
	var output = '';
	var mathTagBegin = characters.tagOpener + 'math';
	var mathTagEnd = characters.tagOpener + '/math' + characters.tagCloser;
	var start = content.indexOf(mathTagBegin);
	var end = 0;
	
	while (start != -1) {
		output += content.substring(end, start);
		end = content.indexOf(mathTagEnd, start);
		
		if (end == -1) {
			end = content.length - 1;
		}
		else {
			end += mathTagEnd.length;
		}
		
		var mathml = content.substring(start, end);
		mathml = (characters == _wrs_safeXmlCharacters) ? wrs_mathmlDecode(mathml) : wrs_mathmlEntities(mathml);
		output += wrs_createObjectCode(wrs_mathmlToImgObject(document, mathml));
		start = content.indexOf(mathTagBegin, end);
	}
	
	output += content.substring(end, content.length);
	return output;
}

/**
 * Converts all occurrences of safe applet code to the corresponding code.
 * @param string content
 * @return string
 */
function wrs_parseSafeAppletsToObjects(content) {
	var output = '';
	var appletTagBegin = _wrs_safeXmlCharacters.tagOpener + 'APPLET';
	var appletTagEnd = _wrs_safeXmlCharacters.tagOpener + '/APPLET' + _wrs_safeXmlCharacters.tagCloser;
	var upperCaseContent = content.toUpperCase();
	var start = upperCaseContent.indexOf(appletTagBegin);
	var end = 0;
	
	while (start != -1) {
		output += content.substring(end, start);
		end = upperCaseContent.indexOf(appletTagEnd, start);
		
		if (end == -1) {
			end = content.length - 1;
		}
		else {
			end += appletTagEnd.length;
		}
		
		output += wrs_mathmlDecode(content.substring(start, end));
		start = upperCaseContent.indexOf(appletTagBegin, end);
	}
	
	output += content.substring(end, content.length);
	return output;
}

/**
 * Cross-browser removeEventListener/detachEvent function.
 * @param object element Element target
 * @param event event Event
 * @param function func Function to run
 */
function wrs_removeEvent(element, event, func) {
	if (element.removeEventListener) {
		element.removeEventListener(event, func, false);
	}
	else if (element.detachEvent) {
		element.detachEvent('on' + event, func);
	}
}

/**
 * Inserts or modifies CAS.
 * @param object focusElement Element to be focused
 * @param object windowTarget Window where the editable content is
 * @param string appletCode Applet code
 * @param string image Base 64 image stream
 * @param int imageWidth Image width
 * @param int imageHeight Image height
 */
function wrs_updateCAS(focusElement, windowTarget, appletCode, image, imageWidth, imageHeight) {
	var imgObject = wrs_appletCodeToImgObject(windowTarget.document, appletCode, image, imageWidth, imageHeight);
	wrs_insertElementOnSelection(imgObject, focusElement, windowTarget);
}

/**
 * Inserts or modifies formulas.
 * @param object focusElement Element to be focused
 * @param object windowTarget Window where the editable content is
 * @param string mathml Mathml code
 */
function wrs_updateFormula(focusElement, windowTarget, mathml, wirisProperties, editMode) {
	if (editMode == 'latex') {
		var latex = wrs_getLatexFromMathML(mathml);
		var textNode = windowTarget.document.createTextNode('$$' + latex + '$$');
		wrs_insertElementOnSelection(textNode, focusElement, windowTarget);
	}
	else {
		var imgObject = wrs_mathmlToImgObject(windowTarget.document, mathml, wirisProperties);
		wrs_insertElementOnSelection(imgObject, focusElement, windowTarget);
	}
}

/**
 * Inserts or modifies formulas or CAS on a textarea.
 * @param object textarea Target
 * @param string text Text to add in the textarea. For example, if you want to add the link to the image, you can call this function as wrs_updateTextarea(textarea, wrs_createImageSrc(mathml));
 */
function wrs_updateTextarea(textarea, text) {
	if (textarea && text) {
		textarea.focus();
		
		if (textarea.selectionStart != null) {
			textarea.value = textarea.value.substring(0, textarea.selectionStart) + text + textarea.value.substring(textarea.selectionEnd, textarea.value.length);
		}
		else {
			var selection = document.selection.createRange();
			selection.text = text;
		}
	}
}

/**
 * URL decode function.
 * @param string input
 * @return string
 */
function wrs_urldecode(input) {
	return decodeURIComponent(input);
}

/**
 * URL encode function.
 * @param string clearString Input.
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
