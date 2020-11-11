import './jquery-global.js';
import { FroalaIntegration } from '../wiris.src'

let integration;

/**
 * This tests is focused on check the mathtype language definition through the mathtypeParameters
 */
describe('Test the language property. TAG = Language',
  () => {
    /**
     * Before the execution of all the tests in this file is necessary to:
     * initialyze the integration of the CKEditor5 wiris plugin with
     * the parameters to be tested
     */
    beforeAll(async () => {
      const editorObject = {
        opts: {  },
      };
      const IntegrationModelProperties = { 
        editorObject,
        target: {
          tagName: '<html></html>'
        }
      };
      
      // Start the integration
      integration = await new FroalaIntegration(IntegrationModelProperties);
    });

    /**
     * Checks that the mathtoaccessible function returns the correct expected value with some input.
     * Define some parameters to call the function corretly.
     * Core class is expected to be initialyzed.
     */
    it('No language defined', async () => {
      const lang = await integration.getLanguage();
      const browserLang = await integration.getBrowserLanguage();
      expect(lang).toEqual(browserLang);
    });
  });
