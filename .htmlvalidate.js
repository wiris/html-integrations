module.exports = {
    "extends": [
      "htmlvalidate:recommended"
    ],

    "rules": {
      "close-order": "error", // Throws error if the closure is bad: wrong order, not closed, closed but not initialyzed, etc.
      
      // Let "bad" content to be inside the incorrect brackets. This is because demos need to have the tag script inside html
      // TODO: Study a better way to put this in order to now shuting down all the unpermited other contents
      "element-permitted-content": "off",
      "void-style": "off" // Disables having some elements to be stricted with the closure for react html. TODO: Study a better wat to do it in react apps and delete the rule
    }
  }