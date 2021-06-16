/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {

        /**
         * Validate that the height of the given formula and the surrounding text is the same.
         * Must be applied on a father command.
         * @param preview {default=FALSE} Defines if we check aligment on the preview or on the text editor
         */
        isAligned(preview?: boolean)

        /**
         * Check that the given formula is rendered in the preview mode or the text editor area.
         * Must be applied on a father command.
         * @param preview {default=FALSE} Defines if we check aligment on the preview or on the text editor
         */
        isRendered(preview?: boolean)

        /**
         * Validates that the hand mode is activated.
         */
        isHandModeOn()

        /**
         * Validates that the ChemType modal is opened.
         */
        isChemTypeOn()

        /**
         * Check the text inside the modal matches the given text string.
         * @param text to math the modal content. 
         */
        modalTextEquals(text:string)
    }
}

