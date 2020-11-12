// Set up the test environment
import '../setUpTests.js';
// Expose the TinyMCE instance to the window
import './windowSetUp.js';
import { TinyMceIntegration } from '../editor_plugin.src';

// Define a global integration to be assigned
let integration;

/**
 * This test is focused on checking the mathtype getLanguage function through the
 * editor language definition
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
        language: 'ar',
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
     * Retrieves the language from the TinyMCE integration.
     * In this tests the editor language is defined and is the only one
     * so it has to equal 'ar'
     */
    it('Editor language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('ar');
    });
  });
