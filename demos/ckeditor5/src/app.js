// Load scripts.
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';

// Load styles.
import './static/style.css';
import '../../../resources/demos/design.css';

import { version as pluginVersion } from '@wiris/mathtype-ckeditor5/package.json';
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

// Create the CKeditor5.
ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment],
    toolbar: ['bold', 'italic', 'MathType', 'ChemType', 'alignment:left', 'alignment:center', 'alignment:right'],
  })
  .then((editor) => {
    function updateFunction() {
      const editorContent = editor.getData();
      document.getElementById('transform_content').innerHTML = editorContent;
      com.wiris.js.JsPluginViewer.parseElement(document.getElementById('transform_content'));        //eslint-disable-line
    }

    // Add listener on click button to launch updateFunction.
    document.getElementById('btn_update').addEventListener('click', () => {
      updateFunction();
    });

    // Get ckeditor and wiris plugin versions.
    document.getElementById('version_wiris').innerHTML += pluginVersion;
    document.getElementById('version_editor').innerHTML += '5.0.0';
  })
  .catch((error) => {
    console.error(error.stack);
  });
