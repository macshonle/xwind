'use client';

export function ColorDemo() {
  const colorGroups = [
    {
      name: 'Primary',
      colors: [
        { name: 'Primary', class: 'bg-primary', textClass: 'text-white' },
        { name: 'Primary Dark', class: 'bg-primary-dark', textClass: 'text-white' },
      ],
    },
    {
      name: 'Secondary',
      colors: [
        { name: 'Secondary', class: 'bg-secondary', textClass: 'text-white' },
        { name: 'Secondary Dark', class: 'bg-secondary-dark', textClass: 'text-white' },
      ],
    },
    {
      name: 'Accent',
      colors: [
        { name: 'Accent', class: 'bg-accent', textClass: 'text-white' },
        { name: 'Accent Dark', class: 'bg-accent-dark', textClass: 'text-white' },
      ],
    },
    {
      name: 'Neutrals',
      colors: [
        { name: 'Background', class: 'bg-background border-2 border-border', textClass: 'text-foreground' },
        { name: 'Background Secondary', class: 'bg-background-secondary', textClass: 'text-foreground' },
        { name: 'Foreground', class: 'bg-foreground', textClass: 'text-background' },
        { name: 'Foreground Muted', class: 'bg-foreground-muted', textClass: 'text-background' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {colorGroups.map((group) => (
        <div key={group.name}>
          <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-4">
            {group.name} Colors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {group.colors.map((color) => (
              <div
                key={color.name}
                className={`theme-transition ${color.class} ${color.textClass} rounded-[var(--radius-lg)] p-6 flex flex-col justify-center items-center text-center min-h-[140px] shadow-[var(--shadow-md)]`}
              >
                <div className="font-[family-name:var(--font-display)] font-semibold text-lg">
                  {color.name}
                </div>
                <div className="text-sm opacity-80 mt-2 font-[family-name:var(--font-mono)]">
                  {color.class.replace('bg-', '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Color Combinations */}
      <div className="mt-12">
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-4">
          Color Combinations
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="theme-transition bg-primary rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)]">
            <h4 className="text-white font-[family-name:var(--font-display)] text-2xl font-bold mb-2">
              Primary Action
            </h4>
            <p className="text-white/80 mb-4">
              Main call-to-action styling
            </p>
            <button className="bg-white text-primary px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:scale-105 theme-transition">
              Click Me
            </button>
          </div>

          <div className="theme-transition bg-secondary rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)]">
            <h4 className="text-white font-[family-name:var(--font-display)] text-2xl font-bold mb-2">
              Secondary Style
            </h4>
            <p className="text-white/80 mb-4">
              Alternative color scheme
            </p>
            <button className="bg-white text-secondary px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:scale-105 theme-transition">
              Learn More
            </button>
          </div>

          <div className="theme-transition bg-accent rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)]">
            <h4 className="text-white font-[family-name:var(--font-display)] text-2xl font-bold mb-2">
              Accent Highlights
            </h4>
            <p className="text-white/80 mb-4">
              For emphasis and highlights
            </p>
            <button className="bg-white text-accent px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:scale-105 theme-transition">
              Discover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
