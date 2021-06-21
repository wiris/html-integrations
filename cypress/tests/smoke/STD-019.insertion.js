/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-019
// Title:     User edits a latex formula.
// Document:  https://docs.google.com/document/d/1tkYS_g5ZZcjIiUT-nMPv4G2AGlcumw9siTY_B1bFtkE/edit
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

it('should be able to edit an existing latex formula', function () {
  // Write a latex formula on the text editor
  cy.typeInTextEditor(this.formulas['latex-general']);

  // Edit the first latex formula with mathtype
  cy.editFormula(this.formulas['latex-addition'], { chem: false, latex: true, formulaId: 0 });

  // Expect that the text editor contains the latex formula
  cy.getTextEditor().invoke('text').should('contain', '$$\\cos^2(x)+\\sin^2(x)=\\log(e)$$');
});
