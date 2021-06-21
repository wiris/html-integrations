/// <reference types="cypress" />
// ***********************************************************
// Test case: INT-STD-003
// Title:     Validate caret is placed after the inserted formula
// Document:  https://docs.google.com/document/d/1YjSGL5yfvdMQOrFrqL48tQ2vUgfxD6YNSUgqsH65xI8/edit
// Context:   UI / Insertion
// Issue:     -
// ***********************************************************
beforeEach(() => {
  // Load fixture data
  cy.fixture('formulas.json').as('formulas');

  // Visit the page.
  cy.visit('/');

  // Clear the editor content in order to reduce noise
  cy.getTextEditor().clear();
});

it('Validate Hand formulas open Hand directly when edited', function () {
  // Insert a new MathType formula from scratch on the editor
  cy.insertFormulaFromScratch(this.formulas['formula-general']);

  // User types the string ‘wiris’ on the HTML editor
  cy.typeInTextEditor('wiris');

  // The string wiris is written right after the formula
  cy.getTextEditor()
    .children()
    .first() // First paragraph
    .then(($p) => {
      // Get the second node inside the paragraph
      cy.wrap($p[0].childNodes[1].textContent);
    })
    .should('eq', 'wiris');
});
