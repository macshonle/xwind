'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes } from '@/lib/themes';

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Initialize theme from localStorage
    if (typeof window !== 'undefined') {
      const savedThemeId = localStorage.getItem('theme-id');
      if (savedThemeId) {
        const theme = themes.find(t => t.id === savedThemeId);
        if (theme) {
          return theme;
        }
      }
    }
    return themes[0];
  });

  useEffect(() => {
    // Apply theme CSS variables to document root
    if (typeof window !== 'undefined' && document?.documentElement) {
      const root = document.documentElement;
      Object.entries(currentTheme.cssVars).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    }
  }, [currentTheme]);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-id', themeId);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
