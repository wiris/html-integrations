// Load scripts


// Load styles
import './style.css'

tinymce.init({
    selector: '#editor',
    external_plugins: {
      'tiny_mce_wiris' : 'http://localhost:8006/node_modules/@wiris/mathtype-tinymce5/plugin.min.js'
    },
    toolbar: 'undo redo | styleselect | bold italic | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry'
  });