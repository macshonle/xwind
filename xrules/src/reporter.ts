/**
 * Reporter - Formats and outputs check results
 */

import type { CheckResult, Violation } from './types';

/**
 * Format options
 */
export interface ReporterOptions {
  colors?: boolean;
  verbose?: boolean;
  showSuggestions?: boolean;
}

/**
 * ANSI color codes
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

/**
 * Format check results as text
 */
export function formatResults(
  results: CheckResult[],
  options: ReporterOptions = {}
): string {
  const { colors: useColors = true, verbose = false, showSuggestions = true } = options;

  const lines: string[] = [];
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalInfo = 0;

  for (const result of results) {
    if (result.violations.length === 0) {
      continue;
    }

    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;
    totalInfo += result.infoCount;

    // File header
    lines.push('');
    lines.push(colorize(result.filePath, colors.bold + colors.cyan, useColors));
    lines.push('');

    // Group violations by rule
    const violationsByRule = new Map<string, Violation[]>();
    for (const violation of result.violations) {
      const existing = violationsByRule.get(violation.ruleId) || [];
      existing.push(violation);
      violationsByRule.set(violation.ruleId, existing);
    }

    // Print each rule's violations
    for (const [ruleId, violations] of violationsByRule) {
      for (const violation of violations) {
        lines.push(formatViolation(violation, options));

        if (verbose && violation.context) {
          lines.push(colorize(`  Context: ${violation.context}`, colors.gray, useColors));
        }

        if (showSuggestions && violation.suggestion) {
          lines.push(colorize(`  💡 Suggestion: ${violation.suggestion}`, colors.blue, useColors));
        }

        lines.push('');
      }
    }
  }

  // Summary
  if (results.length > 0) {
    lines.push('');
    lines.push(colorize('Summary:', colors.bold, useColors));
    lines.push('');

    if (totalErrors > 0) {
      lines.push(colorize(`  ✖ ${totalErrors} error(s)`, colors.red, useColors));
    }

    if (totalWarnings > 0) {
      lines.push(colorize(`  ⚠ ${totalWarnings} warning(s)`, colors.yellow, useColors));
    }

    if (totalInfo > 0) {
      lines.push(colorize(`  ℹ ${totalInfo} info`, colors.blue, useColors));
    }

    if (totalErrors === 0 && totalWarnings === 0 && totalInfo === 0) {
      lines.push(colorize('  ✓ No issues found!', colors.blue, useColors));
    }
  }

  return lines.join('\n');
}

/**
 * Format a single violation
 */
function formatViolation(violation: Violation, options: ReporterOptions = {}): string {
  const { colors: useColors = true } = options;
  const parts: string[] = [];

  // Location
  if (violation.line !== undefined) {
    parts.push(colorize(`  ${violation.line}:${violation.column || 0}`, colors.gray, useColors));
  } else {
    parts.push(colorize('  unknown', colors.gray, useColors));
  }

  // Severity icon and color
  let severityIcon = '';
  let severityColor = colors.blue;

  switch (violation.severity) {
    case 'error':
      severityIcon = '✖';
      severityColor = colors.red;
      break;
    case 'warning':
      severityIcon = '⚠';
      severityColor = colors.yellow;
      break;
    case 'info':
      severityIcon = 'ℹ';
      severityColor = colors.blue;
      break;
  }

  parts.push(colorize(severityIcon, severityColor, useColors));

  // Message
  parts.push(violation.message);

  // Rule ID
  parts.push(colorize(`[${violation.ruleId}]`, colors.gray, useColors));

  return parts.join('  ');
}

/**
 * Apply color if enabled
 */
function colorize(text: string, color: string, useColors: boolean): string {
  if (!useColors) {
    return text;
  }
  return `${color}${text}${colors.reset}`;
}

/**
 * Format results as JSON
 */
export function formatResultsJSON(results: CheckResult[]): string {
  return JSON.stringify(results, null, 2);
}

/**
 * Count total issues across all results
 */
export function countIssues(results: CheckResult[]): {
  errors: number;
  warnings: number;
  info: number;
  total: number;
} {
  let errors = 0;
  let warnings = 0;
  let info = 0;

  for (const result of results) {
    errors += result.errorCount;
    warnings += result.warningCount;
    info += result.infoCount;
  }

  return {
    errors,
    warnings,
    info,
    total: errors + warnings + info,
  };
}
