import { Component } from '@angular/core';

import * as ClassicEditor from '../ckeditor';

// Import common resources.
import * as Generic from 'resources/demos/angular-imports';

// Load wiris plugin version.
import { version as pluginVersion } from '@wiris/mathtype-ckeditor5/package.json';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for CKeditor';
document.getElementById('version_editor').innerHTML = 'CKeditor editor: ';

// Create the initial editor content.
const editorContent = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = editorContent;

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', () => {
  Generic.updateContent(ClassicEditor.getData(), 'transform_content');
});

@Component({
  selector: '#editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public Editor = ClassicEditor;

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
Generic.setEditorAndWirisVersion('5.0.0', pluginVersion);