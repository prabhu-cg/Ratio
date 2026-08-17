import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

const BENEFITS = [
  { title: 'Free', description: 'No paid tiers, no trial period. RATIO is free to use.' },
  { title: 'Browser-based', description: 'Nothing to install. Open a tab and start working.' },
  { title: 'No account required', description: 'Use every part of RATIO without signing up.' },
  { title: 'No AI required', description: 'Deliberate, designer-led decisions — not generated for you.' },
  { title: 'Fast', description: 'A lightweight tool that responds instantly, not a heavy app.' },
  { title: 'Privacy-friendly', description: 'Your palettes stay in your browser.' },
];

export function BenefitsSection() {
  return (
    <Section tone="page">
      <Container width="wide">
        <div className="max-w-lg">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            Built for designers
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] text-text-heading sm:text-4xl">
            A tool that stays out of your way
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border-default bg-border-default sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="bg-surface-card p-6">
              <h3 className="font-display text-base font-bold text-text-heading">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
