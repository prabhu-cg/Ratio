import { useMemo } from 'react';
import { ContrastCheckCard } from '@/components/workspace/accessibility/ContrastCheckCard';
import { PaletteInsightsSection } from '@/components/workspace/insights/PaletteInsightsSection';
import { buildContrastChecks } from '@/lib/contrastChecks';
import type { ProjectPalette } from '@/types/palette';

interface AccessibilityPanelProps {
  palette: ProjectPalette;
}

export function AccessibilityPanel({ palette }: AccessibilityPanelProps) {
  const checks = useMemo(
    () => buildContrastChecks(palette.ratio, palette.supporting.text.colour.hex),
    [palette],
  );
  const reviewOrFailCount = checks.filter((check) => check.status !== 'good').length;

  return (
    <section
      aria-labelledby="accessibility-heading"
      className="workspace-accessibility flex flex-col gap-5 overflow-y-auto bg-surface-page p-5 sm:p-8"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <h2
            id="accessibility-heading"
            className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted"
          >
            3 · Accessibility
          </h2>
          <span role="status" className="flex-none font-mono text-xs text-text-muted">
            {reviewOrFailCount === 0
              ? 'All checks pass'
              : `${reviewOrFailCount} of ${checks.length} to review`}
          </span>
        </div>
        <p className="text-sm text-text-muted">
          Check important foreground and background colour relationships.
        </p>
      </div>

      <details className="group rounded-[var(--radius-md)] border border-dashed border-border-strong">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-2.5 text-xs font-semibold text-text-muted [&::-webkit-details-marker]:hidden">
          What do these checks mean?
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            className="flex-none transition-transform duration-150 group-open:rotate-180"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <div className="border-t border-dashed border-border-strong px-4 py-3 text-xs leading-relaxed text-text-muted">
          <p>
            60–30–10 describes how much space each colour takes up — it doesn't say anything about
            whether text stays readable. These checks look at specific colour pairings your
            palette actually produces, not a single overall score.
          </p>
          <p className="mt-2">
            Accessibility always depends on how a colour is used. The same accent can work well
            for a large heading and fail for a line of small print.
          </p>
        </div>
      </details>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {checks.map((check) => (
          <ContrastCheckCard key={check.id} check={check} />
        ))}
      </div>

      <PaletteInsightsSection palette={palette} />
    </section>
  );
}
