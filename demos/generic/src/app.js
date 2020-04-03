// Load scripts.
import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
import '@wiris/mathtype-generic/wirisplugin-generic';

// Load styles.
import './static/style.css';
import '../../../resources/demos/design.css';

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = document.getElementById('editable').innerHTML;

const editableDiv = document.getElementById('editable');
const toolbarDiv = document.getElementById('toolbar');

// Initialyze the editor.
wrsInitEditor(editableDiv, toolbarDiv);

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    const versionWiris = WirisPlugin.currentInstance.version;             //eslint-disable-line
    document.getElementById('version_wiris').innerHTML += versionWiris;
  }
};

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = WirisPlugin.Parser.initParse(editableDiv.innerHTML);                           //eslint-disable-line
  document.getElementById('transform_content').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('transform_content'));        //eslint-disable-line
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn_update').addEventListener('click', () => {
  updateFunction();
});
