/**
 * HTML Parser - Converts HTML strings to our DOM representation
 */

import * as parse5 from 'parse5';
import type { Document, Element, SourceLocation } from './types';

/**
 * Parse HTML string into our Document representation
 */
export function parseHTML(html: string): Document {
  const document = parse5.parse(html, {
    sourceCodeLocationInfo: true,
  });

  return {
    documentElement: convertNode(document) as Element,
    querySelector: function (selector: string) {
      return querySelector(this.documentElement, selector);
    },
    querySelectorAll: function (selector: string) {
      return querySelectorAll(this.documentElement, selector);
    },
    getElementById: function (id: string) {
      return getElementById(this.documentElement, id);
    },
  };
}

/**
 * Convert parse5 node to our Element interface
 */
function convertNode(node: any, parent?: Element): Element | null {
  if (node.nodeName === '#document') {
    // For document nodes, process children
    const children = (node.childNodes || [])
      .map((child: any) => convertNode(child))
      .filter(Boolean) as Element[];

    // Return the html element as the document element
    const htmlElement = children.find(c => c.tagName === 'html');
    return htmlElement || children[0] || createEmptyElement();
  }

  if (node.nodeName === '#text' || node.nodeName === '#comment') {
    return null;
  }

  const attributes: Record<string, string> = {};
  if (node.attrs) {
    for (const attr of node.attrs) {
      attributes[attr.name] = attr.value;
    }
  }

  const textContent = getTextContent(node);

  const element: Element = {
    tagName: node.nodeName.toLowerCase(),
    attributes,
    children: [],
    parent,
    textContent,
    getAttribute(name: string) {
      return this.attributes[name] || null;
    },
    hasAttribute(name: string) {
      return name in this.attributes;
    },
    getSourceLocation(): SourceLocation | null {
      if (node.sourceCodeLocation) {
        const loc = node.sourceCodeLocation;
        return {
          line: loc.startLine || 0,
          column: loc.startCol || 0,
          startOffset: loc.startOffset || 0,
          endOffset: loc.endOffset || 0,
        };
      }
      return null;
    },
  };

  if (node.childNodes) {
    element.children = node.childNodes
      .map((child: any) => convertNode(child, element))
      .filter(Boolean) as Element[];
  }

  return element;
}

/**
 * Get text content from a node
 */
function getTextContent(node: any): string {
  if (node.nodeName === '#text') {
    return node.value || '';
  }

  if (!node.childNodes) {
    return '';
  }

  return node.childNodes
    .map((child: any) => getTextContent(child))
    .join('');
}

/**
 * Create an empty element
 */
function createEmptyElement(): Element {
  return {
    tagName: 'html',
    attributes: {},
    children: [],
    textContent: '',
    getAttribute() { return null; },
    hasAttribute() { return false; },
    getSourceLocation() { return null; },
  };
}

/**
 * Simple querySelector implementation
 * Note: This is a basic implementation, will be enhanced in Phase 2
 */
export function querySelector(element: Element, selector: string): Element | null {
  const results = querySelectorAll(element, selector);
  return results[0] || null;
}

/**
 * Simple querySelectorAll implementation
 * Currently supports: tag names, classes, IDs, attribute selectors, and basic combinators
 */
export function querySelectorAll(root: Element, selector: string): Element[] {
  const results: Element[] = [];

  // Simple selector parsing (will be enhanced in Phase 2)
  const matches = (element: Element, sel: string): boolean => {
    sel = sel.trim();

    // Tag selector
    if (sel === '*' || sel === element.tagName) {
      return true;
    }

    // ID selector
    if (sel.startsWith('#')) {
      const id = sel.substring(1);
      return element.getAttribute('id') === id;
    }

    // Class selector
    if (sel.startsWith('.')) {
      const className = sel.substring(1);
      const classAttr = element.getAttribute('class') || '';
      return classAttr.split(/\s+/).includes(className);
    }

    // Attribute selector [attr] or [attr="value"]
    if (sel.startsWith('[') && sel.endsWith(']')) {
      const attrMatch = sel.slice(1, -1);
      if (attrMatch.includes('=')) {
        const [attr, value] = attrMatch.split('=').map(s => s.trim().replace(/['"]/g, ''));
        return element.getAttribute(attr) === value;
      } else {
        return element.hasAttribute(attrMatch.trim());
      }
    }

    // Tag with attribute (e.g., "input[type='text']")
    if (sel.includes('[')) {
      const tagPart = sel.substring(0, sel.indexOf('['));
      const attrPart = sel.substring(sel.indexOf('['));
      return matches(element, tagPart) && matches(element, attrPart);
    }

    return false;
  };

  const traverse = (element: Element) => {
    if (matches(element, selector)) {
      results.push(element);
    }

    for (const child of element.children) {
      traverse(child);
    }
  };

  traverse(root);
  return results;
}

/**
 * Get element by ID
 */
export function getElementById(root: Element, id: string): Element | null {
  if (root.getAttribute('id') === id) {
    return root;
  }

  for (const child of root.children) {
    const result = getElementById(child, id);
    if (result) {
      return result;
    }
  }

  return null;
}

/**
 * Check if an element has a child matching selector
 */
export function hasChild(element: Element, selector: string): boolean {
  return querySelectorAll(element, selector).length > 0;
}

/**
 * Get parent element matching selector
 */
export function closest(element: Element, selector: string): Element | null {
  let current = element.parent;

  while (current) {
    const results = querySelectorAll(current, selector);
    if (results.includes(current)) {
      return current;
    }
    current = current.parent;
  }

  return null;
}
