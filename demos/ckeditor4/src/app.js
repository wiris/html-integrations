// Load scripts.
import '@wiris/mathtype-ckeditor4/plugin';

// Load styles.
import './static/style.css';
import '../../../resources/demos/design.css';

// Load and display html content.
import * as htmlContent from '../../../resources/demos/index.html';

document.body.innerHTML = htmlContent;

// Generate scripts.
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for CKeditor';
document.getElementById('version_editor').innerHTML = 'CKeditor editor: ';

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = document.getElementById('editor').innerHTML;

// Add wiris plugin.
CKEDITOR.plugins.addExternal('ckeditor_wiris', `${window.location.href}node_modules/@wiris/mathtype-ckeditor4/`, 'plugin.js'); //eslint-disable-line

// Initialize plugin.
CKEDITOR.replace('editor', { //eslint-disable-line
  extraPlugins: 'ckeditor_wiris',
  allowedContent: true,
  toolbar: [
    { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike'] },
    { name: 'clipboard', items: ['Undo', 'Redo'] },
    { name: 'wirisplugins', items: ['ckeditor_wiris_formulaEditor', 'ckeditor_wiris_formulaEditorChemistry'] },
  ],
});

// Handle on editor ready event
CKEDITOR.on('instanceReady', function() {                     //eslint-disable-line
  // Get ckeditor and wiris plugin versions.
  const versionWiris = WirisPlugin.currentInstance.version;             //eslint-disable-line
  const versionCKeditor = CKEDITOR.version;                             //eslint-disable-line
  document.getElementById('version_wiris').innerHTML += versionWiris;
  document.getElementById('version_editor').innerHTML += versionCKeditor;
});

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = CKEDITOR.instances.editor.getData(); //eslint-disable-line
  document.getElementById('transform_content').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('transform_content')); //eslint-disable-line
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn_update').addEventListener('click', () => {
  updateFunction();
});
