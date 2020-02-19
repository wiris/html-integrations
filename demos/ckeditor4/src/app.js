// Load scripts
import '@wiris/mathtype-ckeditor4/plugin';

// Load styles
import './static/style.css';


// Add wiris plugin
CKEDITOR.plugins.addExternal('ckeditor_wiris', `${window.location.href}node_modules/@wiris/mathtype-ckeditor4/`, 'plugin.js');

// Initialize plugin
CKEDITOR.replace('editor', {
  extraPlugins: 'ckeditor_wiris',
  allowedContent: true,
});
