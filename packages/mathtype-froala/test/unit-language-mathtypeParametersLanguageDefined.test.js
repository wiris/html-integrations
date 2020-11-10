// Import Jquery exposion to the window so it does not throw error in the next import
import './jquery-global.js';
import { FroalaIntegration } from '../wiris.src';

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
        opts: {
          mathTypeParameters: {
            editorParameters: { language: 'es' },
          },
        },
      };
      const froalaModelProperties = { 
        editorObject,
        target: {
          tagName: '<html></html>'
        }
      };
      
      // Start the integration
      integration = await new FroalaIntegration(froalaModelProperties);
    });

    /**
     * Retrieves the language from the integration CKEditor5 definition.
     * It has to be retrieved from editorParameters.
     */
    it('MathtypeParameters: language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
