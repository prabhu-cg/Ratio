import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';

export function AccessibilitySection() {
  return (
    <Section tone="inverse">
      <Container width="wide">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:gap-16">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              Beyond balance
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] text-text-inverse sm:text-4xl">
              Visual balance alone isn't enough
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-inverse/75">
              A well-proportioned palette can still fail people who read it differently. RATIO
              helps you see how colour is distributed — pairing it with contrast and colour-blind
              checks is still part of a designer's job.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-white/12 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[#f7f5f0] px-4 py-3">
              <span className="text-sm font-semibold text-[#c74504]">Clear contrast</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#1e1c1a]/50">
                Legible
              </span>
            </div>
            <div className="flex items-center justify-between rounded-[var(--radius-sm)] bg-[#f7f5f0] px-4 py-3">
              <span className="text-sm font-semibold text-[#e8d2c4]">Low contrast</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#1e1c1a]/50">
                Hard to read
              </span>
            </div>
            <p className="mt-1 text-xs text-text-inverse/50">
              Balance and legibility are two different questions. RATIO focuses on the first.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
