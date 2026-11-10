# Trying out the demos in development mode

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Trying out the demos in development mode</small>

By default, these demos download the latest version of the MathType plugins from npm. This guide explains how to build packages from this repository and try your local changes in any of the demos.

Run the commands from the project root. First install the repository dependencies, then build the package you changed and start the demo you want to use. Follow the commands explained in to sections below depending on your Node version.

When changing a package code, both the devkit and package must be rebuild as well as restarting the demo. Do it with its start command if it is no longer running.

## Environment

| FRAMEWORK | Editor and Version | DEMO |
|---|---|---|
| html | CKEditor V4 | [ckeditor4](../../demos/html5/ckeditor4) |
| html | CKEditor V5 | [ckeditor5](../../demos/html5/ckeditor5) |
| html | Froala V4 | [froala](../../demos/html5/froala) |
| html | Generic integration | [generic](../../demos/html5/generic) |
| html | TinyMCE V4 | [tinymce4](../../demos/html5/tinymce4) |
| html | TinyMCE V5 | [tinymce5](../../demos/html5/tinymce5) |
| html | TinyMCE V6 | [tinymce6](../../demos/html5/tinymce6) |
| angular | CKEditor V5 | [ckeditor5](../../demos/angular/ckeditor5/README.md) |
| angular | Froala V4 | [froala](../../demos/angular/froala/README.md) |
| angular | Generic integration | [generic](../../demos/angular/generic/README.md) |
| angular | TinyMCE V5 | [tinymce5](../../demos/angular/tinymce5/README.md) |
| react | CKEditor V5 | [ckeditor5](../../demos/react/ckeditor5/README.md) |
| react | Froala V4 | [froala](../../demos/react/froala/README.md) |
| react | Generic integration | [generic](../../demos/react/generic/README.md) |
| react | TinyMCE V5 | [tinymce5](../../demos/react/tinymce5/README.md) |

The following two Node.js workflows below apply to every demo in the above table. Choose the section for your Node.js version, then substitute the package and demo for the one you want to run.

Use the package name from the table for `<PACKAGE>`. Use the framework and editor names for the Nx start target. Follow this example: the TinyMCE 4 demo target is `html-tinymce4` (the demo files live under `demos/html5`).

## Node.js 16 or earlier

With Node.js 16 or earlier, use the standard commands:

```sh
yarn install
yarn nx build <PACKAGE>
yarn nx start <FRAMEWORK>-<EDITOR>
```

No OpenSSL compatibility option is needed.

## Node.js 17 or later

Use the same build and start commands above. If Yarn stops because a dependency rejects the Node version, install dependencies with `--ignore-engines` as follows:

```sh
yarn install --ignore-engines
```

The build commands should work without any issues and can be used as described in the previous section.

For the command to start a demo, there could be issues. Some demos use Webpack 4, which can fail on newer Node versions with `ERR_OSSL_EVP_UNSUPPORTED`. If you see that error when starting a demo, enable the OpenSSL legacy provider for that start command like this:

```sh
NODE_OPTIONS=--openssl-legacy-provider yarn nx start <FRAMEWORK>-<EDITOR>
```
