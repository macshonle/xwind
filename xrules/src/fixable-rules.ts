/**
 * Phase 7: Fixable Rules
 *
 * Extended versions of rules with auto-fix capabilities
 */

import { Rule, Element, CheckContext } from './types';
import { Fix } from './fix-types';
import { Fixer } from './fixer';

/**
 * Helper: Serialize element to HTML string
 */
function serializeElement(element: Element): string {
  const attrs = Object.entries(element.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const openTag = attrs ? `<${element.tagName} ${attrs}>` : `<${element.tagName}>`;

  if (element.children.length === 0 && !element.textContent) {
    // Self-closing or empty tag
    if (['img', 'br', 'hr', 'input', 'meta', 'link'].includes(element.tagName.toLowerCase())) {
      return attrs ? `<${element.tagName} ${attrs} />` : `<${element.tagName} />`;
    }
    return `${openTag}</${element.tagName}>`;
  }

  const content = element.textContent || element.children.map(serializeElement).join('');
  return `${openTag}${content}</${element.tagName}>`;
}

/**
 * Extended rule with fix capability
 */
export interface FixableRule extends Rule {
  /**
   * Generate a fix for a violation
   */
  fix?: (element: Element, context: CheckContext) => Fix | null;
}

/**
 * Images must have alt text (fixable)
 */
export const imagesAltTextFixable: FixableRule = {
  id: 'images-alt-text',
  name: 'Images must have alt text',
  description: 'All <img> elements must have an alt attribute for accessibility',
  category: 'accessibility',
  severity: 'error',
  pattern: 'img',
  check: (element: Element) => {
    if (!element.hasAttribute('alt')) {
      return 'Image missing alt attribute';
    }
    return null;
  },
  fix: (element: Element) => {
    if (element.hasAttribute('alt')) return null;

    const location = element.getSourceLocation();
    if (!location) return null;

    // Find the end of the opening tag
    const tagContent = serializeElement(element);
    const openTagEnd = tagContent.indexOf('>');

    if (openTagEnd === -1) return null;

    return {
      id: Fixer.generateFixId('images-alt-text', location.startOffset),
      ruleId: 'images-alt-text',
      description: 'Add alt="" attribute',
      startOffset: location.startOffset + openTagEnd,
      endOffset: location.startOffset + openTagEnd,
      oldText: '',
      newText: ' alt=""',
      priority: 10,
      safe: true,
    };
  },
  suggest: () => 'Add an alt attribute with a descriptive text',
  documentation: 'https://www.w3.org/WAI/tutorials/images/',
};

/**
 * External links must have security attributes (fixable)
 */
export const externalLinksSecurityFixable: FixableRule = {
  id: 'external-links-security',
  name: 'External links must have security attributes',
  description: 'Links with target="_blank" should include rel="noopener noreferrer"',
  category: 'security',
  severity: 'warning',
  pattern: 'a[target="_blank"]',
  check: (element: Element) => {
    const rel = element.getAttribute('rel') || '';
    const hasNoopener = rel.includes('noopener');
    const hasNoreferrer = rel.includes('noreferrer');

    if (!hasNoopener || !hasNoreferrer) {
      return 'External link missing rel="noopener noreferrer"';
    }
    return null;
  },
  fix: (element: Element) => {
    const rel = element.getAttribute('rel') || '';
    const hasNoopener = rel.includes('noopener');
    const hasNoreferrer = rel.includes('noreferrer');

    if (hasNoopener && hasNoreferrer) return null;

    const location = element.getSourceLocation();
    if (!location) return null;

    // Build the new rel value
    const relParts = rel ? rel.split(/\s+/).filter(Boolean) : [];
    if (!hasNoopener) relParts.push('noopener');
    if (!hasNoreferrer) relParts.push('noreferrer');
    const newRel = relParts.join(' ');

    // Find the rel attribute or add it
    const tagContent = serializeElement(element);
    const relMatch = /\srel=["']([^"']*)["']/i.exec(tagContent);

    if (relMatch) {
      // Update existing rel
      const relStart = location.startOffset + relMatch.index + ' rel="'.length;
      const relEnd = relStart + relMatch[1].length;

      return {
        id: Fixer.generateFixId('external-links-security', location.startOffset),
        ruleId: 'external-links-security',
        description: 'Add noopener noreferrer to rel attribute',
        startOffset: relStart,
        endOffset: relEnd,
        oldText: relMatch[1],
        newText: newRel,
        priority: 8,
        safe: true,
      };
    } else {
      // Add new rel attribute
      const targetMatch = /\starget=["']_blank["']/i.exec(tagContent);
      if (!targetMatch) return null;

      const insertPos = location.startOffset + targetMatch.index + targetMatch[0].length;

      return {
        id: Fixer.generateFixId('external-links-security', location.startOffset),
        ruleId: 'external-links-security',
        description: 'Add rel="noopener noreferrer" attribute',
        startOffset: insertPos,
        endOffset: insertPos,
        oldText: '',
        newText: ` rel="${newRel}"`,
        priority: 8,
        safe: true,
      };
    }
  },
  suggest: () => 'Add rel="noopener noreferrer" to prevent security issues',
  documentation: 'https://mathiasbynens.github.io/rel-noopener/',
};

/**
 * Buttons must have descriptive text (fixable - with aria-label)
 */
export const buttonsDescriptiveTextFixable: FixableRule = {
  id: 'buttons-descriptive-text',
  name: 'Buttons must have descriptive text',
  description: 'Button elements should have descriptive text or aria-label',
  category: 'accessibility',
  severity: 'warning',
  pattern: 'button',
  check: (element: Element) => {
    const text = element.textContent?.trim() || '';
    const ariaLabel = element.getAttribute('aria-label') || '';
    const ariaLabelledby = element.getAttribute('aria-labelledby') || '';

    if (!text && !ariaLabel && !ariaLabelledby) {
      return 'Button has no descriptive text';
    }

    return null;
  },
  fix: (element: Element) => {
    const text = element.textContent?.trim() || '';
    const ariaLabel = element.getAttribute('aria-label') || '';
    const ariaLabelledby = element.getAttribute('aria-labelledby') || '';

    if (text || ariaLabel || ariaLabelledby) return null;

    const location = element.getSourceLocation();
    if (!location) return null;

    // Add aria-label="Button" as a placeholder
    const tagContent = serializeElement(element);
    const openTagEnd = tagContent.indexOf('>');

    if (openTagEnd === -1) return null;

    return {
      id: Fixer.generateFixId('buttons-descriptive-text', location.startOffset),
      ruleId: 'buttons-descriptive-text',
      description: 'Add aria-label attribute',
      startOffset: location.startOffset + openTagEnd,
      endOffset: location.startOffset + openTagEnd,
      oldText: '',
      newText: ' aria-label="Button"',
      priority: 7,
      safe: false, // Not safe - requires user to provide better label
    };
  },
  suggest: () => 'Add descriptive text inside the button or use aria-label',
};

/**
 * Form inputs must have labels (fixable - adds id and basic label structure)
 */
export const formLabelsExplicitFixable: FixableRule = {
  id: 'form-labels-explicit',
  name: 'Form labels must be explicit',
  description: 'Form inputs should have associated label elements with for attribute',
  category: 'accessibility',
  severity: 'error',
  pattern: 'input:not([type="hidden"]):not([type="submit"]):not([type="button"])',
  check: (element: Element, context: CheckContext) => {
    const id = element.getAttribute('id');

    if (!id) {
      return 'Input element missing id attribute';
    }

    // Look for label with matching for attribute
    const labels = context.querySelectorAll('label');
    const hasMatchingLabel = labels.some(
      (label) => label.getAttribute('for') === id
    );

    if (!hasMatchingLabel) {
      return 'Input element missing associated label';
    }

    return null;
  },
  fix: (element: Element) => {
    const id = element.getAttribute('id');

    // Only fix if input is missing an id
    // Fixing the label would require inserting a new element
    if (id) return null;

    const location = element.getSourceLocation();
    if (!location) return null;

    // Generate a unique ID
    const newId = `input-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Find the end of the opening tag
    const tagContent = serializeElement(element);
    const openTagEnd = tagContent.indexOf('>');

    if (openTagEnd === -1) return null;

    return {
      id: Fixer.generateFixId('form-labels-explicit', location.startOffset),
      ruleId: 'form-labels-explicit',
      description: 'Add id attribute to input',
      startOffset: location.startOffset + openTagEnd,
      endOffset: location.startOffset + openTagEnd,
      oldText: '',
      newText: ` id="${newId}"`,
      priority: 9,
      safe: false, // Not safe - user needs to add matching label
    };
  },
  suggest: () => 'Add an id to the input and create a label with matching for attribute',
};

/**
 * List of all fixable rules
 */
export const fixableRules: FixableRule[] = [
  imagesAltTextFixable,
  externalLinksSecurityFixable,
  buttonsDescriptiveTextFixable,
  formLabelsExplicitFixable,
];

/**
 * Get fixable version of a rule by ID
 */
export function getFixableRule(ruleId: string): FixableRule | null {
  return fixableRules.find((rule) => rule.id === ruleId) || null;
}

/**
 * Check if a rule is fixable
 */
export function isRuleFixable(ruleId: string): boolean {
  return fixableRules.some((rule) => rule.id === ruleId);
}
