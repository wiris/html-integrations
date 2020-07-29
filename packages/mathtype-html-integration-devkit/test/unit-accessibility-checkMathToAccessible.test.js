import Accessibility from "../src/accessibility";
import Core from '../src/core.src';

describe('e2e test to check that a formula is inserted',
  () => {
    // Call the core module to initialyze properties that will be needed when creating the accessible text
    beforeAll(async () => {
      const serviceProviderProperties = {
        URI: 'https://www.wiris.net/demo/plugins/app',
        server: 'java'
      }
      const corePR = {serviceProviderProperties};
      await new Core(corePR).init();
  });

    // Checks that the mathtoaccessible function returns the correct expected value
    it('Check 1 + 2 accessible text return', async () => {
      // Initialyze the parameters for the mathml to accesible function
      const mathml = '<math><mn>1</mn><mo>+</mo><mn>2</mn></math>';
      const language = 'en';
      let data = {};
      data.centerbaseline = "false";
      data.metrics = "true";
      data.mml = mathml;
      const altProp = Accessibility.mathMLToAccessible(mathml, language, data);
      expect(altProp).toBe('1 plus 2');
    });
  });
