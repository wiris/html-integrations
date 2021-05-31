# Trying out the demos in development mode

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Trying out the demos in development mode</small>

By default, these demos download the latest version of the MathType plugins from npm.
This document explains what to do if you are modifying the source code of the plugins in this repo, and want to try that out instead.

> **Note**: The React demos require an extra step beforehand.
>
> Go to the desired demo folder and run `yarn`, e.g.:
>
> ```sh
> demos/react/ckeditor5$ yarn
> ```
>
> All other demos (HTML5 and Angular) do not require this step.

To work with Lerna and try out the packages, with your local changes instead of the published packages, you need to copy the contents from `lerna.demos.json` to `lerna.json` in the root of the repo:

```sh
$ cp lerna.demos.json lerna.json
```

Then, bootstrap the packages again:

```sh
$ npm install
$ npm start
```

Then, just move to the desired demo folder and run:

```sh
$ npm run start
```

>**Note**: The CKEditor 5 demo for HTML5 might raise an error.
>
> In such case, run `npm run compile-package` before running `npm start` (or `npm run compile-package-windows` if you're using Windows).
