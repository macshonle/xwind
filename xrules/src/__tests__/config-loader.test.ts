/**
 * Tests for Configuration Loader (Phase 6)
 */

import * as fs from 'fs';
import * as path from 'path';
import { loadConfig, mergeConfigs, getResolvedConfig, XRulesExtendedConfig } from '../config-loader';

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

describe('Configuration Loader', () => {
  const mockCwd = '/test/project';
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadConfig', () => {
    it('should load config from .xrulesrc.json', async () => {
      const config: XRulesExtendedConfig = {
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      };

      (mockFs.existsSync as jest.Mock).mockImplementation((filePath) => {
        return filePath === path.join(mockCwd, '.xrulesrc.json');
      });

      (mockFs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(config));

      const result = await loadConfig(mockCwd);

      expect(result).toEqual(config);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        path.join(mockCwd, '.xrulesrc.json'),
        'utf-8'
      );
    });

    it('should load config from package.json', async () => {
      const packageJson = {
        name: 'test',
        xrules: {
          rules: {
            'images-alt-text': {
              severity: 'warning',
            },
          },
        },
      };

      mockFs.existsSync = jest.fn((filePath) => {
        return filePath === path.join(mockCwd, 'package.json');
      }) as any;

      mockFs.readFileSync = jest.fn(() => JSON.stringify(packageJson)) as any;

      const result = await loadConfig(mockCwd);

      expect(result).toEqual(packageJson.xrules);
    });

    it('should return null if no config found', async () => {
      mockFs.existsSync = jest.fn(() => false) as any;

      const result = await loadConfig(mockCwd);

      expect(result).toBeNull();
    });

    it('should handle JSON parse errors gracefully', async () => {
      mockFs.existsSync = jest.fn(() => true) as any;
      mockFs.readFileSync = jest.fn(() => 'invalid json{') as any;

      const result = await loadConfig(mockCwd);

      expect(result).toBeNull();
    });

    it('should prioritize .xrulesrc.json over package.json', async () => {
      const xrulesConfig = {
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      };

      mockFs.existsSync = jest.fn((filePath) => {
        return (
          filePath === path.join(mockCwd, '.xrulesrc.json') ||
          filePath === path.join(mockCwd, 'package.json')
        );
      }) as any;

      mockFs.readFileSync = jest.fn((filePath) => {
        if (filePath === path.join(mockCwd, '.xrulesrc.json')) {
          return JSON.stringify(xrulesConfig);
        }
        return JSON.stringify({ xrules: { rules: {} } });
      }) as any;

      const result = await loadConfig(mockCwd);

      expect(result).toEqual(xrulesConfig);
    });
  });

  describe('mergeConfigs', () => {
    it('should merge two configs', () => {
      const base: XRulesExtendedConfig = {
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
          'form-labels-explicit': {
            severity: 'warning',
          },
        },
        scopes: [
          {
            id: 'base-scope',
            name: 'Base Scope',
            rules: {},
          },
        ],
      };

      const override: XRulesExtendedConfig = {
        rules: {
          'images-alt-text': {
            severity: 'warning',
          },
          'buttons-descriptive-text': {
            severity: 'error',
          },
        },
      };

      const result = mergeConfigs(base, override);

      expect((result.rules['images-alt-text'] as any).severity).toBe('warning');
      expect((result.rules['form-labels-explicit'] as any).severity).toBe('warning');
      expect((result.rules['buttons-descriptive-text'] as any).severity).toBe('error');
      expect(result.scopes).toEqual(base.scopes);
    });

    it('should override scopes', () => {
      const base: XRulesExtendedConfig = {
        rules: {},
        scopes: [
          {
            id: 'scope1',
            name: 'Scope 1',
            rules: {},
          },
        ],
      };

      const override: XRulesExtendedConfig = {
        rules: {},
        scopes: [
          {
            id: 'scope2',
            name: 'Scope 2',
            rules: {},
          },
        ],
      };

      const result = mergeConfigs(base, override);

      expect(result.scopes).toEqual(override.scopes);
    });

    it('should merge extends arrays', () => {
      const base: XRulesExtendedConfig = {
        rules: {},
        extends: ['preset1', 'preset2'],
      };

      const override: XRulesExtendedConfig = {
        rules: {},
        extends: ['preset3'],
      };

      const result = mergeConfigs(base, override);

      expect(result.extends).toEqual(['preset1', 'preset2', 'preset3']);
    });

    it('should handle empty configs', () => {
      const base: XRulesExtendedConfig = {
        rules: {},
      };

      const override: XRulesExtendedConfig = {
        rules: {},
      };

      const result = mergeConfigs(base, override);

      expect(result).toEqual({ rules: {} });
    });
  });

  describe('getResolvedConfig', () => {
    it('should return default config when no config file exists', async () => {
      mockFs.existsSync = jest.fn(() => false) as any;

      const result = await getResolvedConfig(mockCwd);

      expect(result).toBeDefined();
      expect(result.rules).toBeDefined();
    });

    it('should merge loaded config with defaults', async () => {
      const customConfig: XRulesExtendedConfig = {
        rules: {
          'images-alt-text': {
            severity: 'warning',
          },
        },
      };

      mockFs.existsSync = jest.fn(() => true) as any;
      mockFs.readFileSync = jest.fn(() => JSON.stringify(customConfig)) as any;

      const result = await getResolvedConfig(mockCwd);

      expect(result).toBeDefined();
      expect((result.rules['images-alt-text'] as any).severity).toBe('warning');
    });
  });

  describe('Config File Discovery', () => {
    it('should check multiple config file locations', async () => {
      mockFs.existsSync = jest.fn(() => false) as any;

      await loadConfig(mockCwd);

      expect(mockFs.existsSync).toHaveBeenCalledWith(path.join(mockCwd, '.xrulesrc.json'));
      expect(mockFs.existsSync).toHaveBeenCalledWith(path.join(mockCwd, 'package.json'));
    });
  });

  describe('Config Validation', () => {
    it('should handle config with invalid rule severity', async () => {
      const invalidConfig = {
        rules: {
          'images-alt-text': {
            severity: 'invalid' as any,
          },
        },
      };

      mockFs.existsSync = jest.fn(() => true) as any;
      mockFs.readFileSync = jest.fn(() => JSON.stringify(invalidConfig)) as any;

      const result = await loadConfig(mockCwd);

      // Should still load the config even if severity is invalid
      expect(result).toBeDefined();
    });

    it('should handle empty rules object', async () => {
      const config = {
        rules: {},
      };

      mockFs.existsSync = jest.fn(() => true) as any;
      mockFs.readFileSync = jest.fn(() => JSON.stringify(config)) as any;

      const result = await loadConfig(mockCwd);

      expect(result).toEqual(config);
    });
  });
});
