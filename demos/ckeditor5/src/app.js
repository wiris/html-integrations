// Load scripts
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';

// Load styles
import './static/style.css';

// Generate scripts
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts
document.head.appendChild(jsDemoImagesTransform);

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
      com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));
    }

    // Add listener on click button to launch updateFunction
    document.getElementById('btn-update').addEventListener('click', () => {
      updateFunction();
    });

    // Execute, just for the first time,
    // the transformation of the actual CKEDITOR5 content
    // editor.on('instanceReady', function() {
      updateFunction();
    // });
  })
  .catch((error) => {
    console.error(error.stack);
  });
