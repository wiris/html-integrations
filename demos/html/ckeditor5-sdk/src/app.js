// Load scripts.
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Alignment, SourceEditing } from "ckeditor5";
import MathType from "@wiris/mathtype-ckeditor5-sdk/dist/index.js";

// Load styles.
import "./static/style.css";
import "ckeditor5/ckeditor5.css";
import "@wiris/mathtype-ckeditor5-sdk/dist/index.css";

import packageInfo from "@wiris/mathtype-ckeditor5-sdk/package.json";

// Load the file that contains common imports between demos.
import * as Generic from "resources/demos/imports";

// Apply specific demo names to all the objects.
document.getElementById("header_title_name").innerHTML = "MathType for CKEditor 5 (SDK) on HTML";
document.getElementById("version_editor").innerHTML = "CKEditor: ";

// Insert the initial content in the editor
document.getElementById("editor").innerHTML = Generic.editorContentMathML;

window.editor = null;

// Create the CKEditor 5.
ClassicEditor.create(document.querySelector("#editor"), {
  licenseKey: process.env.CK5_LICENSE_KEY || "GPL",
  plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment, SourceEditing],
  toolbar: [
    "bold",
    "italic",
    "MathType",
    "alignment:left",
    "alignment:center",
    "alignment:right",
    "sourceEditing",
  ],
  // mathTypeParameters: {
  //   sdkConfig: {
  //     url: 'https://www.wiris.net/demo/editor',
  //     variant: 'modern',
  //     environment: 'production',
  //   },
  //   editorModalConfig: {
  //     language: 'en',
  //   },
  // },
})
  .then((editor) => {
    window.editor = editor;

    // Get and set the editor and wiris versions in this order.
    Generic.setEditorAndWirisVersion("5.0.0", packageInfo.version);
    editor.editing.view.focus();
  })
  .catch((error) => {
    console.error(error.stack); //eslint-disable-line
  });

document.getElementById("btn_update").addEventListener("click", (e) => {
  e.preventDefault();
  Generic.updateContent(window.editor.getData(), "transform_content");
});
