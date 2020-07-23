// eslint-disable-next-line import/no-extraneous-dependencies
const NodeEnvironment = require('jest-environment-node');
const { exec } = require('child_process');
const waitForLocalhost = require('wait-for-localhost');
const config = require('./config');

class PuppeteerEnvironment extends NodeEnvironment {
  // eslint-disable-next-line
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();

    this.global.config = config;

    // Instructuions that will open the current demo and wait until ready
    exec('webpack-dev-server');
    await waitForLocalhost({ port: 8006 });
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
