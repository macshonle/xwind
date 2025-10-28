# Tailwind CSS Advanced Demo

A comprehensive demonstration showcasing the full customization power of Tailwind CSS v4. This project proves that **not all Tailwind apps need to look the same** by implementing dynamic theme switching with completely different design systems.

## Features

### 🎨 Five Distinct Theme Presets

1. **Modern Minimal** - Clean, refined design with subtle blues and generous spacing
2. **Neo-Brutalist** - Bold, high-contrast with stark typography and sharp edges
3. **Elegant Serif** - Sophisticated design with serif fonts and muted earth tones
4. **Cyberpunk Neon** - Futuristic dark theme with glowing neon accents
5. **Organic Earth** - Natural color palette with organic curves and warm tones

### 🚀 Advanced Tailwind CSS v4 Features

- **Custom Color Systems** - Semantic color tokens that adapt per theme
- **Typography Systems** - Different font stacks for each theme (Inter, Space Grotesk, Playfair Display, Orbitron, Nunito)
- **Custom Spacing Scales** - Theme-specific base units with calculated multipliers
- **Dynamic Border Radius** - From sharp brutalist edges to fully rounded organic shapes
- **Custom Shadow Systems** - Subtle to dramatic effects, including neon glows
- **Custom Animations** - Keyframe animations defined in theme configuration
- **Design Tokens** - Using CSS custom properties with Tailwind v4's `@theme` directive

### 📦 Technical Stack

- **Next.js 16** - Latest React framework with App Router
- **React 19** - Latest React features
- **Tailwind CSS v4** - Using the new `@theme` directive approach
- **TypeScript** - Full type safety
- **CSS Custom Properties** - Dynamic theme switching without page reload

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── page.tsx            # Main demo page
│   └── globals.css         # Tailwind config & theme definitions
├── components/
│   ├── ThemeSwitcher.tsx   # Theme selection UI
│   ├── DemoSection.tsx     # Section wrapper component
│   └── demos/              # Feature demonstration components
│       ├── TypographyDemo.tsx
│       ├── ColorDemo.tsx
│       ├── SpacingDemo.tsx
│       ├── AnimationDemo.tsx
│       └── ComponentsDemo.tsx
├── contexts/
│   └── ThemeContext.tsx    # Theme state management
└── lib/
    └── themes.ts           # Theme definitions & configurations
```

## How It Works

### Theme System

Each theme is defined in `src/lib/themes.ts` as a TypeScript object containing CSS custom properties:

```typescript
{
  id: 'modern',
  name: 'Modern Minimal',
  description: '...',
  cssVars: {
    primary: '#3b82f6',
    'font-primary': 'Inter, system-ui, sans-serif',
    'space-unit': '0.25rem',
    'radius-md': '0.5rem',
    // ... and more
  }
}
```

### Dynamic Application

The `ThemeContext` applies these CSS variables to `:root`:

```typescript
Object.entries(theme.cssVars).forEach(([key, value]) => {
  document.documentElement.style.setProperty(`--${key}`, value);
});
```

### Tailwind Integration

In `globals.css`, the `@theme` directive maps CSS variables to Tailwind utilities:

```css
@theme inline {
  --color-primary: var(--primary);
  --font-family-primary: var(--font-primary);
  --spacing-md: calc(var(--space-unit) * 4);
  /* ... */
}
```

Components use these tokens via Tailwind classes:

```jsx
<div className="bg-primary text-white rounded-[var(--radius-md)]">
  <h1 className="font-[family-name:var(--font-display)]">
    Theme-aware heading
  </h1>
</div>
```

## Key Demonstrations

### 1. Typography System
Each theme uses different font families to create unique visual identities. The demo shows display fonts, body text, monospace code fonts, and text effects.

### 2. Color Palette
Custom semantic color tokens (primary, secondary, accent, neutrals) that completely change per theme, with examples of color combinations.

### 3. Spacing & Design Tokens
Demonstrates custom spacing scales, border radius values, and shadow systems that adapt to each theme's aesthetic.

### 4. Animations & Transitions
Custom keyframe animations (fade-in, slide-up, bounce-in) and smooth hover effects defined in the theme configuration.

### 5. Component Patterns
Reusable UI components (cards, buttons, forms, badges) that automatically inherit theme values.

## Customization Guide

### Adding a New Theme

1. Define the theme in `src/lib/themes.ts`:

```typescript
{
  id: 'your-theme',
  name: 'Your Theme Name',
  description: 'Theme description',
  cssVars: {
    // Define all CSS variables
  }
}
```

2. Import fonts in `globals.css` if needed
3. The theme will automatically appear in the theme switcher

### Modifying Existing Themes

Edit the `cssVars` object in `src/lib/themes.ts` for any theme. Changes apply instantly when that theme is selected.

### Creating Custom Design Tokens

Add new tokens in the `@theme` directive in `globals.css`:

```css
@theme inline {
  --your-custom-token: value;
}
```

Then use in components:

```jsx
<div className="[property:var(--your-custom-token)]">
```

## Learn More

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Tailwind v4 @theme Directive](https://tailwindcss.com/blog/tailwindcss-v4-alpha)

## License

MIT
