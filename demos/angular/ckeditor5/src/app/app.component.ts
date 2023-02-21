import { Component, OnInit, ViewChild } from '@angular/core';

import * as ClassicEditor from '../ckeditor';

// Import common resources.
import * as Generic from 'resources/demos/imports';

// Load wiris plugin version.
import packageInfo from '@wiris/mathtype-ckeditor5/package.json';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for CKEditor';
document.getElementById('version_editor').innerHTML = 'CKEditor editor: ';

// Create the initial editor content.
const editorContent = `<div>MathType - Keyboard: <math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mi>x</mi></msqrt></math></div>
<div>MathType - Handwriting: <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mfrac><mi>x</mi><mn>3</mn></mfrac><annotation encoding="application/json">{"x":[[8,64,120],[50,74],[49,75],[50,79,80,50,51,63,74,79,78,66,54,48]],"y":[[89,89,89],[7,72],[72,7],[105,105,105,147,147,146,152,168,204,213,211,197]],"t":[[0,0,0],[0,0],[0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],"version":"2.0.0"}</annotation></semantics></math></div>
<div>ChemType - Keyboard: <math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><msup><mi mathvariant="normal">x</mi><mn>2</mn></msup></math></div>
<div>ChemType - Handwriting: <math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><semantics><msub><mi>x</mi><mn>4</mn></msub><annotation encoding="application/json">{"x":[[5,29],[4,30],[52,52,52,41,41,56]],"y":[[7,72],[72,7],[100,48,48,84,84,84]],"t":[[0,0],[0,0],[0,0,0,0,0,0]],"version":"2.0.0"}</annotation></semantics></math></div>
`;

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = editorContent;


@Component({
  selector: '#editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  Editor = ClassicEditor;

  // Use the viewChild Decorator to get the ckeditor instance
  @ViewChild("myEditor", { static: false }) myEditor: any;

  ngOnInit() {
    // Define the button update
    document.getElementById('btn_update').addEventListener('click', (e) => {
      e.preventDefault();
      Generic.updateContent(this.myEditor.editorInstance.getData(), 'transform_content');
    });
  }

  // Initializate the editors content.
  public content: string = editorContent;

  public options: Object = {
    toolbar: [ 'heading', '|', 'bold', 'italic', 'MathType', 'ChemType' ],
    htmlAllowedTags:  ['.*'],
    htmlAllowedAttrs: ['.*'],
  }

  title = 'ckeditor5';
}

// Get and set the editor and wiris versions in this order.
Generic.setEditorAndWirisVersion('5.0.0', packageInfo.version);
