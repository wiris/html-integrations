import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Froala Editor.
// import 'froala-editor/css/froala_style.min.css';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import FroalaEditorComponent from 'react-froala-wysiwyg';
// import 'froala-editor/js/plugins.pkgd.min.js';
import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as ClassicEditor2 from './ckeditor';
import $ from 'jquery';
 
window.$ = $;
// window.FroalaEditor = require('froala-editor');
// require('@wiris/makthtype-ckeditor5');

const content = 'a';
const toolbar = ['bold', 'italic', 'MathType', 'ChemType'];
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
 
ReactDOM.render(<CKEditor editor = { ClassicEditor2 } config={ ckConfig } data = { content } />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
