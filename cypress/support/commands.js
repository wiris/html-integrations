import { createSelection } from './utils';

Cypress.Commands.add('getTextEditor', () => {
  cy.get('div[contenteditable]');
});

Cypress.Commands.add('clickButtonToOpenModal', (chem = false) => {
  if (!chem) {
    cy
      .get('#editorIcon')
      .click();
  } else {
    cy
      .get('#chemistryIcon')
      .click();
  }
  cy
    // We wait for the toolbar to load before typing, as it is a good indicator of whether MathType has fully loaded.
    // This depends on the implementation of the modal and is not too desirable, but works well.
    .get('.wrs_toolbar')
    .should('be.visible');
});

Cypress.Commands.add('typeInTextEditor', (text) => {
  cy
    .getTextEditor()
    .type(text);
});

Cypress.Commands.add('typeInModal', (formula) => {
  cy
    .get('.wrs_focusElementContainer > input')
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
        .click({ force: true });
      break;
    case 'confirmationCancel':
      cy
        .get('#wrs_popup_cancel_button')
        .click({ force: true });
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

// eslint-disable-next-line no-unused-vars
Cypress.Commands.add('insertFormulaFromScratch', (formula, chem = false, paste = false) => {
  // Open the mathtype modal
  cy
    .clickButtonToOpenModal(chem);

  // Type the formula that matxes the previous inserted text on the mathtype modal
  cy
    .typeInModal(formula);

  // Insert the formula
  cy
    .clickModalButton('insert');
});

Cypress.Commands.add('getFormula', (formulaId) => {
  cy
    .get('.Wirisformula')
    .should('have.length.at.least', formulaId + 1)
    .eq(formulaId);
});

Cypress.Commands.add('selectLatexFormula', (formulaId) => {
  let block;
  let startOffset;
  let endOffset;

  // Get the block, and offsets of the latex formula
  let countFormula = 0;
  const edit = Cypress.$('#editable');
  const kids = edit[0].children;
  for (let j = 0; j < kids.length; ++j) {
    const elem = kids[j];
    const html = elem.innerHTML;
    let prevDolar = false;
    let waitEndDolar = false;
    for (let i = 0; i < html.length; i++) {
      const caracter = html[i];
      if (caracter === '$' && prevDolar === false && waitEndDolar === false) {
        prevDolar = true;
      } else if (caracter === '$' && prevDolar === true && waitEndDolar === false) {
        prevDolar = false;
        waitEndDolar = true;
        if (countFormula === formulaId) startOffset = i + 1;
      } else if (caracter === '$' && prevDolar === false && waitEndDolar === true) {
        prevDolar = true;
        if (countFormula === formulaId) endOffset = i;
        else countFormula += 1;
      } else if (caracter === '$' && prevDolar === true && waitEndDolar === true) {
        prevDolar = false;
        waitEndDolar = false;
      }
      if (startOffset && endOffset) {
        block = j;
        break;
      }
    }
    if (startOffset && endOffset) break;
  }

  // Throw error if the latex formula identifier does not correspond to a latex formula on the test
  if (!startOffset || !endOffset) {
    throw new Error(`The latex formula number '${formulaId}' does not exist`);
  }

  // Select the latex formula
  cy
    .getTextEditor().children().eq(block)
    .trigger('mousedown')
    .then(($el) => {
      createSelection($el, startOffset, endOffset);
    })
    .trigger('mouseup');
  cy
    .document()
    .trigger('selectionchange');
});

Cypress.Commands.add('editFormula', { prevSubject: 'optional' }, (subject, formula, options = {
  chem: false, latex: false, formulaId: 0,
}) => {
  // Select the latex formula and edit it
  if (options.latex) {
    cy
      .selectLatexFormula(options.formulaId);
    cy
      .clickButtonToOpenModal(options.chem);
    cy
      .typeInModal(formula);
    cy
      .clickModalButton('insert');
  } else {
    throw new Error('Not implemented yet');
  }
});

Cypress.Commands.add('pressESCButton', () => {
  cy.get('body').type('{esc}');
});
