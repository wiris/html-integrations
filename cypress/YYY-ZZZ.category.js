/// <reference types="cypress" />
// ***********************************************************
// Test case: {Test.ID} Ex. INT-STD-014
// Title:     {Test.Title} Ex. User creates a new formula from scratch using MathType.
// Document:  {Test.URL} Ex. https://docs.google.com/document/d/1fiGsUwqNIsjiaJI0aGfH_aNX5OJKEHkfWtfvlQkEEFI/edit
// Context:   {Test.Type} - {Text.category} Ex. UI - Formula insertion/edition
// Issue:     {Test.Issue} Ex. KB-99999
// ***********************************************************

describe('Formula insertion/edition', () => {
  beforeEach(() => {
    // Load fixture data
    cy.fixture('formulas.json').as('formulas');
    // and visit page.
    cy.visit('/');
    // Eventually, clear the editor content: by default the editor could include a mathematical expression.
    cy.getTextEditor().clear();
  });

  it('User creates a new formula from scratch using MathType', function () {
    // Open a new MathType modal window clicking the button
    cy.clickButtonToOpenModal();
    // then type a general formula inside the editor
    cy.typeInModal(this.formulas['formula-general']);
    // and insert the formula at the beginning of the target element using the 'Insert' button.
    cy.clickModalButton('insert');

    // Check the recently inserted formula
    // and validate is rendered succesfully using MathType services.
    cy.getFormula(0)
      .isRendered();
  });
});
