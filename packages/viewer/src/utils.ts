/**
 * Takes a string possibly containing encoded entities (e.g. &nbsp; &#160;) and
 * returns the same string with these replaced by the UTF-8 characters they represent
 * @param {string} text - the string with encoded entities
 * @returns the same string with the entities decoded
 */
function decodeEntities(text: string): string {
  const element = document.createElement('textarea');
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
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const character = text.charAt(i);
    if (text.charCodeAt(i) > 128) {
      result += '&#' + text.charCodeAt(i) + ';';
    } else {
      result += character;
    }
  }
  return result;
}
