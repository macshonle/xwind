# XRules Engine: Complete Implementation (Phases 1-4)

This PR introduces **XRules**, a powerful static analysis engine for checking HTML and React/JSX components against accessibility, SEO, and security rules.

## 🎯 What This PR Does

Implements a complete rule-checking engine that can:
- ✅ Parse and analyze HTML documents
- ✅ Parse and analyze React/TSX components
- ✅ Check against 30+ production-ready rules
- ✅ Provide actionable suggestions for fixes
- ✅ Support custom rule creation
- ✅ Integrate with TypeScript compiler

## 📊 Stats

- **Lines of Code**: ~3,500+ new lines
- **Tests**: 132/132 passing ✅
- **Rules**: 30+ accessibility, SEO, and security rules
- **Phases**: 4 complete phases
- **Files**: 20+ new files
- **Documentation**: Complete with examples

## 🚀 Phase Breakdown

### Phase 1: MVP - Pattern Matching Engine
**Goal**: Build the core engine with basic rule checking

**Implemented**:
- HTML parser using parse5
- CSS selector-based pattern matching
- Rule checking system with violations
- 6 initial rules (form labels, alt text, buttons, links, headings)
- Configurable severity levels (error, warning, info)
- 38 passing tests

**Key Files**:
- `src/parser.ts` - HTML parsing
- `src/engine.ts` - Rule execution engine
- `src/types.ts` - Core type definitions
- `src/rules/*.ts` - Initial rule set

### Phase 2: Extended Pattern Language
**Goal**: Go beyond CSS selectors with advanced patterns

**Implemented**:
- Extended pattern syntax: `:contains()`, `:has()`, `:not()`, etc.
- Text content matching with case sensitivity options
- Parent/ancestor/sibling relationship queries
- Element counting patterns
- 18 new tests for extended patterns

**Examples**:
```typescript
'a:contains("click here")'           // Links with specific text
'table:has(td):not(:has(th))'       // Tables missing headers
'input[type="password"]:has-parent(form)' // Password fields in forms
```

**Key Files**:
- `src/extended-matcher.ts` - Advanced pattern matching

### Phase 3: Rule Library Expansion
**Goal**: Production-ready rules for real-world use

**Implemented**:

**Accessibility Rules (15+)** - Based on WCAG 2.1:
- Link descriptive text
- Form input autocomplete
- Fieldset legends
- ARIA attributes validation
- Table headers and captions
- SVG accessibility
- Focus visibility
- Landmark regions
- And more...

**SEO Rules (11+)**:
- Meta title (50-60 chars recommended)
- Meta description (150-160 chars)
- Viewport and charset tags
- HTML lang attribute
- Canonical URLs
- Open Graph tags
- Structured data (Schema.org)
- SEO-friendly images

**Security Rules (7+)**:
- Inline event handler detection (CSP violations)
- Dangerous link protocols (javascript:, data:)
- Iframe sandbox requirements
- HTTPS form submissions
- Subresource Integrity (SRI)
- Password autocomplete best practices

**Rule Presets (6 configurations)**:
- `accessibility-strict` - Full WCAG compliance
- `seo-recommended` - Essential SEO checks
- `security-strict` - Paranoid security
- `recommended` - Balanced default
- `all` - Everything enabled
- `minimal` - Critical errors only

**Tests**: 36 new tests (92 total)

**Key Files**:
- `src/rules/accessibility.ts` (553 lines)
- `src/rules/seo.ts` (381 lines)
- `src/rules/security.ts` (214 lines)
- `src/presets.ts` (179 lines)

### Phase 4: Type System Integration
**Goal**: Analyze React/TSX components statically

**Implemented**:

**JSX Parser**:
- TypeScript-aware parsing using ts-morph
- Extracts JSX elements, attributes, and structure
- Converts React props → HTML attributes (className → class)
- Detects conditional rendering
- Tracks component dependencies
- Supports fragments and nested components

**JSX Rules Engine**:
- Extends XRulesEngine for TSX support
- Checks all conditional rendering branches
- Component-level violation reports
- Works with all Phase 1-3 rules (no modifications needed!)

**Features**:
- Parse functional and arrow components ✅
- Handle if/else, ternary operators ✅
- Convert JSX AST to HTML ✅
- Track component dependencies ✅
- Support dynamic expressions ✅

**Tests**: 40 new tests (132 total)

**Key Files**:
- `src/jsx-parser.ts` (560 lines)
- `src/jsx-engine.ts` (140 lines)
- Tests with comprehensive coverage

## 💡 Usage Examples

### HTML Checking
```typescript
import { createDefaultEngine } from '@xwind/xrules';

const engine = createDefaultEngine();
const result = engine.checkHTML(htmlString);

console.log(`Errors: ${result.errorCount}`);
console.log(`Warnings: ${result.warningCount}`);
```

### React Component Checking
```typescript
import { JsxRulesEngine } from '@xwind/xrules';

const engine = new JsxRulesEngine();
const results = engine.checkFile('src/App.tsx');

for (const result of results) {
  console.log(`Component: ${result.componentName}`);
  console.log(`Issues: ${result.violations.length}`);
}
```

### Custom Rules
```typescript
import { XRulesEngine } from '@xwind/xrules';

const customRule: Rule = {
  id: 'my-rule',
  name: 'My Custom Rule',
  pattern: 'div.special',
  severity: 'warning',
  check: (element) => {
    if (!element.hasAttribute('data-id')) {
      return 'Special divs must have data-id';
    }
    return null;
  },
  suggest: () => 'Add data-id attribute'
};

const engine = new XRulesEngine([customRule]);
```

### Using Presets
```typescript
import { getPreset } from '@xwind/xrules';

const config = getPreset('accessibility-strict');
// All accessibility rules as errors
```

## 🧪 Testing

All 132 tests passing:
```
Test Suites: 7 passed, 7 total
Tests:       132 passed, 132 total

Phase 1-2:   56 tests (Parser, Engine, Basic Rules, Extended Matcher)
Phase 3:     36 tests (Accessibility, SEO, Security Rules)
Phase 4:     40 tests (JSX Parser, JSX Engine)
```

## 📦 Dependencies Added

```json
{
  "parse5": "^7.1.2",           // HTML parsing
  "css-select": "^5.1.0",       // CSS selectors
  "domhandler": "^5.0.3",       // DOM utilities
  "ts-morph": "^21.0.1",        // TypeScript/JSX parsing
  "@types/react": "^18.2.45"    // React types
}
```

## 🎨 Example Output

```
🚫 Images Must Have Alt Text
   Image element is missing alt attribute
   💡 Add an alt attribute describing the image content

⚠️ Links Should Have Descriptive Text
   Link text "click here" is not descriptive
   💡 Use descriptive text like "Download Product Catalog"

ℹ️ Page Should Have Canonical URL
   Page should have a canonical URL
   💡 Add <link rel="canonical" href="..."> in <head>
```

## 🔍 Real-World Value

This engine can:
- **Catch accessibility issues** before they reach production
- **Improve SEO** with automated meta tag validation
- **Enhance security** by detecting CSP violations and dangerous patterns
- **Enforce best practices** across your codebase
- **Provide learning opportunities** with suggestions for every violation

## 🚧 Future Work (Phases 5-8)

Ready for follow-up PRs:
- **Phase 5**: Scopes & Traceability (source maps, file scopes)
- **Phase 6**: Integration & Tooling (CLI, VS Code extension)
- **Phase 7**: Performance & Scale (parallel execution, caching)
- **Phase 8**: Polish & Documentation (comprehensive guides)

## 📚 Documentation

Each phase includes complete documentation:
- `PHASE3_COMPLETE.md` - Complete feature documentation
- `PHASE4_COMPLETE.md` - Complete feature documentation

## ✅ Checklist

- [x] All tests passing (132/132)
- [x] Build succeeds
- [x] No linting errors
- [x] Documentation complete
- [x] Examples working
- [x] Demo applications tested

## 🎯 Ready to Merge

This PR is complete, tested, and ready for production use. The XRules engine is fully functional and can be integrated into projects immediately.

**Branch**: `claude/fix-linting-errors-011CUq5XyjZKD7DGru9eUhUo`
**Commits**: 6 commits (Phases 1-4)
**Base**: `main` (or your default branch)
