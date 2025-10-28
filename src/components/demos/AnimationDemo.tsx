'use client';

import { useState } from 'react';

export function AnimationDemo() {
  const [trigger, setTrigger] = useState(0);

  const animations = [
    { name: 'Fade In', class: 'animate-[fade-in_0.5s_ease-in]' },
    { name: 'Slide Up', class: 'animate-[slide-up_0.3s_ease-out]' },
    { name: 'Slide In', class: 'animate-[slide-in_0.4s_ease-out]' },
    { name: 'Bounce In', class: 'animate-[bounce-in_0.6s_cubic-bezier(0.68,-0.55,0.265,1.55)]' },
  ];

  return (
    <div className="space-y-12">
      {/* Custom Animations */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Custom Animation Keyframes
        </h3>
        <p className="text-foreground-muted mb-6">
          Tailwind v4 allows defining custom animations in the theme configuration.
        </p>

        <div className="mb-6">
          <button
            onClick={() => setTrigger(prev => prev + 1)}
            className="bg-primary text-white px-6 py-3 rounded-[var(--radius-md)] font-semibold hover:bg-primary-dark theme-transition shadow-[var(--shadow-md)]"
          >
            Replay Animations
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {animations.map((anim) => (
            <div
              key={anim.name}
              className={`bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border text-center ${anim.class}`}
              style={{ animationIterationCount: trigger }}
            >
              <div className="text-4xl mb-3">✨</div>
              <h4 className="text-foreground font-[family-name:var(--font-display)] font-semibold">
                {anim.name}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Hover Effects */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Interactive Hover Effects
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <button className="bg-primary text-white px-8 py-6 rounded-[var(--radius-lg)] font-semibold hover:scale-110 theme-transition shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]">
            <div className="text-lg">Scale Up</div>
            <div className="text-sm opacity-80 mt-1">hover:scale-110</div>
          </button>

          <button className="bg-secondary text-white px-8 py-6 rounded-[var(--radius-lg)] font-semibold hover:rotate-3 theme-transition shadow-[var(--shadow-md)]">
            <div className="text-lg">Rotate</div>
            <div className="text-sm opacity-80 mt-1">hover:rotate-3</div>
          </button>

          <button className="bg-accent text-white px-8 py-6 rounded-[var(--radius-lg)] font-semibold hover:-translate-y-2 theme-transition shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]">
            <div className="text-lg">Lift Up</div>
            <div className="text-sm opacity-80 mt-1">hover:-translate-y-2</div>
          </button>
        </div>
      </div>

      {/* Transition Effects */}
      <div>
        <h3 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold mb-6">
          Smooth Transitions
        </h3>
        <div className="bg-background-secondary rounded-[var(--radius-lg)] p-8 border-2 border-border">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group">
              <h4 className="text-foreground font-semibold mb-4">Color Transition</h4>
              <div className="bg-primary text-white p-6 rounded-[var(--radius-md)] theme-transition group-hover:bg-secondary cursor-pointer">
                Hover to change color
              </div>
            </div>

            <div className="group">
              <h4 className="text-foreground font-semibold mb-4">Width Transition</h4>
              <div className="bg-accent text-white p-6 rounded-[var(--radius-md)] theme-transition w-1/2 group-hover:w-full cursor-pointer">
                Hover to expand
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
