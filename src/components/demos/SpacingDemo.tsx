'use client';

export function SpacingDemo() {
  const spacingValues = [
    { name: 'xs', value: 'var(--spacing-xs)', multiplier: '1x' },
    { name: 'sm', value: 'var(--spacing-sm)', multiplier: '2x' },
    { name: 'md', value: 'var(--spacing-md)', multiplier: '4x' },
    { name: 'lg', value: 'var(--spacing-lg)', multiplier: '8x' },
    { name: 'xl', value: 'var(--spacing-xl)', multiplier: '16x' },
    { name: '2xl', value: 'var(--spacing-2xl)', multiplier: '24x' },
  ];

  const radiusValues = [
    { name: 'sm', class: 'rounded-[var(--radius-sm)]' },
    { name: 'md', class: 'rounded-[var(--radius-md)]' },
    { name: 'lg', class: 'rounded-[var(--radius-lg)]' },
    { name: 'xl', class: 'rounded-[var(--radius-xl)]' },
    { name: '2xl', class: 'rounded-[var(--radius-2xl)]' },
    { name: 'full', class: 'rounded-full' },
  ];

  return (
    <div className="space-y-12">
      {/* Spacing Scale */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Custom Spacing Scale
        </h3>
        <p className="text-foreground-muted mb-6">
          Each theme defines a custom space-unit, and all spacing is calculated as multiples of that base unit.
        </p>
        <div className="bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border">
          {spacingValues.map((spacing) => (
            <div key={spacing.name} className="mb-6 last:mb-0">
              <div className="flex items-center gap-4 mb-2">
                <code className="font-[family-name:var(--font-mono)] text-accent text-sm">
                  {spacing.name}
                </code>
                <span className="text-foreground-muted text-sm">
                  {spacing.multiplier} of space-unit
                </span>
              </div>
              <div
                className="bg-primary h-8 theme-transition rounded-[var(--radius-sm)]"
                style={{ width: spacing.value }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Custom Border Radius
        </h3>
        <p className="text-foreground-muted mb-6">
          Themes can define their own radius scale - from sharp edges to fully rounded.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {radiusValues.map((radius) => (
            <div key={radius.name} className="text-center">
              <div
                className={`theme-transition bg-secondary ${radius.class} h-24 w-full mb-3 shadow-[var(--shadow-md)]`}
              />
              <code className="font-[family-name:var(--font-mono)] text-foreground text-sm">
                {radius.name}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Shadow System */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Custom Shadow System
        </h3>
        <p className="text-foreground-muted mb-6">
          Each theme defines custom shadows - from subtle to dramatic effects.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border shadow-[var(--shadow-sm)] theme-transition">
            <h4 className="text-foreground font-[family-name:var(--font-display)] font-semibold mb-2">
              Small Shadow
            </h4>
            <code className="font-[family-name:var(--font-mono)] text-accent text-xs">
              shadow-sm
            </code>
          </div>
          <div className="bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border shadow-[var(--shadow-md)] theme-transition">
            <h4 className="text-foreground font-[family-name:var(--font-display)] font-semibold mb-2">
              Medium Shadow
            </h4>
            <code className="font-[family-name:var(--font-mono)] text-accent text-xs">
              shadow-md
            </code>
          </div>
          <div className="bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border shadow-[var(--shadow-lg)] theme-transition">
            <h4 className="text-foreground font-[family-name:var(--font-display)] font-semibold mb-2">
              Large Shadow
            </h4>
            <code className="font-[family-name:var(--font-mono)] text-accent text-xs">
              shadow-lg
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
