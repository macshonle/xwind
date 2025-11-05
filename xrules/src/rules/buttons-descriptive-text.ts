/**
 * Buttons Must Have Descriptive Text
 *
 * Buttons should have descriptive text that clearly indicates their purpose.
 * Avoid generic text like "Click here", "Read more", "Learn more" without context.
 *
 * These are typically not helpful for screen reader users navigating by buttons.
 */

import type { Rule } from '../types';

const NON_DESCRIPTIVE_PATTERNS = [
  'click here',
  'click',
  'read more',
  'learn more',
  'more',
  'submit',
  'go',
  'ok',
];

export const buttonsDescriptiveText: Rule = {
  id: 'buttons-descriptive-text',
  name: 'Buttons Must Have Descriptive Text',
  description: 'Buttons should have descriptive text indicating their purpose',
  category: 'accessibility',
  severity: 'warning',

  // Match all buttons (we'll check text in the check function)
  pattern: 'button',

  check(element): string | null {
    const text = element.textContent.trim().toLowerCase();

    // Check if button has no text
    if (!text) {
      // Check for aria-label
      if (!element.getAttribute('aria-label')) {
        return 'Button has no text content and no aria-label. Buttons must have descriptive text.';
      }
      return null; // Has aria-label, so it's OK
    }

    // Check if text is too generic
    if (NON_DESCRIPTIVE_PATTERNS.includes(text)) {
      return `Button text "${text}" is not descriptive. Use text that clearly indicates what the button does ` +
        '(e.g., "Submit Form", "Download Report", "Close Dialog").';
    }

    return null;
  },

  suggest(element): string {
    const text = element.textContent.trim();

    if (!text) {
      return 'Add descriptive text to the button or use aria-label to describe its purpose';
    }

    // Suggest more descriptive alternatives
    const suggestions: Record<string, string> = {
      'click here': 'Use text describing what will happen when clicked',
      'read more': 'Specify what content will be shown (e.g., "Read More About Our Services")',
      'learn more': 'Specify what topic (e.g., "Learn More About Accessibility")',
      'submit': 'Specify what is being submitted (e.g., "Submit Form", "Submit Order")',
      'go': 'Specify where the user is going (e.g., "Go to Dashboard")',
    };

    const suggestion = suggestions[text.toLowerCase()];
    if (suggestion) {
      return suggestion;
    }

    return 'Use more descriptive text that clearly indicates the button\'s purpose';
  },
};
