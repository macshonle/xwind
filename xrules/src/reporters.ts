/**
 * Enhanced Reporters (Phase 6)
 *
 * Multiple output formats for different use cases
 */

import chalk from 'chalk';
import { CheckResult, Violation } from './types';
import { ScopeCheckResult, TraceableViolation } from './scope-types';

export interface EnhancedReporterOptions {
  colors?: boolean;
  verbose?: boolean;
  showSuggestions?: boolean;
  cwd?: string;
}

/**
 * Helper: Get line number from violation (handles both Violation and TraceableViolation)
 */
function getLine(violation: Violation | TraceableViolation): number | undefined {
  if ('location' in violation) {
    return violation.location.line;
  }
  return violation.line;
}

/**
 * Helper: Get column number from violation (handles both Violation and TraceableViolation)
 */
function getColumn(violation: Violation | TraceableViolation): number | undefined {
  if ('location' in violation) {
    return violation.location.column;
  }
  return violation.column;
}

/**
 * Stylish reporter (default) - colorful, detailed output
 */
export function formatStylish(
  results: CheckResult[] | ScopeCheckResult[],
  options: EnhancedReporterOptions = {}
): string {
  const { colors = true, verbose = false, showSuggestions = true, cwd = process.cwd() } = options;
  const lines: string[] = [];

  let totalErrors = 0;
  let totalWarnings = 0;
  let totalInfo = 0;

  for (const result of results) {
    if (result.violations.length === 0) {
      continue;
    }

    // File header
    const relativePath = result.filePath.startsWith(cwd)
      ? result.filePath.slice(cwd.length + 1)
      : result.filePath;

    lines.push('');
    lines.push(colors ? chalk.underline(relativePath) : relativePath);

    // Violations
    for (const violation of result.violations) {
      const line = getLine(violation);
      const column = getColumn(violation);
      const location = line
        ? colors
          ? chalk.dim(`:${line}:${column || 0}`)
          : `:${line}:${column || 0}`
        : '';

      const icon = getSeverityIcon(violation.severity, colors);
      const severity = colors
        ? getSeverityColor(violation.severity)(violation.severity)
        : violation.severity;

      const ruleId = colors ? chalk.dim(`(${violation.ruleId})`) : `(${violation.ruleId})`;

      lines.push(`  ${location}  ${icon}  ${severity}  ${violation.message}  ${ruleId}`);

      if (verbose && violation.context) {
        lines.push(colors ? chalk.dim(`      ${violation.context}`) : `      ${violation.context}`);
      }

      if (showSuggestions && violation.suggestion) {
        lines.push(
          colors
            ? chalk.yellow(`      💡 ${violation.suggestion}`)
            : `      💡 ${violation.suggestion}`
        );
      }

      // Show scope info if available (Phase 5)
      if ('scope' in violation && violation.scope) {
        lines.push(
          colors
            ? chalk.cyan(`      📦 Scope: ${violation.scope.name}`)
            : `      📦 Scope: ${violation.scope.name}`
        );
      }
    }

    totalErrors += result.errorCount;
    totalWarnings += result.warningCount;
    totalInfo += result.infoCount;
  }

  // Summary
  lines.push('');
  lines.push(formatSummary({ errors: totalErrors, warnings: totalWarnings, info: totalInfo }, colors));

  return lines.join('\n');
}

/**
 * Compact reporter - one line per violation
 */
export function formatCompact(
  results: CheckResult[] | ScopeCheckResult[],
  options: EnhancedReporterOptions = {}
): string {
  const { cwd = process.cwd() } = options;
  const lines: string[] = [];

  for (const result of results) {
    const relativePath = result.filePath.startsWith(cwd)
      ? result.filePath.slice(cwd.length + 1)
      : result.filePath;

    for (const violation of result.violations) {
      const line = getLine(violation);
      const column = getColumn(violation);
      const location = line ? `:${line}:${column || 0}` : ':0:0';
      lines.push(
        `${relativePath}${location}: ${violation.severity}: ${violation.message} [${violation.ruleId}]`
      );
    }
  }

  return lines.join('\n');
}

/**
 * JSON reporter - machine-readable output
 */
export function formatJSON(
  results: CheckResult[] | ScopeCheckResult[]
): string {
  return JSON.stringify(results, null, 2);
}

/**
 * JUnit XML reporter - for CI/CD integration
 */
export function formatJUnit(
  results: CheckResult[] | ScopeCheckResult[]
): string {
  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');

  let totalTests = 0;
  let totalFailures = 0;
  let totalErrors = 0;

  for (const result of results) {
    totalTests++;
    if (result.errorCount > 0) {
      totalErrors++;
    } else if (result.warningCount > 0) {
      totalFailures++;
    }
  }

  lines.push(
    `<testsuites name="xrules" tests="${totalTests}" failures="${totalFailures}" errors="${totalErrors}">`
  );

  for (const result of results) {
    const testName = result.filePath;
    lines.push(`  <testsuite name="${escapeXml(testName)}" tests="1">`);

    if (result.violations.length > 0) {
      const failureType = result.errorCount > 0 ? 'error' : 'failure';

      lines.push(`    <testcase name="${escapeXml(testName)}">`);

      for (const violation of result.violations) {
        const message = `${violation.ruleName}: ${violation.message}`;
        const line = getLine(violation);
        const location = line ? `Line ${line}` : 'Unknown location';

        lines.push(
          `      <${failureType} message="${escapeXml(message)}" type="${violation.severity}">`
        );
        lines.push(`${escapeXml(location)}: ${escapeXml(violation.message)}`);
        lines.push(`      </${failureType}>`);
      }

      lines.push('    </testcase>');
    } else {
      lines.push(`    <testcase name="${escapeXml(testName)}" />`);
    }

    lines.push('  </testsuite>');
  }

  lines.push('</testsuites>');
  return lines.join('\n');
}

/**
 * GitHub Actions reporter - annotations
 */
export function formatGitHubActions(
  results: CheckResult[] | ScopeCheckResult[]
): string {
  const lines: string[] = [];

  for (const result of results) {
    for (const violation of result.violations) {
      const level = violation.severity === 'error' ? 'error' : 'warning';
      const line = getLine(violation);
      const column = getColumn(violation);
      const location = line
        ? `file=${result.filePath},line=${line},col=${column || 1}`
        : `file=${result.filePath}`;

      lines.push(
        `::${level} ${location}::${violation.ruleName}: ${violation.message} [${violation.ruleId}]`
      );
    }
  }

  return lines.join('\n');
}

/**
 * Table reporter - tabular format
 */
export function formatTable(
  results: CheckResult[] | ScopeCheckResult[],
  options: EnhancedReporterOptions = {}
): string {
  const { colors = true } = options;
  const lines: string[] = [];

  // Header
  const header = ['File', 'Line', 'Severity', 'Rule', 'Message'];
  const colWidths = [30, 6, 10, 25, 50];

  lines.push('');
  lines.push(formatTableRow(header, colWidths, colors, true));
  lines.push(formatTableSeparator(colWidths));

  // Rows
  for (const result of results) {
    for (const violation of result.violations) {
      const line = getLine(violation);
      const row = [
        truncate(result.filePath, 28),
        line?.toString() || '-',
        violation.severity,
        truncate(violation.ruleId, 23),
        truncate(violation.message, 48),
      ];
      lines.push(formatTableRow(row, colWidths, colors));
    }
  }

  return lines.join('\n');
}

/**
 * Helper: Format table row
 */
function formatTableRow(cells: string[], widths: number[], colors: boolean, header = false): string {
  const formatted = cells.map((cell, i) => {
    const padded = cell.padEnd(widths[i]);
    return header && colors ? chalk.bold(padded) : padded;
  });
  return `| ${formatted.join(' | ')} |`;
}

/**
 * Helper: Format table separator
 */
function formatTableSeparator(widths: number[]): string {
  const parts = widths.map(w => '-'.repeat(w));
  return `|-${parts.join('-|-')}-|`;
}

/**
 * Helper: Truncate string
 */
function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Helper: Get severity icon
 */
function getSeverityIcon(severity: string, colors: boolean): string {
  if (!colors) {
    return severity === 'error' ? 'x' : severity === 'warning' ? '!' : 'i';
  }

  switch (severity) {
    case 'error':
      return chalk.red('✖');
    case 'warning':
      return chalk.yellow('⚠');
    case 'info':
      return chalk.blue('ℹ');
    default:
      return '•';
  }
}

/**
 * Helper: Get severity color function
 */
function getSeverityColor(severity: string): (text: string) => string {
  switch (severity) {
    case 'error':
      return chalk.red;
    case 'warning':
      return chalk.yellow;
    case 'info':
      return chalk.blue;
    default:
      return (text: string) => text;
  }
}

/**
 * Helper: Format summary
 */
function formatSummary(
  counts: { errors: number; warnings: number; info: number },
  colors: boolean
): string {
  const parts: string[] = [];

  if (counts.errors > 0) {
    const text = `${counts.errors} error${counts.errors !== 1 ? 's' : ''}`;
    parts.push(colors ? chalk.red(text) : text);
  }

  if (counts.warnings > 0) {
    const text = `${counts.warnings} warning${counts.warnings !== 1 ? 's' : ''}`;
    parts.push(colors ? chalk.yellow(text) : text);
  }

  if (counts.info > 0) {
    const text = `${counts.info} info`;
    parts.push(colors ? chalk.blue(text) : text);
  }

  if (parts.length === 0) {
    return colors ? chalk.green('✨ No issues found!') : 'No issues found!';
  }

  const summary = parts.join(', ');
  return colors ? chalk.bold(`\n${summary}`) : `\n${summary}`;
}

/**
 * Helper: Escape XML
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Get reporter function by format name
 */
export function getReporter(format: string): (results: any[], options?: EnhancedReporterOptions) => string {
  switch (format) {
    case 'stylish':
      return formatStylish;
    case 'compact':
      return formatCompact;
    case 'json':
      return formatJSON;
    case 'junit':
      return formatJUnit;
    case 'github':
      return formatGitHubActions;
    case 'table':
      return formatTable;
    default:
      throw new Error(`Unknown format: ${format}`);
  }
}
