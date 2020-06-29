# 001. Generate RFC compliant UUIDs for Telemetry

Date: 22-jun-2020

## Status

ACCEPTED  

## Summary

*When sending Telemetry data*
*a session & user uuids are used.*  
*We need to generate RFC consistent uuids.*  
*Using a thid-party library*
*will ensure consistency and will avoid colissions.*  
*It becomes the first dependency to the MathType devkit sdk package, though.*

## Context (Discussion)

In the context of the Telemetry project, we want to generate
valid and consisten UUIDs since they are needed to ensure the uniqueness, randomeness and its validity.

UUID identifiers have an specification defined as the RFC-4122 standard  [A Universally Unique IDentifier (UUID) URN Namespace](https://tools.ietf.org/html/rfc4122) on ietf.org.

We don't want to reinvent the wheel and it seems unwise to write our own library to generate this UUIDs since there are third party solutions with good support, small and secure.


## Decision

We'll use [uuid package] to generate RFC4122 version 4 UUIDs to use on the Telemetry implementation. The code of the [uuid project] is available at github.

Therefore, **uuid** becomes the first functional dependency of the 'MathType Web Integration JavaScript SDK', known as npm package as '@wiris/mathtype-html-integration-devkit'.

* [uuid project](https://github.com/uuidjs/uuid)
* [uuid package](https://www.npmjs.com/package/uuid)

### Pros and Cons of the Options 

#### Implement our own Javascript library for that

- Bad, because Javascript Math.random function is not very good. 
- Bad, because we'll need to maintain it.
- Bad, because more work to the backlog.
- Bad, because we're reinventing the wheel.


#### Using a third party library like github.com/uuidjs/uuid


- Good, because supports RFC4122 version 1, 3, 4, and 5 UUIDs.
- Good, because its well maintained, no issues and widely used; (26.085.977 downloads/week).
- Good, because solves our problem immediately.
- Good, because it's secure, small and cross-platform.
- Bad, because we're adding a dependency to our core library, and therefore, to all our Javascript plugins.


## Consequences (Results)

Adding a dependency to our main library means that all the packages we've done for other editors will have it as a depedency, too.

This is, all the rest of packages and all the demos, too.

We'll need to pay attention and make audits regularly to the package to avoid risks.

Github dependabot's makes this task easier for us.