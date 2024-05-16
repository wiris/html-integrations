import { Component, OnInit, ViewChild } from "@angular/core";

import * as ClassicEditor from "../ckeditor";

// Import common resources.
import * as Generic from "resources/demos/imports";

// Load wiris plugin version.
import packageInfo from "@wiris/mathtype-ckeditor5/package.json";

// Apply specific demo names to all the objects.
document.getElementById("header_title_name").innerHTML = "MathType for CKEditor 5 on Angular";
document.getElementById("version_editor").innerHTML = "CKEditor: ";

// Create the initial editor content.
const editorContent = Generic.editorContentMathML;

// Copy the editor content before initializing it.
// Currently disabled by decision of QA.
// document.getElementById('transform_content').innerHTML = editorContent;

@Component({
  selector: "#editor",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  Editor = ClassicEditor;

  // Use the viewChild Decorator to get the ckeditor instance
  @ViewChild("myEditor", { static: false }) myEditor: any;

  ngOnInit() {
    // Define the button update
    document.getElementById("btn_update").addEventListener("click", (e) => {
      e.preventDefault();
      Generic.updateContent(this.myEditor.editorInstance.getData(), "transform_content");
    });
  }

  // Initializate the editors content.
  public content: string = editorContent;

  public options: Object = {
    toolbar: ["heading", "|", "bold", "italic", "MathType", "ChemType"],
    htmlAllowedTags: [".*"],
    htmlAllowedAttrs: [".*"],
  };

  title = "Demo CKEditor 5 on Angular";
}

// Get and set the editor and wiris versions in this order.
Generic.setEditorAndWirisVersion("5.0.0", packageInfo.version);
