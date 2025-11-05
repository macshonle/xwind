#!/usr/bin/env node

/**
 * XRules CLI - Command-line interface for running xrules
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { Command } from 'commander';
import { createDefaultEngine } from './engine';
import { formatResults, formatResultsJSON, countIssues } from './reporter';
import type { CheckResult } from './types';

const program = new Command();

program
  .name('xrules')
  .description('Check HTML files against accessibility and best practice rules')
  .version('0.1.0')
  .argument('[files...]', 'Files or glob patterns to check')
  .option('-f, --format <format>', 'Output format (text or json)', 'text')
  .option('--no-color', 'Disable colored output')
  .option('-q, --quiet', 'Only show errors, suppress warnings')
  .option('--verbose', 'Show verbose output including context')
  .option('--no-suggestions', 'Hide fix suggestions')
  .action(async (files: string[], options) => {
    try {
      // If no files specified, check current directory
      if (files.length === 0) {
        files = ['**/*.html'];
      }

      // Expand glob patterns
      const expandedFiles: string[] = [];
      for (const pattern of files) {
        const matches = await glob(pattern, {
          ignore: ['node_modules/**', 'dist/**', 'build/**', '.next/**'],
        });
        expandedFiles.push(...matches);
      }

      if (expandedFiles.length === 0) {
        console.error('No HTML files found');
        process.exit(1);
      }

      // Create engine with default rules
      const engine = createDefaultEngine();

      // Check all files
      const results: CheckResult[] = [];

      for (const filePath of expandedFiles) {
        const absolutePath = path.resolve(filePath);
        const html = fs.readFileSync(absolutePath, 'utf-8');
        const result = engine.checkHTML(html, filePath);
        results.push(result);
      }

      // Format and output results
      if (options.format === 'json') {
        console.log(formatResultsJSON(results));
      } else {
        const output = formatResults(results, {
          colors: options.color,
          verbose: options.verbose,
          showSuggestions: options.suggestions,
        });
        console.log(output);
      }

      // Exit with appropriate code
      const counts = countIssues(results);
      if (counts.errors > 0) {
        process.exit(1);
      } else if (!options.quiet && counts.warnings > 0) {
        process.exit(0);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Check command (for checking Next.js build output)
program
  .command('check-build')
  .description('Check Next.js build output (HTML files)')
  .argument('[buildDir]', 'Build directory to check', '.next')
  .option('-f, --format <format>', 'Output format (text or json)', 'text')
  .action(async (buildDir: string, options) => {
    const patterns = [
      path.join(buildDir, '**/*.html'),
      path.join(buildDir, 'server/app/**/*.body'),
    ];

    const files: string[] = [];
    for (const pattern of patterns) {
      const matches = await glob(pattern);
      files.push(...matches);
    }

    if (files.length === 0) {
      console.error(`No HTML files found in ${buildDir}`);
      console.error('Make sure to run "npm run build" first');
      process.exit(1);
    }

    console.log(`Checking ${files.length} files from build output...\n`);

    const engine = createDefaultEngine();
    const results: CheckResult[] = [];

    for (const filePath of files) {
      const html = fs.readFileSync(filePath, 'utf-8');
      const result = engine.checkHTML(html, filePath);
      results.push(result);
    }

    if (options.format === 'json') {
      console.log(formatResultsJSON(results));
    } else {
      const output = formatResults(results, { colors: true });
      console.log(output);
    }

    const counts = countIssues(results);
    process.exit(counts.errors > 0 ? 1 : 0);
  });

// Check string command (for quick testing)
program
  .command('check-string <html>')
  .description('Check an HTML string')
  .action((html: string) => {
    const engine = createDefaultEngine();
    const result = engine.checkHTML(html, 'input');

    const output = formatResults([result], { colors: true, showSuggestions: true });
    console.log(output);

    process.exit(result.errorCount > 0 ? 1 : 0);
  });

// List rules command
program
  .command('list-rules')
  .description('List all available rules')
  .action(() => {
    const engine = createDefaultEngine();
    const rules = engine.getRules();

    console.log('\nAvailable Rules:\n');

    for (const rule of rules) {
      console.log(`  ${rule.id}`);
      console.log(`    Name: ${rule.name}`);
      console.log(`    Category: ${rule.category}`);
      console.log(`    Severity: ${rule.severity}`);
      console.log(`    Description: ${rule.description}`);
      if (rule.documentation) {
        console.log(`    Documentation: ${rule.documentation}`);
      }
      console.log();
    }
  });

program.parse();
