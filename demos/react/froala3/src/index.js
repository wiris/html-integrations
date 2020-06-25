// Default React App from create-react-app command.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
 
// Add Froala 3 Editor.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';

// Add jquery.
import $ from 'jquery';

// Load the file that contains common imports between demos. (functions, styles, etc)
import * as Generic from 'resources/demos/react-imports';

// Import the wiris plugin version.
import { version as pluginVersion } from '@wiris/mathtype-froala3/package.json';

// This needs to be included before the '@wiris/mathtype-froala3' is loaded synchronously.
window.$ = $;
window.FroalaEditor = require('froala-editor');

// Load scripts synchronously.
require('@wiris/mathtype-froala3');

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for Froala';
document.getElementById('version_editor').innerHTML = 'Froala editor: ';

// Set the initial content.
const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>x</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>'

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = content;

// Add listener on click button to launch updateFunction.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(FroalaEditor.INSTANCES[0].html.get(), 'transform_content');                     //eslint-disable-line
});

// Initialize editor.
// Define the toolbar & configuration options for the froala editor.
const toolbar = ['undo', 'redo', 'bold', '|', 'wirisEditor', 'wirisChemistry', 'clear', 'insert'];
const froalaConfig = {
  // iframe: true,
  toolbarButtons: toolbar,
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],

  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],

  htmlAllowedEmptyTags: ['mprescripts'],
  imageResize : false,
  key: 'CA5D-16E3A2E3G1I4A8B8A9B1D2rxycF-7b1C3vyz==',
  // heightMax: 310,
  // useClasses: false,

  // Execute on initialyzed editor.
  events: {
    initialized: function (e) {
      // Get and set the editor and wiris versions in this order.
      Generic.setEditorAndWirisVersion(FroalaEditor.VERSION, pluginVersion);        //eslint-disable-line
    }
  }
};

/* Create a component to be rendered later.
 This is important to remove complexity from the reactDom.render 
 and to be able to add other functionality. */
class Editor extends React.Component {
  render() {
    return (
      <FroalaEditorComponent config={ froalaConfig } model={ content } />
    );
  }
}

// Render our components on page.
ReactDOM.render(<Editor />, document.getElementById('editor'));
 
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();