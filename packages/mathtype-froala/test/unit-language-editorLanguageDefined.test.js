// Expose the jQuery and the Froala instances to the window
import './windowSetUp.js';
import { FroalaIntegration } from '../wiris.src';

// Define a global integration to be assigned
let integration;

/**
 * This test is focused on checking the mathtype getLanguage function through the
 * editor language definition
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
          language: 'ar'
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
     * Retrieves the language from the Froala2 integration.
     * In this tests the editor language is defined and is the only one
     * so it has to equal 'ar'
     */
    it('Editor language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('ar');
    });
  });
