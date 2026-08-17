import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { DEFAULT_PALETTE } from '@/types/palette';

export function PreviewSection() {
  const dominant = DEFAULT_PALETTE.dominant.colour.hex;
  const secondary = DEFAULT_PALETTE.secondary.colour.hex;
  const accent = DEFAULT_PALETTE.accent.colour.hex;

  return (
    <Section tone="page">
      <Container width="wide">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-lg">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              In practice
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] text-text-heading sm:text-4xl">
              What it looks like in a real interface
            </h2>
          </div>
          <Badge>Static example</Badge>
        </div>

        <div
          className="mt-10 overflow-hidden rounded-[var(--radius-lg)] border border-border-strong shadow-[var(--shadow-card)]"
          style={{ backgroundColor: dominant }}
        >
          <div
            className="flex items-center justify-between border-b px-6 py-4"
            style={{ borderColor: 'rgba(0,0,0,0.08)' }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: secondary, opacity: 0.4 }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: secondary, opacity: 0.4 }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: secondary, opacity: 0.4 }} />
            </div>
            <span
              className="font-mono text-[11px] uppercase tracking-[0.1em]"
              style={{ color: secondary }}
            >
              Example product
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
            <div
              className="flex flex-col gap-3 border-b px-6 py-6 sm:border-b-0 sm:border-r"
              style={{ borderColor: 'rgba(0,0,0,0.08)' }}
            >
              {['Overview', 'Projects', 'Team', 'Settings'].map((item, index) => (
                <span
                  key={item}
                  className="text-sm font-medium"
                  style={{
                    color: index === 0 ? accent : secondary,
                    opacity: index === 0 ? 1 : 0.65,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-5 px-6 py-6 sm:px-8 sm:py-8">
              <div>
                <h3 className="font-display text-xl font-bold" style={{ color: secondary }}>
                  Weekly overview
                </h3>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed" style={{ color: secondary, opacity: 0.7 }}>
                  The dominant colour carries the page. Secondary handles text and structure.
                  Accent appears only where it matters.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <span
                  className="rounded-[var(--radius-sm)] px-4 py-2 text-sm font-semibold"
                  style={{ backgroundColor: accent, color: dominant }}
                >
                  Create project
                </span>
                <span
                  className="rounded-[var(--radius-sm)] border px-4 py-2 text-sm font-medium"
                  style={{ borderColor: secondary, color: secondary, opacity: 0.85 }}
                >
                  View archive
                </span>
              </div>

              <div
                className="mt-1 h-24 rounded-[var(--radius-md)] border"
                style={{ borderColor: 'rgba(0,0,0,0.08)' }}
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
