const puppeteer = require('puppeteer');

const timeout = 10000;

// Declare browser and page that will contain the demo page
let browser;
let page;

describe('Insert Formula',
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
  
      // Execute after each test of the file to close the demo page
      afterEach(async () => {
        await browser.newPage();
        page = (await browser.pages())[0]; // eslint-disable-line prefer-destructuring
        await page.close();
      });

    it('Insert Formula test', async () => {
      jest.setTimeout(10000); //Large timeouts seem to be necessary. Default timeout to 5000ms
        await page.click('#wirisEditor-1');
        await page.waitFor('[id="wrs_content_container\[0\]"] > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay');
        await page.type('[id="wrs_content_container\[0\]"] > div > div.wrs_formulaDisplayWrapper > div.wrs_formulaDisplay', '1+2', {delay: 0});
        await page.waitFor(1500);
        await page.click('[id="wrs_modal_button_accept[0]"]');
        await page.waitFor(1000);
        expect(await page.waitFor('body > [id="editor"] > div.fr-wrapper > div > p.text:nth-child(1) > img.Wirisformula')).toBeDefined();
    });
  },
  timeout,
);