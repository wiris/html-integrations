const puppeteer = require('puppeteer');

const timeout = 10000;

// Declare browser and page that will contain the demo page
let browser;
let page;

describe('e2e test to check that a formula is inserted',
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
      await page.goto('http://localhost:8006/', { waitUntil: 'load', timeout: 0 });
    });

    // Execute after each test of the file to close the demo page
    afterEach(async () => {
      await browser.newPage();
      page = (await browser.pages())[0]; // eslint-disable-line prefer-destructuring
      await page.close();
    });

    it('Check formula insert', async () => {
      // const element = await page.$('#header_title_name');
      const title = await page.$eval('#header_title_name', el => el.textContent); // await page.evaluate(element => element.textContent, element);
      expect(title).toBe('Mathtype for Froala');
    });
  },
  timeout);
