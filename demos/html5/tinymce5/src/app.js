// Load styles.
import './static/style.css';

// Load the file that contains common imports between demos.
import * as Generic from '../../../../resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for Tinymce';
document.getElementById('version_editor').innerHTML = 'Tinymce editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

// Set up the editor.
tinymce.init({                                                                                          //eslint-disable-line
  selector: '#editor',
  external_plugins: {
    tiny_mce_wiris: `${window.location.href}node_modules/@wiris/mathtype-tinymce5/plugin.min.js`,
  },
  toolbar: 'undo redo | styleselect | bold italic | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',

  // Handle events.
  setup(editor) {
    // Launch on init event.
    editor.on('init', () => {
      // Get and set the editor and wiris versions in this order.
      Generic.setEditorAndWirisVersion(`${tinymce.majorVersion}.${tinymce.minorVersion}`, WirisPlugin.currentInstance.version);   //eslint-disable-line
    });
  },
});

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(tinyMCE.activeEditor.getContent(), 'transform_content');            //eslint-disable-line
});
