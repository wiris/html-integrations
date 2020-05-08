import { Component } from '@angular/core';

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
  title = 'tinymce5';

  public content: string = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

  public options: Object = {
    height: 500,
    menubar: false,
    base_url: '/tinymce', // Root for resources
    suffix: '.min',        // Suffix to use when loading resources

    // Add wiris plugin
    external_plugins: {
      'tiny_mce_wiris' : 'http://localhost:4200/node_modules/@wiris/mathtype-tinymce5/plugin.min.js'
    },
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount '
    ],
    toolbar: [
      ' bold italic | \
       tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry '
    ],
    htmlAllowedTags:  ['.*'],
    htmlAllowedAttrs: ['.*'],
  };
}
