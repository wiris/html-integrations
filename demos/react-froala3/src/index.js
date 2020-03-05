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

// This needs to be included before the '@wiris/mathtype-froala3' is loaded synchronously
window.$ = $;
window.FroalaEditor = require('froala-editor');

// Load scripts synchronously.
require('@wiris/mathtype-froala3');

// Generate scripts.
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// Copy the editor content before initializing it.
document.getElementById('editorContentTransform').innerHTML = document.getElementById('editor').innerHTML;

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = FroalaEditor.INSTANCES[0].html.get();                                           //eslint-disable-line
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));                //eslint-disable-line
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
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

  // htmlAllowedEmptyTags: ['mprescripts'],
  // imageResize : false,
  // key: 'CA5D-16E3A2E3G1I4A8B8A9B1D2rxycF-7b1C3vyz==',
  // heightMax: 310,
  // useClasses: false,

  // Execute on initialyzed editor
  events: {
    initialized: function (e) {
      // Get froala and wiris plugin versions.
      // const versionWiris  = WirisPlugin.currentInstance.version;             //eslint-disable-line
      const versionFroala = FroalaEditor.VERSION;                           //eslint-disable-line

      console.log(versionFroala);

      // document.getElementById('version-wiris').innerHTML += versionWiris;
      document.getElementById('version-froala').innerHTML += versionFroala;

      // const editor = this;
      // console.log('@@@@@@initialized', editor, e);

    }
  }
};

// Render our components on page.
ReactDOM.render(<FroalaEditorComponent config={ froalaConfig } />, document.getElementById('editor'));
 
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();