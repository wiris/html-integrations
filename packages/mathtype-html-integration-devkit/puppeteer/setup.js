const puppeteer = require('puppeteer');
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const os = require('os');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  // // Standard browser configuration
  const browser = await puppeteer.launch();

  // DEBUGGING OPTIONS -- uncomment them and comment standard browser configuration to debug.
  // const browser = await puppeteer.launch({headless: false, 
  //   slowMo: 1000, 
  //   devtools: true
  // });


  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  global.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};