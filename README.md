# MathType HTML Integrations mono-repository &nbsp; &nbsp; <img src="https://pbs.twimg.com/profile_images/968130684719190016/bKicbmwM_400x400.jpg" width="40"> 

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]() &nbsp; &nbsp; &nbsp; ![](https://img.shields.io/static/v1.svg?label=Downloads&message=36&color=yellow) &nbsp; &nbsp; &nbsp; ![](https://img.shields.io/static/v1.svg?label=Version&message=7.20.0&color=blue)

Mono-repository for the [MathType](http://www.wiris.com/en/mathtype) Web plugins and their dependencies. 

![Alt text](http://www.wiris.com/en/system/files/froala_wiris.png)

## Table of contents

- [Requirements](#requirements)
- [File Manifest](#file-manifest)
  - [Important files & Folder Structure](#important-files--folder-structure)
  - [Supported browsers](#supported-browsers)
  - [Supported editors](#supported-editors)
- [Instructions](#instructions)
  - [Cloning](#cloning)
  - [Installation](#installation)
  - [Bootstrapping](#bootstrapping)
  - [Compiling](#compiling)
  - [Batch actions](#batch-actions)
    - [Compiling packages individually](#compiling-packages-individually)
    - [Compile packages by technology](#compile-packages-by-technology)
    - [Cleaning up](#cleaning-up)
  - [Analyzing and fixing code](#analyzing-and-fixing-code)
  - [Versioning](#versioning)
  - [Publishing](#publishing)
- [Technical Demos](#technical-demos)
- [Running tests](#running-tests)
- [Known bugs](#known-bugs)
- [Change log](#change-log)
- [News](#news)
- [Documentation](#documentation)
- [Autors](#autors)
- [Contributing guidelines](#contributing-guidelines)
- [Code of conduct](#code-of-conduct)
- [License](#license)
- [Credits and acknowledgements](#credits-and-acknowledgements)
- [Contact information](#contact-information)

## Requirements

This project requires basic knowledge of the `git` and `npm` commands.
It also uses the `npx` tool which comes bundled with `npm`.

To install node and npm follow this [guide-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), and use this other one [guide-git](https://www.atlassian.com/git/tutorials/install-git) to install git.

[Lerna](https://lerna.js.org/) is used as a cornerstone of the project structure. Its main features are explained in this guide.

## File Manifest

### Important files & Folder Structure

- `lerna.json`, `package.json`, `package-lock.json`. Configuration files for the
root npm package and the Lerna mono-repository.
- `packages/`. Each folder contains one npm package. All the usual npm commands
work inside.
- `demos/`. A growing set of technical demos to help developers integrate these plugins on different scenarios.
- `scripts/`. Folder containing different scripts used at compile time, etc.
- `resources`. Folder containing different resources files that are needed in the demos folder.

### Supported browsers

### Supported editors

- `CKeditor 4`
- `CKeditor 5`
- `Froala 2`
- `Froala 3`
- `TinyMCE 4`
- `TinyMCE 5`
- `generic` is a global integration made so that, from there, the WIRIS plugin can be integrated into any editor by following its steps.

## Instructions

Folow these instructions to use the libraries.

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
designed for mantaining multiple npm packages in a single git repository.

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

- `ckeditor4`,
- `ckeditor5`,
- `froala`,
- `froala3`,
- `generic`,
- `tinymce4`,
- `tinymce5`;

and [tech] can be any of:

- `aspx`,
- `java`,
- `npm`,
- `php`,
- `ruby`.

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

### Analyzing and fixing code

There are configuration files at the root of the project to help. They statically analyze and fix code errors in files with extensions .js, .css and .html. The analisis shows the error and where it is, then it can be fixed. The commands are:

* To make a check of the .js files
    ```
    $ npx eslint --quiet [options] <dir|file|glob>*
    ```
* To make a check of the .css files
    ```
    $ npx stylelint [options] <dir|file|glob>*
    ```
* To make a check of the .html files
    ```
    $ html-validate [options] <dir|file|glob>*
    ```
It is possible to automatically fix some of the errors, just add the `--fix` option in the desired command and run it.

### Versioning

In this project [semantic](https://semver.org),
[independent](https://github.com/lerna/lerna#independent-mode) versioning is
used.

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
lerna version --exact
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

## Technical Demos

In order to manually test each plugin, there's a set of technical demos on
the 'demos/' folder.

Refer to the README file for more information.

**Note**: To be taken into account when developing the new demos is the fact that
CKEditor 5 issues a duplicated modules error when installing the plugin using
a "file:..." protocol or a .tgz file. In order to avoid this, in the old
plugins repository we make a hacky string replacement that removes the
dependencies in the CKEditor 5 plugin `package.json`, compiles the demo
(which does contain those dependencies), and then restores the original
`package.json`. A similar approach could be used here when the CKEditor 5 demo
is to be developed.

## Running tests

Automatic test will be coming soon.

## Known bugs

- **Technical demos** project errors. Please, refer to its README file for more information.

We are working to improve the user experience and fix the errors previously detailed. :smile:

## Change log

- **Improvements** in the **demos** project has been implemented. Please, refer to its README file for more information.

- **Reduced** the **time** when loading a second instance of mathtype formula editor in the same page

## News

- :tada: Technical demos are now live! Go and test the WIRIS plugins on your favourite editor. 

## Documentation

- [npm](https://docs.npmjs.com/)

- [Lerna](https://github.com/lerna/lerna#readme) 

- [WIRIS](http://www.wiris.com)

## Autors

- **Manuel Cagigas** - *CTO at WIRIS and developer*  - [manuelwiris](https://github.com/manuelwiris)

- **Xavier Ripoll** - *Developer* - [xaviripo](https://github.com/xaviripo)

- **Diego** - ** - [diegoWiris](https://github.com/diegoWiris)

- **Dani Canet** - *Team lead and developer* - [dcanetma](https://github.com/dcanetma)

- **Daniel Marques** - ** - [dani31415](https://github.com/dani31415)

- **Henry Qiulo** - ** - [HENRYQIULO](https://github.com/HENRYQIULO)

- **Diana** - ** - [dianawiris](https://github.com/dianawiris)

- **Carla Lara** - *Developer* - [carlawiris](https://github.com/carlawiris)

## Contributing guidelines

To **contribute**, clone this repo, create a branch from master, code and submit a PR. We'll review, discuss, and merge changes as needed. Thank you!

If you want to **report an error**, please send an email to team.support.europe@wiris.com with a description of the error you have, how to reproduce it, and a demo with the code that causes this problem.

We encourage any king of participation from the most varied and diverse background possible.

### Wishlist/To Do List

## Code of conduct

### Introduction

WIRIS is dedicated to provide a good environment so that everybody can have a good experience. It's not tolerated any type of harassment or violation of physical boundaries of partifipants. We ask you to be considetare to others and behave respectfull and professionally. 

We aim to provide to our comunity a safe and friendly environment for everyone, regardless of their knowledge, personal aspects or any other qualifications.

Remember, we are all humans and it's common to make mistakes. Let's work together to help each other instead of causing trouble.

### Expected behavior

 - Respect.

 - Be profesional.

 - Be responisble.

 - Be polite.

 - Be kind.
  
 - Be supportive.

### Unacceptable behaviour

Harassment is not tolerated and must be reported. Harassment includes:

- Offensive verbal comments related to gender, sexual orientation, disability, physical appearance, body size, race, ethnicity, religion, sexual images, deliberate intimidation, stalking, sustained disruption, and unwelcome sexual attention.

- Disrespect opinions.

- Intimidation, stalking or bullying.

- Virtual harassment.

Every individual asked to stop any kind of harasing is expected to comply imediately.

We encourage to report any harassment sufered.

### Reporting 

If you are the subject of harassed, notice that someone else is being harassed, or have any other concerns, please contact us by email ____________@wiris.com as soon as posible.

## License

Copyright © 2010-2020 [WIRIS](http://www.wiris.com). Released under the [MIT License](LICENSE).

## Credits and acknowledgements

- We want to thank all the participation, they helped this project to be what it is now, especially the authors of it.

- Thanks to the [docker-code-of-conduct](https://github.com/docker/code-of-conduct), [CKeditor 5](https://github.com/ckeditor/ckeditor5) and [PurpleBooth README-Template](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2) for inspiration and for giving us ideas.


## Contact information
team.support.europe@wiris.com 

