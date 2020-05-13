import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { Editor } from '@tinymce/tinymce-react';
// Add jquery.
import $ from 'jquery';

const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// This needs to be included before the '@wiris/mathtype-froala3' is loaded synchronously
window.$ = $;
window.tinymce = require('tinymce');
require('@wiris/mathtype-tinymce5');


const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>'; // eslint-disable-next-line

const options = {
  height: 500,
  menubar: false,
  // base_url: '/tinymce', // Root for resources
  // suffix: '.min',        // Suffix to use when loading resources

  // Add wiris plugin
  external_plugins: {
    'tiny_mce_wiris' : 'http://localhost:4200/node_modules/@wiris/mathtype-tinymce5/plugin.min.js' 
  },
  plugins: [
    'advlist autolink lists link image charmap print preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount '
  ],
  toolbar: [
    ' bold italic | \
       tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry '
  ],
  htmlAllowedTags:  ['.*'],
  htmlAllowedAttrs: ['.*'],
};

ReactDOM.render(<Editor init ={ options } initialValue = { content } />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
