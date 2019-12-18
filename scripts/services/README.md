# Services scripts

As part of our task of splitting the plugins project repository into two (front-end and back-end), we take an intermediate step which allows us to make minimal changes to the way the plugins project works, and still be able to test the different plugins taken from this new repository.

These scripts are some of the temporary glue between the two projects. Below is a brief summary of the role of each file. A more extensive explanation of the arguments and behavior can be found inside each of the scripts.

## Files

### `copy.js`

Copies the given folder to output/ in the root of the monorepo with the appropriate name for the tech it uses.

### `replace.js`

Replaces the default services that point to the Wiris service with local services (PHP, Java, ASPX, etc.)

### `compile.js`

Replaces the default services that point to the Wiris service with local services (PHP, Java, ASPX, etc.), builds it and copies the given folder to output/ in the root of the monorepo with the appropriate name for the tech it uses. Then, undoes the replacement in the original folder.

This script also checks whether te file that is going to be replaced is a symbolic link or not and acts differently in each case. This is related to the way the sources of the TinyMCE plugins are stored. To know more, read `packages/mathtype-tinymce/README.md`.

### `techs.json`

List of metadata related to each backend technology.

## Usage

The `copy.js` and `replace.js` are used by `compile.js`. It is recommended to only call directly `compile.js`. A good way to use this script, e.g. in a "scripts" section of a package.json of a plugin, may be as such:

```json
"compile": "node ../../scripts/services/compile plugin.src.js ."
```

Observe the following:

- Only two arguments are passed to the script. The third argument is to be passed upon calling the compile step defined above. See below for an example.
- The first argument to the script is the file to make the replacements in. Right now only replacement in one file is supported, but the `replace.js` script could be easily adapted to multiple files.
- The second argument is the folder to copy. Notice that both this argument and the script location are relative to the package folder, as this is where the npm scripts of the package are called from.

To call this script for, e.g. PHP, we could do so like this:

```bash
$ npm run compile -- php
```

The double dash (--) is necessary for npm to pass the `php` parameter to the script instead of passing it to `npm`.

An optional `--dev` flag can be passed at any position to call the `build-dev` step instead of `build` in the package to compile. For example:

```bash
$ npm run compile -- php --dev
```