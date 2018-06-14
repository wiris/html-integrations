// PopUpMessageClass definition.
// This class generate a modal message to show information to user.
function PopUpMessage(popupAttributes)
{
    this.overlayEnvolture = document.getElementsByClassName('wrs_modal_iframeContainer')[0].appendChild(document.createElement("DIV"));
    this.overlayEnvolture.setAttribute("class", "wrs_popupmessage_overlay_envolture");

    this.message = this.overlayEnvolture.appendChild(document.createElement("div"));
    this.message.id = "wrs_popupmessage"
    this.message.setAttribute("class", "wrs_popupmessage_panel");
    this.message.innerHTML = popupAttributes.message;

    var overlay = this.overlayEnvolture.appendChild(document.createElement("div"));
    overlay.setAttribute("class", "wrs_popupmessage_overlay");
    // We create a overlay that close popup message on click in there.
    overlay.addEventListener("click", this.close.bind(this));

    this.buttonArea = this.message.appendChild(document.createElement('div'));
    this.buttonArea.setAttribute("class", "wrs_popupmessage_button_area");
    this.buttonArea.id = 'wrs_popup_button_area';

    // Buttons creation.
    buttonSubmitArguments = {
        class: "wrs_button_accept",
        innerHTML: popupAttributes.submitString,
        id: 'wrs_popup_accept_button'
    };
    this.acceptButton = this.createButton(buttonSubmitArguments, this.closeModal.bind(this));
    this.buttonArea.appendChild(this.acceptButton);

    buttonCancelArguments = {
        class: "wrs_button_cancel",
        innerHTML: popupAttributes.cancelString,
        id: 'wrs_popup_cancel_button'
    };
    this.cancelButton = this.createButton(buttonCancelArguments, this.close.bind(this));
    this.buttonArea.appendChild(this.cancelButton);
    // By default, popupwindow give close modal message with close and cancel buttons.
    // You can set other message with other buttons.
    document.addEventListener('keydown',function(e) {
        if (e.key !== undefined && e.repeat === false) {
            if (e.key == "Escape" || e.key === 'Esc') {
                _wrs_popupWindow.postMessage({'objectName' : 'checkCloseCondition'}, _wrs_modalWindow.iframeOrigin);
            }
        }
    });
}
// This method create a button with arguments and return button dom object.
PopUpMessage.prototype.createButton = function(parameters, callback) {
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
// This method show popup message.
PopUpMessage.prototype.show = function(){
    if (this.overlayEnvolture.style.display != 'block') {
        // Clear focus with blur for prevent press anykey.
        document.activeElement.blur();
        _wrs_popupWindow.postMessage({'objectName' : 'blur'}, _wrs_modalWindow.iframeOrigin);
        // For works with Safari.
        window.focus();
        this.overlayEnvolture.style.display = 'block';
    }
    else {
        this.overlayEnvolture.style.display = 'none';
        _wrs_modalWindow.focus();
    }
}
// This method hide popup message.
PopUpMessage.prototype.close = function(){
    this.overlayEnvolture.style.display = 'none';
    _wrs_modalWindow.focus();
}
// This method close modal and close popupmessage.
PopUpMessage.prototype.closeModal = function(){
    this.close();
    wrs_closeModalWindow();
}
