/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {

        /**
         * Yield the text editor.
         */
        getTextEditor()

        /**
         * Click the MathType or ChemType button in the text editor.
         * @param chem {default = false} whether to click the MathType or ChemType button.
         */
        clickButtonToOpenModal(chem?: boolean)

        /**
         * Append the given string in the text editor at the given offset.
         * @param text string to append in the editor
         * @param offset position of the caret when typing. At the end if omitted. Not yet implemented
         */
        typeInTextEditor(text: string, offset?: number)

        /**
         * Append the given text in MathType.
         * @param formula formula to append in the editor
         * @param paste whether the text appended is typed or pasted. Not yet implemented
         */
        typeInModal(formula: string, paste?: boolean)

        /**
         * Click the specified button on the MathType modal dialog
         * @param {string} button Button identifier. Values can be:
         *     - insert: inserts a formula
         *     - cancel: closes the modal. If there are changes, opens a confirmation dialog
         *     - confirmationClose: discards the changes when closing the modal dialog
         *     - confirmationCancel: cancels the confirmation dialog and returns to editing the formula
         *     - xClose: closes the modal through the top right x button
         *     - maximize: makes the modal full screen through the top right button
         *     - stack: changes the modal to not be full screen through the top right button
         *     - minimize: hides the modal, if visible, and shows it again, if not visible, through the top right button
         *     - hand: opens/closes Hand mode
         */
        clickModalButton(button: string)

        /**
         * Insert a formula from scratch
         * @param formula formula to append in the editor
         * @param chem {default = false} whether to click the MathType or ChemType button
         * @param paste {default = false} whether the text appended is typed or pasted. Not yet implemented
         */
        insertFormulaFromScratch(formula: string, chem?: boolean, paste?: boolean)

        /**
         * Obtain a formula from a given identifier.
         * @param formulaId identifier of the formula to obtain. The identifier is the 0-indexed position of the formula inside the text editor.
         * @returns the formula
         */
        getFormula(formulaId: number): Chainable

        /**
         * Select a LaTeX formula from a given identifier.
         * @param formulaId id of the formula to obtain. The id is the 0-indexed position of the formula inside the text editor.
         * @returns the formula
         */
        selectLatexFormula(formulaId: number): Chainable

        /**
         * Edit an existing MathType formula by clicking the MathType or ChemType button.
         * Must be applied to a father command unless latex is set to true.
         * @param subject the formula to apply this command to. Not yet implemented
         * @param options object with options:
         *     chem {default = false} whether to edit a chem or math formula
         *     latex {default = false} whether it is a LaTeX formula or not
         *     formulaId id of the formula to edit. Only used when latex is set to true
         *     formula string to be added when editing the formula
         */
        editFormula(subject: Element, formula: string, options?: { chem?: boolean, latex?: boolean, formulaId?: number }): Chainable | null

        /**
         * Press the ESC keyboard button
         */
        pressESCButton()

        /**
         * Not yet implemented.
         * Drag and drop the MathType or ChemType modal
         * @param coordinates place to drop the modal
         */
        dragDropModal(coordinates: {x: number, y: number})

        /**
         * Not yet implemented.
         * Drag and drop a Formula.
         * Must be applied to a father command.
         * @param subject the formula to apply this command to
         * @param coordinates place to drop the formula
         */
        dragDropFormula(subject: Element, coordinates: {x: number, y: number}): Chainable

        /**
         * Not yet implemented.
         * Draw a formula with Hand mode.
         * @param points list of ordered coordinates to draw
         */
        drawFormula(points: {x: number, y: number}[])

        /**
         * Not yet implemented.
         * Resize a given formula.
         * Must be applied to a father command.
         * @param subject the formula to apply this command to
         */
        resizeFormula(subject: Element): Chainable

    }
}

