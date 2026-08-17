import type { ContrastStatus } from '@/lib/wcag';

interface ContrastStatusBadgeProps {
  status: ContrastStatus;
}

const STATUS_CONFIG: Record<ContrastStatus, { symbol: string; text: string; className: string }> = {
  good: {
    symbol: '✓',
    text: 'Good',
    className: 'border-green-200 bg-green-50 text-green-800',
  },
  review: {
    symbol: '⚠',
    text: 'Review',
    className: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  fail: {
    symbol: '✕',
    text: 'Fails',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};

export function ContrastStatusBadge({ status }: ContrastStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <span aria-hidden="true">{config.symbol}</span>
      {config.text}
    </span>
  );
}
