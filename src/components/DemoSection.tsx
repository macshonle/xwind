'use client';

import { ReactNode } from 'react';

type DemoSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
  colorScheme?: 'default' | 'secondary' | 'accent';
};

export function DemoSection({ title, description, children, colorScheme = 'default' }: DemoSectionProps) {
  const bgColor = {
    default: 'bg-background',
    secondary: 'bg-background-secondary',
    accent: 'bg-primary/5',
  }[colorScheme];

  return (
    <section className={`${bgColor} theme-transition py-16 px-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-foreground font-[family-name:var(--font-display)] text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-foreground-muted text-lg max-w-3xl mx-auto">
            {description}
          </p>
        </div>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </section>
  );
}
