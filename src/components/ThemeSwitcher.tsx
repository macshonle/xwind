'use client';

import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="theme-transition bg-background-secondary border-border rounded-[var(--radius-lg)] border-2 shadow-[var(--shadow-lg)] p-4 min-w-[280px]">
        <h3 className="text-foreground font-[family-name:var(--font-display)] font-semibold text-lg mb-3">
          Choose Theme
        </h3>
        <div className="space-y-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`
                theme-transition w-full text-left px-4 py-3 rounded-[var(--radius-md)]
                border-2 hover:scale-[1.02] active:scale-[0.98]
                ${
                  currentTheme.id === theme.id
                    ? 'bg-primary text-white border-primary-dark shadow-[var(--shadow-md)]'
                    : 'bg-background border-border hover:border-primary'
                }
              `}
            >
              <div className="font-medium">{theme.name}</div>
              <div
                className={`text-sm mt-1 ${
                  currentTheme.id === theme.id
                    ? 'text-white/80'
                    : 'text-foreground-muted'
                }`}
              >
                {theme.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
