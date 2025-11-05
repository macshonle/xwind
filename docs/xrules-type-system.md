# XRules Type System Integration

## Overview
Implement a type system for checking dynamically generated HTML (e.g., from Next.js components), where components returning multiple possible forms are typed as returning a union of those forms.

## Goals
Enable static analysis of dynamic HTML generation to ensure rules are checked even when HTML is not directly written.

## Type System Features Checklist

### Form Type System
- [ ] Define "form" type representation
  - [ ] Design AST structure for HTML forms
  - [ ] Support union types for multiple possible forms
  - [ ] Support intersection types for composed forms
  - [ ] Support generic/parameterized forms
- [ ] Create TypeScript type definitions for forms
- [ ] Generate form types from components
- [ ] Support form type inference

### Static Analysis
- [ ] Analyze React/Next.js components
  - [ ] Parse JSX/TSX syntax
  - [ ] Extract possible return values
  - [ ] Handle conditional rendering
  - [ ] Handle dynamic props
  - [ ] Handle component composition
- [ ] Build control flow graph
- [ ] Identify all possible HTML outputs
- [ ] Generate union types for dynamic outputs

### Type Checking Integration
- [ ] Check if component's form type satisfies rules
- [ ] Report violations with component location
- [ ] Support TypeScript integration
- [ ] Add type guards for form types
- [ ] Create type narrowing helpers

### Relevance Optimization
- [ ] Only check forms referenced by active rules
  - [ ] Build rule dependency graph
  - [ ] Identify relevant element types per rule
  - [ ] Skip type checking for irrelevant components
- [ ] Performance optimization for large codebases
- [ ] Incremental checking support

### Component Analysis Examples

#### Simple Component
```typescript
// Returns single form type
function Button() {
  return <button>Click</button>
}
// Form type: <button>Click</button>
```

#### Union Type Component
```typescript
// Returns union of forms
function ImageOrParagraph({ showImage }: { showImage: boolean }) {
  return showImage ? <img src="..." /> : <p>Text</p>
}
// Form type: <img> | <p>
```

#### Complex Component
```typescript
// Returns composed form
function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>
}
// Form type: <div className="card">{FormType}</div>
```

## Implementation Tasks

### Phase 1: Form Type Representation
- [ ] Design form type schema
- [ ] Implement form type builder
- [ ] Create serialization/deserialization
- [ ] Add form type equality checking
- [ ] Build form type normalization

### Phase 2: Component Analysis
- [ ] Create JSX/TSX parser
- [ ] Implement component traversal
- [ ] Extract return statements
- [ ] Analyze conditional logic
- [ ] Handle component composition
- [ ] Support HOCs and hooks

### Phase 3: Type Inference
- [ ] Implement type inference algorithm
- [ ] Handle props and state
- [ ] Support TypeScript types
- [ ] Handle dynamic values
- [ ] Generate union types for branches
- [ ] Create type witnesses (examples)

### Phase 4: Rule Checking
- [ ] Check form types against rules
- [ ] Report type-level violations
- [ ] Suggest type fixes
- [ ] Support type refinement
- [ ] Add quick fixes for violations

### Phase 5: Integration
- [ ] TypeScript plugin/transformer
- [ ] ESLint plugin
- [ ] Build tool integration (webpack, vite)
- [ ] Editor integration (VSCode, etc.)
- [ ] Pre-commit hook

## Advanced Features
- [ ] Support for server components (RSC)
- [ ] Handle async components
- [ ] Support for streaming/suspense
- [ ] Dynamic import analysis
- [ ] Third-party component analysis

## Testing
- [ ] Unit tests for type system
- [ ] Integration tests with real components
- [ ] Performance benchmarks
- [ ] False positive/negative analysis
- [ ] Real-world project testing
