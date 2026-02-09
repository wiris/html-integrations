// Load styles.
import "./static/style.css";

// Load the file that contains common imports between demos.
import * as Generic from "resources/demos/imports";

// Apply specific demo names to all the objects.
document.getElementById("header_title_name").innerHTML = "MathType for TinyMCE 6 on HTML";
document.getElementById("version_editor").innerHTML = "TinyMCE: ";

// Copy the editor content before initializing it.
// Currently disabled by decision of QA.
// Generic.copyContentFromxToy('editor', 'transform_content');

// Set up the editor.
tinymce.init({
  selector: "#editor",
  external_plugins: {
    tiny_mce_wiris: `${window.location.href}dist/plugin.min.js`,
  },

  // We recommend to set 'draggable_modal' to true to avoid overlapping issues
  // with the different UI modal dialog windows implementations between core and third-party plugins on TinyMCE.
  // @see: https://github.com/wiris/html-integrations/issues/134#issuecomment-905448642
  draggable_modal: true,
  plugins: ["image", "media"],
  toolbar:
    "undo redo | styleselect | bold italic | image media | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",

  // language: 'fr_FR',
  // You could set a different language for MathType editor:
  // mathTypeParameters: {
  //   editorParameters: { language: 'de' },
  // },

  // Handle events.
  setup(editor) {
    // Launch on init event.
    editor.on("init", () => {
      // Get and set the editor and wiris versions in this order.
      Generic.setEditorAndWirisVersion(
        `${tinymce.majorVersion}.${tinymce.minorVersion}`,
        WirisPlugin.currentInstance.version,
      ); //eslint-disable-line

      // Insert the initial content in the editor.
      editor.setContent(Generic.editorContentMathML);
    });
  },
});

// Set up the editor.
tinymce.init({
  selector: "#editor2",
  external_plugins: {
    tiny_mce_wiris: `${window.location.href}dist/plugin.min.js`,
  },

  // We recommend to set 'draggable_modal' to true to avoid overlapping issues
  // with the different UI modal dialog windows implementations between core and third-party plugins on TinyMCE.
  // @see: https://github.com/wiris/html-integrations/issues/134#issuecomment-905448642
  draggable_modal: true,
  plugins: ["image", "media"],
  toolbar:
    "undo redo | styleselect | bold italic | image media | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",

  mathTypeParameters: {
    editorParameters: { toolbar: "<toolbar ref='general' removeLinks='true'><removeTab ref='arrows'/><removeTab ref='symbols'/><tab ref='symbols' before='matrices'/><tab ref='matrices' rows='1' extraRows='2'><removeItem ref='squareColumn'/><section position='0' rows='4' layout='horizontal' extraRows='2' extraLayout='vertical'><item ref='fraction'/><item ref='squareRoot' before='fraction'/><item ref='squareRoot' after='fraction' extra='true'/></section><section position='5'><createButton icon='https://www.wiris.com/wp-content/uploads/2024/01/squareroot_fraction.gif' title='Square root of a fraction' offset='2'><content><msqrt><mfrac><mrow/><mrow/></mfrac></msqrt></content></createButton></section></tab><tab ref='general' empty='true' rows='3'><item ref='fraction'/><item ref='squareRoot'/></tab><tab name='mytab' layout='horizontal'><empty/><item ref='copy'/><item ref='paste'/></tab></toolbar>" },
  },
});

tinymce.init({
  selector: "#editor3",
  external_plugins: {
    tiny_mce_wiris: `${window.location.href}dist/plugin.min.js`,
  },

  // We recommend to set 'draggable_modal' to true to avoid overlapping issues
  // with the different UI modal dialog windows implementations between core and third-party plugins on TinyMCE.
  // @see: https://github.com/wiris/html-integrations/issues/134#issuecomment-905448642
  draggable_modal: true,
  plugins: ["image", "media"],
  toolbar:
    "undo redo | styleselect | bold italic | image media | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",

  mathTypeParameters: {
    editorParameters: { toolbar: 'chemistry' },
  },
});

tinymce.init({
  selector: "#editor4",
  external_plugins: {
    tiny_mce_wiris: `${window.location.href}dist/plugin.min.js`,
  },

  // We recommend to set 'draggable_modal' to true to avoid overlapping issues
  // with the different UI modal dialog windows implementations between core and third-party plugins on TinyMCE.
  // @see: https://github.com/wiris/html-integrations/issues/134#issuecomment-905448642
  draggable_modal: true,
  plugins: ["image", "media"],
  toolbar:
    "undo redo | styleselect | bold italic | image media | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",

  mathTypeParameters: {
    editorParameters: { toolbar: 'chemistry' },
  },
});

// Add listener on click button to launch updateContent function.
document.getElementById("btn_update").addEventListener("click", (e) => {
  e.preventDefault();
  Generic.updateContent(tinyMCE.activeEditor.getContent(), "transform_content"); // eslint-disable-line no-undef
});
