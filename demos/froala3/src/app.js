// Load scripts.
import '@wiris/mathtype-froala3/wiris';

// Load styles.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import './static/style.css';

// Generate scripts.
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// Copy the editor content before initializing it.
document.getElementById('editorContentTransform').innerHTML = document.getElementById('editor').innerHTML;

// Initialize editor.
new FroalaEditor('#editor', {                                                                                                 //eslint-disable-line
  // toolbarButtons: ['undo', 'redo' , 'bold', '|','clear', 'insert']
  toolbarButtons: ['undo', 'redo', 'bold', '|', 'wirisEditor', 'wirisChemistry', 'clear', 'insert'],

  // Add [MW] buttons to Image Toolbar.
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],

  // Allowed tags.
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],

  // Execute on initialyzed editor
  events: {
    initialized() {
      // Get froala and wiris plugin versions.
      const versionWiris = WirisPlugin.currentInstance.version;             //eslint-disable-line
      const versionFroala = FroalaEditor.VERSION;                           //eslint-disable-line
      document.getElementById('version-wiris').innerHTML += versionWiris;
      document.getElementById('version-froala').innerHTML += versionFroala;
    },
  },
});

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = FroalaEditor.INSTANCES[0].html.get();                                           //eslint-disable-line
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));                //eslint-disable-line
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
});
