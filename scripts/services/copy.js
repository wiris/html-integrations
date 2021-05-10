#!/usr/bin/env node
/**
 * Copies the given folder to output/ in the root of the monorepo
 * with the appropriate name for the tech it uses.
 *
 * @param string tech of the built package (php, aspx, etc.)
 * @param string folder to copy
 */

const fs = require('fs-extra');
const path = require('path');
const techs = require('./techs.json');

const copy = (tech, src) => {
  if (!Object.keys(techs).includes(tech)) {
    throw new Error(`Tech ${tech} is unknown.`);
  }

  const srcNormalized = path.normalize(src);
  const editor = path.basename(path.resolve(src).match(/mathtype-(.*)/)[1]);
  const dest = path.join(src, '..', '..', 'output', `${tech}-${editor}`);
  const filter = (folder) => ![ // List of files and folders to skip when copying
    'node_modules',
  ].includes(folder);

  return fs.remove(dest) // remove the destination folder to avoid having old files
    .then(() => fs.copy(srcNormalized, dest, { filter })) // do the copying
    .then(() => { console.log(`Copied ${path.resolve(srcNormalized)} to ${path.resolve(dest)}.`); }); // eslint-disable-line no-console
};

if (!module.parent) { // This file is being executed as a script.
  // Process args
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    throw new Error('2 parameters required: the technology to use and the location of the folder to copy.');
  }

  // Do the copying
  copy(...args)
    .catch((err) => { console.error(err); });
} else { // This file is being imported as a module.
  module.exports = copy;
}
