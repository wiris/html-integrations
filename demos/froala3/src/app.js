// Load scripts
import '@wiris/mathtype-froala3/wiris';

// Load styles
import 'froala-editor/css/froala_editor.pkgd.min.css';
import './static/style.css';

// Generate scripts
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts
document.head.appendChild(jsDemoImagesTransform);

// Initialize editor.
FroalaEditor('#editor', {
  // toolbarButtons: ['undo', 'redo' , 'bold', '|','clear', 'insert']
  toolbarButtons: ['undo', 'redo', 'bold', '|', 'wirisEditor', 'wirisChemistry', 'clear', 'insert'],

  // Add [MW] buttons to Image Toolbar.
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],

  // Allowed tags
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],
});

// Takes the data of the editor
// Replaces the content of a div with the data transformed
function updateFunction() {
  const editorContent = FroalaEditor.INSTANCES[0].html.get();
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));
}

// Add listener on click button to launch updateFunction
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
});

// Execute, just for the first time,
// the transformation of the actual CKEDITOR4 content
// FroalaEditor.on('documentReady', function() {
//   updateFunction();
// });

setTimeout(() => {
  updateFunction();
}, 500);
