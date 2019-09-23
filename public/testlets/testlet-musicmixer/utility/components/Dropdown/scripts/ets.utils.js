var ETS = ETS || {};

/*  Key code constants*/
ETS.KeyCode = {
  BACKSPACE: 8,
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46
};

ETS.Utils = ETS.Utils || {};

// Polyfill
ETS.Utils.matches = function(element, selector) {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        var matches = element.parentNode.querySelectorAll(s);
        var i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  return element.matches(selector);
};

ETS.Utils.remove = function(item) {
  if (item.remove && typeof item.remove === "function") {
    return item.remove();
  }
  if (item.parentNode && item.parentNode.removeChild && typeof item.parentNode.removeChild === "function") {
    return item.parentNode.removeChild(item);
  }
  return false;
};

ETS.Utils.isFocusable = function(element) {
  if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute("tabIndex") !== null)) {
    return true;
  }

  if (element.disabled) {
    return false;
  }

  switch (element.nodeName) {
    case "A":
      return !!element.href && element.rel != "ignore";
    case "INPUT":
      return element.type != "hidden" && element.type != "file";
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA":
      return true;
    default:
      return false;
  }
};

ETS.Utils.getAncestorBySelector = function(element, selector) {
  if (!ETS.Utils.matches(element, selector + " " + element.tagName)) {
    // Element is not inside an element that matches selector
    return null;
  }

  // Move up the DOM tree until a parent matching the selector is found
  var currentNode = element;
  var ancestor = null;
  while (ancestor === null) {
    if (ETS.Utils.matches(currentNode.parentNode, selector)) {
      ancestor = currentNode.parentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return ancestor;
};

ETS.Utils.hasClass = function(element, className) {
  return new RegExp("(\\s|^)" + className + "(\\s|$)").test(element.className);
};

ETS.Utils.addClass = function(element, className) {
  if (!ETS.Utils.hasClass(element, className)) {
    element.className += " " + className;
  }
};

ETS.Utils.removeClass = function(element, className) {
  var classRegex = new RegExp("(\\s|^)" + className + "(\\s|$)");
  element.className = element.className.replace(classRegex, " ").trim();
};
