import Accessibility from '../src/accessibility';
import Core from '../src/core.src';

/**
 * This tests is focused on check the accessibility class and his unique function
 */
describe('Test the acessibility class. TAG = Accessibility',
  () => {
    /**
     * Before the execution of all the tests in this file is necessary to:
     * init the core module to initialyze properties that will be needed
     * when calling the function to be tested.
     */
    beforeAll(async () => {
      const serviceProviderProperties = {
        URI: 'https://www.wiris.net/demo/plugins/app',
        server: 'java',
      };
      const corePR = { serviceProviderProperties };
      await new Core(corePR).init();
    });

    /**
     * Checks that the mathtoaccessible function returns the correct expected value with some input.
     * Define some parameters to call the function corretly.
     * Core class is expected to be initialyzed.
     */
    it('Check 1 + 2 accessible text return', async () => {
      // Initialyze the parameters for the mathml to accesible function
      const mathml = '<math><mn>1</mn><mo>+</mo><mn>2</mn></math>';
      const language = 'en';
      const data = {};
      data.centerbaseline = 'false';
      data.metrics = 'true';
      data.mml = mathml;
      const altProp = Accessibility.mathMLToAccessible(mathml, language, data);
      expect(altProp).toBe('1 plus 2');
    });
  });
