const puppeteer = require('puppeteer');

// Declare browser and page that will contain the demo page
let browser;
let page;

/**
 * This section is dedicated to tests the insertion of a formula in the froala3 demo.
 * It should test the MT formula insertion and the CT formula insertion
 */
describe('Insert Formula. TAG = Insert',
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
      jest.setTimeout(10000); // Large timeouts seem to be necessary. Default timeout to 5000ms
      page = (await browser.pages())[0]; // eslint-disable-line prefer-destructuring
      await page.goto('http://localhost:8006/', { waitUntil: 'load', timeout: 0 });
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

    /**
     * This test will try to insert a formula and check that the created image exists
     */
    test('Insert Formula test', async () => {
      const MTButton = await page.waitForSelector('[aria-label="Insert a math equation - MathType"]', { visible: true }); // eslint-disable-line
      await page.click('[aria-label="Insert a math equation - MathType"]');
      await page.waitFor('[id="wrs_content_container\[0\]"] > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay'); // eslint-disable-line no-useless-escape
      await page.waitFor(1000);
      // Sometimes it detects the modal open but it's not ready to be written
      await page.type('[id="wrs_content_container\[0\]"] > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay', '1+2', { delay: 0 }); // eslint-disable-line no-useless-escape
      await page.click('[id="wrs_modal_button_accept[0]"]');
      // // iframe content is not accessible from the root dom unless it has an url
      // // TinyMCE 4 iframe url is undefined
      // // To get the image we have to get the content in another way
      const secondHtml = await page.evaluate(() => document.getElementById('editor_ifr').contentWindow.document.getElementsByClassName('text')[0].getElementsByClassName('Wirisformula')[0]);
      expect(secondHtml).not.toBeUndefined();
    });
  });
