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

// Generate scripts.
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// Copy the editor content before initializing it.
document.getElementById('editorContentTransform').innerHTML = document.getElementById('editable').innerHTML;

// Create the CKeditor5.
ClassicEditor
  .create(document.querySelector('#editable'), {
    plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment],
    toolbar: ['bold', 'italic', 'MathType', 'ChemType', 'alignment:left', 'alignment:center', 'alignment:right'],
  })
  .then((editor) => {
    console.log('Editor was initialized', editor);

    function updateFunction() {
      const editorContent = editor.getData();
      document.getElementById('editorContentTransform').innerHTML = editorContent;
      com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));        //eslint-disable-line
    }

    // Add listener on click button to launch updateFunction.
    document.getElementById('btn-update').addEventListener('click', () => {
      updateFunction();
    });
  })
  .catch((error) => {
    console.error(error.stack);
  });
