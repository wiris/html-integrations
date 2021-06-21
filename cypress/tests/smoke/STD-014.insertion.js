/// <reference types="cypress" />

beforeEach(() => {
  // Load fixtures
  cy.fixture('formulas.json').as('formulas');

  // Visit page
  cy.visit('/');

  // Clear the editor content in order to reduce noise
  cy.getTextEditor().clear();
});

it('User creates a new formula from scratch using MT', function () {
  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-general']);

  // MT editor modal window is closed.
  cy.get('.wrs_modal_dialogContainer')
    .should('not.to.be.visible');

  // The formula is inserted at the beginning of the HTML editor content and perfectly rendered
  cy.getFormula(0)
    .isRendered();
});
