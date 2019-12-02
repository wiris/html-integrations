#!/usr/bin/env node
/**
 * Replaces the default services that point to the Wiris service with local services (PHP, Java, ASPX, etc.)
 * 
 * @param string tech of the package to use (php, aspx, etc.)
 * @param string file to make the replacement in
 */

'use strict';

const fs = require('fs');
const path = require('path');

const replace = (tech, target) => {

    const techs = require('./techs.json');
    
    if (!Object.keys(techs).includes(tech)) {
        console.error(`Tech ${tech} is unknown.`);
        process.exit(1);
    }

    const techData = techs[tech];
    const targetNormalized = path.normalize(target);

    // Replacement data
    const replacements = [
        {
            from: /^([^\S\n\r]*integration(?:Model)?Properties\.serviceProviderProperties\.URI = ')(.*)(';)$/gm,
            to: `$1${techData.uri}$3`,
        },
        {
            from: /^([^\S\n\r]*integration(?:Model)?Properties\.serviceProviderProperties\.server = ')(.*)(';)$/gm,
            to: `$1${techData.server}$3`,
        },
        
    ];

    return new Promise((resolve, reject) => {
        // Read the file to replace
        fs.readFile(targetNormalized, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            // Do the replacements
            let result = data;
            for (const replacement of replacements) {
                result = result.replace(replacement.from, replacement.to);
            }
            // Save the replaced string
            fs.writeFile(targetNormalized, result, 'utf8', (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });

};

if (!module.parent) { // This file is being executed as a script.

    // Process args
    const args = process.argv.slice(2);

    if (args.length != 2) {
        console.error("2 parameters required: the technology to use and the location of the file to replace.");
        process.exit(1);
    }

    // Do the replacing
    replace(...args);

} else { // This file is being imported as a module.
    module.exports = replace;
}