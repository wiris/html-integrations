# 001. Generate RFC compliant UUIDs for Telemetry

Date: 22-jun-2020

## Status

PROPOSED  

## Summary

*When sending Telemetry data*  
*a session & user uuids are used.*
*We need to generate RFC consistent uuids.*
*Using a thid-party library*
*will ensure consistency and will avoid colissions.*
*It becomes the first dependency to the MathType devkit sdk package, though.*

## Context (Discussion)

> The issue motivating this decision, and any context that influences or constrains the decision.

> What is the issue that we're seeing that is motivating this decision or change?
 
> Explains the forces at play (technical, political, social, project).
> This is the story explaining the problem we are looking to resolve.

## Decision

> What is the change that we're proposing and/or doing?
> The change that we're proposing or have agreed to implement.
> Explains how the decision will solve the problem.


### Pros and Cons of the Options 

#### Implement our own Javascript library for that

[example | description | pointer to more information | …]

    Good, because [argument a]
    Good, because [argument b]
    Bad, because [argument c]
    …

#### Using a third party library like github.com/uuidjs/uuid

[example | description | pointer to more information | …]

    Good, because [argument a]
    Good, because [argument b]
    Bad, because [argument c]
    …

#### [option 3]

[example | description | pointer to more information | …]

    Good, because [argument a]
    Good, because [argument b]
    Bad, because [argument c]
    …


## Consequences (Results)

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.

What becomes easier or more difficult to do because of this change?

> Explains the results of the decision over the long term.
> Did it work, not work, was changed, upgraded, etc.

## Links


- [UUID JavaScript Module to generate RFC-compliant UUIDs in JavaScript ](https://github.com/uuidjs/uuid)

