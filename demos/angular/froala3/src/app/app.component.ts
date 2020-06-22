import { Component } from '@angular/core';

// Import common resources.
import * as Generic from 'resources/demos/angular-imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for Froala';
document.getElementById('version_editor').innerHTML = 'Froala editor: ';

// Create the initial editor content.
const editorContent = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = editorContent;

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent((window as any).FroalaEditor.INSTANCES[0].html.get(), 'transform_content');                     //eslint-disable-line
});

@Component({
  selector: '#editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  // Set App Title.
  title = 'Angular froala3 demo';

  // Initializate the editor content.
  public content: string = editorContent;

  // Set options for the editor.
  public options: Object = {
    // The editor's content will be placed in an iframe and isolated from the rest of the page.
    iframe: true,
    // language: 'en',
    charCounterCount: false,
		toolbarInline: false,
		toolbarButtons: ['bold', 'italic', 'undo', 'redo', 'wirisEditor', 'wirisChemistry'],
		htmlAllowedTags:  ['.*'],
    htmlAllowedAttrs: ['.*'],

    // The edited content will have the external CSS properties converted to inline style.
    useClasses: false,

    // List of tags that are not removed when they have no content inside.
    htmlAllowedEmptyTags: ['mprescripts'],

    // Disables image resize
    imageResize : false,

    events: {
      initialized() {
        // Get and set the editor and wiris versions in this order.
        Generic.setEditorAndWirisVersion((window as any).FroalaEditor.VERSION, (window as any).WirisPlugin.currentInstance.version);        //eslint-disable-line
      },
    },
  };
}
