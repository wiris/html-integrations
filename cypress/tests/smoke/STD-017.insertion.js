/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-017
// Title:     User edits a formula and cancels the edition.
// Document:  https://docs.google.com/document/d/1CqlEq9p0oVrRhpXjaguehtA4LBl9157qSZ_vg0pdswM/edit
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

it('should be able to edit and existing formula and cancel the edition', function () {
  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-general']);

  // Double click the previous inserted formula to start editing it
  cy
    .getFormula(0)
    .dblclick();

  // Edit the opened formula by adding some other content (=y)
  cy.typeInModal(this.formulas['formula-addition']);

  // Click the cancel button after editing the formula on the mathtype modal
  cy.clickModalButton('cancel');

  // CLick the close button on the confirmation close mathtype modal the cancel all changes and close it
  cy.clickModalButton('confirmationClose');

  // Assert the formula has no changes
  cy
    .getFormula(0)
    .should('have.attr', 'alt').then((alt) => {
      expect(alt).to.equal(this.formulas['formula-general-alt-es']);
    });

  // Verify the formula is propertly rendered
  cy
    .getFormula(0)
    .isRendered();
});
