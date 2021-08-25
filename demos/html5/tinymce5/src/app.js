// Load styles.
import './static/style.css';

// Load the file that contains common imports between demos.
import * as Generic from '../../../../resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for TinyMCE';
document.getElementById('version_editor').innerHTML = 'TinyMCE editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

// Set up the editor.
tinymce.init({
  selector: '#editor',
  external_plugins: {
    tiny_mce_wiris: `${window.location.href}node_modules/@wiris/mathtype-tinymce5/plugin.min.js`,
  },
  // We recommend to set 'draggable_modal' to true to avoid overlapping issues
  // with the different UI modal dialog windows implementations between core and third-party plugins on TinyMCE.
  // @see: https://github.com/wiris/html-integrations/issues/134#issuecomment-905448642
  draggable_modal: true,
  plugins: ['image', 'media'],
  toolbar: 'undo redo | styleselect | bold italic | image media | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',

  // language: 'fr_FR',
  // You could set a different language for MathType editor:
  // mathTypeParameters: {
  //   editorParameters: { language: 'de' },
  // },

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
