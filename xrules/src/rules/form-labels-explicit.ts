/**
 * Form Labels Must Use Explicit Association
 *
 * Based on: https://simonwillison.net/2025/Oct/17/form-labels/
 *
 * Problem: Wrapping form inputs in labels without explicit `for` attribute
 * causes accessibility issues with voice control software (Dragon Naturally Speaking,
 * Voice Control for macOS/iOS).
 *
 * BAD:
 *   <label>Name <input type="text"></label>
 *
 * GOOD:
 *   <label for="idField">Name
 *     <input id="idField" type="text">
 *   </label>
 */

import type { Rule, CheckContext, Element } from '../types';
import { querySelectorAll } from '../parser';

export const formLabelsExplicit: Rule = {
  id: 'form-labels-explicit',
  name: 'Form Labels Must Use Explicit Association',
  description: 'Form labels must use explicit "for" attribute to ensure compatibility with voice control software',
  category: 'accessibility',
  severity: 'error',
  pattern: 'label',
  documentation: 'https://simonwillison.net/2025/Oct/17/form-labels/',

  check(element: Element, context: CheckContext): string | null {
    // Check if label has a 'for' attribute
    const forAttr = element.getAttribute('for');

    // Check if label contains a form input
    const containsInput = hasFormControl(element);

    if (!containsInput) {
      // Label doesn't contain an input, so it's OK if it has no nested controls
      // But if it has neither 'for' nor nested controls, it's likely empty/wrong
      if (!forAttr) {
        return 'Label element must either have a "for" attribute or contain a form control';
      }
      return null;
    }

    // Label contains a form input
    if (!forAttr) {
      return 'Label contains a form control but lacks explicit "for" attribute. ' +
        'Voice control software (Dragon Naturally Speaking, Voice Control) requires explicit association.';
    }

    // Label has 'for' attribute, verify it matches an input inside
    const inputElements = getFormControls(element);
    const hasMatchingInput = inputElements.some(input => {
      const inputId = input.getAttribute('id');
      return inputId === forAttr;
    });

    if (!hasMatchingInput) {
      // Check if the 'for' attribute points to an element elsewhere in the document
      const targetElement = context.getElementById(forAttr);
      if (targetElement && isFormControl(targetElement)) {
        // Valid: label points to a form control outside itself
        return null;
      }

      // If label contains inputs, at least one should have the matching ID
      if (inputElements.length > 0) {
        return `Label has for="${forAttr}" but the contained form control does not have a matching id attribute`;
      }
    }

    // Verify the referenced input has the correct ID
    if (hasMatchingInput) {
      return null; // Valid!
    }

    return null;
  },

  suggest(element: Element): string {
    const containsInput = hasFormControl(element);
    if (!containsInput) {
      return 'Add a "for" attribute that references the ID of the associated form control';
    }

    const inputs = getFormControls(element);
    if (inputs.length === 1) {
      const input = inputs[0];
      const inputId = input.getAttribute('id');

      if (!inputId) {
        return 'Add an "id" attribute to the input element and a matching "for" attribute to the label';
      }

      return `Add for="${inputId}" to the label element`;
    }

    return 'Add explicit "for" and "id" attributes to associate the label with its form control';
  },
};

/**
 * Check if element contains any form control
 */
function hasFormControl(element: Element): boolean {
  return getFormControls(element).length > 0;
}

/**
 * Get all form controls within an element
 */
function getFormControls(element: Element): Element[] {
  const controls: Element[] = [];

  const traverse = (el: Element) => {
    if (isFormControl(el)) {
      controls.push(el);
    }

    for (const child of el.children) {
      traverse(child);
    }
  };

  // Check children only (not the element itself)
  for (const child of element.children) {
    traverse(child);
  }

  return controls;
}

/**
 * Check if element is a form control
 */
function isFormControl(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'input') {
    const type = element.getAttribute('type');
    // Exclude hidden inputs
    return type !== 'hidden';
  }

  return tagName === 'select' || tagName === 'textarea';
}
