/**
 * Comprehensive Accessibility Rules
 *
 * Based on WCAG 2.1 Guidelines
 */

import type { Rule } from '../types';

/**
 * Links should have descriptive text, not "click here" or "read more"
 */
export const linkDescriptiveText: Rule = {
  id: 'link-descriptive-text',
  name: 'Links Should Have Descriptive Text',
  description: 'Links should describe their destination, not use generic text like "click here"',
  category: 'accessibility',
  severity: 'warning',
  pattern: 'a',

  check(element): string | null {
    const text = element.textContent.trim().toLowerCase();

    const nonDescriptiveTerms = [
      'click here',
      'click',
      'read more',
      'learn more',
      'more',
      'here',
      'link',
      'this',
    ];

    if (nonDescriptiveTerms.includes(text)) {
      return `Link text "${text}" is not descriptive. Use text that describes the link destination.`;
    }

    return null;
  },

  suggest(): string {
    return 'Use descriptive text that indicates where the link goes (e.g., "View Product Details", "Download User Guide")';
  },
};

/**
 * Form inputs should have autocomplete attributes for better UX
 */
export const formInputAutocomplete: Rule = {
  id: 'form-input-autocomplete',
  name: 'Form Inputs Should Have Autocomplete',
  description: 'Common form inputs should have autocomplete attributes for better user experience',
  category: 'accessibility',
  severity: 'info',
  pattern: 'input[type="text"], input[type="email"], input[type="tel"], input[type="url"]',

  check(element): string | null {
    const name = (element.getAttribute('name') || '').toLowerCase();
    const autocomplete = element.getAttribute('autocomplete');

    // Common fields that should have autocomplete
    const commonFields: Record<string, string> = {
      email: 'email',
      name: 'name',
      'first-name': 'given-name',
      firstname: 'given-name',
      'last-name': 'family-name',
      lastname: 'family-name',
      phone: 'tel',
      telephone: 'tel',
      address: 'street-address',
      city: 'address-level2',
      state: 'address-level1',
      zip: 'postal-code',
      zipcode: 'postal-code',
      country: 'country-name',
    };

    if (commonFields[name] && !autocomplete) {
      return `Input field "${name}" should have autocomplete="${commonFields[name]}" for better user experience.`;
    }

    return null;
  },

  suggest(element): string {
    const name = (element.getAttribute('name') || '').toLowerCase();
    const suggestions: Record<string, string> = {
      email: 'email',
      name: 'name',
      phone: 'tel',
      address: 'street-address',
    };

    const suggested = suggestions[name];
    if (suggested) {
      return `Add autocomplete="${suggested}" to the input`;
    }

    return 'Add appropriate autocomplete attribute based on the input purpose';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/identify-input-purpose.html',
};

/**
 * Fieldsets should have legends
 */
export const formFieldsetLegend: Rule = {
  id: 'form-fieldset-legend',
  name: 'Fieldsets Must Have Legends',
  description: 'Fieldset elements must contain a legend element to group related form controls',
  category: 'accessibility',
  severity: 'error',
  pattern: 'fieldset',

  check(element): string | null {
    // Check if fieldset has a legend child
    const hasLegend = element.children.some(child => child.tagName === 'legend');

    if (!hasLegend) {
      return 'Fieldset element is missing a legend. Legends describe the purpose of grouped form controls.';
    }

    return null;
  },

  suggest(): string {
    return 'Add a <legend> element as the first child of the fieldset';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
};

/**
 * Interactive elements should have sufficient size
 */
export const interactiveControlsSize: Rule = {
  id: 'interactive-controls-size',
  name: 'Interactive Controls Should Be Large Enough',
  description: 'Buttons and links should be at least 44x44 pixels for touch accessibility',
  category: 'accessibility',
  severity: 'info',
  pattern: 'button, a[href], input[type="button"], input[type="submit"]',

  check(element): string | null {
    // This is a heuristic - we can't measure actual size from HTML
    // but we can check for common patterns that might indicate small controls

    const text = element.textContent.trim();

    // Single character or very short text might be too small
    if (text.length === 1 && !element.getAttribute('aria-label')) {
      return 'Interactive element has very short text which may indicate it is too small. ' +
        'Ensure it is at least 44x44 pixels or has sufficient padding.';
    }

    return null;
  },

  suggest(): string {
    return 'Ensure the element is at least 44x44 pixels, or add aria-label for context';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/target-size.html',
};

/**
 * Skip links for keyboard navigation
 */
export const skipLinks: Rule = {
  id: 'skip-links',
  name: 'Page Should Have Skip Links',
  description: 'Pages should have skip links to allow keyboard users to bypass repetitive content',
  category: 'accessibility',
  severity: 'warning',
  pattern: 'body',

  check(element, context): string | null {
    // Look for skip link (usually first link in body)
    const firstLink = context.querySelector('a[href^="#"]');

    if (!firstLink) {
      return 'Page should have a skip link (e.g., "Skip to main content") as the first focusable element.';
    }

    // Check if it looks like a skip link
    const text = firstLink.textContent.toLowerCase();
    const skipTerms = ['skip', 'jump', 'main content', 'content'];
    const isSkipLink = skipTerms.some(term => text.includes(term));

    if (!isSkipLink) {
      return 'First link does not appear to be a skip link. Consider adding "Skip to main content" as the first link.';
    }

    return null;
  },

  suggest(): string {
    return 'Add a skip link as the first element: <a href="#main-content">Skip to main content</a>';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html',
};

/**
 * Landmark regions for screen readers
 */
export const landmarkRegions: Rule = {
  id: 'landmark-regions',
  name: 'Page Should Have Landmark Regions',
  description: 'Pages should use HTML5 landmark elements (header, nav, main, aside, footer)',
  category: 'accessibility',
  severity: 'warning',
  pattern: 'body',

  check(element, context): string | null {
    const hasMain = context.querySelector('main') !== null;
    const hasNav = context.querySelector('nav') !== null;

    const missingLandmarks: string[] = [];

    if (!hasMain) {
      missingLandmarks.push('main');
    }

    if (!hasNav) {
      missingLandmarks.push('nav');
    }

    if (missingLandmarks.length > 0) {
      return `Page is missing landmark regions: ${missingLandmarks.join(', ')}. ` +
        'Use HTML5 semantic elements to help screen reader users navigate.';
    }

    return null;
  },

  suggest(): string {
    return 'Add semantic HTML5 landmark elements: <header>, <nav>, <main>, <aside>, <footer>';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html',
};

/**
 * ARIA attributes must be valid
 */
export const ariaValidAttributes: Rule = {
  id: 'aria-valid-attributes',
  name: 'ARIA Attributes Must Be Valid',
  description: 'ARIA attributes must use valid values and be appropriate for the element',
  category: 'accessibility',
  severity: 'error',
  pattern: '*',

  check(element): string | null {
    // Check for common ARIA attribute mistakes
    const ariaAttrs = Object.keys(element.attributes).filter(attr => attr.startsWith('aria-'));

    for (const attr of ariaAttrs) {
      const value = element.getAttribute(attr);

      // aria-hidden should be "true" or "false", not empty
      if (attr === 'aria-hidden' && value !== 'true' && value !== 'false') {
        return `aria-hidden must be "true" or "false", not "${value}"`;
      }

      // aria-label should not be empty
      if (attr === 'aria-label' && !value?.trim()) {
        return 'aria-label should not be empty. Provide descriptive text or remove the attribute.';
      }

      // aria-labelledby should reference existing IDs
      if (attr === 'aria-labelledby' && value) {
        const ids = value.split(/\s+/);
        // We can't fully validate without checking the document, but we can check format
        if (ids.some(id => !id.trim())) {
          return 'aria-labelledby contains empty ID references';
        }
      }
    }

    return null;
  },

  suggest(): string {
    return 'Fix the ARIA attribute value to use valid format';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/parsing.html',
};

/**
 * Elements with aria-hidden should not be focusable
 */
export const ariaHiddenFocusable: Rule = {
  id: 'aria-hidden-focusable',
  name: 'ARIA Hidden Elements Should Not Be Focusable',
  description: 'Elements with aria-hidden="true" should not contain focusable elements',
  category: 'accessibility',
  severity: 'error',
  pattern: '[aria-hidden="true"]',

  check(element, context): string | null {
    // Check if element has focusable descendants
    const focusableSelectors = [
      'a[href]',
      'button',
      'input',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
    ];

    for (const selector of focusableSelectors) {
      const focusableElements = context.querySelectorAll(selector);

      for (const focusable of focusableElements) {
        // Check if focusable element is descendant of current element
        let parent = focusable.parent;
        while (parent) {
          if (parent === element) {
            return 'Element with aria-hidden="true" contains focusable elements. ' +
              'This creates confusion for keyboard and screen reader users.';
          }
          parent = parent.parent;
        }
      }
    }

    return null;
  },

  suggest(): string {
    return 'Remove aria-hidden="true", or add tabindex="-1" to focusable descendants';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html',
};

/**
 * Tables should have headers
 */
export const tableHeaders: Rule = {
  id: 'table-headers',
  name: 'Tables Must Have Headers',
  description: 'Data tables must have th elements to identify headers',
  category: 'accessibility',
  severity: 'error',
  pattern: 'table',

  check(element, context): string | null {
    // Check if table has td elements
    const hasTd = context.querySelectorAll('td').length > 0;

    if (!hasTd) {
      return null; // No data cells, no problem
    }

    // Check if table has th elements
    const hasTh = context.querySelectorAll('th').length > 0;

    if (!hasTh) {
      return 'Table contains data cells (td) but no header cells (th). ' +
        'Add <th> elements to identify column/row headers for screen readers.';
    }

    return null;
  },

  suggest(): string {
    return 'Add <th> elements in the first row or column to identify headers';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
};

/**
 * Tables should have captions
 */
export const tableCaption: Rule = {
  id: 'table-caption',
  name: 'Tables Should Have Captions',
  description: 'Complex tables should have caption elements to describe their purpose',
  category: 'accessibility',
  severity: 'warning',
  pattern: 'table',

  check(element): string | null {
    // Check if table has a caption
    const hasCaption = element.children.some(child => child.tagName === 'caption');

    if (hasCaption) {
      return null; // Has caption, all good
    }
    // Check if table has multiple rows (simple heuristic for "complex table")
    const rows = element.children.filter(child =>
      child.tagName === 'tr' ||
      (child.tagName === 'tbody' && child.children.length > 0)
    );

    if (rows.length > 3) {
      return 'Complex table should have a <caption> element to describe its purpose for screen readers.';
    }

    return null;
  },

  suggest(): string {
    return 'Add <caption> as the first child of the table element';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
};

/**
 * Decorative images should use alt=""
 */
export const imagesDecorativeAlt: Rule = {
  id: 'images-decorative-alt',
  name: 'Decorative Images Should Use Empty Alt',
  description: 'Images that are purely decorative should use alt="" to hide them from screen readers',
  category: 'accessibility',
  severity: 'info',
  pattern: 'img',

  check(element): string | null {
    const alt = element.getAttribute('alt');
    const src = element.getAttribute('src') || '';

    // Heuristic: check for common decorative image patterns
    const decorativePatterns = [
      /spacer/i,
      /divider/i,
      /separator/i,
      /decoration/i,
      /ornament/i,
      /dot\.png/i,
      /pixel\.png/i,
      /icon-.*\.(png|jpg|svg)/i,
    ];

    const seemsDecorative = decorativePatterns.some(pattern => pattern.test(src));

    if (seemsDecorative && alt && alt.trim() !== '') {
      return 'Image appears to be decorative but has non-empty alt text. ' +
        'Use alt="" for purely decorative images.';
    }

    return null;
  },

  suggest(): string {
    return 'If this image is purely decorative, use alt="" to hide it from screen readers';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
};

/**
 * SVGs should be accessible
 */
export const svgAccessible: Rule = {
  id: 'svg-accessible',
  name: 'SVGs Should Be Accessible',
  description: 'SVG elements should have title and desc for screen readers, or role="img" with aria-label',
  category: 'accessibility',
  severity: 'warning',
  pattern: 'svg',

  check(element): string | null {
    const hasTitle = element.children.some(child => child.tagName === 'title');
    const hasAriaLabel = element.getAttribute('aria-label');
    const role = element.getAttribute('role');

    // SVG should either have title/desc or role="img" with aria-label
    if (!hasTitle && !hasAriaLabel) {
      return 'SVG element should have either a <title> child element or aria-label attribute for screen readers.';
    }

    if (hasAriaLabel && role !== 'img') {
      return 'SVG with aria-label should also have role="img" for proper screen reader support.';
    }

    return null;
  },

  suggest(element): string {
    const hasAriaLabel = element.getAttribute('aria-label');

    if (hasAriaLabel) {
      return 'Add role="img" to the SVG element';
    }

    return 'Add <title> as the first child of the SVG, or add role="img" and aria-label';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
};

/**
 * Focus must be visible
 */
export const focusVisible: Rule = {
  id: 'focus-visible',
  name: 'Focus Should Be Visible',
  description: 'Do not remove focus indicators with outline: none without providing alternatives',
  category: 'accessibility',
  severity: 'error',
  pattern: '*',

  check(element): string | null {
    // We can't check CSS from HTML, but we can check for common anti-patterns
    // This would need CSS analysis to be fully effective

    // Check for tabindex="-1" on normally focusable elements
    const tabindex = element.getAttribute('tabindex');
    const isFocusable = ['a', 'button', 'input', 'select', 'textarea'].includes(element.tagName);

    if (isFocusable && tabindex === '-1') {
      return 'Focusable element has tabindex="-1" which removes it from tab order. ' +
        'This may make it inaccessible to keyboard users.';
    }

    return null;
  },

  suggest(): string {
    return 'Remove tabindex="-1" or ensure element is still accessible via keyboard';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html',
};

/**
 * Required form fields should be indicated
 */
export const formRequiredIndicators: Rule = {
  id: 'form-required-indicators',
  name: 'Required Form Fields Should Be Indicated',
  description: 'Required form fields should use required attribute and visual indication',
  category: 'accessibility',
  severity: 'warning',
  pattern: 'input[required], select[required], textarea[required]',

  check(element, context): string | null {
    // Check if there's a visible indicator
    const id = element.getAttribute('id');

    if (id) {
      const label = context.querySelector(`label[for="${id}"]`);

      if (label) {
        const labelText = label.textContent;
        const hasVisualIndicator = labelText.includes('*') ||
          labelText.toLowerCase().includes('required');

        if (!hasVisualIndicator) {
          return 'Required field should have visual indication in the label (e.g., asterisk or "required" text).';
        }
      }
    }

    // Check for aria-required
    const ariaRequired = element.getAttribute('aria-required');
    if (ariaRequired !== 'true') {
      return 'Required field should have aria-required="true" for screen readers.';
    }

    return null;
  },

  suggest(): string {
    return 'Add aria-required="true" and visual indicator (* or "required") in the label';
  },

  documentation: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
};
