# 007. Use Verdaccio for emulating publishing npm packages

Date: 21-dec-2021

## Status

DRAFT

## Summary

*When running the build pipeline, we want to automatically publish to npm*
*but we want to be able to simulate the publishing in a safe manner.*
*We decided to use Verdaccio*
*to simulate a local npm registry to safely publish to.*

## Context

As part of the improvement of our CI/CD infrastructure, we want to be able to publish our front-end packages to npm
automatically. The official npm registry has very strict unpublishing rules, which means that we should be careful
when publishing new versions of our npm packages.

To make sure that the pipeline publishes the correct versions and contents, we want to add a way to simulate the whole
process without actually publishing to the official registry.

## Decision

After researching the landscape of alternatives, we have finally settled for Verdaccio, as it is actively maintained
and is the most popular choice in its market.

### Pros and Cons of the Options

#### Verdaccio

A lightweight Node.js private proxy registry.

[Website][verdaccio]

- Good, because it doesn't require setting up any other software.
- Good, because it can serve as a staging platform if we want to publish from there to npm in the future.
- Bad, because the documentation is a bit poor.

#### CNPM

CNPM stands for "Company npm" and is a private npm registry software.

[Website][cnpm]

- Good, because it is oriented towards npm specifically.
- Bad, because it requires setting up a local database.
- Bad, because it is oriented to proxying in production.

#### Nexus Repository

Sonatype Nexus Repository 3 is a software and SaaS acting as a private binary repository for npm, among other systems.

[Website][nexus]

- Bad, because it is unnecessarily complex.
- Bad, because if serves as a respository for multiple package types (not only npm).

## Consequences

We will use Verdaccio for emulating the public npm registry and, possibly in the future, act as a staging ground for npm packages.

This makes automating publishing more robust as we can see the effects of publishing without actually doing it.

## Links

- [Verdaccio][verdaccio]
- [CNPM][cnpm]
- [Nexus Repository][nexus]

[verdaccio]: https://verdaccio.org/
[cnpm]: https://github.com/cnpm/cnpmjs.org
[nexus]: https://help.sonatype.com/repomanager3
