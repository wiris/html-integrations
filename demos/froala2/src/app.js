// Load styles.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import './static/style.css';

$('head').append('<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');    //eslint-disable-line
$('head').append('<script src="node_modules/@wiris/mathtype-froala/wiris.js"></script>');       //eslint-disable-line

// Copy the editor content before initializing it.
document.getElementById('editorContentTransform').innerHTML = document.getElementById('editor').innerHTML;

// Define the elements that will appear in the toolbar.
const toolbar = ['undo', 'redo', 'bold', '|', 'wirisEditor', 'wirisChemistry', '|', 'insertImage', 'html'];

// Define editor configuration.
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

// Get froala and wiris plugin versions when editor initialized.
$('#editor').on('froalaEditor.initialized', function(e, editor) {          //eslint-disable-line
  const versionWiris = WirisPlugin.currentInstance.version;                //eslint-disable-line
  const versionFroala = $.FE.VERSION;                                      //eslint-disable-line
  document.getElementById('version-wiris').innerHTML += versionWiris;
  document.getElementById('version-froala').innerHTML += versionFroala;
});

// Initialyze the editor.
$('#editor').froalaEditor(froalaConfiguration);           //eslint-disable-line

// Takes the data of the editor.
// Replaces the content of a div with the data transformed.
function updateFunction() {
  const editorContent = $('#editor').froalaEditor('html.get');                                      //eslint-disable-line
  document.getElementById('editorContentTransform').innerHTML = editorContent;
  com.wiris.js.JsPluginViewer.parseElement(document.getElementById('editorContentTransform'));      //eslint-disable-line
}

// Add listener on click button to launch updateFunction.
document.getElementById('btn-update').addEventListener('click', () => {
  updateFunction();
});
