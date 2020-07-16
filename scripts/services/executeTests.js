const path = require('path');
const { emitWarning } = require('process');
const { exec } = require('child_process');
const process = require('process');

/**
 * Install all the dependencies of the entire project
 * to be able to execute tests later.
 */
const installDeps = route => new Promise((resolve, reject) => {
  exec(`npm install --prefix ${path.normalize(route)}`, (err, stdout, stderr) => {
    if (err) {
      reject(err);
    }
    resolve({ dout: stdout, derr: stderr });
  });
});

/**
 * Executes all the tests of the project in paralel.
 */
const runTests = route => new Promise((resolve, reject) => {
  // html-integration-devkit
  exec(`jest --config=${route}jest.config.js ${route}`, (err, stdout, stderr) => {
    if (err) {
      reject(err);
    }
    resolve({ dout: stdout, derr: stderr });
  });
});

/**
 * Executes the tests and the install for the devkit package.
 * The run in sequence as the install must be done before executing the tests.
 */
const devkit = route => Promise.resolve(
  installDeps(route).then((installOut) => {
    console.log(installOut);  //eslint-disable-line
    runTests(route).then((testsOut) => {
    console.log(testsOut);  //eslint-disable-line
    });
  }),
);

/**
 * Execute all the tests and installs of the project.
 */
const executeTests = () => new Promise((resolve) => {
  const paths = require('./paths.json'); // eslint-disable-line global-require
  resolve(
    Promise.all([
      devkit(paths.devkit),
    ]),
  );
});

// This file is being executed as a script.
if (!module.parent) {
  // Process args
  const args = process.argv.slice(2);

  // Log a warning if there are more than 0 arguments
  if (args.length > 0) {
    emitWarning('No parameters needed, all the additional parameters will be ignored.');
  }

  // Execute all the tests and resolve when finished
  executeTests();
} else { // This file is being imported as a module.
  module.exports = runTests;
}
