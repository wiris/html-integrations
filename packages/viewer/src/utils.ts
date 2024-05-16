/**
 * Takes a string possibly containing encoded entities (e.g. &nbsp; &#160;) and
 * returns the same string with these replaced by the UTF-8 characters they represent
 * @param {string} text - the string with encoded entities
 * @returns the same string with the entities decoded
 */
function decodeEntities(text: string): string {
  const element = document.createElement("textarea");
  element.innerHTML = text;
  return element.value;
}

/**
 * Takes a string possibly containing encoded named HTML entities (e.g. &nbsp;) and
 * returns the same string with these replaced by the encoding that uses numbers (e.g. &#160;).
 * By its implementation, this method also possibly encodes special characters that were
 * previously unencoded.
 * @param {string} text - the string with encoded entities
 * @returns the same string with the entities decoded
 */
export function htmlEntitiesToXmlEntities(text: string): string {
  text = decodeEntities(text);

  // Replaces the '<', '&', '>', and '"' characters to its HTMLEntity to avoid render issues.
  text = text
    .split("&")
    .join("&amp;")
    .split('"<"')
    .join('"&lt;"')
    .split('">"')
    .join('"&gt;"')
    .split("><<")
    .join(">&lt;<");

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const character = text.charAt(i);
    if (text.charCodeAt(i) > 128) {
      result += "&#" + text.charCodeAt(i) + ";";
    } else {
      result += character;
    }
  }
  return result;
}

// Set of mathml and characters which don't have an accessible text associated
// and can not be translated or transformed to LaTeX.
export const corruptMathML = [
  "⟦",
  "&#10214;",
  "⟧",
  "&#10215;",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
];
