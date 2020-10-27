const puppeteer = require('puppeteer');

// Declare browser and page that will contain the demo page
let browser;
let page;

/**
 * The objective is to check that the demo loads correctly the buttons to insert MT and CT formula.
 * It also checks that they can be clicked once created.
 */
describe('Check The language object. TAG = language',
  () => {
    // Execute before all the file tests to define the browser with puppeteer
    beforeAll(async () => {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
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
      jest.setTimeout(10000);
      page = (await browser.pages())[0]; // eslint-disable-line prefer-destructuring
      await page.goto('http://localhost:8002/', { waitUntil: 'load', timeout: 0 });
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

    // Get the selector for the MT and CT buttons and then assert them to be defined
    test('Check no defining language works', async () => {
      await page.waitForSelector('.ck-toolbar__items > button:nth-child(0n+3', { visible: true });
      await page.click('.ck-toolbar__items > button:nth-child(0n+3');
      await page.waitForTimeout(1000);
      // eslint-disable-next-line no-useless-escape
      const cancelButton = await page.$eval('[id="wrs_modal_button_cancel\[0\]"]', (el) => el.textContent);
      expect(cancelButton).toBe('Cancel');
    });
  });
