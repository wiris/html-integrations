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

To run a demo, move to the folder containing the demo you want to try out, and then run `npm install` and `npm start`:

```sh
$ cd demos/{technology}/{folder}
$ npm install
$ npm start
```
This is the full list of available examples of MathType Integrations on this project:

| Framework | Editor and Version  | Editor folder                                                               |
|-----------|---------------------|--------------------------------------------------------------------|
| HTML5     | CKEditor V4         | [ckeditor4](../../demos/html5/ckeditor4)               |
| HTML5     | CKEditor V5         | [ckeditor5](../../demos/html5/ckeditor5)               |
| HTML5     | Froala V2           | [froala2](../../demos/html5/froala2)                   |
| HTML5     | Froala V3 & V4      | [froala](../../demos/html5/froala)                     |
| HTML5     | Generic integration | [generic](../../demos/html5/generic)                   |
| HTML5     | TinyMCE V4          | [tinymce4](../../demos/html5/tinymce4)                 |
| HTML5     | TinyMCE V5          | [tinymce5](../../demos/html5/tinymce5)                 |
| HTML5     | TinyMCE V6          | [tinymce6](../../demos/html5/tinymce6)                 |
| Angular   | CKEditor V5         | [ckeditor5](../../demos/angular/ckeditor5/README.md) |
| Angular   | Froala V3 & V4      | [froala](../../demos/angular/froala/README.md)       |
| Angular   | Generic integration | [generic](../../demos/angular/generic/README.md)     |
| Angular   | TinyMCE V5          | [tinymce5](../../demos/angular/tinymce5/README.md)   |
| React     | CKEditor V5         | [ckeditor5](../../demos/react/ckeditor5/README.md)     |
| React     | Froala V3 & V4      | [froala](../../demos/react/froala/README.md)           |
| React     | Generic integration | [generic](../../demos/react/generic/README.md)         |
| React     | TinyMCE V5          | [tinymce5](../../demos/react/tinymce5/README.md)       |


> **Note**: React demos require using `yarn` instead of `npm install` due to the way their dependencies are resolved.

## Running a demo using the local source code

By default, these demos download the latest version of the MathType plugins from npm.
If you are modifying the source code of the plugins in this repo, and want to try that out instead, follow the instructions in the [Development](../development/demos/README.md) section.
