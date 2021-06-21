/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-028
// Title:     Validate switch between CT and MT, and viceversa
// Document:  https://docs.google.com/document/d/1PlqZUsfta5GMXXRq89oy50NTW5zBQCeUi8YBdO83Yug/edit
// Context:   E2E / Modal
// Issue:     -
// ***********************************************************
beforeEach(() => {
  // Load fixtures
  cy.fixture('formulas.json').as('formulas');

  // Visit page
  cy.visit('/');
});

it('Validate switch between CT and MT, and viceversa', () => {
  // Click the MT icon in the HTML editor toolbar.
  cy.clickButtonToOpenModal();

  // Click the CT icon in the HTML editor toolbar
  cy.clickButtonToOpenModal(true);

  // MT modal window changes to CT modal window.
  cy.get('.wrs_modal_title').eq(0).should('have.text', 'ChemType');

  // Click the MT icon in the HTML editor toolbar.
  cy.clickButtonToOpenModal();

  // CT modal window changes to MT modal window.
  cy.get('.wrs_modal_title').eq(0).should('have.text', 'MathType');
});
