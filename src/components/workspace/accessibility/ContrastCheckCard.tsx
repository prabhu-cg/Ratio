import { ContrastStatusBadge } from '@/components/workspace/accessibility/ContrastStatusBadge';
import type { ContrastCheckResult } from '@/types/accessibility';

interface ContrastCheckCardProps {
  check: ContrastCheckResult;
}

export function ContrastCheckCard({ check }: ContrastCheckCardProps) {
  return (
    <div className="rounded-[var(--radius-md)] border border-border-default bg-surface-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-text-heading">{check.label}</h4>
          <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{check.purpose}</p>
        </div>
        <ContrastStatusBadge status={check.status} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex flex-none -space-x-2" aria-hidden="true">
          <span
            className="h-7 w-7 rounded-full border-2 border-surface-card shadow-sm"
            style={{ backgroundColor: check.fgHex }}
          />
          <span
            className="h-7 w-7 rounded-full border-2 border-surface-card shadow-sm"
            style={{ backgroundColor: check.bgHex }}
          />
        </div>
        <span className="font-mono text-xs text-text-muted">
          {check.fgHex} on {check.bgHex}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-display text-xl font-bold text-text-heading">
          {check.ratio.toFixed(1)}:1
        </span>
        <span className="text-xs font-medium text-text-muted">
          AA{' '}
          <span aria-hidden="true">{check.aaNormal ? '✓' : '✕'}</span>
          <span className="sr-only">{check.aaNormal ? ' passes' : ' fails'}</span>
        </span>
        <span className="text-xs font-medium text-text-muted">
          AAA{' '}
          <span aria-hidden="true">{check.aaaNormal ? '✓' : '✕'}</span>
          <span className="sr-only">{check.aaaNormal ? ' passes' : ' fails'}</span>
        </span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-text-muted">{check.guidance}</p>
    </div>
  );
}
