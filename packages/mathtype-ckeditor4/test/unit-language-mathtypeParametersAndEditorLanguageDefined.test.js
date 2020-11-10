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
     * Retrieves the language from the integration CKEditor5 definition.
     * It has to be retrieved from editorParameters although the editor language is defined.
     * The mathtypeParameters language definition takes advantage on the editor language
     */
    it('MathtypeParameters: language and editor language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
