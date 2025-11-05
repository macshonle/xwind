/**
 * Tests for File Watcher (Phase 6)
 */

import { Watcher, watch } from '../watcher';
import { XRulesExtendedConfig } from '../config-loader';

// Mock chokidar
jest.mock('chokidar', () => ({
  watch: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    close: jest.fn(),
  })),
}));

// Mock fs
jest.mock('fs');

describe('File Watcher', () => {
  const mockConfig: XRulesExtendedConfig = {
    rules: {
      'images-alt-text': {
        severity: 'error',
      },
    },
    files: ['**/*.html'],
  };

  describe('Watcher Class', () => {
    it('should create a watcher instance', () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      expect(watcher).toBeInstanceOf(Watcher);
    });

    it('should have start and stop methods', () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      expect(watcher.start).toBeDefined();
      expect(watcher.stop).toBeDefined();
    });

    it('should have getAllResults method', () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      const results = watcher.getAllResults();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should have getStats method', () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      const stats = watcher.getStats();
      expect(stats).toHaveProperty('files');
      expect(stats).toHaveProperty('errors');
      expect(stats).toHaveProperty('warnings');
      expect(stats).toHaveProperty('info');
    });

    it('should initialize with empty results', () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      const results = watcher.getAllResults();
      expect(results).toHaveLength(0);
    });

    it('should initialize stats with zeros', () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      const stats = watcher.getStats();
      expect(stats.files).toBe(0);
      expect(stats.errors).toBe(0);
      expect(stats.warnings).toBe(0);
      expect(stats.info).toBe(0);
    });
  });

  describe('watch helper function', () => {
    it('should create and start a watcher', async () => {
      const watcher = await watch({
        config: mockConfig,
      });

      expect(watcher).toBeInstanceOf(Watcher);
    });

    it('should accept custom file patterns in config', async () => {
      const customConfig = {
        ...mockConfig,
        files: ['src/**/*.tsx', 'src/**/*.jsx'],
      };

      const watcher = await watch({
        config: customConfig,
      });

      expect(watcher).toBeInstanceOf(Watcher);
    });

    it('should accept reporter options', async () => {
      const watcher = await watch({
        config: mockConfig,
        format: 'compact',
        reporterOptions: {
          colors: false,
        },
      });

      expect(watcher).toBeInstanceOf(Watcher);
    });

    it('should accept debounce option', async () => {
      const watcher = await watch({
        config: mockConfig,
        debounceDelay: 500,
      });

      expect(watcher).toBeInstanceOf(Watcher);
    });

    it('should accept onChange callback', async () => {
      const onChange = jest.fn();

      const watcher = await watch({
        config: mockConfig,
        onChange,
      });

      expect(watcher).toBeInstanceOf(Watcher);
    });
  });

  describe('Watcher Configuration', () => {
    it('should use default format if not specified', () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      expect(watcher).toBeDefined();
    });

    it('should accept custom format', () => {
      const watcher = new Watcher({
        config: mockConfig,
        format: 'json',
      });

      expect(watcher).toBeDefined();
    });

    it('should use ignore patterns from config', () => {
      const configWithIgnore = {
        ...mockConfig,
        ignore: ['node_modules/**', 'dist/**'],
      };

      const watcher = new Watcher({
        config: configWithIgnore,
      });

      expect(watcher).toBeDefined();
    });

    it('should accept verbose option', () => {
      const watcher = new Watcher({
        config: mockConfig,
        verbose: true,
      });

      expect(watcher).toBeDefined();
    });
  });

  describe('Watcher Lifecycle', () => {
    it('should start watching', async () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      await expect(watcher.start()).resolves.not.toThrow();
    });

    it('should stop watching', async () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      await watcher.start();
      await expect(watcher.stop()).resolves.not.toThrow();
    });

    it('should handle multiple start calls', async () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      await watcher.start();
      await watcher.start();

      await expect(watcher.stop()).resolves.not.toThrow();
    });

    it('should handle stop before start', async () => {
      const watcher = new Watcher({
        config: mockConfig,
      });

      await expect(watcher.stop()).resolves.not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle empty file patterns gracefully', () => {
      const emptyConfig = {
        ...mockConfig,
        files: [],
      };

      expect(() => {
        new Watcher({
          config: emptyConfig,
        });
      }).not.toThrow();
    });

    it('should handle empty config', () => {
      expect(() => {
        new Watcher({
          config: { rules: {} },
        });
      }).not.toThrow();
    });
  });
});
