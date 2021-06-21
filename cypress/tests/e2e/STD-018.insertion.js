/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-018
// Title:     User writes a latex formula and visualizes it on preview.
// Document:  https://docs.google.com/document/d/1fiGsUwqNIsjiaJI0aGfH_aNX5OJKEHkfWtfvlQkEEFI/edit
// Context:   E2E / Insertion
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

it('an inserted latex formula should be rendered on preview', function () {
  // Type the formula that matxes the previous inserted text on the mathtype modal
  cy.typeInTextEditor(this.formulas['latex-general']);

  // // Click the update button
  // cy.get('#btn_update').click();

  // // Assert that the vertical align is -4px, which means that is aligner vertically (base) to the previous writen 2222
  // cy.getFormula(0).isRendered().and('have.attr', 'alt', this.formulas['latex-general-alt-en']);
});
