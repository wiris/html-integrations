#!/usr/bin/env node
/**
 * Creates new versions of the indicated packages.
 *
 * 1. Runs npm version on the given packages and versions
 * 2. Runs npm publish on the newly versioned packages
 * 3. Creates a commit with the version update
 * 4. Tags that commit with the updated packages
 * 5. Pushes the commit and tags to origin
 *
 * @param {...string} versions pairs of the form shortPackageName=version,
 *   indicating the versions to publish.
 */

import { argv } from "node:process";
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";

// Set up the Git user identity
execSync(`git config --global user.email "cicd@wiris.com"`, {
  stdio: "inherit",
});
execSync(`git config --global user.name "wiris-ci-bot"`, { stdio: "inherit" });

// For each "shortPackageName=version" argument provided, get the
// shortPackageName, fullPackageName, and version
const data = argv
  .splice(2) // Remove node binary (argv[0]) and script file (argv[1])
  .map((arg) => arg.split("=")) // Break apart "shortPackageName=version"
  .map(([shortPackageName, version]) => {
    const data = readFileSync(`packages/${shortPackageName}/package.json`);
    const parsedData = JSON.parse(data);
    const fullPackageName = parsedData.name;
    return { shortPackageName, fullPackageName, version };
  });

// First run all the npm versions, so that if one of them fails, it can be
// easy for the developer to restore the previous state
for (const { shortPackageName, fullPackageName, version } of data) {
  console.log(`> Versioning ${fullPackageName}@${version}`);
  execSync(`yarn version --no-git-tag-version --new-version ${version}`, {
    cwd: resolve(`packages/${shortPackageName}`),
    stdio: "inherit",
  });
}

// Now publish every package and add the changes to the new commit
for (const { shortPackageName, fullPackageName, version } of data) {
  console.log(`> Publishing ${fullPackageName}@${version}`);
  const options = {
    cwd: resolve(`packages/${shortPackageName}`),
    stdio: "inherit",
  };
  execSync(`yarn publish --new-version ${version}`, options);
  execSync("git add package.json", options);
}

// git commit "Publish" followed by empty line and then list of packages published
const commitMessageList = data
  .map(({ fullPackageName, version }) => ` - ${fullPackageName}@${version}`)
  .sort()
  .join("\n");
execSync(`git commit -m "Publish

${commitMessageList}"`);
execSync("git push");

// Create and push tags of the form "fullPackageName@version"
for (const { fullPackageName, version } of data) {
  const tag = `${fullPackageName}@${version}`;
  execSync(`git tag -a ${tag} -m ${tag}`, { stdio: "inherit" });
  execSync(`git push origin ${tag}`, { stdio: "inherit" });
}
