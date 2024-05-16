import { Component, OnInit } from "@angular/core";

import * as Generic from "resources/demos/common";

// Generate scripts.
const jsDemoImagesTransform = document.createElement("script");
jsDemoImagesTransform.type = "text/javascript";
jsDemoImagesTransform.src =
  "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";

// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

// Create the initial editor content.
const editorContent = Generic.editorContentImg;

// Copy the editor content before initializing it.
// Currently disabled by decision of QA.
// document.getElementById('transform_content').innerHTML = editorContent;

import { wrsInitEditor } from "@wiris/mathtype-generic/wirisplugin-generic.src";

@Component({
  selector: "#editor",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // Set the initial editor content
    document.getElementById("htmlEditor").innerHTML = editorContent;

    // Load the toolbar and the editable area into const variables to work easy with them
    const editableDiv = document.getElementById("htmlEditor");
    const toolbarDiv = document.getElementById("toolbar");
    const mathTypeParameters = {
      editorParameters: { language: "en" }, // MathType config, including language
    };

    // Initialyze the editor.
    (window as any).wrs_int_init(editableDiv, toolbarDiv, mathTypeParameters);

    // Add listener on click button to launch updateContent function.
    document.getElementById("btn_update").addEventListener("click", (e) => {
      e.preventDefault();
      Generic.updateContent(
        (window as any).WirisPlugin.Parser.initParse(editableDiv.innerHTML),
        "transform_content",
      ); //eslint-disable-line
    });

    // Get an det the wiris editor plugin version
    Generic.setEditorAndWirisVersion(
      0,
      (window as any).WirisPlugin.currentInstance.version,
    );
  }

  // Set app title.
  title = "generic";
}
