// Load styles
import 'froala-editor/css/froala_editor.pkgd.min.css';
import './static/style.css';

$('head').append('<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');
$('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.3.0/codemirror.min.css">');
$('head').append('<script src="node_modules/@wiris/mathtype-froala/wiris.js"></script>');

const toolbar = ['undo', 'redo', 'bold', '|', 'wirisEditor', 'wirisChemistry', '|', 'insertImage', 'html'];

const froalaConfiguration = {
  pluginsEnabled: ['wiris', 'align', 'charCounter', 'codeBeautifier', 'codeView', 'colors', 'draggable', 'embedly', 'emoticons', 'entities', 'file', 'fontAwesome', 'fontFamily', 'fontSize', 'fullscreen', 'image', 'imageTUI', 'imageManager', 'inlineStyle', 'inlineClass', 'lineHeight', 'link', 'lists', 'paragraphFormat', 'paragraphStyle', 'quickInsert', 'quote', 'save', 'table', 'url', 'video', 'wordPaste'],
  imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageRemove'],
  toolbarButtons: toolbar,
  toolbarButtonsMD: toolbar,
  toolbarButtonsSM: toolbar,
  toolbarButtonsXS: toolbar,
  htmlAllowedTags: ['.*'],
  htmlAllowedAttrs: ['.*'],
};

$('#editor').froalaEditor(froalaConfiguration);

// Takes the data of the editor
// Replaces the content of a div with the data transformed
function updateFunction() {
  const editorContent = $('#editor').froalaEditor('html.get');
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));
}

// Add listener on click button to launch updateFunction
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
});

// Execute, just for the first time,
// the transformation of the actual CKEDITOR4 content
// $('#editor').on('froalaEditor.documentReady', function() {
//   updateFunction();
// });

setTimeout(() => {
  updateFunction();
}, 500);
