const path = require('path');
const { emitWarning } = require('process');
const { exec } = require('child_process');
const process = require('process');
const waitForLocalhost = require('wait-for-localhost');

/**
 * Install all the dependencies of the specified folder in the route parameter
 * to be able to execute its tests later.
 */
const installDeps = (route) => new Promise((resolve, reject) => {
  if (route.path.includes('html5/ckeditor5')) {
    exec(
      `cd ${path.normalize(
        route.path,
      )} && npm uninstall --save @wiris/mathtype-ckeditor5 && rm -rf node_modules && rm -rf package-lock.json && npm install`,
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }
        resolve({ dout: stdout, derr: stderr });
      },
    );
  } else {
    exec(
      `npm install --prefix ${path.normalize(route.path)}`,
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }
        resolve({ dout: stdout, derr: stderr });
      },
    );
  }
});

/**
 * This function is dedicated to open a server. First, install dependencies and then open the server
 * Doing that 'cd' command just applies on the exec function, not on the project,
 * so we will not change folder but execute the command un that folder
 */
async function openServer(route) {
  const installOut = await installDeps(route);
  if (route.demo) {
    // Instructuions that will open the current demo server and wait until ready
    exec(`cd ${path.normalize(route.path)} && npm run serve`);
    await waitForLocalhost({ port: route.port });
    return installOut;
  }
  return installOut;
}

/**
 * Executes all the tests of the route folder.
 */
const runTests = (route) => new Promise((resolve, reject) => {
  exec(
    `jest --config=${path.normalize(
      route.path,
    )}jest.config.js ${path.normalize(route.path)}`,
    (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      resolve({ stderr });
    },
  );
});

/**
 * Close server
 */
const closeServer = (route) => new Promise((resolve, reject) => {
  exec(`fuser -k ${route.port}/tcp`, (err, stdout, stderr) => {
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
const sequenceExecution = (route) => Promise.resolve(
  openServer(route).then((installOut) => {
      console.log(installOut); //eslint-disable-line
    runTests(route).then((testsOut) => {
        console.log(testsOut); //eslint-disable-line
      if (route.demo) closeServer(route);
    });
  }),
);

/**
 * Execute all the tests and installs of the project.
 */
const executeTests = () => new Promise((resolve) => {
  // require the folder that contains the paths
  const testFolders = require('./paths.json'); // eslint-disable-line global-require

  // Save all the routes in a object to run the test execution in one line
    const pathsRoutes = Object.values(testFolders); //eslint-disable-line

  resolve(
    Promise.all(
      //   pathsRoutes.map(async (route) => { sequenceExecution(route); }),  // Run all the tests
      [
        // Run the tests by package
        sequenceExecution(testFolders.devkit),
        // sequenceExecution(testFolders.html5Froala3),
        // sequenceExecution(testFolders.html5CKEditor5),
        // sequenceExecution(testFolders.html5CKEditor4),
        // sequenceExecution(testFolders.html5Generic),
        // sequenceExecution(testFolders.html5Froala2),
        // sequenceExecution(testFolders.html5TinyMCE4),
        // sequenceExecution(testFolders.html5TinyMCE5)
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
    emitWarning(
      'No parameters needed, all the additional parameters will be ignored.',
    );
  }

  // Execute all the tests and resolve when finished
  executeTests();
} else {
  // This file is being imported as a module.
  module.exports = executeTests;
}
