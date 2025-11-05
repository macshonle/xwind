/**
 * Scope-Aware Rule Engine (Phase 5)
 *
 * Extends XRulesEngine with scope management and traceability.
 */

import { XRulesEngine } from './engine';
import { Rule, Element, Document, CheckContext } from './types';
import {
  Scope,
  ScopeCheckOptions,
  ScopeCheckResult,
  TraceableViolation,
  ScopeContext,
} from './scope-types';
import { ScopeRegistry } from './scope-registry';

/**
 * Scope-aware rule engine
 */
export class ScopeAwareEngine extends XRulesEngine {
  private scopeRegistry: ScopeRegistry;

  constructor(rules: Rule[] = [], scopeRegistry: ScopeRegistry) {
    super(rules);
    this.scopeRegistry = scopeRegistry;
  }

  /**
   * Check HTML with scope awareness
   */
  checkHTMLWithScopes(
    html: string,
    filePath: string,
    options: ScopeCheckOptions = {}
  ): ScopeCheckResult {
    const baseResult = this.checkHTML(html, filePath);

    // Find applicable scopes
    const appliedScopes = this.findApplicableScopes(filePath, options);

    // Convert violations to traceable violations
    const violations = this.enhanceViolations(
      baseResult.violations,
      filePath,
      appliedScopes,
      options
    );

    // Detect conflicts if requested
    const conflicts = options.detectConflicts
      ? this.scopeRegistry.detectConflicts(appliedScopes.map(s => s.id))
      : undefined;

    // Group by scope
    const byScope = this.groupByScope(violations);

    return {
      filePath,
      violations,
      appliedScopes: appliedScopes.map(s => s.id),
      conflicts,
      errorCount: violations.filter(v => v.severity === 'error').length,
      warningCount: violations.filter(v => v.severity === 'warning').length,
      infoCount: violations.filter(v => v.severity === 'info').length,
      byScope,
    };
  }

  /**
   * Find applicable scopes for a file/component
   */
  private findApplicableScopes(
    filePath: string,
    options: ScopeCheckOptions
  ): Scope[] {
    let scopes: Scope[] = [];

    // Use explicitly specified scopes
    if (options.scopes && options.scopes.length > 0) {
      scopes = options.scopes
        .map(id => this.scopeRegistry.get(id))
        .filter((s): s is Scope => s !== undefined);
    } else {
      // Auto-detect scopes
      scopes = this.scopeRegistry.findByFile(filePath);

      if (options.componentName) {
        const componentScopes = this.scopeRegistry.findByComponent(
          options.componentName
        );
        scopes = [...scopes, ...componentScopes];
      }
    }

    // Include parent scopes if requested
    if (options.includeParents) {
      const withParents = new Set<Scope>();
      for (const scope of scopes) {
        const hierarchy = this.scopeRegistry.getHierarchy(scope.id);
        hierarchy.forEach(s => withParents.add(s));
      }
      scopes = Array.from(withParents);
    }

    return scopes;
  }

  /**
   * Enhance violations with traceability information
   */
  private enhanceViolations(
    violations: any[],
    filePath: string,
    scopes: Scope[],
    options: ScopeCheckOptions
  ): TraceableViolation[] {
    return violations.map(violation => {
      // Find which scope this violation belongs to (if any)
      const matchingScope = scopes.find(scope => {
        // Check if rule is configured in this scope
        return scope.rules[violation.ruleId] !== undefined;
      });

      // Build element path
      const elementPath = this.buildElementPath(violation.element);

      return {
        ruleId: violation.ruleId,
        ruleName: violation.ruleName,
        message: violation.message,
        severity: violation.severity,
        location: {
          filePath,
          line: violation.line,
          column: violation.column,
        },
        scope: matchingScope ? {
          id: matchingScope.id,
          name: matchingScope.name,
          selector: matchingScope.selector,
        } : undefined,
        component: options.componentName ? {
          name: options.componentName,
        } : undefined,
        elementPath,
        element: violation.element,
        context: violation.context,
        suggestion: violation.suggestion,
        documentation: violation.documentation,
      };
    });
  }

  /**
   * Build element path for traceability
   */
  private buildElementPath(elementString?: string): string[] {
    if (!elementString) {
      return [];
    }

    // Parse element string like "<div class="container">"
    const match = elementString.match(/<(\w+)[^>]*>/);
    if (!match) {
      return [];
    }

    const tagName = match[1];
    const classMatch = elementString.match(/class="([^"]+)"/);
    const idMatch = elementString.match(/id="([^"]+)"/);

    let path = tagName;
    if (idMatch) {
      path += `#${idMatch[1]}`;
    } else if (classMatch) {
      path += `.${classMatch[1].split(' ')[0]}`;
    }

    return [path];
  }

  /**
   * Group violations by scope
   */
  private groupByScope(
    violations: TraceableViolation[]
  ): Record<string, TraceableViolation[]> {
    const byScope: Record<string, TraceableViolation[]> = {};

    for (const violation of violations) {
      const scopeId = violation.scope?.id || '_global';

      if (!byScope[scopeId]) {
        byScope[scopeId] = [];
      }

      byScope[scopeId].push(violation);
    }

    return byScope;
  }

  /**
   * Get the scope registry
   */
  getScopeRegistry(): ScopeRegistry {
    return this.scopeRegistry;
  }

  /**
   * Apply scope-specific rule configuration
   */
  applyScope(scope: Scope): void {
    // This modifies the engine's rules based on scope configuration
    for (const rule of this.getRules()) {
      const scopeConfig = scope.rules[rule.id];
      if (scopeConfig) {
        // Override severity if specified
        if (scopeConfig.severity) {
          // Note: This would require making rules mutable or creating copies
          // For now, this is a placeholder for the concept
        }
      }
    }
  }

  /**
   * Check multiple files with scope awareness
   */
  async checkFilesWithScopes(
    filePaths: string[],
    options: ScopeCheckOptions = {}
  ): Promise<ScopeCheckResult[]> {
    const results: ScopeCheckResult[] = [];

    for (const filePath of filePaths) {
      try {
        const fs = require('fs');
        const html = fs.readFileSync(filePath, 'utf-8');
        const result = this.checkHTMLWithScopes(html, filePath, options);
        results.push(result);
      } catch (error) {
        // Skip files that can't be read
        console.error(`Error checking ${filePath}:`, error);
      }
    }

    return results;
  }
}

/**
 * Create a scope-aware engine with default configuration
 */
export function createScopeAwareEngine(
  scopeRegistry: ScopeRegistry
): ScopeAwareEngine {
  const { createDefaultEngine } = require('./engine');
  const defaultEngine = createDefaultEngine();
  const rules = defaultEngine.getRules();

  return new ScopeAwareEngine(rules, scopeRegistry);
}
