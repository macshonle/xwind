/**
 * File Watcher (Phase 6)
 *
 * Watch files for changes and automatically re-check them
 */

import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import { createDefaultEngine } from './engine';
import { CheckResult } from './types';
import { getReporter, EnhancedReporterOptions } from './reporters';
import { XRulesExtendedConfig } from './config-loader';

export interface WatchOptions {
  /**
   * Configuration
   */
  config: XRulesExtendedConfig;

  /**
   * Reporter format
   */
  format?: string;

  /**
   * Reporter options
   */
  reporterOptions?: EnhancedReporterOptions;

  /**
   * Callback when check completes
   */
  onChange?: (results: CheckResult[]) => void;

  /**
   * Debounce delay in ms
   */
  debounceDelay?: number;

  /**
   * Verbose output
   */
  verbose?: boolean;
}

/**
 * File watcher
 */
export class Watcher {
  private watcher: chokidar.FSWatcher | null = null;
  private engine = createDefaultEngine();
  private options: WatchOptions;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private lastResults: Map<string, CheckResult> = new Map();

  constructor(options: WatchOptions) {
    this.options = options;
  }

  /**
   * Start watching
   */
  async start(): Promise<void> {
    const { config, verbose = false, debounceDelay = 300 } = this.options;

    // File patterns to watch
    const patterns = config.files || ['**/*.html', '**/*.tsx', '**/*.jsx'];
    const ignored = config.ignore || ['node_modules/**', 'dist/**'];

    console.log('🔍 Starting XRules watcher...');
    if (verbose) {
      console.log('Watching:', patterns);
      console.log('Ignoring:', ignored);
    }

    this.watcher = chokidar.watch(patterns, {
      ignored,
      persistent: true,
      ignoreInitial: false,
    });

    this.watcher
      .on('add', (filePath) => this.handleChange(filePath, 'added'))
      .on('change', (filePath) => this.handleChange(filePath, 'changed'))
      .on('unlink', (filePath) => this.handleRemove(filePath))
      .on('error', (error) => console.error('Watch error:', error))
      .on('ready', () => {
        console.log('✨ Watching for changes...');
        if (!verbose) {
          console.log('Press Ctrl+C to stop');
        }
      });
  }

  /**
   * Stop watching
   */
  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
      console.log('\n👋 Stopped watching');
    }
  }

  /**
   * Handle file change
   */
  private handleChange(filePath: string, changeType: 'added' | 'changed'): void {
    const { debounceDelay = 300, verbose = false } = this.options;

    // Clear existing timer
    const existingTimer = this.debounceTimers.get(filePath);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Debounce the check
    const timer = setTimeout(async () => {
      try {
        if (verbose) {
          console.log(`\nFile ${changeType}: ${filePath}`);
        }

        const absolutePath = path.resolve(filePath);

        // Read file
        if (!fs.existsSync(absolutePath)) {
          return;
        }

        const html = fs.readFileSync(absolutePath, 'utf-8');
        const result = this.engine.checkHTML(html, filePath);

        // Store result
        this.lastResults.set(filePath, result);

        // Format and output
        this.outputResult(result, changeType);

        // Call onChange callback
        if (this.options.onChange) {
          this.options.onChange([result]);
        }
      } catch (error) {
        console.error(`Error checking ${filePath}:`, error);
      } finally {
        this.debounceTimers.delete(filePath);
      }
    }, debounceDelay);

    this.debounceTimers.set(filePath, timer);
  }

  /**
   * Handle file removal
   */
  private handleRemove(filePath: string): void {
    const { verbose = false } = this.options;

    if (verbose) {
      console.log(`\nFile removed: ${filePath}`);
    }

    // Clear stored result
    this.lastResults.delete(filePath);

    // Clear any pending timer
    const timer = this.debounceTimers.get(filePath);
    if (timer) {
      clearTimeout(timer);
      this.debounceTimers.delete(filePath);
    }
  }

  /**
   * Output result
   */
  private outputResult(result: CheckResult, changeType: string): void {
    const format = this.options.format || 'stylish';
    const reporter = getReporter(format);

    // Clear console for better readability (optional)
    if (!this.options.verbose) {
      console.clear();
    }

    const timestamp = new Date().toLocaleTimeString();
    console.log(`\n[${timestamp}] Checked ${result.filePath}`);

    if (result.violations.length === 0) {
      console.log('✅ No issues found');
    } else {
      const output = reporter([result], this.options.reporterOptions);
      console.log(output);
    }

    // Show status
    const totalErrors = result.errorCount;
    const totalWarnings = result.warningCount;

    if (totalErrors > 0) {
      console.log(`\n❌ ${totalErrors} error(s) found`);
    } else if (totalWarnings > 0) {
      console.log(`\n⚠️  ${totalWarnings} warning(s) found`);
    } else {
      console.log('\n✨ All checks passed');
    }
  }

  /**
   * Get all current results
   */
  getAllResults(): CheckResult[] {
    return Array.from(this.lastResults.values());
  }

  /**
   * Get statistics
   */
  getStats(): { files: number; errors: number; warnings: number; info: number } {
    const results = this.getAllResults();
    return {
      files: results.length,
      errors: results.reduce((sum, r) => sum + r.errorCount, 0),
      warnings: results.reduce((sum, r) => sum + r.warningCount, 0),
      info: results.reduce((sum, r) => sum + r.infoCount, 0),
    };
  }
}

/**
 * Start watching files
 */
export async function watch(options: WatchOptions): Promise<Watcher> {
  const watcher = new Watcher(options);
  await watcher.start();
  return watcher;
}
