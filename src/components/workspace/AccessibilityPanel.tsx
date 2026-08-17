import { useMemo } from 'react';
import { ContrastCheckCard } from '@/components/workspace/accessibility/ContrastCheckCard';
import { buildContrastChecks } from '@/lib/contrastChecks';
import type { RatioPalette } from '@/types/palette';

interface AccessibilityPanelProps {
  palette: RatioPalette;
}

export function AccessibilityPanel({ palette }: AccessibilityPanelProps) {
  const checks = useMemo(() => buildContrastChecks(palette), [palette]);
  const reviewOrFailCount = checks.filter((check) => check.status !== 'good').length;

  return (
    <section aria-labelledby="accessibility-heading" className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2
          id="accessibility-heading"
          className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted"
        >
          3 · Accessibility
        </h2>
        <span role="status" className="font-mono text-xs text-text-muted">
          {reviewOrFailCount === 0
            ? 'All checks pass'
            : `${reviewOrFailCount} of ${checks.length} to review`}
        </span>
      </div>

      <div className="rounded-[var(--radius-md)] border border-dashed border-border-strong p-4 text-xs leading-relaxed text-text-muted">
        <p>
          60–30–10 describes how much space each colour takes up — it doesn't say anything about
          whether text stays readable. These checks look at specific colour pairings your palette
          actually produces, not a single overall score.
        </p>
        <p className="mt-2">
          Accessibility always depends on how a colour is used. The same accent can work well for
          a large heading and fail for a line of small print.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {checks.map((check) => (
          <ContrastCheckCard key={check.id} check={check} />
        ))}
      </div>
    </section>
  );
}
