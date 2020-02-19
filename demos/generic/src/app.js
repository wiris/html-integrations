// Load scripts
import {wrsInitEditor} from '@wiris/mathtype-generic/wirisplugin-generic.src';
import '@wiris/mathtype-generic/wirisplugin-generic.js';

// Load styles
import './static/style.css';

const editableDiv  = document.getElementById('editable'); 
const toolbarDiv = document.getElementById('toolbar');

wrsInitEditor(editableDiv, toolbarDiv);