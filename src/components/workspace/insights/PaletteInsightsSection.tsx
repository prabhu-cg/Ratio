import { useMemo } from 'react';
import { InsightCard } from '@/components/workspace/insights/InsightCard';
import { INSIGHT_STATUS_CONFIG } from '@/lib/insightStatusConfig';
import { evaluatePalette } from '@/lib/paletteEvaluationEngine';
import type { ProjectPalette } from '@/types/palette';

interface PaletteInsightsSectionProps {
  palette: ProjectPalette;
}

/**
 * A dedicated evaluation layer on top of the user's own palette — visual
 * distinction, accent prominence, surface hierarchy and text readability,
 * explained in plain language. This never generates or suggests
 * replacement colours and never changes the palette itself.
 */
export function PaletteInsightsSection({ palette }: PaletteInsightsSectionProps) {
  const evaluation = useMemo(() => evaluatePalette(palette), [palette]);

  return (
    <div className="flex flex-col gap-4 border-t border-border-default pt-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          Palette insights
        </h3>
        <p className="text-sm text-text-muted">
          What your palette is doing — visual distinction, accent emphasis and text readability.
        </p>
      </div>

      <div
        aria-label="Palette overview"
        className="rounded-[var(--radius-md)] border border-dashed border-border-strong p-4"
      >
        <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          Palette overview
        </h4>
        <ul className="mt-3 flex flex-col gap-2">
          {evaluation.insights.map((insight) => {
            const config = INSIGHT_STATUS_CONFIG[insight.status];
            return (
              <li key={insight.id} className="flex items-start gap-2 text-sm text-text-heading">
                <span aria-hidden="true" className="mt-0.5 flex-none font-semibold">
                  {config.symbol}
                </span>
                <span>
                  {insight.summary}
                  <span className="sr-only"> — {config.text}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p role="status" className="mt-3 text-xs leading-relaxed text-text-muted">
          {evaluation.summary.headline}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {evaluation.insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}
