import { InsightStatusBadge } from '@/components/workspace/insights/InsightStatusBadge';
import type { PaletteInsight } from '@/types/evaluation';

interface InsightCardProps {
  insight: PaletteInsight;
}

/**
 * One expandable palette insight. The closed <summary> row is the "scan"
 * view (title + status + one-line summary); expanding it answers what was
 * evaluated, what was observed, and why it matters — never a colour
 * suggestion.
 */
export function InsightCard({ insight }: InsightCardProps) {
  return (
    <details className="group rounded-[var(--radius-md)] border border-border-default bg-surface-card">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
        <div>
          <h4 className="text-sm font-semibold text-text-heading">{insight.title}</h4>
          <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{insight.summary}</p>
        </div>
        <div className="flex flex-none items-center gap-2">
          <InsightStatusBadge status={insight.status} />
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
            className="mt-1 flex-none transition-transform duration-150 group-open:rotate-180"
          >
            <path
              d="M2 3.5L5 6.5L8 3.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </summary>

      <div className="flex flex-col gap-3 border-t border-border-default px-4 py-3 text-xs leading-relaxed text-text-muted">
        <div>
          <p className="font-semibold text-text-heading">What was evaluated</p>
          <p>{insight.whatWasEvaluated}</p>
        </div>
        <div>
          <p className="font-semibold text-text-heading">What we observed</p>
          <p>{insight.whatWasObserved}</p>
        </div>
        <div>
          <p className="font-semibold text-text-heading">Why it matters</p>
          <p>{insight.whyItMatters}</p>
        </div>

        <ul className="flex flex-col gap-1.5">
          {insight.breakdown.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] bg-surface-alt px-2.5 py-1.5"
            >
              <span className="text-text-heading">{item.label}</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[11px]">{item.detail}</span>
                <InsightStatusBadge status={item.status} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
