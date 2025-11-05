/**
 * Heading Hierarchy Must Be Logical
 *
 * Headings (h1-h6) should follow a logical hierarchy without skipping levels.
 * - Page should have exactly one h1
 * - h2 should follow h1, h3 should follow h2, etc.
 * - Don't skip heading levels (e.g., h1 -> h3 is bad)
 *
 * WCAG 2.1 Success Criterion 1.3.1 Info and Relationships (Level A)
 */

import type { Rule, CheckContext, Element } from '../types';

export const headingHierarchy: Rule = {
  id: 'heading-hierarchy',
  name: 'Headings Must Follow Logical Hierarchy',
  description: 'Headings should follow a logical order without skipping levels',
  category: 'accessibility',
  severity: 'warning',

  // Match all headings
  pattern: 'h1, h2, h3, h4, h5, h6',

  check(element, context): string | null {
    const tagName = element.tagName;
    const level = parseInt(tagName.charAt(1), 10);

    // Check for multiple h1s
    if (level === 1) {
      const allH1s = context.querySelectorAll('h1');
      if (allH1s.length > 1) {
        const location = element.getSourceLocation();
        const isFirst = allH1s[0] === element;

        if (!isFirst) {
          return 'Page should have only one h1 element. Multiple h1s confuse the document structure for screen readers.';
        }
      }
    }

    // Check for skipped levels
    if (level > 1) {
      const previousLevel = level - 1;
      const previousHeadingSelector = `h${previousLevel}`;

      // Get all headings before this one
      const allHeadings = context.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const currentIndex = allHeadings.indexOf(element);

      // Get headings before current
      const previousHeadings = allHeadings.slice(0, currentIndex);

      // Check if there's a heading of level-1 before this one
      const hasPreviousLevel = previousHeadings.some(h => {
        const prevLevel = parseInt(h.tagName.charAt(1), 10);
        return prevLevel === previousLevel;
      });

      if (!hasPreviousLevel) {
        return `Heading level ${level} appears without a preceding level ${previousLevel} heading. ` +
          'Heading levels should not be skipped for proper document structure.';
      }
    }

    return null;
  },

  suggest(element): string {
    const level = parseInt(element.tagName.charAt(1), 10);

    if (level === 1) {
      return 'Remove this h1 or change it to a lower heading level. Page should have only one h1.';
    }

    return `Add an h${level - 1} heading before this ${element.tagName}, or change this to h${level - 1}`;
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
};

/**
 * Simpler rule: Just check for multiple h1s
 */
export const singleH1: Rule = {
  id: 'single-h1',
  name: 'Page Should Have Single H1',
  description: 'HTML documents should have exactly one h1 element',
  category: 'seo',
  severity: 'warning',

  pattern: 'h1',

  check(element, context): string | null {
    const allH1s = context.querySelectorAll('h1');

    if (allH1s.length > 1) {
      // Only report on the second and subsequent h1s
      const isFirst = allH1s[0] === element;
      if (!isFirst) {
        return `Page has ${allH1s.length} h1 elements. There should be only one h1 per page for SEO and accessibility.`;
      }
    }

    return null;
  },

  suggest(): string {
    return 'Change this heading to h2 or lower level, or remove if redundant';
  },
};
