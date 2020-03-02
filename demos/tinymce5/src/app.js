// Load styles.
import './static/style.css';

// Generate scripts.
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated sripts.
document.head.appendChild(jsDemoImagesTransform);

// Copy the editor content before initializing it.
document.getElementById('editorContentTransform').innerHTML = document.getElementById('editor').innerHTML;

// Set up the editor.
tinymce.init({                                                                                          //eslint-disable-line
  selector: '#editor',
  external_plugins: {
    tiny_mce_wiris: 'http://localhost:8006/node_modules/@wiris/mathtype-tinymce5/plugin.min.js',
  },
  toolbar: 'undo redo | styleselect | bold italic | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',
  
  // Handle events
  setup(editor) {
    editor.on('init', () => {
      // Get tinymce and wiris plugin versions.
      const versionWiris = WirisPlugin.currentInstance.version;                          //eslint-disable-line
      const versionTinymce = tinymce.majorVersion + '.' + tinymce.minorVersion;          //eslint-disable-line
      document.getElementById('version-wiris').innerHTML += versionWiris;
      document.getElementById('version-tinymce').innerHTML += versionTinymce;
    });
  },
});

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = tinyMCE.activeEditor.getContent();                      //eslint-disable-line
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));      //eslint-disable-line
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
});
