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

import { version as pluginVersion } from '@wiris/mathtype-ckeditor5/package.json';

// Load the file that contains common imports between demos.
import * as Generic from '../../../../resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for CKeditor';
document.getElementById('version_editor').innerHTML = 'CKeditor editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

window.editor = null;

// Create the CKeditor5.
ClassicEditor
  .create(document.querySelector('#editor'), {
    plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment],
    toolbar: ['bold', 'italic', 'MathType', 'ChemType', 'alignment:left', 'alignment:center', 'alignment:right'],
    language: 'en',
  })
  .then((editor) => {
    window.editor = editor;
    // Add listener on click button to launch updateContent function.
    // document.getElementById('btn_update').addEventListener('click', (e) => {
    //   e.preventDefault();
    //   Generic.updateContent(editor.getData(), 'transform_content');
    // });

    // Get and set the editor and wiris versions in this order.
    Generic.setEditorAndWirisVersion('5.0.0', pluginVersion);
    editor.editing.view.focus();
    // updateFunction();
  })
  .catch((error) => {
    console.error(error.stack); //eslint-disable-line
  });

document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(window.editor.getData(), 'transform_content');
});
