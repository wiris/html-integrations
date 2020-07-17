const path = require('path');
const { emitWarning } = require('process');
const { exec } = require('child_process');
const process = require('process');

/**
 * Install all the dependencies of the specified folder in the route parameter
 * to be able to execute its tests later.
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
 * Executes all the tests of the route folder.
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
 * Executes the tests and the install for the folder package/demo.
 * The run in sequence as the install must be done before executing the tests.
 */
const sequenceExecution = route => Promise.resolve(
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
  // require the folder that contains the paths
  const pathsMap = require('./paths.json'); // eslint-disable-line global-require

  // Save all the routes in a object to run the test execution in one line
  const pathsRoutes = Object.values(pathsMap);  //eslint-disable-line

  resolve(
    Promise.all(
    //   pathsRoutes.map(async (route) => { sequenceExecution(route); }),  // Run all the tests
      [ // Run the tests by package
        sequenceExecution(pathsMap.devkit),
        sequenceExecution(pathsMap.html5CKEditor4),
      ],
    ),
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
  module.exports = executeTests;
}
