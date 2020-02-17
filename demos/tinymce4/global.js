// Load sripts


// Load styles
import './style.css';

// Inicialyze default editor
tinymce.init({
    selector: '#editor',
    external_plugins: {
        'tiny_mce_wiris' : 'http://localhost:8006/node_modules/@wiris/mathtype-tinymce4/plugin.min.js'
    },
    toolbar: 'undo redo | styleselect | bold italic | tiny_mce_wiris_formulaEditor,tiny_mce_wiris_formulaEditorChemistry'
    // toolbar: "undo redo | styleselect | bold italic | alignleft | tiny_mce_wiris_formulaEditor,tiny_mce_wiris_formulaEditorChemistry";
  });
  