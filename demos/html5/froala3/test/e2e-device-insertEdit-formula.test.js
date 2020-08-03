const puppeteer = require('puppeteer');

// Declare browser and page that will contain the demo page
let browser;
let page;

describe('Check buttons click and visibility. TAG = Device',
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

    // Get the selector for the MT and CT buttons and then assert them to be defined
    test('Check MT and CT icons are visible', async () => {
      const MTButton = await page.waitForSelector('#wirisEditor-1', { visible: true });
      const CTButton = await page.waitForSelector('#wirisChemistry-1', { visible: false });
      expect(MTButton).toBeDefined();
      expect(CTButton).toBeDefined();
    });

    // Get the MT button, click it, wait for the modal window to load and expect it to be defined
    test('Click MT Button', async () => {
      const MTButton = await page.waitForSelector('#wirisEditor-1', { visible: true }); // eslint-disable-line
      await page.click('#wirisEditor-1');
      await page.waitFor(1000);
      // wait for modal window to load. We assume load is completed once hand icon is visible
      // warning: puppeteer requires the [id=] notation whenever there are escaped characters
      // eslint-disable-next-line no-useless-escape
      const HandButton = await page.waitForSelector('[id="wrs_content_container\[0\]"] > div > div.wrs_handWrapper > input[type=button]', { visible: true });
      expect(HandButton).not.toBeNull();
    });
  });
