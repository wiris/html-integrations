# TinyMCE V5 integration in Angular

A simple Angular App integrating WIRIS MathType on a TinyMCE V5 and step-by-step information on how to build it. The  code of this example loads a rich text editor instance with a default value.

## Requirements

* npm
* Angular (*Currently* v11.2.10)

## How to run the demo

```sh
$ npm install
$ npm start
```

*More information on the different ways to run a demo [here](../../README.md)*

Runs the app in the development mode.
Opens [http://localhost:4006/](http://localhost:4006/) to view it in the browser.

## How to add MathType to TinyMCE from scratch

1. Run the following through the terminal

> Notice that **$APP_NAME** needs to be replaced by the name that you choose.

    ```sh
    $ ng new $APP_NAME
    $ cd $APP_NAME
    $ npm install --save @tinymce/tinymce-angular
    $ npm install --save tinymce
    $ npm install --save @wiris/mathtype-tinymce5
    ```

2. Edit `src/app/app.module.ts`:

    ```js
    // Import the tinymce options
    import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
    
    // Expose tinymce instance to the window
    declare const require: any;
    (window as any).tinymce = require('tinymce');
    
    // import synchronous mathtype-tinymce5 package
    require('@wiris/mathtype-tinymce5')
    ```
    ...
    ```js
    @NgModule({
        ...
        imports: [... EditorModule ... ],
        providers: [ { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' } ],
        ...
    })
    ```

3. Edit `.angular.json`:
    
    ```js
    "assets": [
        ...
        { "glob": "**/*", "input": "node_modules/tinymce", "output": "/tinymce/" }
        ...
    ]

    ...

    "scripts": [
        ...
        "node_modules/tinymce/tinymce.min.js"
        ...
    ]
    ```

4. Edit `src/app/app.component.ts` and replace its contents with:

    ```ts
    import { Component } from '@angular/core';

    // Load WIRISplugins.js dynamically
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
        
        // Editor initial content with a mathml formula.
        public content: string = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';

        // Define the initial options of the editor
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
        };
    }

    ```

> Notice that the content can be empty or set as you prefer in the component.

5. Edit `src/app/app.component.html` and replace its contents with:

    ```html
    <h1>TinyMCE 5 Angular Demo</h1>
    <editor
    id="editor"
    [init]="options"
    [initialValue]="content"
    ></editor>
    ```

6. Finally, you are ready to run the development server through the specified command `ng serve`

7. The editor's initial value can be null or set value.

## How to run the tests

```sh
$ npm run test
```

Execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Learn More

Checkout the [FAQ](FAQs.md) file learn more about the most frequent asked questions.

You can learn more in the [Create Angular App documentation](https://angular.io/cli/new).

To learn more about Angular, check out the [Angular documentation](https://angular.io/).

For more information about the TinyMCE or it’s options, you can check their [documentation](https://www.tiny.cloud/docs/integrations/angular/).

To get more information about wiris MathType you can check on the [official documentation](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2022 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).
