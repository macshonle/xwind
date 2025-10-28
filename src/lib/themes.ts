export type Theme = {
  id: string;
  name: string;
  description: string;
  cssVars: {
    // Colors
    primary: string;
    'primary-dark': string;
    secondary: string;
    'secondary-dark': string;
    accent: string;
    'accent-dark': string;
    background: string;
    'background-secondary': string;
    foreground: string;
    'foreground-muted': string;
    border: string;

    // Typography
    'font-primary': string;
    'font-display': string;
    'font-mono': string;

    // Spacing & Sizing
    'space-unit': string;
    'radius-sm': string;
    'radius-md': string;
    'radius-lg': string;

    // Shadows
    'shadow-sm': string;
    'shadow-md': string;
    'shadow-lg': string;
  };
};

export const themes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean and refined with subtle colors and generous spacing',
    cssVars: {
      // Colors - Soft blues and grays
      primary: '#3b82f6',
      'primary-dark': '#2563eb',
      secondary: '#8b5cf6',
      'secondary-dark': '#7c3aed',
      accent: '#06b6d4',
      'accent-dark': '#0891b2',
      background: '#ffffff',
      'background-secondary': '#f8fafc',
      foreground: '#0f172a',
      'foreground-muted': '#64748b',
      border: '#e2e8f0',

      // Typography
      'font-primary': 'Inter, system-ui, sans-serif',
      'font-display': 'Inter, system-ui, sans-serif',
      'font-mono': 'JetBrains Mono, monospace',

      // Spacing
      'space-unit': '0.25rem',
      'radius-sm': '0.375rem',
      'radius-md': '0.5rem',
      'radius-lg': '1rem',

      // Shadows
      'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },
  {
    id: 'brutalist',
    name: 'Neo-Brutalist',
    description: 'Bold, high-contrast design with sharp edges and stark typography',
    cssVars: {
      // Colors - Black, white, and bold accents
      primary: '#000000',
      'primary-dark': '#1a1a1a',
      secondary: '#ff0000',
      'secondary-dark': '#cc0000',
      accent: '#ffff00',
      'accent-dark': '#cccc00',
      background: '#ffffff',
      'background-secondary': '#f5f5f5',
      foreground: '#000000',
      'foreground-muted': '#666666',
      border: '#000000',

      // Typography
      'font-primary': 'Space Grotesk, sans-serif',
      'font-display': 'Space Grotesk, sans-serif',
      'font-mono': 'Space Mono, monospace',

      // Spacing
      'space-unit': '0.5rem',
      'radius-sm': '0',
      'radius-md': '0',
      'radius-lg': '0',

      // Shadows
      'shadow-sm': '4px 4px 0px 0px #000000',
      'shadow-md': '8px 8px 0px 0px #000000',
      'shadow-lg': '12px 12px 0px 0px #000000',
    },
  },
  {
    id: 'elegant',
    name: 'Elegant Serif',
    description: 'Sophisticated design with serif typography and muted earth tones',
    cssVars: {
      // Colors - Warm neutrals and muted accents
      primary: '#8b7355',
      'primary-dark': '#6b5444',
      secondary: '#a0826d',
      'secondary-dark': '#8b7355',
      accent: '#d4a574',
      'accent-dark': '#b8935f',
      background: '#faf8f6',
      'background-secondary': '#f1ede8',
      foreground: '#2d2a26',
      'foreground-muted': '#706c66',
      border: '#d9d4cc',

      // Typography
      'font-primary': 'Crimson Pro, Georgia, serif',
      'font-display': 'Playfair Display, Georgia, serif',
      'font-mono': 'IBM Plex Mono, monospace',

      // Spacing
      'space-unit': '0.375rem',
      'radius-sm': '0.25rem',
      'radius-md': '0.375rem',
      'radius-lg': '0.5rem',

      // Shadows
      'shadow-sm': '0 2px 4px 0 rgb(45 42 38 / 0.08)',
      'shadow-md': '0 4px 8px 0 rgb(45 42 38 / 0.12)',
      'shadow-lg': '0 8px 16px 0 rgb(45 42 38 / 0.16)',
    },
  },
  {
    id: 'neon',
    name: 'Cyberpunk Neon',
    description: 'Futuristic dark theme with glowing neon accents and bold colors',
    cssVars: {
      // Colors - Dark backgrounds with neon accents
      primary: '#ff00ff',
      'primary-dark': '#cc00cc',
      secondary: '#00ffff',
      'secondary-dark': '#00cccc',
      accent: '#39ff14',
      'accent-dark': '#2ecc10',
      background: '#0a0a0f',
      'background-secondary': '#1a1a2e',
      foreground: '#e0e0ff',
      'foreground-muted': '#8888aa',
      border: '#ff00ff',

      // Typography
      'font-primary': 'Orbitron, sans-serif',
      'font-display': 'Orbitron, sans-serif',
      'font-mono': 'Fira Code, monospace',

      // Spacing
      'space-unit': '0.25rem',
      'radius-sm': '0.125rem',
      'radius-md': '0.25rem',
      'radius-lg': '0.5rem',

      // Shadows
      'shadow-sm': '0 0 10px rgb(255 0 255 / 0.5)',
      'shadow-md': '0 0 20px rgb(255 0 255 / 0.6)',
      'shadow-lg': '0 0 40px rgb(255 0 255 / 0.8)',
    },
  },
  {
    id: 'earth',
    name: 'Organic Earth',
    description: 'Natural color palette inspired by earth tones with organic curves',
    cssVars: {
      // Colors - Natural earth tones
      primary: '#2d5016',
      'primary-dark': '#1f3810',
      secondary: '#8b4513',
      'secondary-dark': '#6b3410',
      accent: '#d4a574',
      'accent-dark': '#b8935f',
      background: '#f5f0e8',
      'background-secondary': '#ebe3d5',
      foreground: '#2c2416',
      'foreground-muted': '#5c5446',
      border: '#c4b5a0',

      // Typography
      'font-primary': 'Nunito, sans-serif',
      'font-display': 'Quicksand, sans-serif',
      'font-mono': 'Source Code Pro, monospace',

      // Spacing
      'space-unit': '0.3rem',
      'radius-sm': '0.75rem',
      'radius-md': '1.25rem',
      'radius-lg': '2rem',

      // Shadows
      'shadow-sm': '0 2px 8px 0 rgb(44 36 22 / 0.1)',
      'shadow-md': '0 4px 12px 0 rgb(44 36 22 / 0.15)',
      'shadow-lg': '0 8px 24px 0 rgb(44 36 22 / 0.2)',
    },
  },
];

export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id);
}
