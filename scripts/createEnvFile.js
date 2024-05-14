/**
 * Create environment.prod.ts file for the Angular + Froala demo.
 *
 * This script is run on the deploy-staging workflow in order to
 * set the Froala Key from GitHub secret on staging demo.
 */

const fs = require("fs");

const dir = "./demos/angular/froala/src/environments";
const prodFile = "environment.prod.ts";

const content = `export const environment = { production: true, froalaKey: "${process.env.FROALA_API_KEY || ""}" }`;

fs.access(dir, fs.constants.F_OK, (err) => {
  if (err) {
    // Create environments folder on angular demo If doesn't exist
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  // Create environment.prod.ts with the froalaKey.
  try {
    fs.writeFileSync(dir + "/" + prodFile, content);
  } catch (err) {
    process.exit(1);
  }
});
