import type { InsightStatus } from '@/types/evaluation';

/**
 * Shared status vocabulary for palette insights. Every status pairs an icon
 * with a text label — never colour alone — so meaning survives colour
 * vision differences and greyscale rendering alike.
 */
export const INSIGHT_STATUS_CONFIG: Record<InsightStatus, { symbol: string; text: string; className: string }> = {
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
  issue: {
    symbol: '!',
    text: 'Issue',
    className: 'border-red-200 bg-red-50 text-red-700',
  },
};
