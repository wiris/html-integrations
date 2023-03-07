import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Import wiris dependencies.
import '@wiris/mathtype-generic/wirisplugin-generic';
import { version as pluginVersion } from '@wiris/mathtype-generic/package.json';

// Load the file that contains common imports between demos. (functions, styles, etc)
import * as Generic from 'resources/demos/common';
import 'resources/demos/design.css';

import reportWebVitals from './reportWebVitals';

// Generate scripts.
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// Set the initial content.
// eslint-disable-next-line max-len
const content = Generic.editorContentImg;

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = content;

document.getElementById('version_wiris').innerHTML += pluginVersion;

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(WirisPlugin.Parser.initParse(htmlEditor.innerHTML), 'transform_content');      //eslint-disable-line
});

// Create toolbar component.
// eslint-disable-next-line no-unused-vars
function Toolbar() {
  return (
    <div id="toolbar"></div>
  );
}

// Create editable component.
// eslint-disable-next-line no-unused-vars
function HtmlEditor(props) {
  return (
    <div id="htmlEditor" contentEditable="true" dangerouslySetInnerHTML={{ __html: props.data }}></div>
  );
}

// eslint-disable-next-line no-unused-vars
class Editor extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    // Load the toolbar and the editable area into const variables to work easy with them.
    const editableDiv = document.getElementById('htmlEditor');
    const toolbarDiv = document.getElementById('toolbar');
    const mathTypeParameters = {
      editorParameters: { language: 'en' }, // MathType config, including language
    };

    // Initialyze the editor.
    window.wrs_int_init(editableDiv, toolbarDiv, mathTypeParameters);
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    // Array of react components.
    return [
      <Toolbar key="toolbar-generic" />,
      <HtmlEditor data = {content} key="editor-generic" />,
    ];
  }
}

ReactDOM.render(<Editor />, document.getElementById('editor'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
reportWebVitals();
