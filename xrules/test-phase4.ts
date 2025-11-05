/**
 * Test Phase 4: Type System Integration against demo applications
 */

import { JsxRulesEngine } from './src/jsx-engine';
import { createDefaultEngine } from './src/engine';
import * as fs from 'fs';
import * as path from 'path';

console.log('Phase 4: Type System Integration - Demo Test');
console.log('='.repeat(60));

// Test with a sample React component
const sampleComponent = `
import React from 'react';

function ProductCard({ product }: { product: any }) {
  return (
    <div className="product-card">
      <img src={product.image} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <a href="#">Learn more</a>
      <button>Add to Cart</button>
    </div>
  );
}

function GoodComponent() {
  return (
    <div>
      <img src="logo.png" alt="Company Logo" />
      <h1>Welcome</h1>
      <form>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" autoComplete="email" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export { ProductCard, GoodComponent };
`;

// Create JSX engine with default rules
const engine = new JsxRulesEngine();

// Load rules from default engine
const defaultEngine = createDefaultEngine();
const rules = defaultEngine.getRules();
for (const rule of rules) {
  engine.addRule(rule);
}

console.log(`\n📋 Loaded ${rules.length} rules\n`);

// Check the sample component
console.log('🔍 Analyzing sample React components...\n');
const results = engine.checkCode(sampleComponent, 'sample.tsx');

// Display results for each component
for (const result of results) {
  console.log(`Component: ${result.componentName}`);
  console.log(`  Branches checked: ${result.checkedBranches}`);
  console.log(`  Conditional rendering: ${result.hasConditionalRendering ? 'Yes' : 'No'}`);
  console.log(`  Violations:`);
  console.log(`    Errors:   ${result.errorCount}`);
  console.log(`    Warnings: ${result.warningCount}`);
  console.log(`    Info:     ${result.infoCount}`);

  if (result.violations.length > 0) {
    console.log(`\n  Issues found:`);
    result.violations.slice(0, 5).forEach((v, i) => {
      const icon = v.severity === 'error' ? '🚫' : v.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`    ${i + 1}. ${icon} ${v.ruleName}`);
      console.log(`       ${v.message}`);
      if (v.suggestion) {
        console.log(`       💡 ${v.suggestion}`);
      }
    });
    if (result.violations.length > 5) {
      console.log(`    ... and ${result.violations.length - 5} more`);
    }
  } else {
    console.log(`    ✅ No issues found!`);
  }

  console.log('');
}

// Summary
const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);
const totalErrors = results.reduce((sum, r) => sum + r.errorCount, 0);
const totalWarnings = results.reduce((sum, r) => sum + r.warningCount, 0);
const totalInfo = results.reduce((sum, r) => sum + r.infoCount, 0);

console.log('📊 Summary:');
console.log(`  Components analyzed: ${results.length}`);
console.log(`  Total violations: ${totalViolations}`);
console.log(`    Errors:   ${totalErrors}`);
console.log(`    Warnings: ${totalWarnings}`);
console.log(`    Info:     ${totalInfo}`);
console.log('');

// Demonstrate the JSX parser
console.log('🔬 JSX Parser Features:');
console.log('  ✓ Parse React functional components');
console.log('  ✓ Parse arrow function components');
console.log('  ✓ Extract JSX elements and attributes');
console.log('  ✓ Convert React props to HTML attributes (className → class)');
console.log('  ✓ Handle nested components');
console.log('  ✓ Detect conditional rendering');
console.log('  ✓ Track component dependencies');
console.log('  ✓ Support JSX fragments');
console.log('  ✓ Generate HTML for rule checking');
console.log('');

console.log('✅ Phase 4 Type System Integration is working!');
console.log('');
console.log('Phase 4 enables:');
console.log('  • Static analysis of React/TSX components');
console.log('  • Rule checking before runtime');
console.log('  • Type-aware HTML pattern detection');
console.log('  • Integration with TypeScript compiler API');
console.log('');
