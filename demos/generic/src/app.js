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

document.onreadystatechange = function () {
  if (document.readyState == "interactive") {
    console.log('handled');
    const versionWiris = WirisPlugin.currentInstance.version;             //eslint-disable-line
    document.getElementById('version-wiris').innerHTML += versionWiris;
  }
}

// Get froala and wiris plugin versions.
// const versionWiris = WirisPlugin.currentInstance.version;             //eslint-disable-line
// document.getElementById('version-wiris').innerHTML += versionWiris;

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = WirisPlugin.Parser.initParse(editableDiv.innerHTML);                           //eslint-disable-line
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));        //eslint-disable-line
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
});
