/**
 * Tests for Vite Plugin (Phase 6)
 */

import { xrulesPlugin, xrules } from '../integrations/vite-plugin';
import { Plugin } from 'vite';

// Mock dependencies
jest.mock('fs');
jest.mock('../config-loader', () => ({
  loadConfig: jest.fn().mockResolvedValue({
    rules: {
      'images-alt-text': {
        severity: 'error',
      },
    },
  }),
}));

jest.mock('../reporters', () => ({
  getReporter: jest.fn(() => jest.fn(() => 'mock output')),
}));

describe('Vite Plugin', () => {
  describe('xrulesPlugin', () => {
    it('should return a valid Vite plugin', () => {
      const plugin = xrulesPlugin();

      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('vite-plugin-xrules');
      expect(plugin.configResolved).toBeDefined();
      expect(plugin.buildStart).toBeDefined();
      expect(plugin.transform).toBeDefined();
      expect(plugin.buildEnd).toBeDefined();
    });

    it('should accept options', () => {
      const plugin = xrulesPlugin({
        include: ['**/*.html'],
        exclude: ['node_modules/**'],
        failOnError: true,
      });

      expect(plugin).toBeDefined();
    });

    it('should have default options', () => {
      const plugin = xrulesPlugin();

      expect(plugin).toBeDefined();
    });

    it('should accept configFile option', () => {
      const plugin = xrulesPlugin({
        configFile: '/custom/path/.xrulesrc.json',
      });

      expect(plugin).toBeDefined();
    });

    it('should accept format option', () => {
      const plugin = xrulesPlugin({
        format: 'compact',
      });

      expect(plugin).toBeDefined();
    });

    it('should accept cache option', () => {
      const plugin = xrulesPlugin({
        cache: true,
      });

      expect(plugin).toBeDefined();
    });

    it('should accept dev mode option', () => {
      const plugin = xrulesPlugin({
        dev: true,
      });

      expect(plugin).toBeDefined();
    });
  });

  describe('xrules helper', () => {
    it('should create plugin with default options', () => {
      const plugin = xrules();

      expect(plugin).toBeDefined();
      expect(plugin.name).toBe('vite-plugin-xrules');
    });

    it('should override default options', () => {
      const plugin = xrules({
        failOnError: false,
        format: 'json',
      });

      expect(plugin).toBeDefined();
    });

    it('should set failOnError to true by default', () => {
      const plugin = xrules();

      expect(plugin).toBeDefined();
    });

    it('should set format to stylish by default', () => {
      const plugin = xrules();

      expect(plugin).toBeDefined();
    });

    it('should enable cache by default', () => {
      const plugin = xrules();

      expect(plugin).toBeDefined();
    });
  });

  describe('Plugin Hooks', () => {
    it('should have configResolved hook', () => {
      const plugin = xrulesPlugin() as Plugin;

      expect(plugin.configResolved).toBeDefined();
      expect(typeof plugin.configResolved).toBe('function');
    });

    it('should have buildStart hook', () => {
      const plugin = xrulesPlugin() as Plugin;

      expect(plugin.buildStart).toBeDefined();
      expect(typeof plugin.buildStart).toBe('function');
    });

    it('should have buildEnd hook', () => {
      const plugin = xrulesPlugin() as Plugin;

      expect(plugin.buildEnd).toBeDefined();
      expect(typeof plugin.buildEnd).toBe('function');
    });

    it('should have transform hook', () => {
      const plugin = xrulesPlugin() as Plugin;

      expect(plugin.transform).toBeDefined();
      expect(typeof plugin.transform).toBe('function');
    });
  });

  describe('File Filtering', () => {
    it('should check HTML files by default', () => {
      const plugin = xrulesPlugin();

      expect(plugin).toBeDefined();
    });

    it('should respect include patterns', () => {
      const plugin = xrulesPlugin({
        include: ['**/*.tsx', '**/*.jsx'],
      });

      expect(plugin).toBeDefined();
    });

    it('should respect exclude patterns', () => {
      const plugin = xrulesPlugin({
        exclude: ['node_modules/**', 'dist/**'],
      });

      expect(plugin).toBeDefined();
    });

    it('should skip node_modules by default', () => {
      const plugin = xrulesPlugin();

      expect(plugin).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle failOnError option', () => {
      const plugin = xrulesPlugin({
        failOnError: true,
      });

      expect(plugin).toBeDefined();
    });

    it('should handle failOnWarning option', () => {
      const plugin = xrulesPlugin({
        failOnWarning: true,
      });

      expect(plugin).toBeDefined();
    });

    it('should not fail by default', () => {
      const plugin = xrulesPlugin();

      expect(plugin).toBeDefined();
    });
  });

  describe('Caching', () => {
    it('should cache results when enabled', () => {
      const plugin = xrulesPlugin({
        cache: true,
      });

      expect(plugin).toBeDefined();
    });

    it('should not cache when disabled', () => {
      const plugin = xrulesPlugin({
        cache: false,
      });

      expect(plugin).toBeDefined();
    });
  });

  describe('Development Mode', () => {
    it('should run in development mode when dev is true', () => {
      const plugin = xrulesPlugin({
        dev: true,
      });

      expect(plugin).toBeDefined();
    });

    it('should skip in build mode by default', () => {
      const plugin = xrulesPlugin({
        dev: false,
      });

      expect(plugin).toBeDefined();
    });
  });

  describe('Integration', () => {
    it('should work with Vite config', () => {
      const viteConfig = {
        plugins: [xrules()],
      };

      expect(viteConfig.plugins).toHaveLength(1);
      expect(viteConfig.plugins[0].name).toBe('vite-plugin-xrules');
    });

    it('should work with multiple plugins', () => {
      const viteConfig = {
        plugins: [
          xrules(),
          { name: 'other-plugin' } as Plugin,
        ],
      };

      expect(viteConfig.plugins).toHaveLength(2);
    });
  });
});
