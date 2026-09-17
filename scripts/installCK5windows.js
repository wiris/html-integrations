const { exec, execFile } = require("child_process");
const { emitWarning } = require("process");

const pack = () =>
  new Promise((resolve, reject) => {
    exec("cd packages/mathtype-ckeditor5/ && npm pack --quiet ", (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      // eslint-disable-next-line no-console
      console.log({ dout: stdout, derr: stderr });
      resolve({ dout: stdout, derr: stderr });
    });
  });

const installMathtype = (path) =>
  new Promise((resolve, reject) => {
    execFile(
      "npm",
      ["install", `../../../packages/mathtype-ckeditor5/${path.trim()}`],
      { cwd: "demos/html/ckeditor5", shell: false },
      (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }
        // eslint-disable-next-line no-console
        console.log({ dout: stdout, derr: stderr });
        resolve({ dout: stdout, derr: stderr });
      },
    );
  });

const sequenceExecution = () =>
  Promise.resolve(
    pack().then((packOut) => {
      installMathtype(packOut.dout);
    }),
  );

// This file is being executed as a script.
if (!module.parent) {
  // Process args
  const args = process.argv.slice(2);

  // Log a warning if there are more than 0 arguments
  if (args.length > 0) {
    emitWarning("No parameters needed, all the additional parameters will be ignored.");
  }

  // Execute all the tests and resolve when finished
  sequenceExecution();
} else {
  // This file is being imported as a module.
  module.exports = sequenceExecution;
}
