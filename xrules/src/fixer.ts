/**
 * Phase 7: Auto-Fix Engine
 *
 * Applies fixes to content safely, handling conflicts and preserving formatting.
 */

import {
  Fix,
  FixResult,
  FixOptions,
  FixConflict,
  FixableViolation,
} from './fix-types';
import { Violation } from './types';

/**
 * Auto-fix engine
 */
export class Fixer {
  /**
   * Apply fixes to content
   */
  applyFixes(
    content: string,
    violations: FixableViolation[],
    options: FixOptions = {}
  ): FixResult {
    const {
      safeOnly = false,
      dryRun = false,
      includeRules = [],
      excludeRules = [],
      maxFixes,
    } = options;

    // Extract fixes from violations
    let fixes = violations
      .filter((v) => v.fixable && v.fix)
      .map((v) => v.fix!)
      .filter((fix) => {
        // Filter by safety
        if (safeOnly && fix.safe === false) return false;

        // Filter by rules
        if (includeRules.length > 0 && !includeRules.includes(fix.ruleId)) {
          return false;
        }
        if (excludeRules.length > 0 && excludeRules.includes(fix.ruleId)) {
          return false;
        }

        return true;
      });

    // Detect and resolve conflicts
    const { validFixes, skippedFixes: conflictedFixes } =
      this.resolveConflicts(fixes);

    // Apply max fixes limit
    let fixesToApply = validFixes;
    let skippedByLimit: Fix[] = [];

    if (maxFixes !== undefined && validFixes.length > maxFixes) {
      fixesToApply = validFixes.slice(0, maxFixes);
      skippedByLimit = validFixes.slice(maxFixes);
    }

    // Apply fixes (if not dry run)
    let fixed = content;
    const appliedFixes: Fix[] = [];

    if (!dryRun) {
      fixed = this.applyFixesToContent(content, fixesToApply);
      appliedFixes.push(...fixesToApply);
    }

    // Collect results
    const allSkippedFixes = [...conflictedFixes, ...skippedByLimit];

    const fixedViolations = violations.filter(
      (v) => v.fix && appliedFixes.includes(v.fix)
    );

    const remainingViolations = violations.filter(
      (v) => !v.fix || !appliedFixes.includes(v.fix)
    );

    return {
      original: content,
      fixed,
      appliedFixes,
      skippedFixes: allSkippedFixes,
      fixedViolations,
      remainingViolations,
      hasChanges: fixed !== content,
      fixCount: appliedFixes.length,
    };
  }

  /**
   * Detect and resolve conflicts between fixes
   */
  private resolveConflicts(fixes: Fix[]): {
    validFixes: Fix[];
    skippedFixes: Fix[];
  } {
    // Sort fixes by position (reverse order for safe application)
    const sortedFixes = [...fixes].sort((a, b) => b.startOffset - a.startOffset);

    const conflicts: FixConflict[] = [];
    const validFixes: Fix[] = [];
    const skippedFixes: Fix[] = [];

    for (let i = 0; i < sortedFixes.length; i++) {
      const fix = sortedFixes[i];
      let hasConflict = false;

      // Check for conflicts with already accepted fixes
      for (const acceptedFix of validFixes) {
        if (this.fixesOverlap(fix, acceptedFix)) {
          hasConflict = true;
          conflicts.push({
            fix1: fix,
            fix2: acceptedFix,
            type: this.getConflictType(fix, acceptedFix),
            resolution: 'fix2', // Keep the already accepted fix
          });
          break;
        }
      }

      if (!hasConflict) {
        validFixes.push(fix);
      } else {
        skippedFixes.push(fix);
      }
    }

    return { validFixes, skippedFixes };
  }

  /**
   * Check if two fixes overlap
   */
  private fixesOverlap(fix1: Fix, fix2: Fix): boolean {
    return !(
      fix1.endOffset <= fix2.startOffset || fix1.startOffset >= fix2.endOffset
    );
  }

  /**
   * Get conflict type
   */
  private getConflictType(fix1: Fix, fix2: Fix): 'overlap' | 'same-location' {
    if (fix1.startOffset === fix2.startOffset && fix1.endOffset === fix2.endOffset) {
      return 'same-location';
    }
    return 'overlap';
  }

  /**
   * Apply fixes to content
   * Fixes must be sorted in reverse order (last to first)
   */
  private applyFixesToContent(content: string, fixes: Fix[]): string {
    let result = content;

    // Fixes are already sorted in reverse order
    for (const fix of fixes) {
      // Validate that the old text matches
      const actualText = result.substring(fix.startOffset, fix.endOffset);

      if (actualText !== fix.oldText) {
        console.warn(
          `Fix validation failed for ${fix.id}: expected "${fix.oldText}" but found "${actualText}"`
        );
        continue;
      }

      // Apply the fix
      result =
        result.substring(0, fix.startOffset) +
        fix.newText +
        result.substring(fix.endOffset);
    }

    return result;
  }

  /**
   * Get context around a fix location
   */
  getFixContext(
    content: string,
    fix: Fix,
    contextLines: number = 2
  ): { before: string; match: string; after: string } {
    const lines = content.split('\n');
    const fixText = content.substring(fix.startOffset, fix.endOffset);

    // Find the line containing the fix
    let currentOffset = 0;
    let lineIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for newline

      if (currentOffset + lineLength > fix.startOffset) {
        lineIndex = i;
        break;
      }

      currentOffset += lineLength;
    }

    // Get context lines
    const startLine = Math.max(0, lineIndex - contextLines);
    const endLine = Math.min(lines.length - 1, lineIndex + contextLines);

    const beforeLines = lines.slice(startLine, lineIndex);
    const matchLine = lines[lineIndex];
    const afterLines = lines.slice(lineIndex + 1, endLine + 1);

    return {
      before: beforeLines.join('\n'),
      match: matchLine,
      after: afterLines.join('\n'),
    };
  }

  /**
   * Preview a fix
   */
  previewFix(content: string, fix: Fix): { before: string; after: string } {
    const before = content.substring(fix.startOffset, fix.endOffset);
    const after = fix.newText;

    return { before, after };
  }

  /**
   * Generate a unique fix ID
   */
  static generateFixId(ruleId: string, offset: number): string {
    return `${ruleId}-${offset}`;
  }
}

/**
 * Default fixer instance
 */
export const defaultFixer = new Fixer();

/**
 * Helper function to apply fixes
 */
export function applyFixes(
  content: string,
  violations: FixableViolation[],
  options?: FixOptions
): FixResult {
  return defaultFixer.applyFixes(content, violations, options);
}
