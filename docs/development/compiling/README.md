# Compiling the packages

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Compiling the packages</small>

The MathType Web plugins consist mostly of JavaScript.
In order to offer cross-browser compatibility and the latest features, most of these plugins need to be "compiled" using [Webpack].

[Webpack]: https://webpack.js.org/

## Table of contents

- [Compiling all packages](#compiling-all-packages)
- [Compiling individual packages](#compiling-individual-packages)
- [Pointing to your own back-end](#pointing-to-your-own-back-end)
- [Cleaning up](#cleaning-up)

## Compiling all packages

When running the following command described in the [Bootstrapping](../../README.md#Bootstrapping) section:

```sh
$ npm start
```

the monorepo will bootstrap all the packages in the monorepo and also compile all the plugins for you.

## Compiling individual packages

To compile a single packages, move to its folder and run:

```sh
$ npm run build
```

You can also build the packages in development mode:

```sh
$ npm run build-dev
```

## Pointing to your own back-end

If your website hosts its own MathType Web services, instead of using the wiris.net services, then you must pass a flag indicating which technology your server uses (ASPX, Java, Ruby, or PHP):

```sh
$ npm run compile -- [tech] [--dev]
```
Where `[tech]` is one of:

- `aspx`
- `java`
- `php`
- `ruby`

The `--dev` optional flag builds the package in development mode.

In case of using a custom back-end, the compiled package will be stored in `html-integrations/output/[tech]-[editor]`.

## Cleaning up

To delete files generated during the compilation process, move to the root of the repo and run:

```sh
$ npm run clean
```

To also clean all of the `node_modules` folders, run instead:

```sh
$ npm run clean-all
```
