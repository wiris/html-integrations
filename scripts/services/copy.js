#!/usr/bin/env node
/**
 * Copies the given folder to output/ in the root of the monorepo with the appropriate name for the tech it uses.
 * 
 * @param string tech of the built package (php, aspx, etc.)
 * @param string folder to copy
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');

const copy = (tech, src) => {

    const techs = require('./techs.json');

    if (!Object.keys(techs).includes(tech)) {
        console.error(`Tech ${tech} is unknown.`);
        process.exit(1);
    }

    const srcNormalized = path.normalize(src);
    const editor = path.basename(path.resolve(src).match(/mathtype-(.*)/)[1]);
    const dest = path.join(src, '..', '..', 'output', tech + '-' + editor);

    return new Promise((resolve, reject) => {
        fs.copy(srcNormalized, dest, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });

};

if (!module.parent) { // This file is being executed as a script.

    // Process args
    const args = process.argv.slice(2);

    if (args.length != 2) {
        console.error("2 parameters required: the technology to use and the location of the folder to copy.");
        process.exit(1);
    }

    // Do the copying
    copy(...args);

} else { // This file is being imported as a module.
    module.exports = copy;
}