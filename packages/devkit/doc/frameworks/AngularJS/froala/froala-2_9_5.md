
# MathType for FroalaEditor in AngularJS

This guide explains how to use MathType as a plugin in Froala Editor using AngularJS.

## Create AngularJS project

* If you don't have a project, create it with the next command. For this tutorial it is used Angular CLI 6.2.4 .

~~~
ng new my-app
cd my-app
~~~

## Add NPM packages

1. Install angular-froala-wysiwyg and @wiris/mathtype-froala.

~~~
npm install angular-froala-wysiwyg@2.9.5 --save
npm install @wiris/mathtype-froala --save
~~~

2. Open src/app/app.module.ts and add the next.

~~~
// Import Angular plugin.
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
...

@NgModule({
   ...
   imports: [FroalaEditorModule.forRoot(), FroalaViewModule.forRoot() ... ],
   ...
})
~~~

3. Open _angular.json_ file and insert the next lines inside _styles_ and _scripts_ properties.

~~~
"build" {
  ...

  "styles": [

              ...

              "./node_modules/froala-editor/css/froala_editor.pkgd.min.css",
              "./node_modules/froala-editor/css/froala_style.min.css",
              "./node_modules/font-awesome/css/font-awesome.css"

              ...

  ],

  ...

  "scripts": [

              ...

              "./node_modules/jquery/dist/jquery.min.js",
              "./node_modules/froala-editor/js/froala_editor.pkgd.min.js",
              "./node_modules/@wiris/mathtype-froala/wiris.js"

              ...

  ],
  ...
}
~~~

4. Append inside the class in _app.component.ts_ the options of Froala

~~~

public options: Object = {
  toolbarButtons: ['undo', 'redo' , 'bold', 'wirisEditor', 'wirisChemistry']
}

~~~

5. Insert in _app.component.html_ a froala instance with `<div [froalaEditor]="options">Hello, Froala!</div>`