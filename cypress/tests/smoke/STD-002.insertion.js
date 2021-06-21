/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-002
// Title:     Validate alignment of a formula on preview.
// Document:  https://docs.google.com/document/d/1aAPzvAe8WEEXgZECLsmml07TG4l3Fdy3AlJiaFSp6Iw/edit
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

it('an inserted formula that looks like plain text should be aligned with the same plane text on preview', function () {
  // Type the text plane on the text editor
  cy.typeInTextEditor(this.formulas['text-alignment']);

  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-alignment']);

  // // Click the update button
  // cy.get('#btn_update').click();

  // // Assert that the vertical align is -4px, which means that is aligner vertically (base) to the previous writen 2222
  // cy.getFormula(1).should('have.attr', 'style').and('contain', 'vertical-align: -4px');
});
