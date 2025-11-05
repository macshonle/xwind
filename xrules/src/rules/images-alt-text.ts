/**
 * Images Must Have Alt Text
 *
 * All img elements must have an alt attribute for screen readers and
 * accessibility. Even decorative images should use alt="" to indicate
 * they are decorative.
 *
 * WCAG 2.1 Success Criterion 1.1.1 Non-text Content (Level A)
 */

import type { Rule } from '../types';

export const imagesAltText: Rule = {
  id: 'images-alt-text',
  name: 'Images Must Have Alt Text',
  description: 'All img elements must have an alt attribute for accessibility',
  category: 'accessibility',
  severity: 'error',

  // Use extended pattern matcher: find images WITHOUT alt attribute
  pattern: 'img:without(alt)',

  check(): string | null {
    // If we found the element, it's a violation (since pattern already filtered)
    return 'Image element is missing alt attribute. All images must have alt text for screen readers. ' +
      'Use alt="" for decorative images.';
  },

  suggest(element): string {
    const src = element.getAttribute('src');
    if (src) {
      return `Add an alt attribute describing the image content, e.g., alt="Description of ${src}"`;
    }
    return 'Add an alt attribute describing the image content, or use alt="" if the image is decorative';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
};
