import GenericIntegration from '../wirisplugin-generic.src';

// Define a global integration to be assigned
let integration;

/**
 * This test is focused on check the mathtype getLanguage function when
 * there is not a language definition
 */
describe('Generic: Test the language property. TAG = Language',
  () => {
    /**
     * Before the execution of the test is necessary to:
     * initialyze the integration of the Generic wiris plugin with
     * the parameters to be tested
     */
    beforeAll(async () => {
      const integrationModelProperties = { 
        target: {
          tagName: '<html></html>'
        },
      };
      
      // Start the integration
      integration = await new GenericIntegration(integrationModelProperties);
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
