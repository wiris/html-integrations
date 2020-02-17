// Load scripts
import '@wiris/mathtype-ckeditor4/plugin.js';

// Load styles
import './style.css';


// Add wiris plugin
CKEDITOR.plugins.addExternal('ckeditor_wiris', './node_modules/@wiris/mathtype-ckeditor4/', 'plugin.js');

// Initialize plugin
CKEDITOR.replace( 'editor', {
    extraPlugins: 'ckeditor_wiris',
    allowedContent: true
} );

//   const element = document.createElement('div');
//    const myIcon = new Image();
//    myIcon.src = formulaIcon;
//    element.appendChild(myIcon);

//   document.body.append(element);