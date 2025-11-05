/**
 * XRules Engine - Core rule checking engine
 */

import type {
  Rule,
  Document,
  Element,
  Violation,
  CheckResult,
  CheckContext,
  CheckOptions,
  XRulesConfig,
} from './types';
import { parseHTML, querySelectorAll } from './parser';
import { queryExtended } from './extended-matcher';

/**
 * Main XRules Engine class
 */
export class XRulesEngine {
  private rules: Rule[] = [];

  constructor(rules: Rule[] = []) {
    this.rules = rules;
  }

  /**
   * Add a rule to the engine
   */
  addRule(rule: Rule): void {
    this.rules.push(rule);
  }

  /**
   * Add multiple rules
   */
  addRules(rules: Rule[]): void {
    this.rules.push(...rules);
  }

  /**
   * Check an HTML string against all rules
   */
  checkHTML(html: string, filePath: string = 'input.html', options: CheckOptions = {}): CheckResult {
    const document = parseHTML(html);
    return this.checkDocument(document, filePath, options);
  }

  /**
   * Check a parsed document against all rules
   */
  checkDocument(document: Document, filePath: string = 'input.html', options: CheckOptions = {}): CheckResult {
    const violations: Violation[] = [];
    const config = options.config;

    const context: CheckContext = {
      document,
      querySelector: (selector: string) => document.querySelector(selector),
      querySelectorAll: (selector: string) => document.querySelectorAll(selector),
      getElementById: (id: string) => document.getElementById(id),
    };

    // Filter rules based on configuration
    const activeRules = this.rules.filter(rule => {
      if (!config) return rule.severity !== 'off';

      const ruleConfig = config.rules[rule.id];
      if (!ruleConfig) return rule.severity !== 'off';

      if (typeof ruleConfig === 'string') {
        return ruleConfig !== 'off';
      }

      return ruleConfig.severity !== 'off';
    });

    // Run each rule
    for (const rule of activeRules) {
      // Get effective severity
      let severity = rule.severity;
      if (config && config.rules[rule.id]) {
        const ruleConfig = config.rules[rule.id];
        if (typeof ruleConfig === 'string') {
          severity = ruleConfig;
        } else {
          severity = ruleConfig.severity;
        }
      }

      if (severity === 'off') {
        continue;
      }

      // Find all elements matching the rule's pattern
      // Use extended matcher if pattern contains extended syntax
      const isExtendedPattern = /:(contains|has|without|has-parent|has-ancestor|has-sibling|not|count)/.test(rule.pattern);
      const elements = isExtendedPattern
        ? queryExtended(document.documentElement, rule.pattern)
        : querySelectorAll(document.documentElement, rule.pattern);

      // Check each matching element
      for (const element of elements) {
        const violationMessage = rule.check(element, context);

        if (violationMessage) {
          const location = element.getSourceLocation();
          const suggestion = rule.suggest ? rule.suggest(element) : undefined;

          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            message: violationMessage,
            severity,
            line: location?.line,
            column: location?.column,
            element: formatElement(element),
            context: getElementContext(element),
            suggestion,
          });
        }
      }
    }

    // Count violations by severity
    const errorCount = violations.filter(v => v.severity === 'error').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;
    const infoCount = violations.filter(v => v.severity === 'info').length;

    return {
      filePath,
      violations,
      errorCount,
      warningCount,
      infoCount,
    };
  }

  /**
   * Get all registered rules
   */
  getRules(): Rule[] {
    return [...this.rules];
  }

  /**
   * Get a rule by ID
   */
  getRule(id: string): Rule | undefined {
    return this.rules.find(rule => rule.id === id);
  }
}

/**
 * Format an element for display
 */
function formatElement(element: Element): string {
  const attrs = Object.entries(element.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const attrsStr = attrs ? ` ${attrs}` : '';
  return `<${element.tagName}${attrsStr}>`;
}

/**
 * Get context around an element (snippet of HTML)
 */
function getElementContext(element: Element, maxLength: number = 100): string {
  const formatted = formatElement(element);

  if (formatted.length <= maxLength) {
    return formatted;
  }

  return formatted.substring(0, maxLength - 3) + '...';
}

/**
 * Create a default engine with standard rules
 */
export function createDefaultEngine(): XRulesEngine {
  const engine = new XRulesEngine();

  // Import and add default rules
  const { formLabelsExplicit } = require('./rules/form-labels-explicit');
  const { imagesAltText } = require('./rules/images-alt-text');
  const { buttonsDescriptiveText } = require('./rules/buttons-descriptive-text');
  const { externalLinksSecurityPartial } = require('./rules/external-links-security');
  const { emptyLinks } = require('./rules/empty-links');
  const { headingHierarchy, singleH1 } = require('./rules/heading-hierarchy');

  engine.addRules([
    formLabelsExplicit,
    imagesAltText,
    buttonsDescriptiveText,
    externalLinksSecurityPartial,
    emptyLinks,
    headingHierarchy,
    singleH1,
  ]);

  return engine;
}
