# XRules Core Engine Development

## Overview
Build the core xrules engine that checks rules by pattern matching HTML (called "forms") and verifying constraints on those matches.

## Core Features Checklist

### Pattern Matching System
- [ ] Design the pattern matching architecture
- [ ] Implement HTML form parser
- [ ] Create pattern matching algorithm
- [ ] Support CSS selector syntax as baseline
- [ ] Extend pattern language beyond CSS selectors
- [ ] Add unit tests for pattern matching

### Constraint Checking System
- [ ] Design constraint definition format
- [ ] Implement constraint evaluation engine
- [ ] Create constraint checker for matched forms
- [ ] Support multiple constraint types (accessibility, SEO, etc.)
- [ ] Add unit tests for constraint checking

### Rule Definition & Management
- [ ] Design rule definition format (e.g., JSON, YAML, or DSL)
- [ ] Create rule parser
- [ ] Implement rule validation
- [ ] Build rule registry/storage system
- [ ] Support rule priority/ordering
- [ ] Add rule conflict detection

### Warning & Reporting System
- [ ] Design warning message format
- [ ] Implement detailed error reporting
- [ ] Include context information (line numbers, element path)
- [ ] Create suggestions for fixing violations
- [ ] Build formatter for different output formats (CLI, JSON, HTML report)
- [ ] Add severity levels (error, warning, info)

### Integration Points
- [ ] CLI interface for running checks
- [ ] API for programmatic usage
- [ ] Watch mode for development
- [ ] Integration with build tools (webpack, vite, etc.)
- [ ] Pre-commit hook support
- [ ] CI/CD integration examples

## Technical Considerations

### Performance
- [ ] Benchmark pattern matching performance
- [ ] Implement caching for parsed forms
- [ ] Optimize for large codebases
- [ ] Add incremental checking support

### Documentation
- [ ] API documentation
- [ ] Usage examples
- [ ] Configuration guide
- [ ] Custom rule writing guide
