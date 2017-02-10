
/**
 * Modal window constructor
 * @param {string} path             Iframe src
 * @param {string} title            Modal window title
 * @param {Object} editorAttributes Editor attributes (width, height)...
 * @ignore
 */
function ModalWindow(path, editorAttributes) {

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isIOS = ((ua.indexOf("ipad") > -1) || (ua.indexOf("iphone") > -1));

    var deviceWidth = window.outerWidth;
    var deviceHeight = window.outerHeight;

    var landscape = deviceWidth > deviceHeight;
    var portrait = deviceWidth < deviceHeight;

    var iframeAttributes  = {};
    iframeAttributes['width'] = editorAttributes.split(' ').join('').split(',')[0].split("=")[1];
    iframeAttributes['height'] = editorAttributes.split(' ').join('').split(',')[1].split("=")[1];
    iframeAttributes['src'] = path;

    var isMobile = (landscape && iframeAttributes['height'] > deviceHeight) || (portrait && iframeAttributes['width'] > deviceWidth) ? true : false;

    // Device object properties.

    var deviceProperties = {};
    deviceProperties['orientation'] = landscape ? 'landscape' : 'portait';
    deviceProperties['isAndroid'] = isAndroid ? true : false;
    deviceProperties['isIOS'] = isIOS ? true : false;
    deviceProperties['isMobile'] = isMobile;


    this.deviceProperties = deviceProperties;
    this.properties = {
        created : false,
        state : '',
        previousState : '',
        deviceProperties: deviceProperties
    }

    this.properties.iframeAttributes = iframeAttributes;

    this.title = '';

    var attributes = {};

    attributes['class'] = 'wrs_modal_overlay';
    var modalOverlayDiv = wrs_createElement('div', attributes);
    this.overlayDiv = modalOverlayDiv;

    attributes['class'] = 'wrs_modal_title_bar';
    var barModalDiv = wrs_createElement('div', attributes);
    this.titleBardDiv = barModalDiv;

    attributes = {};
    attributes['class'] = 'wrs_modal_title';
    var titleModalDiv = wrs_createElement('div', attributes);
    titleModalDiv.innerHTML = this.title;
    this.titleDiv = titleModalDiv;

    attributes = {};
    attributes['class'] = 'wrs_modal_close_button';
    var closeModalDiv = wrs_createElement('div', attributes);
    // closeModalDiv.innerHTML = '&times;';
    this.closeDiv = closeModalDiv;

    attributes = {};
    attributes['class'] = 'wrs_modal_stack_button';
    var stackModalDiv = wrs_createElement('div', attributes);
    // stackModalDiv.innerHTML = '/';
    this.stackDiv = stackModalDiv;

    attribyutes = {};
    attributes['class'] = 'wrs_modal_minimize_button';
    var minimizeModalDiv = wrs_createElement('div', attributes);
    // minimizeModalDiv.innerHTML = "_";
    this.minimizeDiv = minimizeModalDiv;

    attributes = {};
    attributes['class'] = 'wrs_modal_dialogContainer';
    var containerDiv = wrs_createElement('div', attributes);
    containerDiv.style.overflow = 'hidden';
    this.containerDiv = containerDiv;

    attributes = {};
    attributes['class'] = 'wrs_modal_iframe';
    attributes['src'] = iframeAttributes['src'];
    attributes['frameBorder'] = "0";
    var iframeModal = wrs_createElement('iframe', attributes);
    this.iframe = iframeModal;

    attributes = {};
    attributes['class'] = 'wrs_modal_iframeContainer';
    var iframeModalContainer = wrs_createElement('div', attributes);
    this.iframeContainer = iframeModalContainer;

    this.editor = null;

}

ModalWindow.prototype.create = function() {
    this.titleBardDiv.appendChild(this.closeDiv);
    this.titleBardDiv.appendChild(this.stackDiv);
    this.titleBardDiv.appendChild(this.minimizeDiv);
    this.titleBardDiv.appendChild(this.titleDiv);
    this.iframeContainer.appendChild(this.iframe);

    if (!this.deviceProperties['isMobile'] && !this.deviceProperties['isAndroid']) {
        this.containerDiv.appendChild(this.titleBardDiv);
    }
    this.containerDiv.appendChild(this.iframeContainer);

    document.body.appendChild(this.containerDiv);
    document.body.appendChild(this.overlayDiv);

    wrs_addEvent(this.closeDiv, 'click', this.close.bind(this));

    if (!this.deviceProperties['isMobile'] && !this.deviceProperties['isIOS'] && !this.deviceProperties['isAndroid']) { // Desktop.
        this.stackDiv.addEventListener('click', this.stackModalWindow.bind(this), true);
        this.minimizeDiv.addEventListener('click', this.minimizeModalWindow.bind(this), true);
        this.createModalWindowDesktop();
    }
    else if (this.deviceProperties['isAndroid']) {
        this.createModalWindowAndroid();
    }
    else if (this.deviceProperties['isIOS'] && !this.deviceProperties['isMobile']) {
        this.createModalWindowIos();
    }
    this.addListeners();
    _wrs_popupWindow = this.iframe.contentWindow;
    this.properties.open = true;
    this.properties.created = true;
}

ModalWindow.prototype.open = function() {
    if (this.properties.open == true) {
        this.iframe.contentWindow._wrs_modalWindowProperties.editor.setMathML(wrs_mathmlDecode(_wrs_temporalImage.getAttribute('data-mathml')));
    } else if (this.properties.created) {
        var editor = this.iframe.contentWindow._wrs_modalWindowProperties.editor;

        this.properties.open = true;
        if (customEditor = wrs_int_getCustomEditorEnabled()) {
                toolbar = customEditor.toolbar ? customEditor.toolbar : wrs_attributes['toolbar'];
                if (typeof editor.params.toolbar == 'undefined' || editor.params.toolbar != toolbar) {
                    editor.setParams({'toolbar' : toolbar});
                }
        } else {
                if (typeof editor.params.toolbar != 'undefined' && editor.params.toolbar != 'general') {
                    editor.setParams({'toolbar' : 'general'});
                }

        }

        if (_wrs_isNewElement) {
            if (this.properties.deviceProperties.isAndroid || this.properties.deviceProperties.isIos) {
                editor.setMathML('<math><semantics><annotation encoding="application/json">[]</annotation></semantics></math>"');
            } else {
                editor.setMathML('<math/>');
            }
        } else {
            editor.setMathML(wrs_mathmlDecode(_wrs_temporalImage.getAttribute('data-mathml')));
        }

        this.containerDiv.style.visibility = '';
        this.overlayDiv.style.visibility = '';
        this.containerDiv.style.display = '';
        this.overlayDiv.style.display = '';


        editor.focus();
        if (!this.properties.deviceProperties.isAndroid && !this.properties.deviceProperties.isIos) {
            this.stackModalWindow();
        }
    } else {
        this.create();
    }
}

/**
 * Closes modal window and restores viewport header.
 * @ignore
 */
ModalWindow.prototype.close = function() {
    this.overlayDiv.style.visibility = 'hidden';
    this.containerDiv.style.visibility = 'hidden';
    this.containerDiv.style.display = 'none';
    this.overlayDiv.style.display = 'none';
    this.properties.open = false;
    wrs_int_disableCustomEditors();
    document.getElementsByClassName('wrs_modal_iframe')[0].contentWindow._wrs_modalWindowProperties.editor.setMathML('<math/>');
    // Properties to initial state
    this.properties.state = '';
    this.properties.previousState = '';
}

ModalWindow.prototype.addClass = function(cls) {
    wrs_addClass(this.overlayDiv, cls);
    wrs_addClass(this.titleBardDiv, cls);
    wrs_addClass(this.overlayDiv, cls);
    wrs_addClass(this.containerDiv, cls);
    wrs_addClass(this.iframeContainer, cls);
    wrs_addClass(this.iframe, cls);
    wrs_addClass(this.stackDiv, cls);
    wrs_addClass(this.minimizeDiv, cls);
}

ModalWindow.prototype.removeClass = function(cls) {
    wrs_removeClass(this.overlayDiv, cls);
    wrs_removeClass(this.titleBardDiv, cls);
    wrs_removeClass(this.overlayDiv, cls);
    wrs_removeClass(this.containerDiv, cls);
    wrs_removeClass(this.iframeContainer, cls);
    wrs_removeClass(this.iframe, cls);
    wrs_removeClass(this.stackDiv, cls);
    wrs_removeClass(this.minimizeDiv, cls);
}

ModalWindow.prototype.setTitle = function(title) {
    this.titleDiv.innerHTML = title;
    this.title = title;

}
/**
 * Create modal dialog for desktop OS.
 * @param  {modalDiv} modal overlay div.
 * @param  {containerDiv} modal window div.
 * @param  {iframe} embedded iframe.
 * @param  {iframeParams}  embedded iframe params (height, width).
 * @ignore
 */
ModalWindow.prototype.createModalWindowDesktop = function() {
    this.addClass('wrs_modal_desktop');
    this.stackModalWindow();
}

/**
 * Create modal dialog for non mobile android devices.
 * @param  {modalDiv} modal overlay div.
 * @param  {containerDiv} modal window div.
 * @param  {iframe} embedded iframe.
 * @param  {iframeParams}  embedded iframe params (height, width).
 * @ignore
 */

ModalWindow.prototype.createModalWindowAndroid = function() {
    this.addClass('wrs_modal_android');
}

/**
 * Create modal dialog for iOS devices.
 * @ignore
 */

ModalWindow.prototype.createModalWindowIos = function() {
    wrs_addMetaViewport("device-width", 1.0, 1.0, 1.0);

    var modalHeight = parseInt(this.properties.iframeAttributes['height']) + 35;
    var modalWidth = parseInt(this.properties.iframeAttributes['width']) + 10;

    this.containerDiv.style.width = modalWidth + 'px';
    this.containerDiv.style.height = modalHeight + 'px';

    this.iframeContainer.style.width = this.properties.iframeAttributes['width'] + 'px';
    this.iframeContainer.style.height = this.properties.iframeAttributes['height'] + 'px';

    this.iframe.style.width = this.properties.iframeAttributes['width'] + 'px';
    this.iframe.style.height = this.properties.iframeAttributes['height'] + 'px';

    this.addClass('wrs_modal_ios');
}

ModalWindow.prototype.stackModalWindow = function () {
    if (this.properties.state == 'stack' || (this.properties.state == 'minimized') && !this.properties.previousState == 'stack') {
        this.maximizeModalWindow();
    } else {
        this.properties.previousState = this.properties.state;
        this.properties.state = 'stack';

        // We need to remove "width" manually because is calculated by javascript.
        // containerDiv.style.width = null;
        // containerDiv.style.left = null;
        this.containerDiv.style.top = null;
        // this.containerDiv.style.width = null;
        this.containerDiv.style.rifgh = null;
        this.containerDiv.style.left = null;
        this.containerDiv.style.position = null;

        var modalWidth = parseInt(this.properties.iframeAttributes['width']);
        this.iframeContainer.style.width = modalWidth + 'px';
        this.iframeContainer.style.height = 300 + 'px';
        this.containerDiv.style.width = (modalWidth + 12) + 'px';
        this.iframe.style.width = this.properties.iframeAttributes['width'] + 'px';
        this.iframe.style.height = (parseInt(300) + 3)+ 'px';
        this.iframe.style.margin = '6px';
        this.removeClass('wrs_maximized');
        this.removeClass('wrs_minimized');
        this.addClass('wrs_stack');
    }
}

ModalWindow.prototype.minimizeModalWindow = function() {
    if (this.properties.state == 'minimized' && this.properties.previousState == 'stack') {
        this.stackModalWindow();
    }
    else if (this.properties.state == 'minimized' && this.properties.previousState == 'maximized') {
        this.maximizeModalWindow();
    }
    else {
        this.removeListeners();
        this.properties.previousState = this.properties.state;
        this.properties.state = "minimized";
        this.containerDiv.style.width = null;
        this.containerDiv.style.left = null;
        this.containerDiv.style.top = null;
        this.containerDiv.style.position = null;

        if (wrs_containsClass(this.overlayDiv, 'wrs_stack')) {
            this.removeClass('wrs_stack');
        }
        else {
            this.removeClass('wrs_maximized');
        }

        this.addClass('wrs_minimized');
    }
}

/**
 * Minimizes modal window.
 * @ignore
 */
ModalWindow.prototype.maximizeModalWindow = function() {
    this.properties.previousState = this.properties.state;
    this.properties.state = 'maximized';

    var modalHeight = parseInt(this.properties.iframeAttributes['height']);
    var modalWidth = parseInt(this.properties.iframeAttributes['width']);
    this.iframeContainer.style.width = modalWidth + 'px';
    this.iframeContainer.style.height = modalHeight + 'px';
    this.containerDiv.style.width = (modalWidth + 12) + 'px';
    this.iframe.style.width = this.properties.iframeAttributes['width'] + 'px';
    this.iframe.style.height = (parseInt(this.properties.iframeAttributes['height']) + 3)+ 'px';
    this.iframe.style.margin = '6px';
    this.removeClass('wrs_drag');
    if (wrs_containsClass(this.overlayDiv, 'wrs_minimized')) {
        this.removeClass('wrs_minimized');
    } else if (wrs_containsClass(this.overlayDiv, 'wrs_stack')) {
        this.containerDiv.style.left = null;
        this.containerDiv.style.top = null;
        this.removeClass('wrs_stack');
    }
    this.addClass('wrs_maximized');
}

/**
 * Makes an object draggable adding mouse and touch events.
 *
 * @param  {object} draggable object (for example modal dialog).
 * @param  {target} target to add the events (for example de titlebar of a modal dialog)
 * @ignore
 */
ModalWindow.prototype.addListeners = function() {
    // Mouse events.
    wrs_addEvent(document.body, 'mousedown', this.startDrag.bind(this));
    wrs_addEvent(window, 'mouseup', this.stopDrag.bind(this));
    wrs_addEvent(document, 'mouseup', this.stopDrag.bind(this));
    wrs_addEvent(this.iframe.contentWindow, 'mouseup', this.stopDrag.bind(this));
    wrs_addEvent(document.body, 'mousemove', this.drag.bind(this));
}

/**
 * Removes draggable events from an object.
 *
 * @param  {object} draggable object (for example modal dialog).
 * @param  {target} target to add the events (for example de titlebar of a modal dialog)
 * @ignore
 */
ModalWindow.prototype.removeListeners = function() {
    // Mouse events.
    wrs_removeEvent(document.body, 'mousedown', this.startDrag);
    wrs_removeEvent(window, 'mouseup', this.stopDrag);
    wrs_removeEvent(document, 'mouseup', this.stopDrag);
    wrs_removeEvent(document.getElementsByClassName("wrs_modal_iframe")[0], 'mouseup', this.stopDrag);
    wrs_removeEvent(document.body, 'mousemove', this.drag);
}


/**
 * Returns mouse or touch coordinates (on touch events ev.ClientX doesn't exists)
 * @param {event} ev mnouse or touch event
 * @return {object} with the X and Y coordinates.
 * @ignore
 */
ModalWindow.prototype.eventClient = function(ev) {
    if (typeof(ev.clientX) == 'undefined') {
        var client = {
            X : ev.changedTouches[0].clientX,
            Y : ev.changedTouches[0].clientY
        };
        return client;
    } else {
        client = {
            X : ev.clientX,
            Y : ev.clientY
        };
        return client;
    }
}

/**
 * Start drag function: set the object _wrs_dragDataObject with the draggable object offsets coordinates.
 * when drag starts (on touchstart or mousedown events).
 *
 * @param {event} ev touchstart or mousedown event.
 * @ignore
 */
ModalWindow.prototype.startDrag = function(ev) {
    if (this.properties.state == 'minimized') {
        return;
    }
    if (ev.target.className == 'wrs_modal_title') {
        if(!this.dragDataobject) {
            ev = ev || event;
            this.dragDataObject = {
                x: this.eventClient(ev).X - (isNaN(parseInt(window.getComputedStyle(this.containerDiv)).left && parseInt(window.getComputedStyle(this.containerDiv).left > 0 )) ? this.containerDiv.offsetLeft : parseInt(window.getComputedStyle(this.containerDiv).left)),
                y: this.eventClient(ev).Y - (isNaN(parseInt(window.getComputedStyle(this.containerDiv).top)) ? this.containerDiv.offsetTop : parseInt(window.getComputedStyle(this.containerDiv).top))
            };
        };
    }

    if (typeof dialogContainerDiv != 'undefined') {
        this.addClass('wrs_drag');
    }
}

/**
 * Updates_wrs_dragDataObject with the draggable object coordinates when the draggable object is being moved.
 *
 * @param {event} ev touchmouve or mousemove events.
 * @ignore
 */
ModalWindow.prototype.drag = function(ev) {
    if(this.dragDataObject) {
        ev.preventDefault();
        ev = ev || event;
        this.containerDiv.style.left = this.eventClient(ev).X - this.dragDataObject.x + "px";
        this.containerDiv.style.top = this.eventClient(ev).Y - this.dragDataObject.y + "px";
        this.containerDiv.style.position = 'absolute';
        this.containerDiv.style.bottom = null;
        wrs_removeClass(this.containerDiv, 'wrs_stack');
    }
}

/**
 * Set the _wrs_dragDataObject to null when the drag finish (touchend or mouseup events).
 *
 * @param {event} ev touchend or mouseup event.
 * @ignore
 */
ModalWindow.prototype.stopDrag = function(ev) {
    wrs_addClass(this.containerDiv, 'wrs_drag');
    this.dragDataObject = null;
}
