// Load scripts.
import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
import '@wiris/mathtype-generic/wirisplugin-generic';
import * as Generic from '../../../../resources/demos/common';

// Load styles.
import './static/style.css';
import '../../../../resources/demos/design.css';

// Generate scripts.
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editable', 'transform_content');

const editableDiv = document.getElementById('editable');
const toolbarDiv = document.getElementById('toolbar');

// Initialyze the editor.
wrsInitEditor(editableDiv, toolbarDiv);

// eslint-disable-next-line func-names
document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    const versionWiris = WirisPlugin.currentInstance.version;             //eslint-disable-line
    document.getElementById('version_wiris').innerHTML += versionWiris;
  }
};

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent(WirisPlugin.Parser.initParse(editableDiv.innerHTML), 'transform_content');      //eslint-disable-line
});
