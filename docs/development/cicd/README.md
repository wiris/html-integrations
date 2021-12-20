# CI/CD

<small>[MathType Web Integrations](../../../README.md) → [Documentation](../../README.md) → [Development guide](../README.md) → CI/CD</small>

This project uses [GitHub actions](https://github.com/features/actions) for the CI/CD strategy.

**Table of contents**

- [Workflows](#workflows)
- [Actions secrets](#actions-secrets)

## Workflows

### Generate and validate the JSDoc site

This job uses JSDoc library to generate a static site as an artifact called `mathtype-html-integration-devkit-docs.zip`, from the comments on the library code.

### Run Cypress tests with npm packages

Builds the packages using the source code available at npmjs and runs all available Cypress tests.

- **On schedule**: every Monday at 1AM. It sends the test data to [Cypress Dashboard][cypress-dashboard]. It can be run on any branch.

- **On demand**: a manual trigger that allows the user to send data to [Cypress Dashboard][cypress-dashboard], optionally. It only runs on `stable` branch.

## Actions secrets

Secrets are GitHub environment variables that are encrypted. Anyone with collaborator access to this repository can use these secrets for Actions.

| Name               | Description                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| GH_CICD_TOKEN      | A GitHub token to allow detecting a build vs a re-run build. [More][cypress-action]                         |
| CYPRESS_PROJECT_ID | A 6 character string unique identifier for the project.                                                     |
| CYPRESS_RECORD_KEY | Cypress record key is an authentication key that allows to send record tests data to the Dashboard Service. |

[Visit Secrets page at GitHub][secrets].

[secrets]: https://github.com/wiris/html-integrations/settings/secrets
[cypress-dashboard]: (https://cypress.io/dashboard/)
[cypress-action]: https://github.com/cypress-io/github-action
