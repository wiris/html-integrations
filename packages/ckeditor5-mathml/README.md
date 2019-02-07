CKEditor 5 MathML feature
========================================

This package implements the MathML feature for CKEditor 5.

## Installation instructions

1. Install the npm module:

   ```
   npm install @wiris/ckeditor5-mathml
   ```

2. Import the plugin:

   ```js
   import MathML from '@wiris/ckeditor5-mathml/src/mathml';
   ```

3. Update the CKEditor configuration by adding the plugin:

   ```js
   ClassicEditor
        .create( editorElement, {
            plugins: [ ..., MathML, ... ],
   ```