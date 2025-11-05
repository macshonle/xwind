/**
 * Tests for Fix-Aware Engine (Phase 7)
 */

import { createFixAwareEngine, FixAwareEngine } from '../fix-engine';

describe('FixAwareEngine', () => {
  let engine: FixAwareEngine;

  beforeEach(() => {
    engine = createFixAwareEngine();
  });

  describe('checkHTMLWithFixes', () => {
    it('should detect fixable violations', () => {
      const html = '<img src="test.jpg">';
      const result = engine.checkHTMLWithFixes(html);

      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.fixableCount).toBeGreaterThan(0);
      
      const fixableViolation = result.violations.find(v => v.fixable);
      expect(fixableViolation).toBeDefined();
      expect(fixableViolation?.fix).toBeDefined();
    });

    it('should count safe and unsafe fixes', () => {
      const html = '<img src="test.jpg"><button></button>';
      const result = engine.checkHTMLWithFixes(html);

      expect(result.fixableCount).toBeGreaterThan(0);
      expect(result.safeFixCount).toBeDefined();
    });

    it('should provide fix metadata', () => {
      const html = '<img src="test.jpg">';
      const result = engine.checkHTMLWithFixes(html);

      const fixableViolation = result.violations.find(v => v.fixable);
      expect(fixableViolation?.fix).toMatchObject({
        ruleId: 'images-alt-text',
        description: expect.any(String),
        startOffset: expect.any(Number),
        endOffset: expect.any(Number),
        oldText: expect.any(String),
        newText: expect.any(String),
      });
    });

    it('should handle HTML with no fixable violations', () => {
      const html = '<div>Hello World</div>';
      const result = engine.checkHTMLWithFixes(html);

      expect(result.fixableCount).toBe(0);
    });

    it('should mark violations as fixable when fix is available', () => {
      const html = '<img src="test.jpg">';
      const result = engine.checkHTMLWithFixes(html);

      const imgViolation = result.violations.find(
        v => v.ruleId === 'images-alt-text'
      );

      expect(imgViolation).toBeDefined();
      expect(imgViolation?.fixable).toBe(true);
      expect(imgViolation?.fix).toBeDefined();
    });
  });

  describe('getFixableRules', () => {
    it('should return all fixable rules', () => {
      const fixableRules = engine.getFixableRules();

      expect(fixableRules.length).toBeGreaterThan(0);
      expect(fixableRules.every(r => r.fix)).toBe(true);
    });
  });

  describe('isRuleFixable', () => {
    it('should identify fixable rules', () => {
      expect(engine.isRuleFixable('images-alt-text')).toBe(true);
      expect(engine.isRuleFixable('external-links-security')).toBe(true);
    });

    it('should return false for non-fixable rules', () => {
      expect(engine.isRuleFixable('non-existent-rule')).toBe(false);
    });
  });

  describe('integration with fixers', () => {
    it('should provide fixes that can be applied', () => {
      const html = '<img src="test.jpg">';
      const result = engine.checkHTMLWithFixes(html);

      const fixableViolation = result.violations.find(v => v.fixable);
      expect(fixableViolation).toBeDefined();

      const fix = fixableViolation?.fix;
      if (fix) {
        // Verify fix can be applied
        const fixed =
          html.substring(0, fix.startOffset) +
          fix.newText +
          html.substring(fix.endOffset);

        expect(fixed).toContain('alt=');
      }
    });
  });
});
