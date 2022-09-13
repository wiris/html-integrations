# Trying out the demos in development mode

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Trying out the demos in development mode</small>

By default, these demos download the latest version of the MathType plugins from npm.
This document explains what to do if you are modifying the source code of the plugins in this repo, and want to try that out instead.

All the commands can be executed either from the root of the project, or from the demo path. We recommend running them on the project root to avoid complexity.

Assuming that you already executed the `yarn` command, you'll have to build the desired package and start the demo:

```js
$ nx build <PACKAGE>
$ nx start <FRAMEWORK>-<EDITOR>
```

| FRAMEWORK | Editor and Version  | EDITOR/PACKAGE                                                               |
|-----------|---------------------|--------------------------------------------------------------------|
| html      | CKEditor V4         | [ckeditor4](../../demos/html5/ckeditor4)               |
| html      | CKEditor V5         | [ckeditor5](../../demos/html5/ckeditor5)               |
| html      | Froala              | [froala](../../demos/html5/froala)                     |
| html      | Generic integration | [generic](../../demos/html5/generic)                   |
| html      | TinyMCE V5          | [tinymce5](../../demos/html5/tinymce5)                 |
| html      | TinyMCE V6          | [tinymce6](../../demos/html5/tinymce6)                 |
| angular   | CKEditor V5         | [ckeditor5](../../demos/angular/ckeditor5/README.md)   |
| angular   | Froala              | [froala](../../demos/angular/froala/README.md)         |
| angular   | Generic integration | [generic](../../demos/angular/generic/README.md)       |
| angular   | TinyMCE V5          | [tinymce5](../../demos/angular/tinymce5/README.md)     |
| react     | CKEditor V5         | [ckeditor5](../../demos/react/ckeditor5/README.md)     |
| react     | Froala              | [froala](../../demos/react/froala/README.md)           |
| react     | Generic integration | [generic](../../demos/react/generic/README.md)         |
| react     | TinyMCE V5          | [tinymce5](../../demos/react/tinymce5/README.md)       |


Each time you apply a change to a package and want to see the changes in your demo, you'll have to re-run the previous two commands.
