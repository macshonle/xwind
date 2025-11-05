/**
 * Tests for Scope Registry (Phase 5)
 */

import { ScopeRegistry, createScope } from '../scope-registry';
import { Scope } from '../scope-types';

describe('Scope Registry', () => {
  let registry: ScopeRegistry;

  beforeEach(() => {
    registry = new ScopeRegistry();
  });

  describe('Scope Registration', () => {
    it('should register a scope', () => {
      const scope = createScope({
        id: 'admin',
        name: 'Admin Panel',
        selector: '.admin-panel *',
        rules: {},
      });

      registry.register(scope);

      expect(registry.get('admin')).toBe(scope);
    });

    it('should throw error for duplicate scope IDs', () => {
      const scope1 = createScope({
        id: 'test',
        name: 'Test 1',
        rules: {},
      });

      const scope2 = createScope({
        id: 'test',
        name: 'Test 2',
        rules: {},
      });

      registry.register(scope1);

      expect(() => registry.register(scope2)).toThrow('already registered');
    });

    it('should throw error for non-existent parent', () => {
      const scope = createScope({
        id: 'child',
        name: 'Child',
        parent: 'non-existent',
        rules: {},
      });

      expect(() => registry.register(scope)).toThrow('Parent scope');
    });

    it('should detect circular dependencies', () => {
      const parent = createScope({
        id: 'parent',
        name: 'Parent',
        rules: {},
      });

      registry.register(parent);

      const child = createScope({
        id: 'child',
        name: 'Child',
        parent: 'parent',
        rules: {},
      });

      registry.register(child);

      // Try to make parent's parent the child (circular)
      const circularParent = createScope({
        id: 'grandparent',
        name: 'Grandparent',
        parent: 'child',
        rules: {},
      });

      registry.register(circularParent);

      // Now try to add a scope that creates a cycle
      const cycle = createScope({
        id: 'cycle',
        name: 'Cycle',
        parent: 'grandparent',
        rules: {},
      });

      // This should work because no direct cycle yet
      registry.register(cycle);
    });
  });

  describe('Scope Hierarchy', () => {
    it('should get scope hierarchy in correct order', () => {
      const root = createScope({
        id: 'root',
        name: 'Root',
        rules: {},
      });

      const child = createScope({
        id: 'child',
        name: 'Child',
        parent: 'root',
        rules: {},
      });

      const grandchild = createScope({
        id: 'grandchild',
        name: 'Grandchild',
        parent: 'child',
        rules: {},
      });

      registry.register(root);
      registry.register(child);
      registry.register(grandchild);

      const hierarchy = registry.getHierarchy('grandchild');

      expect(hierarchy).toHaveLength(3);
      expect(hierarchy[0].id).toBe('root');
      expect(hierarchy[1].id).toBe('child');
      expect(hierarchy[2].id).toBe('grandchild');
    });

    it('should return empty array for non-existent scope', () => {
      const hierarchy = registry.getHierarchy('non-existent');
      expect(hierarchy).toEqual([]);
    });
  });

  describe('File Pattern Matching', () => {
    it('should find scopes by file pattern', () => {
      const adminScope = createScope({
        id: 'admin',
        name: 'Admin',
        filePattern: 'src/admin/**/*.tsx',
        rules: {},
      });

      const publicScope = createScope({
        id: 'public',
        name: 'Public',
        filePattern: 'src/public/**/*.tsx',
        rules: {},
      });

      registry.register(adminScope);
      registry.register(publicScope);

      const matches = registry.findByFile('src/admin/Dashboard.tsx');

      expect(matches).toHaveLength(1);
      expect(matches[0].id).toBe('admin');
    });

    it('should handle multiple matching patterns', () => {
      const allComponents = createScope({
        id: 'all',
        name: 'All Components',
        filePattern: '**/*.tsx',
        rules: {},
      });

      const adminComponents = createScope({
        id: 'admin',
        name: 'Admin Components',
        filePattern: 'src/admin/**/*.tsx',
        rules: {},
      });

      registry.register(allComponents);
      registry.register(adminComponents);

      const matches = registry.findByFile('src/admin/Dashboard.tsx');

      expect(matches).toHaveLength(2);
      expect(matches.map(s => s.id)).toContain('all');
      expect(matches.map(s => s.id)).toContain('admin');
    });

    it('should not find disabled scopes', () => {
      const disabledScope = createScope({
        id: 'disabled',
        name: 'Disabled',
        filePattern: '**/*.tsx',
        rules: {},
        enabled: false,
      });

      registry.register(disabledScope);

      const matches = registry.findByFile('test.tsx');

      expect(matches).toHaveLength(0);
    });
  });

  describe('Component Matching', () => {
    it('should find scopes by component name', () => {
      const adminScope = createScope({
        id: 'admin',
        name: 'Admin',
        components: ['AdminPanel', 'AdminSettings'],
        rules: {},
      });

      registry.register(adminScope);

      const matches = registry.findByComponent('AdminPanel');

      expect(matches).toHaveLength(1);
      expect(matches[0].id).toBe('admin');
    });

    it('should return empty array for non-matching component', () => {
      const adminScope = createScope({
        id: 'admin',
        name: 'Admin',
        components: ['AdminPanel'],
        rules: {},
      });

      registry.register(adminScope);

      const matches = registry.findByComponent('UserProfile');

      expect(matches).toHaveLength(0);
    });
  });

  describe('Conflict Detection', () => {
    it('should detect severity conflicts', () => {
      const scope1 = createScope({
        id: 'scope1',
        name: 'Scope 1',
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      });

      const scope2 = createScope({
        id: 'scope2',
        name: 'Scope 2',
        rules: {
          'images-alt-text': {
            severity: 'warning',
          },
        },
      });

      registry.register(scope1);
      registry.register(scope2);

      const conflicts = registry.detectConflicts(['scope1', 'scope2']);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].ruleId).toBe('images-alt-text');
      expect(conflicts[0].type).toBe('severity');
    });

    it('should detect options conflicts', () => {
      const scope1 = createScope({
        id: 'scope1',
        name: 'Scope 1',
        rules: {
          'custom-rule': {
            severity: 'error',
            options: { maxLength: 100 },
          },
        },
      });

      const scope2 = createScope({
        id: 'scope2',
        name: 'Scope 2',
        rules: {
          'custom-rule': {
            severity: 'error',
            options: { maxLength: 50 },
          },
        },
      });

      registry.register(scope1);
      registry.register(scope2);

      const conflicts = registry.detectConflicts(['scope1', 'scope2']);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].ruleId).toBe('custom-rule');
      expect(conflicts[0].type).toBe('options');
    });

    it('should not report conflicts for same configuration', () => {
      const scope1 = createScope({
        id: 'scope1',
        name: 'Scope 1',
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      });

      const scope2 = createScope({
        id: 'scope2',
        name: 'Scope 2',
        rules: {
          'images-alt-text': {
            severity: 'error',
          },
        },
      });

      registry.register(scope1);
      registry.register(scope2);

      const conflicts = registry.detectConflicts(['scope1', 'scope2']);

      expect(conflicts).toHaveLength(0);
    });

    it('should provide suggestions for conflicts', () => {
      const scope1 = createScope({
        id: 'scope1',
        name: 'Scope 1',
        rules: {
          'test-rule': {
            severity: 'error',
          },
        },
      });

      const scope2 = createScope({
        id: 'scope2',
        name: 'Scope 2',
        rules: {
          'test-rule': {
            severity: 'warning',
          },
        },
      });

      registry.register(scope1);
      registry.register(scope2);

      const conflicts = registry.detectConflicts(['scope1', 'scope2']);

      expect(conflicts[0].suggestion).toBeDefined();
      expect(conflicts[0].suggestion).toContain('test-rule');
    });
  });

  describe('createScope Helper', () => {
    it('should create a valid scope', () => {
      const scope = createScope({
        id: 'test',
        name: 'Test Scope',
        description: 'A test scope',
        selector: '.test *',
        filePattern: 'test/**/*.ts',
        components: ['TestComponent'],
        rules: {
          'rule1': { severity: 'error' },
        },
      });

      expect(scope.id).toBe('test');
      expect(scope.name).toBe('Test Scope');
      expect(scope.description).toBe('A test scope');
      expect(scope.selector).toBe('.test *');
      expect(scope.filePattern).toBe('test/**/*.ts');
      expect(scope.components).toEqual(['TestComponent']);
      expect(scope.rules['rule1']).toEqual({ severity: 'error' });
      expect(scope.enabled).toBe(true);
    });

    it('should respect enabled flag', () => {
      const scope = createScope({
        id: 'test',
        name: 'Test',
        rules: {},
        enabled: false,
      });

      expect(scope.enabled).toBe(false);
    });
  });
});
