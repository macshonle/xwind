/**
 * Scope Registry Implementation
 *
 * Manages scope definitions, hierarchy, and conflict detection.
 */

import {
  Scope,
  IScopeRegistry,
  ScopeConflict,
} from './scope-types';
import { Element, Document } from './types';
import { minimatch } from 'minimatch';

/**
 * Implementation of the scope registry
 */
export class ScopeRegistry implements IScopeRegistry {
  scopes: Map<string, Scope>;

  constructor() {
    this.scopes = new Map();
  }

  /**
   * Register a new scope
   */
  register(scope: Scope): void {
    if (this.scopes.has(scope.id)) {
      throw new Error(`Scope with id "${scope.id}" is already registered`);
    }

    // Validate parent exists if specified
    if (scope.parent && !this.scopes.has(scope.parent)) {
      throw new Error(
        `Parent scope "${scope.parent}" not found for scope "${scope.id}"`
      );
    }

    // Check for circular dependencies
    if (scope.parent && this.hasCircularDependency(scope.id, scope.parent)) {
      throw new Error(
        `Circular dependency detected: scope "${scope.id}" cannot have "${scope.parent}" as parent`
      );
    }

    this.scopes.set(scope.id, scope);
  }

  /**
   * Get a scope by ID
   */
  get(id: string): Scope | undefined {
    return this.scopes.get(id);
  }

  /**
   * Find scopes that match a file path
   */
  findByFile(filePath: string): Scope[] {
    const matchingScopes: Scope[] = [];

    for (const scope of this.scopes.values()) {
      if (!scope.enabled && scope.enabled !== undefined) {
        continue;
      }

      if (scope.filePattern && minimatch(filePath, scope.filePattern)) {
        matchingScopes.push(scope);
      }
    }

    return this.sortByHierarchy(matchingScopes);
  }

  /**
   * Find scopes that match a component name
   */
  findByComponent(componentName: string): Scope[] {
    const matchingScopes: Scope[] = [];

    for (const scope of this.scopes.values()) {
      if (!scope.enabled && scope.enabled !== undefined) {
        continue;
      }

      if (scope.components && scope.components.includes(componentName)) {
        matchingScopes.push(scope);
      }
    }

    return this.sortByHierarchy(matchingScopes);
  }

  /**
   * Find scopes that match an element
   */
  findByElement(element: Element, document: Document): Scope[] {
    const matchingScopes: Scope[] = [];

    for (const scope of this.scopes.values()) {
      if (!scope.enabled && scope.enabled !== undefined) {
        continue;
      }

      if (scope.selector) {
        // Check if element or any ancestor matches the scope selector
        if (this.elementMatchesScope(element, scope.selector, document)) {
          matchingScopes.push(scope);
        }
      }
    }

    return this.sortByHierarchy(matchingScopes);
  }

  /**
   * Get all scopes in hierarchy order (parents first)
   */
  getHierarchy(scopeId: string): Scope[] {
    const scope = this.scopes.get(scopeId);
    if (!scope) {
      return [];
    }

    const hierarchy: Scope[] = [];
    let current: Scope | undefined = scope;

    // Traverse up the hierarchy
    while (current) {
      hierarchy.unshift(current); // Add at beginning
      current = current.parent ? this.scopes.get(current.parent) : undefined;
    }

    return hierarchy;
  }

  /**
   * Detect conflicting rules across scopes
   */
  detectConflicts(scopeIds: string[]): ScopeConflict[] {
    const conflicts: ScopeConflict[] = [];
    const ruleConfigs: Map<string, Array<{
      scopeId: string;
      scope: Scope;
      config: any;
    }>> = new Map();

    // Collect all rule configurations from all scopes
    for (const scopeId of scopeIds) {
      const scope = this.scopes.get(scopeId);
      if (!scope) continue;

      for (const [ruleId, config] of Object.entries(scope.rules)) {
        if (!ruleConfigs.has(ruleId)) {
          ruleConfigs.set(ruleId, []);
        }

        ruleConfigs.get(ruleId)!.push({
          scopeId,
          scope,
          config,
        });
      }
    }

    // Check for conflicts
    for (const [ruleId, configs] of ruleConfigs.entries()) {
      if (configs.length < 2) continue;

      const severities = new Set(configs.map(c => c.config.severity));
      const hasOptionsDiff = this.hasOptionsDifferences(configs.map(c => c.config.options || {}));

      if (severities.size > 1 || hasOptionsDiff) {
        conflicts.push({
          ruleId,
          scopes: configs.map(c => ({
            scopeId: c.scopeId,
            scopeName: c.scope.name,
            severity: c.config.severity || 'default',
            options: c.config.options,
          })),
          type: severities.size > 1 && hasOptionsDiff ? 'both' :
                severities.size > 1 ? 'severity' : 'options',
          suggestion: this.generateConflictSuggestion(ruleId, configs),
        });
      }
    }

    return conflicts;
  }

  /**
   * Check if there's a circular dependency
   */
  private hasCircularDependency(scopeId: string, parentId: string): boolean {
    const visited = new Set<string>();
    let current: string | undefined = parentId;

    while (current) {
      if (current === scopeId) {
        return true; // Found cycle
      }

      if (visited.has(current)) {
        return false; // Already checked this path
      }

      visited.add(current);
      const scope = this.scopes.get(current);
      current = scope?.parent;
    }

    return false;
  }

  /**
   * Check if an element matches a scope selector
   */
  private elementMatchesScope(
    element: Element,
    selector: string,
    document: Document
  ): boolean {
    // Check if element itself matches
    try {
      // For scopes like '.admin-panel *', we need to check ancestors
      if (selector.endsWith(' *')) {
        const parentSelector = selector.slice(0, -2).trim();
        return this.hasAncestorMatching(element, parentSelector, document);
      }

      // Direct match
      const matches = document.querySelectorAll(selector);
      return matches.some(el => el === element);
    } catch (error) {
      console.warn(`Invalid scope selector: ${selector}`, error);
      return false;
    }
  }

  /**
   * Check if element has an ancestor matching selector
   */
  private hasAncestorMatching(
    element: Element,
    selector: string,
    document: Document
  ): boolean {
    let current: Element | undefined = element;

    while (current) {
      try {
        const matches = document.querySelectorAll(selector);
        if (matches.some(el => el === current)) {
          return true;
        }
      } catch (error) {
        return false;
      }

      current = current.parent;
    }

    return false;
  }

  /**
   * Sort scopes by hierarchy (parents first)
   */
  private sortByHierarchy(scopes: Scope[]): Scope[] {
    const sorted: Scope[] = [];
    const remaining = new Set(scopes);

    // Add scopes without parents first
    for (const scope of scopes) {
      if (!scope.parent) {
        sorted.push(scope);
        remaining.delete(scope);
      }
    }

    // Add remaining scopes in order
    while (remaining.size > 0) {
      const sizeBefore = remaining.size;

      for (const scope of Array.from(remaining)) {
        if (!scope.parent || sorted.some(s => s.id === scope.parent)) {
          sorted.push(scope);
          remaining.delete(scope);
        }
      }

      // Prevent infinite loop if there are orphaned scopes
      if (remaining.size === sizeBefore) {
        sorted.push(...Array.from(remaining));
        break;
      }
    }

    return sorted;
  }

  /**
   * Check if there are differences in options across configurations
   */
  private hasOptionsDifferences(optionsList: Record<string, unknown>[]): boolean {
    if (optionsList.length < 2) return false;

    const first = JSON.stringify(optionsList[0]);
    return optionsList.some(opts => JSON.stringify(opts) !== first);
  }

  /**
   * Generate a suggestion for resolving conflicts
   */
  private generateConflictSuggestion(ruleId: string, configs: any[]): string {
    const scopeNames = configs.map(c => c.scope.name).join(', ');
    return `Rule "${ruleId}" has different configurations in scopes: ${scopeNames}. ` +
           `Consider using scope hierarchy or explicitly disabling the rule in one scope.`;
  }
}

/**
 * Create a scope definition
 */
export function createScope(config: {
  id: string;
  name: string;
  description?: string;
  selector?: string;
  filePattern?: string;
  components?: string[];
  parent?: string;
  rules: Record<string, any>;
  enabled?: boolean;
}): Scope {
  return {
    id: config.id,
    name: config.name,
    description: config.description,
    selector: config.selector,
    filePattern: config.filePattern,
    components: config.components,
    parent: config.parent,
    rules: config.rules,
    enabled: config.enabled !== undefined ? config.enabled : true,
  };
}

/**
 * Create a global scope registry instance
 */
export const globalScopeRegistry = new ScopeRegistry();
