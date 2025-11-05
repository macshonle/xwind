/**
 * Security Rules
 */

import type { Rule } from '../types';

/**
 * Form autocomplete should not be disabled for security
 */
export const formAutocompleteOff: Rule = {
  id: 'form-autocomplete-off',
  name: 'Avoid Disabling Form Autocomplete',
  description: 'Disabling autocomplete on password fields reduces security',
  category: 'security',
  severity: 'warning',
  pattern: 'input[type="password"][autocomplete="off"], input[type="password"][autocomplete="false"]',

  check(): string | null {
    return 'Password field has autocomplete="off" which prevents password managers from working. ' +
      'This reduces security by discouraging strong passwords.';
  },

  suggest(): string {
    return 'Remove autocomplete="off" or use autocomplete="current-password" or "new-password"';
  },

  documentation: 'https://www.w3.org/TR/WCAG21/#identify-input-purpose',
};

/**
 * Inline event handlers (security risk)
 */
export const inlineEventHandlers: Rule = {
  id: 'inline-event-handlers',
  name: 'Avoid Inline Event Handlers',
  description: 'Inline event handlers (onclick, onerror, etc.) are a security risk and violate CSP',
  category: 'security',
  severity: 'warning',
  pattern: '*',

  check(element): string | null {
    const dangerousAttrs = [
      'onclick',
      'onload',
      'onerror',
      'onmouseover',
      'onmouseout',
      'onfocus',
      'onblur',
    ];

    for (const attr of dangerousAttrs) {
      if (element.hasAttribute(attr)) {
        return `Element has inline event handler "${attr}". ` +
          'Inline JavaScript violates Content Security Policy and is a security risk.';
      }
    }

    return null;
  },

  suggest(): string {
    return 'Move event handlers to external JavaScript files using addEventListener()';
  },

  documentation: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
};

/**
 * Dangerous link protocols
 */
export const dangerousLinks: Rule = {
  id: 'dangerous-links',
  name: 'Avoid Dangerous Link Protocols',
  description: 'Links should not use javascript: or data: protocols',
  category: 'security',
  severity: 'error',
  pattern: 'a',

  check(element): string | null {
    const href = element.getAttribute('href');

    if (!href) {
      return null;
    }

    const lowerHref = href.toLowerCase().trim();

    if (lowerHref.startsWith('javascript:')) {
      return 'Link uses javascript: protocol which is a security risk. Use event handlers instead.';
    }

    if (lowerHref.startsWith('data:') && !lowerHref.startsWith('data:image')) {
      return 'Link uses data: protocol which may be a security risk. Verify this is intentional.';
    }

    return null;
  },

  suggest(): string {
    return 'Use regular href with click event handlers, or use button elements for actions';
  },

  documentation: 'https://owasp.org/www-community/attacks/xss/',
};

/**
 * Iframes should use sandbox
 */
export const iframeSandbox: Rule = {
  id: 'iframe-sandbox',
  name: 'Iframes Should Use Sandbox Attribute',
  description: 'Iframes should use sandbox attribute to restrict capabilities',
  category: 'security',
  severity: 'warning',
  pattern: 'iframe:not([sandbox])',

  check(): string | null {
    return 'Iframe is missing sandbox attribute. Use sandbox to restrict iframe capabilities for security.';
  },

  suggest(): string {
    return 'Add sandbox attribute with appropriate permissions (e.g., sandbox="allow-scripts allow-same-origin")';
  },

  documentation: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox',
};

/**
 * Forms should use HTTPS
 */
export const formHttpsAction: Rule = {
  id: 'form-https-action',
  name: 'Forms Should Submit Via HTTPS',
  description: 'Form actions should use HTTPS to protect submitted data',
  category: 'security',
  severity: 'error',
  pattern: 'form[action]',

  check(element): string | null {
    const action = element.getAttribute('action');

    if (!action) {
      return null;
    }

    // Check if action uses http:// (not https://)
    if (action.toLowerCase().startsWith('http://')) {
      return 'Form submits to insecure HTTP URL. Use HTTPS to protect sensitive data in transit.';
    }

    return null;
  },

  suggest(): string {
    return 'Change form action to use https:// instead of http://';
  },

  documentation: 'https://owasp.org/www-community/controls/SecureCommunication',
};

/**
 * Input type=file should specify accepted types
 */
export const fileInputAccept: Rule = {
  id: 'file-input-accept',
  name: 'File Inputs Should Specify Accepted Types',
  description: 'File upload inputs should use accept attribute to restrict file types',
  category: 'security',
  severity: 'info',
  pattern: 'input[type="file"]:not([accept])',

  check(): string | null {
    return 'File input should specify accepted file types using accept attribute for security.';
  },

  suggest(): string {
    return 'Add accept attribute (e.g., accept="image/*" or accept=".pdf,.doc")';
  },
};

/**
 * External resources should use SRI
 */
export const subresourceIntegrity: Rule = {
  id: 'subresource-integrity',
  name: 'External Resources Should Use SRI',
  description: 'External scripts and styles should use Subresource Integrity for security',
  category: 'security',
  severity: 'info',
  pattern: 'script[src^="http"], link[rel="stylesheet"][href^="http"]',

  check(element): string | null {
    const integrity = element.getAttribute('integrity');
    const crossorigin = element.getAttribute('crossorigin');

    if (!integrity) {
      return 'External resource should use Subresource Integrity (integrity attribute) to prevent tampering.';
    }

    if (!crossorigin) {
      return 'External resource with integrity should also have crossorigin="anonymous" attribute.';
    }

    return null;
  },

  suggest(): string {
    return 'Add integrity and crossorigin attributes (e.g., integrity="sha384-..." crossorigin="anonymous")';
  },

  documentation: 'https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity',
};
