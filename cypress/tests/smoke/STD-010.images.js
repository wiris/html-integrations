/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-010
// Title:     Validate the formula is the same on editing mode and on preview  .
// Document:  https://docs.google.com/document/d/1bRxBBG_OLS_1HTGdOBRbHHIRJPZHboVJ2Zy68z80fyY/edit
// Context:   UI / Images
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

it('an inserted formula should be the same on preview when this is updated', function () {
  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-general'], true);

  // // Click the update button
  // cy.get('#btn_update').click();

  // // Assert that the vertical align is -4px, which means that is aligner vertically (base) to the previous writen 2222
  // cy.getFormula(0).isRendered().and('have.attr', 'alt', this.formulas['formula-general-alt-es']);
  // cy.getFormula(1).isRendered().and('have.attr', 'alt', this.formulas['formula-general-alt-en']);
});
