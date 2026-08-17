import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { RatioStackVisual } from '@/components/marketing/RatioStackVisual';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-24">
      <Container width="wide">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Badge tone="brand">The 60–30–10 principle</Badge>

            <h1 className="mt-6 font-display text-[2.75rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-text-heading sm:text-6xl">
              Balance colour.
              <br />
              Build hierarchy.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-text-primary">
              A simple visual tool for designers to explore the 60–30–10 colour principle and see
              how colours work together in real interfaces.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/app" size="lg" withArrow>
                Start designing — Free
              </Button>
              <Button href="/how-it-works" variant="secondary" size="lg">
                How it works
              </Button>
            </div>

            <p className="mt-6 font-mono text-xs uppercase tracking-[0.1em] text-text-muted">
              No account · No AI · Runs in your browser
            </p>
          </div>

          <div className="relative">
            <RatioStackVisual />
          </div>
        </div>
      </Container>
    </section>
  );
}
