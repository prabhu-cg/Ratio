import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function FinalCtaSection() {
  return (
    <Section tone="brand">
      <Container width="narrow" className="flex flex-col items-center gap-5 text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-text-inverse sm:text-4xl">
          Find your colour balance.
        </h2>
        <p className="max-w-md text-base text-text-inverse/80">
          No sign-up to start, no card to enter, no palette to hand over. Open it and design.
        </p>
        <Button href="/app" variant="inverse" size="lg" withArrow>
          Open RATIO — Free
        </Button>
      </Container>
    </Section>
  );
}
