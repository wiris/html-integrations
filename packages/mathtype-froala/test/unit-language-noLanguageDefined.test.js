// Expose the jQuery and the Froala instances to the window
import './windowSetUp.js';
import { FroalaIntegration } from '../wiris.src';

// Define a global integration to be assigned
let integration;

/**
 * This tests is focused on check the mathtype getLanguage function when
 * there is not a language definition
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
     * Retrieves the language from the browser if
     * there's not a language definition on the editor
     */
    it('No language defined', async () => {
      const lang = await integration.getLanguage();
      const browserLang = await integration.getBrowserLanguage();
      expect(lang).toEqual(browserLang);
    });
  });
