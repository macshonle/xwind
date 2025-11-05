/**
 * Configuration Loader (Phase 6)
 *
 * Loads XRules configuration from various sources:
 * - .xrulesrc.json
 * - .xrulesrc.js
 * - xrules.config.js
 * - package.json (xrules field)
 */

import * as fs from 'fs';
import * as path from 'path';
import { XRulesConfig, RuleSeverity } from './types';
import { Scope } from './scope-types';

/**
 * Extended configuration with Phase 6 options
 */
export interface XRulesExtendedConfig extends XRulesConfig {
  /**
   * File patterns to check
   */
  files?: string[];

  /**
   * File patterns to ignore
   */
  ignore?: string[];

  /**
   * Scopes definition (Phase 5)
   */
  scopes?: Scope[];

  /**
   * Presets to extend
   */
  extends?: string[];

  /**
   * Output format
   */
  format?: 'stylish' | 'compact' | 'json' | 'junit';

  /**
   * Fail on warnings
   */
  failOnWarnings?: boolean;

  /**
   * Maximum warnings allowed
   */
  maxWarnings?: number;

  /**
   * Enable auto-fix (future)
   */
  fix?: boolean;

  /**
   * Cache results
   */
  cache?: boolean;

  /**
   * Cache location
   */
  cacheLocation?: string;
}

/**
 * Configuration file names in priority order
 */
const CONFIG_FILES = [
  '.xrulesrc.json',
  '.xrulesrc.js',
  'xrules.config.js',
  'xrules.config.json',
];

/**
 * Load configuration from file system
 */
export async function loadConfig(
  cwd: string = process.cwd()
): Promise<XRulesExtendedConfig | null> {
  // Try each config file
  for (const configFile of CONFIG_FILES) {
    const configPath = path.join(cwd, configFile);

    if (fs.existsSync(configPath)) {
      try {
        if (configFile.endsWith('.json')) {
          const content = fs.readFileSync(configPath, 'utf-8');
          return JSON.parse(content);
        } else if (configFile.endsWith('.js')) {
          // Dynamic import for .js files
          const config = require(configPath);
          return config.default || config;
        }
      } catch (error) {
        console.warn(`Warning: Failed to load config from ${configFile}:`, error);
      }
    }
  }

  // Try package.json
  const packageJsonPath = path.join(cwd, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);
      if (packageJson.xrules) {
        return packageJson.xrules;
      }
    } catch (error) {
      console.warn('Warning: Failed to load config from package.json:', error);
    }
  }

  return null;
}

/**
 * Merge configurations (for extends)
 */
export function mergeConfigs(
  base: XRulesExtendedConfig,
  override: XRulesExtendedConfig
): XRulesExtendedConfig {
  return {
    ...base,
    ...override,
    rules: {
      ...base.rules,
      ...override.rules,
    },
    files: override.files || base.files,
    ignore: [...(base.ignore || []), ...(override.ignore || [])],
    scopes: [...(base.scopes || []), ...(override.scopes || [])],
  };
}

/**
 * Resolve preset configuration
 */
export function resolvePreset(presetName: string): XRulesExtendedConfig | null {
  try {
    const { getPreset } = require('./presets');
    const preset = getPreset(presetName);

    if (preset) {
      return {
        rules: preset.rules,
      };
    }
  } catch (error) {
    console.warn(`Warning: Preset "${presetName}" not found`);
  }

  return null;
}

/**
 * Get configuration with all extends resolved
 */
export async function getResolvedConfig(
  cwd: string = process.cwd()
): Promise<XRulesExtendedConfig> {
  let config = await loadConfig(cwd);

  // If no config found, return defaults
  if (!config) {
    return getDefaultConfig();
  }

  // Resolve extends
  if (config.extends && config.extends.length > 0) {
    let baseConfig: XRulesExtendedConfig = { rules: {} };

    for (const extendName of config.extends) {
      const extendConfig = resolvePreset(extendName);
      if (extendConfig) {
        baseConfig = mergeConfigs(baseConfig, extendConfig);
      }
    }

    config = mergeConfigs(baseConfig, config);
  }

  return config;
}

/**
 * Get default configuration
 */
export function getDefaultConfig(): XRulesExtendedConfig {
  return {
    files: ['**/*.html', '**/*.tsx', '**/*.jsx'],
    ignore: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      '.git/**',
    ],
    rules: {},
    format: 'stylish',
    failOnWarnings: false,
    cache: false,
  };
}

/**
 * Validate configuration
 */
export function validateConfig(config: XRulesExtendedConfig): string[] {
  const errors: string[] = [];

  // Validate format
  if (config.format) {
    const validFormats = ['stylish', 'compact', 'json', 'junit'];
    if (!validFormats.includes(config.format)) {
      errors.push(
        `Invalid format "${config.format}". Must be one of: ${validFormats.join(', ')}`
      );
    }
  }

  // Validate rules
  if (config.rules) {
    for (const [ruleId, ruleConfig] of Object.entries(config.rules)) {
      if (typeof ruleConfig === 'string') {
        const validSeverities: RuleSeverity[] = ['error', 'warning', 'info', 'off'];
        if (!validSeverities.includes(ruleConfig as RuleSeverity)) {
          errors.push(
            `Invalid severity "${ruleConfig}" for rule "${ruleId}". Must be one of: ${validSeverities.join(', ')}`
          );
        }
      }
    }
  }

  // Validate maxWarnings
  if (config.maxWarnings !== undefined) {
    if (typeof config.maxWarnings !== 'number' || config.maxWarnings < 0) {
      errors.push('maxWarnings must be a non-negative number');
    }
  }

  return errors;
}

/**
 * Create a default config file
 */
export function createDefaultConfigFile(cwd: string = process.cwd()): void {
  const configPath = path.join(cwd, '.xrulesrc.json');

  if (fs.existsSync(configPath)) {
    throw new Error('.xrulesrc.json already exists');
  }

  const defaultConfig: XRulesExtendedConfig = {
    extends: ['recommended'],
    files: ['src/**/*.html', 'src/**/*.tsx'],
    ignore: ['node_modules/**', 'dist/**', '.next/**'],
    rules: {
      // Customize rules here
      'images-alt-text': 'error',
      'form-labels-explicit': 'error',
    },
    format: 'stylish',
    failOnWarnings: false,
  };

  fs.writeFileSync(
    configPath,
    JSON.stringify(defaultConfig, null, 2) + '\n',
    'utf-8'
  );

  console.log('Created .xrulesrc.json');
}

/**
 * Search for config file up the directory tree
 */
export function findConfig(startDir: string = process.cwd()): string | null {
  let currentDir = startDir;

  while (true) {
    for (const configFile of CONFIG_FILES) {
      const configPath = path.join(currentDir, configFile);
      if (fs.existsSync(configPath)) {
        return configPath;
      }
    }

    // Check package.json
    const packageJsonPath = path.join(currentDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const content = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(content);
        if (packageJson.xrules) {
          return packageJsonPath;
        }
      } catch (error) {
        // Ignore
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // Reached root
      break;
    }
    currentDir = parentDir;
  }

  return null;
}
