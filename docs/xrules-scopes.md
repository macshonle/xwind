# XRules Scopes & Traceability

## Overview
Implement scopes for managing rules across large projects, ensuring traceability, and handling potentially conflicting rules.

## Scope System Goals
- Organize rules by context (page, component, section)
- Manage rule conflicts and priorities
- Enable rule inheritance and overrides
- Provide traceability for compliance
- Support both static and structured scoping

## Scope System Checklist

### Scope Definition
- [ ] Design scope definition format
- [ ] Support CSS class-based scopes
  - [ ] Define scope by parent class (e.g., `.checkout-flow`)
  - [ ] Support multiple scope selectors
  - [ ] Nested scope support
- [ ] Support file/directory-based scopes
  - [ ] Glob patterns for file matching
  - [ ] Directory hierarchy scopes
- [ ] Support component-based scopes
  - [ ] Scope by component name
  - [ ] Scope by component type
- [ ] Support route-based scopes (for Next.js)
  - [ ] Page-level scopes
  - [ ] Layout-level scopes

### Scope Application
- [ ] Implement scope matching algorithm
- [ ] Support scope inheritance (child inherits parent rules)
- [ ] Allow scope override (child can disable parent rules)
- [ ] Handle multiple overlapping scopes
- [ ] Determine effective rules for each element

### Static Scope Constraint (Metarule)
- [ ] Enforce scopes are statically checkable
- [ ] Detect conditional scope CSS classes
- [ ] Warn on dynamic scope modifications
- [ ] Validate scope CSS classes cannot change at runtime
- [ ] Create linter for scope metarule violations

### Scope Configuration
- [ ] Create scope configuration file format
- [ ] Support YAML/JSON configuration
- [ ] Scope-specific rule sets
- [ ] Scope inheritance chains
- [ ] Scope priority levels

### Rule Conflict Management
- [ ] Detect conflicting rules within scopes
- [ ] Define conflict resolution strategies
  - [ ] Priority-based resolution
  - [ ] Most specific scope wins
  - [ ] Explicit override declarations
- [ ] Report unresolved conflicts
- [ ] Suggest conflict resolutions

### Traceability System
- [ ] Track which rules apply to each element
- [ ] Record scope hierarchy for each check
- [ ] Generate traceability matrix
  - [ ] Rule → Elements mapping
  - [ ] Element → Rules mapping
  - [ ] Scope → Rules mapping
- [ ] Create audit trail for compliance
- [ ] Export traceability reports

### Scope Examples

#### Example 1: E-commerce Site
```yaml
scopes:
  - name: checkout
    selector: ".checkout-flow"
    rules:
      - form-labels-explicit
      - payment-form-security
      - required-field-indicators

  - name: product-pages
    selector: ".product-detail"
    rules:
      - product-image-alt-text
      - price-accessibility
      - add-to-cart-button
```

#### Example 2: Documentation Site
```yaml
scopes:
  - name: docs-content
    path: "app/docs/**/*.tsx"
    rules:
      - heading-hierarchy
      - code-block-language
      - internal-links-only
```

## Implementation Tasks

### Phase 1: Core Scope System
- [ ] Design scope data structure
- [ ] Implement scope parser
- [ ] Create scope matcher
- [ ] Build scope registry
- [ ] Test basic scope application

### Phase 2: Scope Inheritance
- [ ] Implement inheritance algorithm
- [ ] Support override mechanisms
- [ ] Handle nested scopes
- [ ] Test inheritance scenarios
- [ ] Document inheritance behavior

### Phase 3: Conflict Resolution
- [ ] Detect rule conflicts
- [ ] Implement resolution strategies
- [ ] Add conflict configuration options
- [ ] Create conflict reporting
- [ ] Test conflict scenarios

### Phase 4: Traceability
- [ ] Build traceability tracking
- [ ] Generate reports
- [ ] Create visualization tools
- [ ] Export to standard formats
- [ ] Integrate with compliance tools

### Phase 5: Metarule Enforcement
- [ ] Implement static scope checker
- [ ] Detect dynamic scope violations
- [ ] Add warnings for runtime changes
- [ ] Create documentation for metarule
- [ ] Test metarule enforcement

## Advanced Features
- [ ] Scope templates/presets
- [ ] Scope composition (combine multiple scopes)
- [ ] Conditional scopes (environment-based)
- [ ] Scope versioning
- [ ] Scope migration tools

## Documentation
- [ ] Scope system user guide
- [ ] Scope configuration reference
- [ ] Conflict resolution guide
- [ ] Traceability report interpretation
- [ ] Best practices for organizing scopes

## Testing
- [ ] Unit tests for scope matching
- [ ] Integration tests for inheritance
- [ ] Conflict resolution tests
- [ ] Performance tests with many scopes
- [ ] Real-world project validation
