/**
 * Tests for HTML parser
 */

import { parseHTML, querySelector, querySelectorAll, getElementById } from '../parser';

describe('HTML Parser', () => {
  describe('parseHTML', () => {
    it('should parse basic HTML', () => {
      const html = '<html><body><h1>Hello</h1></body></html>';
      const doc = parseHTML(html);

      expect(doc.documentElement.tagName).toBe('html');
      expect(doc.documentElement.children).toHaveLength(2); // head and body
    });

    it('should parse attributes', () => {
      const html = '<div id="test" class="container"></div>';
      const doc = parseHTML(html);

      const div = querySelector(doc.documentElement, 'div');
      expect(div).not.toBeNull();
      expect(div?.getAttribute('id')).toBe('test');
      expect(div?.getAttribute('class')).toBe('container');
    });

    it('should preserve text content', () => {
      const html = '<p>Hello World</p>';
      const doc = parseHTML(html);

      const p = querySelector(doc.documentElement, 'p');
      expect(p?.textContent.trim()).toBe('Hello World');
    });

    it('should parse nested elements', () => {
      const html = `
        <div>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `;
      const doc = parseHTML(html);

      const items = querySelectorAll(doc.documentElement, 'li');
      expect(items).toHaveLength(2);
    });
  });

  describe('querySelector', () => {
    it('should find elements by tag name', () => {
      const html = '<html><body><h1>Title</h1></body></html>';
      const doc = parseHTML(html);

      const h1 = querySelector(doc.documentElement, 'h1');
      expect(h1).not.toBeNull();
      expect(h1?.tagName).toBe('h1');
    });

    it('should find elements by ID', () => {
      const html = '<div id="main">Content</div>';
      const doc = parseHTML(html);

      const div = querySelector(doc.documentElement, '#main');
      expect(div).not.toBeNull();
      expect(div?.getAttribute('id')).toBe('main');
    });

    it('should find elements by class', () => {
      const html = '<div class="container">Content</div>';
      const doc = parseHTML(html);

      const div = querySelector(doc.documentElement, '.container');
      expect(div).not.toBeNull();
      expect(div?.getAttribute('class')).toBe('container');
    });

    it('should find elements by attribute', () => {
      const html = '<input type="text" />';
      const doc = parseHTML(html);

      const input = querySelector(doc.documentElement, '[type="text"]');
      expect(input).not.toBeNull();
      expect(input?.getAttribute('type')).toBe('text');
    });

    it('should return null if not found', () => {
      const html = '<div>Content</div>';
      const doc = parseHTML(html);

      const result = querySelector(doc.documentElement, '#nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('querySelectorAll', () => {
    it('should find multiple elements', () => {
      const html = `
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      `;
      const doc = parseHTML(html);

      const items = querySelectorAll(doc.documentElement, 'li');
      expect(items).toHaveLength(3);
    });

    it('should return empty array if none found', () => {
      const html = '<div>Content</div>';
      const doc = parseHTML(html);

      const items = querySelectorAll(doc.documentElement, 'span');
      expect(items).toHaveLength(0);
    });

    it('should find elements with multiple classes', () => {
      const html = '<div class="foo bar">Content</div>';
      const doc = parseHTML(html);

      const div1 = querySelector(doc.documentElement, '.foo');
      const div2 = querySelector(doc.documentElement, '.bar');

      expect(div1).not.toBeNull();
      expect(div2).not.toBeNull();
      expect(div1).toBe(div2);
    });
  });

  describe('getElementById', () => {
    it('should find element by ID', () => {
      const html = '<div id="test">Content</div>';
      const doc = parseHTML(html);

      const div = getElementById(doc.documentElement, 'test');
      expect(div).not.toBeNull();
      expect(div?.getAttribute('id')).toBe('test');
    });

    it('should find nested element by ID', () => {
      const html = `
        <div>
          <section>
            <p id="target">Text</p>
          </section>
        </div>
      `;
      const doc = parseHTML(html);

      const p = getElementById(doc.documentElement, 'target');
      expect(p).not.toBeNull();
      expect(p?.tagName).toBe('p');
    });

    it('should return null if not found', () => {
      const html = '<div>Content</div>';
      const doc = parseHTML(html);

      const result = getElementById(doc.documentElement, 'nonexistent');
      expect(result).toBeNull();
    });
  });
});
