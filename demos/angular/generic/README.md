# Generic integration in Angular

A simple Angular App integrating WIRIS MathType on a Generic editor and step-by-step information on how to build it. The code of this example loads a rich text editor instance with a default value.

## Requirements

* npm
* Angular (*Currently* v11.2.10)

## How to run the demo

```sh
$ npm install
$ npm start
```

> *More information on the different ways to run a demo [here](../../README.md)*.

Runs the app in the development mode.

Open [http://localhost:4200/](http://localhost:4200/) to view it in the browser.


## How to add MathType to TinyMCE

1. Install MathType dependency.

    ```sh
    $ npm install @wiris/mathtype-generic --save
    ```

2. Add the following import on `src/app/app.module.ts`:

    ```ts
    import '@wiris/mathtype-generic/wirisplugin-generic';
    ```

3. Open `src/app/app.component.ts` and add the following content:
    
    ```ts
    // Load WIRISplugins.js dynamically
    const jsDemoImagesTransform = document.createElement('script');
    jsDemoImagesTransform.type = 'text/javascript';
    jsDemoImagesTransform.src = 'https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image';
    // Load generated scripts.
    document.head.appendChild(jsDemoImagesTransform);
    
    // Import wiris plugin
    import { wrsInitEditor } from '@wiris/mathtype-generic/wirisplugin-generic.src';
    
    ...

    export class AppComponent implements OnInit {
    
        ngOnInit() {
            // Load the toolbar and the editable area into const variables.
            const editableDiv = document.getElementById('htmlEditor');
            const toolbarDiv = document.getElementById('toolbar');
            
            // Initialize the editor.
            wrsInitEditor(editableDiv, toolbarDiv);
        }
    }
    ```

4. Open `src/app/app.component.html` and add:

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

Copyright © 2010-2022 [WIRIS](http://www.wiris.com). Released under the [MIT License](../../../LICENSE).