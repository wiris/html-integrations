# MathType HTML Integrations mono-repository

Mono-repository for the MathType Web plugins and their dependencies.

## Quick start

Clone this repo and:

```sh
$ npm install
$ rm packages/mathtype-ckeditor4/package-lock.json 
$ rm packages/mathtype-ckeditor5/package-lock.json 
$ npm start
$ lerna run compile -- npm
```

## Structure

- `packages`. Each folder contains one npm package. All the usual npm commands
work inside.
- `lerna.json`, `package.json`, `package-lock.json`. Configuration files for the
root npm package and the Lerna mono-repository.
- `scripts`. Folder containing different scripts used at compile time, etc.

## Requirements

This project requires basic knowledge of the `git` and `npm` commands.
It also uses the `npx` tool which comes bundled with `npm`.

`lerna` is used as a cornerstone of the project structure. Its main features
are explained in this guide.

## Instructions

### Cloning

First, clone the repository:

```sh
$ git clone https://github.com/wiris/html-integrations
$ cd html-integrations
html-integrations$
```

On Windows, you will need to have administrator privileges or activate
[developer mode](https://docs.microsoft.com/en-us/windows/uwp/get-started/enable-your-device-for-development)
in your account, and then use the `core.symlinks` when cloning the repository:

```sh
projects$ git clone --config core.symlinks=true https://github.com/wiris/html-integrations
```

### Bootstrapping

The mono-repository is managed through [Lerna](https://lerna.js.org/), a tool
designed for mantaining multiple npm packages in a single git repository.

Before using Lerna, it is recommended to install the development dependencies
stated in the root `package.json` file as they are used in the scripts of all
packages:

```sh
html-integrations$ npm install
```

Then, we need to bootstrap all the packages. What this does is try to find
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

### Compiling

To try out a package, it can be compiled as such:

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

### Batch actions

Lerna allows to run a single command on all or any packages in the
mono-repository. For example, you can build all editors for a single technology
like this:

```sh
html-integrations$ npx lerna run compile -- npm
```

### Cleaning up

Clean the output in the root folder and in the packages:

```sh
html-integrations$ npm run clean
```

Clean the outputs and also all of the `node_modules`:

```sh
html-integrations$ npm run clean-all
```

This will require you to `npm i` and `npx lerna bootstrap` in the root again.

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

### Technical Demos

In order to manually test each plugin, demos will be developed in the future.

*Note*: To be taken into account when developing the new demos is the fact that
CKEditor 5 issues a duplicated modules error when installing the plugin using
a "file:..." protocol or a .tgz file. In order to avoid this, in the old
plugins repository we make a hacky string replacement that removes the
dependencies in the CKEditor 5 plugin `package.json`, compiles the demo
(which does contain those dependencies), and then restores the original
`package.json`. A similar approach could be used here when the CKEditor 5 demo
is to be developed.

## Documentation

[npm](https://docs.npmjs.com/)

[Lerna](https://github.com/lerna/lerna#readme) 