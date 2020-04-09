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

// Load generated sripts.
document.head.appendChild(jsDemoImagesTransform);

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = document.getElementById('editor').innerHTML;

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for Tinymce';
document.getElementById('version_editor').innerHTML = 'Tinymce editor: ';

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
      document.getElementById('version_wiris').innerHTML += versionWiris;
      document.getElementById('version_editor').innerHTML += versionTinymce;
    });
  },
});

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = tinyMCE.activeEditor.getContent();                      //eslint-disable-line
  document.getElementById('transform_content').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('transform_content'));      //eslint-disable-line
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn_update').addEventListener('click', () => {
  updateFunction();
});
