// Add wiris plugin
CKEDITOR.plugins.addExternal('ckeditor_wiris', './node_modules/@wiris/mathtype-ckeditor4/', 'plugin.js');

// Change editor configuration
CKEDITOR.editorConfig = function (config) {
    
};

// Initialize plugin
CKEDITOR.replace( 'editor', {
    uiColor: '#9AB8F3',
    extraPlugins: 'ckeditor_wiris',
    allowedContent: true
} );