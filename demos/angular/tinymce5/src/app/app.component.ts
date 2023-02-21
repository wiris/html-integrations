import { Component } from '@angular/core';

// Import common resources.
import * as Generic from 'resources/demos/imports';

// Apply specific demo names to all the objects.
document.getElementById('header_title_name').innerHTML = 'Mathtype for TinyMCE';
document.getElementById('version_editor').innerHTML = 'TinyMCE editor: ';

// Create the initial editor content.
const editorContent = `<div>MathType - Keyboard: <math xmlns="http://www.w3.org/1998/Math/MathML"><msqrt><mi>x</mi></msqrt></math></div>
<div>MathType - Handwriting: <math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mfrac><mi>x</mi><mn>3</mn></mfrac><annotation encoding="application/json">{"x":[[8,64,120],[50,74],[49,75],[50,79,80,50,51,63,74,79,78,66,54,48]],"y":[[89,89,89],[7,72],[72,7],[105,105,105,147,147,146,152,168,204,213,211,197]],"t":[[0,0,0],[0,0],[0,0],[0,0,0,0,0,0,0,0,0,0,0,0]],"version":"2.0.0"}</annotation></semantics></math></div>
<div>ChemType - Keyboard: <math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><msup><mi mathvariant="normal">x</mi><mn>2</mn></msup></math></div>
<div>ChemType - Handwriting: <math xmlns="http://www.w3.org/1998/Math/MathML" class="wrs_chemistry"><semantics><msub><mi>x</mi><mn>4</mn></msub><annotation encoding="application/json">{"x":[[5,29],[4,30],[52,52,52,41,41,56]],"y":[[7,72],[72,7],[100,48,48,84,84,84]],"t":[[0,0],[0,0],[0,0,0,0,0,0]],"version":"2.0.0"}</annotation></semantics></math></div>
`;

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
    base_url: `${window.location.href}tinymce`, // Root for resources
    suffix: '.min',        // Suffix to use when loading resources

    // Add wiris plugin
    external_plugins: {
      'tiny_mce_wiris' : `${window.location.href}node_modules/@wiris/mathtype-tinymce5/plugin.min.js`
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
