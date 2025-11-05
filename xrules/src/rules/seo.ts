/**
 * SEO Rules - Search Engine Optimization
 */

import type { Rule } from '../types';

/**
 * Page must have a title
 */
export const metaTitle: Rule = {
  id: 'meta-title',
  name: 'Page Must Have Title',
  description: 'Every page must have a <title> element for SEO',
  category: 'seo',
  severity: 'error',
  pattern: 'head',

  check(element, context): string | null {
    const title = context.querySelector('title');

    if (!title) {
      return 'Page is missing <title> element. Title is critical for SEO and browser tabs.';
    }

    const titleText = title.textContent.trim();

    if (!titleText) {
      return 'Title element is empty. Provide a descriptive title for the page.';
    }

    if (titleText.length < 10) {
      return `Title "${titleText}" is too short (${titleText.length} chars). Recommended: 50-60 characters.`;
    }

    if (titleText.length > 70) {
      return `Title is too long (${titleText.length} chars). Search engines may truncate it. Recommended: 50-60 characters.`;
    }

    return null;
  },

  suggest(): string {
    return 'Ensure title is 50-60 characters with descriptive keywords';
  },
};

/**
 * Page should have meta description
 */
export const metaDescription: Rule = {
  id: 'meta-description',
  name: 'Page Should Have Meta Description',
  description: 'Pages should have a meta description for search engine results',
  category: 'seo',
  severity: 'warning',
  pattern: 'head',

  check(element, context): string | null {
    const metaDesc = context?.querySelector('meta[name="description"]');

    if (!metaDesc) {
      return 'Page is missing meta description. This helps search engines display relevant snippets.';
    }

    const content = metaDesc.getAttribute('content')?.trim();

    if (!content) {
      return 'Meta description is empty. Provide a compelling summary of the page (150-160 characters).';
    }

    if (content.length < 50) {
      return `Meta description is too short (${content.length} chars). Recommended: 150-160 characters.`;
    }

    if (content.length > 170) {
      return `Meta description is too long (${content.length} chars). Search engines may truncate it. Recommended: 150-160 characters.`;
    }

    return null;
  },

  suggest(): string {
    return 'Add or update meta description to 150-160 characters with keywords and value proposition';
  },
};

/**
 * Page should have viewport meta tag
 */
export const metaViewport: Rule = {
  id: 'meta-viewport',
  name: 'Page Should Have Viewport Meta Tag',
  description: 'Pages should have viewport meta tag for mobile responsiveness',
  category: 'seo',
  severity: 'error',
  pattern: 'head',

  check(element, context): string | null {
    const viewport = context?.querySelector('meta[name="viewport"]');

    if (!viewport) {
      return 'Page is missing viewport meta tag. This is required for mobile-friendly pages.';
    }

    const content = viewport.getAttribute('content');

    if (!content?.includes('width=device-width')) {
      return 'Viewport meta tag should include width=device-width for responsive design.';
    }

    return null;
  },

  suggest(): string {
    return 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> in <head>';
  },
};

/**
 * Page should have charset meta tag
 */
export const metaCharset: Rule = {
  id: 'meta-charset',
  name: 'Page Should Have Charset Declaration',
  description: 'Pages should declare character encoding',
  category: 'seo',
  severity: 'error',
  pattern: 'head',

  check(element, context): string | null {
    const charset = context?.querySelector('meta[charset]');

    if (!charset) {
      return 'Page is missing charset declaration. Add <meta charset="utf-8"> for proper text encoding.';
    }

    const charsetValue = charset.getAttribute('charset')?.toLowerCase();

    if (charsetValue !== 'utf-8') {
      return `Charset "${charsetValue}" should be "utf-8" for best compatibility.`;
    }

    return null;
  },

  suggest(): string {
    return 'Add <meta charset="utf-8"> as first element in <head>';
  },
};

/**
 * Links should not use generic text
 */
export const descriptiveLinkText: Rule = {
  id: 'descriptive-link-text',
  name: 'Links Should Have Descriptive Text',
  description: 'Avoid generic link text like "click here" for better SEO',
  category: 'seo',
  severity: 'warning',
  pattern: 'a:contains-i("click here"), a:contains-i("read more"), a:contains-i("click"), a:contains("here")',

  check(element): string | null {
    const text = element.textContent.trim();
    return `Link text "${text}" is not descriptive. Use keywords that describe the destination for better SEO.`;
  },

  suggest(): string {
    return 'Use descriptive link text with relevant keywords (e.g., "Download Product Catalog")';
  },
};

/**
 * Canonical URL for duplicate content
 */
export const canonicalUrl: Rule = {
  id: 'canonical-url',
  name: 'Page Should Have Canonical URL',
  description: 'Pages should specify canonical URL to avoid duplicate content issues',
  category: 'seo',
  severity: 'info',
  pattern: 'head',

  check(element, context): string | null {
    const canonical = context?.querySelector('link[rel="canonical"]');

    if (!canonical) {
      return 'Page should have a canonical URL to help search engines identify the primary version.';
    }

    const href = canonical.getAttribute('href');

    if (!href) {
      return 'Canonical link is missing href attribute.';
    }

    return null;
  },

  suggest(): string {
    return 'Add <link rel="canonical" href="https://example.com/page"> in <head>';
  },
};

/**
 * Open Graph tags for social sharing
 */
export const openGraphTags: Rule = {
  id: 'open-graph-tags',
  name: 'Page Should Have Open Graph Tags',
  description: 'Pages should have Open Graph tags for better social media sharing',
  category: 'seo',
  severity: 'info',
  pattern: 'head',

  check(element, context): string | null {
    const ogTitle = context?.querySelector('meta[property="og:title"]');
    const ogDescription = context?.querySelector('meta[property="og:description"]');
    const ogImage = context?.querySelector('meta[property="og:image"]');

    const missing: string[] = [];

    if (!ogTitle) missing.push('og:title');
    if (!ogDescription) missing.push('og:description');
    if (!ogImage) missing.push('og:image');

    if (missing.length > 0) {
      return `Page is missing Open Graph tags: ${missing.join(', ')}. ` +
        'These improve social media sharing appearance.';
    }

    return null;
  },

  suggest(): string {
    return 'Add Open Graph meta tags: og:title, og:description, og:image, og:url';
  },
};

/**
 * Nofollow for external links (optional)
 */
export const nofollowExternal: Rule = {
  id: 'nofollow-external',
  name: 'Consider Nofollow For External Links',
  description: 'External links may benefit from rel="nofollow" to preserve PageRank',
  category: 'seo',
  severity: 'info',
  pattern: 'a[href^="http"]:not([href*="localhost"])',

  check(element): string | null {
    const href = element.getAttribute('href') || '';
    const rel = element.getAttribute('rel') || '';

    // Check if it's an external link (not to current domain)
    // This is a simplified check - in reality, you'd check against your domain
    const isExternal = href.startsWith('http') && !href.includes('localhost');

    if (isExternal && !rel.includes('nofollow') && !rel.includes('sponsored')) {
      return 'External link may benefit from rel="nofollow" or rel="sponsored" to preserve PageRank.';
    }

    return null;
  },

  suggest(): string {
    return 'Add rel="nofollow" or rel="sponsored" if appropriate for this external link';
  },
};

/**
 * Images should have descriptive alt text (SEO focused)
 */
export const imagesSeoAlt: Rule = {
  id: 'images-seo-alt',
  name: 'Images Should Have SEO-Friendly Alt Text',
  description: 'Image alt text should include relevant keywords for SEO',
  category: 'seo',
  severity: 'warning',
  pattern: 'img',

  check(element): string | null {
    const alt = element.getAttribute('alt');
    const src = element.getAttribute('src') || '';

    if (!alt) {
      return 'Image is missing alt attribute. Alt text helps search engines understand image content.';
    }

    // Check if alt is just the filename
    const filename = src.split('/').pop()?.split('.')[0] || '';
    if (alt === filename) {
      return `Alt text "${alt}" appears to be just the filename. Use descriptive keywords instead.`;
    }

    // Check for very short alt text
    if (alt.trim().length < 5 && alt.trim() !== '') {
      return `Alt text "${alt}" is too short. Use descriptive text with relevant keywords.`;
    }

    return null;
  },

  suggest(): string {
    return 'Write descriptive alt text with relevant keywords (e.g., "Red leather handbag with gold hardware")';
  },
};

/**
 * Structured data / Schema.org
 */
export const structuredData: Rule = {
  id: 'structured-data',
  name: 'Consider Adding Structured Data',
  description: 'Pages may benefit from Schema.org structured data for rich snippets',
  category: 'seo',
  severity: 'info',
  pattern: 'head',

  check(element, context): string | null {
    const jsonLd = context?.querySelector('script[type="application/ld+json"]');

    if (!jsonLd) {
      return 'Page does not have structured data (JSON-LD). Consider adding Schema.org markup for rich snippets.';
    }

    return null;
  },

  suggest(): string {
    return 'Add JSON-LD structured data appropriate for your content type (Article, Product, Organization, etc.)';
  },
};

/**
 * Language declaration
 */
export const htmlLang: Rule = {
  id: 'html-lang',
  name: 'HTML Should Have Lang Attribute',
  description: 'HTML element should have lang attribute for SEO and accessibility',
  category: 'seo',
  severity: 'warning',
  pattern: 'html',

  check(element): string | null {
    const lang = element.getAttribute('lang');

    if (!lang) {
      return 'HTML element is missing lang attribute. Declare page language for search engines and screen readers.';
    }

    return null;
  },

  suggest(): string {
    return 'Add lang attribute to <html> element (e.g., <html lang="en">)';
  },
};
