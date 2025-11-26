/**
 * Utility functions for DOM manipulation that accept DOM node references as parameters
 * This approach improves testability and SSR compatibility
 */

/**
 * Gets an element by ID from a specific document or element scope
 * @param {Document|HTMLElement} scope - Document or element to search within
 * @param {string} id - Element ID to find
 * @returns {HTMLElement|null} Found element or null
 */
function getElementById(scope, id) {
  if (!scope) return null;
  return scope.getElementById ? scope.getElementById(id) : scope.querySelector(`#${id}`);
}

/**
 * Creates an element with specified tag name
 * @param {Document} doc - Document object to create element in
 * @param {string} tagName - Tag name for the element
 * @returns {HTMLElement} Created element
 */
function createElement(doc, tagName) {
  if (!doc || !doc.createElement) {
    throw new Error('Invalid document object provided');
  }
  return doc.createElement(tagName);
}

/**
 * Sets text content of an element
 * @param {HTMLElement} element - Element to update
 * @param {string} text - Text content to set
 */
function setTextContent(element, text) {
  if (element) {
    element.textContent = text;
  }
}

/**
 * Sets inner HTML of an element
 * @param {HTMLElement} element - Element to update
 * @param {string} html - HTML content to set
 */
function setInnerHTML(element, html) {
  if (element) {
    element.innerHTML = html;
  }
}

/**
 * Adds a class to an element
 * @param {HTMLElement} element - Element to update
 * @param {...string} classNames - Class names to add
 */
function addClass(element, ...classNames) {
  if (element && element.classList) {
    element.classList.add(...classNames);
  }
}

/**
 * Removes a class from an element
 * @param {HTMLElement} element - Element to update
 * @param {string} className - Class name to remove
 */
function removeClass(element, className) {
  if (element && element.classList) {
    element.classList.remove(className);
  }
}

/**
 * Sets a style property on an element
 * @param {HTMLElement} element - Element to update
 * @param {string} property - CSS property name
 * @param {string} value - CSS property value
 */
function setStyle(element, property, value) {
  if (element && element.style) {
    element.style[property] = value;
  }
}

/**
 * Gets a style property from an element
 * @param {HTMLElement} element - Element to query
 * @param {string} property - CSS property name
 * @returns {string} CSS property value
 */
function getStyle(element, property) {
  if (element && element.style) {
    return element.style[property];
  }
  return '';
}

/**
 * Sets an attribute on an element
 * @param {HTMLElement} element - Element to update
 * @param {string} name - Attribute name
 * @param {string} value - Attribute value
 */
function setAttribute(element, name, value) {
  if (element && element.setAttribute) {
    element.setAttribute(name, value);
  }
}

/**
 * Gets an attribute from an element
 * @param {HTMLElement} element - Element to query
 * @param {string} name - Attribute name
 * @returns {string|null} Attribute value or null
 */
function getAttribute(element, name) {
  if (element && element.getAttribute) {
    return element.getAttribute(name);
  }
  return null;
}

/**
 * Appends a child element to a parent
 * @param {HTMLElement} parent - Parent element
 * @param {HTMLElement} child - Child element to append
 */
function appendChild(parent, child) {
  if (parent && child) {
    parent.appendChild(child);
  }
}

/**
 * Clears all children from an element
 * @param {HTMLElement} element - Element to clear
 */
function clearChildren(element) {
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

/**
 * Adds an event listener to an element
 * @param {HTMLElement} element - Element to attach listener to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 */
function addEventListener(element, event, handler) {
  if (element && element.addEventListener) {
    element.addEventListener(event, handler);
  }
}

/**
 * Removes an event listener from an element
 * @param {HTMLElement} element - Element to remove listener from
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 */
function removeEventListener(element, event, handler) {
  if (element && element.removeEventListener) {
    element.removeEventListener(event, handler);
  }
}

// Export all utility functions
export {
  getElementById,
  createElement,
  setTextContent,
  setInnerHTML,
  addClass,
  removeClass,
  setStyle,
  getStyle,
  setAttribute,
  getAttribute,
  appendChild,
  clearChildren,
  addEventListener,
  removeEventListener
};