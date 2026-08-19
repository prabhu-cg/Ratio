import { INSIGHT_STATUS_CONFIG } from '@/lib/insightStatusConfig';
import type { InsightStatus } from '@/types/evaluation';

interface InsightStatusBadgeProps {
  status: InsightStatus;
}

export function InsightStatusBadge({ status }: InsightStatusBadgeProps) {
  const config = INSIGHT_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <span aria-hidden="true">{config.symbol}</span>
      {config.text}
    </span>
  );
}
