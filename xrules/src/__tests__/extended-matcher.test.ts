/**
 * Tests for extended pattern matcher
 */

import { parseHTML } from '../parser';
import { queryExtended, parseExtendedPattern } from '../extended-matcher';

describe('Extended Pattern Matcher', () => {
  describe('parseExtendedPattern', () => {
    it('should parse basic selector with :contains modifier', () => {
      const pattern = parseExtendedPattern('button:contains("Submit")');
      expect(pattern.baseSelector).toBe('button');
      expect(pattern.modifiers).toHaveLength(1);
      expect(pattern.modifiers[0]).toEqual({
        type: 'contains',
        text: 'Submit',
        caseSensitive: true,
      });
    });

    it('should parse selector with :has modifier', () => {
      const pattern = parseExtendedPattern('label:has(input)');
      expect(pattern.baseSelector).toBe('label');
      expect(pattern.modifiers[0]).toEqual({
        type: 'has',
        selector: 'input',
      });
    });

    it('should parse multiple modifiers', () => {
      const pattern = parseExtendedPattern('a:contains("Click"):has-parent(nav)');
      expect(pattern.baseSelector).toBe('a');
      expect(pattern.modifiers).toHaveLength(2);
    });

    it('should parse :without modifier', () => {
      const pattern = parseExtendedPattern('img:without(alt)');
      expect(pattern.baseSelector).toBe('img');
      expect(pattern.modifiers[0]).toEqual({
        type: 'without',
        attribute: 'alt',
      });
    });
  });

  describe(':contains modifier', () => {
    it('should match elements containing specific text', () => {
      const html = `
        <html><body>
          <button>Submit</button>
          <button>Cancel</button>
          <button>Submit Form</button>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'button:contains("Submit")');

      expect(results).toHaveLength(2);
      expect(results[0].textContent.trim()).toBe('Submit');
      expect(results[1].textContent.trim()).toBe('Submit Form');
    });

    it('should match case-insensitively with :contains-i', () => {
      const html = `
        <html><body>
          <a>Click Here</a>
          <a>click here</a>
          <a>CLICK HERE</a>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'a:contains-i("click here")');

      expect(results).toHaveLength(3);
    });
  });

  describe(':has modifier', () => {
    it('should match elements containing children', () => {
      const html = `
        <html><body>
          <div><span>Text</span></div>
          <div><p>Text</p></div>
          <div>No children</div>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'div:has(span)');

      expect(results).toHaveLength(1);
      expect(results[0].children[0].tagName).toBe('span');
    });

    it('should match elements with any descendant matching selector', () => {
      const html = `
        <html><body>
          <form>
            <div>
              <input type="text" />
            </div>
          </form>
          <form>
            <div>No input</div>
          </form>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'form:has(input)');

      expect(results).toHaveLength(1);
    });
  });

  describe(':without modifier', () => {
    it('should match elements missing an attribute', () => {
      const html = `
        <html><body>
          <img src="1.jpg" alt="Image 1" />
          <img src="2.jpg" />
          <img src="3.jpg" alt="Image 3" />
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'img:without(alt)');

      expect(results).toHaveLength(1);
      expect(results[0].getAttribute('src')).toBe('2.jpg');
    });
  });

  describe(':has-parent modifier', () => {
    it('should match elements with specific parent', () => {
      const html = `
        <html><body>
          <nav><a href="/home">Home</a></nav>
          <div><a href="/about">About</a></div>
          <nav><a href="/contact">Contact</a></nav>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'a:has-parent(nav)');

      expect(results).toHaveLength(2);
      expect(results[0].textContent.trim()).toBe('Home');
      expect(results[1].textContent.trim()).toBe('Contact');
    });
  });

  describe(':has-ancestor modifier', () => {
    it('should match elements with specific ancestor', () => {
      const html = `
        <html><body>
          <article>
            <section>
              <div>
                <p>Inside article</p>
              </div>
            </section>
          </article>
          <div>
            <p>Outside article</p>
          </div>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'p:has-ancestor(article)');

      expect(results).toHaveLength(1);
      expect(results[0].textContent.trim()).toBe('Inside article');
    });
  });

  describe(':has-sibling modifier', () => {
    it('should match elements with specific sibling', () => {
      const html = `
        <html><body>
          <div>
            <label for="name">Name</label>
            <input id="name" type="text" />
          </div>
          <div>
            <input type="text" />
          </div>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'input:has-sibling(label)');

      expect(results).toHaveLength(1);
      expect(results[0].getAttribute('id')).toBe('name');
    });
  });

  describe(':not modifier', () => {
    it('should exclude elements matching pattern', () => {
      const html = `
        <html><body>
          <input type="text" />
          <input type="hidden" />
          <input type="password" />
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'input:not([type="hidden"])');

      expect(results).toHaveLength(2);
      expect(results[0].getAttribute('type')).toBe('text');
      expect(results[1].getAttribute('type')).toBe('password');
    });
  });

  describe('Complex patterns', () => {
    it('should handle multiple modifiers', () => {
      const html = `
        <html><body>
          <nav>
            <a href="/home">Home</a>
            <a href="/about">About</a>
          </nav>
          <footer>
            <a href="/contact">Contact</a>
          </footer>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(
        doc.documentElement,
        'a:has-parent(nav):contains("Home")'
      );

      expect(results).toHaveLength(1);
      expect(results[0].textContent.trim()).toBe('Home');
    });

    it('should combine :has and :without', () => {
      const html = `
        <html><body>
          <label for="input1">
            <input id="input1" type="text" />
          </label>
          <label>
            <input type="text" />
          </label>
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(
        doc.documentElement,
        'label:has(input):without(for)'
      );

      expect(results).toHaveLength(1);
    });
  });

  describe('Real-world accessibility patterns', () => {
    it('should find buttons with non-descriptive text', () => {
      const html = `
        <html><body>
          <button>Submit</button>
          <button>Click here</button>
          <button>Learn more</button>
          <button>Read more</button>
        </body></html>
      `;
      const doc = parseHTML(html);

      // Find buttons with "click here"
      const clickHere = queryExtended(doc.documentElement, 'button:contains-i("click here")');
      expect(clickHere).toHaveLength(1);

      // Find buttons with "read more" or "learn more"
      const learnMore = queryExtended(doc.documentElement, 'button:contains-i("learn more")');
      const readMore = queryExtended(doc.documentElement, 'button:contains-i("read more")');
      expect(learnMore.length + readMore.length).toBe(2);
    });

    it('should find images without alt text', () => {
      const html = `
        <html><body>
          <img src="logo.png" alt="Company Logo" />
          <img src="banner.jpg" />
          <img src="photo.jpg" alt="" />
        </body></html>
      `;
      const doc = parseHTML(html);
      const results = queryExtended(doc.documentElement, 'img:without(alt)');

      expect(results).toHaveLength(1);
      expect(results[0].getAttribute('src')).toBe('banner.jpg');
    });

    it('should find links opening in new tab without security attributes', () => {
      const html = `
        <html><body>
          <a href="https://example.com" target="_blank">Link 1</a>
          <a href="https://example.com" target="_blank" rel="noopener noreferrer">Link 2</a>
        </body></html>
      `;
      const doc = parseHTML(html);

      // Find links with target="_blank" but without rel attribute
      const unsafeLinks = queryExtended(
        doc.documentElement,
        'a[target="_blank"]:without(rel)'
      );

      expect(unsafeLinks).toHaveLength(1);
    });
  });
});
