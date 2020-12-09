// Set up the test environment
import '../setUpTests.js';
// Expose the TinyMCE instance to the window
import './windowSetUp.js';
import { TinyMceIntegration } from '../editor_plugin.src';

// Define a global integration to be assigned
let integration;

/**
 * This test is focused on check the mathtype getLanguage function when
 * there is not a language definition
 */
describe('TinyMCE: Test the language property. TAG = Language',
  () => {
    /**
     * Before the execution of the test is necessary to:
     * initialyze the integration of the TinyMCE wiris plugin with
     * the parameters to be tested
     */
    beforeAll(async () => {
      const editorObject = {
        settings: { },
        getParam : function(param) { return this[param]; }
      };
      const integrationModelProperties = { 
        editorObject,
        target: {
          tagName: '<html></html>'
        }
      };
      
      // Start the integration
      integration = await new TinyMceIntegration(integrationModelProperties);
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
