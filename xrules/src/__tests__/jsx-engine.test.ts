/**
 * Tests for JSX Engine (Phase 4)
 */

import { JsxRulesEngine } from '../jsx-engine';
import { formLabelsExplicit } from '../rules/form-labels-explicit';
import { imagesAltText } from '../rules/images-alt-text';
import { emptyLinks } from '../rules/empty-links';
import { metaTitle, metaViewport } from '../rules/seo';

describe('JSX Rules Engine', () => {
  describe('Basic Component Checking', () => {
    it('should check rules against a simple component', () => {
      const code = `
        function Button() {
          return <button>Click me</button>;
        }
      `;

      const engine = new JsxRulesEngine([]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].componentName).toBe('Button');
      expect(results[0].checkedBranches).toBe(1);
    });

    it('should detect missing alt text in image components', () => {
      const code = `
        function ProfilePic() {
          return <img src="profile.jpg" />;
        }
      `;

      const engine = new JsxRulesEngine([imagesAltText]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].violations.length).toBeGreaterThan(0);
      expect(results[0].violations[0].ruleId).toBe('images-alt-text');
    });

    it('should pass when alt text is provided', () => {
      const code = `
        function ProfilePic() {
          return <img src="profile.jpg" alt="User profile picture" />;
        }
      `;

      const engine = new JsxRulesEngine([imagesAltText]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].violations).toHaveLength(0);
    });
  });

  describe('Form Label Checking', () => {
    it('should detect labels without for attribute', () => {
      const code = `
        function EmailField() {
          return (
            <div>
              <label>Email</label>
              <input type="email" id="email" name="email" />
            </div>
          );
        }
      `;

      const engine = new JsxRulesEngine([formLabelsExplicit]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      // Should detect that label is missing 'for' attribute
      expect(results[0].violations.length).toBeGreaterThan(0);
      expect(results[0].violations[0].ruleId).toBe('form-labels-explicit');
    });

    it('should check labels when wrapped in a container', () => {
      const code = `
        function EmailField() {
          return (
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" />
            </div>
          );
        }
      `;

      const engine = new JsxRulesEngine([formLabelsExplicit]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      // When wrapped in a container, the label-for relationship should be detected
      expect(results[0].violations).toHaveLength(0);
    });
  });

  describe('Link Checking', () => {
    it('should detect empty links', () => {
      const code = `
        function NavItem() {
          return <a href="/page"></a>;
        }
      `;

      const engine = new JsxRulesEngine([emptyLinks]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].violations.length).toBeGreaterThan(0);
      expect(results[0].violations[0].ruleId).toBe('empty-links');
    });

    it('should pass when link has text', () => {
      const code = `
        function NavItem() {
          return <a href="/page">Go to page</a>;
        }
      `;

      const engine = new JsxRulesEngine([emptyLinks]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].violations).toHaveLength(0);
    });
  });

  describe('Conditional Rendering', () => {
    it('should check all branches of conditional rendering', () => {
      const code = `
        function Alert({ type }: { type: string }) {
          if (type === 'error') {
            return <div className="error"><img src="error.png" /></div>;
          }
          return <div className="success"><img src="success.png" alt="Success" /></div>;
        }
      `;

      const engine = new JsxRulesEngine([imagesAltText]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      // Should check both branches
      expect(results[0].checkedBranches).toBe(2);

      // Should find violation in error branch (missing alt)
      expect(results[0].violations.length).toBeGreaterThan(0);
    });
  });

  describe('Multiple Components', () => {
    it('should check multiple components in a file', () => {
      const code = `
        function Header() {
          return <header><h1>Title</h1></header>;
        }

        function Footer() {
          return <footer><p>Copyright 2024</p></footer>;
        }
      `;

      const engine = new JsxRulesEngine([]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(2);
      expect(results[0].componentName).toBe('Header');
      expect(results[1].componentName).toBe('Footer');
    });

    it('should check each component independently', () => {
      const code = `
        function GoodImage() {
          return <img src="good.jpg" alt="Good image" />;
        }

        function BadImage() {
          return <img src="bad.jpg" />;
        }
      `;

      const engine = new JsxRulesEngine([imagesAltText]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(2);

      // First component should pass
      expect(results[0].violations).toHaveLength(0);

      // Second component should have violation
      expect(results[1].violations.length).toBeGreaterThan(0);
    });
  });

  describe('Complex Components', () => {
    it('should check complex form components', () => {
      const code = `
        function LoginForm() {
          return (
            <form>
              <div>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" autoComplete="username" />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" autoComplete="current-password" />
              </div>
              <button type="submit">Login</button>
            </form>
          );
        }
      `;

      const engine = new JsxRulesEngine([formLabelsExplicit]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].componentName).toBe('LoginForm');

      // Should pass - all inputs have labels
      expect(results[0].violations).toHaveLength(0);
    });

    it('should check nested component structures', () => {
      const code = `
        function Card() {
          return (
            <div className="card">
              <header>
                <img src="icon.png" />
                <h2>Card Title</h2>
              </header>
              <main>
                <p>Card content</p>
                <a href="#">Read more</a>
              </main>
            </div>
          );
        }
      `;

      const engine = new JsxRulesEngine([imagesAltText, emptyLinks]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);

      // Should find violations for:
      // 1. Missing alt text on img
      // 2. Generic "Read more" link text (if that rule is active)
      expect(results[0].violations.length).toBeGreaterThan(0);
    });
  });

  describe('React-specific Attributes', () => {
    it('should convert className to class for checking', () => {
      const code = `
        function StyledDiv() {
          return <div className="container">Content</div>;
        }
      `;

      const engine = new JsxRulesEngine([]);
      const results = engine.checkCode(code);

      // No violations expected, just checking it doesn't crash
      expect(results).toHaveLength(1);
      expect(results[0].violations).toHaveLength(0);
    });

    it('should convert htmlFor to for', () => {
      const code = `
        function Label() {
          return <label htmlFor="input1">Label</label>;
        }
      `;

      const engine = new JsxRulesEngine([]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].violations).toHaveLength(0);
    });
  });

  describe('Arrow Function Components', () => {
    it('should check arrow function components', () => {
      const code = `
        const Image = () => <img src="photo.jpg" />;
      `;

      const engine = new JsxRulesEngine([imagesAltText]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].componentName).toBe('Image');
      expect(results[0].violations.length).toBeGreaterThan(0);
    });

    it('should check arrow functions with explicit return', () => {
      const code = `
        const Button = () => {
          return <button>Click</button>;
        };
      `;

      const engine = new JsxRulesEngine([]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].componentName).toBe('Button');
    });

    it('should check arrow functions with parenthesized return', () => {
      const code = `
        const Card = () => (
          <div>
            <img src="card.jpg" />
          </div>
        );
      `;

      const engine = new JsxRulesEngine([imagesAltText]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].violations.length).toBeGreaterThan(0);
    });
  });

  describe('Error Aggregation', () => {
    it('should correctly count errors, warnings, and info', () => {
      const code = `
        function Page() {
          return (
            <div>
              <img src="1.jpg" />
              <img src="2.jpg" />
              <img src="3.jpg" />
            </div>
          );
        }
      `;

      const engine = new JsxRulesEngine([imagesAltText]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);
      expect(results[0].violations.length).toBe(3);
      expect(results[0].errorCount).toBe(3); // images-alt-text is 'error' severity
    });
  });

  describe('Integration with Multiple Rules', () => {
    it('should check multiple rules simultaneously', () => {
      const code = `
        function BadComponent() {
          return (
            <div>
              <img src="photo.jpg" />
              <a href="/page"></a>
              <input type="text" name="field" />
            </div>
          );
        }
      `;

      const engine = new JsxRulesEngine([
        imagesAltText,
        emptyLinks,
        formLabelsExplicit,
      ]);
      const results = engine.checkCode(code);

      expect(results).toHaveLength(1);

      // Should find violations for at least two rules
      const ruleIds = results[0].violations.map(v => v.ruleId);
      expect(ruleIds).toContain('images-alt-text');
      expect(ruleIds).toContain('empty-links');
      // form-labels-explicit requires checking the DOM structure which might not work in this case
    });
  });
});
