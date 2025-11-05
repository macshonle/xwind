# Realistic Web Demo Applications

This document describes the three realistic web demo applications created to showcase Tailwind CSS in real-world scenarios and serve as comprehensive test data for the xrules engine.

## Overview

Each demo represents a common web application pattern with realistic complexity, interactive elements, and proper (or intentionally improvable) accessibility and semantic HTML practices. These demos provide rich test cases for validating rules around:

- Accessibility (ARIA labels, form associations, semantic HTML)
- SEO (heading hierarchy, meta information, semantic structure)
- Framework-specific patterns (Next.js components, React hooks)
- App-specific conventions (custom styling patterns, component usage)
- Performance considerations (image optimization, lazy loading)
- Security (form handling, external links)

## Demo Applications

### 1. E-commerce Product Catalog
**Route:** `/demos/ecommerce`

#### Purpose
Demonstrates a realistic e-commerce interface with product browsing, filtering, and shopping cart functionality.

#### Key Features
- **Product Grid**: Responsive grid layout with 8 products
- **Search Functionality**: Real-time search filtering
- **Category Filters**: Radio button group for category selection
- **Sort Options**: Dropdown for sorting (price, rating, featured)
- **Shopping Cart**: Interactive cart with item count badge
- **Product Cards**: Rich product information with images, prices, ratings, stock status
- **Form Controls**: Labeled inputs for search, filters, and sorting

#### Tailwind Patterns Demonstrated
- Complex grid layouts with responsive breakpoints
- Form controls with proper labeling
- Custom color tokens for pricing and status badges
- Hover states and transitions
- Badge and pill components
- Sticky header navigation
- Semantic color usage (success/error states)

#### Testing Opportunities
- **Accessibility**: Form label associations, ARIA labels on buttons and inputs
- **Semantic HTML**: Proper use of `<article>`, `<aside>`, `<nav>`, `<header>`
- **Forms**: All inputs have associated labels (both explicit and implicit examples)
- **Interactive Elements**: Buttons with meaningful text or ARIA labels
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **State Management**: Disabled states properly indicated
- **Search Optimization**: Semantic structure for product catalog

### 2. SaaS Dashboard
**Route:** `/demos/dashboard`

#### Purpose
Represents a comprehensive SaaS application dashboard with data visualization, user management, and settings.

#### Key Features
- **Collapsible Sidebar**: Expandable navigation with icons and labels
- **Tab Navigation**: Multiple views (Overview, Users, Analytics, Settings)
- **Data Visualization**: Bar charts, progress bars, statistics cards
- **User Table**: Complex table with multiple columns and status badges
- **Forms**: Settings panel with various input types
- **Activity Feed**: Scrollable list of recent activities
- **Analytics**: Traffic source breakdown with progress indicators

#### Tailwind Patterns Demonstrated
- Sidebar layouts with toggle functionality
- Data tables with hover effects
- Chart visualizations using Tailwind classes
- Form layouts (vertical forms, inline labels)
- Status badges with color coding
- Card-based layouts
- Sticky headers
- Complex navigation patterns

#### Testing Opportunities
- **Tables**: Proper table structure with headers
- **Navigation**: ARIA labels for navigation, aria-current for active states
- **Forms**: Form controls in settings panel with proper labels
- **Data Visualization**: ARIA labels for progress bars and charts
- **Interactive Elements**: Proper focus management, keyboard navigation
- **Sidebar**: Proper ARIA attributes (aria-expanded, aria-label)
- **Status Indicators**: Color contrast and additional text for colorblind users
- **Complex Layouts**: Proper heading hierarchy throughout different sections

### 3. Marketing Landing Page
**Route:** `/demos/landing`

#### Purpose
Showcases a complete marketing website with hero section, features, pricing, testimonials, and newsletter signup.

#### Key Features
- **Hero Section**: Large heading, subtext, dual CTAs
- **Navigation Bar**: Sticky navigation with anchor links
- **Features Grid**: 6 feature cards with icons and descriptions
- **Testimonials**: Customer quotes with avatars and roles
- **Pricing Table**: 3-tier pricing with feature lists and CTAs
- **Newsletter Form**: Email subscription with success state
- **Footer**: Multi-column footer with links and social media

#### Tailwind Patterns Demonstrated
- Hero layouts with gradient text
- Card grids with hover effects
- Pricing tables with highlighted tiers
- Form handling with state management
- Navigation with anchor links
- Multi-column footer layouts
- Call-to-action button patterns
- Testimonial card designs
- Success states and feedback

#### Testing Opportunities
- **SEO**: Heading hierarchy (h1, h2, h3, h4), semantic structure
- **Forms**: Newsletter signup with proper label association
- **Links**: External links (should have rel="noopener noreferrer")
- **Navigation**: Skip links, proper navigation landmarks
- **Accessibility**: Alt text (emojis used but should note real images would need alt)
- **Call-to-Actions**: Clear button text, proper contrast
- **Pricing Tables**: Accessible tables or lists with proper structure
- **Footer**: Proper navigation structure
- **Form Validation**: Email input validation

## Common Patterns Across All Demos

### Accessibility Features
- Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`)
- ARIA labels on interactive elements
- Form labels properly associated with inputs
- Focus states on all interactive elements
- Keyboard navigation support
- Screen reader text for icon-only buttons
- Status badges with ARIA labels

### Tailwind Usage
- CSS custom properties via theme system
- Responsive design with breakpoint modifiers
- Hover and focus states
- Theme-aware transitions
- Custom color tokens
- Custom spacing and radius values
- Shadow system usage

### React/Next.js Patterns
- Client-side interactivity with 'use client'
- State management with useState
- Form handling
- Conditional rendering
- Event handlers
- TypeScript type safety

## Testing Strategy with xrules

### Phase 1: Basic Rule Testing
Use these demos to test foundational rules:
- Form label associations (ecommerce search, dashboard settings, landing newsletter)
- Heading hierarchy (all demos have multiple heading levels)
- Button accessibility (all demos have numerous buttons)
- ARIA labels (interactive elements throughout)

### Phase 2: Context-Specific Rules
Test scoped rules:
- E-commerce: Product cards must have certain structure
- Dashboard: Tables must have proper headers
- Landing: Pricing tiers must be accessible

### Phase 3: Pattern Detection
Test pattern matching:
- Find all forms and verify labels
- Identify data tables and check structure
- Locate navigation elements and verify ARIA
- Find all buttons and check for text/ARIA

### Phase 4: Framework Integration
Test React/Next.js specific rules:
- Identify client components
- Check for proper TypeScript usage
- Verify state management patterns
- Check for Next.js best practices

## Intentional Test Cases

### Good Practices to Validate
1. **Explicit Form Labels**: Newsletter signup uses explicit `for` attribute
2. **Semantic HTML**: All demos use proper semantic elements
3. **ARIA Labels**: Buttons have meaningful labels
4. **Responsive Design**: Mobile-first approach throughout

### Potential Issues to Detect
1. **Form Labels**: Some inputs might use wrapping labels vs explicit `for`
2. **Alt Text**: Emojis used as placeholders (in production, need real images with alt)
3. **External Links**: Footer links should be checked for security attributes
4. **Color Contrast**: Some theme combinations might have contrast issues
5. **Heading Skipping**: Verify no heading levels are skipped

## Running the Demos

### Development Mode
```bash
npm run dev
```
Visit:
- Main page: `http://localhost:3000`
- E-commerce: `http://localhost:3000/demos/ecommerce`
- Dashboard: `http://localhost:3000/demos/dashboard`
- Landing: `http://localhost:3000/demos/landing`

### Production Build
```bash
npm run build
npm start
```

### Static Export
All demos are statically exportable and include no server-side dependencies.

## Future Enhancements

### Additional Demos to Consider
1. **Documentation Site**: Technical docs with code examples, navigation, search
2. **Blog Platform**: Article listing, reading view, comments, categories
3. **Social Media Feed**: Infinite scroll, cards, interactions, media
4. **Admin Panel**: CRUD operations, modals, forms, validation

### Test Scenario Expansion
1. Add intentional violations for testing error detection
2. Create variants with good/bad patterns side-by-side
3. Add more complex form scenarios (multi-step, validation)
4. Include more data visualization examples
5. Add modal dialogs and overlays
6. Include video and media elements

## Metrics

### Lines of Code
- E-commerce: ~350 lines
- Dashboard: ~500 lines
- Landing: ~450 lines
- **Total**: ~1,300 lines of realistic application code

### Component Count
- **Interactive Elements**: 50+ buttons, inputs, links across all demos
- **Forms**: 6 different form patterns
- **Navigation**: 3 different navigation styles
- **Data Display**: Tables, cards, lists, grids

### Accessibility Points
- **Form Labels**: 15+ labeled form controls
- **ARIA Attributes**: 30+ ARIA labels/attributes
- **Semantic Elements**: 100+ semantic HTML5 elements
- **Headings**: 20+ heading elements across proper hierarchy

## Conclusion

These three realistic web demos provide comprehensive test coverage for the xrules engine across multiple dimensions:

- **Breadth**: Three different application types covering common web patterns
- **Depth**: Each demo includes realistic complexity and interactive features
- **Accessibility**: Multiple opportunities to test a11y rules
- **SEO**: Proper semantic structure for search optimization testing
- **Framework**: Real Next.js/React patterns for framework-specific rules
- **Patterns**: Common Tailwind patterns for style and structure validation

The demos can be used individually for focused testing or collectively for comprehensive rule validation across different contexts and scopes.
