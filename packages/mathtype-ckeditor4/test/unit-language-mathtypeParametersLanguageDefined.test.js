// Import the CKEDITOR 4 instance to use it un the construction of the instance
import * as CKEDITOR from '../node_modules/ckeditor4/ckeditor';
import { CKEditor4Integration } from '../plugin.src'

// Define a global integration to be assigned
let integration;

/**
 * This tests is focused on check the mathtype getLanguage function 
 * through the mathtypeParameters
 */
describe('CKEditor4: Test the language property. TAG = Language',
  () => {
    /**
     * Before the execution of the test is necessary to:
     * initialyze the integration of the CKEditor4 wiris plugin with
     * the parameters to be tested
     */
    beforeAll(async () => {
      const editorObject = {
        config: {
          mathTypeParameters: {
            editorParameters: { language: 'es' },
          },
        },
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
     * Retrieves the language from the CKEditor4 integration definition.
     * It has to be retrieved from editorParameters.
     */
    it('MathtypeParameters: language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
