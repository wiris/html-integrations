// Set up the test environment
import '../setUpTests.js';
// Expose the TinyMCE instance to the window
import './windowSetUp.js';
import { TinyMceIntegration } from '../editor_plugin.src';

// Define a global integration to be assigned
let integration;

/**
 * his tests is focused on check the mathtype getLanguage function when the
 * mathtypeParameters language and editor language are defined
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
        settings: {
          mathTypeParameters: {
            editorParameters: { language: 'es' },
          },
          language: 'ar',
        },
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
     *Retrieves the language from the TinyMCE integration definition.
     * It has to be retrieved from editorParameters although the editor language is defined.
     * The mathtypeParameters language definition takes advantage on the editor language
     */
    it('MathtypeParameters: language and editor language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
