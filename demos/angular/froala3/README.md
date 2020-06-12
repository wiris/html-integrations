# Froala integration in Angular

A simple Angular App integrating WIRIS MathType on a Froala 3 and step-by-step information on how to build it. The  code of this example loads a rich text editor instance with a default value.

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
    $ npm install --save angular-froala-wysiwyg
    $ npm install --save froala-editor
    $ npm install --save @wiris/mathtype-froala3
    ```

2. Open the *src/app/app.module.ts* file and add:

    ```ts
    // From Froala instructions.
    // Import all Froala Editor plugins.
    import 'froala-editor/js/plugins.pkgd.min.js';
    
    // Expose FroalaEditor instance to window.
    declare const require: any;
    (window as any).FroalaEditor = require('froala-editor');
    require('@wiris/mathtype-froala3'); // Import WIRIS Mathtype formula editor.
    
    // Import Angular plugin.
    import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
    ```
    ...
    ```ts
    @NgModule({
        ...
        imports: [... FroalaEditorModule.forRoot(), FroalaViewModule.forRoot() ... ],
        ...
    })
    ```

3. Open *.angular.json* file and add:
    
    ```json
    "styles": [
        "styles.css",
        "../node_modules/froala-editor/css/froala_editor.pkgd.min.css",
        "../node_modules/froala-editor/css/froala_style.min.css"
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
        
        // Set App Title.
        title = 'Angular froala3 demo';
        
        // Initialize the editor content.
        public content: string = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';
        
        // Set options for the editor.
        public options: Object = {
            // The editor's content will be placed in an iframe and isolated from the rest of the page.
            iframe: true,
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
    ```

    *Notice that the content can be empty or set as you prefer in the component*

5. Open *src/app/app.component.html* and replace all with:

    ```html
    <h1>Angular and Froala 3 demo</h1>
    <!-- Pass options and content to the component. -->
    <div id="editor" [froalaEditor]="options" [(froalaModel)]="content"></div>
    ```

6. Finally, you are ready to run the development server through the specified command ```ng serve```

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

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).
