/**
 * Tests for form-labels-explicit rule
 */

import { XRulesEngine } from '../engine';
import { formLabelsExplicit } from '../rules/form-labels-explicit';

describe('form-labels-explicit rule', () => {
  let engine: XRulesEngine;

  beforeEach(() => {
    engine = new XRulesEngine([formLabelsExplicit]);
  });

  describe('Valid patterns', () => {
    it('should pass for label with explicit for attribute and matching input', () => {
      const html = `
        <html>
          <body>
            <label for="name">Name</label>
            <input id="name" type="text" />
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass for label with nested input and matching for/id', () => {
      const html = `
        <html>
          <body>
            <label for="email">
              Email Address
              <input id="email" type="email" />
            </label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(0);
    });

    it('should pass for empty label with for attribute', () => {
      const html = `
        <html>
          <body>
            <label for="test"></label>
            <input id="test" type="text" />
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(0);
    });
  });

  describe('Invalid patterns', () => {
    it('should fail for label with nested input but no for attribute', () => {
      const html = `
        <html>
          <body>
            <label>Name <input type="text" /></label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].ruleId).toBe('form-labels-explicit');
      expect(result.violations[0].message).toContain('Voice control software');
    });

    it('should fail for label with mismatched for/id', () => {
      const html = `
        <html>
          <body>
            <label for="wrong-id">
              Name
              <input id="correct-id" type="text" />
            </label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].message).toContain('does not have a matching id');
    });

    it('should fail for label without for and without input', () => {
      const html = `
        <html>
          <body>
            <label>Just text</label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(1);
    });
  });

  describe('Form control types', () => {
    it('should check labels for textarea', () => {
      const html = `
        <html>
          <body>
            <label>Description <textarea></textarea></label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(1);
    });

    it('should check labels for select', () => {
      const html = `
        <html>
          <body>
            <label>Country <select><option>US</option></select></label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(1);
    });

    it('should ignore hidden inputs', () => {
      const html = `
        <html>
          <body>
            <label>
              <input type="hidden" value="token" />
            </label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      // Should fail because no visible form control
      expect(result.violations).toHaveLength(1);
    });
  });

  describe('Suggestions', () => {
    it('should provide helpful suggestion for missing for attribute', () => {
      const html = `
        <html>
          <body>
            <label>Name <input type="text" /></label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations[0].suggestion).toBeDefined();
      expect(result.violations[0].suggestion).toContain('id');
    });

    it('should suggest adding for attribute when input has id', () => {
      const html = `
        <html>
          <body>
            <label>Name <input id="username" type="text" /></label>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations[0].suggestion).toContain('for="username"');
    });
  });

  describe('Real-world examples', () => {
    it('should validate proper login form', () => {
      const html = `
        <html>
          <body>
            <form>
              <label for="username">Username</label>
              <input id="username" type="text" />

              <label for="password">Password</label>
              <input id="password" type="password" />

              <button type="submit">Login</button>
            </form>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(0);
    });

    it('should catch improper login form', () => {
      const html = `
        <html>
          <body>
            <form>
              <label>Username <input type="text" /></label>
              <label>Password <input type="password" /></label>
              <button type="submit">Login</button>
            </form>
          </body>
        </html>
      `;

      const result = engine.checkHTML(html);
      expect(result.violations).toHaveLength(2);
      expect(result.errorCount).toBe(2);
    });
  });
});
