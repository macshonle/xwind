/**
 * Tests for XRules Engine
 */

import { XRulesEngine } from '../engine';
import type { Rule } from '../types';

describe('XRules Engine', () => {
  describe('Rule management', () => {
    it('should create empty engine', () => {
      const engine = new XRulesEngine();
      expect(engine.getRules()).toHaveLength(0);
    });

    it('should add rules', () => {
      const engine = new XRulesEngine();

      const testRule: Rule = {
        id: 'test-rule',
        name: 'Test Rule',
        description: 'Test',
        category: 'best-practice',
        severity: 'warning',
        pattern: 'div',
        check: () => null,
      };

      engine.addRule(testRule);
      expect(engine.getRules()).toHaveLength(1);
      expect(engine.getRule('test-rule')).toBe(testRule);
    });

    it('should add multiple rules', () => {
      const engine = new XRulesEngine();

      const rules: Rule[] = [
        {
          id: 'rule1',
          name: 'Rule 1',
          description: 'Test',
          category: 'accessibility',
          severity: 'error',
          pattern: 'div',
          check: () => null,
        },
        {
          id: 'rule2',
          name: 'Rule 2',
          description: 'Test',
          category: 'seo',
          severity: 'warning',
          pattern: 'span',
          check: () => null,
        },
      ];

      engine.addRules(rules);
      expect(engine.getRules()).toHaveLength(2);
    });
  });

  describe('Checking HTML', () => {
    it('should check HTML and find violations', () => {
      const engine = new XRulesEngine();

      const rule: Rule = {
        id: 'no-empty-divs',
        name: 'No Empty Divs',
        description: 'Divs should not be empty',
        category: 'best-practice',
        severity: 'warning',
        pattern: 'div',
        check: (element) => {
          if (element.textContent.trim() === '' && element.children.length === 0) {
            return 'Div element is empty';
          }
          return null;
        },
      };

      engine.addRule(rule);

      const html = '<html><body><div></div><div>Content</div></body></html>';
      const result = engine.checkHTML(html);

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].ruleId).toBe('no-empty-divs');
      expect(result.warningCount).toBe(1);
      expect(result.errorCount).toBe(0);
    });

    it('should respect rule severity', () => {
      const engine = new XRulesEngine();

      const rule: Rule = {
        id: 'test-rule',
        name: 'Test Rule',
        description: 'Test',
        category: 'accessibility',
        severity: 'error',
        pattern: 'div',
        check: () => 'Always fails',
      };

      engine.addRule(rule);

      const html = '<html><body><div></div></body></html>';
      const result = engine.checkHTML(html);

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].severity).toBe('error');
      expect(result.errorCount).toBe(1);
    });

    it('should include source location when available', () => {
      const engine = new XRulesEngine();

      const rule: Rule = {
        id: 'test-rule',
        name: 'Test',
        description: 'Test',
        category: 'accessibility',
        severity: 'warning',
        pattern: 'div',
        check: () => 'Failed',
      };

      engine.addRule(rule);

      const html = `<html>
<body>
<div id="test">Content</div>
</body>
</html>`;

      const result = engine.checkHTML(html);

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].line).toBeGreaterThan(0);
    });
  });

  describe('Configuration', () => {
    it('should respect rule configuration', () => {
      const engine = new XRulesEngine();

      const rule: Rule = {
        id: 'test-rule',
        name: 'Test',
        description: 'Test',
        category: 'accessibility',
        severity: 'error',
        pattern: 'div',
        check: () => 'Failed',
      };

      engine.addRule(rule);

      const html = '<html><body><div></div></body></html>';

      // Disable rule via config
      const result = engine.checkHTML(html, 'test.html', {
        config: {
          rules: {
            'test-rule': 'off',
          },
        },
      });

      expect(result.violations).toHaveLength(0);
    });

    it('should override severity via config', () => {
      const engine = new XRulesEngine();

      const rule: Rule = {
        id: 'test-rule',
        name: 'Test',
        description: 'Test',
        category: 'accessibility',
        severity: 'error',
        pattern: 'div',
        check: () => 'Failed',
      };

      engine.addRule(rule);

      const html = '<html><body><div></div></body></html>';

      const result = engine.checkHTML(html, 'test.html', {
        config: {
          rules: {
            'test-rule': 'warning',
          },
        },
      });

      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].severity).toBe('warning');
      expect(result.errorCount).toBe(0);
      expect(result.warningCount).toBe(1);
    });
  });

  describe('Multiple rules', () => {
    it('should run multiple rules on same document', () => {
      const engine = new XRulesEngine();

      const rule1: Rule = {
        id: 'rule1',
        name: 'Rule 1',
        description: 'Test',
        category: 'accessibility',
        severity: 'error',
        pattern: 'div',
        check: () => 'Div violation',
      };

      const rule2: Rule = {
        id: 'rule2',
        name: 'Rule 2',
        description: 'Test',
        category: 'seo',
        severity: 'warning',
        pattern: 'span',
        check: () => 'Span violation',
      };

      engine.addRules([rule1, rule2]);

      const html = '<html><body><div><span></span></div></body></html>';
      const result = engine.checkHTML(html);

      expect(result.violations).toHaveLength(2);
      expect(result.errorCount).toBe(1);
      expect(result.warningCount).toBe(1);
    });

    it('should check same element against multiple matching rules', () => {
      const engine = new XRulesEngine();

      const rule1: Rule = {
        id: 'rule1',
        name: 'Rule 1',
        description: 'Test',
        category: 'accessibility',
        severity: 'error',
        pattern: 'input',
        check: (el) => {
          if (!el.getAttribute('type')) {
            return 'Input missing type';
          }
          return null;
        },
      };

      const rule2: Rule = {
        id: 'rule2',
        name: 'Rule 2',
        description: 'Test',
        category: 'accessibility',
        severity: 'error',
        pattern: 'input',
        check: (el) => {
          if (!el.getAttribute('name')) {
            return 'Input missing name';
          }
          return null;
        },
      };

      engine.addRules([rule1, rule2]);

      const html = '<html><body><input /></body></html>';
      const result = engine.checkHTML(html);

      expect(result.violations).toHaveLength(2);
      expect(result.violations.map(v => v.ruleId)).toEqual(['rule1', 'rule2']);
    });
  });
});
