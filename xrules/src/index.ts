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

// Export extended matcher
export * from './extended-matcher';

// Re-export for convenience
export { XRulesEngine, createDefaultEngine } from './engine';
export { parseHTML } from './parser';
export { formatResults, formatResultsJSON } from './reporter';
