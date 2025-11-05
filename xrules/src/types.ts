/**
 * Core types for the xrules engine
 */

/**
 * Represents a single violation of a rule
 */
export interface Violation {
  ruleId: string;
  ruleName: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  line?: number;
  column?: number;
  element?: string;
  context?: string;
  suggestion?: string;
}

/**
 * Severity level for rules
 */
export type RuleSeverity = 'error' | 'warning' | 'info' | 'off';

/**
 * Rule definition
 */
export interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'accessibility' | 'seo' | 'security' | 'performance' | 'best-practice';
  severity: RuleSeverity;

  /**
   * CSS selector pattern to match elements
   */
  pattern: string;

  /**
   * Function that checks if an element satisfies the rule's constraints
   * Returns null if valid, or a violation message if invalid
   */
  check: (element: Element, context: CheckContext) => string | null;

  /**
   * Optional suggestion for fixing the violation
   */
  suggest?: (element: Element) => string;

  /**
   * Documentation URL
   */
  documentation?: string;
}

/**
 * Context provided to rule checkers
 */
export interface CheckContext {
  /**
   * The root document being checked
   */
  document: Document;

  /**
   * Find elements by selector
   */
  querySelector: (selector: string) => Element | null;
  querySelectorAll: (selector: string) => Element[];

  /**
   * Get element by ID
   */
  getElementById: (id: string) => Element | null;
}

/**
 * Simplified DOM element interface
 */
export interface Element {
  tagName: string;
  attributes: Record<string, string>;
  children: Element[];
  parent?: Element;
  textContent: string;

  /**
   * Get attribute value
   */
  getAttribute(name: string): string | null;

  /**
   * Check if element has attribute
   */
  hasAttribute(name: string): boolean;

  /**
   * Get source location if available
   */
  getSourceLocation(): SourceLocation | null;
}

/**
 * Source location in the original HTML
 */
export interface SourceLocation {
  line: number;
  column: number;
  startOffset: number;
  endOffset: number;
}

/**
 * Simplified document interface
 */
export interface Document {
  documentElement: Element;
  querySelector(selector: string): Element | null;
  querySelectorAll(selector: string): Element[];
  getElementById(id: string): Element | null;
}

/**
 * Result of checking a file
 */
export interface CheckResult {
  filePath: string;
  violations: Violation[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
}

/**
 * Configuration for the xrules engine
 */
export interface XRulesConfig {
  rules: Record<string, RuleSeverity | RuleConfig>;
  extends?: string[];
  ignore?: string[];
}

/**
 * Extended rule configuration
 */
export interface RuleConfig {
  severity: RuleSeverity;
  options?: Record<string, unknown>;
}

/**
 * Options for running the checker
 */
export interface CheckOptions {
  config?: XRulesConfig;
  fix?: boolean;
  quiet?: boolean;
}
