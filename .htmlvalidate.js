module.exports = {
    "extends": [
      "htmlvalidate:recommended"
    ],

    "rules": {
      // Throws error if the closure is bad: wrong order, not closed, closed but 
      // not initialyzed, etc.
      "close-order": "error",      
      // Disables having some elements to be stricted with the closure for react html.
      // TODO: Study a better wat to do it in react apps and delete the rule.
      "void-style": "off"
    }
  }