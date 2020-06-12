# Generic integration in Angular

A simple Angular App integrating WIRIS MathType on a Generic editor and step-by-step information on how to build it. The code of this example loads a rich text editor instance with a default value.

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
    $ npm install @wiris/mathtype-generic
    $ npm install @wiris/mathtype-html-integration-devkit
    ```

2. Add the following import on *src/app/app.module.ts*:

    ```ts
    ...
    // Import wiris generic plugin
    import '@wiris/mathtype-generic/wirisplugin-generic';
    ```

3. Open *src/app/app.component.ts* and replace all with:
    
    ```ts
    import { Component, OnInit } from '@angular/core';
 
    // Load WIRISplugins.js dynamically
    const jsDemoImagesTransform = document.createElement('script');
    jsDemoImagesTransform.type = 'text/javascript';
    jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    // Load generated scripts.
    document.head.appendChild(jsDemoImagesTransform);
    
    // Import wiris plugin
    import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
    
    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
    
    export class AppComponent implements OnInit {
    
        ngOnInit() {
            // Set the initial editor content
            document.getElementById('htmlEditor').innerHTML = '<p class="text"> Double click on the following formula to edit it.</p><p style="text-align:center;"><math><mi>z</mi><mo>=</mo><mfrac><mrow><mo>-</mo><mi>b</mi><mo>&PlusMinus;</mo><msqrt><msup><mi>b</mi><mn>3</mn></msup><mo>-</mo><mn>4</mn><mi>a</mi><mi>c</mi></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></math></p>';
            
            // Load the toolbar and the editable area into const variables to work easy with them
            const editableDiv = document.getElementById('htmlEditor');
            const toolbarDiv = document.getElementById('toolbar');
            
            // Initialize the editor.
            wrsInitEditor(editableDiv, toolbarDiv);
        }
        
        title = 'Demo for Angular and Generic';
    }
    ```
    *Notice that the content can be empty or set as you prefer in the component*

4. Open *src/app/app.component.html* and replace all with:

    ```html
    <div id="toolbar"></div>
    <div id="htmlEditor" contenteditable="true">Try me!</div>
    ```

5. Finally, you are ready to run the development server through the command: ```ng serve```

## How to run the tests

```sh
$ npm run test
```

Execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Learn More

Checkout the [FAQ](FAQs.md) file learn more about the most frequent asked questions.

You can learn more in the [Create Angular App documentation](https://angular.io/cli/new).

To learn more about Angular, check out the [Angular documentation](https://angular.io/).

To get more information about wiris MathType you can check on the [official documentation](http://www.wiris.com/mathtype)

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).