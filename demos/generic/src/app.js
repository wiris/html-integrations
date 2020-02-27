// Load scripts.
import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
import '@wiris/mathtype-generic/wirisplugin-generic';

// Load styles.
import './static/style.css';

// Copy the editor content before initializing it.
document.getElementById('editorContentTransform').innerHTML = document.getElementById('editable').innerHTML;

const editableDiv = document.getElementById('editable');
const toolbarDiv = document.getElementById('toolbar');

// Initialyze the editor.
wrsInitEditor(editableDiv, toolbarDiv);

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = WirisPlugin.Parser.initParse(editableDiv.innerHTML);
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
});
