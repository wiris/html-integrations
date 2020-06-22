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
  // toolbarButtons: ['undo', 'redo' , 'bold', '|','clear', 'insert']
  toolbarButtons: ['undo', 'redo', 'bold', '|', 'wirisEditor', 'wirisChemistry', 'clear', 'insert'],

  // Add [MW] buttons to Image Toolbar.
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],

  // Allowed tags.
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],

  // Execute on initialyzed editor.
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
