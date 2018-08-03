import Parser from './parser';
import MathML from './mathml';
import Configuration from './configuration';

/**
 * This class represents an utility class.
 */
export default class Util {
    /**
     * Fires an element event.
     * @param {object} element element where event should be fired.
     * @param {string} event event to fire.
     * @ignore
     */
    static fireEvent(element, event) {
        if (document.createEvent){
            var eventObject = document.createEvent('HTMLEvents');
            eventObject.initEvent(event, true, true);
            return !element.dispatchEvent(eventObject);
        }

        var eventObject = document.createEventObject();
        return element.fireEvent('on' + event, eventObject)
    }

    /**
     * Cross-browser addEventListener/attachEvent function.
     * @param {object} element Element target
     * @param {event} event Event
     * @param {function} func Function to run
     * @ignore
     */
    static addEvent(element, event, func) {
        if (element.addEventListener) {
            element.addEventListener(event, func, true);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, func);
        }
    }

    /**
     * Cross-browser removeEventListener/detachEvent function.
     * @param {object} element Element target
     * @param {event} event Event
     * @param {function} func Function to run
     * @ignore
     */
    static removeEvent(element, event, func) {
        if (element.removeEventListener) {
            element.removeEventListener(event, func, true);
        }
        else if (element.detachEvent) {
            element.detachEvent('on' + event, func);
        }
    }

    /**
     * Adds element events.
     * @param {object} target Target
     * @param {function} doubleClickHandler Function to run when user double clicks the element
     * @param {function} mousedownHandler Function to run when user mousedowns the element
     * @param {function} mouseupHandler Function to run when user mouseups the element
     * @ignore
     */
    static addElementEvents(target, doubleClickHandler, mousedownHandler, mouseupHandler) {
        if (doubleClickHandler) {
            Util.addEvent(target, 'dblclick', function (event) {
                var realEvent = (event) ? event : window.event;
                var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
                doubleClickHandler(element, realEvent);
            });
        }

        if (mousedownHandler) {
            Util.addEvent(target, 'mousedown', function (event) {
                var realEvent = (event) ? event : window.event;
                var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
                mousedownHandler(element, realEvent);
            });
        }

        if (mouseupHandler) {
            Util.addEvent(target, 'mouseup', function (event) {
                var realEvent = (event) ? event : window.event;
                var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
                mouseupHandler(element, realEvent);
            });
        }
    }

    /**
     * Checks if a determined array contains a determined element.
     * @param {array} stack
     * @param {object} element
     * @return bool
     * @ignore
     */
    static arrayContains(stack, element) {
        for (var i = stack.length - 1; i >= 0; --i) {
            if (stack[i] === element) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Adds a specific className to given element
     * @param  {object} element
     * @param  {string} className
     * @ignore
     */
    static addClass(element, className) {
        if (!Util.containsClass(element, className)) {
            element.className += " " + className;
        }
    }

    /**
     * Checks if an element contains a class.
     * @param {object} element
     * @param {string} className
     * @return bool
     * @ignore
     */
    static containsClass(element, className) {
        if (element == null || !('className' in element)) {
            return false;
        }

        var currentClasses = element.className.split(' ');

        for (var i = currentClasses.length - 1; i >= 0; --i) {
            if (currentClasses[i] == className) {
                return true;
            }
        }

        return false;
    }

    /**
     * Remove a specific class
     * @param {object} element
     * @param {string} className
     * @ignore
     */
    static removeClass(element, className) {
        var newClassName = '';
        var classes = element.className.split(" ");

        for (var i = 0; i < classes.length; i++) {
            if(classes[i] != className) {
                newClassName += classes[i] + " ";
            }
        }
        element.className = newClassName.trim();
    }

    /**
     * Converts old xmlinitialtext attribute (with «») to the correct one(with §lt;§gt;)
     * @param {string} text String containtg safeXml characters
     * @return {string} String with the safeXml charaters parsed.
     * @ignore
     */
    static convertOldXmlinitialtextAttribute(text){
        // Used to fix a bug with Cas imported from Moodle 1.9 to Moodle 2.x.
        // This could be removed in future.
        var val = 'value=';

        var xitpos = text.indexOf('xmlinitialtext');
        var valpos = text.indexOf(val, xitpos);
        var quote = text.charAt(valpos + val.length);
        var startquote = valpos + val.length + 1;
        var endquote = text.indexOf(quote, startquote);

        var value = text.substring(startquote, endquote);

        var newvalue = value.split('«').join('§lt;');
        newvalue = newvalue.split('»').join('§gt;');
        newvalue = newvalue.split('&').join('§');
        newvalue = newvalue.split('¨').join('§quot;');

        text = text.split(value).join(newvalue);
        return text;
    }

    /**
     * Cross-browser solution for creating new elements.
     *
     * It fixes some browser bugs.
     *
     * @param {string} elementName The tag name of the wished element.
     * @param {object} attributes An object where each key is a wished attribute name and each value is its value.
     * @param {object} creator Optional param. If supplied, this function will use the "createElement" method from this param. Else, "document" will be used.
     * @return {object} The DOM element with the specified attributes assignated.
     * @ignore
     */
    static createElement(elementName, attributes, creator) {
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
                html += ' ' + attributeName + '="' + Util.htmlEntities(attributes[attributeName]) + '"';
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
     * Creates new object using its html code.
     * @param {string} objectCode html code
     * @return {object} html object.
     * @ignore
     */
    static createObject(objectCode, creator) {
        if (creator === undefined) {
            creator = document;
        }

        // Internet Explorer can't include "param" tag when is setting an innerHTML property.
        objectCode = objectCode.split('<applet ').join('<span wirisObject="WirisApplet" ').split('<APPLET ').join('<span wirisObject="WirisApplet" ');  // It is a 'span' because 'span' objects can contain 'br' nodes.
        objectCode = objectCode.split('</applet>').join('</span>').split('</APPLET>').join('</span>');

        objectCode = objectCode.split('<param ').join('<br wirisObject="WirisParam" ').split('<PARAM ').join('<br wirisObject="WirisParam" ');          // It is a 'br' because 'br' can't contain nodes.
        objectCode = objectCode.split('</param>').join('</br>').split('</PARAM>').join('</br>');

        var container = Util.createElement('div', {}, creator);
        container.innerHTML = objectCode;

        function recursiveParamsFix(object) {
            if (object.getAttribute && object.getAttribute('wirisObject') == 'WirisParam') {
                var attributesParsed = {};

                for (var i = 0; i < object.attributes.length; ++i) {
                    if (object.attributes[i].nodeValue !== null) {
                        attributesParsed[object.attributes[i].nodeName] = object.attributes[i].nodeValue;
                    }
                }

                var param = Util.createElement('param', attributesParsed, creator);

                // IE fix.
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

                var applet = Util.createElement('applet', attributesParsed, creator);
                applet.removeAttribute('wirisObject');

                for (var i = 0; i < object.childNodes.length; ++i) {
                    recursiveParamsFix(object.childNodes[i]);

                    if (object.childNodes[i].nodeName.toLowerCase() == 'param') {
                        applet.appendChild(object.childNodes[i]);
                        --i;    // When we insert the object child into the applet, object loses one child.
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
     * @param {object} object DOM object..
     * @return {string} HTML code.
     * @ignore
     */
    static createObjectCode(object) {

        // In case that the image was not created, the object can be null or undefined.
        if (typeof object == 'undefined' || object == null) {
            return;
        }

        if (object.nodeType == 1) { // ELEMENT_NODE.
            var output = '<' + object.tagName;

            for (var i = 0; i < object.attributes.length; ++i) {
                if (object.attributes[i].specified) {
                    output += ' ' + object.attributes[i].name + '="' + Util.htmlEntities(object.attributes[i].value) + '"';
                }
            }

            if (object.childNodes.length > 0) {
                output += '>';

                for (var i = 0; i < object.childNodes.length; ++i) {
                    output += Util.createObject(object.childNodes[i]);
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

        if (object.nodeType == 3) { // TEXT_NODE.
            return Util.htmlEntities(object.nodeValue);
        }

        return '';
    }

    /**
     * Concatenates to URL paths.
     * @param {string} path1 - first URL path
     * @param {string} path2 - second URL path
     * @returns {string} new URL.
     */
    static concatenateUrl(path1, path2) {
        var separator = "";
        if ((path1.indexOf("/") != path1.length) && (path2.indexOf("/") != 0)) {
            separator = "/";
        }
        return (path1 + separator + path2).replace(/([^:]\/)\/+/g, "$1");
    }

    /**
     * Parses a text and replaces all HTML special characters by their entities.
     * @param {string} input Text to be paresed.
     * @return {string} the input text with all their special characters replaced by their entities.
     * @ignore
     */
    static htmlEntities(input) {
        return input.split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;');
    }

    /**
     * Parses a text and replaces all the HTML entities by their characters.
     * @param {string} input Text to be parsed
     * @return {string} The input text with all their entities replaced by characters.
     * @ignore
     */
    static htmlEntitiesDecode(input) {
        return input.split('&quot;').join('"').split('&gt;').join('>').split('&lt;').join('<').split('&amp;').join('&');
    }

    /**
     * Cross-browser httpRequest creation.
     * @return {object} httpRequest request object.
     * @ignore
     */
    static createHttpRequest() {
        var currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf('/') + 1);
        if (currentPath.substr(0, 7) == 'file://') {
            throw Core.getStringManager().getString('exception_cross_site');
        }

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
     * Gets the content from an URL.
     * @param {string} url target URL.
     * @param {object} postVariables post variables. Null if a GET query should be done.
     * @return {string} content of the target URL.
     * @ignore
     */
    static getContent(url, postVariables) {
        var currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf('/') + 1);
        var httpRequest = Util.createHttpRequest();

            if (httpRequest) {
                if (typeof postVariables === undefined || typeof postVariables == 'undefined') {
                    httpRequest.open('GET', url, false);
                }
                else if (url.substr(0, 1) == '/' || url.substr(0, 7) == 'http://' || url.substr(0, 8) == 'https://') {
                    httpRequest.open('POST', url, false);
                }
                else {
                    httpRequest.open('POST', currentPath + url, false);
                }

                if (postVariables !== undefined) {
                    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    httpRequest.send(Util.httpBuildQuery(postVariables));
                }
                else {
                    httpRequest.send(null);
                }

                return httpRequest.responseText;
            }

            alert(Core.getStringManager().getString('browser_no_compatible'));


        return '';
    }

    /**
     * Converts a hash to a HTTP query.
     * @param {hash} properties A key-value Hash
     * @return {string} A HTTP query containing all the key value pairs with all the shpecial characters replaced by their entities.
     * @ignore
     */
    static httpBuildQuery(properties) {
        var result = '';

        for (var i in properties) {
            if (properties[i] != null) {
                result += Util.urlEncode(i) + '=' + Util.urlEncode(properties[i]) + '&';
            }
        }

        // Deleting last '&' empty character.
        if (result.substring(result.length - 1) == '&') {
            result = result.substring(0, result.length - 1);
        }

        return result;
    }

    /**
     * Convert a hash to string  sorting keys to get a deterministic output
     * @param {hash} h a key-value hash
     * @return{string} A string with the form key1=value1...keyn=valuen
     * @ignore
     */
    static propertiesToString(h) {
        // 1. Sort keys. We sort the keys because we want a deterministic output.
        var keys = []
        for (var key in h) {
            if (h.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        var n = keys.length;
        for (var i = 0; i < n; i++) {
            for (var j = i + 1; j < n; j++) {
                var s1 = keys[i];
                var s2 = keys[j];
                if (Util.compareStrings(s1,s2) > 0) {
                    // Swap.
                    keys[i] = s2;
                    keys[j] = s1;
                }
            }
        }

        // 2. Generate output.
        var output = '';
        for (var i = 0; i < n; i++) {
            var key = keys[i];
            output += key;
            output += "=";
            var value = h[key];
            value = value.replace("\\", "\\\\");
            value = value.replace("\n", "\\n");
            value = value.replace("\r", "\\r");
            value = value.replace("\t", "\\t");

            output += value;
            output += "\n";
        }
        return output;
    }

    /**
     * Compare two strings using charCodeAt method
     * @param {string} a first string to compare.
     * @param {string} b second string to compare
     * @return {int} the int difference between a and b
     * @ignore
     */
    static compareStrings(a, b) {
        var i;
        var an = a.length;
        var bn = b.length;
        var n = (an > bn) ? bn : an;
        for(i = 0; i < n; i++){
            var c = Util.fixedCharCodeAt(a,i) - Util.fixedCharCodeAt(b,i);
            if(c != 0) {
                return c;
            }
        }
            return a.length - b.length;
    }

    /**
     * Fix charCodeAt() javascript function to handle non-Basic-Multilingual-Plane characters.
     * @param {string} str String
     * @param {int} idx An integer greater than or equal to 0 and less than the length of the string
     * @return {int} An integer representing the UTF-16 code of the string at the given index.
     * @ignore
     */

    static fixedCharCodeAt(str, idx) {
        idx = idx || 0;
        var code = str.charCodeAt(idx);
        var hi, low;

        /* High surrogate (could change last hex to 0xDB7F to treat high
        private surrogates as single characters) */

        if (0xD800 <= code && code <= 0xDBFF) {
            hi = code;
            low = str.charCodeAt(idx + 1);
            if (isNaN(low)) {
                throw Core.getStringManager().getString('exception_high_surrogate');
            }
            return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
        }

        if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate.
            /* We return false to allow loops to skip this iteration since should have
            already handled high surrogate above in the previous iteration. */
            return false;
        }
        return code;
    }

    static urlToAssArray(url) {
        var i;
        i = url.indexOf("?");
        if (i > 0) {
            var query = url.substring(i + 1);
            var ss  = query.split("&");
            var h = new Object();
            for (i = 0; i < ss.length; i++) {
                var s = ss[i];
                var kv = s.split("=");
                if (kv.length > 1) {
                    h[kv[0]] = decodeURIComponent(kv[1].replace(/\+/g, ' '));
                }
            }
            return h;
        } else {
            return new Object();
        }
    }

    /**
     * URL encode function.
     * @param {string} clearString Input string to be encoded
     * @return {string} encoded string.
     * @ignore
     */
    static urlEncode(clearString) {
        var output = '';
        // Method encodeURIComponent doesn't encode !'()*~ .
        output = encodeURIComponent(clearString);
        return output;
    }

    // TODO: To parser?
    /**
     * Converts the HTML of a image into the output code that WIRIS must return.
     * By default returns the mathml stored on data-mahml attribute (if imgCode is a formula)
     * or the Wiriscas attribute of a WIRIS applet.
     * @param {string} imgCode the html code from a formula or a CAS image.
     * @param {bool} convertToXml True if the image should be converted to xml.
     * @param {bool} convertToSafeXml True if the image should be conerte to safeXmll
     * @return {string} the Xml or safeXml of a WIRIS image.
     * @ignore
     */
    static getWIRISImageOutput(imgCode, convertToXml, convertToSafeXml) {
        var imgObject = Util.createObject(imgCode);

        if (imgObject) {
            if (imgObject.className == Configuration.get('imageClassName') || imgObject.getAttribute(Configuration.get('imageMathmlAttribute'))) {
                if (!convertToXml) {
                    return imgCode;
                }

                var xmlCode = imgObject.getAttribute(Configuration.get('imageMathmlAttribute'));

                if (xmlCode == null) {
                    xmlCode = imgObject.getAttribute('alt');
                }

                if (!convertToSafeXml) {
                    xmlCode = MathML.safeXmlDecode(xmlCode);
                }

                return xmlCode;
            }
            else if (imgObject.className == Configuration.get('CASClassName')) {
                var appletCode = imgObject.getAttribute(Configuration.get('CASMathmlAttribute'));
                appletCode = MathML.safeXmlDecode(appletCode);
                var appletObject = Util.createObject(appletCode);
                appletObject.setAttribute('src', imgObject.src);
                var object = appletObject;
                var appletCodeToBeInserted = Util.createObjectCode(appletObject);

                if (convertToSafeXml) {
                    appletCodeToBeInserted = MathML.safeXmlEncode(appletCodeToBeInserted);
                }

                return appletCodeToBeInserted;
            }
        }

        return imgCode;
    }

    /**
     * Gets the node length in characters.
     * @param {object} node HTML node.
     * @return {int} node length
     * @ignore
     */
    static getNodeLength(node) {
        var staticNodeLengths = {
            'IMG': 1,
            'BR': 1
        }
        if (node.nodeType == 3) { // TEXT_NODE.
            return node.nodeValue.length;
        }

        if (node.nodeType == 1) { // ELEMENT_NODE.
            var length = staticNodeLengths[node.nodeName.toUpperCase()];

            if (length === undefined) {
                length = 0;
            }

            for (var i = 0; i < node.childNodes.length; ++i) {
                length += getNodeLength(node.childNodes[i]);
            }

            return length;
        }

        return 0;
    }

    /**
     * Gets the selected node or text.
     * If the caret is on a text node, concatenates it with all the previous and next text nodes.
     * @param {object} target The editable element
     * @param {boolean} isIframe Specifies if the target is an iframe or not
     * @param {forceGetSelection} If true, ignores IE system to get the current selection and uses window.getSelection()
     * @return {object} An object with the 'node' key setted if the item is an element or the keys 'node' and 'caretPosition' if the element is text
     * @ignore
     */
    static getSelectedItem(target, isIframe, forceGetSelection) {
        var windowTarget;

        if (isIframe) {
            windowTarget = target.contentWindow;
            windowTarget.focus();
        }
        else {
            windowTarget = window;
            target.focus();
        }

        if (document.selection && !forceGetSelection) {
            var range = windowTarget.document.selection.createRange();

            if (range.parentElement) {
                if (range.htmlText.length > 0) {
                    if (range.text.length == 0) {
                        return Util.getSelectedItem(target, isIframe, true);
                    }

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

                if (temporalObject.nextSibling && temporalObject.nextSibling.nodeType == 3) { // TEXT_NODE.
                    node = temporalObject.nextSibling;
                    caretPosition = 0;
                }
                else if (temporalObject.previousSibling && temporalObject.previousSibling.nodeType == 3) { // TEXT_NODE.
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

        if (windowTarget.getSelection) {
            var selection = windowTarget.getSelection();

            try {
                var range = selection.getRangeAt(0);
            }
            catch (e) {
                var range = windowTarget.document.createRange();
            }

            var node = range.startContainer;

            if (node.nodeType == 3) { // TEXT_NODE.
                return {
                    'node': node,
                    'caretPosition': range.startOffset
                };
            }

            if (node != range.endContainer) {
                return null;
            }

            if (node.nodeType == 1) { // ELEMENT_NODE.
                var position = range.startOffset;

                if (node.childNodes[position]) {
                    return {
                        'node': node.childNodes[position]
                    };
                }
            }
        }

        return null;
    }

    /**
     * Looks for elements that match the given name in a HTML code string.
     * Important: this function is very concrete for WIRIS code. It takes as preconditions lots of behaviors that are not the general case.
     *
     * @param {string} code HTML code
     * @param {string} name Element names
     * @param {boolean} autoClosed True if the elements are autoClosed.
     * @return {array} An array containing all HTML elements of code matching the name argument.
     * @ignore
     */
    static getElementsByNameFromString(code, name, autoClosed) {
        var elements = [];
        var code = code.toLowerCase();
        name = name.toLowerCase();
        var start = code.indexOf('<' + name + ' ');

        while (start != -1) {                       // Look for nodes.
            var endString;

            if (autoClosed) {
                endString = '>';
            }
            else {
                endString = '</' + name + '>';
            }

            var end = code.indexOf(endString, start);

            if (end != -1) {
                end += endString.length;

                elements.push({
                    'start': start,
                    'end': end
                });
            }
            else {
                end = start + 1;
            }

            start = code.indexOf('<' + name + ' ', end);
        }

        return elements;
    }

    /**
     * Decode a base64 to its numeric value
     *
     * @param  {String} el base64 character.
     * @return {int} base64 char numeric value.
     * @ignore
     */
    static decode64(el) {

        var PLUS = '+'.charCodeAt(0);
        var SLASH = '/'.charCodeAt(0);
        var NUMBER = '0'.charCodeAt(0);
        var LOWER = 'a'.charCodeAt(0);
        var UPPER = 'A'.charCodeAt(0);
        var PLUS_URL_SAFE = '-'.charCodeAt(0);
        var SLASH_URL_SAFE = '_'.charCodeAt(0);
        var code = el.charCodeAt(0);

        if (code === PLUS || code === PLUS_URL_SAFE) {
            return 62; // Char '+'.
        }
        if (code === SLASH || code === SLASH_URL_SAFE){
            return 63 // Char '/'.
        }
        if (code < NUMBER){
            return -1 // No match.
        }
        if (code < NUMBER + 10){
            return code - NUMBER + 26 + 26
        }
        if (code < UPPER + 26){
            return code - UPPER
        }
        if (code < LOWER + 26){
            return code - LOWER + 26
        }
    }

    /**
     * Converts a base64 string to a array of bytes.
     * @param  {String} b64String base64 string.
     * @param  {int} len dimension of byte array (by default whole string).
     * @return {Array} Byte array.
     * @ignore
     */
    static b64ToByteArray(b64String, len) {

        var tmp;

        if (b64String.length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4'); // Tipped base64. Length is fixed.
        }

        var arr = new Array()

        if (!len) { // All b64String string.
            var placeHolders = b64String.charAt(b64String.length - 2) === '=' ? 2 : b64String.charAt(b64String.length - 1) === '=' ? 1 : 0
            var l = placeHolders > 0 ? b64String.length - 4 : b64String.length;
        } else {
            var l = len;
        }

        for (var i = 0; i < l; i += 4) {
            // Ignoring code checker standards (bitewise operators).
            // See https://tracker.moodle.org/browse/CONTRIB-5862 for further information.
            // @codingStandardsIgnoreStart
            tmp = (Util.decode64(b64String.charAt(i)) << 18) | (Util.decode64(b64String.charAt(i + 1)) << 12) | (Util.decode64(b64String.charAt(i + 2)) << 6) | Util.decode64(b64String.charAt(i + 3));

            arr.push((tmp  >> 16) & 0xFF);
            arr.push((tmp >> 8) & 0xFF);
            arr.push(tmp & 0xFF);
            // @codingStandardsIgnoreEnd
        }

        if (placeHolders) {
            if (placeHolders === 2) {
                // Ignoring code checker standards (bitewise operators).
                // @codingStandardsIgnoreStart
                tmp = (Util.decode64(b64String.charAt(i)) << 2) | (Util.decode64(b64String.charAt(i + 1)) >> 4);
                arr.push(tmp & 0xFF)
            } else if (placeHolders === 1) {
                tmp = (Util.decode64(b64String.charAt(i)) << 10) | (Util.decode64(b64String.charAt(i + 1)) << 4) | (Util.decode64(b64String.charAt(i + 2)) >> 2)
                arr.push((tmp >> 8) & 0xFF);
                arr.push(tmp & 0xFF);
                // @codingStandardsIgnoreEnd
            }
        }

        return arr
    }

    /**
     * Returns the first 32-bit signed integer from a byte array.
     * @param  {Array} bytes array of bytes.
     * @return {int} 32-bit signed integer.
     * @ignore
     */
    static readInt32(bytes) {
        if (bytes.length < 4) {
            return false;
        }
        var int32 = bytes.splice(0,4);
        // @codingStandardsIgnoreStart
        return (int32[0] << 24 | int32[1] << 16 | int32[2] <<  8 | int32[3] << 0);
        // @codingStandardsIgnoreEnd
    }

    /**
     * Read the first byte from a byte array.
     * @param  {array} bytes byte array.
     * @return {int} first byte of the byte array.
     * @ignore
     */
    static readByte(bytes) {
        // @codingStandardsIgnoreStart
        return bytes.shift() << 0;
        // @codingStandardsIgnoreEnd

    }

    /**
     * Read an arbitrary number of bytes, from a fixed position on a byte array.
     * @param  {array} bytes byte array.
     * @param  {int} post start position.
     * @param  {int} len number of bytes to read.
     * @return {array} byte array.
     * @ignore
     */
    static readBytes(bytes, pos, len) {
        return bytes.splice(pos, len);
    }

    /**
     * Inserts or modifies formulas or CAS on a textarea.
     * @param {object} textarea Target
     * @param {string} text Text to add in the textarea. For example, if you want to add the link to the image, you can call this function as (textarea, Parser.createImageSrc(mathml));
     * @ignore
     */
    static updateTextArea(textarea, text) {
        if (textarea && text) {
            textarea.focus();

            if (textarea.selectionStart != null) {
                var selectionEnd = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, textarea.selectionStart) + text + textarea.value.substring(textarea.selectionEnd, textarea.value.length);
                textarea.selectionEnd = selectionEnd + text.length;
            }
            else {
                var selection = document.selection.createRange();
                selection.text = text;
            }
        }
    }

    /**
     * Modifies existing formula on a textarea.
     * @param {object} textarea Target
     * @param {string} text Text to add in the textarea. For example, if you want to add the link to the image, you can call this function as Util.updateTextarea(textarea, Parser.createImageSrc(mathml));
     * @param {number} start Beginning index from textarea where it needs to be replaced by text.
     * @param {number} end Ending index from textarea where it needs to be replaced by text
     * @ignore
     */
    static updateExistingTextOnTextarea(textarea, text, start, end) {
        textarea.focus();
        textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end, textarea.value.length);
        textarea.selectionEnd = start + text.length;
    }

    /**
     * Add a parameter to a URL (GET).
     * @param {string} path - URL path
     * @param {string} parameter - parameter
     * @param {string} value - value
     */
    static addArgument(path, parameter, value) {
        var sep;
        if (path.indexOf("?") > 0) {
            sep = "&";
        } else {
            sep = "?";
        }
        return path + sep + parameter + "=" + value;
    }

}