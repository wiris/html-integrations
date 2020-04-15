/**
 * Copies the content of an element x as the content of an element y.
 * @param {String} x Identifier of the element to take its content.
 * @param {String} y Identifier of the element where to copy the content of x.
 */
export function copyContentFromxToy(x, y) {
  const content = document.getElementById(x).innerHTML;
  document.getElementById(y).innerHTML = content;
}

/**
 * Sets the editor and the wiris plugins version on the front end page.
 * @param {*} editorVersion Version of the current editor.
 * @param {*} wirisVersion Version of the wiris plugin used.
 */
export function setEditorAndWirisVersion(editorVersion, wirisVersion) {
  document.getElementById('version_wiris').innerHTML += wirisVersion;
  document.getElementById('version_editor').innerHTML += editorVersion;
}

/**
 * Takes the editor content,
 * Transforms it into an image,
 * Places it on a reserved containder identified with and idContainer.
 * @param {*} editorContent Content of the editor to be transformed.
 * @param {String} containerId Identifier of the container place.
 */
export function updateContent(editorContent, containerId) {
  document.getElementById(containerId).innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById(containerId)); //eslint-disable-line
}
