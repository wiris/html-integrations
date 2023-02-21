// Default React App from create-react-app command.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Import CKEditor.
import CKEditor from '@ckeditor/ckeditor5-react'; // eslint-disable-line no-unused-vars

// import CKEditor custom build'.

// Load the file that contains common imports between demos. (functions, styles, etc)
import * as Generic from 'resources/demos/imports';

// Import the wiris plugin version.
import { version as pluginVersion } from '@wiris/mathtype-ckeditor5/package.json';
import * as ClassicEditor from './ckeditor';
import reportWebVitals from './reportWebVitals';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for CKEditor';
document.getElementById('version_editor').innerHTML = 'CKEditor editor: ';

// Set the initial content.
const content = `<div>MathType - Keyboard: <math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mi>x</mi></msqrt></math></div>
<div>MathType - Handwriting: <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mfrac><mi>x</mi><mn>3</mn></mfrac><annotation encoding="application/json">{"x":[[8,64,120],[50,74],[49,75],[50,79,80,50,51,63,74,79,78,66,54,48]],"y":[[89,89,89],[7,72],[72,7],[105,105,105,147,147,146,152,168,204,213,211,197]],"t":[[0,0,0],[0,0],[0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],"version":"2.0.0"}</annotation></semantics></math></div>
<div>ChemType - Keyboard: <math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><msup><mi mathvariant="normal">x</mi><mn>2</mn></msup></math></div>
<div>ChemType - Handwriting: <math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><semantics><msub><mi>x</mi><mn>4</mn></msub><annotation encoding="application/json">{"x":[[5,29],[4,30],[52,52,52,41,41,56]],"y":[[7,72],[72,7],[100,48,48,84,84,84]],"t":[[0,0],[0,0],[0,0,0,0,0,0]],"version":"2.0.0"}</annotation></semantics></math></div>
`;

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = content;

// Initialize editor.
// Define the toolbar & configuration options for the ckeditor.
const toolbar = ['bold', 'italic', 'MathType', 'ChemType', 'alignment:left', 'alignment:center', 'alignment:right'];
const ckConfig = {
  iframe: true,
  charCounterCount: false,
  toolbar,
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],
  htmlAllowedEmptyTags: ['mprescripts'],
  imageResize: false,
  useClasses: false,
};

// Function to call when the editor is initialyzed so it can add listeners on buttons.
function updateContent(ckeditor) {
  // Add listener on click button to launch updateContent function.
  document.getElementById('btn_update').addEventListener('click', (e) => {
    e.preventDefault();
    Generic.updateContent(ckeditor.getData(), 'transform_content');
  });
}

// Get and set the editor and wiris versions in this order.
Generic.setEditorAndWirisVersion('5.0.0', pluginVersion);

/* Create a component to be rendered later.
 This is important to remove complexity from the reactDom.render
 and to be able to add other functionality. */
// eslint-disable-next-line no-unused-vars
class Editor extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <CKEditor editor = { ClassicEditor } config={ ckConfig } data = { content } onInit = { (editor) => { updateContent(editor); }}/>
    );
  }
}

ReactDOM.render(<Editor />, document.getElementById('editor'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();
