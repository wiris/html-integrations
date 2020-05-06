import { Component } from '@angular/core';

// 3. Import WIRIS Mathtype
// Load WIRISplugins.js dinamically
const jsDemoImagesTransform = document.createElement('script');
jsDemoImagesTransform.type = 'text/javascript';
jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
// Load generated scripts.
document.head.appendChild(jsDemoImagesTransform);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  // Set App Title.
  title = 'Angular froala3 demo';

  // Initializate the editors content.
  public content: string = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

  // Set options for the editor.
  public options: Object = {
    // The editor's content will be placed in an iframe and isolated from the rest of the page.
    iframe: true,
    language: 'it',
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
  };
}
