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

const {exec} = require('child_process');
const replace = require('./replace');
const copy = require('./copy');

// Used to run a script, in our case npm
const run = (command, options) => new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, stderr) => {
        if (err) {
            reject(err);
        }
        resolve(stdout);
    });
});

const compile = (target, src, tech) =>
    replace(tech, target) // npm -> tech
        .then(() => run('npm run build', {cwd: src})) // build
        .then(() => { console.log(`Built package in ${path.resolve(src)}.`); })
        .then(() => copy(tech, src)) // copy
        .then(() => replace('npm', target)) // tech -> npm
        .catch((reason) => { console.error(reason); });

if (!module.parent) { // This file is being executed as a script.

    // Process args
    const args = process.argv.slice(2);

    if (args.length != 3) {
        throw new Error("3 parameters required: the location of the file to replace, the location of the folder to copy and the technology to use.");
    }

    // Do the replacing and copying
    compile(...args);

} else { // This file is being imported as a module.
    module.exports = compile;
}