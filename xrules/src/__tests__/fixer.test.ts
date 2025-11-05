/**
 * Tests for Auto-Fix Engine (Phase 7)
 */

import { Fixer, applyFixes } from '../fixer';
import { Fix, FixableViolation } from '../fix-types';

describe('Fixer', () => {
  const fixer = new Fixer();

  describe('applyFixes', () => {
    it('should apply a single fix', () => {
      const content = '<img src="test.jpg">';
      const violations: FixableViolation[] = [
        {
          ruleId: 'images-alt-text',
          ruleName: 'Images must have alt text',
          message: 'Missing alt',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-1',
            ruleId: 'images-alt-text',
            description: 'Add alt attribute',
            startOffset: 19,
            endOffset: 19,
            oldText: '',
            newText: ' alt=""',
            safe: true,
          },
        },
      ];

      const result = fixer.applyFixes(content, violations);

      expect(result.fixed).toBe('<img src="test.jpg" alt="">');
      expect(result.hasChanges).toBe(true);
      expect(result.fixCount).toBe(1);
    });

    it('should apply multiple non-overlapping fixes', () => {
      const content = '<img src="a.jpg"><img src="b.jpg">';
      const violations: FixableViolation[] = [
        {
          ruleId: 'images-alt-text',
          ruleName: 'Test',
          message: 'Missing alt',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-1',
            ruleId: 'images-alt-text',
            description: 'Add alt attribute',
            startOffset: 16,
            endOffset: 16,
            oldText: '',
            newText: ' alt=""',
            safe: true,
          },
        },
        {
          ruleId: 'images-alt-text',
          ruleName: 'Test',
          message: 'Missing alt',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-2',
            ruleId: 'images-alt-text',
            description: 'Add alt attribute',
            startOffset: 33,
            endOffset: 33,
            oldText: '',
            newText: ' alt=""',
            safe: true,
          },
        },
      ];

      const result = fixer.applyFixes(content, violations);

      expect(result.fixed).toBe('<img src="a.jpg" alt=""><img src="b.jpg" alt="">');
      expect(result.fixCount).toBe(2);
    });

    it('should skip unsafe fixes when safeOnly is true', () => {
      const content = '<button></button>';
      const violations: FixableViolation[] = [
        {
          ruleId: 'test-rule',
          ruleName: 'Test',
          message: 'Test',
          severity: 'warning',
          fixable: true,
          fix: {
            id: 'fix-1',
            ruleId: 'test-rule',
            description: 'Add label',
            startOffset: 7,
            endOffset: 7,
            oldText: '',
            newText: ' aria-label="Button"',
            safe: false,
          },
        },
      ];

      const result = fixer.applyFixes(content, violations, { safeOnly: true });

      expect(result.fixed).toBe(content); // Unchanged
      expect(result.fixCount).toBe(0);
      expect(result.skippedFixes.length).toBe(1);
    });

    it('should handle dry run mode', () => {
      const content = '<img src="test.jpg">';
      const violations: FixableViolation[] = [
        {
          ruleId: 'images-alt-text',
          ruleName: 'Test',
          message: 'Missing alt',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-1',
            ruleId: 'images-alt-text',
            description: 'Add alt',
            startOffset: 19,
            endOffset: 19,
            oldText: '',
            newText: ' alt=""',
            safe: true,
          },
        },
      ];

      const result = fixer.applyFixes(content, violations, { dryRun: true });

      expect(result.fixed).toBe(content); // Unchanged in dry run
      expect(result.hasChanges).toBe(false);
      expect(result.appliedFixes.length).toBe(0);
    });

    it('should respect maxFixes limit', () => {
      const content = '<img src="a.jpg"><img src="b.jpg"><img src="c.jpg">';
      const violations: FixableViolation[] = [
        {
          ruleId: 'test',
          ruleName: 'Test',
          message: 'Test',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-1',
            ruleId: 'test',
            description: 'Fix',
            startOffset: 16,
            endOffset: 16,
            oldText: '',
            newText: ' alt=""',
            safe: true,
          },
        },
        {
          ruleId: 'test',
          ruleName: 'Test',
          message: 'Test',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-2',
            ruleId: 'test',
            description: 'Fix',
            startOffset: 33,
            endOffset: 33,
            oldText: '',
            newText: ' alt=""',
            safe: true,
          },
        },
        {
          ruleId: 'test',
          ruleName: 'Test',
          message: 'Test',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-3',
            ruleId: 'test',
            description: 'Fix',
            startOffset: 50,
            endOffset: 50,
            oldText: '',
            newText: ' alt=""',
            safe: true,
          },
        },
      ];

      const result = fixer.applyFixes(content, violations, { maxFixes: 2 });

      expect(result.fixCount).toBe(2);
      expect(result.skippedFixes.length).toBe(1);
    });
  });

  describe('conflict detection', () => {
    it('should detect overlapping fixes', () => {
      const content = '<img src="test.jpg">';
      const violations: FixableViolation[] = [
        {
          ruleId: 'rule1',
          ruleName: 'Rule 1',
          message: 'Test',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-1',
            ruleId: 'rule1',
            description: 'Fix 1',
            startOffset: 5,
            endOffset: 10,
            oldText: 'src="',
            newText: 'data-src="',
            safe: true,
          },
        },
        {
          ruleId: 'rule2',
          ruleName: 'Rule 2',
          message: 'Test',
          severity: 'error',
          fixable: true,
          fix: {
            id: 'fix-2',
            ruleId: 'rule2',
            description: 'Fix 2',
            startOffset: 8,
            endOffset: 15,
            oldText: '="test"',
            newText: '="other"',
            safe: true,
          },
        },
      ];

      const result = fixer.applyFixes(content, violations);

      // Should apply only one fix and skip the other due to overlap
      expect(result.fixCount).toBe(1);
      expect(result.skippedFixes.length).toBe(1);
    });
  });

  describe('helper functions', () => {
    it('should generate unique fix IDs', () => {
      const id1 = Fixer.generateFixId('rule1', 100);
      const id2 = Fixer.generateFixId('rule2', 100);
      const id3 = Fixer.generateFixId('rule1', 200);

      expect(id1).toBe('rule1-100');
      expect(id2).toBe('rule2-100');
      expect(id3).toBe('rule1-200');
    });
  });
});

describe('applyFixes helper', () => {
  it('should be a convenience wrapper', () => {
    const content = '<img src="test.jpg">';
    const violations: FixableViolation[] = [
      {
        ruleId: 'test',
        ruleName: 'Test',
        message: 'Test',
        severity: 'error',
        fixable: true,
        fix: {
          id: 'fix-1',
          ruleId: 'test',
          description: 'Fix',
          startOffset: 19,
          endOffset: 19,
          oldText: '',
          newText: ' alt=""',
          safe: true,
        },
      },
    ];

    const result = applyFixes(content, violations);

    expect(result.fixed).toBe('<img src="test.jpg" alt="">');
  });
});
