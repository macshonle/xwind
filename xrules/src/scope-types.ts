/**
 * Phase 5: Scopes & Traceability Types
 *
 * This module defines the scope system for managing rules in different
 * contexts (files, components, CSS scopes) and enhanced traceability
 * for tracking violation sources.
 */

/**
 * Defines a scope where specific rules apply
 */
export interface Scope {
  /**
   * Unique identifier for this scope
   */
  id: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Description of what this scope represents
   */
  description?: string;

  /**
   * Selector pattern that identifies elements in this scope
   * Examples:
   * - '.admin-panel *' - All elements inside admin panel
   * - '[data-scope="checkout"]' - Elements with specific data attribute
   * - '.modal' - Modal dialogs
   */
  selector?: string;

  /**
   * File pattern (glob) that identifies files in this scope
   * Examples:
   * - 'src/admin/**' - All files in admin directory
   * - '**\/components/**\/*.tsx' - All TSX components
   */
  filePattern?: string;

  /**
   * Component names that belong to this scope
   * Examples:
   * - ['AdminPanel', 'AdminSettings']
   * - ['CheckoutForm', 'PaymentStep']
   */
  components?: string[];

  /**
   * Parent scope (for hierarchical scopes)
   */
  parent?: string;

  /**
   * Rules that apply in this scope
   * Maps rule IDs to their configuration
   */
  rules: Record<string, ScopeRuleConfig>;

  /**
   * Whether this scope is enabled
   */
  enabled?: boolean;
}

/**
 * Rule configuration within a scope
 */
export interface ScopeRuleConfig {
  /**
   * Severity override for this scope
   */
  severity?: 'error' | 'warning' | 'info' | 'off';

  /**
   * Scope-specific options
   */
  options?: Record<string, unknown>;

  /**
   * Custom message for violations in this scope
   */
  message?: string;
}

/**
 * Scope context during rule checking
 */
export interface ScopeContext {
  /**
   * The scope being checked
   */
  scope: Scope;

  /**
   * Parent scopes (nearest first)
   */
  parentScopes: Scope[];

  /**
   * File path being checked
   */
  filePath?: string;

  /**
   * Component name being checked (for JSX)
   */
  componentName?: string;

  /**
   * Element path from root (for traceability)
   * Example: ['html', 'body', 'div.container', 'form#login']
   */
  elementPath: string[];
}

/**
 * Enhanced violation with traceability information
 */
export interface TraceableViolation {
  /**
   * Standard violation fields
   */
  ruleId: string;
  ruleName: string;
  message: string;
  severity: 'error' | 'warning' | 'info';

  /**
   * Source location
   */
  location: {
    filePath: string;
    line?: number;
    column?: number;
    startOffset?: number;
    endOffset?: number;
  };

  /**
   * Scope information
   */
  scope?: {
    id: string;
    name: string;
    selector?: string;
  };

  /**
   * Component information (for JSX)
   */
  component?: {
    name: string;
    branch?: number;
    totalBranches?: number;
  };

  /**
   * Element path for traceability
   * Shows the path from root to the violating element
   */
  elementPath: string[];

  /**
   * Element information
   */
  element?: string;
  context?: string;

  /**
   * Suggestion for fixing
   */
  suggestion?: string;

  /**
   * Rule documentation URL
   */
  documentation?: string;
}

/**
 * Scope registry manages all defined scopes
 */
export interface IScopeRegistry {
  /**
   * All registered scopes
   */
  scopes: Map<string, Scope>;

  /**
   * Register a new scope
   */
  register(scope: Scope): void;

  /**
   * Get a scope by ID
   */
  get(id: string): Scope | undefined;

  /**
   * Find scopes that match a file path
   */
  findByFile(filePath: string): Scope[];

  /**
   * Find scopes that match a component name
   */
  findByComponent(componentName: string): Scope[];

  /**
   * Find scopes that match an element
   */
  findByElement(element: any, document: any): Scope[];

  /**
   * Get all scopes in hierarchy order (parents first)
   */
  getHierarchy(scopeId: string): Scope[];

  /**
   * Detect conflicting rules across scopes
   */
  detectConflicts(scopeIds: string[]): ScopeConflict[];
}

/**
 * Represents a conflict between rules in different scopes
 */
export interface ScopeConflict {
  /**
   * The rule that has conflicting configurations
   */
  ruleId: string;

  /**
   * Scopes with different configurations
   */
  scopes: Array<{
    scopeId: string;
    scopeName: string;
    severity: string;
    options?: Record<string, unknown>;
  }>;

  /**
   * Type of conflict
   */
  type: 'severity' | 'options' | 'both';

  /**
   * Suggested resolution
   */
  suggestion?: string;
}

/**
 * Options for scope-aware checking
 */
export interface ScopeCheckOptions {
  /**
   * Scopes to apply (by ID)
   */
  scopes?: string[];

  /**
   * Whether to include parent scopes
   */
  includeParents?: boolean;

  /**
   * Whether to detect conflicts
   */
  detectConflicts?: boolean;

  /**
   * File path being checked (for scope matching)
   */
  filePath?: string;

  /**
   * Component name being checked (for scope matching)
   */
  componentName?: string;
}

/**
 * Result of scope-aware checking
 */
export interface ScopeCheckResult {
  /**
   * File path checked
   */
  filePath: string;

  /**
   * Violations with traceability
   */
  violations: TraceableViolation[];

  /**
   * Scopes that were applied
   */
  appliedScopes: string[];

  /**
   * Detected conflicts (if enabled)
   */
  conflicts?: ScopeConflict[];

  /**
   * Summary counts
   */
  errorCount: number;
  warningCount: number;
  infoCount: number;

  /**
   * Violations grouped by scope
   */
  byScope?: Record<string, TraceableViolation[]>;
}
