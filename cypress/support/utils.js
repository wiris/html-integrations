/**
 * Create a selection in the document in the given field, at the given start and end positions.
 * @param field DOM element to make the selection in
 * @param start index of the character to start the selecion in
 * @param end index of the character to end the selection in
 */
function createSelection(field, start, end) {
  const el = field[0];
  const document = el.ownerDocument;
  const range = document.createRange();
  range.selectNodeContents(el);
  document.getSelection().removeAllRanges(range);
  if (start) range.setStart(el.firstChild, start);
  if (end) range.setEnd(el.firstChild, end);
  document.getSelection().addRange(range);
}

// eslint-disable-next-line import/prefer-default-export
export { createSelection };
