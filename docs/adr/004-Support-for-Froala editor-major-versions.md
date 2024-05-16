# 004. How we manage Froala editor new major versions

Date: 24-ag-2021

## Status

DRAFT

## Summary

_When Froala releases a new major version_  
_it needs to be decided whether to create a new package or not,_  
_depending on whether there are differences in the integration with MathType._  
_In case there is no difference,_  
_We have decided that we will use the same package to support more than one Major Froala version,_  
_with the goal of reducing DRI and improving code maintainability._  
_Keeping in mind, that the package name can confuse our users and_  
_changes the naming convention for the project packages used so far._
_This will be the case for the '@wiris/mathtype-froala3' package, which will support Froala V3 and V4._

## Context (Discussion)

We want to give support to any new Froala major version. For this reason, we must decide whether to create a new plugin for the new version of Froala, or use an existing one.

Between major versions of Froala, there can be _differences_, or not, in the way to integrate external plugins. This will be the reason to create a new MathType plugin or not:

We Currently have one package for each major Froala version, even though that's not the way Froala works: they have a unique package that stores all the versions. Even if we decided to follow the conventions Froala does, we would have to rename or delete our current modules, and npm wouldn't allow it, meaning that once a name is used, it can't be used never again for a new package.

## Decision

We will create and give the Froala MathType packages for any new major version, the following name: _@wiris/mathtype-froalaX_, where X equals the oldest Froala major version. Then, depending on whether the way to integrate in external plugin is the same or different:

- If the integration is different &rightarrow; Create a new MathType package for the major Froala version.
- If the integration is the same &rightarrow; Use the same package that already exists for the previous major version. A good example is the situation we are in with the versions 3 and 4, where the integration is the same, so the package for both versions is the mathtype-froala3.

### Pros and Cons of the Options

#### A same MathType package to support more than one Froala major versions

    Good, because you'll only maintain one package for multiple identical major versions.
    Good, because it'll reduce DRI.
    Bad, because the package name is not self-explanatory.
    Bad, because the package name can create confusion on our users
    Bad, because our current package convention name includes the version number on it

#### Create a new package for every new major Froala version using symlinks when the versions external plugin integrations are identical

    Good, because it'll reduce DRI.
    Good, because we know it works, for previous experience with TinyMCE v4 and v5.
    Good, because the name is self-explanatory, since includes the Froala major version.
    Bad, because, we'll have to maintain more than one package, at least.
    Bad, because the infrastructure is more complex.

#### Create a common package to store the identical code between Froala major versions that have the same external plugins integration, and create a new package for each version that uses the common one

    Good, because it'll reduce DRI.
    Good, because the name is-self explanatory, since includes the froala major version.
    Bad, because, we'll have to maintain more than one package, at least thee.

## Consequences (Results)

It becomes easier to maintain different major versions when they share the same external plugin integration, since they'll be on the same package.

Due to the problem originated by npm policies and our previous naming conventions, its name can confuse the users since it's non-self-explanatory. We expect that this problem gets solved by a proper documentation.

We also changed our demos to support just the latest major version for each MathType Froala package, this means that, by changing the Froala version, you can try out any of the major versions included on the used MathType plugin for the specific demo, so it gets easier to maintain fewer demos on the project.
