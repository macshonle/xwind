/**
 * JSX-aware Rule Engine for Phase 4
 *
 * This module extends the HTML rule engine to work with React/TSX components,
 * performing static analysis to check rules against component code.
 */

import { XRulesEngine } from './engine';
import { Rule, CheckResult, Violation } from './types';
import { JsxParser, ComponentAnalysis, JsxNode } from './jsx-parser';
import { parseHTML } from './parser';

/**
 * Extended check result with component-level information
 */
export interface JsxCheckResult extends CheckResult {
  componentName?: string;
  hasConditionalRendering?: boolean;
  checkedBranches?: number;
}

/**
 * JSX-aware rule engine
 */
export class JsxRulesEngine extends XRulesEngine {
  private jsxParser: JsxParser;

  constructor(rules: Rule[] = [], tsConfigPath?: string) {
    super(rules);
    this.jsxParser = new JsxParser(tsConfigPath);
  }

  /**
   * Check a TypeScript/TSX file
   */
  checkFile(filePath: string): JsxCheckResult[] {
    const sourceFile = this.jsxParser.addSourceFile(filePath);
    const components = this.jsxParser.analyzeComponent(sourceFile);

    return this.checkComponents(components);
  }

  /**
   * Check TypeScript/TSX code from string
   */
  checkCode(code: string, fileName: string = 'component.tsx'): JsxCheckResult[] {
    const sourceFile = this.jsxParser.addSourceFromText(code, fileName);
    const components = this.jsxParser.analyzeComponent(sourceFile);

    return this.checkComponents(components);
  }

  /**
   * Check a specific component
   */
  checkComponent(filePath: string, componentName: string): JsxCheckResult | null {
    const sourceFile = this.jsxParser.addSourceFile(filePath);
    const components = this.jsxParser.analyzeComponent(sourceFile, componentName);

    if (components.length === 0) return null;

    const results = this.checkComponents(components);
    return results[0] || null;
  }

  /**
   * Check multiple components
   */
  private checkComponents(components: ComponentAnalysis[]): JsxCheckResult[] {
    const results: JsxCheckResult[] = [];

    for (const component of components) {
      const result = this.checkSingleComponent(component);
      results.push(result);
    }

    return results;
  }

  /**
   * Check a single component
   */
  private checkSingleComponent(component: ComponentAnalysis): JsxCheckResult {
    const violations: Violation[] = [];
    let checkedBranches = 0;

    // Check each possible return value (branch)
    for (const jsxNode of component.possibleReturns) {
      const html = this.jsxParser.jsxNodeToHtml(jsxNode);

      // Parse the generated HTML and check against rules
      const result = this.checkHTML(html, component.filePath);

      // Add component context to violations
      for (const violation of result.violations) {
        violations.push({
          ...violation,
          // Add component information
          element: `${component.name}: ${violation.element}`,
        });
      }

      checkedBranches++;
    }

    // Aggregate results
    let errorCount = 0;
    let warningCount = 0;
    let infoCount = 0;

    for (const violation of violations) {
      if (violation.severity === 'error') errorCount++;
      else if (violation.severity === 'warning') warningCount++;
      else if (violation.severity === 'info') infoCount++;
    }

    return {
      filePath: component.filePath,
      violations,
      errorCount,
      warningCount,
      infoCount,
      componentName: component.name,
      hasConditionalRendering: component.hasConditionalRendering,
      checkedBranches,
    };
  }

  /**
   * Get the JSX parser instance
   */
  getJsxParser(): JsxParser {
    return this.jsxParser;
  }
}
