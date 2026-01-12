// Load scripts.
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Alignment, SourceEditing } from "ckeditor5";
import { TrackChanges, Comments } from "ckeditor5-premium-features";
// Load CKEditor base styles first, then premium features, then local tweaks
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import MathType from "@wiris/mathtype-ckeditor5/dist/index.js";

// Load styles.
import "./static/style.css";

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

// Create the CKEditor 5.
const editor = await ClassicEditor.create(document.querySelector("#editor"), {
  licenseKey: "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Njk0NzE5OTksImp0aSI6IjE0ODc0ZDZkLTNjZWUtNGI3Ni1hYzA5LWNjMmY2NWU4NjIxZiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjNhMWYxYmVkIn0.fNRCXTa3WL263IiKmCjSIgwwCfMOzzklkrUPGqJbV_C5rI9ab5FXkdqt20rQ1ghJfERoeOD2fY50cNclDUgo9Q",
  plugins: [Essentials, Paragraph, Bold, Italic, MathType, Alignment, SourceEditing, TrackChanges, Comments],
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
  // Configure the sidebar for annotations
  sidebar: {
    container: document.querySelector('#editor-annotations')
  },
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
});

globalThis.editor = editor;

const annotationsUIs = editor.plugins.get('AnnotationsUIs');
const annotationsContainer = document.querySelector('.editor-container__sidebar');
const inlineButton = document.querySelector('#inline');
const narrowButton = document.querySelector('#narrow');
const wideButton = document.querySelector('#wide');
const wideAndInlineButton = document.querySelector('#wide-inline');

function markActiveButton(button) {
  for (const el of [inlineButton, narrowButton, wideButton, wideAndInlineButton]) {
    el.classList.toggle('active', el === button);
  }
}

function switchToInline() {
  markActiveButton(inlineButton);
  annotationsContainer.classList.remove('narrow');
  annotationsContainer.classList.add('hidden');
  annotationsUIs.switchTo('inline');
}

function switchToNarrowSidebar() {
  markActiveButton(narrowButton);
  annotationsContainer.classList.remove('hidden');
  annotationsContainer.classList.add('narrow');
  annotationsUIs.switchTo('narrowSidebar');
}

function switchToWideSidebar() {
  markActiveButton(wideButton);
  annotationsContainer.classList.remove('narrow', 'hidden');
  annotationsUIs.switchTo('wideSidebar');
}

function switchToWideSidebarAndInline() {
  markActiveButton(wideAndInlineButton);
  annotationsContainer.classList.remove('narrow', 'hidden');

  annotationsUIs.deactivateAll();
  annotationsUIs.activate('wideSidebar', (annotation) => annotation.type === 'comment');
  annotationsUIs.activate('inline', (annotation) => annotation.type !== 'comment');
}

editor.ui.view.listenTo(inlineButton, 'click', () => switchToInline());
editor.ui.view.listenTo(narrowButton, 'click', () => switchToNarrowSidebar());
editor.ui.view.listenTo(wideButton, 'click', () => switchToWideSidebar());
editor.ui.view.listenTo(wideAndInlineButton, 'click', () => switchToWideSidebarAndInline());

// Set wide sidebar as default.
switchToWideSidebar();

// Attribute suggestions/comments to a user.
const users = editor.plugins.get("Users");
users.addUser({ id: "u1", name: "Editor User", initials: "EU", color: "#4a8cff" });
users.defineMe("u1");

// Enable suggestions mode by default.
editor.execute("trackChanges");

editor.execute('trackChanges', { forceValue: false });

// Get and set the editor and wiris versions in this order.
Generic.setEditorAndWirisVersion("5.0.0", packageInfo.version);
editor.editing.view.focus();


document.getElementById("btn_update").addEventListener("click", (e) => {
  e.preventDefault();
  Generic.updateContent(globalThis.editor.getData(), "transform_content");
});
