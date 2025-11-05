'use client';

import { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance. Load times under 100ms guaranteed.'
    },
    {
      icon: '🔒',
      title: 'Secure by Default',
      description: 'Enterprise-grade security with end-to-end encryption and SOC 2 compliance.'
    },
    {
      icon: '📊',
      title: 'Powerful Analytics',
      description: 'Deep insights into your data with real-time dashboards and reporting.'
    },
    {
      icon: '🌍',
      title: 'Global Scale',
      description: 'Deployed across 6 continents with 99.99% uptime SLA.'
    },
    {
      icon: '🔄',
      title: 'Easy Integration',
      description: 'Connect with your existing tools in minutes with our REST API and webhooks.'
    },
    {
      icon: '💬',
      title: '24/7 Support',
      description: 'Expert support team available around the clock to help you succeed.'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO at TechStartup',
      content: 'This platform transformed how we work. We saw a 300% increase in productivity within the first month.',
      avatar: 'SC'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Engineering Lead at DataCorp',
      content: 'The best tool we have ever used. Integration was seamless and the support team is incredible.',
      avatar: 'MR'
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager at InnovateCo',
      content: 'Finally, a solution that actually delivers on its promises. Our team loves it!',
      avatar: 'EW'
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 29,
      description: 'Perfect for individuals and small teams',
      features: [
        '5 team members',
        '10 GB storage',
        'Basic analytics',
        'Email support',
        'API access',
      ],
      highlighted: false,
    },
    {
      name: 'Professional',
      price: 79,
      description: 'For growing teams with advanced needs',
      features: [
        '25 team members',
        '100 GB storage',
        'Advanced analytics',
        'Priority support',
        'API access',
        'Custom integrations',
        'SSO/SAML',
      ],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'For large organizations',
      features: [
        'Unlimited team members',
        'Unlimited storage',
        'Advanced analytics',
        '24/7 dedicated support',
        'API access',
        'Custom integrations',
        'SSO/SAML',
        'Custom contracts',
        'Training & onboarding',
      ],
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background-secondary border-b-2 border-border sticky top-0 z-50" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-foreground font-[family-name:var(--font-display)] text-2xl font-bold">
                LaunchPad
              </h1>
              <ul className="hidden md:flex items-center gap-6">
                <li><a href="#features" className="text-foreground-muted hover:text-foreground theme-transition font-semibold">Features</a></li>
                <li><a href="#pricing" className="text-foreground-muted hover:text-foreground theme-transition font-semibold">Pricing</a></li>
                <li><a href="#testimonials" className="text-foreground-muted hover:text-foreground theme-transition font-semibold">Testimonials</a></li>
              </ul>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-foreground font-semibold hover:text-accent theme-transition
                               focus:outline-none focus:ring-2 focus:ring-accent rounded px-3 py-2">
                Sign In
              </button>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-[var(--radius-md)]
                               font-semibold theme-transition hover:opacity-90
                               focus:outline-none focus:ring-2 focus:ring-accent">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 id="hero-heading" className="text-foreground font-[family-name:var(--font-display)]
                                            text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Build Better Products,
              <span className="text-accent"> Faster</span>
            </h2>
            <p className="text-foreground-muted text-xl md:text-2xl mb-8 leading-relaxed">
              The all-in-one platform that helps teams ship features 10x faster with built-in collaboration,
              analytics, and automation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground
                               rounded-[var(--radius-lg)] font-[family-name:var(--font-display)]
                               text-lg font-bold theme-transition hover:opacity-90
                               focus:outline-none focus:ring-2 focus:ring-accent shadow-[var(--shadow-lg)]">
                Start Free Trial
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-background-secondary border-2 border-border
                               text-foreground rounded-[var(--radius-lg)]
                               font-[family-name:var(--font-display)] text-lg font-bold
                               theme-transition hover:border-accent
                               focus:outline-none focus:ring-2 focus:ring-accent">
                Watch Demo
              </button>
            </div>
            <p className="text-foreground-muted text-sm mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-background-secondary border-2 border-border rounded-[var(--radius-xl)]
                          overflow-hidden shadow-[var(--shadow-lg)] aspect-video
                          flex items-center justify-center">
              <span className="text-foreground-muted text-6xl" role="img" aria-label="Product screenshot">
                📱
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background-secondary" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-foreground font-[family-name:var(--font-display)]
                                                text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-foreground-muted text-xl max-w-2xl mx-auto">
              Powerful features designed to help your team collaborate and deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <article key={index}
                       className="bg-background border-2 border-border rounded-[var(--radius-lg)]
                                p-8 theme-transition hover:shadow-[var(--shadow-md)]
                                hover:border-accent">
                <div className="text-5xl mb-4" role="img" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="text-foreground font-[family-name:var(--font-display)]
                             text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground-muted leading-relaxed">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="testimonials-heading" className="text-foreground font-[family-name:var(--font-display)]
                                                     text-4xl md:text-5xl font-bold mb-4">
              Loved by Thousands
            </h2>
            <p className="text-foreground-muted text-xl">
              See what our customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <article key={index}
                       className="bg-background-secondary border-2 border-border rounded-[var(--radius-lg)]
                                p-8 theme-transition hover:shadow-[var(--shadow-md)]">
                <p className="text-foreground text-lg mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full
                                flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">{testimonial.name}</p>
                    <p className="text-foreground-muted text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background-secondary" aria-labelledby="pricing-heading">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 id="pricing-heading" className="text-foreground font-[family-name:var(--font-display)]
                                               text-4xl md:text-5xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-foreground-muted text-xl">
              Choose the plan that fits your needs. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <article key={index}
                       className={`bg-background border-2 rounded-[var(--radius-lg)] p-8
                                 theme-transition relative
                                 ${plan.highlighted
                                   ? 'border-accent shadow-[var(--shadow-lg)] scale-105'
                                   : 'border-border hover:shadow-[var(--shadow-md)]'
                                 }`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1
                                bg-accent text-background rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-foreground font-[family-name:var(--font-display)]
                               text-2xl font-bold mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-foreground-muted text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-2">
                    {plan.price ? (
                      <>
                        <span className="text-foreground font-[family-name:var(--font-display)]
                                       text-5xl font-bold">
                          ${plan.price}
                        </span>
                        <span className="text-foreground-muted">/month</span>
                      </>
                    ) : (
                      <span className="text-foreground font-[family-name:var(--font-display)]
                                     text-3xl font-bold">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8" role="list">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-accent mt-1" aria-hidden="true">✓</span>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-[var(--radius-md)] font-semibold
                                  theme-transition focus:outline-none focus:ring-2 focus:ring-accent
                                  ${plan.highlighted
                                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                                    : 'bg-background-secondary border-2 border-border text-foreground hover:border-accent'
                                  }`}>
                  {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20" aria-labelledby="newsletter-heading">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-[var(--radius-xl)]
                        p-12 text-center shadow-[var(--shadow-lg)]">
            <h2 id="newsletter-heading" className="font-[family-name:var(--font-display)]
                                                  text-3xl md:text-4xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Get the latest product updates, tips, and exclusive offers delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="bg-background-secondary text-foreground rounded-[var(--radius-lg)]
                            py-4 px-6 inline-flex items-center gap-2">
                <span className="text-2xl" role="img" aria-label="Success">✓</span>
                <span className="font-semibold">Thanks for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  type="email"
                  id="newsletter-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 bg-background text-foreground
                           rounded-[var(--radius-md)] border-2 border-transparent
                           focus:outline-none focus:border-accent"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-background-secondary text-foreground
                           rounded-[var(--radius-md)] font-semibold
                           hover:bg-background focus:outline-none focus:ring-2 focus:ring-background">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-secondary border-t-2 border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-foreground font-[family-name:var(--font-display)]
                           text-xl font-bold mb-4">
                LaunchPad
              </h3>
              <p className="text-foreground-muted">
                Building the future of team collaboration.
              </p>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Features</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Pricing</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Security</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">About</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Blog</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Careers</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Privacy</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Terms</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Cookie Policy</a></li>
                <li><a href="#" className="text-foreground-muted hover:text-foreground theme-transition">Licenses</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center">
            <p className="text-foreground-muted">
              © 2025 LaunchPad. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
