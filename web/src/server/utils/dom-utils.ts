/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utility functions for DOM manipulation that accept DOM node references as parameters
 * This approach improves testability and SSR compatibility
 */

// Type definitions
interface ExtendedHTMLElement extends HTMLElement {
  getElementById?(id: string): HTMLElement | null;
}

/**
 * Gets an element by ID from a specific document or element scope
 * @param scope - Document or element to search within
 * @param id - Element ID to find
 * @returns Found element or null
 */
export function getElementById(
  scope: Document | ExtendedHTMLElement,
  id: string
): HTMLElement | null | any {
  if (!scope) return null;
  return scope.getElementById
    ? scope.getElementById(id)
    : scope.querySelector(`#${id}`);
}

/**
 * Creates an element with specified tag name
 * @param doc - Document object to create element in
 * @param tagName - Tag name for the element
 * @returns Created element
 */
export function createElement(doc: Document, tagName: string): HTMLElement {
  if (!doc || !doc.createElement) {
    throw new Error('Invalid document object provided');
  }
  return doc.createElement(tagName);
}

/**
 * Sets text content of an element
 * @param element - Element to update
 * @param text - Text content to set
 */
export function setTextContent(
  element: HTMLElement | null,
  text: string
): void {
  if (element) {
    element.textContent = text;
  }
}

/**
 * Sets inner HTML of an element
 * @param element - Element to update
 * @param html - HTML content to set
 */
export function setInnerHTML(element: HTMLElement | null, html: string): void {
  if (element) {
    element.innerHTML = html;
  }
}

/**
 * Adds a class to an element
 * @param element - Element to update
 * @param classNames - Class names to add
 */
export function addClass(
  element: HTMLElement | null,
  ...classNames: string[]
): void {
  if (element && element.classList) {
    element.classList.add(...classNames);
  }
}

/**
 * Removes a class from an element
 * @param element - Element to update
 * @param className - Class name to remove
 */
export function removeClass(
  element: HTMLElement | null,
  className: string
): void {
  if (element && element.classList) {
    element.classList.remove(className);
  }
}

/**
 * Sets a style property on an element
 * @param element - Element to update
 * @param property - CSS property name
 * @param value - CSS property value
 */
export function setStyle(
  element: HTMLElement | null,
  property: string,
  value: string
): void {
  if (element && element.style) {
    (element.style as any)[property] = value;
  }
}

/**
 * Gets a style property from an element
 * @param element - Element to query
 * @param property - CSS property name
 * @returns CSS property value
 */
export function getStyle(
  element: HTMLElement | null,
  property: string
): string {
  if (element && element.style) {
    return (element.style as any)[property];
  }
  return '';
}

/**
 * Sets an attribute on an element
 * @param element - Element to update
 * @param name - Attribute name
 * @param value - Attribute value
 */
export function setAttribute(
  element: HTMLElement | null,
  name: string,
  value: string
): void {
  if (element && element.setAttribute) {
    element.setAttribute(name, value);
  }
}

/**
 * Gets an attribute from an element
 * @param element - Element to query
 * @param name - Attribute name
 * @returns Attribute value or null
 */
export function getAttribute(
  element: HTMLElement | null,
  name: string
): string | null {
  if (element && element.getAttribute) {
    return element.getAttribute(name);
  }
  return null;
}

/**
 * Appends a child element to a parent
 * @param parent - Parent element
 * @param child - Child element to append
 */
export function appendChild(
  parent: HTMLElement | null,
  child: HTMLElement | null
): void {
  if (parent && child) {
    parent.appendChild(child);
  }
}

/**
 * Clears all children from an element
 * @param element - Element to clear
 */
export function clearChildren(element: HTMLElement | null): void {
  if (element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}

/**
 * Adds an event listener to an element
 * @param element - Element to attach listener to
 * @param event - Event name
 * @param handler - Event handler function
 */
export function addEventListener(
  element: HTMLElement | null,
  event: string,
  handler: EventListenerOrEventListenerObject
): void {
  if (element && element.addEventListener) {
    element.addEventListener(event, handler);
  }
}

/**
 * Removes an event listener from an element
 * @param element - Element to remove listener from
 * @param event - Event name
 * @param handler - Event handler function
 */
export function removeEventListener(
  element: HTMLElement | null,
  event: string,
  handler: EventListenerOrEventListenerObject
): void {
  if (element && element.removeEventListener) {
    element.removeEventListener(event, handler);
  }
}
