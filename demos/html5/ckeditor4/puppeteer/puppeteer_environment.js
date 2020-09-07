// eslint-disable-next-line import/no-extraneous-dependencies
const NodeEnvironment = require('jest-environment-node');
const config = require('./config');

class PuppeteerEnvironment extends NodeEnvironment {
  // eslint-disable-next-line
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();

    this.global.config = config;
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = PuppeteerEnvironment;
