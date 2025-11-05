/**
 * Tests for Enhanced Reporters (Phase 6)
 */

import {
  formatStylish,
  formatCompact,
  formatJSON,
  formatJUnit,
  formatGitHubActions,
  formatTable,
  getReporter,
} from '../reporters';
import { CheckResult } from '../types';

describe('Enhanced Reporters', () => {
  const mockResults: CheckResult[] = [
    {
      filePath: '/test/file1.html',
      violations: [
        {
          ruleId: 'images-alt-text',
          ruleName: 'Images must have alt text',
          message: 'Image missing alt attribute',
          severity: 'error',
          line: 10,
          column: 5,
          element: '<img src="test.jpg">',
          suggestion: 'Add an alt attribute to describe the image',
        },
        {
          ruleId: 'form-labels-explicit',
          ruleName: 'Form labels must be explicit',
          message: 'Label missing for attribute',
          severity: 'warning',
          line: 20,
          column: 3,
        },
      ],
      errorCount: 1,
      warningCount: 1,
      infoCount: 0,
    },
    {
      filePath: '/test/file2.html',
      violations: [],
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
    },
  ];

  describe('formatStylish', () => {
    it('should format results in stylish format', () => {
      const output = formatStylish(mockResults, { colors: false });

      expect(output).toContain('file1.html');
      expect(output).toContain(':10:5');
      expect(output).toContain('Image missing alt attribute');
      expect(output).toContain('images-alt-text');
      expect(output).toContain('1 error');
      expect(output).toContain('1 warning');
    });

    it('should show suggestions when enabled', () => {
      const output = formatStylish(mockResults, {
        colors: false,
        showSuggestions: true,
      });

      expect(output).toContain('💡');
      expect(output).toContain('Add an alt attribute to describe the image');
    });

    it('should hide suggestions when disabled', () => {
      const output = formatStylish(mockResults, {
        colors: false,
        showSuggestions: false,
      });

      expect(output).not.toContain('💡');
    });

    it('should show context in verbose mode', () => {
      const resultsWithContext: CheckResult[] = [
        {
          filePath: '/test/file.html',
          violations: [
            {
              ruleId: 'test-rule',
              ruleName: 'Test Rule',
              message: 'Test message',
              severity: 'error',
              context: '<div><img src="test.jpg"></div>',
            },
          ],
          errorCount: 1,
          warningCount: 0,
          infoCount: 0,
        },
      ];

      const output = formatStylish(resultsWithContext, {
        colors: false,
        verbose: true,
      });

      expect(output).toContain('<div><img src="test.jpg"></div>');
    });

    it('should use relative paths when cwd is provided', () => {
      const output = formatStylish(mockResults, {
        colors: false,
        cwd: '/test',
      });

      expect(output).toContain('file1.html');
      expect(output).not.toContain('/test/file1.html');
    });

    it('should handle empty results', () => {
      const output = formatStylish([]);

      expect(output).toContain('No issues found');
    });
  });

  describe('formatCompact', () => {
    it('should format results in compact format', () => {
      const output = formatCompact(mockResults, { cwd: '/test' });

      expect(output).toContain('file1.html:10:5: error: Image missing alt attribute [images-alt-text]');
      expect(output).toContain('file1.html:20:3: warning: Label missing for attribute [form-labels-explicit]');
    });

    it('should handle violations without line numbers', () => {
      const results: CheckResult[] = [
        {
          filePath: '/test/file.html',
          violations: [
            {
              ruleId: 'test-rule',
              ruleName: 'Test',
              message: 'Test message',
              severity: 'info',
            },
          ],
          errorCount: 0,
          warningCount: 0,
          infoCount: 1,
        },
      ];

      const output = formatCompact(results);

      expect(output).toContain(':0:0:');
    });

    it('should handle empty results', () => {
      const output = formatCompact([]);

      expect(output).toBe('');
    });
  });

  describe('formatJSON', () => {
    it('should format results as JSON', () => {
      const output = formatJSON(mockResults);
      const parsed = JSON.parse(output);

      expect(parsed).toHaveLength(2);
      expect(parsed[0].filePath).toBe('/test/file1.html');
      expect(parsed[0].violations).toHaveLength(2);
      expect(parsed[0].errorCount).toBe(1);
    });

    it('should produce valid JSON for empty results', () => {
      const output = formatJSON([]);
      const parsed = JSON.parse(output);

      expect(parsed).toEqual([]);
    });
  });

  describe('formatJUnit', () => {
    it('should format results as JUnit XML', () => {
      const output = formatJUnit(mockResults);

      expect(output).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(output).toContain('<testsuites');
      expect(output).toContain('<testsuite');
      expect(output).toContain('<testcase');
      expect(output).toContain('tests="2"');
    });

    it('should include errors and failures', () => {
      const output = formatJUnit(mockResults);

      expect(output).toContain('<error');
      expect(output).toContain('Image missing alt attribute');
    });

    it('should escape XML entities', () => {
      const results: CheckResult[] = [
        {
          filePath: '/test/file.html',
          violations: [
            {
              ruleId: 'test',
              ruleName: 'Test & Special <chars>',
              message: 'Message with "quotes" and \'apostrophes\'',
              severity: 'error',
            },
          ],
          errorCount: 1,
          warningCount: 0,
          infoCount: 0,
        },
      ];

      const output = formatJUnit(results);

      expect(output).toContain('&lt;');
      expect(output).toContain('&gt;');
      expect(output).toContain('&quot;');
      expect(output).toContain('&apos;');
    });

    it('should handle files with no violations', () => {
      const output = formatJUnit([mockResults[1]]);

      expect(output).toContain('<testcase');
      expect(output).not.toContain('<error');
      expect(output).not.toContain('<failure');
    });
  });

  describe('formatGitHubActions', () => {
    it('should format results for GitHub Actions', () => {
      const output = formatGitHubActions(mockResults);

      expect(output).toContain('::error file=/test/file1.html,line=10,col=5::');
      expect(output).toContain('::warning file=/test/file1.html,line=20,col=3::');
      expect(output).toContain('images-alt-text');
    });

    it('should handle violations without line numbers', () => {
      const results: CheckResult[] = [
        {
          filePath: '/test/file.html',
          violations: [
            {
              ruleId: 'test',
              ruleName: 'Test',
              message: 'Test message',
              severity: 'error',
            },
          ],
          errorCount: 1,
          warningCount: 0,
          infoCount: 0,
        },
      ];

      const output = formatGitHubActions(results);

      expect(output).toContain('::error file=/test/file.html::');
    });

    it('should treat info as warnings', () => {
      const results: CheckResult[] = [
        {
          filePath: '/test/file.html',
          violations: [
            {
              ruleId: 'test',
              ruleName: 'Test',
              message: 'Info message',
              severity: 'info',
              line: 5,
            },
          ],
          errorCount: 0,
          warningCount: 0,
          infoCount: 1,
        },
      ];

      const output = formatGitHubActions(results);

      expect(output).toContain('::warning');
    });
  });

  describe('formatTable', () => {
    it('should format results as a table', () => {
      const output = formatTable(mockResults, { colors: false });

      expect(output).toContain('File');
      expect(output).toContain('Line');
      expect(output).toContain('Severity');
      expect(output).toContain('Rule');
      expect(output).toContain('Message');
      expect(output).toContain('|');
      expect(output).toContain('-');
    });

    it('should truncate long values', () => {
      const results: CheckResult[] = [
        {
          filePath: '/very/long/path/that/should/be/truncated/file.html',
          violations: [
            {
              ruleId: 'very-long-rule-id-that-should-be-truncated',
              ruleName: 'Test',
              message: 'This is a very long message that should be truncated to fit in the table column',
              severity: 'error',
              line: 10,
            },
          ],
          errorCount: 1,
          warningCount: 0,
          infoCount: 0,
        },
      ];

      const output = formatTable(results, { colors: false });

      expect(output).toContain('...');
    });

    it('should handle violations without line numbers', () => {
      const results: CheckResult[] = [
        {
          filePath: '/test/file.html',
          violations: [
            {
              ruleId: 'test',
              ruleName: 'Test',
              message: 'Test',
              severity: 'error',
            },
          ],
          errorCount: 1,
          warningCount: 0,
          infoCount: 0,
        },
      ];

      const output = formatTable(results, { colors: false });

      expect(output).toContain('| -');
    });
  });

  describe('getReporter', () => {
    it('should return stylish reporter', () => {
      const reporter = getReporter('stylish');
      expect(reporter).toBe(formatStylish);
    });

    it('should return compact reporter', () => {
      const reporter = getReporter('compact');
      expect(reporter).toBe(formatCompact);
    });

    it('should return json reporter', () => {
      const reporter = getReporter('json');
      expect(reporter).toBe(formatJSON);
    });

    it('should return junit reporter', () => {
      const reporter = getReporter('junit');
      expect(reporter).toBe(formatJUnit);
    });

    it('should return github reporter', () => {
      const reporter = getReporter('github');
      expect(reporter).toBe(formatGitHubActions);
    });

    it('should return table reporter', () => {
      const reporter = getReporter('table');
      expect(reporter).toBe(formatTable);
    });

    it('should throw error for unknown format', () => {
      expect(() => getReporter('unknown')).toThrow('Unknown format: unknown');
    });
  });

  describe('Color Support', () => {
    it('should accept colors option when enabled', () => {
      const output = formatStylish(mockResults, { colors: true });

      // Should run without error and contain basic content
      expect(output).toContain('file1.html');
      expect(output).toContain('Image missing alt attribute');
    });

    it('should work correctly when colors disabled', () => {
      const output = formatStylish(mockResults, { colors: false });

      // Should work without ANSI color codes
      expect(output).toContain('file1.html');
      expect(output).not.toMatch(/\x1b\[\d+m/);
    });
  });
});
