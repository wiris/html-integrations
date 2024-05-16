import { renderLatex } from "./latex";
import { renderMathML } from "./mathml";
import { Properties } from "./properties";

/**
 * Exposes the {@link JsPluginViewer} singleton instance as window.com.wiris.js.JsPluginViewer.
 * @param {Properties} properties - Properties of the viewer.
 * @param {Window} w - Instance of the global window.
 * @deprecated Consider using {@link renderLatex} or {@link renderMathML}.
 */
export function bypassEncapsulation(properties: Properties, w: Window) {
  const wany = w as any;

  if (typeof wany.com === "undefined") {
    wany.com = {};
  }

  if (typeof wany.com.wiris === "undefined") {
    wany.com.wiris = {};
  }

  if (typeof wany.com.wiris.js === "undefined") {
    wany.com.wiris.js = {};
  }

  if (typeof wany.com.wiris.js.JsPluginViewer === "undefined") {
    wany.com.wiris.js.JsPluginViewer = JsPluginViewer.getInstance();
    JsPluginViewer.properties = properties;
  }
}

/**
 * This class is a compatibility layer with the old Viewer.
 * See haxe/src-haxe/com/wiris/js/JsPluginViewer.hx in in the repo wiris/plugins previous to commit df1248a.
 *
 * WARNING: the methods in this class may contain direct references to globals such as window and document.
 *
 * @deprecated Consider using {@link renderLatex} or {@link renderMathML}.
 */
class JsPluginViewer {
  static instance: JsPluginViewer;
  static properties: Properties;

  static getInstance(): JsPluginViewer {
    if (JsPluginViewer.instance == null) {
      JsPluginViewer.instance = new JsPluginViewer();
    }

    return JsPluginViewer.instance;
  }

  /**
   * Render all the formulas written in SafeMathML inside the given element.
   * @param {HTMLElement} element - Element wherein to render SafeMathML formulas.
   * @param asynchronously - Currently ignored, only included for retrocompatibility purposes.
   * @param callbackFunc - Currently ignored, only included for retrocompatibility purposes.
   * @deprecated There is currently no replacement for rendering SafeMathML formulas.
   * Please consider using {@link renderLatex} or {@link renderMathML}.
   */
  parseSafeMathMLElement(
    element: HTMLElement,
    asynchronously?: boolean,
    callbackFunc?: () => void,
  ): void {
    var mathmlPositions = [];
    JsPluginViewer.getMathMLPositionsAtElementAndChildren(
      element,
      mathmlPositions,
    );
    for (let i = 0; i < mathmlPositions.length; i++) {
      var mathmlPosition = mathmlPositions[i];
      var newNode = document.createElement("math");
      mathmlPosition.nextElement.parentNode.insertBefore(
        newNode,
        mathmlPosition.nextElement,
      );
      newNode.outerHTML = JsPluginViewer.decodeSafeMathML(
        mathmlPosition.safeMML,
      );
    }
  }

  /**
   * Render all the formulas in the document.
   * @param asynchronously - Currently ignored, only included for retrocompatibility purposes.
   * @param callbackFunc - Currently ignored, only included for retrocompatibility purposes.
   * @param safeXml - Currently ignored, only included for retrocompatibility purposes.
   * @deprecated Please consider using {@link renderMathML}.
   */
  async parseDocument(
    asynchronously?: boolean,
    callbackFunc?: () => void,
    safeXml?: boolean,
  ): Promise<void> {
    return renderMathML(JsPluginViewer.properties, document.documentElement);
  }

  /**
   * Render all the formulas inside the given element.
   * @param {HTMLElement} element - Element wherein to render formulas.
   * @param asynchronously - Currently ignored, only included for retrocompatibility purposes.
   * @param callbackFunc - Currently ignored, only included for retrocompatibility purposes.
   * @deprecated Please consider using {@link renderMathML}.
   */
  async parseElement(
    element: HTMLElement,
    asynchronously?: boolean,
    callbackFunc?: () => void,
  ): Promise<void> {
    await renderLatex(JsPluginViewer.properties, element);
    return await renderMathML(JsPluginViewer.properties, element);
  }

  /**
   * Convert all the LaTeX formulas in the document to MathML.
   * @param asynchronously - Currently ignored, only included for retrocompatibility purposes.
   * @param callbackFunc - Currently ignored, only included for retrocompatibility purposes.
   * @deprecated Please consider using {@link renderLatex}.
   */
  async parseLatexDocument(
    asynchronously?: boolean,
    callbackFunc?: () => void,
  ): Promise<void> {
    return renderLatex(JsPluginViewer.properties, document.documentElement);
  }

  /**
   * Convert all the LaTeX formulas inside the given element to MathML.
   * @param {HTMLElement} element - Element wherein to convert formulas.
   * @param asynchronously - Currently ignored, only included for retrocompatibility purposes.
   * @param callbackFunc - Currently ignored, only included for retrocompatibility purposes.
   * @deprecated Please consider using {@link renderLatex}.
   */
  async parseLatexElement(
    element: HTMLElement,
    asynchronously?: boolean,
    callbackFunc?: () => void,
  ): Promise<void> {
    return renderLatex(JsPluginViewer.properties, element);
  }

  private static decodeSafeMathML(input: string): string {
    var safeXMLCharactersEntities = JsCharacters.getSafeXMLCharactersEntities();
    var xmlCharacters = JsCharacters.getXMLCharacters();
    var safeXMLCharacters = JsCharacters.getSafeXMLCharacters();

    var tagOpenerEntity = safeXMLCharactersEntities.tagOpener;
    var tagCloserEntity = safeXMLCharactersEntities.tagCloser;
    var doubleQuoteEntity = safeXMLCharactersEntities.doubleQuote;
    var realDoubleQuoteEntity = safeXMLCharactersEntities.realDoubleQuote;

    // Important to not change function parameter.
    var inputCopy = input.slice();

    // Decoding entities.
    inputCopy = inputCopy
      .split(tagOpenerEntity)
      .join(safeXMLCharacters.tagOpener);
    inputCopy = inputCopy
      .split(tagCloserEntity)
      .join(safeXMLCharacters.tagCloser);
    inputCopy = inputCopy
      .split(doubleQuoteEntity)
      .join(safeXMLCharacters.doubleQuote);
    inputCopy = inputCopy
      .split(realDoubleQuoteEntity)
      .join(safeXMLCharacters.realDoubleQuote);

    var tagOpener = safeXMLCharacters.tagOpener;
    var tagCloser = safeXMLCharacters.tagCloser;
    var doubleQuote = safeXMLCharacters.doubleQuote;
    var realDoubleQuote = safeXMLCharacters.realDoubleQuote;
    var ampersand = safeXMLCharacters.ampersand;
    var quote = safeXMLCharacters.quote;

    // Decoding characters.
    inputCopy = inputCopy.split(tagOpener).join(xmlCharacters.tagOpener);
    inputCopy = inputCopy.split(tagCloser).join(xmlCharacters.tagCloser);
    inputCopy = inputCopy.split(doubleQuote).join(xmlCharacters.doubleQuote);
    inputCopy = inputCopy.split(ampersand).join(xmlCharacters.ampersand);
    inputCopy = inputCopy.split(quote).join(xmlCharacters.quote);

    // We are replacing $ by & when its part of an entity for retrocompatibility.
    // Now, the standard is replace § by &.
    var returnValue = "";
    var currentEntity = null;

    var i = 0;
    while (i < inputCopy.length) {
      var character = inputCopy.charAt(i);
      if (currentEntity == null) {
        if (character == "$") {
          currentEntity = "";
        } else {
          returnValue += character;
        }
      } else if (character == ";") {
        returnValue += "&" + currentEntity;
        currentEntity = null;
      } else if (character.match(/([a-zA-Z0-9#._-] | '-')/)) {
        // Character is part of an entity.
        currentEntity += character;
      } else {
        returnValue += "$" + "currentEntity"; // Is not an entity.
        currentEntity = null;
        i -= 1; // Parse again the current character.
      }
      i++;
    }

    return returnValue;
  }

  private static getMathMLPositionsAtElementAndChildren(
    element: Node,
    mathmlPositions,
  ) {
    JsPluginViewer.getMathMLPositionsAtNode(element, mathmlPositions);
    // Copy current children because DOM will be changed and element.childNodes won't be
    // consistent on call getMathMLPositionsAtElementAndChildren().
    var childNodes = Array.from(element.childNodes);
    if (childNodes.length > 0) {
      for (let i = 0; i < childNodes.length; i++) {
        var child = childNodes[i];
        JsPluginViewer.getMathMLPositionsAtElementAndChildren(
          child,
          mathmlPositions,
        );
      }
    }
  }

  private static getMathMLPositionsAtNode(node: Node, mathmlPositions) {
    var safeXMLCharacters = JsCharacters.getSafeXMLCharacters();
    if (node.nodeType == 3) {
      var startMathmlTag = safeXMLCharacters.tagOpener + "math";
      var endMathmlTag =
        safeXMLCharacters.tagOpener + "/math" + safeXMLCharacters.tagCloser;
      var start = node.textContent.indexOf(startMathmlTag);
      var end = 0;
      while (start != -1) {
        end = node.textContent.indexOf(
          endMathmlTag,
          start + startMathmlTag.length,
        );

        if (end == -1) break;

        var nextMathML = node.textContent.indexOf(
          startMathmlTag,
          end + endMathmlTag.length,
        );

        if (nextMathML >= 0 && end > nextMathML) break;

        var safeMathml = node.textContent.substring(
          start,
          end + endMathmlTag.length,
        );

        node.textContent =
          node.textContent.substring(0, start) +
          node.textContent.substring(end + endMathmlTag.length);
        node = (node as Text).splitText(start);
        start = node.textContent.indexOf(startMathmlTag);

        mathmlPositions.push({
          safeMML: safeMathml,
          nextElement: node,
        });
      }
    }
  }
}

class JsCharacters {
  static getSafeXMLCharactersEntities(): any {
    return {
      tagOpener: "&laquo;",
      tagCloser: "&raquo;",
      doubleQuote: "&uml;",
      realDoubleQuote: "&quot;",
    };
  }

  static getXMLCharacters(): any {
    return {
      id: "xmlCharacters",
      tagOpener: "<", // Hex: \x3C.
      tagCloser: ">", // Hex: \x3E.
      doubleQuote: '"', // Hex: \x22.
      ampersand: "&", // Hex: \x26.
      quote: "'", // Hex: \x27.
    };
  }

  static getSafeXMLCharacters(): any {
    return {
      id: "safeXmlCharacters",
      tagOpener: "«", // Hex: \xAB.
      tagCloser: "»", // Hex: \xBB.
      doubleQuote: "¨", // Hex: \xA8.
      ampersand: "§", // Hex: \xA7.
      quote: "`", // Hex: \x60.
      realDoubleQuote: "¨",
    };
  }
}
