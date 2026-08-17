import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatioStackVisual } from '@/components/marketing/RatioStackVisual';
import { DEFAULT_PALETTE } from '@/types/palette';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const STEPS = [
  {
    step: '01',
    title: 'Start with your colours',
    body: 'Bring the colours you are already considering — RATIO does not generate them for you.',
  },
  {
    step: '02',
    title: 'Assign the roles',
    body: 'Decide which colour dominates, which supports it, and which is reserved for accents.',
  },
  {
    step: '03',
    title: 'See the balance',
    body: 'The visualisation shows your palette at 60–30–10, so you can judge it at a glance.',
  },
  {
    step: '04',
    title: 'Refine against a live preview',
    body: 'Check how the ratio reads across real interface elements before you commit to it.',
  },
];

export function HowItWorksPage() {
  useDocumentTitle('How it works — RATIO');

  return (
    <>
      <Section spacing="compact">
        <Container width="wide">
          <Badge tone="brand">How it works</Badge>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-tight tracking-[-0.02em] text-text-heading sm:text-5xl">
            A principle borrowed from interior design
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-primary">
            60–30–10 started as a rule for decorating rooms: one dominant colour, one supporting
            colour, and one used sparingly to draw the eye. The same logic keeps interfaces
            legible and calm.
          </p>
        </Container>
      </Section>

      <Section tone="alt">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
            <RatioStackVisual palette={DEFAULT_PALETTE} heightClassName="h-[320px] sm:h-[380px]" />
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-display text-xl font-bold text-text-heading">
                  {DEFAULT_PALETTE.dominant.percentage}% — {DEFAULT_PALETTE.dominant.label}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {DEFAULT_PALETTE.dominant.description} It should feel calm enough to sit behind
                  everything else.
                </p>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-text-heading">
                  {DEFAULT_PALETTE.secondary.percentage}% — {DEFAULT_PALETTE.secondary.label}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {DEFAULT_PALETTE.secondary.description} It gives the interface its shape.
                </p>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-text-heading">
                  {DEFAULT_PALETTE.accent.percentage}% — {DEFAULT_PALETTE.accent.label}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-text-muted">
                  {DEFAULT_PALETTE.accent.description} Used everywhere, it loses its power.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container width="wide">
          <div className="max-w-lg">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              Using RATIO
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] text-text-heading sm:text-4xl">
              From colours to hierarchy in four steps
            </h2>
          </div>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((item) => (
              <li key={item.step} className="flex flex-col gap-3">
                <span className="font-mono text-sm font-semibold text-brand">{item.step}</span>
                <h3 className="font-display text-base font-bold text-text-heading">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="alt" spacing="compact">
        <Container width="wide">
          <div className="flex flex-col items-start gap-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8">
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-text-heading sm:text-3xl">
              Ready to try it with your own colours?
            </h2>
            <Button href="/app" size="lg">
              Open RATIO — Free
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default HowItWorksPage;
