const path = require('path');
const { emitWarning } = require('process');
const { exec } = require('child_process');
const process = require('process');

/**
 * Executes all the tests of the project in paralel.
 */
const runTests = () => new Promise((resolve, reject) => {
  // html-integration-devkit
  const src = './packages/mathtype-html-integration-devkit/';
  const srcNormalized = path.normalize(src);
  process.chdir(srcNormalized); // Go to the srcNormalized dir
  // exec('npm install', (error, stdout, stderr) => {
  //   console.log('stdout: ' + stdout);  // eslint-disable-line
  //   console.log('stderr: ' + stderr);  // eslint-disable-line
  //   if (error !== null) {
  //     console.log('exec error: ' + error); // eslint-disable-line
  //   }
  // });
  exec('jest', (err, stdout, stderr) => {
    if (err) {
      reject(err);
    }
    resolve(stderr);
  });
});

if (!module.parent) { // This file is being executed as a script.
  // Process args
  const args = process.argv.slice(2);

  // Log a warning if there are more than 0 arguments
  if (args.length > 0) {
    emitWarning('No parameters needed, all the additional parameters will be ignored.');
  }

  runTests().then((data) => {
    console.log(data);  //eslint-disable-line
  });
} else { // This file is being imported as a module.
  module.exports = runTests;
}
