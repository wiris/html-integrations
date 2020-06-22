// Load styles.
import 'froala-editor/css/froala_editor.pkgd.min.css';
import './static/style.css';       //eslint-disable-line

// Load the file that contains common imports between demos.
import * as Generic from '../../../../resources/demos/imports';

$('head').append('<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet" type="text/css" />');    //eslint-disable-line
$('head').append('<script src="node_modules/@wiris/mathtype-froala/wiris.js"></script>');  //eslint-disable-line

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for Froala';
document.getElementById('version_editor').innerHTML = 'Froala editor: ';

// Copy the editor content before initializing it.
Generic.copyContentFromxToy('editor', 'transform_content');

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

// On editor initialized event.
$('#editor').on('froalaEditor.initialized', function(e, editor) {          //eslint-disable-line
  // Get and set the editor and wiris versions in this order.
  Generic.setEditorAndWirisVersion($.FE.VERSION, WirisPlugin.currentInstance.version);        //eslint-disable-line
});

// Initialyze the editor.
$('#editor').froalaEditor(froalaConfiguration);           //eslint-disable-line

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent($('#editor').froalaEditor('html.get'), 'transform_content');          //eslint-disable-line
});
