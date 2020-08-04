const puppeteer = require('puppeteer');

const timeout = 10000;

// Declare browser and page that will contain the demo page
let browser;
let page;

/**
 * This test checks that the demo is loaded correctly with the expected html file
 */
describe('e2e test to check the page header. TAG = Editor',
  () => {
    // Execute before all the file tests to define the browser with puppeteer
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: false,
        timeout: 10000,
        devtools: false,
        slowMo: 0,
        defaultViewport: null,
      });
    });

    // Execute afterall the tests of the file to close the browser
    afterAll(async () => {
      browser.close();
    });

    // Execute before each test of the file to open the demo page
    beforeEach(async () => {
      page = (await browser.pages())[0]; // eslint-disable-line prefer-destructuring
      await page.goto('http://localhost:8004/', { waitUntil: 'load', timeout: 0 });
    });

    /**
     * Execute after each test of the file to close the demo page
     * to avoid boycott between different tests in the same file.
     */
    afterEach(async () => {
      await browser.newPage();
      page = (await browser.pages())[0]; // eslint-disable-line prefer-destructuring
      await page.close();
    });

    // Waits for the header page to be defined and expects the title
    it('Check formula header', async () => {
      // const element = await page.$('#header_title_name');
      const title = await page.$eval('#header_title_name', el => el.textContent); // await page.evaluate(element => element.textContent, element);
      expect(title).toBe('Mathtype for Froala');
    });
  },
  timeout);
