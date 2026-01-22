// Load scripts.
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Alignment, SourceEditing } from "ckeditor5";
import MathType from "@wiris/mathtype-ckeditor5/dist/index.js";
import { TrackChanges, Comments, TrackChangesPreview } from "ckeditor5-premium-features";

// import coreTranslations from 'ckeditor5/translations/de.js';

// Load styles.
import "./static/style.css";
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import "@wiris/mathtype-ckeditor5/dist/index.css";

import packageInfo from "@wiris/mathtype-ckeditor5/package.json";

// Load the file that contains common imports between demos.
import * as Generic from "resources/demos/imports";

// Apply specific demo names to all the objects.
document.getElementById("header_title_name").innerHTML = "MathType for CKEditor 5 on HTML";
document.getElementById("version_editor").innerHTML = "CKEditor: ";

// Insert the initial content in the editor
document.getElementById("editor").innerHTML = Generic.editorContentMathML;

// Copy the editor content before initializing it.
// Currently disabled by decision of QA.
// Generic.copyContentFromxToy('editor', 'transform_content');

window.editor = null;

// Create the CKEditor 5.
ClassicEditor.create(document.querySelector("#editor"), {
  licenseKey: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Njk0NzE5OTksImp0aSI6IjE0ODc0ZDZkLTNjZWUtNGI3Ni1hYzA5LWNjMmY2NWU4NjIxZiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjNhMWYxYmVkIn0.fNRCXTa3WL263IiKmCjSIgwwCfMOzzklkrUPGqJbV_C5rI9ab5FXkdqt20rQ1ghJfERoeOD2fY50cNclDUgo9Q",
  plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment, SourceEditing, TrackChanges, Comments, TrackChangesPreview],
  toolbar: [
    "bold",
    "italic",
    "MathType",
    "ChemType",
    "alignment:left",
    "alignment:center",
    "alignment:right",
    "trackChanges",
    "comment",
    "sourceEditing",
  ],
  // translations: [
  //   coreTranslations,
  // ],
  // language: {
  //   ui: 'de',
  //   content: 'de'
  // },
  // mathTypeParameters: {
  //   editorParameters: { language: 'es' }, // MathType config, including language
  // },
})
  .then((editor) => {
    window.editor = editor;

    // Attribute suggestions/comments to a user.
    const users = editor.plugins.get("Users");
    users.addUser({ id: "u1", name: "Editor User", initials: "EU", color: "#4a8cff" });
    users.defineMe("u1");

    // Disable suggestions mode by default.
    editor.execute("trackChanges");
    editor.execute('trackChanges', { forceValue: false });
    // Add listener on click button to launch updateContent function.
    // document.getElementById('btn_update').addEventListener('click', (e) => {
    //   e.preventDefault();
    //   Generic.updateContent(editor.getData(), 'transform_content');
    // });

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
