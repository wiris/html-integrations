# 004. Support for Froala editor major versions

Date: 24-ag-2021

## Status

DRAFT

## Summary

*When creating a new mathtype plugin for Froala v4*
*realized that the code is the same as Froala v3.*
*We decided to use a single package for both versions*
*in order to reduce DRI and work with a better solution than symlinks.*
*The package name wont be self-explanatory.*

## Context (Discussion)

In the context of the new version released by the Froala team, we want to generate a
plugin that gives support to it and it's issues, so the users can use MathType in all Froala versions.

Froala 4 integration with customs plugins has a very defined [documentation](https://froala.com/wysiwyg-editor/docs/migrate-from-v2/) and way to integrate.

Since we don't want to reinvent the wheel, nor mantain two packages, nor use symlinks, 
the best only left decision to take is to keep the plugin the same as for the previous version: 3, and apply specific changes for each version, if needed.

## Decision

We will use the same MathType package for the new Froala v4, as the one we have for the v3, since the integration is exactly the same.

Therefore the [MathType-froala3](https://www.npmjs.com/package/@wiris/mathtype-froala3) package becomes a package that suports Froala v3 and above,
so we don't have to maintain a bad arquitecture or multiple plugins with the same code

### Pros and Cons of the Options

#### Unique package for Froala v3 and v4.

    Good, because you'll only maintain one package.
    Good, because it'll reduce DRI.
    Bad, because the package name is not self-explanatory.

#### Use symlinks and have two packages, each one for one of the froala versions

    Good, because it'll reduce DRI
    Good, because we know it works, for previous experience with TinyMCE v4 and cv5.
    Bad, because, in comparasion with the first option, we'll have to mantain one more package.
    Bad, because the infrastructure is more complex.

#### Create a common package to store the identical code between v3 & 4, and create a new package that uses this code

    Good, because it'll reduce DRI
    Bad, because, in comparasion with the first option, we'll have to mantain two more package.

## Consequences (Results)

> What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.

> What becomes easier or more difficult to do because of this change?

> Explains the results of the decision over the long term.
> Did it work, not work, was changed, upgraded, etc.
