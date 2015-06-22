var matches = function(el, selector) {
  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
};

var getClosest = function(element, selector) {
  for (; element && element !== document; element = element.parentNode) {
    if (matches(element, selector)) {
      return element;
    }
  }

  return false;
};

var getParents = function(element, selector) {
  var parents = [];

  for (; element && element !== document; element = element.parentNode) {
    if (!selector || (selector && matches(element, selector))) {
      parents.push(element);
    }
  }

  if (parents.length) {
    return parents;
  }

  return null;
};

