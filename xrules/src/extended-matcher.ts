/**
 * Extended Pattern Matcher - Beyond CSS Selectors
 *
 * This module provides pattern matching capabilities that go beyond standard CSS selectors.
 *
 * Extended Features:
 * - Content matching: :contains("text"), :contains-regex(/pattern/)
 * - Structural constraints: :has(selector), :without(attr)
 * - Parent/ancestor queries: :has-parent(selector), :has-ancestor(selector)
 * - Sibling queries: :has-sibling(selector), :next-to(selector)
 * - Count constraints: :count(operator, number)
 * - Negation: :not(pattern)
 */

import type { Element } from './types';
import { querySelectorAll } from './parser';

/**
 * Extended pattern syntax
 */
export interface ExtendedPattern {
  baseSelector: string;
  modifiers: PatternModifier[];
}

/**
 * Pattern modifiers that extend CSS selectors
 */
export type PatternModifier =
  | { type: 'contains'; text: string; caseSensitive: boolean }
  | { type: 'contains-regex'; pattern: RegExp }
  | { type: 'has'; selector: string }
  | { type: 'has-parent'; selector: string }
  | { type: 'has-ancestor'; selector: string }
  | { type: 'has-sibling'; selector: string }
  | { type: 'without'; attribute: string }
  | { type: 'count'; operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte'; value: number }
  | { type: 'not'; pattern: string };

/**
 * Parse an extended pattern string into structured form
 */
export function parseExtendedPattern(pattern: string): ExtendedPattern {
  // Find modifiers (pseudo-selectors starting with :)
  const modifiers: PatternModifier[] = [];
  let baseSelector = pattern;

  // Extract modifiers
  const modifierRegex = /:([a-z-]+)(?:\(([^)]+)\))?/g;
  let match;
  const modifierMatches: Array<{ full: string; name: string; args: string }> = [];

  while ((match = modifierRegex.exec(pattern)) !== null) {
    modifierMatches.push({
      full: match[0],
      name: match[1],
      args: match[2] || '',
    });
  }

  // Remove modifiers from base selector
  for (const mod of modifierMatches) {
    baseSelector = baseSelector.replace(mod.full, '');
  }

  baseSelector = baseSelector.trim();

  // Parse each modifier
  for (const mod of modifierMatches) {
    switch (mod.name) {
      case 'contains':
        {
          // :contains("text") or :contains('text')
          const textMatch = mod.args.match(/^["'](.+)["']$/);
          if (textMatch) {
            modifiers.push({
              type: 'contains',
              text: textMatch[1],
              caseSensitive: true,
            });
          }
        }
        break;

      case 'contains-i':
        {
          // :contains-i("text") - case insensitive
          const textMatch = mod.args.match(/^["'](.+)["']$/);
          if (textMatch) {
            modifiers.push({
              type: 'contains',
              text: textMatch[1],
              caseSensitive: false,
            });
          }
        }
        break;

      case 'contains-regex':
        {
          // :contains-regex(/pattern/flags)
          const regexMatch = mod.args.match(/^\/(.+)\/([gimuy]*)$/);
          if (regexMatch) {
            modifiers.push({
              type: 'contains-regex',
              pattern: new RegExp(regexMatch[1], regexMatch[2]),
            });
          }
        }
        break;

      case 'has':
        modifiers.push({
          type: 'has',
          selector: mod.args,
        });
        break;

      case 'has-parent':
        modifiers.push({
          type: 'has-parent',
          selector: mod.args,
        });
        break;

      case 'has-ancestor':
        modifiers.push({
          type: 'has-ancestor',
          selector: mod.args,
        });
        break;

      case 'has-sibling':
        modifiers.push({
          type: 'has-sibling',
          selector: mod.args,
        });
        break;

      case 'without':
        modifiers.push({
          type: 'without',
          attribute: mod.args,
        });
        break;

      case 'count':
        {
          // :count(>5), :count(=1), :count(<3)
          const countMatch = mod.args.match(/^([><=]+)(\d+)$/);
          if (countMatch) {
            let operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
            switch (countMatch[1]) {
              case '=':
              case '==':
                operator = 'eq';
                break;
              case '>':
                operator = 'gt';
                break;
              case '<':
                operator = 'lt';
                break;
              case '>=':
                operator = 'gte';
                break;
              case '<=':
                operator = 'lte';
                break;
              default:
                operator = 'eq';
            }

            modifiers.push({
              type: 'count',
              operator,
              value: parseInt(countMatch[2], 10),
            });
          }
        }
        break;

      case 'not':
        modifiers.push({
          type: 'not',
          pattern: mod.args,
        });
        break;
    }
  }

  return {
    baseSelector,
    modifiers,
  };
}

/**
 * Query elements using extended pattern syntax
 */
export function queryExtended(root: Element, pattern: string): Element[] {
  const parsed = parseExtendedPattern(pattern);

  // Get base elements
  let elements: Element[];

  if (parsed.baseSelector === '' || parsed.baseSelector === '*') {
    elements = getAllElements(root);
  } else {
    elements = querySelectorAll(root, parsed.baseSelector);
  }

  // Apply modifiers
  for (const modifier of parsed.modifiers) {
    elements = elements.filter(el => matchesModifier(el, modifier, root));
  }

  return elements;
}

/**
 * Check if element matches a modifier
 */
function matchesModifier(element: Element, modifier: PatternModifier, root: Element): boolean {
  switch (modifier.type) {
    case 'contains':
      {
        const text = element.textContent;
        if (modifier.caseSensitive) {
          return text.includes(modifier.text);
        } else {
          return text.toLowerCase().includes(modifier.text.toLowerCase());
        }
      }

    case 'contains-regex':
      return modifier.pattern.test(element.textContent);

    case 'has':
      {
        // Element must contain a child matching the selector
        const children = querySelectorAll(element, modifier.selector);
        return children.length > 0;
      }

    case 'has-parent':
      {
        // Element's immediate parent must match selector
        if (!element.parent) return false;
        const matches = querySelectorAll(root, modifier.selector);
        return matches.includes(element.parent);
      }

    case 'has-ancestor':
      {
        // Element must have an ancestor matching selector
        let current = element.parent;
        const matches = querySelectorAll(root, modifier.selector);

        while (current) {
          if (matches.includes(current)) {
            return true;
          }
          current = current.parent;
        }

        return false;
      }

    case 'has-sibling':
      {
        // Element must have a sibling matching selector
        if (!element.parent) return false;

        const siblings = element.parent.children.filter(child => child !== element);
        const matches = querySelectorAll(root, modifier.selector);

        for (const sibling of siblings) {
          if (matches.includes(sibling)) {
            return true;
          }
        }

        return false;
      }

    case 'without':
      return !element.hasAttribute(modifier.attribute);

    case 'count':
      {
        // This is a special case - count applies to the whole result set
        // So we need to handle this at a higher level
        // For now, we'll skip it here and handle it separately
        return true;
      }

    case 'not':
      {
        // Element must NOT match the pattern
        const matches = queryExtended(root, modifier.pattern);
        return !matches.includes(element);
      }

    default:
      return true;
  }
}

/**
 * Get all elements in the tree
 */
function getAllElements(root: Element): Element[] {
  const elements: Element[] = [];

  function traverse(el: Element) {
    elements.push(el);
    for (const child of el.children) {
      traverse(child);
    }
  }

  traverse(root);
  return elements;
}

/**
 * Apply count constraint to results
 */
export function applyCountConstraint(
  elements: Element[],
  operator: 'eq' | 'gt' | 'lt' | 'gte' | 'lte',
  value: number
): Element[] {
  const count = elements.length;
  let matches = false;

  switch (operator) {
    case 'eq':
      matches = count === value;
      break;
    case 'gt':
      matches = count > value;
      break;
    case 'lt':
      matches = count < value;
      break;
    case 'gte':
      matches = count >= value;
      break;
    case 'lte':
      matches = count <= value;
      break;
  }

  // If count constraint is met, return all elements; otherwise return empty
  return matches ? elements : [];
}
