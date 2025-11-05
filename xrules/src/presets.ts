/**
 * Rule Presets - Predefined rule configurations
 */

import type { XRulesConfig } from './types';

/**
 * Accessibility-focused preset (strict)
 * All accessibility rules enabled as errors
 */
export const accessibilityStrict: XRulesConfig = {
  rules: {
    // Form accessibility
    'form-labels-explicit': 'error',
    'form-required-indicators': 'error',
    'form-input-autocomplete': 'warning',
    'form-fieldset-legend': 'error',

    // Images and media
    'images-alt-text': 'error',
    'images-decorative-alt': 'warning',
    'svg-accessible': 'warning',

    // Interactive elements
    'buttons-descriptive-text': 'error',
    'empty-links': 'error',
    'link-descriptive-text': 'warning',
    'focus-visible': 'error',
    'interactive-controls-size': 'warning',

    // Structure and navigation
    'heading-hierarchy': 'error',
    'single-h1': 'error',
    'skip-links': 'warning',
    'landmark-regions': 'warning',

    // ARIA
    'aria-valid-attributes': 'error',
    'aria-required-parent': 'error',
    'aria-hidden-focusable': 'error',

    // Tables
    'table-headers': 'error',
    'table-caption': 'warning',

    // Color and contrast
    'color-contrast': 'warning',
    'no-color-only': 'warning',
  },
};

/**
 * SEO-focused preset
 * All SEO rules enabled
 */
export const seoRecommended: XRulesConfig = {
  rules: {
    // Meta tags
    'meta-title': 'error',
    'meta-description': 'error',
    'meta-viewport': 'error',
    'meta-charset': 'error',

    // Headings
    'single-h1': 'error',
    'heading-hierarchy': 'warning',

    // Links
    'descriptive-link-text': 'warning',
    'nofollow-external': 'info',

    // Images
    'images-alt-text': 'warning',

    // Structured data
    'canonical-url': 'warning',
    'open-graph-tags': 'info',
  },
};

/**
 * Security-focused preset
 * All security rules enabled
 */
export const securityStrict: XRulesConfig = {
  rules: {
    'external-links-security': 'error',
    'external-links-security-partial': 'error',
    'form-autocomplete-off': 'warning',
    'inline-event-handlers': 'error',
    'dangerous-links': 'error',
    'iframe-sandbox': 'warning',
  },
};

/**
 * Recommended preset (balanced)
 * Good defaults for most projects
 */
export const recommended: XRulesConfig = {
  rules: {
    // Critical accessibility (errors)
    'form-labels-explicit': 'error',
    'images-alt-text': 'error',
    'empty-links': 'error',
    'heading-hierarchy': 'warning',
    'single-h1': 'warning',
    'aria-valid-attributes': 'error',

    // Important warnings
    'buttons-descriptive-text': 'warning',
    'external-links-security-partial': 'warning',
    'meta-title': 'warning',
    'meta-description': 'warning',

    // Best practices (info)
    'link-descriptive-text': 'info',
    'form-autocomplete-off': 'info',
  },
};

/**
 * All rules enabled (for auditing)
 */
export const all: XRulesConfig = {
  rules: {
    // This will be populated with all available rules at 'warning' level
    // Individual projects can override specific rules
  },
};

/**
 * Minimal preset (only critical errors)
 * For projects just starting with accessibility
 */
export const minimal: XRulesConfig = {
  rules: {
    'form-labels-explicit': 'error',
    'images-alt-text': 'error',
    'empty-links': 'error',
    'single-h1': 'warning',
  },
};

/**
 * Get a preset by name
 */
export function getPreset(name: string): XRulesConfig | null {
  const presets: Record<string, XRulesConfig> = {
    'accessibility-strict': accessibilityStrict,
    'seo-recommended': seoRecommended,
    'security-strict': securityStrict,
    recommended,
    all,
    minimal,
  };

  return presets[name] || null;
}

/**
 * List all available presets
 */
export function listPresets(): string[] {
  return [
    'accessibility-strict',
    'seo-recommended',
    'security-strict',
    'recommended',
    'all',
    'minimal',
  ];
}
