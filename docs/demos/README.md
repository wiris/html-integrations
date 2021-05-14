# Trying out the demos

<small>[⇱ Back to root](../README.md)</small>

We create and curate working code examples in order to test, validate, and showcase how to integrate MathType on different editors and technologies, from vanilla HTML to modern JavaScript frameworks.

## Table of contents

- [Editors and frameworks](#editors-and-frameworks)
- [Running a demo](#running-a-demo)
- [Running a demo using the local source code](#running-a-demo-using-the-local-source-code)

## Editors and frameworks

There are demos for integrations on React, Angular, and plain HTML5.
The demos exist for different versions of CKEditor, Froala, and TinyMCE, as well as a generic integration that shows how to integrate MathType on an editable `<div>` element.

- HTML5
    - [CKEditor 4](../../demos/html5/ckeditor4)
    - [CKEditor 5](../../demos/html5/ckeditor5)
    - [Froala 2](../../demos/html5/froala2)
    - [Froala 3](../../demos/html5/froala3)
    - [TinyMCE 4](../../demos/html5/tinymce4)
    - [TinyMCE 5](../../demos/html5/tinymce5)
    - [Generic](../../demos/html5/generic)
- Angular
    - [CKEditor 5](../../demos/angular/ckeditor5/README.md)
    - [Froala 3](../../demos/angular/froala3/README.md)
    - [TinyMCE 5](../../demos/angular/tinymce5/README.md)
    - [Generic](../../demos/angular/generic/README.md)
- React
    - [CKEditor 5](../../demos/react/ckeditor5/README.md)
    - [Froala 3](../../demos/react/froala3/README.md)
    - [TinyMCE 5](../../demos/react/tinymce5/README.md)
    - [Generic](../../demos/react/generic/README.md)

## Running a demo

To run a demo, move to the folder containing the demo you want to try out, and then run `npm install` and `npm start`:

```sh
$ cd demos/[technology]/[editor]
$ npm install
$ npm start
```

> **Note**: React demos require using `yarn` instead of `npm install` due to the way their dependencies are resolved.

## Running a demo using the local source code

By default, these demos download the latest version of the MathType plugins from npm.
If you are modifying the source code of the plugins in this repo, and want to try that out instead, follow the instructions in the [Development](../development/demos/README.md) section.
