import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { Editor } from '@tinymce/tinymce-react';
// Add jquery.
import $ from 'jquery';

// Load the file that contains common imports between demos. (functions, styles, etc)
import * as Generic from 'resources/demos/react-imports';

// Import the wiris plugin version.
import { version as pluginVersion } from '@wiris/mathtype-tinymce5/package.json';

// This needs to be included before the '@wiris/mathtype-froala3' is loaded synchronously
window.$ = $;
window.tinymce = require('tinymce');

// Load scripts synchronously.
require('@wiris/mathtype-tinymce5');

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for TinyMCE';
document.getElementById('version_editor').innerHTML = 'TinyMCE editor: ';

// Set the initial content.
const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>'; // eslint-disable-next-line

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = content;

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(tinyMCE.activeEditor.getContent(), 'transform_content');            //eslint-disable-line
});

// Define the toolbar & configuration options for the TinyMCE editor.
const options = {
  height: 500,
  menubar: false,

  // Add wiris plugin
  external_plugins: {
    'tiny_mce_wiris' : `${window.location.href}/node_modules/@wiris/mathtype-tinymce5/plugin.min.js` 
  },
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount '
  ],
  toolbar: [
    ' bold italic |' +
       'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry '
  ],
  htmlAllowedTags:  ['.*'],
  htmlAllowedAttrs: ['.*'],

  // Handle events.
  setup(editor) {
    // Launch on init event.
    editor.on('init', () => {
      // Get and set the editor and wiris versions in this order.
      Generic.setEditorAndWirisVersion(`${tinymce.majorVersion}.${tinymce.minorVersion}`, pluginVersion);   //eslint-disable-line
    });
  },
};


/* Create a component to be rendered later.
 This is important to remove complexity from the reactDom.render 
 and to be able to add other functionality. */
 class EditorTiny extends React.Component {
  render() {
    return (
      <Editor init ={ options } initialValue = { content } />
    );
  }
}

ReactDOM.render(<EditorTiny />, document.getElementById('editor'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
