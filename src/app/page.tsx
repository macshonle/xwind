import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { DemoSection } from "@/components/DemoSection";
import { TypographyDemo } from "@/components/demos/TypographyDemo";
import { ColorDemo } from "@/components/demos/ColorDemo";
import { SpacingDemo } from "@/components/demos/SpacingDemo";
import { AnimationDemo } from "@/components/demos/AnimationDemo";
import { ComponentsDemo } from "@/components/demos/ComponentsDemo";

export default function Home() {
  return (
    <div className="min-h-screen">
      <ThemeSwitcher />

      {/* Hero Section */}
      <section className="bg-primary text-white py-24 px-6 theme-transition">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-display)] text-6xl md:text-7xl font-black mb-6 animate-[fade-in_0.8s_ease-in]">
            Tailwind CSS
            <br />
            <span className="text-gradient bg-white/90">Advanced Demo</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 animate-[slide-up_0.5s_ease-out]">
            Not all Tailwind apps need to look the same. Explore the full power of customization with dynamic themes, custom design tokens, and advanced configuration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[slide-up_0.7s_ease-out]">
            <a
              href="#typography"
              className="bg-white text-primary px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:scale-105 theme-transition shadow-[var(--shadow-lg)]"
            >
              Explore Features
            </a>
            <a
              href="https://tailwindcss.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-[var(--radius-md)] font-semibold hover:bg-white hover:text-primary theme-transition"
            >
              Read Docs
            </a>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="bg-background-secondary py-16 px-6 theme-transition">
        <div className="max-w-5xl mx-auto">
          <div className="bg-background rounded-[var(--radius-lg)] p-8 md:p-12 border-2 border-border shadow-[var(--shadow-lg)]">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-6">
              Beyond the Defaults
            </h2>
            <div className="space-y-4 text-foreground-muted text-lg">
              <p>
                This demo showcases advanced Tailwind CSS v4 features using the new <code className="text-accent font-[family-name:var(--font-mono)] bg-background-secondary px-2 py-1 rounded">@theme</code> directive approach.
              </p>
              <p>
                Switch between themes using the panel in the top-right corner to see how each design system transforms the entire interface with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Custom color palettes and semantic tokens</li>
                <li>Unique typography systems with web fonts</li>
                <li>Custom spacing scales and sizing systems</li>
                <li>Theme-specific border radius values</li>
                <li>Custom shadow systems (from subtle to dramatic)</li>
                <li>Personalized animation and transition effects</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Sections */}
      <div id="typography">
        <DemoSection
          title="Typography System"
          description="Each theme defines custom font stacks for display, body, and monospace text. Typography creates visual identity."
          colorScheme="default"
        >
          <TypographyDemo />
        </DemoSection>
      </div>

      <DemoSection
        title="Color Palette"
        description="Custom semantic color tokens that adapt to each theme. Colors are more than decoration—they communicate meaning."
        colorScheme="secondary"
      >
        <ColorDemo />
      </DemoSection>

      <DemoSection
        title="Spacing & Design Tokens"
        description="Themes define custom spacing units, border radius values, and shadow systems. Consistent spacing creates rhythm."
        colorScheme="default"
      >
        <SpacingDemo />
      </DemoSection>

      <DemoSection
        title="Animations & Transitions"
        description="Custom keyframe animations and smooth transitions defined in the theme configuration. Motion brings interfaces to life."
        colorScheme="accent"
      >
        <AnimationDemo />
      </DemoSection>

      <DemoSection
        title="Component Patterns"
        description="Building consistent components with theme-aware styling. Components inherit theme values automatically."
        colorScheme="secondary"
      >
        <ComponentsDemo />
      </DemoSection>

      {/* Realistic Demos Section */}
      <section className="bg-background py-20 px-6 theme-transition">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold text-foreground mb-4">
              Realistic Web Demos
            </h2>
            <p className="text-foreground-muted text-xl max-w-3xl mx-auto">
              Explore three comprehensive examples showcasing Tailwind CSS in real-world applications.
              These demos serve as test cases for accessibility, SEO, and best practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a
              href="/demos/ecommerce"
              className="group bg-background-secondary border-2 border-border rounded-[var(--radius-lg)]
                       overflow-hidden hover:shadow-[var(--shadow-lg)] hover:border-accent
                       theme-transition focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <div className="bg-primary/10 h-48 flex items-center justify-center text-6xl">
                🛒
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2
                             group-hover:text-accent theme-transition">
                  E-commerce Catalog
                </h3>
                <p className="text-foreground-muted mb-4">
                  Product grid with filters, search, shopping cart, and responsive design.
                  Demonstrates complex layouts and form interactions.
                </p>
                <span className="text-accent font-semibold group-hover:underline">
                  View Demo →
                </span>
              </div>
            </a>

            <a
              href="/demos/dashboard"
              className="group bg-background-secondary border-2 border-border rounded-[var(--radius-lg)]
                       overflow-hidden hover:shadow-[var(--shadow-lg)] hover:border-accent
                       theme-transition focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <div className="bg-accent/10 h-48 flex items-center justify-center text-6xl">
                📊
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2
                             group-hover:text-accent theme-transition">
                  SaaS Dashboard
                </h3>
                <p className="text-foreground-muted mb-4">
                  Analytics dashboard with data tables, charts, sidebar navigation, and user management.
                  Showcases data visualization patterns.
                </p>
                <span className="text-accent font-semibold group-hover:underline">
                  View Demo →
                </span>
              </div>
            </a>

            <a
              href="/demos/landing"
              className="group bg-background-secondary border-2 border-border rounded-[var(--radius-lg)]
                       overflow-hidden hover:shadow-[var(--shadow-lg)] hover:border-accent
                       theme-transition focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <div className="bg-secondary/10 h-48 flex items-center justify-center text-6xl">
                🚀
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground mb-2
                             group-hover:text-accent theme-transition">
                  Marketing Landing Page
                </h3>
                <p className="text-foreground-muted mb-4">
                  Hero sections, features, pricing tables, testimonials, and newsletter signup.
                  Perfect example of marketing site patterns.
                </p>
                <span className="text-accent font-semibold group-hover:underline">
                  View Demo →
                </span>
              </div>
            </a>
          </div>

          <div className="mt-12 text-center">
            <p className="text-foreground-muted">
              These demos include intentional examples of both good and improvable patterns for testing
              the xrules engine with real-world scenarios.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-6 theme-transition">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold mb-4">
            Ready to Build Your Own?
          </h3>
          <p className="text-background/80 mb-6 max-w-2xl mx-auto">
            This demo is built with Next.js 16 and Tailwind CSS v4. All themes are defined using CSS custom properties and the @theme directive, making them easy to customize and extend.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/80 hover:text-background theme-transition"
            >
              Tailwind CSS
            </a>
            <span className="text-background/40">•</span>
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/80 hover:text-background theme-transition"
            >
              Next.js
            </a>
            <span className="text-background/40">•</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/80 hover:text-background theme-transition"
            >
              View Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
