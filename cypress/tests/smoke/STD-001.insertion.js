/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-001
// Title:     Validate alignment of a formula after insertion.
// Document:  https://docs.google.com/document/d/1RTZlelOssfwWAqx-ilTvRatrEQoaFIpk6ErWa7xMwIw/edit
// Context:   UI / Insertion
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

it('an inserted formula that looks like plain text should be aligned with the same plain text', function () {
  // Type the text plane on the text editor
  cy.typeInTextEditor(this.formulas['text-alignment']);

  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-alignment']);

  // Assert that the vertical align is -4px, which means that is aligner vertically (base) to the previous writen 2222
  cy.getFormula(0).should('have.attr', 'style').and('contain', 'vertical-align: -4px');
});
