/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-007
// Title:     Validate wiris formulas contain alt attribute.
// Document:  https://docs.google.com/document/d/1Sa83zG7-sRpS1WIPQNTLtaeUFrwqZVSpdTbrtnkZHVI/edit
// Context:   UI / Image
// Issue:     KB-13069
// ***********************************************************
beforeEach(() => {
  // Load fixture data
  cy.fixture('formulas.json').as('formulas');

  // Visit the page.
  cy.visit('/');

  // Clear the editor content in order to reduce noise
  cy.getTextEditor().clear();
});

it('A wiris formula should have the alt attribute', function () {
  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-general']);

  // Get the previous inserted formula
  cy.getFormula(0).should('have.attr', 'alt');
});
