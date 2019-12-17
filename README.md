# Plugins Frontend mono-repository

Mono-repository for the MathType Web plugins and their dependencies.

## Quick start

Clone this repo and:

```sh
$ npm i
$ lerna bootstrap
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
$ git clone https://github.com/wiris/plugins-frontend
$ cd plugins-frontend
plugins-frontend$
```

On Windows, you will need to have administrator privileges or activate
[developer mode](https://docs.microsoft.com/en-us/windows/uwp/get-started/enable-your-device-for-development)
in your account, and then use the `core.symlinks` when cloning the repository:

```sh
projects$ git clone --config core.symlinks=true https://github.com/wiris/plugins-frontend
```

### Bootstrapping

The mono-repository is managed through [Lerna](https://lerna.js.org/), a tool
designed for mantaining multiple npm packages in a single git repository.

Before using Lerna, it is recommended to install the development dependencies
stated in the root `package.json` file as they are used in the scripts of all
packages:

```sh
plugins-frontend$ npm install
```

Then, we need to bootstrap all the packages. What this does is try to find
which dependencies of the mono-repo packages are present inside the mono-repo
itself, and link to them instead of downloading them from the npm repository.

```sh
plugins-frontend$ npm run bootstrap
```

### Compiling

To try out a package, it can be compiled as such:

```sh
plugins-frontend/packages/mathtype-[editor]$ npm run compile -- [tech]
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

This replaces the service provider URI and server with the appropriate values,
builds the sources with Webpack, and places the result in
`plugins-frontend/output/[tech]-[editor]`.

### Batch actions

Lerna allows to run a single command on all or any packages in the
mono-repository. For example, you can build all editors for a single technology
like this:

```sh
plugins-frontend$ npx lerna run compile -- npm
```

### Cleaning up

Clean the output in the root folder and in the packages:

```sh
plugins-frontend$ npm run clean
```

Clean the outputs and also all of the `node_modules`:

```sh
plugins-frontend$ npm run clean-all
```

This will require you to `npm i` and `npx lerna bootstrap` in the root again.

## Documentation

[npm](https://docs.npmjs.com/)

[Lerna](https://github.com/lerna/lerna#readme) 