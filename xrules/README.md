# XRules Engine - Phase 1 MVP

An HTML rule checking engine with pattern matching and constraint validation. This MVP implements the foundational architecture described in the xrules project documentation.

## Features

### ✅ Core Engine (Phase 1 Complete)
- HTML parsing with source location tracking
- CSS selector-based pattern matching
- Rule definition system
- Constraint checking
- Violation reporting with suggestions
- CLI tool for checking files

### ✅ Implemented Rules
- **form-labels-explicit**: Ensures form labels use explicit `for` attribute for voice control compatibility

## Installation

```bash
cd xrules
npm install
npm run build
```

## Usage

### CLI

Check HTML files:
```bash
node dist/cli.js path/to/file.html
node dist/cli.js "**/*.html"  # glob pattern
```

Check Next.js build output:
```bash
node dist/cli.js check-build ../.next
```

List available rules:
```bash
node dist/cli.js list-rules
```

Check an HTML string:
```bash
node dist/cli.js check-string '<label>Name <input type="text" /></label>'
```

### Programmatic API

```typescript
import { createDefaultEngine } from '@xwind/xrules';

const engine = createDefaultEngine();
const result = engine.checkHTML(html, 'myfile.html');

console.log(`Found ${result.errorCount} errors`);
console.log(`Found ${result.warningCount} warnings`);
```

## Test Results

### Unit Tests
```
✓ Parser tests (15 passed)
✓ Engine tests (12 passed)
✓ Form labels rule tests (11 passed)

Total: 38 tests passed
```

### Real-World Testing

Ran xrules against the demo applications in this project:

```bash
$ node dist/cli.js check-build ../.next

Checking 9 files from build output...

Found 6 accessibility violations:
- 3 in main demo page (category filter radio buttons)
- 3 in ecommerce demo (category filter radio buttons)

All violations: Labels wrapping form controls without explicit 'for' attribute
```

#### Example Violation

```html
<!-- ❌ Violation: Implicit association -->
<label>
  <input type="radio" name="category" value="Electronics" />
  <span>Electronics</span>
</label>

<!-- ✅ Correct: Explicit association -->
<label for="electronics">Electronics</label>
<input type="radio" id="electronics" name="category" value="Electronics" />
```

## Example: Test Files

### Good Example (0 violations)
```html
<form>
  <label for="username">Username</label>
  <input id="username" type="text" />

  <label for="email">
    Email Address
    <input id="email" type="email" />
  </label>
</form>
```

### Bad Example (2 violations)
```html
<form>
  <!-- Implicit label without 'for' attribute -->
  <label>Username <input type="text" /></label>

  <!-- Nested input without explicit for/id -->
  <label>
    Email Address
    <input type="email" />
  </label>
</form>
```

## Architecture

### Components

1. **Parser** (`src/parser.ts`)
   - Parses HTML using parse5
   - Converts to simplified DOM representation
   - Tracks source locations for error reporting

2. **Engine** (`src/engine.ts`)
   - Main orchestration layer
   - Runs rules against parsed documents
   - Manages configuration and severity levels

3. **Rules** (`src/rules/`)
   - Individual rule implementations
   - Pattern matching + constraint checking
   - Provides suggestions for fixes

4. **Reporter** (`src/reporter.ts`)
   - Formats violations for display
   - Colored terminal output
   - JSON export option

5. **CLI** (`src/cli.ts`)
   - Command-line interface
   - File globbing
   - Multiple output formats

### Rule Structure

Each rule implements this interface:

```typescript
interface Rule {
  id: string;
  name: string;
  description: string;
  category: 'accessibility' | 'seo' | 'security' | 'performance' | 'best-practice';
  severity: 'error' | 'warning' | 'info' | 'off';
  pattern: string;  // CSS selector
  check: (element: Element, context: CheckContext) => string | null;
  suggest?: (element: Element) => string;
  documentation?: string;
}
```

## Foundational Rule: Form Labels

Based on [Simon Willison's article on form labels](https://simonwillison.net/2025/Oct/17/form-labels/), this rule ensures that form labels use explicit `for` attributes to ensure compatibility with voice control software (Dragon Naturally Speaking, Voice Control for macOS/iOS).

### Why This Matters

Implicit label association (wrapping inputs) fails with voice control software:

```html
<!-- ❌ Fails with voice control -->
<label>Name <input type="text"></label>
```

Explicit association works universally:

```html
<!-- ✅ Works with all assistive technology -->
<label for="name">Name</label>
<input id="name" type="text">
```

## Performance

- Parser: ~5ms per typical HTML file
- Rule checking: ~1ms per rule per document
- Full check: ~10-20ms per file on average

Tested on:
- 9 Next.js build output files
- Total time: <1 second

## Future Enhancements

See the xrules roadmap documents in `/docs`:

- **Phase 2**: Extended pattern language (beyond CSS selectors)
- **Phase 3**: Rule library expansion (20+ rules)
- **Phase 4**: Type system integration for React components
- **Phase 5**: Scopes and traceability
- **Phase 6**: Editor integrations, CI/CD
- **Phase 7**: Performance optimization
- **Phase 8**: Documentation and polish

## Contributing

This is a proof-of-concept implementation. The architecture supports:
- Adding new rules (see `src/rules/form-labels-explicit.ts` as example)
- Custom configurations
- Multiple output formats
- Integration with build tools

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## License

MIT
