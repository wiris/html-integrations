# 002. Longevity of senderId and sessionId in Telemetry

Date: 2020-06-26

## Status

ACCEPTED  

## Summary

*When sending Telemetry data*
*session & sender ids are used.*
*The Telemetry documentation does not specify the longevity of these ids.*
*We have decided to extend the sender id to last between page loads*
*and the session id to last exactly one page load.*

## Context (Discussion)

Reading the Telemetry documentation proposed by the Data Science team, we have
encountered that the sender and session ids are not concretely defined for each
product.

In the case of MathType web, there could be various interpretations, e.g.

- senderId: changes on page load.
- sessionId: changes on opening MathType.


## Decision

We asked the Data Science team and finally settled on the following interpretation:

- senderId: ideally lasts for ever. In practice, should at least last in a same web session, across page loads.
- sessionId: changes on page load.


### Pros and Cons of the Options

#### Change senderId on page load and sessionId on opening MathType

- Bad, because it does not truly identify individual users.

#### Keep senderId and change sessionId on page load

- Good, because it better represents individual users.
- Bad, because it's hard to keep permanent data on the client's browser.


## Consequences (Results)

We intend to use some form of local storage (e.g. cookies) to keep the assigned
senderId of each client on their computer.

This doesn't take into account e.g. using different browsers or not keeping cookies,
but it should be good enough to cover most of the cases.
