/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-004
// Title:     Validate wiris formulas contain class with value Wirisformula.
// Document:  https://docs.google.com/document/d/1LCM0z-kmZKdwpSMnrosMsyRVmZ5Zg5TNw_-VEkYyZng/edit
// Context:   Integration / Image
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

it('formula should have wirisformula class', function () {
  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-general']);

  // Get the formula by it's alt text and assert it has the Wirisformula class
  // We could find the formula by using getFormula, but internally, that looks for
  // .Wirisformula, so it defeats the purpose. That's why we use the alt instead.
  cy.get(`img[alt="${this.formulas['formula-general-alt-es']}"]`).should('have.class', 'Wirisformula');
});
