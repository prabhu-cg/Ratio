import { memo } from 'react';
import {
  PreviewButton,
  PreviewCard,
  PreviewHeader,
  PreviewNavigation,
  PreviewSection,
} from '@/components/preview/shared';

const NAV_LINKS = ['Product', 'Pricing', 'Docs'];

const FEATURES = [
  { title: 'Performance', body: 'Built for speed, from first load to last interaction.' },
  { title: 'Collaboration', body: 'Bring your whole team into one shared workspace.' },
  { title: 'Reporting', body: 'Understand what matters with clear, focused summaries.' },
];

const STATS = [
  { value: '12k+', label: 'Active teams' },
  { value: '98%', label: 'Would recommend' },
  { value: '4.9', label: 'Average rating' },
];

export const LandingPreview = memo(function LandingPreview() {
  return (
    <div className="min-h-full bg-[var(--preview-dominant)] text-[var(--preview-on-dominant)]">
      <PreviewHeader brand="Acme" links={NAV_LINKS} cta="Sign in" />

      <PreviewSection className="flex flex-col items-start gap-5">
        <span className="rounded-full bg-[var(--preview-accent)] px-3 py-1 text-xs font-semibold text-[var(--preview-on-accent)]">
          New
        </span>
        <h1 className="max-w-lg text-3xl font-bold leading-tight @lg:text-4xl">
          Design with confidence, ship with clarity
        </h1>
        <p className="max-w-md text-sm leading-relaxed opacity-80 @lg:text-base">
          Everything your team needs to plan, build, and launch — without losing sight of the
          bigger picture.
        </p>
        <div className="flex flex-wrap gap-3">
          <PreviewButton variant="primary">Get started</PreviewButton>
          <PreviewButton variant="ghost">Learn more</PreviewButton>
        </div>
      </PreviewSection>

      <PreviewSection className="grid grid-cols-1 gap-4 @lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <PreviewCard key={feature.title}>
            <h3 className="text-base font-bold">{feature.title}</h3>
            <p className="mt-2 text-sm opacity-80">{feature.body}</p>
          </PreviewCard>
        ))}
      </PreviewSection>

      <PreviewSection className="flex flex-col gap-6 border-t border-[var(--preview-on-dominant)]/10 @lg:flex-row @lg:items-center @lg:justify-between">
        <div>
          <h2 className="text-xl font-bold">Trusted by teams everywhere</h2>
          <p className="mt-2 max-w-sm text-sm opacity-80">
            From five-person startups to global product teams, people ship with a clearer sense
            of hierarchy.
          </p>
        </div>
        <div className="flex gap-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>
      </PreviewSection>

      <footer className="flex flex-col gap-4 bg-[var(--preview-secondary)] px-6 py-8 text-[var(--preview-on-secondary)] @lg:flex-row @lg:items-center @lg:justify-between @lg:px-10">
        <span className="text-sm font-semibold">Acme</span>
        <PreviewNavigation links={['Privacy', 'Terms', 'Contact']} activeIndex={-1} />
      </footer>
    </div>
  );
});
