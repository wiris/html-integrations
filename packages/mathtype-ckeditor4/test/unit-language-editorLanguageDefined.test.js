import * as CKEDITOR from '../node_modules/ckeditor4/ckeditor';
import { CKEditor4Integration } from '../plugin.src'

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
        config: {
          language: 'ar'
        },
        langCode: 'ar'
      };
      const ckeditorIntegrationModelProperties = { 
        editorObject,
        target: {
          tagName: '<html></html>'
        }
      };
      
      // Start the integration
      integration = await new CKEditor4Integration(ckeditorIntegrationModelProperties);
    });

    /**
     * Checks that the mathtoaccessible function returns the correct expected value with some input.
     * Define some parameters to call the function corretly.
     * Core class is expected to be initialyzed.
     */
    it('Editor language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('ar');
    });
  });
