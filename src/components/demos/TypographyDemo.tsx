'use client';

export function TypographyDemo() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Display Font */}
      <div className="theme-transition bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border">
        <h3 className="text-primary font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Display Typography
        </h3>
        <div className="space-y-4">
          <h1 className="font-[family-name:var(--font-display)] text-foreground text-6xl font-black leading-tight">
            Heading 1
          </h1>
          <h2 className="font-[family-name:var(--font-display)] text-foreground text-5xl font-bold">
            Heading 2
          </h2>
          <h3 className="font-[family-name:var(--font-display)] text-foreground text-4xl font-semibold">
            Heading 3
          </h3>
          <h4 className="font-[family-name:var(--font-display)] text-foreground text-3xl font-medium">
            Heading 4
          </h4>
        </div>
      </div>

      {/* Body Font */}
      <div className="theme-transition bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border">
        <h3 className="text-secondary font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Body Typography
        </h3>
        <div className="space-y-4">
          <p className="font-[family-name:var(--font-primary)] text-foreground text-xl">
            This is large body text with custom font stacks that change per theme.
          </p>
          <p className="font-[family-name:var(--font-primary)] text-foreground text-base">
            Regular body text showcasing the primary font family. Each theme uses a different typeface to create unique visual identities.
          </p>
          <p className="font-[family-name:var(--font-primary)] text-foreground-muted text-sm">
            Small muted text for captions and supporting information.
          </p>
          <p className="font-[family-name:var(--font-mono)] text-accent text-base">
            <code>Monospace font for code snippets</code>
          </p>
        </div>
      </div>

      {/* Text Effects */}
      <div className="theme-transition bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border md:col-span-2">
        <h3 className="text-accent font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Advanced Text Effects
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-gradient text-4xl font-black mb-2">
              Gradient Text
            </h4>
            <p className="text-foreground-muted text-sm">
              CSS gradient clipped to text
            </p>
          </div>
          <div>
            <h4 className="text-primary font-black text-4xl mb-2 neon-glow">
              Neon Glow
            </h4>
            <p className="text-foreground-muted text-sm">
              Text shadow glow effect
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-black text-4xl mb-2 drop-shadow-lg">
              Drop Shadow
            </h4>
            <p className="text-foreground-muted text-sm">
              Enhanced depth with shadows
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
