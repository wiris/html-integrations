# Packaging

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → Packaging</small>

Each editor plugin that is distributed built (e.g. those that include a `webpack.config.js` file) must have a `prepack` [npm lifecycle script](https://docs.npmjs.com/misc/scripts), which is run BEFORE a tarball is packed (on `npm pack`, `npm publish`, and when installing git dependencies).

This script should build the package (generally by calling `npm run build`).
As a special case, the TinyMCE plugins call the `services/compile.js` script because they need to have the source replaced before building.
