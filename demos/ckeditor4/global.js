// Load scripts
import '@wiris/mathtype-ckeditor4/plugin.js';


// Add wiris plugin
CKEDITOR.plugins.addExternal('ckeditor_wiris', './node_modules/@wiris/mathtype-ckeditor4/', 'plugin.js');

// Initialize plugin
CKEDITOR.replace( 'editor', {
    uiColor: '#9AB8F3',
    extraPlugins: 'ckeditor_wiris',
    allowedContent: true
} );