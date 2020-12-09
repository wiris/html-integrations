// Expose the jQuery and the Froala instances to the window
import './windowSetUp.js';
import { FroalaIntegration } from '../wiris.src';

// Define a global integration to be assigned
let integration;

/**
 * This tests is focused on check the mathtype getLanguage function when the
 * mathtypeParameters language and editor language are defined
 */
describe('Froala2: Test the language property. TAG = Language',
  () => {
    /**
     * Before the execution of the test is necessary to:
     * initialyze the integration of the Froala2 wiris plugin with
     * the parameters to be tested
     */
    beforeAll(async () => {
      const editorObject = {
        opts: {
          mathTypeParameters: {
            editorParameters: { language: 'es' },
          },
          language: 'ar',
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
     * Retrieves the language from the Froala2 integration definition.
     * It has to be retrieved from editorParameters although the editor language is defined.
     * The mathtypeParameters language definition takes advantage on the editor language
     */
    it('MathtypeParameters: language and editor language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
