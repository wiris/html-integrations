const timeout = 10000;

describe('e2e test to check that a formula is inserted',
  () => {
    let page;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage(); // eslint-disable-line no-underscore-dangle
      await page.goto(URL, { waitUntil: 'domcontentloaded' });
      // await page.screenshot({path: 'screenshots/before.png'});
    }, timeout);

    it('Check formula insert', async () => {
      // const element = await page.$('#header_title_name');
      const title = await page.$eval('#header_title_name', el => el.textContent); // await page.evaluate(element => element.textContent, element);
      expect(title).toBe('Mathtype for Froala');
      await page.close();
    });
  },
  timeout);
