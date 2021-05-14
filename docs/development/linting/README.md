# Linting

<small>[⇱ Back to root](../../../README.md)<br>[↖ Back to Development guide](../README.md)</small>

There are configuration files at the root of the project to help. They statically analyze and fix code errors in files with extensions .js, .css and .html. The analysis shows the error and where it is, then it can be fixed. The commands are:

> Before running the lint commands, make sure that the dependenceis fo the folder/folders where you're trying to lint file/files are installed.

## Table of contents

- [JavaScript files](#javascript-files)
- [CSS files](#css-files)
- [HTML files](#html-files)

## JavaScript files

To check all the .js files of the project, run:

```sh
  $ npm run lint-js
```

To check specific .js files or folders of the project, add the --route option to the previous commands:

```sh
  $ npm run lint-js --route=path
  # Example:
  $ npm run lint-js --route=demos
```

> Where **path** is the folder or the specific file you want to lint.

## CSS files

To check all the .css files of the project, run:

```sh
    $ npm run lint-css
```

To check specific .css files or folders of the project, add the --route option to the previous commands:

```sh
  $ npm run lint-css --route=path
  # Example:
  $ npm run lint-css --route=demos/**/*.css
```

> Where **path** is the folder or the specific file you want to lint.
> In this case it's necessary to specify the file extension you want to lint to avoid a stylelint error. Is the folder/files has not html extension, it'll throw a warning message.

## HTML files

```sh
    $ npm run lint-html
```

To check specific .html files or folders of the project, add the --route option to the previous commands:

```sh
  $ npm run lint-html --route=path
  # Example:
  $ npm run lint-html --route=demos
```

> Where **path** is the folder or the specific file you want to lint.

It is possible to automatically fix some of the errors, just add the `--fix` option in the desired command and run it.

