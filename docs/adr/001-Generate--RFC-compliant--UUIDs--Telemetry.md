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

In the context of the Telemetry project, the generation of
valid and consisten UUIDs are needed to ensure the uniqueness
and its validity.

It would be unwise to write our own library to generate this
UUIDs since there are third party solutions, that supports UUIDs  for RFC4122 version 1, 3, 4, and 5.


## Decision

We'll add the library 'uuid' as the first functional dependency of the 'MathType Web Integration JavaScript SDK', known as npm package as '@wiris/mathtype-html-integration-devkit'.


### Pros and Cons of the Options 

#### Implement our own Javascript library for that

- Bad, because Javascript Math.random function is not very good. 
- Bad, because We'll need to maintain it.
- Bad, because More work to the backlog.


#### Using a third party library like github.com/uuidjs/uuid


- Good, because complies RFC
- Good, because its well maintained, no issues and widely used
- Good, because solves our problem immediately.


## Consequences (Results)

Adding a dependency to our main library means that all the packages we've done for other editors will have it as a depedency, too.

This is, all the rest of packages and all the demos, too.

We'll need to pay attention and make audits regularly to the package to avoid risks.

Github dependabot's makes this task for us.

## Links


- [UUID JavaScript Module to generate RFC-compliant UUIDs in JavaScript ](https://github.com/uuidjs/uuid)

