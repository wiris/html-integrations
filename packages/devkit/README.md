# MathType Web Integration JavaScript SDK

## Install instructions

Install dependencies:

```bash
$ yarn install
```

Compile using npm packages:

```bash
$ yarn run build
```

Compile using local packages:

```bash
$ yarn run build-dev
```

Lint:

```bash
$ yarn run lint
```

Test:

```bash
$ yarn run test
```

## Dependencies

The following packages are dependencies of the project:

- [`uuid`](https://www.npmjs.com/package/uuid)

    In order to conform to RFC specifications when generating UUIDs, we leverage this package instead of maintaining all the logic that is unrelated to MathType.

- [`raw-loader`](https://www.npmjs.com/package/raw-loader)

    This dependency is used by Webpack in order to transpile the source files down to a single, minified, cross-browser compatible JavaScript file.
    In particular, it is used to load SVG files for button icons that are used in the modal window that contains the MathType editor.
    Unfortunately, for these resources to be loaded properly, the `raw-loader` must be applied in the `webpack.config.js` file.
    See a working example of such file in this folder.

    **Note**: As a consequence of this dependency, if you want to integrate `mathtype-html-integration-devkit` in your own project, you will have to apply `raw-loader` to the MathType source files in your own `webpack.config.js`.

- [`DOMPurify`](https://www.npmjs.com/package/dompurify)

    Used to sanitize HTML and prevents XSS attacks. When HTML code is sent by the user, DOMPurify receive the input and delete the malicious code.


## Generate the package documentation site

This project uses `jsdoc` to build an HTML documentation site of this package and its API.

The `jsdoc` theme for this site is [mathtype-integration-jsdoc-theme](https://github.com/wiris/mathtype-integration-jsdoc-theme).

**How to generate the documentation site**

Run these commands:

```bash
$ yarn install
$ yarn run build-jsdoc
```

The source code of the documentation site is generated on the `/out` folder.

## Privacy policy

The [MathType Privacy Policy](https://www.wiris.com/en/mathtype-privacy-policy/?utm_source=npmjs&utm_medium=referral) covers the data processing operations for the MathType users. It is an addendum of the company's general Privacy Policy and the [general Privacy Policy](https://www.wiris.com/en/privacy-policy?utm_source=npmjs&utm_medium=referral) still applies to MathType users.
