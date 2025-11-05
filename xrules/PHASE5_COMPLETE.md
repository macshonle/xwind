# XRules Phase 5: Scopes & Traceability - COMPLETE ✅

**Status**: Implementation Complete
**Date**: 2025-11-05
**Tests**: 163/163 Passing ✅ (31 new Phase 5 tests)
**Build**: Success ✅

## Overview

Phase 5 adds scope management and enhanced traceability to XRules, enabling:
- **Scoped rule configuration** - Different rules for different parts of your codebase
- **Hierarchical scopes** - Parent-child scope relationships with inheritance
- **Enhanced traceability** - Track exactly where violations come from
- **Conflict detection** - Find conflicting rule configurations across scopes
- **File/component/selector-based scopes** - Flexible scope definition

## Key Features

### 1. Scope System
Define scopes for different parts of your application:

```typescript
import { createScope, ScopeRegistry } from '@xwind/xrules';

const registry = new ScopeRegistry();

// Admin panel scope - stricter rules
const adminScope = createScope({
  id: 'admin',
  name: 'Admin Panel',
  filePattern: 'src/admin/**/*.tsx',
  selector: '.admin-panel *',
  rules: {
    'images-alt-text': { severity: 'error' },
    'form-labels-explicit': { severity: 'error' },
  },
});

// Public site scope - relaxed rules
const publicScope = createScope({
  id: 'public',
  name: 'Public Site',
  filePattern: 'src/public/**/*.tsx',
  rules: {
    'images-alt-text': { severity: 'warning' },
  },
});

registry.register(adminScope);
registry.register(publicScope);
```

### 2. Hierarchical Scopes
Create parent-child relationships:

```typescript
const appWideScope = createScope({
  id: 'app',
  name: 'Application Wide',
  filePattern: 'src/**/*.tsx',
  rules: {
    'meta-charset': { severity: 'error' },
  },
});

const adminScope = createScope({
  id: 'admin',
  name: 'Admin',
  parent: 'app',  // Inherits from app scope
  filePattern: 'src/admin/**/*.tsx',
  rules: {
    'form-labels-explicit': { severity: 'error' },
  },
});
```

### 3. Enhanced Traceability
Violations now include detailed source information:

```typescript
const result = engine.checkHTMLWithScopes(html, 'src/admin/Dashboard.tsx');

for (const violation of result.violations) {
  console.log({
    rule: violation.ruleId,
    location: violation.location,      // File, line, column
    scope: violation.scope,             // Which scope triggered this
    component: violation.component,     // Component name (JSX)
    elementPath: violation.elementPath, // Path from root to element
  });
}
```

### 4. Scope Matching

**By File Pattern** (glob):
```typescript
const scope = createScope({
  id: 'checkout',
  name: 'Checkout Flow',
  filePattern: 'src/**/checkout/**/*.tsx',
  rules: { /* ... */ },
});
```

**By Component Name**:
```typescript
const scope = createScope({
  id: 'modals',
  name: 'Modal Dialogs',
  components: ['Modal', 'Dialog', 'Popup'],
  rules: { /* ... */ },
});
```

**By CSS Selector**:
```typescript
const scope = createScope({
  id: 'forms',
  name: 'All Forms',
  selector: 'form *',  // All elements inside forms
  rules: { /* ... */ },
});
```

### 5. Conflict Detection
Automatically detect conflicting rule configurations:

```typescript
const result = engine.checkHTMLWithScopes(html, filePath, {
  detectConflicts: true,
});

if (result.conflicts && result.conflicts.length > 0) {
  for (const conflict of result.conflicts) {
    console.log(`Conflict in rule "${conflict.ruleId}":`);
    console.log(`Type: ${conflict.type}`);  // 'severity' | 'options' | 'both'
    console.log(`Suggestion: ${conflict.suggestion}`);
  }
}
```

## Usage Examples

### Basic Usage
```typescript
import {
  createScopeAwareEngine,
  ScopeRegistry,
  createScope
} from '@xwind/xrules';

// Create registry and define scopes
const registry = new ScopeRegistry();

registry.register(createScope({
  id: 'admin',
  name: 'Admin Panel',
  filePattern: 'src/admin/**',
  rules: {
    'images-alt-text': { severity: 'error' },
  },
}));

// Create engine
const engine = createScopeAwareEngine(registry);

// Check with scope awareness
const result = engine.checkHTMLWithScopes(html, 'src/admin/Dashboard.tsx');
```

### With Component Scopes
```typescript
const result = engine.checkHTMLWithScopes(html, filePath, {
  componentName: 'CheckoutForm',
  includeParents: true,  // Include parent scopes
  detectConflicts: true,
});
```

### Explicit Scope Selection
```typescript
const result = engine.checkHTMLWithScopes(html, filePath, {
  scopes: ['admin', 'forms'],  // Only check these scopes
});
```

### Grouped Results
```typescript
const result = engine.checkHTMLWithScopes(html, filePath);

// Violations grouped by scope
for (const [scopeId, violations] of Object.entries(result.byScope)) {
  console.log(`Scope: ${scopeId}`);
  console.log(`Violations: ${violations.length}`);
}
```

## API Reference

### Scope Interface
```typescript
interface Scope {
  id: string;              // Unique identifier
  name: string;            // Human-readable name
  description?: string;    // Optional description
  selector?: string;       // CSS selector pattern
  filePattern?: string;    // Glob pattern for files
  components?: string[];   // Component names
  parent?: string;         // Parent scope ID
  rules: Record<string, ScopeRuleConfig>;
  enabled?: boolean;       // Default: true
}
```

### ScopeRuleConfig
```typescript
interface ScopeRuleConfig {
  severity?: 'error' | 'warning' | 'info' | 'off';
  options?: Record<string, unknown>;
  message?: string;  // Custom message for this scope
}
```

### TraceableViolation
```typescript
interface TraceableViolation {
  ruleId: string;
  ruleName: string;
  message: string;
  severity: 'error' | 'warning' | 'info';

  location: {
    filePath: string;
    line?: number;
    column?: number;
    startOffset?: number;
    endOffset?: number;
  };

  scope?: {
    id: string;
    name: string;
    selector?: string;
  };

  component?: {
    name: string;
    branch?: number;
    totalBranches?: number;
  };

  elementPath: string[];  // ['html', 'body', 'div.container']
  element?: string;
  context?: string;
  suggestion?: string;
  documentation?: string;
}
```

### ScopeCheckOptions
```typescript
interface ScopeCheckOptions {
  scopes?: string[];           // Explicit scope IDs
  includeParents?: boolean;    // Include parent scopes
  detectConflicts?: boolean;   // Detect conflicts
  filePath?: string;           // For scope matching
  componentName?: string;      // For component scopes
}
```

## Real-World Examples

### Example 1: E-commerce Site
```typescript
const registry = new ScopeRegistry();

// Global rules
registry.register(createScope({
  id: 'global',
  name: 'Site-wide',
  filePattern: 'src/**/*.tsx',
  rules: {
    'meta-viewport': { severity: 'error' },
    'html-lang': { severity: 'error' },
  },
}));

// Checkout flow - critical accessibility
registry.register(createScope({
  id: 'checkout',
  name: 'Checkout Flow',
  parent: 'global',
  filePattern: 'src/checkout/**/*.tsx',
  rules: {
    'form-labels-explicit': { severity: 'error' },
    'images-alt-text': { severity: 'error' },
    'form-input-autocomplete': { severity: 'error' },
  },
}));

// Product pages - SEO focused
registry.register(createScope({
  id: 'products',
  name: 'Product Pages',
  parent: 'global',
  filePattern: 'src/products/**/*.tsx',
  rules: {
    'meta-title': { severity: 'error' },
    'meta-description': { severity: 'error' },
    'images-seo-alt': { severity: 'warning' },
  },
}));
```

### Example 2: Admin Dashboard
```typescript
const registry = new ScopeRegistry();

// Admin-specific strict rules
registry.register(createScope({
  id: 'admin',
  name: 'Admin Dashboard',
  filePattern: 'src/admin/**/*.tsx',
  components: ['AdminPanel', 'AdminSettings'],
  rules: {
    'form-labels-explicit': { severity: 'error' },
    'aria-valid-attributes': { severity: 'error' },
    'table-headers': { severity: 'error' },
  },
}));

// Admin forms sub-scope
registry.register(createScope({
  id: 'admin-forms',
  name: 'Admin Forms',
  parent: 'admin',
  selector: '.admin-panel form',
  rules: {
    'form-fieldset-legend': { severity: 'error' },
    'form-required-indicators': { severity: 'error' },
  },
}));
```

### Example 3: Component Library
```typescript
const registry = new ScopeRegistry();

// Button components
registry.register(createScope({
  id: 'buttons',
  name: 'Button Components',
  components: ['Button', 'IconButton', 'LinkButton'],
  rules: {
    'buttons-descriptive-text': { severity: 'error' },
    'interactive-controls-size': { severity: 'warning' },
  },
}));

// Form components
registry.register(createScope({
  id: 'form-components',
  name: 'Form Components',
  components: ['Input', 'Select', 'Checkbox', 'Radio'],
  rules: {
    'form-labels-explicit': { severity: 'error' },
    'form-input-autocomplete': { severity: 'warning' },
  },
}));
```

## Test Results

```
Test Suites: 9 passed, 9 total
Tests:       163 passed, 163 total

Phase 1-2:   56 tests (Parser, Engine, Basic Rules, Extended Matcher)
Phase 3:     36 tests (Accessibility, SEO, Security Rules)
Phase 4:     40 tests (JSX Parser, JSX Engine)
Phase 5:     31 tests (Scope Registry, Scope Engine)
```

### Test Coverage
- **Scope Registry**: 23 tests
- **Scope Engine**: 8 tests
- Full coverage of:
  - Scope registration and validation
  - Hierarchy management
  - File/component/selector matching
  - Conflict detection
  - Traceability enhancement

## Files Created

- ✅ `src/scope-types.ts` (280 lines) - Type definitions
- ✅ `src/scope-registry.ts` (280 lines) - Scope management
- ✅ `src/scope-engine.ts` (265 lines) - Scope-aware engine
- ✅ `src/__tests__/scope-registry.test.ts` (445 lines) - Registry tests
- ✅ `src/__tests__/scope-engine.test.ts` (295 lines) - Engine tests
- ✅ Updated `src/index.ts` - Phase 5 exports
- ✅ `PHASE5_COMPLETE.md` - Documentation

## Key Accomplishments

1. **Flexible Scope Definition** - File patterns, components, selectors
2. **Hierarchical Organization** - Parent-child scope relationships
3. **Enhanced Traceability** - Detailed violation source information
4. **Conflict Detection** - Automatic detection of rule conflicts
5. **Backward Compatible** - Existing code continues to work
6. **Well Tested** - 31 new tests, 100% passing

## Dependencies Added

```json
{
  "minimatch": "^10.1.1",        // Glob pattern matching
  "@types/minimatch": "^5.1.2"   // TypeScript types
}
```

## Performance

- **Scope Matching**: O(n) where n = number of scopes
- **Hierarchy Resolution**: O(d) where d = depth of hierarchy
- **Conflict Detection**: O(s × r) where s = scopes, r = rules
- **Memory**: Minimal overhead, scopes cached in registry

## Migration from Phase 4

Phase 5 is fully backward compatible:

```typescript
// Phase 4 (still works)
const engine = createDefaultEngine();
engine.checkHTML(html);

// Phase 5 (new capabilities)
const registry = new ScopeRegistry();
const scopeEngine = createScopeAwareEngine(registry);
scopeEngine.checkHTMLWithScopes(html, filePath);
```

## Use Cases

### 1. Monorepo with Multiple Apps
Different rules for each app:
- Admin dashboard: Strict accessibility
- Marketing site: SEO-focused
- Documentation: Content-focused

### 2. Feature-Based Scopes
Different rules for features:
- Checkout: Critical accessibility/security
- Blog: SEO optimization
- User profiles: Privacy/security

### 3. Component Libraries
Different rules by component type:
- Forms: Accessibility focus
- Navigation: Semantic HTML
- Modals: Focus management

## Next Steps (Phase 6-8)

Ready for follow-up phases:
- **Phase 6**: Integration & Tooling (CLI, VS Code)
- **Phase 7**: Performance & Scale (parallel, caching)
- **Phase 8**: Polish & Documentation (guides, examples)

---

**Phase 5 Status**: ✅ COMPLETE
**Ready for**: Production use, Phase 6 planning
**Tests**: 163/163 passing
**Commit**: Ready for PR
