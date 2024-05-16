# Extensions for Visual Studio Code

This page provides a brief overview of the extensions available for the HTML Integrations project.

## Table of contents

Whe recommend the following extensions:

- Linters
  - [ESLint](#eslint)
  - [SonarLint](#sonarlint)
  - [Markdownlint](#markdownlint)
- Formatters
  - [Prettier](#prettier)
- Comments - Commits - Text
  - [Better Comments](#better-comments)
  - [Conventional Commits](#conventional-commits)
  - [Code Spell Checker](#code-spell-checker)
- Utilities
  - [ErrorLens](#errorlens)
  - [Console Ninja](#console-ninja)
  - [Docker](#docker)
  - [Live Share](#live-share)
  - [IntelliCode](#intellicode)
  - [Thunder Client](#thunder-client)
- GitHub
  - [GitLens](#gitlens)
  - [GitHub Actions](#github-actions)

## Linters

### ESLint

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) is a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.

We decided to use ESLint as the default linter for the project. You can find the configuration in the `.eslintrc` file. It is extended by prettier to avoid conflicts between the two tools.

### SonarLint

[SonarLint](https://marketplace.visualstudio.com/items?itemName=sonarsource.sonarlint-vscode) is an IDE extension that helps you detect and fix quality issues as you write code. Like a spell checker, SonarLint squiggles flaws so they can be fixed before committing code.

### Markdownlint

[Markdownlint](https://marketplace.visualstudio.com/items?itemName=davidanson.vscode-markdownlint) is a Visual Studio Code extension that includes a library of rules to encourage standards and consistency for Markdown files.

## Formatters

### Prettier

[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) is an opinionated code formatter. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

We decided to use Prettier as the default formatter for the project. You can find the configuration in the `.prettierrc` file.

## Comments - Commits - Text

### Better Comments

[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) will help you create more human-friendly comments in your code.

### Conventional Commits

[Conventional Commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits) is a Visual Studio Code extension that helps you write conventional commits.

### Code Spell Checker

[Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) is a Visual Studio Code extension that checks your spelling and grammar.

## Utilities

### ErrorLens

[ErrorLens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) enhances the highlighting of the language's grammar, with color highlighting for the variable under the cursor.

### Console Ninja

[Console Ninja](https://marketplace.visualstudio.com/items?itemName=wallabyjs.console-ninja) is a Visual Studio Code extension that helps you to navigate through console.log output.

This extension is useful when you have a lot of console.log statements in your code and you want to navigate through them quickly.

We recommend deactivating this extension when you are not using it, as it can slow down the editor. You can do this by clicking on the extension icon in the status bar and selecting "Disable / Pause".

### Docker

[Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) is a Visual Studio Code extension that makes it easy to build, manage, and deploy containerized applications.

### Live Share

[Live Share](https://marketplace.visualstudio.com/items?itemName=ms-vsliveshare.vsliveshare) is a Visual Studio Code extension that enables real-time collaboration between developers.

### IntelliCode

[IntelliCode](https://marketplace.visualstudio.com/items?itemName=visualstudioexptteam.vscodeintellicode) is a Visual Studio Code extension that provides AI-assisted development features.

### Thunder Client

[Thunder Client](https://marketplace.visualstudio.com/items?itemName=thundergang.thunder-client) is a REST client extension for Visual Studio Code.

## GitHub

### GitLens

[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) is a Visual Studio Code extension that helps you to visualize code authorship at a glance via Git blame annotations and code lens, seamlessly navigate and explore Git repositories, gain valuable insights via powerful comparison commands, and so much more.

### GitHub Actions

[GitHub Actions](https://marketplace.visualstudio.com/items?itemName=github.vscode-github-actions) is a Visual Studio Code extension that helps you to work with GitHub Actions.
