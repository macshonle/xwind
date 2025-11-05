# XRules Rule Types & Categories

## Overview
Define and implement different categories of rules that can be checked by the xrules engine.

## Rule Categories

### 1. Accessibility Rules
- [ ] Form label associations (explicit `for` attribute)
  - [ ] Research Dragon Naturally Speaking requirements
  - [ ] Research Voice Control requirements
  - [ ] Implement check for `<label for="id">` pattern
  - [ ] Add warnings for nested-only labels
- [ ] ARIA attributes
  - [ ] `aria-label` presence on interactive elements
  - [ ] `aria-describedby` for complex widgets
  - [ ] `role` attribute validation
- [ ] Keyboard navigation
  - [ ] `tabindex` usage validation
  - [ ] Focus management rules
- [ ] Color contrast requirements
- [ ] Alt text for images
- [ ] Heading hierarchy (h1, h2, h3 order)
- [ ] Skip navigation links
- [ ] Screen reader text requirements

### 2. SEO Rules
- [ ] Meta tags
  - [ ] Title tag presence and length
  - [ ] Meta description presence and length
  - [ ] Open Graph tags
  - [ ] Twitter Card tags
- [ ] Heading structure (single h1, proper hierarchy)
- [ ] Image alt attributes for content images
- [ ] Canonical URLs
- [ ] Structured data (JSON-LD)
- [ ] Internal linking patterns
- [ ] Mobile-friendly markup

### 3. Framework-Specific Rules

#### Next.js Rules
- [ ] Next.js Image component usage
  - [ ] Prefer `next/image` over `<img>` tags
  - [ ] Width and height attributes on images
- [ ] Next.js Link component usage
  - [ ] Prefer `next/link` over `<a>` tags for internal links
- [ ] Next.js Head component usage
- [ ] Server/Client component boundaries
- [ ] Metadata API usage

#### React Rules
- [ ] Key prop on list items
- [ ] Uncontrolled vs controlled inputs
- [ ] UseEffect dependencies
- [ ] Event handler naming conventions

### 4. App-Specific Rules
- [ ] Custom image caption requirements
  - [ ] Define contexts where captions are required
  - [ ] Implement caption presence check
  - [ ] Validate caption format/content
- [ ] House style compliance
  - [ ] Typography rules (font families, sizes)
  - [ ] Color palette usage
  - [ ] Spacing conventions
  - [ ] Component usage patterns
- [ ] Brand guidelines
  - [ ] Logo usage rules
  - [ ] Button style requirements
  - [ ] Icon usage patterns

### 5. Performance Rules
- [ ] Lazy loading for images below fold
- [ ] Preload/prefetch directives
- [ ] Resource hints
- [ ] Bundle size constraints
- [ ] Third-party script validation

### 6. Security Rules
- [ ] External links with `rel="noopener noreferrer"`
- [ ] Form action URL validation
- [ ] Input sanitization patterns
- [ ] HTTPS enforcement

## Rule Implementation Checklist

For each rule category:
- [ ] Document rule rationale and benefits
- [ ] Define pattern to match
- [ ] Define constraint to check
- [ ] Create test cases (passing and failing)
- [ ] Write clear error messages
- [ ] Provide fix suggestions
- [ ] Add configuration options (severity, exceptions)
- [ ] Document rule in rule library

## Rule Configuration System
- [ ] Design rule configuration format
- [ ] Support enabling/disabling rules
- [ ] Support rule severity levels (error/warning/info)
- [ ] Support rule-specific options
- [ ] Create preset rule collections (accessibility-strict, seo-basic, etc.)
- [ ] Support rule inheritance and overrides

## Living Documentation
- [ ] Auto-generate documentation from active rules
- [ ] Show which rules are enabled in project
- [ ] Display rule check results in readable format
- [ ] Create compliance dashboard
- [ ] Track rule violations over time
