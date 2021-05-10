#!/usr/bin/env node
/**
 * Replaces the default services that point to the Wiris service with local services (PHP, Java, ASPX, etc.), builds it
 * and copies the given folder to output/ in the root of the monorepo with the appropriate name for the tech it uses.
 * Then, undoes the replacement in the original folder.
 *
 * @param string file to make the replacement in
 * @param string folder to copy and build in
 * @param string tech of the built package (php, aspx, etc.)
 */

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const replace = require('./replace');
const copy = require('./copy');

// Used to run a script, in our case npm
const run = (command, options) => new Promise((resolve, reject) => {
  exec(command, options, (err, stdout, stderr) => { // eslint-disable-line no-unused-vars
    if (err) {
      reject(err);
    }
    resolve(stdout);
  });
});

// Actual logic of the compilation
const compileActual = (dev, target, src, tech) => replace(tech, target) // npm -> tech
  .then(() => run(`npm run --if-present build${dev ? '-dev' : ''}`, { cwd: src })) // build
  .then(() => { console.log(`Built package in ${path.resolve(src)}.`); }) // eslint-disable-line no-console
  .then(() => copy(tech, src)) // copy
  .then(() => replace('npm', target)); // tech -> npm

const compile = (dev, target, src, tech) => {
  const targetNormalized = path.normalize(target);
  return fs.lstat(targetNormalized)
    .then((stats) => (stats.isSymbolicLink()

      // if the source file is a symlink, we want to copy the source first in order not to change the original file
      ? fs.readlink(targetNormalized) // get the symlink's source file
        .then((targetOriginal) => fs.remove(targetNormalized) // if we don't remove the symlink first, node thinks we're trying to copy a file to itself
          .then(() => fs.copy(targetOriginal, targetNormalized)) // replace the symlink with a copy of its source
          .then(() => {
            console.log(`Copied original symlinked source file ${targetOriginal} to ${targetNormalized}.`); // eslint-disable-line no-console
          })
          .then(() => compileActual(dev, target, src, tech)) // do the actual compiling
          .then(() => fs.remove(targetNormalized)) // again, delete the copied file before recreating the symlink
          .then(() => fs.symlink(targetOriginal, targetNormalized)) // replace source back with symlink
          .then(() => {
            console.log(`Created symlink to ${targetOriginal} in ${targetNormalized}.`); // eslint-disable-line no-console
          }))

      // if it's not a symlink, just go for it
      : compileActual(dev, target, src, tech)));
};

if (!module.parent) { // This file is being executed as a script.
  // Process args
  const args = process.argv.slice(2);

  // Check if --dev flag is being used
  const devPosition = args.indexOf('--dev');
  const dev = devPosition > -1;

  if (dev) {
    args.splice(devPosition, 1);
  }

  // Check the number of arguments
  if (args.length !== 3) {
    const errorMessage = '3 parameters required: '
                     + 'the location of the file to replace, '
                     + 'the location of the folder to copy and the technology to use.';
    throw new Error(errorMessage);
  }

  // Do the replacing and copying
  compile(dev, ...args)
    .catch((err) => { console.error(err); });
} else { // This file is being imported as a module.
  module.exports = compile;
}
