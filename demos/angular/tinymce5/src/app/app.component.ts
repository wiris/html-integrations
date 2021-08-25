import { Component } from '@angular/core';

// Import common resources.
import * as Generic from 'resources/demos/angular-imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for TinyMCE';
document.getElementById('version_editor').innerHTML = 'TinyMCE editor: ';

// Create the initial editor content.
const editorContent = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>x</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>2</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

// Copy the editor content before initializing it.
document.getElementById('transform_content').innerHTML = editorContent;

// Add listener on click button to launch updateContent function.
document.getElementById('btn_update').addEventListener('click', (e) => {
  e.preventDefault();
  Generic.updateContent((window as any).tinyMCE.activeEditor.getContent(), 'transform_content');            //eslint-disable-line
});


@Component({
  selector: '#editor',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  //Set app title.
  title = 'Angular + TinyMCE 5 demo';

  // Initializate the editor content.
  public content: string = editorContent;

  // Set options for the editor.
  public options: Object = {
    base_url: '/tinymce', // Root for resources
    suffix: '.min',        // Suffix to use when loading resources

    // Add wiris plugin
    external_plugins: {
      'tiny_mce_wiris' : `${window.location.href}/node_modules/@wiris/mathtype-tinymce5/plugin.min.js`
    },
    htmlAllowedTags:  ['.*'],
    htmlAllowedAttrs: ['.*'],

    // We recommend to set 'draggable_modal' to true to avoid overlapping issues
    // with the different UI modal dialog windows implementations between core and third-party plugins on TinyMCE.
    // @see: https://github.com/wiris/html-integrations/issues/134#issuecomment-905448642
    draggable_modal: true,
    plugins: ['image', 'media'],
    toolbar: 'undo redo | styleselect | bold italic | image media | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry',

    // language: 'fr_FR',
    // You could set a different language for MathType editor:
    // mathTypeParameters: {
    //   editorParameters: { language: 'de' },
    // },

    // Handle events.
    setup(editor) {
      // Launch on init event.
      editor.on('init', () => {
        // Get and set the editor and wiris versions in this order.
        Generic.setEditorAndWirisVersion(`${(window as any).tinymce.majorVersion}.${(window as any).tinymce.minorVersion}`, (window as any).WirisPlugin.currentInstance.version);   //eslint-disable-line
      });
    },
  };
}
