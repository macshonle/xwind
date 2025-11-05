/**
 * Phase 7: Auto-Fix System Types
 *
 * Type definitions for the auto-fix system that allows
 * automatic remediation of violations.
 */

import { Violation } from './types';

/**
 * Represents a single fix to be applied
 */
export interface Fix {
  /**
   * Unique identifier for this fix
   */
  id: string;

  /**
   * Rule that generated this fix
   */
  ruleId: string;

  /**
   * Description of what this fix does
   */
  description: string;

  /**
   * Start offset in the original content
   */
  startOffset: number;

  /**
   * End offset in the original content
   */
  endOffset: number;

  /**
   * Text to replace (for validation)
   */
  oldText: string;

  /**
   * New text to insert
   */
  newText: string;

  /**
   * Priority (higher = applied first)
   * Used to resolve conflicts
   */
  priority?: number;

  /**
   * Whether this fix is safe to apply automatically
   * Unsafe fixes require user confirmation
   */
  safe?: boolean;
}

/**
 * A violation with an optional fix
 */
export interface FixableViolation extends Violation {
  /**
   * Fix for this violation (if available)
   */
  fix?: Fix;

  /**
   * Whether this violation can be fixed
   */
  fixable: boolean;
}

/**
 * Result of applying fixes
 */
export interface FixResult {
  /**
   * Original content
   */
  original: string;

  /**
   * Fixed content
   */
  fixed: string;

  /**
   * Fixes that were applied
   */
  appliedFixes: Fix[];

  /**
   * Fixes that were skipped (conflicts, unsafe, etc.)
   */
  skippedFixes: Fix[];

  /**
   * Violations that were fixed
   */
  fixedViolations: FixableViolation[];

  /**
   * Violations that remain
   */
  remainingViolations: Violation[];

  /**
   * Whether any changes were made
   */
  hasChanges: boolean;

  /**
   * Number of fixes applied
   */
  fixCount: number;
}

/**
 * Options for applying fixes
 */
export interface FixOptions {
  /**
   * Only apply safe fixes
   */
  safeOnly?: boolean;

  /**
   * Dry run - don't actually modify content
   */
  dryRun?: boolean;

  /**
   * Include specific rules only
   */
  includeRules?: string[];

  /**
   * Exclude specific rules
   */
  excludeRules?: string[];

  /**
   * Preserve formatting (attempt to match indentation, etc.)
   */
  preserveFormatting?: boolean;

  /**
   * Maximum number of fixes to apply
   */
  maxFixes?: number;
}

/**
 * File fix result
 */
export interface FileFixResult {
  /**
   * File path
   */
  filePath: string;

  /**
   * Fix result
   */
  result: FixResult;

  /**
   * Whether the file was modified
   */
  modified: boolean;

  /**
   * Error if fix failed
   */
  error?: Error;
}

/**
 * Batch fix result for multiple files
 */
export interface BatchFixResult {
  /**
   * Results for each file
   */
  files: FileFixResult[];

  /**
   * Total fixes applied across all files
   */
  totalFixes: number;

  /**
   * Total files modified
   */
  filesModified: number;

  /**
   * Total files with errors
   */
  filesWithErrors: number;

  /**
   * Total violations fixed
   */
  violationsFixed: number;

  /**
   * Total violations remaining
   */
  violationsRemaining: number;
}

/**
 * Fix conflict occurs when two fixes overlap
 */
export interface FixConflict {
  /**
   * First fix
   */
  fix1: Fix;

  /**
   * Second fix
   */
  fix2: Fix;

  /**
   * Type of conflict
   */
  type: 'overlap' | 'same-location';

  /**
   * Conflict resolution (if any)
   */
  resolution?: 'fix1' | 'fix2' | 'skip-both';
}

/**
 * Interactive fix prompt
 */
export interface FixPrompt {
  /**
   * Violation being fixed
   */
  violation: FixableViolation;

  /**
   * Fix to apply
   */
  fix: Fix;

  /**
   * Context around the fix location
   */
  context: {
    before: string;
    match: string;
    after: string;
  };

  /**
   * Preview of the fix
   */
  preview: {
    before: string;
    after: string;
  };
}
