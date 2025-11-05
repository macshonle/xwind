/**
 * Vite Plugin for XRules (Phase 6)
 *
 * Integrates XRules checking into Vite build process
 */

import { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import { createDefaultEngine } from '../engine';
import { XRulesEngine } from '../engine';
import { CheckResult } from '../types';
import { getReporter } from '../reporters';
import { loadConfig, XRulesExtendedConfig } from '../config-loader';

export interface VitePluginOptions {
  /**
   * File patterns to check
   */
  include?: string[];

  /**
   * File patterns to exclude
   */
  exclude?: string[];

  /**
   * Fail build on errors
   */
  failOnError?: boolean;

  /**
   * Fail build on warnings
   */
  failOnWarning?: boolean;

  /**
   * Configuration file path
   */
  configFile?: string;

  /**
   * Output format
   */
  format?: string;

  /**
   * Cache results
   */
  cache?: boolean;

  /**
   * Run in development mode
   */
  dev?: boolean;
}

/**
 * Vite plugin for XRules
 */
export function xrulesPlugin(options: VitePluginOptions = {}): Plugin {
  let engine: XRulesEngine;
  let config: XRulesExtendedConfig | null;
  let resultCache: Map<string, { result: CheckResult; mtime: number }> = new Map();
  let viteConfig: any;

  return {
    name: 'vite-plugin-xrules',

    async configResolved(resolvedConfig) {
      // Store Vite config for use in other hooks
      viteConfig = resolvedConfig;

      // Load XRules configuration
      const configPath = options.configFile || resolvedConfig.root;
      config = await loadConfig(configPath);

      // Create engine
      engine = createDefaultEngine();

      console.log('XRules plugin initialized');
    },

    async buildStart() {
      console.log('\n🔍 XRules: Checking files...\n');
    },

    async transform(code, id) {
      // Skip if not in development mode
      if (viteConfig.command === 'build' && !options.dev) {
        return null;
      }

      // Check if file should be checked
      if (!shouldCheckFile(id, options)) {
        return null;
      }

      // Check for cached result
      if (options.cache) {
        const cached = getCachedResult(id, resultCache);
        if (cached) {
          return null; // Already checked, no issues
        }
      }

      // Check the file
      try {
        const result = engine.checkHTML(code, id);

        // Cache result
        if (options.cache) {
          const stats = fs.statSync(id);
          resultCache.set(id, {
            result,
            mtime: stats.mtimeMs,
          });
        }

        // Output violations
        if (result.violations.length > 0) {
          const format = options.format || 'stylish';
          const reporter = getReporter(format);
          const output = reporter([result], { colors: true });

          console.log(output);

          // Fail build if needed
          if (options.failOnError && result.errorCount > 0) {
            throw new Error(`XRules: ${result.errorCount} error(s) found in ${id}`);
          }

          if (options.failOnWarning && result.warningCount > 0) {
            throw new Error(`XRules: ${result.warningCount} warning(s) found in ${id}`);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.message.startsWith('XRules:')) {
          throw error;
        }
        // Ignore parsing errors for non-HTML files
      }

      return null; // Don't transform the code
    },

    async buildEnd() {
      console.log('\n✅ XRules: Check complete\n');
    },
  };
}

/**
 * Check if file should be checked
 */
function shouldCheckFile(id: string, options: VitePluginOptions): boolean {
  // Skip node_modules
  if (id.includes('node_modules')) {
    return false;
  }

  // Check include patterns
  if (options.include) {
    const matches = options.include.some((pattern) => {
      return id.includes(pattern) || id.endsWith(pattern);
    });
    if (!matches) {
      return false;
    }
  }

  // Check exclude patterns
  if (options.exclude) {
    const matches = options.exclude.some((pattern) => {
      return id.includes(pattern) || id.endsWith(pattern);
    });
    if (matches) {
      return false;
    }
  }

  // Default: check .html, .tsx, .jsx files
  return id.endsWith('.html') || id.endsWith('.tsx') || id.endsWith('.jsx');
}

/**
 * Get cached result if file hasn't changed
 */
function getCachedResult(
  filePath: string,
  cache: Map<string, { result: CheckResult; mtime: number }>
): CheckResult | null {
  const cached = cache.get(filePath);
  if (!cached) {
    return null;
  }

  try {
    const stats = fs.statSync(filePath);
    if (stats.mtimeMs === cached.mtime) {
      return cached.result;
    }
  } catch (error) {
    // File doesn't exist or can't be read
  }

  // File changed or doesn't exist
  cache.delete(filePath);
  return null;
}

/**
 * Create plugin with default options
 */
export function xrules(options: VitePluginOptions = {}): Plugin {
  return xrulesPlugin({
    failOnError: true,
    format: 'stylish',
    cache: true,
    ...options,
  });
}

// Export default
export default xrules;
