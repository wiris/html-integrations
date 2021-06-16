// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

function createSelection(field, start, end) {
  if( field.createTextRange ) {
      var selRange = field.createTextRange();
      selRange.collapse(true);
      selRange.moveStart('character', start);
      selRange.moveEnd('character', end);
      selRange.select();
  } else if( field.setSelectionRange ) {
      field.setSelectionRange(start, end);
  } else if( field.selectionStart ) {
      field.selectionStart = start;
      field.selectionEnd = end;
  }
  field.focus();
}

Cypress.Commands.add('clickMathType', () => {
  cy
    .get('#editorIcon')
    .click();

  cy
    // We wait for the Hand button to load before typing, as it is a good indicator of whether MathType has fully loaded.
    // This depends on the implementation of the modal and is not too desirable, but works well.
    .get('.wrs_handContainer');
});

Cypress.Commands.add('clickChemType', () => {
  cy
    .get('#chemistryIcon')
    .click();
});

Cypress.Commands.add('typeInHTMLEditor', (text) => {
  cy
    .get('[contenteditable]')
    .type(text);
});

Cypress.Commands.add('typeInMathType', (formula) => {
  cy
    .get('.wrs_focusElement')
    .type(formula);
});

Cypress.Commands.add('clickModalButton', (button) => {
  switch (button) {
    case 'insert':
      cy
        .get('.wrs_modal_button_accept')
        .click();
      break;
    case 'cancel':
      cy
        .get('.wrs_modal_button_cancel')
        .click();
      break;
    case 'confirmationClose':
      cy
        .get('#wrs_popup_accept_button')
        .click();
      break;
    case 'confirmationCancel':
      cy
        .get('#wrs_popup_cancel_button')
        .click();
      break;
    case 'xClose':
      cy
        .get('.wrs_modal_close_button')
        .click();
      break;
    case 'maximize':
      cy
        .get('.wrs_modal_maximize_button')
        .click();
      break;
    case 'stack':
      cy
        .get('.wrs_modal_stack_button')
        .click();
      break;
    case 'minimize':
      cy
        .get('.wrs_modal_minimize_button')
        .click();
      break;
    case 'hand':
      cy
        .get('.wrs_handWrapper > input')
        .click();
      break;
    default:
      throw new Error(`The button '${button}' does not exist. Check the clickModalButton documentation.`);
  }
});

Cypress.Commands.add('editMathFormula', (method = 'true', formulaId) => {
  switch (method) {
    case 'doubleClick':
      cy
        .get('.Wirisformula')
        .eq(formulaId)
        .dblclick();
      break;
    case 'button':
      // let text = document.getElementByClassName(element);
      // let selection = window.getSelection();
      // let range = document.createRange();
      // range.selectNodeContents(text);
      // selection.removeAllRanges();
      // selection.addRange(range);
      cy
        .get('.Wirisformula')
        .eq(formulaId)
        //.type('{selectAll}');
        // .select();

      // cy.get('.Wirisformula').then(($temp)=>{
      //   const txt = $temp.text()
        // cy.clickMathType();
        // cy.get('wrs_focusElement').type(`${txt}`+'{enter}')
      // });

      // cy.clickMathType();
      // cy
      //   .get('.Wirisformula')
      //   .eq(formulaId)
      // .trigger('mousedown')
      // .then(($el) => {
      //   const el = $el[0]
      //   const document = el.ownerDocument
      //   const range = document.createRange()
      //   range.selectNodeContents(el)
      //   document.getSelection().removeAllRanges(range)
      //   document.getSelection().addRange(range)
      // })
      // .trigger('mouseup')
      // cy.document().trigger('selectionchange')
      // cy.get('p').setSelection(' the fol')

      break;
    default:
      throw new Error(`Method '${method}' is not recognizable`);
  }
});

Cypress.Commands.add('doubleClick', { prevSubject: 'optional' }, (subject) => {});
