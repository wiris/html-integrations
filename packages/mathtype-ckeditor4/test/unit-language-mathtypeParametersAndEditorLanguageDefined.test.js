// Import the CKEDITOR 4 instance to use it un the construction of the instance
import * as CKEDITOR from '../node_modules/ckeditor4/ckeditor';
import { CKEditor4Integration } from '../plugin.src'

// Define a global integration to be assigned
let integration;

/**
 * This tests is focused on check the mathtype getLanguage function when the
 * mathtypeParameters language and editor language are defined
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
          language: 'ar',
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
     * It has to be retrieved from editorParameters although the editor language is defined.
     * The mathtypeParameters language definition takes advantage on the editor language
     */
    it('MathtypeParameters: language and editor language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
