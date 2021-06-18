/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {

        /**
         * Click the MathType or ChemType button in the text editor.
         * @param chem {default = false} Indicates if we click the math or chem button.
         */
        clickButtonToOpenModal(chem?: boolean)

        /**
         * Append the given text in the text editor at the given offset.
         * @param text string to append in the editor
         * @param offset position of the caret when typing. At the end if omitted
         */
        typeInTextEditor(text: string, offset?: number)

        /**
         * Append the given text in MathType.
         * @param formula formula to append in the editor
         * @param paste whether the text appended is typed or pasted
         */
        typeInModal(formula: string, paste?: boolean)

        /**
         * Clicks the specified button on the MathType Modal Dialog
         * @param {string} button Button identifier. Values can be:
         *     - insert: inserts a formula
         *     - cancel: close the modal, if there are changes, opens a confirmation dialog
         *     - confirmationClose: closes the mathtype modal and deletes the changes (button on the confirmation dialog)
         *     - confirmationCancel: cancels the confirmation dialog and returns to editing the formula
         *     - xClose: closes the modal through the top right x button
         *     - maximize: makes the modal full screen through the top right button
         *     - stack: changes the modal to not be full screen through the top right button
         *     - minimize: hides the modal, if visible, and shows it awain, if not visible, through the top right button
         *     - hand: Open/close hand mode edition
         */
        clickModalButton(button: string)

        /**
         * Obtain a formula from a given identifier.
         * @param formulaId formula identifier to open it. The number of the formula, inside the editor, e.g: the 5th formula. The identification starts with 0, meaning the first formula is the number 0.
         * @returns formula.
         */
        getFormula(formulaId: number): Chainable

        /**
         * Edit an existing MathType formula through MathType or ChemType button
         * Must be applied on a father command unless latex is set to TRUE.
         * @param subject the formula to apply this command to
         * @param options object with options:
         *     chem {default = FALSE} whether we edit a chem or math formula
         *     latex {default = FALSE} whether we want to edit a latex formula or not
         *     formulaId id of the formula to edit. Only used when latex = true
         */
        editFormula(subject: Element, options?: { chem?: boolean, latex?: boolean, formulaId?: number }): Chainable | null

        /**
         * Double ckick a formula to edit it.
         * Must be applied on a father command.
         * @param subject the formula to apply this command to
         */
        doubleClickFormula(subject: Element): Chainable

        /**
         * Press the ESC keboard button
         */
        pressESCButton()

        /**
         * Drag and Drop MathType or ChemType modal
         * @param coordinates Place to drop the modal
         */
        dragDropModal(coordinates: {x: number, y: number})

        /**
         * Drag and Drop a Formula.
         * Must be applied on a father command.
         * @param subject the formula to apply this command to
         * @param coordinates Place to drop the formula
         */
        dragDropFormula(subject: Element, coordinates: {x: number, y: number}): Chainable

        /**
         * Draw a formula with the hand mode
         * @param points Coordinates where to draw a point to create a formula
         */
        drawFormula(points: {x: number, y: number}[])

        /**
         * Resize formula.
         * Must be applied on a father command.
         * @param subject the formula to apply this command to
         */
        resizeFormula(subject: Element): Chainable

    }
}

