/**
 * Tests for Scope-Aware Engine (Phase 5)
 */

import { ScopeAwareEngine, createScopeAwareEngine } from '../scope-engine';
import { ScopeRegistry, createScope } from '../scope-registry';
import { imagesAltText } from '../rules/images-alt-text';
import { formLabelsExplicit } from '../rules/form-labels-explicit';

describe('Scope-Aware Engine', () => {
  let registry: ScopeRegistry;
  let engine: ScopeAwareEngine;

  beforeEach(() => {
    registry = new ScopeRegistry();
    engine = new ScopeAwareEngine([imagesAltText, formLabelsExplicit], registry);
  });

  describe('Basic Scope-Aware Checking', () => {
    it('should check HTML with scopes', () => {
      const html = `
        <html><body>
          <img src="test.jpg" />
        </body></html>
      `;

      const result = engine.checkHTMLWithScopes(html, 'test.html');

      expect(result.filePath).toBe('test.html');
      expect(result.violations.length).toBeGreaterThan(0);
      expect(result.violations[0].location.filePath).toBe('test.html');
    });

    it('should enhance violations with traceability', () => {
      const html = `
        <html><body>
          <img src="test.jpg" />
        </body></html>
      `;

      const result = engine.checkHTMLWithScopes(html, 'test.html');

      const violation = result.violations[0];
      expect(violation.location).toBeDefined();
      expect(violation.location.filePath).toBe('test.html');
      expect(violation.elementPath).toBeDefined();
    });
  });

  describe('File Pattern Scopes', () => {
    it('should apply scopes based on file pattern', () => {
      const adminScope = createScope({
        id: 'admin',
        name: 'Admin Panel',
        filePattern: 'src/admin/**/*.html',
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      });

      registry.register(adminScope);

      const html = `
        <html><body>
          <img src="admin.jpg" />
        </body></html>
      `;

      const result = engine.checkHTMLWithScopes(html, 'src/admin/dashboard.html');

      expect(result.appliedScopes).toContain('admin');
      expect(result.violations[0].scope?.id).toBe('admin');
    });

    it('should not apply non-matching scopes', () => {
      const adminScope = createScope({
        id: 'admin',
        name: 'Admin Panel',
        filePattern: 'src/admin/**/*.html',
        rules: {},
      });

      registry.register(adminScope);

      const html = `<html><body><img src="test.jpg" /></body></html>`;

      const result = engine.checkHTMLWithScopes(html, 'src/public/page.html');

      expect(result.appliedScopes).not.toContain('admin');
    });
  });

  describe('Component Scopes', () => {
    it('should apply scopes for specific components', () => {
      const checkoutScope = createScope({
        id: 'checkout',
        name: 'Checkout Flow',
        components: ['CheckoutForm', 'PaymentStep'],
        rules: {
          'form-labels-explicit': {
            severity: 'error',
          },
        },
      });

      registry.register(checkoutScope);

      const html = `
        <html><body>
          <label>Email</label>
        </body></html>
      `;

      const result = engine.checkHTMLWithScopes(html, 'test.html', {
        componentName: 'CheckoutForm',
      });

      expect(result.appliedScopes).toContain('checkout');
    });
  });

  describe('Scope Hierarchy', () => {
    it('should include parent scopes when requested', () => {
      const rootScope = createScope({
        id: 'root',
        name: 'Root',
        filePattern: '**/*.html',
        rules: {},
      });

      const adminScope = createScope({
        id: 'admin',
        name: 'Admin',
        parent: 'root',
        filePattern: 'src/admin/**/*.html',
        rules: {},
      });

      registry.register(rootScope);
      registry.register(adminScope);

      const html = `<html><body></body></html>`;

      const result = engine.checkHTMLWithScopes(html, 'src/admin/page.html', {
        includeParents: true,
      });

      expect(result.appliedScopes).toContain('root');
      expect(result.appliedScopes).toContain('admin');
    });
  });

  describe('Conflict Detection', () => {
    it('should detect conflicts when enabled', () => {
      const scope1 = createScope({
        id: 'scope1',
        name: 'Scope 1',
        filePattern: '**/*.html',
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      });

      const scope2 = createScope({
        id: 'scope2',
        name: 'Scope 2',
        filePattern: '**/*.html',
        rules: {
          'images-alt-text': {
            severity: 'warning',
          },
        },
      });

      registry.register(scope1);
      registry.register(scope2);

      const html = `<html><body></body></html>`;

      const result = engine.checkHTMLWithScopes(html, 'test.html', {
        detectConflicts: true,
      });

      expect(result.conflicts).toBeDefined();
      expect(result.conflicts!.length).toBeGreaterThan(0);
    });

    it('should not detect conflicts when disabled', () => {
      const scope1 = createScope({
        id: 'scope1',
        name: 'Scope 1',
        filePattern: '**/*.html',
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      });

      registry.register(scope1);

      const html = `<html><body></body></html>`;

      const result = engine.checkHTMLWithScopes(html, 'test.html', {
        detectConflicts: false,
      });

      expect(result.conflicts).toBeUndefined();
    });
  });

  describe('Violation Grouping', () => {
    it('should group violations by scope', () => {
      const scope1 = createScope({
        id: 'scope1',
        name: 'Scope 1',
        filePattern: '**/*.html',
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      });

      registry.register(scope1);

      const html = `
        <html><body>
          <img src="test1.jpg" />
          <img src="test2.jpg" />
        </body></html>
      `;

      const result = engine.checkHTMLWithScopes(html, 'test.html');

      expect(result.byScope).toBeDefined();
      expect(result.byScope!['scope1']).toBeDefined();
      expect(result.byScope!['scope1'].length).toBeGreaterThan(0);
    });

    it('should group violations without scope under _global', () => {
      const html = `
        <html><body>
          <img src="test.jpg" />
        </body></html>
      `;

      const result = engine.checkHTMLWithScopes(html, 'test.html');

      expect(result.byScope).toBeDefined();
      expect(result.byScope!['_global']).toBeDefined();
    });
  });

  describe('Explicit Scope Selection', () => {
    it('should use explicitly specified scopes', () => {
      const scope1 = createScope({
        id: 'scope1',
        name: 'Scope 1',
        filePattern: 'test/**/*.html',
        rules: {},
      });

      const scope2 = createScope({
        id: 'scope2',
        name: 'Scope 2',
        filePattern: 'other/**/*.html',
        rules: {},
      });

      registry.register(scope1);
      registry.register(scope2);

      const html = `<html><body></body></html>`;

      const result = engine.checkHTMLWithScopes(html, 'unrelated/file.html', {
        scopes: ['scope1'],
      });

      expect(result.appliedScopes).toEqual(['scope1']);
      expect(result.appliedScopes).not.toContain('scope2');
    });
  });

  describe('createScopeAwareEngine', () => {
    it('should create engine with default rules', () => {
      const registry = new ScopeRegistry();
      const engine = createScopeAwareEngine(registry);

      expect(engine).toBeInstanceOf(ScopeAwareEngine);
      expect(engine.getRules().length).toBeGreaterThan(0);
    });
  });

  describe('Element Path Building', () => {
    it('should build element paths for traceability', () => {
      const html = `
        <html><body>
          <div class="container">
            <img src="test.jpg" />
          </div>
        </body></html>
      `;

      const result = engine.checkHTMLWithScopes(html, 'test.html');

      expect(result.violations[0].elementPath).toBeDefined();
      expect(result.violations[0].elementPath.length).toBeGreaterThan(0);
    });
  });

  describe('Counters', () => {
    it('should count violations by severity', () => {
      const html = `
        <html><body>
          <img src="test1.jpg" />
          <img src="test2.jpg" />
          <img src="test3.jpg" />
        </body></html>
      `;

      const result = engine.checkHTMLWithScopes(html, 'test.html');

      expect(result.errorCount).toBe(3);
      expect(result.errorCount + result.warningCount + result.infoCount).toBe(
        result.violations.length
      );
    });
  });
});
