# Trying out the demos

<small>[MathType Web Integrations](../../README.md) → [Documentation](../README.md) → Trying out the demos</small>

We create and curate a collection of working code examples in order to test, validate, and showcase how to integrate MathType Web on different HTML editors and technologies: from vanilla HTML to modern JavaScript frameworks.

## Table of contents

- [Editors and frameworks](#editors-and-frameworks)
- [Running a demo](#running-a-demo)
- [Running a demo using the local source code](#running-a-demo-using-the-local-source-code)

## Editors and frameworks

**Frameworks:**

- HTML
- React
- Angular
- Vue

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

## Staging environment

To facilitate trying changes and the QA process, with every push to the GitHub remote the whole suite of demos is deployed in a staging server in the cloud, so they can all be used.
This is managed by the `deploy-staging.yml` workflow.

Conversely, when a branch is deleted, the corresponding deployed demos get removed as well.
This is managed by the `dismantle-staging.yml` workflow.

For example, if you push a commit to the branch `stable`, then https://integrations.wiris.kitchen/stable/html/generic/ will contain the HTML demo for the generic editor with the latest changes you pushed.

The URL format for each demo is as follows: `https://integrations.wiris.kitchen/<BRANCH>/<FRAMEWORK>/<EDITOR>/`.

The following table contains all our demos, together with links to the corresponding deployment for the branch `stable`:


| FRAMEWORK | Editor and Version  | EDITOR                                               | Deployment URL for `stable`                                  |
|-----------|---------------------|------------------------------------------------------|--------------------------------------------------------------|
| html      | CKEditor V4         | [ckeditor4](../../demos/html/ckeditor4)              | https://integrations.wiris.kitchen/stable/html/ckeditor4/    |
| html      | CKEditor V5         | [ckeditor5](../../demos/html/ckeditor5)              | https://integrations.wiris.kitchen/stable/html/ckeditor5/    |
| html      | Froala              | [froala](../../demos/html/froala)                    | https://integrations.wiris.kitchen/stable/html/froala/       |
| html      | Generic integration | [generic](../../demos/html/generic)                  | https://integrations.wiris.kitchen/stable/html/generic/      |
| html      | TinyMCE V5          | [tinymce5](../../demos/html/tinymce5)                | https://integrations.wiris.kitchen/stable/html/tinymce5/     |
| html      | TinyMCE V6          | [tinymce6](../../demos/html/tinymce6)                | https://integrations.wiris.kitchen/stable/html/tinymce6/     |
| angular   | CKEditor V5         | [ckeditor5](../../demos/angular/ckeditor5/README.md) | https://integrations.wiris.kitchen/stable/angular/ckeditor5/ |
| angular   | Froala              | [froala](../../demos/angular/froala/README.md)       | https://integrations.wiris.kitchen/stable/angular/froala/    |
| angular   | Generic integration | [generic](../../demos/angular/generic/README.md)     | https://integrations.wiris.kitchen/stable/angular/generic/   |
| angular   | TinyMCE V5          | [tinymce5](../../demos/angular/tinymce5/README.md)   | https://integrations.wiris.kitchen/stable/angular/tinymce5/  |
| react     | CKEditor V5         | [ckeditor5](../../demos/react/ckeditor5/README.md)   | https://integrations.wiris.kitchen/stable/react/ckeditor5/   |
| react     | Froala              | [froala](../../demos/react/froala/README.md)         | https://integrations.wiris.kitchen/stable/react/froala/      |
| react     | Generic integration | [generic](../../demos/react/generic/README.md)       | https://integrations.wiris.kitchen/stable/react/generic/     |
| react     | TinyMCE V5          | [tinymce5](../../demos/react/tinymce5/README.md)     | https://integrations.wiris.kitchen/stable/react/tinymce5/    |


## Running a demo using the local source code

By default, these demos download the latest version of the MathType plugins from npm.
If you are modifying the source code of the plugins in this repo, and want to try that out instead, follow the instructions in the [Development](../development/demos/README.md) section.
