#!/usr/bin/env node
/**
 * Replaces the default services that point to the Wiris service
 * with local services (PHP, Java, ASPX, etc.)
 *
 * @param string tech of the package to use (php, aspx, etc.)
 * @param string file to make the replacement in
 */

const fs = require('fs-extra');
const path = require('path');
const techs = require('./techs.json');

const replace = (tech, target) => {
  if (!Object.keys(techs).includes(tech)) {
    throw new Error(`Tech ${tech} is unknown.`);
  }

  const techData = techs[tech];
  const targetNormalized = path.normalize(target);

  // In CKEditor 5 for PHP and ASPX, the integration path is plugins/wiris/integration
  if (path.resolve(targetNormalized).includes('ckeditor5') && ['php', 'aspx'].includes(tech)) {
    techData.uri = `plugins/wiris/${techData.uri}`;
  }

  // Replacement data
  const replacements = [
    {
      from: /^([^\S\n\r]*(?:froalaI|ckeditorI|i)ntegration(?:Model)?Properties\.serviceProviderProperties\.URI = ')(.*)(';)$/gm,
      to: `$1${techData.uri}$3`,
    },
    {
      from: /^([^\S\n\r]*(?:froalaI|ckeditorI|i)ntegration(?:Model)?Properties\.serviceProviderProperties\.server = ')(.*)(';)$/gm,
      to: `$1${techData.server}$3`,
    },
  ];

  // Used to reduce a list of replacements applying them to a string
  const reducer = (contents, replacement) => contents.replace(replacement.from, replacement.to);

  return fs.readFile(targetNormalized, 'utf8') // take the file's contents
    .then((data) => replacements.reduce(reducer, data)) // apply the replacements to the contents
    .then((result) => fs.writeFile(targetNormalized, result, 'utf8')) // save the result to the file
    .then(() => { console.log(`Replaced variables in ${path.resolve(targetNormalized)}.`); }); // eslint-disable-line no-console
};

if (!module.parent) { // This file is being executed as a script.
  // Process args
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    throw new Error('2 parameters required: the technology to use and the location of the file to replace.');
  }

  // Do the replacing
  replace(...args)
    .catch((err) => { console.error(err); });
} else { // This file is being imported as a module.
  module.exports = replace;
}
