// Load scripts.
import '@wiris/mathtype-froala3/wiris';

// Load styles.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import './static/style.css';

// Load the file that contains common imports between demos.
import * as Generic from '../../../../resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for Froala';
document.getElementById('version_editor').innerHTML = 'Froala editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

// Initialize editor.
new FroalaEditor('#editor', {                                                                                                 //eslint-disable-line
  // Define the toolbar options for the froala editor.
  toolbarButtons: ['undo', 'redo', 'bold', 'italic', '|', 'wirisEditor', 'wirisChemistry', 'insertImage'],

  // Add [MW] buttons to the image editing popup Toolbar.
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],

  // Allow all the tags to understand the mathml
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],

  // List of tags that are not removed when they have no content inside
  // so that formulas renderize propertly
  htmlAllowedEmptyTags: ['mprescripts', 'none'],

  // Froala editor language
  // language: 'de',
  // You could set a different language for MathType editor:
  // mathTypeParameters: {
  //   editorParameters: { language: 'es' },
  // },

  // Execute on initialized editor.
  events: {
    initialized() {
      // Get and set the editor and wiris versions in this order.
      Generic.setEditorAndWirisVersion(FroalaEditor.VERSION, WirisPlugin.currentInstance.version);        //eslint-disable-line
    },
  },
});

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(FroalaEditor.INSTANCES[0].html.get(), 'transform_content');                     //eslint-disable-line
});
