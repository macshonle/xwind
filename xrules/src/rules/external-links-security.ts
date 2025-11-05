/**
 * External Links Opening in New Tab Must Be Secure
 *
 * Links with target="_blank" that open external sites should include
 * rel="noopener noreferrer" for security reasons.
 *
 * Without these attributes, the new page can access the originating page
 * via window.opener, which is a security and privacy concern.
 *
 * See: https://mathiasbynens.github.io/rel-noopener/
 */

import type { Rule, CheckContext } from '../types';

export const externalLinksSecurity: Rule = {
  id: 'external-links-security',
  name: 'External Links Must Be Secure',
  description: 'Links with target="_blank" should have rel="noopener noreferrer" for security',
  category: 'security',
  severity: 'warning',

  // Find links with target="_blank" that don't have rel attribute
  pattern: 'a[target="_blank"]:without(rel)',

  check(element, context): string | null {
    // Pattern already filters for target="_blank" without rel
    return 'Link opens in new tab without security attributes. ' +
      'Add rel="noopener noreferrer" to prevent security vulnerabilities.';
  },

  suggest(): string {
    return 'Add rel="noopener noreferrer" to the link';
  },

  documentation: 'https://mathiasbynens.github.io/rel-noopener/',
};

/**
 * Alternative rule: Check for links that have rel but not the right values
 */
export const externalLinksSecurityPartial: Rule = {
  id: 'external-links-security-partial',
  name: 'External Links Need Both noopener and noreferrer',
  description: 'Links with target="_blank" should have both noopener and noreferrer in rel attribute',
  category: 'security',
  severity: 'warning',

  pattern: 'a[target="_blank"]',

  check(element): string | null {
    const rel = element.getAttribute('rel');

    if (!rel) {
      return 'Link opens in new tab without security attributes. Add rel="noopener noreferrer".';
    }

    const relValues = rel.toLowerCase().split(/\s+/);
    const hasNoopener = relValues.includes('noopener');
    const hasNoreferrer = relValues.includes('noreferrer');

    if (!hasNoopener && !hasNoreferrer) {
      return 'Link has rel attribute but missing "noopener" and "noreferrer". Add both for security.';
    }

    if (!hasNoopener) {
      return 'Link is missing "noopener" in rel attribute. Add rel="noopener noreferrer".';
    }

    if (!hasNoreferrer) {
      return 'Link is missing "noreferrer" in rel attribute for privacy. Add rel="noopener noreferrer".';
    }

    return null;
  },

  suggest(element): string {
    const rel = element.getAttribute('rel');

    if (!rel) {
      return 'Add rel="noopener noreferrer" to the link';
    }

    return 'Update rel attribute to include both "noopener" and "noreferrer"';
  },

  documentation: 'https://mathiasbynens.github.io/rel-noopener/',
};
