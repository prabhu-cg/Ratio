import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Page not found — RATIO');

  return (
    <Section>
      <Container width="narrow" className="text-center">
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.1em] text-brand">
          404
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.02em] text-text-heading sm:text-4xl">
          This page doesn't exist
        </h1>
        <p className="mt-4 text-base text-text-primary">
          The page you're looking for may have moved or never existed.
        </p>
        <Button href="/" size="lg" className="mt-8">
          Back to RATIO
        </Button>
      </Container>
    </Section>
  );
}

export default NotFoundPage;
