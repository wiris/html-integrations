import Util from "./util";
import Core from "./core.src";
import Latex from "./latex";
import MathML from './mathml';
import Image from './image';
import Accessibility from "./accessibility";
import ServiceProvider from './serviceprovider';
import Configuration from './configuration';
import Constants from './constants';
import md5 from './md5';

/**
 * This class represent a MahML parser. Converts MathML into formulas depending on the
 * image format (SVG, PNG, base64) and the save mode (XML, safeXML, Image) configured in the backend.
 */
export default class Parser {
    /**
     * Converts a MathML string to an img element.
     * @param {Document} creator - Document object to call createElement method.
     * @param {string} mathml - MathML code
     * @param {Object[]} wirisProperties - object containing WIRIS custom properties
     * @param {language} language - custom language for accessibility.
     * @returns {HTMLImageElement} the formula image corresponding to initial MathML string.
     * @static
     */
    static mathmlToImgObject(creator, mathml, wirisProperties, language) {
        var width;
        var height;
        var baseline;
        var imgObject = creator.createElement('img');
        imgObject.align = 'middle';
        imgObject.style.maxWidth = 'none';
        var data = wirisProperties ? wirisProperties : {};

        data['mml'] = mathml;
        data['lang'] = language;
        // Request metrics of the generated image.
        data['metrics'] = 'true';
        data['centerbaseline'] = 'false';


        // Full base64 method (edit & save).
        if (Configuration.get('saveMode') == 'base64' && Configuration.get('editMode') == 'default') {
            data['base64'] = true;
        }

        // Render js params: _wrs_int_wirisProperties contains some js render params. Since mathml can support render params, js params should be send only to editor, not to render.

        imgObject.className = Configuration.get('imageClassName');


        if (mathml.indexOf('class="') != -1) {
            // We check here if the MathML has been created from a customEditor (such chemistry)
            // to add data-custom-editor attribute to img object (if necessary).
            var mathmlSubstring = mathml.substring(mathml.indexOf('class="') + 'class="'.length, mathml.length);
            mathmlSubstring = mathmlSubstring.substring(0, mathmlSubstring.indexOf('"'));
            mathmlSubstring = mathmlSubstring.substring(4, mathmlSubstring.length);
            imgObject.setAttribute('data-custom-editor', mathmlSubstring);
        }

        // Performance enabled.
        if (Configuration.get('wirisPluginPerformance') && (Configuration.get('saveMode') == 'xml' || Configuration.get('saveMode') == 'safeXml')) {

            var result = JSON.parse(Parser.createShowImageSrc( data, language));
            if (result["status"] == 'warning') {
                // POST call.
                // if the mathml is malformed, this function will throw an exception.
                try {
                    result = JSON.parse(ServiceProvider.getService('showimage', data));
                } catch (e) {
                    return;
                }
            }
            result = result.result;
            if (result['format'] == 'png') {
                imgObject.src = 'data:image/png;base64,' + result['content'];
            } else {
                imgObject.src = 'data:image/svg+xml;charset=utf8,' + Util.urlEncode(result['content']);
            }
            imgObject.setAttribute(Configuration.get('imageMathmlAttribute'), MathML.safeXmlEncode(mathml));
            Image.setImgSize(imgObject, result['content'], true);

            if (Configuration.get('enableAccessibility')) {
                if (typeof result.alt == 'undefined') {
                    imgObject.alt = Accessibility.mathMLToAccessible(mathml, language, data);
                } else {
                    imgObject.alt = result.alt;
                }
            }
        } else {
            var result = Parser.createImageSrc(mathml, data);
            imgObject.setAttribute(Configuration.get('imageMathmlAttribute'), MathML.safeXmlEncode(mathml));
            imgObject.src = result;
            Image.setImgSize(imgObject, result, Configuration.get('saveMode') == 'base64' && Configuration.get('editMode') == 'default' ? true : false);
            if (Configuration.get('enableAccessibility')) {
                imgObject.alt = Accessibility.mathMLToAccessible(mathml, language, data);
            }
        }

        if (typeof Parser.observer != 'undefined') {
            Parser.observer.observe(imgObject);
        }

        // Role math https://www.w3.org/TR/wai-aria/roles#math.
        imgObject.setAttribute('role', 'math');
        return imgObject;
    }

    /**
     * Returns the source to showimage service by calling createimage service. The
     * output of the createimage service is a URL path pointing to showimage service.
     * This method is called when performance is disabled.
     * @param {string} mathml - MathML code.
     * @param {Object[]} data - data object containing service parameters.
     * @returns {string} the showimage path.
     */
    static createImageSrc(mathml, data) {
        // Full base64 method (edit & save).
        if (Configuration.get('saveMode') == 'base64' && Configuration.get('editMode') == 'default') {
            data['base64'] = true;
        }

        var result = ServiceProvider.getService('createimage', data);

        if (result.indexOf('@BASE@') != -1) {
            // Replacing '@BASE@' with the base URL of createimage.
            var baseParts = Core.getServiceProvider().getServicePath('createimage').split('/');
            baseParts.pop();
            result = result.split('@BASE@').join(baseParts.join('/'));
        }

        return result;
    }

    /**
     * Parses initial HTML code. If the HTML contains data generated by WIRIS, this data would be converted as following:
     * <pre>
     * MathML code: Image containing the corresponding MathML formulas.
     * MathML code with LaTeX annotation : LaTeX string.
     * </pre>
     * @param {string} code - HTML code containing MathML data.
     * @param {string} language - language to create image alt text.
     * @returns {string} HTML code with the original MathML converted into LaTeX and images.
     */
    static initParse(code, language) {
        /* Note: The code inside this function has been inverted.
        If you invert again the code then you cannot use correctly LaTeX
        in Moodle.
        */
        code = Parser.initParseSaveMode(code, language);
        return Parser.initParseEditMode(code);
    }

    /**
     * Parses initial HTML code depending on the save mode. Transforms all MathML
     * occurrences for it's correspondent image or LaTeX.
     * @param {string} code - HTML code to be parsed
     * @param {string} language - language to create image alt text.
     * @returns {string} HTML code parsed.
     */
    static initParseSaveMode(code, language) {
        if (Configuration.get('saveMode')) {
            // Converting XML to tags.
            code = Latex.parseMathmlToLatex(code, Constants.safeXmlCharacters);
            code = Latex.parseMathmlToLatex(code, Constants.xmlCharacters);
            // Safe XML and XML must be parsed regardeless of save mode.
            // Order is important here, safeXml must be parsed first in order to avoid conflicts with data-mathml img attribute.
            code = Parser.parseSafeAppletsToObjects(code);
            code = Parser.parseMathmlToImg(code, Constants.safeXmlCharacters, language);
            code = Parser.parseMathmlToImg(code, Constants.xmlCharacters, language);


            if (Configuration.get('saveMode') == 'base64' && Configuration.get('editMode') == 'image') {
                code = Parser.codeImgTransform(code, 'base642showimage');
            }
        }

        var appletList = Util.getElementsByNameFromString(code, 'applet', false);
        var carry = 0;          // While replacing applets with images, the indexes of the found applets changes respecting the original code, so this carry is needed.

        for (var i = 0; i < appletList.length; ++i) {
            var appletCode = code.substring(appletList[i].start + carry, appletList[i].end + carry);

            // The second control in the if is used to find WIRIS applet which don't have Wiriscas class (as it was in old CAS applets).
            if (appletCode.indexOf(' class="' + Configuration.get('CASClassName') + '"') != -1 || appletCode.toUpperCase().indexOf('WIRIS') != -1) {
                if (appletCode.indexOf(' src="') != -1){
                    var srcStart = appletCode.indexOf(' src="') + ' src="'.length;
                    var srcEnd = appletCode.indexOf('"', srcStart);
                    var src = appletCode.substring(srcStart, srcEnd);
                } else{
                    // This should happen only with old CAS imported from Moodle 1 to Moodle 2.
                    if (typeof(_wrs_conf_pluginBasePath) != 'undefined'){
                        var src = _wrs_conf_pluginBasePath + '/integration/showcasimage.php?formula=noimage';
                    } else {
                        var src = '';
                    }
                    if (appletCode.indexOf(' class="' + Configuration.get('CASClassName') + '"') == -1){
                        var closeSymbol = appletCode.indexOf('>');
                        var appletTag = appletCode.substring(0, closeSymbol);
                        var newAppletTag = appletTag.split(' width=').join(' class="Wiriscas" width=');
                        appletCode = appletCode.split(appletTag).join(newAppletTag);
                        appletCode = appletCode.split('\'').join('"');
                    }
                }

                // Double click to edit has been removed here.
                var imgCode = '<img align="middle" class="' + Configuration.get('CASClassName') + '" ' + Configuration.get('CASMathmlAttribute') + '="' + MathML.safeXmlEncode(appletCode) + '" src="' + src + '" />';

                code = code.substring(0, appletList[i].start + carry) + imgCode + code.substring(appletList[i].end + carry);
                carry += imgCode.length - (appletList[i].end - appletList[i].start);
            }
        }

        return code;
    }

    /**
     * Parses initial HTML code depending on the edit mode.
     * If 'latex' parseMode is enabled all MathML containing an annotation with encoding='LaTeX' will
     * be converted into a LaTeX string instead of an image.
     * @param {string} code - HTML code containing MathML.
     * @returns {string} parsed HTML code.
     */
    static initParseEditMode(code) {
        if (Configuration.get('parseModes').indexOf('latex') != -1) {
            var imgList = Util.getElementsByNameFromString(code, 'img', true);
            var token = 'encoding="LaTeX">';
            var carry = 0;  4// While replacing images with latex, the indexes of the found images changes respecting the original code, so this carry is needed.

            for (var i = 0; i < imgList.length; ++i) {
                var imgCode = code.substring(imgList[i].start + carry, imgList[i].end + carry);

                if (imgCode.indexOf(' class="' + Configuration.get('imageClassName') + '"') != -1) {
                    var mathmlStartToken = ' ' + Configuration.get('imageMathmlAttribute') + '="';
                    var mathmlStart = imgCode.indexOf(mathmlStartToken);

                    if (mathmlStart == -1) {
                        mathmlStartToken = ' alt="';
                        mathmlStart = imgCode.indexOf(mathmlStartToken);
                    }

                    if (mathmlStart != -1) {
                        mathmlStart += mathmlStartToken.length;
                        var mathmlEnd = imgCode.indexOf('"', mathmlStart);
                        var mathml = MathML.safeXmlDecode(imgCode.substring(mathmlStart, mathmlEnd));
                        var latexStartPosition = mathml.indexOf(token);

                        if (latexStartPosition != -1) {
                            latexStartPosition += token.length;
                            var latexEndPosition = mathml.indexOf('</annotation>', latexStartPosition);
                            var latex = mathml.substring(latexStartPosition, latexEndPosition);

                            var replaceText = '$$' + Util.htmlEntitiesDecode(latex) + '$$';
                            code = code.substring(0, imgList[i].start + carry) + replaceText + code.substring(imgList[i].end + carry);
                            carry += replaceText.length - (imgList[i].end - imgList[i].start);
                        }
                    }
                }
            }
        }

        return code;
    }

    /**
     * Parses end HTML code. The end HTML code is HTML code with embedded images or LaTeX formulas created with MathType. <br>
     * By default this method converts the formula images and LaTeX strings in MathML. <br>
     * If image mode is enabled the images will not be converted into MathML. For further information see {@link http://www.wiris.com/plugins/docs/full-mathml-mode}.
     * @param {string} code - HTML to be parsed
     * @returns {string} the HTML code parsed.
     */
    static endParse(code) {
        code = Parser.endParseEditMode(code);
        return Parser.endParseSaveMode(code);
    }

    /**
     * Parses end HTML code depending on the edit mode.
     * - LaTeX is an enabled parse mode, all LaTeX occurrences will be converted into MathML.
     * @param {string} code - HTML code to be parsed.
     * @returns {string} HTML code parsed.
     */
    static endParseEditMode(code) {
        // Converting LaTeX to images.
        if (Configuration.get('parseModes').indexOf('latex') != -1) {
            var output = '';
            var endPosition = 0;
            var startPosition = code.indexOf('$$');
            while (startPosition != -1) {
                output += code.substring(endPosition, startPosition);
                endPosition = code.indexOf('$$', startPosition + 2);

                if (endPosition != -1) {
                    // Before, it was a condition here to execute the next codelines 'latex.indexOf('<') == -1'.
                    // We don't know why it was used, but seems to have a conflict with latex formulas that contains '<'.
                    var latex = code.substring(startPosition + 2, endPosition);
                    latex = Util.htmlEntitiesDecode(latex);
                    var mathml = Latex.getMathMLFromLatex(latex, true);
                    output += mathml;
                    endPosition += 2;
                }
                else {
                    output += '$$';
                    endPosition = startPosition + 2;
                }

                startPosition = code.indexOf('$$', endPosition);
            }

            output += code.substring(endPosition, code.length);
            code = output;
        }

        return code;
    }

    /**
     * Parses end HTML code depending on the save mode. Converts all
     * images into the element determined by the save mode:
     * - xml: Parses images formulas into MathML.
     * - safeXml: Parses images formulas into safeMAthML
     * - base64: Parses images into base64 images.
     * - image: Parse images into images (no parsing)
     * @param {string} code - HTML code to be parsed
     * @returns {string} HTML code parsed.
     */
    static endParseSaveMode(code) {
        if (Configuration.get('saveMode')) {
            if (Configuration.get('saveMode') == 'safeXml') {
                code = Parser.codeImgTransform(code, 'img2mathml');
            }
            else if (Configuration.get('saveMode') == 'xml') {
                code = Parser.codeImgTransform(code, 'img2mathml');
            }
            else if (Configuration.get('saveMode') == 'base64' && Configuration.get('editMode') == 'image') {
                code = Parser.codeImgTransform(code, 'img264');
            }
        }

        return code;
    }

    /**
     * Returns the result to call showimage service with the formula md5 as parameter.
     *  The result could be:
     * - {'status' : warning'} : The image associated to the MathML md5 is not in cache.
     * - {'status' : 'ok' ...} : The image associated to the MathML md5 is in cache.
     * @param {Object[]} data - object containing showimage service parameters.
     * @param {string} language - string containing the language of the formula.
     * @returns {Object} JSON object containing showimage response.
     */
    static createShowImageSrc(data, language) {
        var dataMd5 = []
        var renderParams = 'mml,color,centerbaseline,zoom,dpi,fontSize,fontFamily,defaultStretchy,backgroundColor,format';
        var renderParamsArray = renderParams.split(',');
        for (var key in renderParamsArray) {
            var param = renderParamsArray[key];
            if (typeof data[param] != 'undefined') {
                dataMd5[param] = data[param];
            }
        }
        // Data variables to get.
        var dataObject = {};
        for (var key in data) {
            // We don't need mathml in this request we try to get cached so we only need the formula md5 calculated before.
            if (key != 'mml') {
                dataObject[key] = data[key];
            }
        }
        dataObject.formula = com.wiris.js.JsPluginTools.md5encode(Util.propertiesToString(dataMd5));
        dataObject.lang = (typeof language == 'undefined') ? 'en' : language;
        dataObject.version = Configuration.get('version');

        var result = ServiceProvider.getService('showimage', Util.httpBuildQuery(dataObject), true);
        return result;
    }

    /**
     * Transform html img tags inside a html code to mathml, base64 img tags (i.e with base64 on src) or showimage img tags (i.e with showimage.php on src)
     * @param  {string} code - HTML code
     * @param  {string} mode - base642showimage or img2mathml or img264 transform.
     * @returns {string} html - code transformed.
     */
    static codeImgTransform(code, mode) {
        var output = '';

        var endPosition = 0;
        var pattern = /<img/gi;
        var patternLength = pattern.source.length;

        while (pattern.test(code)) {
            var startPosition = pattern.lastIndex - patternLength;
            output += code.substring(endPosition, startPosition);

            var i = startPosition + 1;

            while (i < code.length && endPosition <= startPosition) {
                var character = code.charAt(i);

                if (character == '"' || character == '\'') {
                    var characterNextPosition = code.indexOf(character, i + 1);

                    if (characterNextPosition == -1) {
                        i = code.length;        // End while.
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

            if (endPosition < startPosition) {      // The img tag is stripped.
                output += code.substring(startPosition, code.length);
                return output;
            }
            var imgCode = code.substring(startPosition, endPosition);
            var imgObject = Util.createObject(imgCode);
            var xmlCode = imgObject.getAttribute(Configuration.get('imageMathmlAttribute'));
            var convertToXml;
            var convertToSafeXml;

            if (mode == 'base642showimage') {
                if (xmlCode == null) {
                    xmlCode = imgObject.getAttribute('alt');
                }
                xmlCode = MathML.safeXmlDecode(xmlCode);
                imgCode = Parser.mathmlToImgObject(document, xmlCode, null, null);
                output += Util.createObjectCode(imgCode);
            } else if (mode == 'img2mathml') {
                if (Configuration.get('saveMode')) {
                    if (Configuration.get('saveMode') == 'safeXml') {
                        convertToXml = true;
                        convertToSafeXml = true;
                    }
                    else if (Configuration.get('saveMode') == 'xml') {
                        convertToXml = true;
                        convertToSafeXml = false;
                    }
                }
                output += Util.getWIRISImageOutput(imgCode, convertToXml, convertToSafeXml);
            } else if (mode == 'img264') {

                if (xmlCode == null) {
                    xmlCode = imgObject.getAttribute('alt');
                }
                xmlCode = MathML.safeXmlDecode(xmlCode);

                var properties = {};
                properties['base64'] = 'true';
                imgCode = Parser.mathmlToImgObject(document, xmlCode, properties, null)
                // Metrics.
                Image.setImgSize(imgCode, imgCode.src, true);

                output += Util.createObjectCode(imgCode);
            }
        }
        output += code.substring(endPosition, code.length);
        return output;
    }

    /**
     * Converts all occurrences of safe applet code to the corresponding code.
     * @param {string} content - String containing valid applet code <APPLET>...</APPLET>
     * @returns {string} content with all the applet code converted to safe tags.
     */
    static parseSafeAppletsToObjects(content) {
        var output = '';
        var appletTagBegin = Constants.safeXmlCharacters.tagOpener + 'APPLET';
        var appletTagEnd = Constants.safeXmlCharacters.tagOpener + '/APPLET' + Constants.safeXmlCharacters.tagCloser;
        var upperCaseContent = content.toUpperCase();
        var start = upperCaseContent.indexOf(appletTagBegin);
        var end = 0;
        var applet;

        while (start != -1) {
            output += content.substring(end, start);
            end = upperCaseContent.indexOf(appletTagEnd, start);

            if (end == -1) {
                end = content.length - 1;
            }
            else {
                end += appletTagEnd.length;
            }

            applet = Util.convertOldXmlinitialtextAttribute(content.substring(start, end));

            output += MathML.safeXmlDecode(applet);
            start = upperCaseContent.indexOf(appletTagBegin, end);
        }

        output += content.substring(end, content.length);
        return output;
    }

    /**
     * Converts all occurrences of MathML to the corresponding image.
     * @param {string} content - string with valid MathML code. The MathML code doesn't contain semantics.
     * @param {Constants} characters - Constant object containing xmlCharacters or safeXmlCharacters relation.
     * @param {string} language - a valid language code in order to generate formula accessibility.
     * @returns {string} The input string with all the MathML occurrences replaced by the corresponding image.
     */
    static parseMathmlToImg(content, characters, language) {
        var output = '';
        var mathTagBegin = characters.tagOpener + 'math';
        var mathTagEnd = characters.tagOpener + '/math' + characters.tagCloser;
        var start = content.indexOf(mathTagBegin);
        var end = 0;

        while (start != -1) {
            output += content.substring(end, start);
            // Avoid WIRIS images to be parsed.
            var imageMathmlAtrribute = content.indexOf(Configuration.get('imageMathmlAttribute'));
            end = content.indexOf(mathTagEnd, start);

            if (end == -1) {
                end = content.length - 1;
            } else if (imageMathmlAtrribute != -1) {
                // First close tag of img attribute
                // If a mathmlAttribute exists should be inside a img tag.
                end += content.indexOf("/>", start);
            }
            else {
                end += mathTagEnd.length;
            }

            if (!MathML.isMathmlInAttribute(content, start) && imageMathmlAtrribute == -1){
                var mathml = content.substring(start, end);
                mathml = (characters == Constants.safeXmlCharacters) ? MathML.safeXmlDecode(mathml) : MathML.mathMLEntities(mathml);
                output += Util.createObjectCode(Parser.mathmlToImgObject(document, mathml, null, language));
            }
            else {
                output += content.substring(start, end);
            }

            start = content.indexOf(mathTagBegin, end);
        }

        output += content.substring(end, content.length);
        return output;
    }
}

// Mutation observers to avoid wiris image formulas class be removed.
if (typeof MutationObserver !== 'undefined') {
    const mutationObserver = new MutationObserver(function(mutations) {

        mutations.forEach(function(mutation) {

            if (mutation.oldValue === Configuration.get('imageClassName') &&
                mutation.attributeName === 'class' &&
                mutation.target.className.indexOf(Configuration.get('imageClassName')) == -1 ) {

                mutation.target.className = Configuration.get('imageClassName');
            }

        });

    });

    Parser.observer = Object.create(mutationObserver);
    Parser.observer.Config = { attributes: true, attributeOldValue: true };
    // We use own default config.
    Parser.observer.observe = function name(target) {
        this.__proto__.observe(target, this.Config);
    };
}
