MathML support for CKEditor 5
===

This package extends the CKEditor 5 model to allow working with the MathML standard.

## Install instructions

1. Install the npm module:

   ```
   npm install @wiris/ckeditor5-mathml
   ```

2. Update the CKEditor configuration by adding the plugin:

   ```js
   import MathML from '@wiris/ckeditor5-mathml/src/mathml';

   ...

   ClassicEditor
        .create( editorElement, {
            plugins: [ ..., MathML, ... ],
   ```
