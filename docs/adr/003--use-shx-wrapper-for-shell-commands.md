# 003. Use shx as a wrapper for shell commands

Date: 17-may-2021

## Status

ACCEPTED

## Summary

_When writing custom scripts in the node project_  
_that perform common tasks like file manipulation (deleting, moving ...)_  
_we want to ensure cross-platform compatibility_  
_while keeping a simple syntax and reducing vulnerability issues._  
_We decided to use [shx][shx-url] package_  
_as a wrapper around ShellJS Unix commands in all scripts of the project._

## Context (Discussion)

When writing custom scripts in the package.json files, one must take into account that those commands
should be compatible with both sh and CMD.exe. So, it is common to use third-party npm packages that
act as an API to mimic these tasks in both environments.

One of the most common tasks we do in these scripts is file manipulation (deleting, copying, moving).

### Pros and Cons of the Options:

#### Difference Between ShellJS and shx

**ShellJS:**

Good for writing long scripts, all in JS, running via NodeJS (e.g. node myScript.js).

**shx:**

Good for writing one-off commands in npm package scripts (e.g. "clean": "shx rm -rf out/").

## Decision

It is proposed to use [shx][shx-url], a wrapper for sh commands that works on Windows too, and behaves as the corresponding sh commands.

It has more than 150K downloads per week, is well-maintaned by the community and it occupies less space than our current past alternatives: rimfaf and copyfiles.

## Consequences

Using only one library introduces homogeneity and makes development easier.

The main drawback could be overhead: shx contains a lot more functionality than we need by the moment.

We've also added a new root-level thid-party dependency that will need to be maintained in order to reduce vulnerability risks.

## Links

- [shx][shx-url]

[shx-url]: https://www.npmjs.com/package/shx
