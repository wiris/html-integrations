// Expose the Froala instance to the window
import './windowSetUp.js';
import { FroalaIntegration } from '../wiris.src'

// Define a global integration to be assigned
let integration;

/**
 * This tests is focused on check the mathtype getLanguage function 
 * through the mathtypeParameters
 */
describe('Froala3: Test the language property. TAG = Language',
  () => {
    /**
     * Before the execution of the test is necessary to:
     * initialyze the integration of the Froala3 wiris plugin with
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
     * Retrieves the language from the Froala3 integration definition.
     * It has to be retrieved from editorParameters.
     */
    it('MathtypeParameters: language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
