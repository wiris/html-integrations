# Trying out the demos in development mode

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Trying out the demos in development mode</small>

By default, these demos download the latest version of the MathType plugins from npm.
This document explains what to do if you are modifying the source code of the plugins in this repo, and want to try that out instead.

To work with Nx and Yarn, and try out the packages with the local changes instead of the published packages, you will execute the commands from the project root.

Assuming that you already executed the `yarn` command, you'll have to build the desired package and start the demo:

```js
$ nx build <PACKAGE>
$ nx start <FRAMEWORK>-<EDITOR>
```

| FRAMEWORK | Editor and Version  | EDITOR/PACKAGE                                                               |
|-----------|---------------------|--------------------------------------------------------------------|
| html5     | CKEditor V4         | [ckeditor4](../../demos/html5/ckeditor4)               |
| html5     | CKEditor V5         | [ckeditor5](../../demos/html5/ckeditor5)               |
| html5     | Froala              | [froala](../../demos/html5/froala)                     |
| html5     | Generic integration | [generic](../../demos/html5/generic)                   |
| html5     | TinyMCE V5          | [tinymce5](../../demos/html5/tinymce5)                 |
| html5     | TinyMCE V6          | [tinymce6](../../demos/html5/tinymce6)                 |
| angular   | CKEditor V5         | [ckeditor5](../../demos/angular/ckeditor5/README.md)   |
| angular   | Froala              | [froala](../../demos/angular/froala/README.md)         |
| angular   | Generic integration | [generic](../../demos/angular/generic/README.md)       |
| angular   | TinyMCE V5          | [tinymce5](../../demos/angular/tinymce5/README.md)     |
| react     | CKEditor V5         | [ckeditor5](../../demos/react/ckeditor5/README.md)     |
| react     | Froala              | [froala](../../demos/react/froala/README.md)           |
| react     | Generic integration | [generic](../../demos/react/generic/README.md)         |
| react     | TinyMCE V5          | [tinymce5](../../demos/react/tinymce5/README.md)       |


For each time you apply a change to the desired package and want to see those changes in your demo, you'll have to re-run the previous two commands.
