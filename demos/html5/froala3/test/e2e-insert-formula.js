const timeout = 5000;

describe('e2e test to check that a formula is inserted',
  () => {
    let page;
    beforeAll(async () => {
      await letstry();
      page = await global.__BROWSER__.newPage();
      await page.goto(URL, {waitUntil: 'domcontentloaded'});
      // await page.screenshot({path: 'screenshots/before.png'});
    }, timeout);

    it('Check formula insert', async () => {
      const title = await page.$eval('div.header_title', el => el.text());
      console.log(tite);
      expect(title).toBe('E2E Puppeteer Testing');
    });
  },
  timeout,
);

function letstry() {
  return new Promise(resolve => { 
    exec(`npm run start`,(error, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      resolve({ dout: stdout, derr: stderr });
    });
  });
}