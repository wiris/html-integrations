/**
 * This class shows a dialog message overlaying a dom element in order to
 * accept / cancel discart changes. The dialog can be closed i.e the overlay dissapears
 * o canceled. In this last case a callback function should be called.
 *
 * The constructor accepts the following attributes object:
 * {
 *  overlayElement: '', Element to be overlayed.
 *  callbacks: {
 *             'closeCallback' : function(),  // Callback function to be called if the dialog is closed.
 *             'cancelCallback' : function() // Callback function to be called if the dialog is cancelled
 *  strings: {
 *          'submitString' : '', // Submit button string
 *          'cancelString : ''.  // Cancel button string
 *          'message': ''        // Message string
 *          }
 * }
 * @param {object} popupProperties
 */
class PopUpMessage {

    constructor(popupProperties) {
        this.overlay = popupProperties.overlayElement;
        this.callbacks = popupProperties.callbacks;
        this.overlayEnvolture = this.overlay.appendChild(document.createElement("div"));
        this.overlayEnvolture.setAttribute("class", "wrs_popupmessage_overlay_envolture");

        this.message = this.overlayEnvolture.appendChild(document.createElement("div"));
        this.message.id = "wrs_popupmessage"
        this.message.setAttribute("class", "wrs_popupmessage_panel");
        this.message.innerHTML = popupProperties.strings.message;

        var overlay = this.overlayEnvolture.appendChild(document.createElement("div"));
        overlay.setAttribute("class", "wrs_popupmessage_overlay");
        // We create a overlay that close popup message on click in there
        overlay.addEventListener("click", this.cancelAction.bind(this));

        this.buttonArea = this.message.appendChild(document.createElement('div'));
        this.buttonArea.setAttribute("class", "wrs_popupmessage_button_area");
        this.buttonArea.id = 'wrs_popup_button_area';

        // Buttons creation
        var buttonSubmitArguments = {
            class: "wrs_button_accept",
            innerHTML: popupProperties.strings.submitString,
            id: 'wrs_popup_accept_button'
        };
        this.acceptButton = this.createButton(buttonSubmitArguments, this.closeAction.bind(this));
        this.buttonArea.appendChild(this.acceptButton);

        var buttonCancelArguments = {
            class: "wrs_button_cancel",
            innerHTML: popupProperties.strings.cancelString,
            id: 'wrs_popup_cancel_button'
        };
        this.cancelButton = this.createButton(buttonCancelArguments, this.cancelAction.bind(this));
        this.buttonArea.appendChild(this.cancelButton);

        // "Esc" key cancels the PopupMessage.
        document.addEventListener('keydown',function(e) {
            if (e.key !== undefined && e.repeat === false) {
                if (e.key == "Escape" || e.key === 'Esc') {
                    this.cancelAction();
                }
            }
        }.bind(this));
    }

    /**
     * This method create a button with arguments and return button dom object
     * @param {object} parameters An object containg id, class and innerHTML button text.
     * @param {object} callback Callback method to call on click event.
     */
    createButton(parameters, callback) {
        function popUpButton(parameters) {
            this.element = document.createElement("button");
            this.element.setAttribute("id", parameters.id);
            this.element.setAttribute("class", parameters.class);
            this.element.innerHTML = parameters.innerHTML;
            this.element.addEventListener("click", callback);
        }

        popUpButton.prototype.getElement = function() {
            return this.element;
        }

        return new popUpButton(parameters).getElement();
    }

    /**
     * This method show the popupmessage containing a message, and two buttons
     * to cancel the action or close the modal dialog.
     */
    show() {
        if (this.overlayEnvolture.style.display != 'block') {
            // Clear focus with blur for prevent press anykey
            document.activeElement.blur();

            // For works with Safari
            window.focus();
            this.overlayEnvolture.style.display = 'block';
        }
        else {
            this.overlayEnvolture.style.display = 'none';
            _wrs_modalWindow.focus();
        }
    }

    /**
     * This method cancel the popupMessage: the dialog dissapears revealing the overlaid element.
     * A callback method is called (if defined). For example a method to focus the overlaid element.
     */
    cancelAction() {
        this.overlayEnvolture.style.display = 'none';
        if (typeof this.callbacks.cancelCallback !== 'undefined') {
            this.callbacks.cancelCallback();
        }
    }

    /**
     * This method closes the popupMessage: the dialog dissapears and the close callback is called.
     * For example to close the overlaid element.
     */
    closeAction() {
        this.cancelAction();
        if (typeof this.callbacks.closeCallback !== 'undefined') {
            this.callbacks.closeCallback();
        }
    }
}