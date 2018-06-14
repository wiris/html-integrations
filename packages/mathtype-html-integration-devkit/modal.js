/**
 * Modal window constructor
 * @param {Object} editorAttributes Editor attributes (width, height)...
 * @ignore
 */
class ModalWindow {

    constructor(editorAttributes) {
        // EditorAtributes
        // TODO: Remove the argument: we need to find a way to detect mobile devices
        // without known anything about editor.
        this.editorAttributes = editorAttributes

        // Metrics
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1;
        var isIOS = ((ua.indexOf("ipad") > -1) || (ua.indexOf("iphone") > -1));
        this.iosSoftkeyboardOpened = false;
        this.iosMeasureUnit = ua.indexOf("crios") == -1 ? "%" : "vh";
        this.iosDivHeight = "100" + this.iosMeasureUnit;

        var deviceWidth = window.outerWidth;
        var deviceHeight = window.outerHeight;

        var landscape = deviceWidth > deviceHeight;
        var portrait = deviceWidth < deviceHeight;

        var editorWidth = editorAttributes.split(' ').join('').split(',')[0].split("=")[1];
        var editorHeight = editorAttributes.split(' ').join('').split(',')[1].split("=")[1];

        // TODO: Detect isMobile without using editor metrics.
        var isMobile = (landscape && editorHeight > deviceHeight) || (portrait && editorWidth > deviceWidth) ? true : false;

        // Device object properties.

        this.deviceProperties = {
            orientation : landscape ? 'landscape' : 'portait',
            isAndroid : isAndroid ? true : false,
            isIOS : isIOS ? true : false,
            isMobile : isMobile,
            isDesktop : !isMobile && !isIOS && !isAndroid
        };

        this.properties = {
            created : false,
            state : '',
            previousState : '',
            position : {bottom: 0, right: 10},
            size :  {height: 338, width: 580}
        };

        var attributes = {};
        attributes.class = 'wrs_modal_overlay';
        attributes.id = attributes.class + '_id';
        this.overlay = wrs_createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_title_bar';
        attributes.id = attributes.class + '_id';
        this.titleBar = wrs_createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_title';
        attributes.id = attributes.class + '_id';
        this.title = wrs_createElement('div', attributes);
        this.title.innerHTML = '';

        attributes = {};
        attributes.class = 'wrs_modal_close_button';
        attributes.id = attributes.class + '_id';
        attributes.title = _wrs_stringManager.getString('close');
        this.closeDiv = wrs_createElement('a', attributes);;
        this.closeDiv.setAttribute('role','button');

        attributes = {};
        attributes.class = 'wrs_modal_stack_button';
        attributes.id = attributes.class + '_id';
        attributes.title = "Exit full-screen";
        this.stackDiv = wrs_createElement('a', attributes);
        this.stackDiv.setAttribute('role','button');

        attributes = {};
        attributes.class = 'wrs_modal_maximize_button';
        attributes.id = attributes.class + '_id';
        attributes.title = _wrs_stringManager.getString('fullscreen');
        this.maximizeDiv = wrs_createElement('a', attributes);
        this.maximizeDiv.setAttribute('role','button');

        attributes = {};
        attributes.class = 'wrs_modal_minimize_button';
        attributes.id = attributes.class + '_id';
        attributes.title = _wrs_stringManager.getString('minimise');
        this.minimizeDiv = wrs_createElement('a', attributes);
        this.minimizeDiv.setAttribute('role','button');

        attributes = {};
        attributes.class = 'wrs_modal_dialogContainer';
        attributes.id = attributes.class + '_id';
        this.container = wrs_createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_wrapper';
        attributes.id = attributes.class + '_id';
        this.wrapper = wrs_createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_content_container';
        attributes.id = attributes.class + '_id';
        this.contentContainer = wrs_createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_controls';
        attributes.id = attributes.class + '_id';
        this.controls = wrs_createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_buttons_container';
        attributes.id = attributes.class + '_id';
        this.buttonContainer = wrs_createElement('div', attributes);

        // Buttons: all button must be created using createSubmitButton method.
        this.submitButton = this.createSubmitButton(
            {
                class: 'wrs_modal_button_accept',
                innerHTML: _wrs_stringManager.getString('accept')
            },
            this.submitAction.bind(this)
        );

        this.cancelButton = this.createSubmitButton(
            {
                class: 'wrs_modal_button_cancel',
                innerHTML: _wrs_stringManager.getString('cancel')
            },
            this.cancelAction.bind(this)
        );

        this.lastImageWasNew = true;

        this.contentElement = null;
    }
    /**
     * This method sets the contentElement object. A contentElement object
     * manages the logic of modal object content: submit, update, close and changes.
     * @param {object} contentElement
     * @ignore
     */
    setContentelement(contentElement) {
        this.contentElement = contentElement;
    }

    /**
     * Returns the modal contentElement object.
     *@returns {object}
    *@ignore
    */
    getContentElement() {
        return this.contentElement;
    }

    /**
     * This method is called when the modal object has been submited. Calls
     * contentElement submitAction method - if exists - and closes the modal
     * object. No logic about the content should be placed here,
     * contentElement.submitAction is the responsible of the content logic.
     * @ignore
     */
    submitAction() {
        if (typeof this.contentElement.submitAction !== 'undefined') {
            this.contentElement.submitAction();
        }
        this.close();
    }

    /**
     * This method is called when the modal object has been cancelled. If
     * contentElement has implemented hasChanges method, a confirm popup
     * will be shown if hasChanges returns true.
     * @ignore
     */
    cancelAction() {
        if (typeof this.contentElement.hasChanges === 'undefined') {
            this.close();
        } else if (!this.contentElement.hasChanges()){
            this.close();
        } else {
            this.showPopUpMessage();
        }
    }

    /**
     * Returns a submit button. The properties argument admits the following:
     * properties {
     *  'class' : '', // button class.
     *  'innerHTML : '' // button innerHTML.
     * }
     * @param {Object} properties input button properties.
     * @param {Function} callback callback function associated to click event.
     * @ignore
     */
    createSubmitButton(properties, callback) {
        function SubmitButton(properties, callback) {
            this.element = document.createElement('button');
            this.element.id = properties.class + '_id';
            this.element.className = properties.class;
            this.element.innerHTML = properties.innerHTML;
            wrs_addEvent(this.element, 'click', callback);
        }

        SubmitButton.prototype.getElement = function() {
            return this.element;
        }

        return new SubmitButton(properties, callback).getElement();
    }

    /**
     * Creates the modal window object inserting a contentElement object.
     * @ignore
     */
    create() {

        /*Modal Window Structure
    _____________________________________________________________________________________
    |wrs_modal_dialog_Container                                                         |
    | _________________________________________________________________________________ |
    | |title_bar                          minimize_button  stack_button  close_button | |
    | |_______________________________________________________________________________| |
    | |wrapper                                                                        | |
    | | _____________________________________________________________________________ | |
    | | |content                                                                    | | |
    | | |                                                                           | | |
    | | |                                                                           | | |
    | | |___________________________________________________________________________| | |
    | | _____________________________________________________________________________ | |
    | | |controls                                                                   | | |
    | | | ___________________________________                                       | | |
    | | | |buttonContainer                  |                                       | | |
    | | | | _______________________________ |                                       | | |
    | | | | |button_accept | button_cancel| |                                       | | |
    | | | |_|_____________ |______________|_|                                       | | |
    | | |___________________________________________________________________________| | |
    | |_______________________________________________________________________________| |
    |___________________________________________________________________________________|*/

        this.titleBar.appendChild(this.closeDiv);
        this.titleBar.appendChild(this.stackDiv);
        this.titleBar.appendChild(this.maximizeDiv);
        this.titleBar.appendChild(this.minimizeDiv);
        this.titleBar.appendChild(this.title);

        if (this.deviceProperties['isDesktop']) {
            this.container.appendChild(this.titleBar);
        }

        this.wrapper.appendChild(this.contentContainer);
        this.wrapper.appendChild(this.controls);

        this.controls.appendChild(this.buttonContainer);

        this.buttonContainer.appendChild(this.submitButton);
        this.buttonContainer.appendChild(this.cancelButton);

        this.container.appendChild(this.wrapper);

        // Check if browser has scrollBar before modal has modified.
        this.recalculateScrollBar();

        document.body.appendChild(this.container);
        document.body.appendChild(this.overlay);

        if (this.deviceProperties['isDesktop']) { // Desktop.
            this.createModalWindowDesktop();
            this.createResizeButtons();

            this.addListeners();
            // Maximize window only when the configuration is set and the device is not iOS or Android.
            // TODO: Global variable
            if (_wrs_conf_modalWindowFullScreen) {
                this.maximize();
            }
            // Overlay popup.
            var popupStrings = {
                'cancelString' : _wrs_stringManager.getString('cancel'),
                'submitString' : _wrs_stringManager.getString('close'),
                'message' : _wrs_stringManager.getString('close_modal_warning')
            };

            var callbacks = {
                'closeCallback' : function(){this.close()}.bind(this),
                'cancelCallback'  : function(){this.focus()}.bind(this)
            }

            var popupupProperties = {
                'overlayElement' : this.container,
                'callbacks' :callbacks,
                'strings': popupStrings
            }

            this.popup = new PopUpMessage(popupupProperties);
        }
        else if (this.deviceProperties['isAndroid']) {
            this.createModalWindowAndroid();
        }
        else if (this.deviceProperties['isIOS'] && !this.deviceProperties['isMobile']) {
            this.createModalWindowIos();
        }

        if (this.contentElement != null) {
            this.contentElement.insert(this);
        }

        this.properties.open = true;
        this.properties.created = true;
    }

    /**
     * Creates a button in the modal object to resize it.
     * @ignore
     */
    createResizeButtons() {
        // This is a definition of Resize Button Bottom-Right
        this.resizerBR = document.createElement('div');
        this.resizerBR.className  = 'wrs_bottom_right_resizer';
        this.resizerBR.innerHTML = '◢';
        // This is a definition of Resize Button Top-Left
        this.resizerTL = document.createElement('div');
        this.resizerTL.className  = 'wrs_bottom_left_resizer';
        // Append resize buttons to modal
        this.container.appendChild(this.resizerBR);
        this.titleBar.appendChild(this.resizerTL);
        // Add events to resize on click and drag
        wrs_addEvent(this.resizerBR, 'mousedown', this.activateResizeStateBR.bind(this));
        wrs_addEvent(this.resizerTL, 'mousedown', this.activateResizeStateTL.bind(this));
    }
    /**
     * Method to initialize variables for Bottom-Right resize button
     * @param {event} ev mouse
     * @ignore
     */
    activateResizeStateBR(ev) {
        this.initializeResizeProperties(ev, false);
    }

    /**
     * Method to initialize variables for Top-Left resize button
     * @param {event} ev mouse
     * @ignore
     */
    activateResizeStateTL(ev) {
        this.initializeResizeProperties(ev, true);
    }

    /**
     * Common method to initialize variables at resize
     * @param {event} ev mouse
     * @ignore
     */
    initializeResizeProperties(ev, leftOption) {
        // Apply class for disable involuntary select text when drag.
        wrs_addClass(document.body, 'wrs_noselect');
        this.resizeDataObject = {
            x: this.eventClient(ev).X,
            y: this.eventClient(ev).Y
        };
        // Save Initial state of modal to compare on drag and obtain the difference.
        this.initialWidth = parseInt(this.container.style.width);
        this.initialHeight = parseInt(this.container.style.height);
        if (!leftOption) {
            this.initialRight = parseInt(this.container.style.right);
            this.initialBottom = parseInt(this.container.style.bottom);
        } else {
            this.leftScale = true;
        }
        if (!this.initialRight){
            this.initialRight = 0;
        }
        if (!this.initialBottom){
            this.initialBottom = 0;
        }
        // Disable mouse events on editor when we start to drag modal.
        document.body.style['user-select'] = 'none';
    }

    /**
     * This method opens the modal window, restoring the previous state, position and metrics,
     * if exists.
     * By default the modal object opens in stack mode.
     * @ignore
     */
    open() {
        //Removing close class.
        this.removeClass('wrs_closed');
        // Hiding keyboard for mobile devices.
        if (this.deviceProperties['isIOS'] || this.deviceProperties['isAndroid'] || this.deviceProperties['isMobile']) {
            // Due to editor wait we need to wait until editor focus.
            setTimeout(function() { this.hideKeyboard }.bind(this), 300);
        }

        // New modal window. He need to create the whole object.
        if (!this.properties.created) {
            this.create();
        }
        else {
            // Previous state closed. Open method can be called even the previous state is open,
            // for exmample updating the content of the modal object.
            if (!this.properties.open) {
                this.properties.open = true;

                // Restoring the previous open state: if the modal object has been closed
                // re-open it should preserve the state and the metrics.
                if (!this.deviceProperties.isAndroid && !this.deviceProperties.isIOS) {
                    this.restoreState();
                }
            }

            // Maximize window only when the configuration is set and the device is not iOs or Android.
            if (this.deviceProperties['isDesktop'] && _wrs_conf_modalWindowFullScreen) {
                this.maximize();
            }

            // In iOS we need to recalculate the size of the modal object because
            // iOS keyboard is a float div which can overlay the modal object.
            if (this.deviceProperties['isIOS']) {
                this.iosSoftkeyboardOpened = false;
                this.setContainerHeight("100" + this.iosMeasureUnit);
            }

            // Updating content element.
            if (typeof this.contentElement != 'undefined') {
                this.contentElement.update(this);
            }
        }
    }

    /**
     * Closes modal window and restores viewport header.
     * @ignore
     */
    close() {
        this.removeClass('wrs_maximized');
        this.removeClass('wrs_minimized');
        this.removeClass('wrs_stack');
        this.addClass('wrs_closed');
        this.saveModalProperties();
        this.properties.open = false;
    }

    /**
     * Util function to kwnow if browser is internet explorer 11.
     * @return {boolean} return true if browser is iexplorer v11 or false in others.
     * @ignore
     */
    isIE11() {
        if (navigator.userAgent.search("Msie/") >= 0 || navigator.userAgent.search("Trident/") >= 0 || navigator.userAgent.search("Edge/") >= 0 ) {
            return true;
        }
        return false;
    }

    /**
     * Adds a class to all modal DOM elements.
     * @param {string} cls
     * @ignore
     */
    addClass(cls) {
        wrs_addClass(this.overlay, cls);
        wrs_addClass(this.titleBar, cls);
        wrs_addClass(this.overlay, cls);
        wrs_addClass(this.container, cls);
        wrs_addClass(this.contentContainer, cls);
        wrs_addClass(this.stackDiv, cls);
        wrs_addClass(this.minimizeDiv, cls);
        wrs_addClass(this.maximizeDiv, cls);
        wrs_addClass(this.wrapper, cls);
    }

    /**
     * Remove a calss from all modal DOM elements.
     * @param {string} cls
     * @ignore
     */
    removeClass(cls) {
        wrs_removeClass(this.overlay, cls);
        wrs_removeClass(this.titleBar, cls);
        wrs_removeClass(this.overlay, cls);
        wrs_removeClass(this.container, cls);
        wrs_removeClass(this.contentContainer, cls);
        wrs_removeClass(this.stackDiv, cls);
        wrs_removeClass(this.minimizeDiv, cls);
        wrs_removeClass(this.maximizeDiv, cls);
        wrs_removeClass(this.wrapper, cls);
    }

    /**
     * Create modal dialog for desktop.
     * @ignore
     */
    createModalWindowDesktop() {
        this.addClass('wrs_modal_desktop');
        this.stack();
    }

    /**
     * Create modal dialog for non mobile android devices.
     * @ignore
     */
    createModalWindowAndroid() {
        this.addClass('wrs_modal_android');
        window.addEventListener('resize', this.orientationChangeAndroidSoftkeyboard.bind(this));
    }

    /**
     * Create modal dialog for iOS devices.
     * @ignore
     */
    createModalWindowIos() {
        this.addClass('wrs_modal_ios');
        // Refresh the size when the orientation is changed
        window.addEventListener('resize', this.orientationChangeIosSoftkeyboard.bind(this));
    }

    /**
     * Restore previous state, position and size of previous stacked modal window
     * @ignore
     */
    restoreState() {
        if (this.properties.state == 'maximized') {
            // Reseting states for prevent return to stack state.
            this.maximize();
        } else if (this.properties.state == 'minimized') {
            // Reseting states for prevent return to stack state.
            this.properties.state = this.properties.previousState;
            this.properties.previousState = '';
            this.minimize();
        } else {
            this.stack();
        }
    }

    /**
     * Stacks the modal object.
     * @ignore
     */
    stack() {
        this.properties.previousState = this.properties.state;
        this.properties.state = 'stack';
        this.removeClass('wrs_maximized');
        this.minimizeDiv.title = "Minimise";
        this.removeClass('wrs_minimized');
        this.addClass('wrs_stack');

        this.restoreModalProperties();

        // Need recalculate position of actual modal because window can was changed in fullscreenmode
        this.recalculateScrollBar();
        this.recalculatePosition();
        this.recalculateScale();
        this.focus();
    }

    /**
     * Minimizes the modal object
     * @ignore
     */
    minimize() {
        // Saving width, height, top and bottom parameters to restore when open
        this.saveModalProperties();
        if (this.properties.state == 'minimized' && this.properties.previousState == 'stack') {
            this.stack();
        }
        else if (this.properties.state == 'minimized' && this.properties.previousState == 'maximized') {
            this.maximize();
        }
        else {
            // Setting css to prevent important tag into css style
            this.container.style.height = "30px";
            this.container.style.width = "250px";
            this.container.style.bottom = "0px";
            this.container.style.right = "10px";

            this.removeListeners();
            this.properties.previousState = this.properties.state;
            this.properties.state = "minimized";
            this.setResizeButtonsVisibility();
            this.minimizeDiv.title = "Maximise";

            if (wrs_containsClass(this.overlay, 'wrs_stack')) {
                this.removeClass('wrs_stack');
            }
            else {
                this.removeClass('wrs_maximized');
            }
            this.addClass('wrs_minimized');
        }
    }

    /**
     * Maximizes the modal object.
     * @ignore
     */
    maximize() {
        // Saving width, height, top and bottom parameters to restore when open
        this.saveModalProperties();
        if (this.properties.state != 'maximized') {
            this.properties.previousState = this.properties.state;
            this.properties.state = 'maximized';
        }
        // Don't permit resize on maximize mode.
        this.setResizeButtonsVisibility();

        if (wrs_containsClass(this.overlay, 'wrs_minimized')) {
            this.minimizeDiv.title = "Minimise";
            this.removeClass('wrs_minimized');
        }
        else if (wrs_containsClass(this.overlay, 'wrs_stack')) {
            this.container.style.left = null;
            this.container.style.top = null;
            this.removeClass('wrs_stack');
        }

        this.addClass('wrs_maximized');

        // Set size to 80% screen with a max size.
        this.setSize(parseInt(window.innerHeight * 0.8) , parseInt(window.innerWidth * 0.8));
        var sizeModificated = false;
        if (this.container.clientHeight > 700) {
            this.container.style.height = '700px';
            sizeModificated = true;
        }
        if (this.container.clientWidth > 1200) {
            this.container.style.width  = '1200px';
            sizeModificated = true;
        }

        // Setting modal position in center on screen.
        this.setPosition(window.innerHeight / 2 - this.container.offsetHeight / 2, window.innerWidth / 2 - this.container.offsetWidth / 2);
        this.recalculateScale();
        this.recalculatePosition();
        this.recalculateSize();
        this.focus();
    }

    /**
     * Sets modal size.
     * @param  {integer} height set a height of modal with an integer
     * @param  {integer} width set a width of modal with an integer
     * @ignore
     */
    setSize(height, width) {
        this.container.style.height = height + 'px';
        this.container.style.width = width + 'px';
        this.recalculateSize();
    }

    /**
     * Sets modal position.
     * @param  {integer} bottom set a bottom of div modal with an integer
     * @param  {integer} right set a right of div modal with an integer
     * @ignore
     */
    setPosition(bottom, right) {
        this.container.style.bottom = bottom + 'px';
        this.container.style.right = right + 'px';
    }

    /**
     * Saves actual parameters of open modal object (like size and position...) to restore it
     * once the modal object is re-opened.
     * @ignore
     */
    saveModalProperties() {
        // Saving values of modal only when modal is in stack state.
        if (this.properties.state == 'stack') {
            this.properties.position.bottom = parseInt(this.container.style.bottom);
            this.properties.position.right = parseInt(this.container.style.right);
            this.properties.size.width = parseInt(this.container.style.width);
            this.properties.size.height = parseInt(this.container.style.height);
        }
    }

    /**
     * Restore previous parameters values of closed modal (like size and position) and apply this parameters in actual modal.
     * @ignore
     */
    restoreModalProperties() {
        if (this.properties.state == 'stack') {
            // Restoring Bottom and Right values from last modal
            this.setPosition(this.properties.position.bottom, this.properties.position.right);
            // Restoring Height and Left values from last modal
            this.setSize(this.properties.size.height, this.properties.size.width);
        }
    }

    /**
     * Set modal size.
     * @ignore
     */
    recalculateSize() {
        this.wrapper.style.width = this.container.clientWidth - 12 + 'px';
        this.wrapper.style.height = this.container.clientHeight - 38 + 'px';
        this.contentContainer.style.height = parseInt(this.wrapper.offsetHeight - 50) + 'px';
    }

    /**
     * Active and disable visibility of resize buttons in modal window depend on state.
     * @ignore
     */
    setResizeButtonsVisibility() {
        if (this.properties.state == 'stack') {
            this.resizerTL.style.visibility = 'visible';
            this.resizerBR.style.visibility = 'visible';
        }
        else {
            this.resizerTL.style.visibility = 'hidden';
            this.resizerBR.style.visibility = 'hidden';
        }
    }

    /**
     * Makes an object draggable adding mouse and touch events.
     * @ignore
     */
    addListeners() {
        // Button events (maximize, minimize, stack and close).
        this.maximizeDiv.addEventListener('click', this.maximize.bind(this), true);
        this.stackDiv.addEventListener('click', this.stack.bind(this), true);
        this.minimizeDiv.addEventListener('click', this.minimize.bind(this), true);
        this.closeDiv.addEventListener('click', this.cancelAction.bind(this));

        // Mouse events.
        wrs_addEvent(window, 'mousedown', this.startDrag.bind(this));
        wrs_addEvent(window, 'mouseup', this.stopDrag.bind(this));
        wrs_addEvent(window, 'mousemove', this.drag.bind(this));
        wrs_addEvent(window, 'resize', this.onWindowResize.bind(this));
        // Key events.
        wrs_addEvent(window, 'keydown', this.onKeyDown.bind(this));
    }

    /**
     * Removes draggable events from an object.
     * @ignore
     */
    removeListeners() {
        // Mouse events.
        wrs_removeEvent(window, 'mousedown', this.startDrag);
        wrs_removeEvent(window, 'mouseup', this.stopDrag);
        wrs_removeEvent(window, 'mousemove', this.drag);
        wrs_removeEvent(window, 'resize', this.onWindowResize);
    }


    /**
     * Returns mouse or touch coordinates (on touch events ev.ClientX doesn't exists)
     * @param {event} ev mouse or touch event
     * @return {object} with the X and Y coordinates.
     * @ignore
     */
    eventClient(ev) {
        if (typeof(ev.clientX) == 'undefined' && ev.changedTouches) {
            var client = {
                X : ev.changedTouches[0].clientX,
                Y : ev.changedTouches[0].clientY
            };
            return client;
        }
        else {
            client = {
                X : ev.clientX,
                Y : ev.clientY
            };
            return client;
        }
    }

    /**
     * Start drag function: set the object dragDataObject with the draggable object offsets coordinates.
     * when drag starts (on touchstart or mousedown events).
     *
     * @param {event} ev touchstart or mousedown event.
     * @ignore
     */
    startDrag(ev) {
        if (this.properties.state == 'minimized') {
            return;
        }
        if (ev.target.className == 'wrs_modal_title') {
            if(typeof this.dragDataObject === 'undefined' || this.dragDataObject === null) {
                ev = ev || event;
                // Save first click mouse point on screen
                this.dragDataObject = {
                    x: this.eventClient(ev).X,
                    y: this.eventClient(ev).Y
                };
                // Reset last drag position when start drag
                this.lastDrag = {
                    x: "0px",
                    y: "0px"
                };
                // Init right and bottom values for window modal if it isn't exist.
                if(this.container.style.right == ''){
                    this.container.style.right = "0px";
                }
                if(this.container.style.bottom == ''){
                    this.container.style.bottom = "0px";
                }

                // Needed for IE11 for apply disabled mouse events on editor because iexplorer need a dinamic object to apply this property.
                if (this.isIE11()) {
                    // this.iframe.style['position'] = 'relative';
                }
                // Apply class for disable involuntary select text when drag.
                wrs_addClass(document.body, 'wrs_noselect');
                // Obtain screen limits for prevent overflow.
                this.limitWindow = this.getLimitWindow();
            }
        }

    }

    /**
     * UpdatesdragDataObject with the draggable object coordinates when the draggable object is being moved.
     *
     * @param {event} ev touchmouve or mousemove events.
     * @ignore
     */
    drag(ev) {
        if (this.dragDataObject) {
            ev.preventDefault();
            ev = ev || event;
            // Calculate max and min between actual mouse position and limit of screeen. It restric the movement of modal into window.
            var limitY = Math.min(this.eventClient(ev).Y + window.pageYOffset,this.limitWindow.minPointer.y + window.pageYOffset);
            limitY = Math.max(this.limitWindow.maxPointer.y + window.pageYOffset,limitY);
            var limitX = Math.min(this.eventClient(ev).X + window.pageXOffset,this.limitWindow.minPointer.x + window.pageXOffset);
            limitX = Math.max(this.limitWindow.maxPointer.x + window.pageXOffset,limitX);
            // Substract limit with first position to obtain relative pixels increment to the anchor point.
            var dragX = limitX - this.dragDataObject.x + "px";
            var dragY = limitY - this.dragDataObject.y + "px";
            // Save last valid position of modal before window overflow.
            this.lastDrag = {
                x: dragX,
                y:dragY
            };
            // This move modal with hadware acceleration.
            this.container.style.transform = "translate3d(" + dragX + "," + dragY + ",0)";
            this.container.style.position = 'absolute';
        }
        if (this.resizeDataObject) {
            var limitX = Math.min(this.eventClient(ev).X,window.innerWidth - this.scrollbarWidth - 7);
            var limitY = Math.min(this.eventClient(ev).Y,window.innerHeight - 7);
            if (limitX < 0) {
                limitX = 0;
            }

            if (limitY < 0) {
                limitY = 0;
            }

            var scaleMultiplier;
            if (this.leftScale) {
                scaleMultiplier = -1;
            }
            else {
                scaleMultiplier = 1;
            }
            this.container.style.width = this.initialWidth + scaleMultiplier * (limitX - this.resizeDataObject.x) + 'px';
            this.container.style.height = this.initialHeight + scaleMultiplier * (limitY - this.resizeDataObject.y) + 'px';
            if (!this.leftScale) {
                if (this.resizeDataObject.x - limitX - this.initialWidth < -580) {
                    this.container.style.right = this.initialRight - (limitX - this.resizeDataObject.x) + 'px';
                }
                else {
                    this.container.style.right  = this.initialRight + this.initialWidth - 580 + "px";
                    this.container.style.width = "580px";
                }
                if (this.resizeDataObject.y - limitY < this.initialHeight - 338) {
                    this.container.style.bottom = this.initialBottom - (limitY - this.resizeDataObject.y) + 'px';
                }
                else {
                    this.container.style.bottom  = this.initialBottom + this.initialHeight - 338 + "px";
                    this.container.style.height = "338px";
                }
            }
            this.recalculateScale();
            this.recalculatePosition();
        }
    }
    /**
     * Get limits of actual window to limit modal movement
     * @return {Object} Object containing mouseX and mouseY are coordinates of actual mouse on screen.
     * @ignore
     */
    getLimitWindow() {
        // Obtain dimentions of window page.
        var maxWidth = window.innerWidth;
        var maxHeight = window.innerHeight;

        // Calculate relative position of mouse point into window.
        var offSetToolbarY = (this.container.offsetHeight + parseInt(this.container.style.bottom)) - (maxHeight - (this.dragDataObject.y - window.pageXOffset));
        var offSetToolbarX = maxWidth - this.scrollbarWidth - (this.dragDataObject.x - window.pageXOffset) - parseInt(this.container.style.right);

        // Calculate limits with sizes of window, modal and mouse position.
        var minPointerY = maxHeight - this.container.offsetHeight + offSetToolbarY;
        var maxPointerY = this.title.offsetHeight - (this.title.offsetHeight - offSetToolbarY);
        var minPointerX = maxWidth - offSetToolbarX - this.scrollbarWidth;
        var maxPointerX = (this.container.offsetWidth - offSetToolbarX);
        var minPointer = {x: minPointerX,y: minPointerY};
        var maxPointer = {x: maxPointerX,y: maxPointerY};
        return {minPointer : minPointer, maxPointer:maxPointer};
    }
    /**
     * Get Scrollbar width size of browser
     * @ignore
     */
    getScrollBarWidth() {
        // Create a paragraph with full width of page.
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        // Create a hidden div to compare sizes.
        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var widthOuter = inner.offsetWidth;

        // Change type overflow of paragraph for measure scrollbar.
        outer.style.overflow = 'scroll';
        var widthInner = inner.offsetWidth;

        // If measure is the same, we compare with internal div.
        if (widthOuter == widthInner) {
            widthInner = outer.clientWidth;
        }
        document.body.removeChild(outer);

        return (widthOuter - widthInner);
    }

    /**
     * Set the dragDataObject to null when the drag finish (touchend or mouseup events).
     *
     * @param {event} ev touchend or mouseup event.
     * @ignore
     */
    stopDrag(ev) {
        // Due to we have multiple events that call this function, we need only to execute the next modifiers one time,
        // when the user stops to drag and dragDataObject is not null (the object to drag is attached).
        if (this.dragDataObject || this.resizeDataObject) {
            // If modal doesn't change, it's not necessary to set position with interpolation
            if(this.container.style.position != 'fixed'){
                this.container.style.position = 'fixed';
                // Fixed position makes the coords relative to the main window. So that, we need to transform
                // the absolute coords to relative.
                this.container.style.transform = '';
                if (this.dragDataObject) {
                    this.container.style.right = parseInt(this.container.style.right) - parseInt(this.lastDrag.x) + pageXOffset + "px";
                    this.container.style.bottom = parseInt(this.container.style.bottom) - parseInt(this.lastDrag.y) + pageYOffset + "px";
                }
            }
            // We make focus on editor after drag modal windows to prevent lose focus.
            this.focus();
            // Restore mouse events on iframe
            // this.iframe.style['pointer-events'] = 'auto';
            document.body.style['user-select'] = '';
            // Restore static state of iframe if we use iexplorer
            if (this.isIE11()) {
                // this.iframe.style['position'] = null;
            }
            // Active text select event
            wrs_removeClass(document.body, 'wrs_noselect');
            // Disable overlay for click behind modal
            if (this.properties.state != "maximized") {
                this.overlay.style.display = "none";
            }
        }
        this.dragDataObject = null;
        this.resizeDataObject = null;
        this.initialWidth = null;
        this.leftScale = null;
    }

    /**
     * Recalculating scale for modal when resize browser window *
     * @ignore
     */
    onWindowResize() {
        this.recalculateScrollBar();
        this.recalculatePosition();
        this.recalculateScale();
    }

    /**
     * Keydown events:
     * Esc key close modal window.
     * Tab key tab to submit button.
     * @param {event} ev
     */
    onKeyDown(ev) {
        if (ev.key !== undefined && ev.repeat === false) {
            // Code for detect Esc event
            if (ev.key === "Escape" || ev.key === 'Esc') {
                this.cancelAction();
            }
            // Code for detect Tab event
            if (ev.key === "Tab") {
                this.submitButton.focus();
                ev.preventDefault();
            }
        }
    }
    /**
     * Recalculating position for modal when resize browser window
     * @ignore
     */
    recalculatePosition() {
        this.container.style.right = Math.min(parseInt(this.container.style.right), window.innerWidth - this.scrollbarWidth - this.container.offsetWidth) + "px";
        if(parseInt(this.container.style.right) < 0) {
            this.container.style.right = "0px";
        }
        this.container.style.bottom = Math.min(parseInt(this.container.style.bottom), window.innerHeight - this.container.offsetHeight) + "px";
        if(parseInt(this.container.style.bottom) < 0) {
            this.container.style.bottom = "0px";
        }
    }

    /**
     * Recalculating scale for modal when resize browser window
     * @ignore
     */
    recalculateScale() {
        var sizeModificated = false;
        if (parseInt(this.container.style.width) > 580) {
            this.container.style.width = Math.min(parseInt(this.container.style.width), window.innerWidth - this.scrollbarWidth) + "px";
            sizeModificated = true;
        }
        else {
            this.container.style.width = "580px";
            sizeModificated = true;
        }
        if (parseInt(this.container.style.height) > 338) {
            this.container.style.height = Math.min(parseInt(this.container.style.height), window.innerHeight) + "px";
            sizeModificated = true;
        }
        else {
            this.container.style.height = "338px";
            sizeModificated = true;
        }
        if (sizeModificated) {
            this.recalculateSize();
        }
    }

    /**
     * Recalculating width of scrollBar browser
     * @ignore
     */
    recalculateScrollBar() {
        this.hasScrollBar = window.innerWidth > document.documentElement.clientWidth;
        if(this.hasScrollBar){
            this.scrollbarWidth = this.getScrollBarWidth();
        }
        else {
            this.scrollbarWidth = 0;
        }
    }

    /**
     * Hide soft keyboards on IOS systems.
     * @ignore
     */
    hideKeyboard() {
        document.activeElement.blur();
    }

    /**
     * Focus to content object
     * @ignore
     */
    focus() {
        if (this.contentElement != null && typeof this.contentElement.focus !== 'undefined') {
            this.contentElement.focus();
        }
    }

    /**
     * Returns true when the device is on portrait mode.
     * @ignore
     */
    portraitMode() {
        return window.innerHeight > window.innerWidth;
    }

    /**
     * Change container sizes when the keyboard is opened on iOS.
     * @ignore
     */
    openedIosSoftkeyboard() {
        if (!this.iosSoftkeyboardOpened && this.iosDivHeight != null && this.iosDivHeight == "100" + this.iosMeasureUnit) {
            if (this.portraitMode()) {
                this.setContainerHeight("63" + this.iosMeasureUnit);
            }
            else {
                this.setContainerHeight("40" + this.iosMeasureUnit);
            }
        }
        this.iosSoftkeyboardOpened = true;
    }

    /**
     * Change container sizes when the keyboard is closed on iOS.
     * @ignore
     */
    closedIosSoftkeyboard() {
        this.iosSoftkeyboardOpened = false;
        this.setContainerHeight("100" + this.iosMeasureUnit);
    }

    /**
     * Change container sizes when orientation is changed on iOS.
     * @ignore
     */
    orientationChangeIosSoftkeyboard() {
        if (this.iosSoftkeyboardOpened) {
            if (this.portraitMode()) {
                this.setContainerHeight("63" + this.iosMeasureUnit);
            }
            else {
                this.setContainerHeight("40" + this.iosMeasureUnit);
            }
        }
        else {
            this.setContainerHeight("100" + this.iosMeasureUnit);
        }
    }

    /**
     * Change container sizes when orientation is changed on Android.
     * @ignore
     */
    orientationChangeAndroidSoftkeyboard() {
        this.setContainerHeight("100%");
    }

    /**
     * Set iframe container height.
     * @ignore
     */
    setContainerHeight(height) {
        this.iosDivHeight = height;
        this.wrapper.style.height = height;
        // this.editor.getElement().style.height = (this.container.offsetHeight -10) - this.controlsDiv.offsetHeight + 'px';
    }

    /**
     * Check content of editor before close action
     * @ignore
     */
    showPopUpMessage() {
        if (this.properties.state == 'minimized') {
            this.stack();
        }
        this.popup.show();
    }

    setTitle(title) {
        this.title.innerHTML = title;
    }
}