// PopUpMessageClass definition
// This class generate a modal message to show information to user
// We should send a language strings to show messages
function PopUpMessage(strings)
{
    this.strings = strings;
    this.overlayEnvolture = document.getElementsByClassName('wrs_modal_iframeContainer')[0].appendChild(document.createElement("DIV"));
    this.overlayEnvolture.setAttribute("style", "display: none;width: 100%;");

    this.message = this.overlayEnvolture.appendChild(document.createElement("DIV"));
    this.message.setAttribute("style", "margin: auto;position: absolute;top: 0;left: 0;bottom: 0;right: 0;background: white;width: 75%;height: 130px;border-radius: 2px;padding: 20px;font-family: sans-serif;font-size: 15px;text-align: left;color: #2e2e2e;z-index: 5;");

    var overlay = this.overlayEnvolture.appendChild(document.createElement("DIV"));
    overlay.setAttribute("style", "position: absolute; width: 100%; height: 100%; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); z-index: 4; cursor: pointer;");
    self = this;
    // We create a overlay that close popup message on click in there
    overlay.addEventListener("click", function(){self.close();});

    this.buttonArea = this.message.appendChild(document.createElement('p'));
    // By default, popupwindow give close modal message with close and cancel buttons
    // You can set other message with other buttons
    this.setOptions('close_modal_warning','close,cancel');
    document.addEventListener('keydown',function(e) {
        if (e.key !== undefined && e.repeat === false) {
            if (e.key == "Escape" || e.key === 'Esc') {
                _wrs_popupWindow.postMessage({'objectName' : 'checkCloseCondition'}, _wrs_modalWindow.iframeOrigin);
            }
        }
    });
}
PopUpMessage.prototype.setOptions = function(messageKey,values){
    this.message.removeChild(this.buttonArea);
    if(typeof this.strings[messageKey] != 'undefined'){
        this.message.innerHTML = this.strings[messageKey];
    }
    this.buttonArea = this.message.appendChild(document.createElement('p'));
    var types = values.split(',');
    self = this;
    // This is definition of buttons. You can create others.
    types.forEach(function(type){
        if(type == "close"){
            var buttonClose = self.buttonArea.appendChild(document.createElement("BUTTON"));
            buttonClose.setAttribute("style","margin: 0px;border: 0px;background: #567e93;border-radius: 4px;padding: 7px 11px;color: white;");
            buttonClose.addEventListener('click',function(){self.close();wrs_closeModalWindow();})
            if(typeof this.strings['close'] != 'undefined'){
                buttonClose.innerHTML = this.strings['close'];
            }
        }
        if(type == 'cancel'){
            var buttonCancel = self.buttonArea.appendChild(document.createElement("BUTTON"));
            buttonCancel.setAttribute("style","margin: 0px;border: 0px;border-radius: 4px;padding: 7px 11px;color: white;color: black;border: 1px solid silver;margin: 0px 5px;");
            buttonCancel.addEventListener("click", function(){self.close();});
            if(typeof this.strings['cancel'] != 'undefined'){
                buttonCancel.innerHTML = this.strings['cancel'];
            }
        }
    });
}
// This method show popup message.
PopUpMessage.prototype.show = function(){
    if (this.overlayEnvolture.style.display != 'block') {
        // Clear focus with blur for prevent press anykey
        document.activeElement.blur();
        _wrs_popupWindow.postMessage({'objectName' : 'blur'}, _wrs_modalWindow.iframeOrigin);
        // For works with Safari
        window.focus();
        this.overlayEnvolture.style.display = 'block';
    }else{
        this.overlayEnvolture.style.display = 'none';
        _wrs_modalWindow.focus();
    }
}
// This method hide popup message
PopUpMessage.prototype.close = function(){
    this.overlayEnvolture.style.display = 'none';
    _wrs_modalWindow.focus();
}
