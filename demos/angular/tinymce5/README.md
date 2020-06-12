# TinyMCE integration in Angular

A simple Angular App integrating WIRIS MathType on a TinyMCE 5 and step-by-step information on how to build it. The  code of this example loads a rich text editor instance with a default value.

## Requirements

* **npm** (*Currently* v6.13.4)
* **@angular/cli** (*Currently* v9.1.4)

## How to run the demo

```sh
$ npm install
$ npm run deploy
```

*More information on the different ways to run a demo [here](../../README.md)*

Runs the app in the development mode.<br />
Open [http://localhost:4200/](http://localhost:4200/) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## How to add MathType to TinyMCE from scratch

1. Run the following through the terminal

    Notice that **$APP_NAME** needs to be replaced by the name that you choose.

    ```sh
    $ ng new $APP_NAME
    $ cd $APP_NAME
    $ npm install --save @tinymce/tinymce-angular
    $ npm install --save tinymce
    $ npm install @wiris/mathtype-tinymce5
    ```

2. Open the *src/app/app.module.ts* file and add:

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

3. Open *.angular.json* file and add:
    
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

4. Open *src/app/app.component.ts* and replace all with:

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
            height: 500,
            menubar: false,
            base_url: '/tinymce', // Root for resources
            suffix: '.min',        // Suffix to use when loading resources
            
            // Add wiris plugin
            external_plugins: {
                'tiny_mce_wiris' : `${window.location.href}/node_modules/@wiris/mathtype-tinymce5/plugin.min.js`
            },
            plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount '
            ],
            toolbar: [
                ' bold italic |' +
                'tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry '
            ],
            htmlAllowedTags:  ['.*'],
            htmlAllowedAttrs: ['.*'],
        };
    }

    ```

    *Notice that the content can be empty or set as you prefer in the component*

5. Open *src/app/app.component.html* and replace all with:

    ```html
    <h1>TinyMCE 5 Angular Demo</h1>
    <editor
    id="editor"
    [init]="options"
    [initialValue]="content"
    ></editor>
    ```

6. Finally, you are ready to run the development server through the specified [command](#How-to-run-the-demo)

5. The **content** can be empty or anything you want to set as the initial editor content.

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

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).
