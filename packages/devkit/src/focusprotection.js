/**
 * This module provides protection against external focus management scripts
 * that might interfere with the MathType editor modal.
 */

/**
 * focusProtection function creates and returns methods to prevent external scripts from
 * interfering with the focus of the MathType modal dialog.
 *
 * @returns {Object} An object with protect and unprotect methods.
 */
const focusProtection = () => {
  /**
   * Initialize focus protection on the given modal element.
   *
   * @param {HTMLElement} modalElement - The modal element to protect
   * @param {HTMLElement} overlayElement - The overlay element of the modal (not used in current implementation)
   * @param {HTMLElement} editorElement - The editor element inside the modal
   */
  const protect = (modalElement, overlayElement, editorElement) => {
    if (!modalElement || !overlayElement || !editorElement) {
      console.warn("FocusProtection: Missing required elements");
      return;
    }

    // Apply the focus protection
    overrideFocusBehavior(modalElement, editorElement);
  };

  /**
   * Apply focus protection by overriding focus-related methods
   *
   * @param {HTMLElement} modalElement - The modal element
   * @param {HTMLElement} editorElement - The editor element to keep focused
   * @private
   */
  const overrideFocusBehavior = (modalElement, editorElement) => {
    // Store original focus methods to be able to restore them
    const originalElementFocus = HTMLElement.prototype.focus;
    const originalElementBlur = HTMLElement.prototype.blur;

    // Override the focus method for all elements
    HTMLElement.prototype.focus = function (...args) {
      // If the modal is open and this is not part of the modal, prevent focus
      if (modalElement.style.display !== "none" && !modalElement.contains(this) && this !== document.body) {
        // If some external script is trying to focus another element, prevent it
        // and restore focus to the editor
        if (editorElement) {
          // Use the original focus method to avoid infinite recursion
          originalElementFocus.apply(editorElement, args);
        }
        return;
      }

      // Otherwise, allow the focus to happen
      originalElementFocus.apply(this, args);
    };

    // Store the methods to remove them when the modal is closed
    modalElement.originalElementFocus = originalElementFocus;
    modalElement.originalElementBlur = originalElementBlur;
  };

  /**
   * Remove focus protection from the modal
   *
   * @param {HTMLElement} modalElement - The modal element to unprotect
   */
  const unprotect = (modalElement) => {
    if (!modalElement) {
      return;
    }

    // Restore original focus methods
    if (modalElement.originalElementFocus) {
      HTMLElement.prototype.focus = modalElement.originalElementFocus;
      delete modalElement.originalElementFocus;
    }

    if (modalElement.originalElementBlur) {
      HTMLElement.prototype.blur = modalElement.originalElementBlur;
      delete modalElement.originalElementBlur;
    }
  };

  return {
    protect,
    unprotect,
  };
};

export default focusProtection;
