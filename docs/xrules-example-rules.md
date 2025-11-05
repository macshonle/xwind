# XRules Example Rules & Templates

## Overview
Collection of example rules and templates to get started with the xrules engine, based on real-world needs and best practices.

## Foundational Example: Form Label Association

### Rule Background
From [Simon Willison's article](https://simonwillison.net/2025/Oct/17/form-labels/):

**Problem:** Wrapping form inputs in labels without explicit `for` attribute causes accessibility issues with screen readers.

```html
<!-- ❌ BAD: Implicit association fails with voice control -->
<label>Name <input type="text"></label>
```

**Solution:** Use explicit `for` attribute:

```html
<!-- ✅ GOOD: Explicit association works with all assistive tech -->
<label for="idField">Name
  <input id="idField" type="text">
</label>
```

### Implementation Checklist
- [ ] Define pattern to match labels with inputs
- [ ] Check for presence of `for` attribute
- [ ] Verify `for` attribute matches input `id`
- [ ] Verify input has `id` attribute
- [ ] Create error message explaining the issue
- [ ] Link to documentation (Dragon Naturally Speaking, Voice Control)
- [ ] Provide auto-fix suggestion

### Rule Definition Template
```yaml
rule:
  id: form-labels-explicit
  name: "Form Labels Must Use Explicit Association"
  category: accessibility
  severity: error
  pattern: "label:has(input, textarea, select)"
  constraints:
    - label must have 'for' attribute
    - input/textarea/select must have 'id' attribute
    - label 'for' must match input 'id'
  message: |
    Form label must use explicit 'for' attribute to ensure compatibility
    with voice control software (Dragon Naturally Speaking, Voice Control).
  documentation: "https://simonwillison.net/2025/Oct/17/form-labels/"
  autofix: true
```

## More Example Rules

### 1. Image Captions in Article Context
- [ ] Create rule definition
- [ ] Define pattern: `article img` or `.article-content img`
- [ ] Constraint: Must have adjacent `figcaption` or specific caption element
- [ ] Error message with context
- [ ] Documentation for house style guide

```yaml
rule:
  id: article-image-captions
  name: "Article Images Must Have Captions"
  category: app-specific
  severity: warning
  scope: ".article-content"
  pattern: "img"
  constraints:
    - parent must be 'figure' element
    - figure must contain 'figcaption' element
  message: |
    Images in article content must include captions for context and accessibility.
    Wrap image in <figure> and add <figcaption>.
```

### 2. Accessible Button Requirements
- [ ] Define pattern for buttons
- [ ] Check for text content or aria-label
- [ ] Verify not disabled without reason
- [ ] Check focus visibility

```yaml
rule:
  id: accessible-buttons
  name: "Buttons Must Be Accessible"
  category: accessibility
  severity: error
  pattern: "button, input[type='button'], input[type='submit']"
  constraints:
    - must have text content OR aria-label
    - text content must not be empty/whitespace only
    - if icon-only, must have aria-label
    - must be keyboard accessible
  message: "Buttons must have accessible text for screen readers"
```

### 3. Heading Hierarchy
- [ ] Check heading order (h1 → h2 → h3, no skipping)
- [ ] Ensure single h1 per page
- [ ] Validate semantic structure

```yaml
rule:
  id: heading-hierarchy
  name: "Maintain Proper Heading Hierarchy"
  category: accessibility
  severity: warning
  pattern: "h1, h2, h3, h4, h5, h6"
  constraints:
    - only one h1 per page
    - headings must not skip levels
    - h2 must follow h1, h3 must follow h2, etc.
  message: "Heading hierarchy must be sequential for screen readers"
```

### 4. Next.js Image Component Usage
- [ ] Detect native `<img>` tags
- [ ] Suggest using `next/image` component
- [ ] Check for width/height attributes

```yaml
rule:
  id: nextjs-prefer-image-component
  name: "Use Next.js Image Component"
  category: framework-specific
  severity: warning
  pattern: "img"
  constraints:
    - should use next/image component instead
    - exceptions: svg images, external URLs (configurable)
  message: |
    Use next/image component for automatic image optimization.
    Native <img> tags should only be used for special cases.
  autofix: true
```

### 5. External Link Security
- [ ] Find external links
- [ ] Check for `rel="noopener noreferrer"`
- [ ] Validate `target="_blank"` safety

```yaml
rule:
  id: external-link-security
  name: "External Links Must Be Secure"
  category: security
  severity: error
  pattern: "a[href^='http']:not([href^='http://localhost']):not([href^='https://yourdomain.com'])"
  constraints:
    - if target="_blank", must have rel="noopener noreferrer"
    - external links should open in new tab (configurable)
  message: "External links must include rel='noopener noreferrer' for security"
  autofix: true
```

### 6. Alt Text Requirements
- [ ] Check all `<img>` elements have alt attributes
- [ ] Validate alt text is not empty (unless decorative)
- [ ] Check alt text quality (not just filename)

```yaml
rule:
  id: image-alt-text
  name: "Images Must Have Meaningful Alt Text"
  category: accessibility
  severity: error
  pattern: "img"
  constraints:
    - must have 'alt' attribute
    - alt text must not be empty (unless decorative with alt="")
    - alt text should not be image filename
    - alt text should describe image content
  message: "Images must have descriptive alt text for screen readers"
```

### 7. Form Input Labels
- [ ] Every input must have associated label
- [ ] Check for label visibility
- [ ] Validate label text is meaningful

```yaml
rule:
  id: form-input-labels
  name: "Form Inputs Must Have Labels"
  category: accessibility
  severity: error
  pattern: "input:not([type='hidden']), textarea, select"
  constraints:
    - must have associated label element (via 'for' or wrapping)
    - label must have visible text content
    - label text must not be placeholder only
  message: "All form inputs must have associated labels for accessibility"
```

## Rule Template Checklist

For creating new rules:
- [ ] Assign unique rule ID
- [ ] Give descriptive name
- [ ] Choose category (accessibility, seo, security, etc.)
- [ ] Set appropriate severity level
- [ ] Define clear pattern to match
- [ ] List all constraints to check
- [ ] Write helpful error message
- [ ] Link to documentation/rationale
- [ ] Consider auto-fix possibility
- [ ] Add configuration options if needed
- [ ] Create test cases (passing and failing)
- [ ] Document exceptions/edge cases

## Testing Examples
- [ ] Create test HTML fixtures for each rule
- [ ] Both passing and failing examples
- [ ] Edge cases and complex scenarios
- [ ] Performance testing with large HTML documents
- [ ] Integration tests with real projects
