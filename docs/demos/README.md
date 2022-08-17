# Trying out the demos

<small>[MathType Web Integrations](../../README.md) → [Documentation](../README.md) → Trying out the demos</small>

We create and curate a collection of working code examples in order to test, validate, and showcase how to integrate MathType Web on different HTML editors and technologies: from vanilla HTML to modern JavaScript frameworks.

## Table of contents

- [Editors and frameworks](#editors-and-frameworks)
- [Running a demo](#running-a-demo)
- [Running a demo using the local source code](#running-a-demo-using-the-local-source-code)

## Editors and frameworks

**Frameworks:**

- HTML5
- React
- Angular

**Editors**

- CKEditor
- Froala
- TinyMCE
- as well as a generic integration that shows how to integrate MathType on an editable `<div>` element.

## Running a demo

To run a demo, from the project root, run:

```js
$ nx start-remote <FRAMEWORK>-<EDITOR>
```
This is the full list of available examples of MathType Integrations on this project:

| FRAMEWORK | Editor and Version  | EDITOR                                                               |
|-----------|---------------------|--------------------------------------------------------------------|
| html      | CKEditor V4         | [ckeditor4](../../demos/html5/ckeditor4)               |
| html      | CKEditor V5         | [ckeditor5](../../demos/html5/ckeditor5)               |
| html      | Froala V4           | [froala](../../demos/html5/froala)                     |
| html      | Generic integration | [generic](../../demos/html5/generic)                   |
| html      | TinyMCE V5          | [tinymce5](../../demos/html5/tinymce5)                 |
| html      | TinyMCE V6          | [tinymce6](../../demos/html5/tinymce6)                 |
| angular   | CKEditor V5         | [ckeditor5](../../demos/angular/ckeditor5/README.md)   |
| angular   | Froala V4           | [froala](../../demos/angular/froala/README.md)         |
| angular   | Generic integration | [generic](../../demos/angular/generic/README.md)       |
| angular   | TinyMCE V5          | [tinymce5](../../demos/angular/tinymce5/README.md)     |
| react     | CKEditor V5         | [ckeditor5](../../demos/react/ckeditor5/README.md)     |
| react     | Froala V4           | [froala](../../demos/react/froala/README.md)           |
| react     | Generic integration | [generic](../../demos/react/generic/README.md)         |
| react     | TinyMCE V5          | [tinymce5](../../demos/react/tinymce5/README.md)       |


## Running a demo using the local source code

By default, these demos download the latest version of the MathType plugins from npm.
If you are modifying the source code of the plugins in this repo, and want to try that out instead, follow the instructions in the [Development](../development/demos/README.md) section.
