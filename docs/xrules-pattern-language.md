# XRules Pattern Language Design

## Overview
Design a pattern language for matching HTML forms that is strictly more expressive than CSS selectors.

## Requirements
The pattern language must be more expressive than CSS selectors while remaining intuitive and maintainable.

## Pattern Language Features Checklist

### CSS Selector Baseline
- [ ] Support all standard CSS selectors
- [ ] Element selectors (`div`, `span`, etc.)
- [ ] Class selectors (`.classname`)
- [ ] ID selectors (`#id`)
- [ ] Attribute selectors (`[attr]`, `[attr=value]`)
- [ ] Pseudo-classes (`:hover`, `:first-child`, etc.)
- [ ] Combinators (`>`, `+`, `~`, ` `)

### Extended Selectors (Beyond CSS)
- [ ] Content matching (select by text content)
- [ ] Regular expression support in attribute values
- [ ] Sibling count constraints (e.g., "has exactly 3 siblings")
- [ ] Parent/ancestor queries with constraints
- [ ] Descendant count constraints
- [ ] Structural pattern matching (e.g., "button followed by form")

### Advanced Features
- [ ] Variables and references (capture matched elements for reuse)
- [ ] Logical operators (AND, OR, NOT) for complex conditions
- [ ] Quantifiers (e.g., "at least 2 matching children")
- [ ] Context-aware matching (consider surrounding elements)
- [ ] Attribute value comparisons (numeric, date ranges, etc.)
- [ ] Custom predicate functions

### Syntax Design
- [ ] Define formal grammar
- [ ] Create syntax documentation
- [ ] Design for readability and maintainability
- [ ] Support comments in patterns
- [ ] Provide syntax highlighting for editors
- [ ] Create pattern validator

### Parser Implementation
- [ ] Implement lexer
- [ ] Implement parser
- [ ] Build abstract syntax tree (AST)
- [ ] Add syntax error reporting with helpful messages
- [ ] Create parser tests
- [ ] Performance optimization

### Pattern Library
- [ ] Common accessibility patterns
- [ ] Common SEO patterns
- [ ] Form validation patterns
- [ ] Navigation patterns
- [ ] Pattern composition examples
- [ ] Anti-patterns documentation

## Examples to Support

### Form Label Pattern (from inspiration)
```
// Match labels without explicit 'for' attribute that contain inputs
label:not([for]) > input
```

### More Complex Patterns
- [ ] Images requiring captions in specific contexts
- [ ] Headings hierarchy validation
- [ ] ARIA attributes requirements
- [ ] Link text validation (no "click here")
- [ ] Button accessibility requirements

## Testing
- [ ] Unit tests for each selector type
- [ ] Integration tests with real HTML
- [ ] Performance benchmarks
- [ ] Edge case handling
