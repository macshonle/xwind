/**
 * XRules - HTML rule checking engine
 */

export * from './types';
export * from './parser';
export * from './engine';
export * from './reporter';

// Export rules
export * from './rules/form-labels-explicit';
export * from './rules/images-alt-text';
export * from './rules/buttons-descriptive-text';
export * from './rules/external-links-security';
export * from './rules/empty-links';
export * from './rules/heading-hierarchy';
export * from './rules/accessibility';
export * from './rules/seo';
export * from './rules/security';

// Export extended matcher
export * from './extended-matcher';

// Export presets
export * from './presets';

// Phase 4: Type System Integration (TypeScript/JSX support)
export * from './jsx-parser';
export * from './jsx-engine';

// Phase 5: Scopes & Traceability
export * from './scope-types';
export * from './scope-registry';
export * from './scope-engine';

// Phase 6: Integration & Tooling
export * from './config-loader';
export * from './reporters';
export * from './watcher';
export { xrulesPlugin, xrules as vitePlugin } from './integrations/vite-plugin';

// Re-export for convenience
export { XRulesEngine, createDefaultEngine } from './engine';
export { parseHTML } from './parser';
export { formatResults, formatResultsJSON } from './reporter';
export { globalScopeRegistry, createScope } from './scope-registry';
export { createScopeAwareEngine } from './scope-engine';
export { loadConfig, getResolvedConfig } from './config-loader';
export { watch } from './watcher';
