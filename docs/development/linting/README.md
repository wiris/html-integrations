# Linting

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Linting</small>

We've implemented a complete lint strategy for the JavaScript, HTML and CSS files include on this project.

## Table of contents

- [JavaScript files](#javascript-files)
- [CSS files](#css-files)
- [HTML files](#html-files)
- [Lint all files at once](#lint-all-files-at-once)

## JavaScript files

To validate all the `.js` files of all packages, run:

```sh
$ nx run-many --target=lint --all --parallel
```

To validate specific package `.js`:

```sh
$ nx lint <package>
# Example:
$ nx lint ckeditor5
```

To validate all the `.js` files of the project, run:

```sh
$ yarn run lint-js
```

To validate specific `.js` files or folders of the project, add the `--route` option to the previous commands:

```sh
$ yarn run lint-js --route=<path>
# Example:
$ yarn run lint-js --route=demos
```

> Where **path** is the folder or the specific file you want to lint.

## CSS files

To validate all the `.css` files of the project, run:

```sh
$ yarn run lint-css
```

To validate specific `.css` files or folders of the project, add the `--route` option to the previous commands:

```sh
$ yarn run lint-css --route=path
# Example:
$ yarn run lint-css --route=demos/**/*.css
```

> Where **path** is the folder or the specific file you want to lint.
> In this case it's necessary to specify the file extension you want to lint to avoid a stylelint error. Is the folder/files has not html extension, it'll throw a warning message.

## HTML files

```sh
$ yarn run lint-html
```

To validate specific `.html` files or folders of the project, add the `--route` option to the previous commands:

```sh
$ yarn run lint-html --route=path
# Example:
$ yarn run lint-html --route=demos
```

> Where **path** is the folder or the specific file you want to lint.

It is possible to automatically fix some of the errors, just add the `--fix` option in the desired command and run it.

## Lint all files at once

You can lint all type of files at once, running this command:

```sh
$ yarn run lint
```
