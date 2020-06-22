// Default React App from create-react-app command.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Import CKEditor.
import CKEditor from '@ckeditor/ckeditor5-react';

// import CKEditor custom build'.
import * as ClassicEditor from './ckeditor';

// Load the file that contains common imports between demos. (functions, styles, etc)
import * as Generic from 'resources/demos/react-imports';

// Import the wiris plugin version.
import { version as pluginVersion } from '@wiris/mathtype-ckeditor5/package.json';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for CKEditor';
document.getElementById('version_editor').innerHTML = 'CKEditor editor: ';

// Set the initial content.
const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>'

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = content;


// Initialize editor.
// Define the toolbar & configuration options for the ckeditor.
const toolbar = ['bold', 'italic', 'MathType', 'ChemType', 'alignment:left', 'alignment:center', 'alignment:right'];
const ckConfig = {
  iframe: true,
  charCounterCount: false,
  toolbar: toolbar,
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],
  htmlAllowedEmptyTags: ['mprescripts'],
  imageResize : false,
  useClasses: false
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
 class Editor extends React.Component {
  render() {
    return (
      <CKEditor editor = { ClassicEditor } config={ ckConfig } data = { content } onInit = { editor => { updateContent(editor) }}/>
    );
  }
}

ReactDOM.render(<Editor />, document.getElementById('editor'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
