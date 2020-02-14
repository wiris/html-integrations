
import {wrsInitEditor} from '@wiris/mathtype-generic/wirisplugin-generic.src'

const editableDiv  = document.getElementById('editable'); 
const toolbarDiv = document.getElementById('toolbar');

wrsInitEditor(editableDiv, toolbarDiv);