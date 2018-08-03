import Constants from './constants.js';
import Util from './util.js';

/**
 * This class represents a class to manage MathML objects.
 */
export default class MathML {
    /**
     * Checks if the mathml at position i is inside an HTML attribute or not.
     * @param {string} content A string containing MathML code.
     * @param {string} i Search index.
     * @return {bool} True if is inside an HTML attribute. In other case, false.
     * @ignore
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
     * @param {string} input String to be decoded.
     * @return {string} Decoded string.
     * @ignore
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
     * @param {string} input to be encoded
     * @return {string} Encoded string.
     * @ignore
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
     * @param {string} mathml MathML string containing - or not - special symbols
     * @return {string} MathML with all textual entities replaced.
     * @ignore
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
                    toReturn += '&#' + Util.fixedCharCodeAt((container.innerText || container.textContent),0) + ';';
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
     * Add wrs::type attribute to mathml if the mathml has been created with a custom editor
     * for example, chemistry.
     * @param {string} mathml a MathML string created with a custom editor, like chemistry.
     * @param {string} custom editor name.
     * @return {string} The MathML string with his class containing the editor toolbar string.
     * @ignore
     */
    static addEditorAttribute(mathml, customEditor) {
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
     * Add annotation tag to mathml without it (mathml comes from LaTeX string)
     * @param  {string} mathml MathML code generated by a LaTeX string.
     * @param  {string} latex Original LaTeX string
     * @param  {string} withoutLatexTranslate True if not exists latex translation from mathml.
     * @param  {string} encoding - encoding attribute.
     * @return {string} new mathml containing LaTeX code on annotation tag.
     * @ignore
     */
    static insertSemanticsMathml(mathml, latex, encoding) {

        // If latex is empty, insert semantics doesn't provide information. We can avoid semantics insertion and return the mathml.
        if (latex == "") {
            return mathml;
        }

        var firstEndTag = '>';
        var mathTagEnd = '<' + '/math' + '>';
        var openSemantics = '<' + 'semantics' + '>';
        var closeSemantics = '<' + '/semantics' + '>';
        var openTarget = '<annotation encoding="' + encoding +'">';
        var closeTarget = '<' + '/annotation' + '>';
        var mrowOpen = '<mrow>';
        var mrowClose = '</mrow>';

        var indexMathBegin = mathml.indexOf(firstEndTag);
        var indexMathEnd = mathml.indexOf(mathTagEnd);
        var mathBeginExists = mathml.substring(mathml.indexOf('<'), mathml.indexOf('>')).indexOf('math');

        if (indexMathBegin != -1 && indexMathEnd != -1 && mathBeginExists)  {
            var mathmlContent = mathml.substring(indexMathBegin + 1, indexMathEnd);
            if (mathmlContent.indexOf(mrowOpen) != 0) {
                var mathmlContentSemantics = openSemantics + mrowOpen + mathmlContent + mrowClose + openTarget + latex + closeTarget + closeSemantics;
            } else {
                var mathmlContentSemantics = openSemantics + mathmlContent + openTarget + latex + closeTarget + closeSemantics;
            }
            return mathml.replace(mathmlContent, mathmlContentSemantics);
        } else {
            return mathml;
        }
    }

    /**
     * Removes annotation tag to mathml.
     * @param {string} mathml Valid MathML.
     * @param {string}
     */
    static removeSemanticsMathml(mathml, encoding) {
        var mathTagEnd = '<' + '/math' + '>';
        var openSemantics = '<' + 'semantics' + '>';
        var openAnnotation = '<annotation encoding="' + encoding + '">';

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

}