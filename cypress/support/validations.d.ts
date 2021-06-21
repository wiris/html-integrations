/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {

        /**
         * Validate that the height of the given formula and the surrounding text is the same.
         * Must be applied to a father command.
         * @param subject the formula to apply this validation to
         * @param preview {default = false} whether to check aligment on the preview or on the text editor
         */
        isAligned(subject: Element, preview?: boolean): Chainable

        /**
         * Check that the given formula is rendered in the preview mode or the text editor area.
         * Must be applied to a father command.
         * @param subject the formula to apply this validation to
         * @param preview {default = false} whether to check aligment on the preview or on the text editor
         */
        isRendered(subject: Element, preview?: boolean): Chainable

        /**
         * Validates that Hand mode is activated.
         */
        isHandModeOn()

        /**
         * Validates that the ChemType modal is open.
         */
        isChemTypeOn()

        /**
         * Check that the text inside the modal matches the given text string.
         * @param text the text to match the modal content against
         */
        modalTextEquals(text: string)
    }
}

