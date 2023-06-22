# Froala integration in Angular

A simple Angular App integrating WIRIS MathType on a Froala and step-by-step information on how to build it. The code of this example loads a rich text editor instance with a default value.

## Requirements

- npm
- Angular (_Currently_ v11.2.10)

## How to run the demo

```sh
$ npm install
$ npm start
```

> _More information on the different ways to run a demo [here](../../README.md)_

Runs the app in the development mode.

Open [http://localhost:4004/](http://localhost:4004/) to view it in the browser.

## How to add MathType to Froala

1. Install MathType for Froala dependency.

   ```sh
   $ npm install --save @wiris/mathtype-froala
   ```

2. Open the `src/app/app.module.ts` file and add:

   ```ts
   // Expose FroalaEditor instance to window.
   declare const require: any;
   (window as any).FroalaEditor = require("froala-editor");
   require("@wiris/mathtype-froala"); // Import WIRIS MathType formula editor.
   ```

3. Open `src/app/app.component.ts` and add the following content:

   ```ts
   // Load WIRISplugins.js dynamically
   const jsDemoImagesTransform = document.createElement("script");
   jsDemoImagesTransform.type = "text/javascript";
   jsDemoImagesTransform.src =
     "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
   // Load generated scripts.
   document.head.appendChild(jsDemoImagesTransform);

   ...

   export class AppComponent {
     // Set options for the editor.
     public options: Object = {
      toolbarButtons: [
        'wirisEditor',
        'wirisChemistry'
      ],
      // Add [MW] uttons to the image editing popup Toolbar.
      imageEditButtons: [
        'wirisEditor',
        'wirisChemistry',
        'imageDisplay',
        'imageAlign',
        'imageInfo',
        'imageRemove'
      ],
      // Allow all the tags to understand the mathml
      htmlAllowedTags:  ['.*'],
      htmlAllowedAttrs: ['.*'],
      // List of tags that are not removed when they have no content inside
      // so that formulas renderize propertly
      htmlAllowedEmptyTags: ['mprescripts', 'none'],
      // You can choose the language for the MathType editor:
      // @see: https://docs.wiris.com/en/mathtype/mathtype_web/sdk-api/parameters#regional_properties
      // mathTypeParameters: {
      //   editorParameters: { language: 'es' },
      // },
     };
   }
   ```

4. Open `src/app/app.component.html` and replace all with:

   ```html
   <h1>Angular and Froala demo</h1>
   <!-- Pass options and content to the component. -->
   <div id="editor" [froalaEditor]="options"></div>
   ```

5. Finally, you are ready to run the development server through the specified command `ng serve`

## How to run the tests

```sh
$ npm run test
```

Execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Learn More

Checkout the [FAQ](FAQs.md) file learn more about the most frequent asked questions.

You can learn more in the [Create Angular App documentation](https://angular.io/cli/new).

To learn more about Angular, check out the [Angular documentation](https://angular.io/).

For more information about the Froala or it’s options, you can check their [documentation](https://froala.com/wysiwyg-editor/docs/framework-plugins/angularjs-2-4/).

To get more information about wiris MathType you can check on the [official documentation](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2022 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).
