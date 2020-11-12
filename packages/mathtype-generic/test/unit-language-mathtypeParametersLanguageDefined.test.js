import GenericIntegration from '../wirisplugin-generic.src';

// Define a global integration to be assigned
let integration;

/**
 * This tests is focused on check the mathtype getLanguage function 
 * through the mathtypeParameters
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
        integrationParameters: {
          editorParameters: { language: 'es' }
        },
        target: {
          tagName: '<html></html>'
        },
      };
      
      // Start the integration
      integration = await new GenericIntegration(integrationModelProperties);
    });

    /**
     * Retrieves the language from the Generic integration definition.
     * It has to be retrieved from editorParameters.
     */
    it('MathtypeParameters: language defined', async () => {
      const lang = await integration.getLanguage();
      expect(lang).toBe('es');
    });
  });
