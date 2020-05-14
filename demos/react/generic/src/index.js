import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
import '@wiris/mathtype-generic/wirisplugin-generic';

// Load WIRISplugins.js dinamically
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);


function Toolbar(props) {
  return (
    <div id="toolbar" key={props.id}></div>
  );
}

function HtmlEditor(props) {
  return (
    <div id="htmlEditor" key={props.id} contentEditable="true" dangerouslySetInnerHTML={{ __html: props.data }}></div>
  );
}

class Editor extends React.Component {
  componentDidMount() {
    // Load the toolbar and the editable area into const variables to work easy with them
    const editableDiv = document.getElementById('htmlEditor');
    const toolbarDiv = document.getElementById('toolbar');
    console.log(editableDiv);
    console.log(toolbarDiv)

    // Initialyze the editor.
    wrsInitEditor(editableDiv, toolbarDiv);
  }
  render() {
    return [
      <Toolbar id = "toolbar"/>,
      <HtmlEditor data = {content} id="htmlEditor"/>
    ];
  }
}

const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';



ReactDOM.render(
  <Editor key="ff"/>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
