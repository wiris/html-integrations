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
$ yarn
```

the monorepo will bootstrap all the packages in the monorepo and also compile all the plugins for you.

## Compiling individual packages

To compile a single packages, run:

```sh
$ yarn build <PACKAGE>
```

You can also build the packages in development mode:

```sh
$ yarn build-dev <PACKAGE>
```

Where PACKAGE can be:

* ckeditor4
* ckeditor5
* froala
* generic
* tinymce5
* tinymce6

## Pointing to your own back-end

If your website hosts its own MathType Web services, instead of using the wiris.net services, then you must pass a flag indicating which technology your server uses (ASPX, Java, Ruby, or PHP), run the following command in the desired package folder:


```sh
$ SERVICE_PROVIDER_URL=[url] SERVICE_PROVIDER_SERVER=[tech] yarn build
```

Where `[tech]` is one of:

- `aspx`
- `java`
- `php`
- `ruby`

and `[url]` is the relative address to the main endpoint of the MathType Web services that you are hosting (e.g. `integration` if your PHP services are in the `integration/` directory).

You can use `build-dev` instead of `build` to build the package in development mode.

## Cleaning up

To delete files generated during the compilation process, run:

```sh
$ yarn clean
```
