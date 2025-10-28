'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, themes } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-50">
      {isExpanded ? (
        <div className="theme-transition bg-background-secondary border-border rounded-[var(--radius-lg)] border-2 shadow-[var(--shadow-lg)] p-4 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-foreground font-[family-name:var(--font-display)] font-semibold text-lg">
              Choose Theme
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-foreground-muted hover:text-foreground theme-transition px-2 py-1 hover:bg-background rounded-[var(--radius-sm)]"
              aria-label="Collapse theme selector"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
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
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="theme-transition bg-background-secondary border-border border-2 rounded-[var(--radius-md)] shadow-[var(--shadow-md)] px-4 py-2 hover:scale-[1.05] active:scale-[0.95] hover:border-primary"
          aria-label="Open theme selector"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 8v8m-4-4h8"></path>
            </svg>
            <div className="flex flex-col items-start">
              <span className="text-foreground-muted text-xs leading-tight">Theme</span>
              <span className="text-foreground font-medium text-sm leading-tight">{currentTheme.name}</span>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
