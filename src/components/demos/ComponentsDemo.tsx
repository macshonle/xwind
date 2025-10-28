'use client';

export function ComponentsDemo() {
  return (
    <div className="space-y-12">
      {/* Cards */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Custom Card Components
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="theme-transition bg-background-secondary rounded-[var(--radius-lg)] p-6 border-2 border-border hover:border-primary hover:scale-[1.02] cursor-pointer shadow-[var(--shadow-md)]">
            <div className="w-12 h-12 bg-primary rounded-[var(--radius-md)] flex items-center justify-center text-white text-2xl mb-4">
              🎨
            </div>
            <h4 className="text-foreground font-[family-name:var(--font-display)] text-xl font-semibold mb-2">
              Design System
            </h4>
            <p className="text-foreground-muted">
              Each theme provides a complete design system with colors, typography, and spacing.
            </p>
          </div>

          <div className="theme-transition bg-background-secondary rounded-[var(--radius-lg)] p-6 border-2 border-border hover:border-secondary hover:scale-[1.02] cursor-pointer shadow-[var(--shadow-md)]">
            <div className="w-12 h-12 bg-secondary rounded-[var(--radius-md)] flex items-center justify-center text-white text-2xl mb-4">
              ⚡
            </div>
            <h4 className="text-foreground font-[family-name:var(--font-display)] text-xl font-semibold mb-2">
              Custom Utilities
            </h4>
            <p className="text-foreground-muted">
              Define custom utility classes and design tokens in your Tailwind configuration.
            </p>
          </div>

          <div className="theme-transition bg-background-secondary rounded-[var(--radius-lg)] p-6 border-2 border-border hover:border-accent hover:scale-[1.02] cursor-pointer shadow-[var(--shadow-md)]">
            <div className="w-12 h-12 bg-accent rounded-[var(--radius-md)] flex items-center justify-center text-white text-2xl mb-4">
              🚀
            </div>
            <h4 className="text-foreground font-[family-name:var(--font-display)] text-xl font-semibold mb-2">
              Dynamic Themes
            </h4>
            <p className="text-foreground-muted">
              Switch between themes on the fly using CSS custom properties.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Button Variants
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-primary text-white px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:bg-primary-dark theme-transition shadow-[var(--shadow-md)]">
            Primary Button
          </button>
          <button className="bg-secondary text-white px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:bg-secondary-dark theme-transition shadow-[var(--shadow-md)]">
            Secondary Button
          </button>
          <button className="bg-transparent border-2 border-primary text-primary px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:bg-primary hover:text-white theme-transition">
            Outline Button
          </button>
          <button className="bg-background-secondary text-foreground px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:bg-foreground-muted hover:text-background theme-transition border-2 border-border">
            Ghost Button
          </button>
        </div>
      </div>

      {/* Forms */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Form Elements
        </h3>
        <div className="bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-foreground font-semibold mb-2">
                Input Field
              </label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-4 py-3 rounded-[var(--radius-md)] border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none theme-transition"
              />
            </div>
            <div>
              <label className="block text-foreground font-semibold mb-2">
                Textarea
              </label>
              <textarea
                placeholder="Enter message..."
                rows={4}
                className="w-full px-4 py-3 rounded-[var(--radius-md)] border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none theme-transition resize-none"
              />
            </div>
            <div>
              <label className="block text-foreground font-semibold mb-2">
                Select Dropdown
              </label>
              <select className="w-full px-4 py-3 rounded-[var(--radius-md)] border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none theme-transition">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Badges and Pills */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Badges & Pills
        </h3>
        <div className="flex flex-wrap gap-3">
          <span className="bg-primary text-white px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold">
            Primary Badge
          </span>
          <span className="bg-secondary text-white px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold">
            Secondary Badge
          </span>
          <span className="bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold">
            Accent Pill
          </span>
          <span className="bg-background-secondary text-foreground px-4 py-2 rounded-full text-sm font-semibold border-2 border-border">
            Outlined Pill
          </span>
        </div>
      </div>
    </div>
  );
}
