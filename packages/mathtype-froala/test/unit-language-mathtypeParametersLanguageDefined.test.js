// Expose the jQuery and the Froala instances to the window
import './windowSetUp.js';
import { FroalaIntegration } from '../wiris.src';

// Define a global integration to be assigned
let integration;

/**
 * TThis tests is focused on check the mathtype getLanguage function 
 * through the mathtypeParameters
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
     * It has to be retrieved from editorParameters.
     */
    it('MathtypeParameters: language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
