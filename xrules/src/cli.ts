#!/usr/bin/env node

/**
 * XRules CLI - Command-line interface for running xrules (Phase 7 Enhanced)
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import { Command } from 'commander';
import { createDefaultEngine } from './engine';
import { formatResults, formatResultsJSON, countIssues } from './reporter';
import { loadConfig, getResolvedConfig } from './config-loader';
import { getReporter } from './reporters';
import { watch } from './watcher';
import { createFixAwareEngine } from './fix-engine';
import { applyFixes } from './fixer';
import type { CheckResult } from './types';
import type { FileFixResult, BatchFixResult } from './fix-types';

const program = new Command();

program
  .name('xrules')
  .description('Check HTML files against accessibility and best practice rules')
  .version('0.1.0')
  .argument('[files...]', 'Files or glob patterns to check')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('-f, --format <format>', 'Output format (stylish, compact, json, junit, github, table)', 'stylish')
  .option('--no-color', 'Disable colored output')
  .option('-q, --quiet', 'Only show errors, suppress warnings')
  .option('--verbose', 'Show verbose output including context')
  .option('--no-suggestions', 'Hide fix suggestions')
  .option('--max-warnings <number>', 'Fail if more than N warnings', parseInt)
  .action(async (files: string[], options) => {
    try {
      // Load configuration
      const configPath = options.config || process.cwd();
      const config = await getResolvedConfig(configPath);

      // If no files specified, use config or defaults
      if (files.length === 0) {
        files = config.files || ['**/*.html'];
      }

      // Expand glob patterns
      const expandedFiles: string[] = [];
      const ignorePatterns = config.ignore || ['node_modules/**', 'dist/**', 'build/**', '.next/**'];

      for (const pattern of files) {
        const matches = await glob(pattern, {
          ignore: ignorePatterns,
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

      // Format and output results using Phase 6 reporters
      const format = config.format || options.format;

      if (format === 'json') {
        console.log(formatResultsJSON(results));
      } else {
        const reporter = getReporter(format);
        const output = reporter(results, {
          colors: options.color,
          verbose: options.verbose,
          showSuggestions: options.suggestions,
          cwd: process.cwd(),
        });
        console.log(output);
      }

      // Exit with appropriate code
      const counts = countIssues(results);

      // Check max warnings
      const maxWarnings = options.maxWarnings ?? config.maxWarnings;
      if (maxWarnings !== undefined && counts.warnings > maxWarnings) {
        console.error(`\n✖ Too many warnings (${counts.warnings} > ${maxWarnings})`);
        process.exit(1);
      }

      if (counts.errors > 0 || (config.failOnWarnings && counts.warnings > 0)) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Watch command (Phase 6)
program
  .command('watch')
  .description('Watch files for changes and automatically re-check')
  .argument('[files...]', 'Files or glob patterns to watch')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('-f, --format <format>', 'Output format (stylish, compact, json)', 'stylish')
  .option('--verbose', 'Show verbose output')
  .action(async (files: string[], options) => {
    try {
      // Load configuration
      const configPath = options.config || process.cwd();
      const config = await getResolvedConfig(configPath);

      // Use provided files or config files
      if (files.length > 0) {
        config.files = files;
      } else if (!config.files) {
        config.files = ['**/*.html', '**/*.tsx', '**/*.jsx'];
      }

      console.log('Starting XRules in watch mode...');
      console.log('Watching patterns:', config.files);
      console.log('Press Ctrl+C to stop\n');

      // Start watching
      const watcher = await watch({
        config,
        format: options.format,
        verbose: options.verbose,
        reporterOptions: {
          colors: true,
        },
      });

      // Handle graceful shutdown
      process.on('SIGINT', async () => {
        console.log('\n\nStopping watcher...');
        await watcher.stop();
        process.exit(0);
      });
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Fix command (Phase 7)
program
  .command('fix')
  .description('Automatically fix violations where possible')
  .argument('[files...]', 'Files or glob patterns to fix')
  .option('-c, --config <path>', 'Path to configuration file')
  .option('--dry-run', 'Preview fixes without applying them')
  .option('--safe-only', 'Only apply safe fixes')
  .option('--max-fixes <number>', 'Maximum number of fixes to apply', parseInt)
  .action(async (files: string[], options) => {
    try {
      // Load configuration
      const configPath = options.config || process.cwd();
      const config = await getResolvedConfig(configPath);

      // If no files specified, use config or defaults
      if (files.length === 0) {
        files = config.files || ['**/*.html'];
      }

      // Expand glob patterns
      const expandedFiles: string[] = [];
      const ignorePatterns = config.ignore || ['node_modules/**', 'dist/**', 'build/**', '.next/**'];

      for (const pattern of files) {
        const matches = await glob(pattern, {
          ignore: ignorePatterns,
        });
        expandedFiles.push(...matches);
      }

      if (expandedFiles.length === 0) {
        console.error('No files found');
        process.exit(1);
      }

      console.log(`🔧 Fixing ${expandedFiles.length} file(s)...`);
      if (options.dryRun) {
        console.log('(Dry run - no files will be modified)\n');
      }

      // Create fix-aware engine
      const engine = createFixAwareEngine();

      // Process each file
      const fileResults: FileFixResult[] = [];
      let totalFixes = 0;
      let filesModified = 0;

      for (const filePath of expandedFiles) {
        const absolutePath = path.resolve(filePath);
        const html = fs.readFileSync(absolutePath, 'utf-8');

        // Check and get fixable violations
        const checkResult = engine.checkHTMLWithFixes(html, filePath);

        if (checkResult.fixableCount === 0) {
          console.log(`  ${filePath}: No fixable violations`);
          continue;
        }

        // Apply fixes
        const fixResult = applyFixes(html, checkResult.violations, {
          safeOnly: options.safeOnly,
          dryRun: options.dryRun,
          maxFixes: options.maxFixes,
        });

        fileResults.push({
          filePath,
          result: fixResult,
          modified: fixResult.hasChanges,
        });

        totalFixes += fixResult.fixCount;

        // Write fixed content if not dry run
        if (!options.dryRun && fixResult.hasChanges) {
          fs.writeFileSync(absolutePath, fixResult.fixed, 'utf-8');
          filesModified++;
        }

        // Report results
        if (fixResult.fixCount > 0) {
          console.log(`  ✅ ${filePath}: Fixed ${fixResult.fixCount} violation(s)`);
          if (fixResult.skippedFixes.length > 0) {
            console.log(`     ⚠️  Skipped ${fixResult.skippedFixes.length} unsafe fix(es)`);
          }
        } else {
          console.log(`  ℹ️  ${filePath}: ${checkResult.fixableCount} fixable, but skipped (unsafe or filtered)`);
        }
      }

      // Summary
      console.log('\n' + '='.repeat(60));
      console.log('Fix Summary:');
      console.log(`  Total fixes applied: ${totalFixes}`);
      console.log(`  Files modified: ${filesModified}`);

      if (options.dryRun) {
        console.log('\nDry run completed. Run without --dry-run to apply fixes.');
      }

      process.exit(0);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// Init command (Phase 6)
program
  .command('init')
  .description('Create a configuration file')
  .option('-t, --type <type>', 'Config file type (json or js)', 'json')
  .action((options) => {
    const filename = options.type === 'js' ? 'xrules.config.js' : '.xrulesrc.json';
    const configPath = path.join(process.cwd(), filename);

    if (fs.existsSync(configPath)) {
      console.error(`Configuration file already exists: ${filename}`);
      process.exit(1);
    }

    const defaultConfig = {
      rules: {
        'images-alt-text': {
          severity: 'error',
        },
        'form-labels-explicit': {
          severity: 'error',
        },
        'buttons-descriptive-text': {
          severity: 'warning',
        },
        'external-links-security': {
          severity: 'warning',
        },
        'empty-links': {
          severity: 'error',
        },
        'heading-hierarchy': {
          severity: 'warning',
        },
      },
      files: ['**/*.html', '**/*.tsx', '**/*.jsx'],
      ignore: ['node_modules/**', 'dist/**', 'build/**'],
      format: 'stylish',
    };

    if (options.type === 'js') {
      const content = `module.exports = ${JSON.stringify(defaultConfig, null, 2)};\n`;
      fs.writeFileSync(configPath, content, 'utf-8');
    } else {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2) + '\n', 'utf-8');
    }

    console.log(`✨ Created ${filename}`);
    console.log('\nYou can now run:');
    console.log('  xrules                  # Check files');
    console.log('  xrules watch            # Watch for changes');
    console.log('  xrules list-rules       # List available rules');
  });

// Check command (for checking Next.js build output)
program
  .command('check-build')
  .description('Check Next.js build output (HTML files)')
  .argument('[buildDir]', 'Build directory to check', '.next')
  .option('-f, --format <format>', 'Output format', 'stylish')
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

    const reporter = getReporter(options.format);
    const output = reporter(results, { colors: true, cwd: process.cwd() });
    console.log(output);

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
