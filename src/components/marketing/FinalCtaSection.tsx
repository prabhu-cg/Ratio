import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function FinalCtaSection() {
  return (
    <Section tone="alt" spacing="compact">
      <Container width="wide">
        <div className="flex flex-col items-start gap-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8">
          <h2 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-text-heading sm:text-4xl">
            Find your colour balance.
          </h2>
          <Button href="/app" size="lg">
            Open RATIO — Free
          </Button>
        </div>
      </Container>
    </Section>
  );
}
