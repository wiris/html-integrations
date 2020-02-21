// Generate scripts
var jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';

// Load scripts
import '@wiris/mathtype-ckeditor4/plugin';
document.head.appendChild(jsDemoImagesTransform);

// Load styles
import './static/style.css';


// Add wiris plugin
CKEDITOR.plugins.addExternal('ckeditor_wiris', `${window.location.href}node_modules/@wiris/mathtype-ckeditor4/`, 'plugin.js');

// Initialize plugin
CKEDITOR.replace('editor', {
  extraPlugins: 'ckeditor_wiris',
  allowedContent: true,
});

// Takes the data of the editor
// Replaces the content of a div with the data transformed
function updateFunction() {
  const editorContent = CKEDITOR.instances.editor.getData();
  document.getElementById("editorContentTransform").innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));
}

// Add listener on click button to launch updateFunction
document.getElementById('btn-update').addEventListener('click', ()=>{
  updateFunction();
});

// Execute, just for the first time, 
// the transformation of the actual CKEDITOR4 content
CKEDITOR.on('instanceReady', function() {
  updateFunction();
});