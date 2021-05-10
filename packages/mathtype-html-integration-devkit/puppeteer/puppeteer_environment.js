import NodeEnvironment from 'jest-environment-node';
import { readFileSync } from 'fs';
import { join } from 'path';
import { connect } from 'puppeteer';
import { tmpdir } from 'os';

const DIR = join(tmpdir(), 'jest_puppeteer_global_setup');

class PuppeteerEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = readFileSync(join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    }

    // connect to puppeteer
    this.global.__BROWSER__ = await connect({
      browserWSEndpoint: wsEndpoint,
    });
  }

  async teardown() {
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

export default PuppeteerEnvironment;
