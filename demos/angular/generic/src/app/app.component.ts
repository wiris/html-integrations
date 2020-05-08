import { Component, OnInit } from '@angular/core';

// Load WIRISplugins.js dinamically
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    // Set the initial editor content
    document.getElementById('htmlEditor').innerHTML = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';
  
    // Load the toolbar and the editable area into const variables to work easy with them
    const editableDiv = document.getElementById('htmlEditor');
    const toolbarDiv = document.getElementById('toolbar');

    // Initialyze the editor.
    wrsInitEditor(editableDiv, toolbarDiv);
  }

  title = 'generic';
 
}
