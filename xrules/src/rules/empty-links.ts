/**
 * Links Must Not Be Empty
 *
 * Anchor elements (<a>) should have text content or an aria-label.
 * Empty links are confusing for screen reader users who navigate by links.
 */

import type { Rule } from '../types';

export const emptyLinks: Rule = {
  id: 'empty-links',
  name: 'Links Must Not Be Empty',
  description: 'Anchor elements should have text content or aria-label',
  category: 'accessibility',
  severity: 'error',

  pattern: 'a',

  check(element): string | null {
    const text = element.textContent.trim();
    const ariaLabel = element.getAttribute('aria-label');

    // Link is empty if it has no text and no aria-label
    if (!text && !ariaLabel) {
      return 'Link element is empty. Links must have text content or aria-label for screen readers.';
    }

    // Check if link only contains images
    const hasOnlyImages = element.children.length > 0 &&
      element.children.every(child => child.tagName === 'img');

    if (hasOnlyImages && !text && !ariaLabel) {
      // Check if images have alt text
      const imagesWithoutAlt = element.children.filter(
        child => child.tagName === 'img' && !child.getAttribute('alt')
      );

      if (imagesWithoutAlt.length > 0) {
        return 'Link contains only images, and some images lack alt text. ' +
          'Either add alt text to images or add aria-label to the link.';
      }
    }

    return null;
  },

  suggest(element): string {
    const hasImages = element.children.some(child => child.tagName === 'img');

    if (hasImages) {
      return 'Add alt text to images within the link, or add aria-label to the link itself';
    }

    return 'Add descriptive text content to the link that indicates its destination or purpose';
  },
};
