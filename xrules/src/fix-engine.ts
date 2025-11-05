/**
 * Phase 7: Fix-Aware Engine
 *
 * Engine that checks HTML and generates fixes for violations
 */

import { XRulesEngine } from './engine';
import { FixableViolation } from './fix-types';
import { CheckContext, CheckResult, Violation, Element } from './types';
import { FixableRule, fixableRules } from './fixable-rules';
import { parseHTML } from './parser';

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
 * Check result with fixable violations
 */
export interface FixableCheckResult extends CheckResult {
  /**
   * Violations with fix information
   */
  violations: FixableViolation[];

  /**
   * Number of fixable violations
   */
  fixableCount: number;

  /**
   * Number of safe fixes
   */
  safeFixCount: number;
}

/**
 * Engine that can generate fixes
 */
export class FixAwareEngine extends XRulesEngine {
  private fixableRules: Map<string, FixableRule> = new Map();

  constructor() {
    super();

    // Register fixable rules
    for (const rule of fixableRules) {
      this.fixableRules.set(rule.id, rule);
      // Also add to regular rules
      this.addRule(rule);
    }
  }

  /**
   * Check HTML and generate fixes
   */
  checkHTMLWithFixes(html: string, filePath: string = 'input'): FixableCheckResult {
    // Parse HTML
    const document = parseHTML(html);

    // Get all rules to check for fixable ones
    const allRules = this.getRules();
    const violations: FixableViolation[] = [];

    for (const rule of allRules) {
      if (rule.severity === 'off') continue;

      const elements = document.querySelectorAll(rule.pattern);

      for (const element of elements) {
        const context: CheckContext = {
          document,
          querySelector: (selector: string) => document.querySelector(selector),
          querySelectorAll: (selector: string) => document.querySelectorAll(selector),
          getElementById: (id: string) => document.getElementById(id),
        };

        const message = rule.check(element, context);

        if (message) {
          const location = element.getSourceLocation();

          // Create base violation
          const elementHTML = serializeElement(element);
          const violation: FixableViolation = {
            ruleId: rule.id,
            ruleName: rule.name,
            message,
            severity: rule.severity,
            line: location?.line,
            column: location?.column,
            element: elementHTML,
            context: elementHTML,
            suggestion: rule.suggest?.(element),
            fixable: false,
          };

          // Try to generate fix if rule is fixable
          const fixableRule = this.fixableRules.get(rule.id);
          if (fixableRule && fixableRule.fix) {
            const fix = fixableRule.fix(element, context);

            if (fix) {
              violation.fix = fix;
              violation.fixable = true;
            }
          }

          violations.push(violation);
        }
      }
    }

    // Count violations by severity
    let errorCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    let fixableCount = 0;
    let safeFixCount = 0;

    for (const v of violations) {
      if (v.severity === 'error') errorCount++;
      else if (v.severity === 'warning') warningCount++;
      else if (v.severity === 'info') infoCount++;

      if (v.fixable) {
        fixableCount++;
        if (v.fix?.safe !== false) {
          safeFixCount++;
        }
      }
    }

    return {
      filePath,
      violations,
      errorCount,
      warningCount,
      infoCount,
      fixableCount,
      safeFixCount,
    };
  }

  /**
   * Get all fixable rules
   */
  getFixableRules(): FixableRule[] {
    return Array.from(this.fixableRules.values());
  }

  /**
   * Check if a rule supports fixes
   */
  isRuleFixable(ruleId: string): boolean {
    return this.fixableRules.has(ruleId);
  }
}

/**
 * Create a fix-aware engine with default rules
 */
export function createFixAwareEngine(): FixAwareEngine {
  return new FixAwareEngine();
}
