import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Import wiris dependencies.
import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
import '@wiris/mathtype-generic/wirisplugin-generic';
import { version as pluginVersion } from '@wiris/mathtype-generic/package.json';

// Load the file that contains common imports between demos. (functions, styles, etc)
import * as Generic from 'resources/demos/react-imports';
import reportWebVitals from './reportWebVitals';

// Set the initial content.
// eslint-disable-next-line max-len
const content = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>x</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

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

    // Initialyze the editor.
    window.wrs_int_init(editableDiv, toolbarDiv);
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
