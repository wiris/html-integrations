// Import styles.
import './design.css';

// Export generic functions.
// eslint-disable-next-line import/extensions
export * from './common.js';

// Display html content.
// We force the use of html-loader, for angular and react applications
document.body.innerHTML = require('html-loader!./index.html');

// Generate scripts.
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);
