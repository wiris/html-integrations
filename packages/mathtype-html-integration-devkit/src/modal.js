import PopUpMessage from './popupmessage.js';
import Core from './core.src.js';
import Util from './util.js';
import Configuration from './configuration.js';
import Listeners from './listeners';
import ContentManager from './contentmanager.js';



/**
 * This class represents a modal dialog. The modal dialog admits a ContentManager instance in order
 * to manage the content of the dialog.
 */
export default class ModalDialog {

    /**
     * Modal dialog constructor
     * @param {Object} modalDialogAttributes  - An object containing all modal dialog attributes.
     */
    constructor(modalDialogAttributes) {
        this.attributes = modalDialogAttributes

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

        // TODO: Detect isMobile without using editor metrics.
        var isMobile = (landscape && this.attributes.height > deviceHeight) || (portrait && this.attributes.width > deviceWidth) ? true : false;

        // Obtain number of current instance
        this.instanceId = document.getElementsByClassName("wrs_modal_dialogContainer").length;

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

        /**
         * Object to keep website's style before change it on lock scroll for mobile devices.
         * @type {Object}
         * @property {String} bodyStylePosition - previous body style postion.
         * @property {String} bodyStyleOverflow - previous body style overflow.
         * @property {String} htmlStyleOverflow - previous body style overflow.
         * @property {String} windowScrollX - previous window's scroll Y.
         * @property {String} windowScrollY - previous window's scroll X.
         */
        this.websiteBeforeLockParameters = null;

        var attributes = {};
        attributes.class = 'wrs_modal_overlay';
        attributes.id = this.getElementId(attributes.class);
        this.overlay = Util.createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_title_bar';
        attributes.id = this.getElementId(attributes.class);
        this.titleBar = Util.createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_title';
        attributes.id = this.getElementId(attributes.class);
        this.title = Util.createElement('div', attributes);
        this.title.innerHTML = '';

        attributes = {};
        attributes.class = 'wrs_modal_close_button';
        attributes.id = this.getElementId(attributes.class);
        attributes.title = Core.getStringManager().getString('close');
        this.closeDiv = Util.createElement('a', attributes);;
        this.closeDiv.setAttribute('role','button');

        attributes = {};
        attributes.class = 'wrs_modal_stack_button';
        attributes.id = this.getElementId(attributes.class);
        attributes.title = "Exit full-screen";
        this.stackDiv = Util.createElement('a', attributes);
        this.stackDiv.setAttribute('role','button');

        attributes = {};
        attributes.class = 'wrs_modal_maximize_button';
        attributes.id = this.getElementId(attributes.class);
        attributes.title = Core.getStringManager().getString('fullscreen');
        this.maximizeDiv = Util.createElement('a', attributes);
        this.maximizeDiv.setAttribute('role','button');

        attributes = {};
        attributes.class = 'wrs_modal_minimize_button';
        attributes.id = this.getElementId(attributes.class);
        attributes.title = Core.getStringManager().getString('minimise');
        this.minimizeDiv = Util.createElement('a', attributes);
        this.minimizeDiv.setAttribute('role','button');

        attributes = {};
        attributes.class = 'wrs_modal_dialogContainer';
        attributes.id = this.getElementId(attributes.class);
        this.container = Util.createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_wrapper';
        attributes.id = this.getElementId(attributes.class);
        this.wrapper = Util.createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_content_container';
        attributes.id = this.getElementId(attributes.class);
        this.contentContainer = Util.createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_controls';
        attributes.id = this.getElementId(attributes.class);
        this.controls = Util.createElement('div', attributes);

        attributes = {};
        attributes.class = 'wrs_modal_buttons_container';
        attributes.id = this.getElementId(attributes.class);
        this.buttonContainer = Util.createElement('div', attributes);

        // Buttons: all button must be created using createSubmitButton method.
        this.submitButton = this.createSubmitButton(
            {
                id: this.getElementId('wrs_modal_button_accept'),
                class: 'wrs_modal_button_accept',
                innerHTML: Core.getStringManager().getString('accept')
            },
            this.submitAction.bind(this)
        );

        this.cancelButton = this.createSubmitButton(
            {
                id: this.getElementId('wrs_modal_button_cancel'),
                class: 'wrs_modal_button_cancel',
                innerHTML: Core.getStringManager().getString('cancel')
            },
            this.cancelAction.bind(this)
        );

        this.contentManager = null;

        // Overlay popup.
        var popupStrings = {
            'cancelString' : Core.getStringManager().getString('cancel'),
            'submitString' : Core.getStringManager().getString('close'),
            'message' : Core.getStringManager().getString('close_modal_warning')
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

         /**
         * Indicates if directionality of the modal dialog is RTL. false by default.
         * @type {boolean}
         */
        this.rtl = false;
        if ('rtl' in this.attributes) {
            this.rtl = this.attributes.rtl;
        }

        // Event handlers need modal instance context.
        this.handleOpenedIosSoftkeyboard = this.handleOpenedIosSoftkeyboard.bind(this);
        this.handleClosedIosSoftkeyboard = this.handleClosedIosSoftkeyboard.bind(this);
    }
    /**
     * This method sets an ContentManager instance to ModalDialog. ContentManager
     * manages the logic of ModalDialog content: submit, update, close and changes.
     * @param {ContentManager} contentManager - ContentManager instance.
     */
    setContentManager(contentManager) {
        this.contentManager = contentManager;
    }

    /**
     * Returns the modal contentElement object.
     * @returns {ContentManager} the instance of the ContentManager class.
    */
    getContentManager() {
        return this.contentManager;
    }

    /**
     * This method is called when the modal object has been submitted. Calls
     * contentElement submitAction method - if exists - and closes the modal
     * object. No logic about the content should be placed here,
     * contentElement.submitAction is the responsible of the content logic.
     */
    submitAction() {
        if (typeof this.contentManager.submitAction !== 'undefined') {
            this.contentManager.submitAction();
        }
        this.close();
    }

    /**
     * This method is called when the modal object has been cancelled. If
     * contentElement has implemented hasChanges method, a confirm popup
     * will be shown if hasChanges returns true.
     */
    cancelAction() {
        if (typeof this.contentManager.hasChanges === 'undefined') {
            this.close();
        } else if (!this.contentManager.hasChanges()){
            this.close();
        } else {
            this.showPopUpMessage();
        }
    }

    /**
     * Returns a button element.
     * @param {Object} properties - input button properties.
     * @param {string} properties.class - input button class.
     * @param {string} properties.innerHTML - input button innerHTML.
     * @param {Object} callback - callback function associated to click event.
     * @returns {HTMLButtonElement} the button element.
     *
     */
    createSubmitButton(properties, callback) {
        function SubmitButton(properties, callback) {
            this.element = document.createElement('button');
            this.element.id = properties.id;
            this.element.className = properties.class;
            this.element.innerHTML = properties.innerHTML;
            Util.addEvent(this.element, 'click', callback);
        }

        SubmitButton.prototype.getElement = function() {
            return this.element;
        }

        return new SubmitButton(properties, callback).getElement();
    }

    /**
     * Creates the modal window object inserting a contentElement object.
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
            if (Configuration.get('modalWindowFullScreen')) {
                this.maximize();
            }
        }
        else if (this.deviceProperties['isAndroid']) {
            this.createModalWindowAndroid();
        }
        else if (this.deviceProperties['isIOS'] && !this.deviceProperties['isMobile']) {
            this.createModalWindowIos();
        }

        if (this.contentManager != null) {
            this.contentManager.insert(this);
        }

        this.properties.open = true;
        this.properties.created = true;

        // Checks language directionality.
        if (this.isRTL()) {
            this.container.style.right = window.innerWidth - this.scrollbarWidth - this.container.offsetWidth + 'px';
            this.container.className += ' wrs_modal_rtl';
        }
    }

    /**
     * Creates a button in the modal object to resize it.
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
        Util.addEvent(this.resizerBR, 'mousedown', this.activateResizeStateBR.bind(this));
        Util.addEvent(this.resizerTL, 'mousedown', this.activateResizeStateTL.bind(this));
    }

    /**
     * Initialize variables for Bottom-Right resize button
     * @param {MouseEvent} mouseEvent - mouse event.
     */
    activateResizeStateBR(mouseEvent) {
        this.initializeResizeProperties(mouseEvent, false);
    }

    /**
     * Initialize variables for Top-Left resize button
     * @param {MouseEvent} mouseEvent - mouse event.
     */
    activateResizeStateTL(mouseEvent) {
        this.initializeResizeProperties(mouseEvent, true);
    }

    /**
     * Common method to initialize variables at resize
     * @param {MouseEvent} mouseEvent - mouse event.
     */
    initializeResizeProperties(mouseEvent, leftOption) {
        // Apply class for disable involuntary select text when drag.
        Util.addClass(document.body, 'wrs_noselect');
        Util.addClass(this.overlay, 'wrs_overlay_active');
        this.resizeDataObject = {
            x: this.eventClient(mouseEvent).X,
            y: this.eventClient(mouseEvent).Y
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
     * if exists. By default the modal object opens in stack mode.
     */
    open() {
        //Removing close class.
        this.removeClass('wrs_closed');
        // Hiding keyboard for mobile devices.
        if (this.deviceProperties['isIOS'] || this.deviceProperties['isAndroid'] || this.deviceProperties['isMobile']) {
            // Restore scale to 1
            this.restoreWebsiteScale();
            this.lockWebsiteScroll();
            // Due to editor wait we need to wait until editor focus.
            setTimeout(function() { this.hideKeyboard() }.bind(this), 400);
        }

        // New modal window. He need to create the whole object.
        if (!this.properties.created) {
            this.create();
        }
        else {
            // Previous state closed. Open method can be called even the previous state is open,
            // for example updating the content of the modal object.
            if (!this.properties.open) {
                this.properties.open = true;

                // Restoring the previous open state: if the modal object has been closed
                // re-open it should preserve the state and the metrics.
                if (!this.deviceProperties.isAndroid && !this.deviceProperties.isIOS) {
                    this.restoreState();
                }
            }

            // Maximize window only when the configuration is set and the device is not iOs or Android.
            if (this.deviceProperties['isDesktop'] && Configuration.get('modalWindowFullScreen')) {
                this.maximize();
            }

            // In iOS we need to recalculate the size of the modal object because
            // iOS keyboard is a float div which can overlay the modal object.
            if (this.deviceProperties['isIOS']) {
                this.iosSoftkeyboardOpened = false;
                this.setContainerHeight("100" + this.iosMeasureUnit);
            }
        }

        if (this.contentManager.isEditorLoaded === false) {
            var listener = Listeners.newListener('onLoad', function() {
                this.contentManager.onOpen(this);
            }.bind(this));
            this.contentManager.addListener(listener)
        } else {
            this.contentManager.onOpen(this);
        }

    }

    /**
     * Closes modal window and restores viewport header.
     */
    close() {
        this.removeClass('wrs_maximized');
        this.removeClass('wrs_minimized');
        this.removeClass('wrs_stack');
        this.addClass('wrs_closed');
        this.saveModalProperties();
        this.unlockWebsiteScroll();
        this.properties.open = false;
    }

    /**
     * Sets the website scale to one.
     */
    restoreWebsiteScale() {
        let viewportmeta = document.querySelector('meta[name=viewport]');
        // Let the equal symbols in order to search and make meta's final content.
        let contentAttrsToUpdate = ['initial-scale=', 'minimum-scale=', 'maximum-scale='];
        let contentAttrsValuesToUpdate = ['1.0', '1.0', '1.0'];
        let setMetaAttrFunc = (viewportelement, contentAttrsToUpdate) => {
            let contentAttr = viewportelement.getAttribute('content');
            // If it exists, we need to maintain old values and put our values.
            if (contentAttr) {
                let attrArray = contentAttr.split(',');
                let finalContentMeta = "";
                let oldAttrs = [];
                for (let i = 0; i < attrArray.length; i++) {
                    let isAttrToUpdate = false;
                    let j = 0;
                    while (!isAttrToUpdate && j < contentAttrsToUpdate.length) {
                        if (attrArray[i].indexOf(contentAttrsToUpdate[j])) {
                            isAttrToUpdate = true;
                        }

                        j++;
                    }

                    if (!isAttrToUpdate) {
                        oldAttrs.push(attrArray[i]);
                    }
                }

                for (let i = 0; i < contentAttrsToUpdate.length; i++) {
                    let attr = contentAttrsToUpdate[i] + contentAttrsValuesToUpdate[i];
                    finalContentMeta += i == 0 ? attr : ',' + attr;
                }

                for (let i = 0; i < oldAttrs.length; i++) {
                    finalContentMeta += ',' + oldAttrs[i];
                }
                viewportelement.setAttribute('content', finalContentMeta);
                // It needs to set to empty because setAttribute refresh only when attribute is different.
                viewportelement.setAttribute('content', '');
                viewportelement.setAttribute('content', contentAttr);
            }
            else {
                viewportelement.setAttribute('content', 'initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0');
                viewportelement.removeAttribute('content');
            }
        };

        if (!viewportmeta) {
            viewportmeta = document.createElement('meta');
            document.getElementsByTagName('head')[0].appendChild(viewportmeta);
            setMetaAttrFunc(viewportmeta, contentAttrsToUpdate, contentAttrsValuesToUpdate);
            viewportmeta.remove();
        }
        else {
            setMetaAttrFunc(viewportmeta, contentAttrsToUpdate, contentAttrsValuesToUpdate);
        }
    }

    /**
     * Locks website scroll for mobile devices.
     */
    lockWebsiteScroll() {
        this.websiteBeforeLockParameters = {
            bodyStylePosition: document.body.style.position ? document.body.style.position : '',
            bodyStyleOverflow: document.body.style.overflow ? document.body.style.overflow : '',
            htmlStyleOverflow: document.documentElement.style.overflow ? document.documentElement.style.overflow : '',
            windowScrollX: window.scrollX,
            windowScrollY: window.scrollY
        };
        document.body.style.position = 'fixed';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    /**
     * Unlocks website scroll for mobile devices.
     */
    unlockWebsiteScroll() {
        if (this.websiteBeforeLockParameters) {
            document.body.style.position = this.websiteBeforeLockParameters.bodyStylePosition;
            document.body.style.overflow = this.websiteBeforeLockParameters.bodyStyleOverflow;
            document.documentElement.style.overflow = this.websiteBeforeLockParameters.htmlStyleOverflow;
            window.scrollTo(this.websiteBeforeLockParameters.windowScrollX, this.websiteBeforeLockParameters.windowScrollY);
            this.websiteBeforeLockParameters = null;
        }
    }

    /**
     * Util function to known if browser is IE11.
     * @returns {boolean} true if the browser is IE11. false otherwise.
     */
    isIE11() {
        if (navigator.userAgent.search("Msie/") >= 0 || navigator.userAgent.search("Trident/") >= 0 || navigator.userAgent.search("Edge/") >= 0 ) {
            return true;
        }
        return false;
    }

    /**
     * Returns if the current language type is RTL.
     * @return {boolean} true if current language is RTL. false otherwise.
     */
     isRTL() {
        if (this.attributes.language == 'ar' || this.attributes.language == 'he') {
            return true;
        } else {
            return this.rtl
        };
     }

    /**
     * Adds a class to all modal ModalDialog DOM elements.
     * @param {string} className - class name.
     */
    addClass(className) {
        Util.addClass(this.overlay, className);
        Util.addClass(this.titleBar, className);
        Util.addClass(this.overlay, className);
        Util.addClass(this.container, className);
        Util.addClass(this.contentContainer, className);
        Util.addClass(this.stackDiv, className);
        Util.addClass(this.minimizeDiv, className);
        Util.addClass(this.maximizeDiv, className);
        Util.addClass(this.wrapper, className);
    }

    /**
     * Remove a class from all modal DOM elements.
     * @param {string} className - class name.
     */
    removeClass(className) {
        Util.removeClass(this.overlay, className);
        Util.removeClass(this.titleBar, className);
        Util.removeClass(this.overlay, className);
        Util.removeClass(this.container, className);
        Util.removeClass(this.contentContainer, className);
        Util.removeClass(this.stackDiv, className);
        Util.removeClass(this.minimizeDiv, className);
        Util.removeClass(this.maximizeDiv, className);
        Util.removeClass(this.wrapper, className);
    }

    /**
     * Create modal dialog for desktop.
     */
    createModalWindowDesktop() {
        this.addClass('wrs_modal_desktop');
        this.stack();
    }

    /**
     * Create modal dialog for non android devices.
     */
    createModalWindowAndroid() {
        this.addClass('wrs_modal_android');
        window.addEventListener('resize', this.orientationChangeAndroidSoftkeyboard.bind(this));
    }

    /**
     * Create modal dialog for iOS devices.
     */
    createModalWindowIos() {
        this.addClass('wrs_modal_ios');
        // Refresh the size when the orientation is changed
        window.addEventListener('resize', this.orientationChangeIosSoftkeyboard.bind(this));
    }

    /**
     * Restore previous state, position and size of previous stacked modal dialog.
     */
    restoreState() {
        if (this.properties.state == 'maximized') {
            // Reset states for prevent return to stack state.
            this.maximize();
        } else if (this.properties.state == 'minimized') {
            // Reset states for prevent return to stack state.
            this.properties.state = this.properties.previousState;
            this.properties.previousState = '';
            this.minimize();
        } else {
            this.stack();
        }
    }

    /**
     * Stacks the modal object.
     */
    stack() {
        this.properties.previousState = this.properties.state;
        this.properties.state = 'stack';
        this.removeClass('wrs_maximized');
        this.minimizeDiv.title = "Minimise";
        this.removeClass('wrs_minimized');
        this.addClass('wrs_stack');

        this.restoreModalProperties();

        if (typeof this.resizerBR !== 'undefined' && typeof this.resizerTL !== 'undefined') {
            this.setResizeButtonsVisibility();
        }

        // Need recalculate position of actual modal because window can was changed in fullscreenmode
        this.recalculateScrollBar();
        this.recalculatePosition();
        this.recalculateScale();
        this.focus();
    }

    /**
     * Minimizes the modal object
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

            if (Util.containsClass(this.overlay, 'wrs_stack')) {
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

        if (Util.containsClass(this.overlay, 'wrs_minimized')) {
            this.minimizeDiv.title = "Minimise";
            this.removeClass('wrs_minimized');
        }
        else if (Util.containsClass(this.overlay, 'wrs_stack')) {
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
     * @param {number} height - height of the ModalDialog
     * @param {number} width - width of the ModalDialog.
     */
    setSize(height, width) {
        this.container.style.height = height + 'px';
        this.container.style.width = width + 'px';
        this.recalculateSize();
    }

    /**
     * Sets modal position using bottom and right style attributes.
     * @param  {number} bottom - bottom attribute.
     * @param  {number} right - right attribute.
     */
    setPosition(bottom, right) {
        this.container.style.bottom = bottom + 'px';
        this.container.style.right = right + 'px';
    }

    /**
     * Saves position and size parameters of and open ModalDialog. This attributes
     * are needed to restore it on re-open.
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
     * Restore ModalDialog position and size parameters.
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
     * Sets the modal dialog initial size.
     */
    recalculateSize() {
        this.wrapper.style.width = this.container.clientWidth - 12 + 'px';
        this.wrapper.style.height = this.container.clientHeight - 38 + 'px';
        this.contentContainer.style.height = parseInt(this.wrapper.offsetHeight - 50) + 'px';
    }

    /**
     * Enable or disable visibility of resize buttons in modal window depend on state.
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
     */
    addListeners() {
        // Button events (maximize, minimize, stack and close).
        this.maximizeDiv.addEventListener('click', this.maximize.bind(this), true);
        this.stackDiv.addEventListener('click', this.stack.bind(this), true);
        this.minimizeDiv.addEventListener('click', this.minimize.bind(this), true);
        this.closeDiv.addEventListener('click', this.cancelAction.bind(this));

        // Overlay events (close).
        this.overlay.addEventListener('click', this.cancelAction.bind(this));

        // Mouse events.
        Util.addEvent(window, 'mousedown', this.startDrag.bind(this));
        Util.addEvent(window, 'mouseup', this.stopDrag.bind(this));
        Util.addEvent(window, 'mousemove', this.drag.bind(this));
        Util.addEvent(window, 'resize', this.onWindowResize.bind(this));
        // Key events.
        Util.addEvent(window, 'keydown', this.onKeyDown.bind(this));
    }

    /**
     * Removes draggable events from an object.
     */
    removeListeners() {
        // Mouse events.
        Util.removeEvent(window, 'mousedown', this.startDrag);
        Util.removeEvent(window, 'mouseup', this.stopDrag);
        Util.removeEvent(window, 'mousemove', this.drag);
        Util.removeEvent(window, 'resize', this.onWindowResize);
        // Key events
        Util.removeEvent(window, 'keydown', this.onKeyDown);
    }


    /**
     * Returns mouse or touch coordinates (on touch events ev.ClientX doesn't exists)
     * @param {MouseEvent} mouseEvent - mouse event.
     * @return {Object} with the X and Y coordinates.
     */
    eventClient(mouseEvent) {
        if (typeof(mouseEvent.clientX) == 'undefined' && mouseEvent.changedTouches) {
            var client = {
                X : mouseEvent.changedTouches[0].clientX,
                Y : mouseEvent.changedTouches[0].clientY
            };
            return client;
        }
        else {
            client = {
                X : mouseEvent.clientX,
                Y : mouseEvent.clientY
            };
            return client;
        }
    }

    /**
     * Start drag function: set the object dragDataObject with the draggable object offsets coordinates.
     * when drag starts (on touchstart or mousedown events).
     * @param {MouseEvent} mouseEvent - touchstart or mousedown event.
     */
    startDrag(mouseEvent) {
        if (this.properties.state == 'minimized') {
            return;
        }
        if (mouseEvent.target === this.title) {
            if(typeof this.dragDataObject === 'undefined' || this.dragDataObject === null) {
                mouseEvent = mouseEvent || event;
                // Save first click mouse point on screen
                this.dragDataObject = {
                    x: this.eventClient(mouseEvent).X,
                    y: this.eventClient(mouseEvent).Y
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
                Util.addClass(document.body, 'wrs_noselect');
                Util.addClass(this.overlay, 'wrs_overlay_active');
                // Obtain screen limits for prevent overflow.
                this.limitWindow = this.getLimitWindow();
            }
        }

    }

    /**
     * Updates dragDataObject with the draggable object coordinates when the draggable object is being moved.
     * @param {MouseEvent} mouseEvent - the mouse event.
     */
    drag(mouseEvent) {
        if (this.dragDataObject) {
            mouseEvent.preventDefault();
            mouseEvent = mouseEvent || event;
            // Calculate max and min between actual mouse position and limit of screeen. It restric the movement of modal into window.
            var limitY = Math.min(this.eventClient(mouseEvent).Y,this.limitWindow.minPointer.y);
            limitY = Math.max(this.limitWindow.maxPointer.y,limitY);
            var limitX = Math.min(this.eventClient(mouseEvent).X,this.limitWindow.minPointer.x);
            limitX = Math.max(this.limitWindow.maxPointer.x,limitX);
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
        }
        if (this.resizeDataObject) {
            var limitX = Math.min(this.eventClient(mouseEvent).X,window.innerWidth - this.scrollbarWidth - 7);
            var limitY = Math.min(this.eventClient(mouseEvent).Y,window.innerHeight - 7);
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
     * Returns the boundaries of actual window to limit modal movement.
     * @return {Object} Object containing mouseX and mouseY coordinates of actual mouse on screen.
     */
    getLimitWindow() {
        // Obtain dimensions of window page.
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
     * Returns the scrollbar width size of browser
     * @returns {number} the scrollbar width.
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
     * Set the dragDataObject to null.
     */
    stopDrag() {
        // Due to we have multiple events that call this function, we need only to execute the next modifiers one time,
        // when the user stops to drag and dragDataObject is not null (the object to drag is attached).
        if (this.dragDataObject || this.resizeDataObject) {
            // If modal doesn't change, it's not necessary to set position with interpolation
            this.container.style.transform = '';
            if (this.dragDataObject) {
                this.container.style.right = parseInt(this.container.style.right) - parseInt(this.lastDrag.x) + "px";
                this.container.style.bottom = parseInt(this.container.style.bottom) - parseInt(this.lastDrag.y) + "px";
            }
            // We make focus on editor after drag modal windows to prevent lose focus.
            this.focus();
            // Restore mouse events on iframe
            // this.iframe.style['pointer-events'] = 'auto';
            document.body.style['user-select'] = '';
            // Restore static state of iframe if we use Internet Explorer.
            if (this.isIE11()) {
                // this.iframe.style['position'] = null;
            }
            // Active text select event
            Util.removeClass(document.body, 'wrs_noselect');
            Util.removeClass(this.overlay, 'wrs_overlay_active');
        }
        this.dragDataObject = null;
        this.resizeDataObject = null;
        this.initialWidth = null;
        this.leftScale = null;
    }

    /**
     * Recalculates scale for modal when resize browser window.
     */
    onWindowResize() {
        this.recalculateScrollBar();
        this.recalculatePosition();
        this.recalculateScale();
    }

    /**
     * Triggers keyboard events:
     * - Tab key tab to go to submit button.
     * - Esc key to close the modal dialog.
     * @param {KeyboardEvent} keyboardEvent - the keyboard event.
     */
    onKeyDown(keyboardEvent) {
        if (keyboardEvent.key !== undefined && keyboardEvent.repeat === false) {
            // Code for detect Esc event
            if (keyboardEvent.key === "Escape" || keyboardEvent.key === 'Esc') {
                if (this.properties.open) {
                    this.cancelAction();
                }
            }
            // Code for detect Tab event
            if (keyboardEvent.key === "Tab") {
                this.submitButton.focus();
                keyboardEvent.preventDefault();
            }
        }
    }

    /**
     * Recalculating position for modal dialog when the browser is resized.
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
     * Recalculating scale for modal when the browser is resized.
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
     * Recalculating width of browser scroll bar.
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
     * Hide soft keyboards on iOS devices.
     */
    hideKeyboard() {
        document.activeElement.blur();
    }

    /**
     * Focus to contentManager object.
     */
    focus() {
        if (this.contentManager != null && typeof this.contentManager.onFocus !== 'undefined') {
            this.contentManager.onFocus();
        }
    }

    /**
     * Returns true when the device is on portrait mode.
     */
    portraitMode() {
        return window.innerHeight > window.innerWidth;
    }

    /**
     * Event handler that change container size when IOS softkeyboard is opened.
     */
    handleOpenedIosSoftkeyboard() {
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
     * Event handler that change container size when IOS softkeyboard is closed.
     */
    handleClosedIosSoftkeyboard() {
        this.iosSoftkeyboardOpened = false;
        this.setContainerHeight("100" + this.iosMeasureUnit);
    }

    /**
     * Change container sizes when orientation is changed on iOS.
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
     */
    orientationChangeAndroidSoftkeyboard() {
        this.setContainerHeight("100%");
    }

    /**
     * Set iframe container height.
     * @param {number} height - new height.
     */
    setContainerHeight(height) {
        this.iosDivHeight = height;
        this.wrapper.style.height = height;
    }

    /**
     * Check content of editor before close action.
     */
    showPopUpMessage() {
        if (this.properties.state == 'minimized') {
            this.stack();
        }
        this.popup.show();
    }

    /**
     * Sets the tithle of the modal dialog.
     * @param {string} title - modal dialog title.
     */
    setTitle(title) {
        this.title.innerHTML = title;
    }

    /**
     * Returns the id of an element, adding the instance number to
     * the element class name:
     * className --> className[idNumber]
     * @param {string} className - the element class name.
     * @returns {string} a string appending the instance id to the className.
     */
    getElementId(className) {
        return className + "[" + this.instanceId + "]";
    }
}
