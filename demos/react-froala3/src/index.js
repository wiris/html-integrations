// Default React App from create-react-app command

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
 
// Froala Editor.
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min.js';

import $ from 'jquery';
 
window.$ = $;

window.FroalaEditor = require('froala-editor');
require('@wiris/mathtype-froala3');
 
const toolbar = ['wirisEditor', 'wirisChemistry'];
const froalaConfig = {
  iframe: true,
  charCounterCount: false,
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageRemove'],
  toolbarButtons: toolbar,
  toolbarButtonsMD: toolbar,
  toolbarButtonsSM: toolbar,
  toolbarButtonsXS: toolbar,
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],
  htmlAllowedEmptyTags: ['mprescripts'],
  imageResize : false,
  key: 'CA5D-16E3A2E3G1I4A8B8A9B1D2rxycF-7b1C3vyz==',
  heightMax: 310,
  useClasses: false
};
 
ReactDOM.render(<FroalaEditorComponent config={ froalaConfig } />, document.getElementById('root'));
 
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();