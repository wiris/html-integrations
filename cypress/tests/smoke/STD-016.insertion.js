/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-016
// Title:     User edits a formula by double click and inserts it.
// Document:  https://docs.google.com/document/d/1bIZOmDigkvhMCpAcTf81nz3Wp252aZpyPol9AxY0OXY/edit
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

it('should be able to edit an existing formula', { retries: 3 }, function () {
  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-general']);

  // Double click the previous inserted formula to start editing it
  cy
    .getFormula(0)
    .dblclick();

  // Assert that the toolbar is visible so that we know the modal is fully loaded
  cy
    .get('.wrs_toolbar')
    .should('be.visible');

  // Wait for the formula clocked to be loaded
  cy.get('.wrs_container').invoke('text').should('contain', 'y'); // .children().should('have.length.at.least', 9);

  // Modify the opened formula
  cy.get('.wrs_focusElement').click().type(this.formulas['formula-addition']);
  // cy.typeInModal('{movetostart}{del}{del}{del}');

  // Click the insert button on the mathtype modal to insert the previous edited formula
  cy.clickModalButton('insert');

  // Expect the formula to be edited propertly
  cy
    .getFormula(0)
    .should('have.attr', 'alt').then((alt) => {
      expect(alt).to.equal(this.formulas['formula-total-alt-es']);
    });
});
