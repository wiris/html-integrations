// Load scripts
import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
import '@wiris/mathtype-generic/wirisplugin-generic';

// Load styles
import './static/style.css';

const editableDiv = document.getElementById('editable');
const toolbarDiv = document.getElementById('toolbar');

wrsInitEditor(editableDiv, toolbarDiv);

// Define the undefined mode 'parseModes'
WirisPlugin.Configuration.set('parseModes', 'latex');

// Takes the data of the editor
// Replaces the content of a div with the data transformed
function updateFunction() {
  const editorContent = WirisPlugin.Parser.initParse(editableDiv.innerHTML);
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));
}

// Add listener on click button to launch updateFunction
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
});

// Execute, just for the first time,
// the transformation of the actual CKEDITOR4 content
document.on('instanceReady', () => {
  updateFunction();
});
