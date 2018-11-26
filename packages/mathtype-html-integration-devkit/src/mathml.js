import Constants from './constants.js';
import Util from './util.js';

/**
 * This class represents a class to manage MathML objects.
 */
export default class MathML {
    /**
     * Checks if the mathml at position i is inside an HTML attribute or not.
     * @param {string} content - a string containing MathML code.
     * @param {number} i -  search index.
     * @return {boolean} true if is inside an HTML attribute. false otherwise.
     */
    static isMathmlInAttribute(content, i) {
        // Regex = '^[\'"][\\s]*=[\\s]*[\\w-]+([\\s]*("[^"]*"|\'[^\']*\')[\\s]*=[\\s]*[\\w-]+[\\s]*)*[\\s]+gmi<';
        var math_att = '[\'"][\\s]*=[\\s]*[\\w-]+';                         // "=att OR '=att
        var att_content = '"[^"]*"|\'[^\']*\'';                             // "blabla" OR 'blabla'
        var att = '[\\s]*(' + att_content + ')[\\s]*=[\\s]*[\\w-]+[\\s]*';  // "blabla"=att OR 'blabla'=att
        var atts = '(' + att + ')*';                                        // "blabla"=att1 "blabla"=att2
        var regex = '^' + math_att + atts + '[\\s]+gmi<';                   // "=att "blabla"=att1 "blabla"=att2 gmi< .
        var expression = new RegExp(regex);

        var actual_content = content.substring(0, i);
        var reversed = actual_content.split('').reverse().join('');
        var exists = expression.test(reversed);

        return exists;
    }

    /**
     * Decodes an encoded MathML with standard XML tags.
     * We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
     * @param {string} input - string to be decoded.
     * @return {string} decoded string.
     */
    static safeXmlDecode(input) {
        // Decoding entities.
        input = input.split(Constants.safeXmlCharactersEntities.tagOpener).join(Constants.safeXmlCharacters.tagOpener);
        input = input.split(Constants.safeXmlCharactersEntities.tagCloser).join(Constants.safeXmlCharacters.tagCloser);
        input = input.split(Constants.safeXmlCharactersEntities.doubleQuote).join(Constants.safeXmlCharacters.doubleQuote);
        // Added to fix problem due to import from 1.9.x.
        input = input.split(Constants.safeXmlCharactersEntities.realDoubleQuote).join(Constants.safeXmlCharacters.realDoubleQuote);

        // Blackboard.
        if ('_wrs_blackboard' in window && window._wrs_blackboard){
            input = input.split(Constants.safeBadBlackboardCharacters.ltElement).join(Constants.safeGoodBlackboardCharacters.ltElement);
            input = input.split(Constants.safeBadBlackboardCharacters.gtElement).join(Constants.safeGoodBlackboardCharacters.gtElement);
            input = input.split(Constants.safeBadBlackboardCharacters.ampElement).join(Constants.safeGoodBlackboardCharacters.ampElement);
        }

        // Decoding characters.
        input = input.split(Constants.safeXmlCharacters.tagOpener).join(Constants.xmlCharacters.tagOpener);
        input = input.split(Constants.safeXmlCharacters.tagCloser).join(Constants.xmlCharacters.tagCloser);
        input = input.split(Constants.safeXmlCharacters.doubleQuote).join(Constants.xmlCharacters.doubleQuote);
        input = input.split(Constants.safeXmlCharacters.ampersand).join(Constants.xmlCharacters.ampersand);
        input = input.split(Constants.safeXmlCharacters.quote).join(Constants.xmlCharacters.quote);

        // We are replacing $ by & when its part of an entity for retrocompatibility. Now, the standard is replace § by &.
        var returnValue = '';
        var currentEntity = null;

        for (var i = 0; i < input.length; ++i) {
            var character = input.charAt(i);

            if (currentEntity == null) {
                if (character == '$') {
                    currentEntity = '';
                }
                else {
                    returnValue += character;
                }
            }
            else {
                if (character == ';') {
                    returnValue += '&' + currentEntity + ';';
                    currentEntity = null;
                }
                else if (character.match(/([a-zA-Z0-9#._-] | '-')/)) {  // Character is part of an entity.
                    currentEntity += character;
                }
                else {
                    returnValue += '$' + currentEntity; // Is not an entity.
                    currentEntity = null;
                    --i; // Parse again the current character.
                }
            }
        }

        return returnValue;
    }

    /**
     * Encodes a MathML with standard XML tags to a MMathML encoded with safe XML tags.
     * We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
     * @param {string} input - input string to be encoded
     * @returns {string} encoded string.
     */
    static safeXmlEncode(input) {
        input = input.split(Constants.xmlCharacters.tagOpener).join(Constants.safeXmlCharacters.tagOpener);
        input = input.split(Constants.xmlCharacters.tagCloser).join(Constants.safeXmlCharacters.tagCloser);
        input = input.split(Constants.xmlCharacters.doubleQuote).join(Constants.safeXmlCharacters.doubleQuote);
        input = input.split(Constants.xmlCharacters.ampersand).join(Constants.safeXmlCharacters.ampersand);
        input = input.split(Constants.xmlCharacters.quote).join(Constants.safeXmlCharacters.quote);

        return input;
    }

    /**
     * Converts special symbols (> 128) to entities and replaces all textual entities by its number entities.
     * @param {string} mathml - MathML string containing - or not - special symbols
     * @returns {string} MathML with all textual entities replaced.
     */
    static mathMLEntities(mathml) {
        var toReturn = '';

        for (var i = 0; i < mathml.length; ++i) {

            var character = mathml.charAt(i);

            // Parsing > 128 characters.
            if (mathml.codePointAt(i) > 128) {
                toReturn += '&#' + mathml.codePointAt(i) + ';'
                // For UTF-32 characters we need to move the index one position.
                if (mathml.codePointAt(i) > 0xffff) {
                    i++;
                }
            }
            else if (character == '&') {
                var end = mathml.indexOf(';', i + 1);

                if (end >= 0) {
                    var container = document.createElement('span');
                    container.innerHTML = mathml.substring(i, end + 1);
                    toReturn += '&#' + Util.fixedCharCodeAt((container.textContent || container.innerText),0) + ';';
                    i = end;
                }
                else {
                    toReturn += character;
                }
            }
            else {
                toReturn += character;
            }
        }

        return toReturn;
    }

    /**
     * Add a custom editor name with the prefix wrs_ to a MathML class attribute.
     * @param {string} mathml - a MathML string created with a custom editor, like chemistry.
     * @param {string} customEditor - custom editor name.
     * @returns {string} MathML string with his class containing the editor toolbar string.
     */
    static addCustomEditorClassAttribute(mathml, customEditor) {
        var toReturn = '';

        var start = mathml.indexOf('<math');
        if (start == 0 ) {
            var end = mathml.indexOf('>');
            if (mathml.indexOf("class") == -1 ) {
                // Adding custom editor type.
                toReturn = mathml.substr(start, end) + ' class="wrs_' + customEditor + '">';
                toReturn += mathml.substr(end + 1, mathml.length);
                return toReturn;
            }
        }
        return mathml;
    }

    /**
     * Remove a custom editor name from the MathML class attribute.
     * @param {string} mathml - a MathML string.
     * @param {string} customEditor - custom editor name.
     * @returns {string} The input MathML without customEditor name in his class.
     */
    static removeCustomEditorClassAttribute(mathml, customEditor) {
        // Discard MathML without the specified class.
        if (mathml.indexOf('class') === -1 || mathml.indexOf('wrs_' + customEditor) === -1) {
            return mathml;
        }

        // Trivial case: class attribute value equal to editor name. Then
        // class attribute is removed.
        if (mathml.indexOf('class="wrs_' + customEditor + '"') !== -1) {
            return mathml.replace('class="wrs_' + customEditor + '"', '');
        }

        // Non Trivial case: class attribute contains editor name.
        return mathml.replace('wrs_' + customEditor, '');
    }

    /**
     * Adds annotation tag in MathML element.
     * @param {String} mathml - valid MathML.
     * @param {String} content - value to put inside annotation tag.
     * @param {String} annotationEncoding - annotation encoding.
     * @returns {String} - 'mathml' with an annotation that contains 'content' and encoding 'encoding'.
     */
    static addAnnotation(mathml, content, annotationEncoding) {
        // If contains annotation, also contains semantics tag.
        const containsAnnotation = mathml.indexOf('<annotation');

        let mathmlWithAnnotation = '';
        if (containsAnnotation !== -1) {
            const closeSemanticsIndex = mathml.indexOf('</semantics>');
            mathmlWithAnnotation = mathml.substring(0, closeSemanticsIndex) + `<annotation encoding="${annotationEncoding}">${content}</annotation>` + mathml.substring(closeSemanticsIndex);
        }
        else if (MathML.isEmpty(mathml)) {
            const endIndexInline = mathml.indexOf('/>');
            const endIndexNonInline = mathml.indexOf('>');
            const endIndex = endIndexNonInline === endIndexInline ? endIndexInline : endIndexNonInline;
            mathmlWithAnnotation = mathml.substring(0, endIndex) + `><semantics><annotation encoding="${annotationEncoding}">${content}</annotation></semantics></math>`;
        }
        else {
            const beginMathMLContent = mathml.indexOf('>') + 1;
            const endMathmlContent = mathml.lastIndexOf('</math>');
            const mathmlContent = mathml.substring(beginMathMLContent, endMathmlContent);
            mathmlWithAnnotation = mathml.substring(0, beginMathMLContent) + `<semantics>${mathmlContent}<annotation encoding="${annotationEncoding}">${content}</annotation></semantics></math>`;
        }

        return mathmlWithAnnotation;
    }

    /**
     * Removes specific annotation tag in MathML element. In case of remove the unique annotation, also is removed semantics tag.
     * @param {String} mathml - valid MathML.
     * @param {String} annotationEncoding - annotation encoding to remove.
     * @returns {String} - 'mathml' without the annotation encoding specified.
     */
    static removeAnnotation(mathml, annotationEncoding) {
        let mathmlWithoutAnnotation = mathml;
        const openAnnotationTag = `<annotation encoding="${annotationEncoding}">`;
        const closeAnnotationTag = '</annotation>';
        const startAnnotationIndex = mathml.indexOf(openAnnotationTag);
        if (startAnnotationIndex !== -1) {
            let differentAnnotationFound = false;
            let differentAnnotationIndex = mathml.indexOf('<annotation');
            while(differentAnnotationIndex !== -1) {
                if (differentAnnotationIndex !== startAnnotationIndex) {
                    differentAnnotationFound = true;
                }
                differentAnnotationIndex = mathml.indexOf('<annotation', differentAnnotationIndex + 1);
            }

            if (differentAnnotationFound) {
                const endAnnotationIndex = mathml.indexOf(closeAnnotationTag, startAnnotationIndex) + closeAnnotationTag.length;
                mathmlWithoutAnnotation = mathml.substring(0, startAnnotationIndex) + mathml.substring(endAnnotationIndex);
            }
            else {
                mathmlWithoutAnnotation = MathML.removeSemantics(mathml);
            }
        }

        return mathmlWithoutAnnotation;
    }

    /**
     * Removes semantics tag to mathml.
     * @param {string} mathml - MathML string.
     * @returns {string} - 'mathml' without semantics tag.
     */
    static removeSemantics(mathml) {
        var mathTagEnd = '</math>';
        var openSemantics = '<semantics>';
        var openAnnotation = '<annotation';

        var mathmlWithoutSemantics = mathml;
        var startSemantics = mathml.indexOf(openSemantics);
        if (startSemantics != -1) {
            var startAnnotation = mathml.indexOf(openAnnotation, startSemantics + openSemantics.length);
            if (startAnnotation != -1) {
                mathmlWithoutSemantics = mathml.substring(0, startSemantics) + mathml.substring(startSemantics + openSemantics.length, startAnnotation) + mathTagEnd;
            }
        }

        return mathmlWithoutSemantics;
    }

    /**
     * Transforms all xml mathml ocurrences that contain semantics to the same
     * xml mathml ocurrences without semantics.
     * @param {string} text - string that can contain xml mathml ocurrences.
     * @param {Constants} [characters] - Constant object containing xmlCharacters or safeXmlCharacters relation.
     * xmlCharacters by default.
     * @returns {string} - 'text' with all xml mathml ocurrences without annotation tag.
     */
    static removeSemanticsOcurrences(text, characters = Constants.xmlCharacters) {
        const mathTagStart = characters.tagOpener + 'math';
        const mathTagEnd = characters.tagOpener + '/math' + characters.tagCloser;
        const mathTagEndline = '/' + characters.tagCloser;
        const tagCloser = characters.tagCloser;
        const semanticsTagStart = characters.tagOpener + 'semantics' + characters.tagCloser;
        const annotationTagStart = characters.tagOpener + 'annotation encoding=';

        let output = '';
        let start = text.indexOf(mathTagStart);
        let end = 0;
        while (start !== -1) {
            output += text.substring(end, start);

            // MathML can be written as '<math></math>' or '<math />'.
            const mathTagEndIndex = text.indexOf(mathTagEnd, start);
            const mathTagEndlineIndex = text.indexOf(mathTagEndline, start);
            const firstTagCloser = text.indexOf(tagCloser, start);
            if (mathTagEndIndex !== -1) {
                end = mathTagEndIndex;
            }
            else if (mathTagEndlineIndex === firstTagCloser - 1) {
                end = mathTagEndlineIndex;
            }

            const semanticsIndex = text.indexOf(semanticsTagStart, start);
            if (semanticsIndex !== -1) {
                const mmlTagStart = text.substring(start, semanticsIndex);
                const annotationIndex = text.indexOf(annotationTagStart, start);
                if (annotationIndex !== -1) {
                    const mmlContent = text.substring(semanticsIndex + semanticsTagStart.length, annotationIndex);
                    output += mmlTagStart + mmlContent + mathTagEnd;
                    start = text.indexOf(mathTagStart, start + mathTagStart.length);
                    end += mathTagEnd.length;
                }
                else {
                    end = start;
                    start = text.indexOf(mathTagStart, start + mathTagStart.length);
                }
            }
            else {
                end = start;
                start = text.indexOf(mathTagStart, start + mathTagStart.length);
            }
        }

        output += text.substring(end, text.length);
        return output;
    }

    /**
     * Returns true if a MathML contains a certain class.
     * @param {string} mathML - input MathML.
     * @param {string} className - className.
     * @returns {boolean} true if the input MathML contains the input class.
     * false otherwise.
     * @static
     */
    static containClass(mathML, className) {
        var classIndex = mathML.indexOf('class');
        if (classIndex == -1) {
            return false;
        } else {
            var classTagEndIndex = mathML.indexOf('>', classIndex);
            var classTag = mathML.substring(classIndex, classTagEndIndex);
            if (classTag.indexOf(className) != -1) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Returns true if mathml is empty. Otherwise, false.
     * @param {string} mathml - valid MathML with standard XML tags.
     * @returns {boolean} - true if mathml is empty. Otherwise, false.
     */
    static isEmpty(mathml) {
        // MathML can have the shape <math></math> or '<math />'.
        const closeTag = '>';
        const closeTagInline = '/>';
        const firstCloseTagIndex = mathml.indexOf(closeTag);
        const firstCloseTagInlineIndex = mathml.indexOf(closeTagInline);
        let empty = false;
        // MathML is always empty in the second shape.
        if (firstCloseTagInlineIndex !== -1) {
            if (firstCloseTagInlineIndex === firstCloseTagIndex - 1) {
                empty = true;
            }
        }

        // MathML is always empty in the first shape when there aren't elements
        // between math tags.
        if (!empty) {
            const mathTagEndRegex = new RegExp('</(.+:)?math>');
            const mathTagEndArray = mathTagEndRegex.exec(mathml);
            if (mathTagEndArray) {
                empty = firstCloseTagIndex + 1 === mathTagEndArray.index;
            }
        }

        return empty;
    }
}
