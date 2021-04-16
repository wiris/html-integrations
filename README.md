# Mono-repository for the MathType Web plugins and their dependencies. &nbsp; <img src="resources/img/logo.jpg" width="40"> 

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](docs/CONTRIBUITING.md)&nbsp;[![Updated](https://img.shields.io/badge/Updated%3F-yes-green.svg)](docs/CONTRIBUITING.md)&nbsp;[![Downloads](https://img.shields.io/static/v1.svg?label=Downloads&message=40&color=blue)](https://github.com/wiris/html-integrations/graphs/traffic)

Mono-repository for the [MathType](http://www.wiris.com/en/mathtype) Web plugins and their dependencies. 

![Wiris mathtype plugin example](resources/img/wiris_plugin_example.png)

## Table of contents

- [Requirements](#requirements)
- [File Manifest](#file-manifest)
  - [Important files & folder structure](#important-files--folder-structure)
  - [Supported editors](#supported-editors)
- [Quick start](#quick-start)
  - [Cloning](#cloning)
  - [Installation](#installation)
  - [Bootstrapping](#bootstrapping)
  - [Compiling](#compiling)
  - [Batch actions](#batch-actions)
    - [Compiling packages individually](#compiling-packages-individually)
    - [Compile packages by technology](#compile-packages-by-technology)
    - [Cleaning up](#cleaning-up)
  - [Analyzing and fixing code](#analyzing-and-fixing-code)
  - [Testing](#testing)
  - [Versioning](#versioning)
  - [Publishing](#publishing)
- [Examples for developers](#examples-for-developers)
- [More information](#more-information)
- [Privacy policy](#privacy-policy)
- [Technical support](#technical-support)
- [License](#license)

## Requirements

This project requires basic knowledge of the `git` and `npm` commands.
It also uses the `npx` tool which comes bundled with `npm`.

To install node and npm follow this [guide-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), and use this other one [guide-git](https://www.atlassian.com/git/tutorials/install-git) to install git.

[Lerna] is used as a cornerstone of the project structure. Its main features are explained in this guide.

In case you want to run the automated tests included on this repository, you will need to install [Jest] on your local machine.

[lerna]: https://lerna.js.org/
[jest]: https://jestjs.io

## File Manifest

### Important files & folder structure

In this section we give a small description of the files that we consider the most important of the project, also we will talk about the content of the subfolders of the project and its usefulness.

- `lerna.json`, `package.json`, `package-lock.json`. Configuration files for the
root npm package and the Lerna mono-repository.
- `packages/`. Each folder contains one npm package. All the usual npm commands
work inside.
- `demos/`. A growing set of technical demos to help developers integrate these plugins on different scenarios.
- `scripts/`. Folder containing different scripts used at compile time, etc.
- `resources`. Folder containing different resources files that are needed in the demos folder.

### Supported editors

In the next list, you will see the editors that have a specialized WIRIS plugin of the mathtype formula editor.

- CKEditor
- Froala
- TinyMCE 
- Generic* 
 
> *: generic is a global integration made so that, from there, the WIRIS plugin can be integrated into any editor by following its steps.

## Quick start

Follow these instructions to use the libraries.

### Cloning

First, clone the repository

#### Linux/Mac

```sh
$ git clone https://github.com/wiris/html-integrations
$ cd html-integrations
html-integrations$
```

#### Windows

You will need to have administrator privileges or activate
[developer mode](https://docs.microsoft.com/en-us/windows/uwp/get-started/enable-your-device-for-development)
in your account, and then use the `core.symlinks` when cloning the repository:

```sh
projects$ git clone --config core.symlinks=true https://github.com/wiris/html-integrations
```

### Installation

After cloning this repo, open a Terminal window to run these next commands:

```sh
$ npm install
$ npm start
```

In case you want to try out the [Technical Demos](#technical-demos) you can go to the **demos** folder and follow the instructions you can find in the folder README file. 

### Bootstrapping

The mono-repository is managed through [Lerna](https://lerna.js.org/), a tool
designed for maintaining multiple npm packages in a single git repository.

Before using Lerna, it is recommended to install the development dependencies
stated in the root `package.json` file as they are used in the scripts of all
packages:

```sh
html-integrations$ npm install
```

### Compiling

It is possible to compile manually all the packages. What this does is try to find
which dependencies of the mono-repo packages are present inside the mono-repo
itself, and link to them instead of downloading them from the npm repository.

```sh
html-integrations$ npm start
```

If this fails, try using `npx`:

```sh
html-integrations$ ./packages/mathtype-ckeditor5/npm pack
html-integrations$ npx lerna bootstrap
```


### Batch actions


#### Compiling packages individually

To try out a single package, it can be compiled individually as such:

```sh
html-integrations/packages/mathtype-[editor]$ npm run compile -- [tech] [--dev]
```

Where [editor] can be any of:

- `ckeditor4`
- `ckeditor5`
- `froala`
- `froala3`
- `generic`
- `tinymce4`
- `tinymce5`

and [tech] can be any of:

- `aspx`
- `java`
- `npm`
- `php`
- `ruby`

The `--dev` optional flag calls the `build-dev` script defined in the plugin's `package.json`
instead of the `build` script.

This replaces the service provider URI and server with the appropriate values,
builds the sources with Webpack, and places the result in
`html-integrations/output/[tech]-[editor]`.

#### Compile packages by technology

Lerna allows to run a single command on all or any packages in the
mono-repository. For example, you can build all editors for a all technologies
like this:

```sh
html-integrations$ npx lerna run compile -- npm
```

#### Cleaning up

Clean the output in the root folder and in the packages:

```sh
html-integrations$ npm run clean
```

Clean the outputs and also all of the `node_modules`:

```sh
html-integrations$ npm run clean-all
```

This will require you to `npm i` and `npm start` in the root again.

### Linting code

There are configuration files at the root of the project to help. They statically analyze and fix code errors in files with extensions .js, .css and .html. The analysis shows the error and where it is, then it can be fixed. The commands are:

**Check all the .js files**

```sh
  $ npm run lint
  # From...
  $ npx eslint --ext [options] <dir|file|glob>*
```

**Check all the .css files**

```sh
    $ npm run lint-css
    # From...
    $ npx stylelint [options] <dir|file|glob>*
```

**Check all the .html files**
    
```sh
    $ npm run lint-html
    # From...
    $ html-validate [options] <dir|file|glob>*
```

It is possible to automatically fix some of the errors, just add the `--fix` option in the desired command and run it.

### Testing 

We have prepared a set of tests to validate our packages code and developer code examples. There are unit, integration and e2e tests; for the latter we have used an extension called Pupeeteer.

**Run all tests at once**

All tests can be executed with the `npm test` command from the root of the project. Tests will be run on all wiris packages and all the demos that exists.

```sh
  $ npm test
```

**Run all tests for a certain package/demo**

You can run the specific tests of a package or one of the demos as example code, by executing in your directory the `npm test` command.

For a package:

```sh
  $ cd packages/mathtype-html-integration-devkit/
  $ npm install
  $ npm test
```

For a demo:

```sh
  $ cd demos/[frameworks]/[editor]  # example: demos/html5/generic
  $ npm install
  $ npm run serve
  # Wait for the demo to start.
  # Then, run the tests on a new Terminal window in the same folder.
  $ npm test
```

### Versioning

In this project [semantic](https://semver.org), [independent](https://github.com/lerna/lerna#independent-mode) versioning is used.

The semantic version convention is applied:

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> 1. MAJOR version when you make incompatible API changes,
> 2. MINOR version when you add functionality in a backwards compatible manner, and
> 3. PATCH version when you make backwards compatible bug fixes.

Lerna introduces a tool `lerna version` useful for updating the appropriate
number for each package that has changes, making a commit, and tagging it.

In general, when publishing changes, just run:

```sh
  $ lerna version --exact
```

This will prompt you with each package with changes since the last version
and ask you whether to increase the patch, minor, or major number.

It is responsibility of the developer to keep track of which kind of changes
have been introduced in each package.

The `--exact` option forces Lerna to modify packages that depend on others that
have been modified. For example, if `@wiris/mathtype-html-integration-devkit` is
modified, all the editor plugins that depend on it will also require to have
their version increased.

### Publishing

Each editor plugin that is distributed built (e.g. those that include a
`webpack.config.js` file) must have a `prepack`
[npm lifecycle script](https://docs.npmjs.com/misc/scripts), which is run
BEFORE a tarball is packed (on `npm pack`, `npm publish`, and when installing
git dependencies).

This script should build the package (generally by calling `npm run build`).
As a special case, the TinyMCE plugins call the `services/compile.js` script
because they need to have the source replaced before building.

## Moodle integrations

MathType is used as a Third Party dependency on some Moodle plugins so it can be used on this LMS platform.

Therefore, some packages on this project contain a Javscript file used by Moodle and they need to be updated on the corresponding Moodle plugins on every release.

| Plugin                                                                          | Package                          | File                 |
| ------------------------------------------------------------------------------- | -------------------------------- | -------------------- |
| [MathType for Atto](https://github.com/wiris/moodle-atto_wiris)                 | mathtype-html-integration-devkit | `plugin.min.moodle.js` |
| [MathType for TinyMCE](https://github.com/wiris/moodle-tinymce_tiny_mce_wiris/) | mathtype-tinymce4                | `core.js`*             |

> *: this file is not included on the repo and needs to be generate using the `build` command.

### How to update dependencies

**1. Prepare the environment.**

```sh
  # Install this project dependencies, in case you didn't already.
  $ npm install
  # You may need to run the clean command, if you executed the start command previously.
  $ npm run clean-all 
```

**2. Generate the Javascript files**

Run the 'moodle' command, first. And compile the `mathtype-html-integration-devkit` package.

```sh
  $ npm run clean-all 
  # Run the Moodle generation command:
  # It will run the lerna bootstrap command and then compile the packages
  # using the 'moodle' parameter. See 'scripts/services/README.md' for more
  # details.
  # npm run clean => lerna bootstrap => lerna run compile -- moodle
  $ npm run moodle
  cp output/moodle-tinymce4/plugin.min.js packages/mathtype-tinymce4/plugin.min.moodle.js

  # Since 'lerna bootstrap' has been run, it's the turn to update 'Atto' editor.
  cd packages/mathtype-html-integration-devkit
  npm run build
```

**3. Copy the files to the Moodle plugins**

Last step consists on updating the Third Party library dependency files on the Moodle plugin source code.

```sh
  # 'TinyMCE' editor.
  # {MOODLE_TINYMCE_PLUGIN} is the path for the Moodle plugin source code. 
  cp packages/mathtype-tinymce4/plugin.min.moodle.js {MOODLE_TINYMCE_PLUGIN}/tinymce/editor_plugin.js
  # 'Atto' editor.
  # {MOODLE_ATTO_PLUGIN} is the path for the Moodle plugin source code. 
  cp packages/mathtype-html-integration-devkit {MOODLE_ATTO_PLUGIN}/core.js

```

## Examples for developers

In order to manually test each plugin, there's a set of technical demos on
the ['demos/'](./demos/) folder on this project.

Refer to the [README](demos/README.md) file for more information.

### Technical Support

If you have questions or need help integrating MathType, please contact us (support@wiris.com) instead of opening an issue.


## Privacy policy

The [MathType Privacy Policy](http://www.wiris.com/mathtype/privacy-policy) covers the data processing operations for the MathType users. It is an addendum of the company’s general Privacy Policy and the [general Privacy Policy](https://wiris.com/en/privacy-policy) still applies to MathType users.

## License

Copyright © 2010-2021 [WIRIS](http://www.wiris.com). Released under the [MIT License](LICENSE).
