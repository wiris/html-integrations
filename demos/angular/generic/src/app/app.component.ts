import { Component, OnInit } from '@angular/core';

// Import common resources.
import * as Generic from 'resources/demos/angular-imports';

// Create the initial editor content.
const editorContent = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = editorContent;

import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';

@Component({
  selector: '#editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  ngOnInit() {
    // Set the initial editor content
    document.getElementById('htmlEditor').innerHTML = editorContent;
  
    // Load the toolbar and the editable area into const variables to work easy with them
    const editableDiv = document.getElementById('htmlEditor');
    const toolbarDiv = document.getElementById('toolbar');

    // Initialyze the editor.
    wrsInitEditor(editableDiv, toolbarDiv);

    // Add listener on click button to launch updateContent function.
    document.getElementById('btn_update').addEventListener('click', (e) => {
      e.preventDefault();
      Generic.updateContent((window as any).WirisPlugin.Parser.initParse(editableDiv.innerHTML), 'transform_content');      //eslint-disable-line
    });

    // Get an det the wiris editor plugin version
    document.getElementById('version_wiris').innerHTML += (window as any).WirisPlugin.currentInstance.version;
  }

  // Set app title.
  title = 'generic';
 
}
