import type { DistinctionTier, InsightStatus } from '@/types/evaluation';

/**
 * Centralised, documented thresholds for the palette evaluation engine
 * (src/lib/paletteEvaluationEngine.ts). Every magic number the engine uses
 * lives here — never inline in the engine or in components — so the rules
 * are easy to find, audit, and tune in one place.
 *
 * "Distinction" tiers reuse WCAG contrast ratio (see `contrastRatioHex` in
 * src/lib/color.ts) as a proxy for how visually separated two swatches are.
 * That's a deliberate reuse of existing, already-tested colour math — this
 * is NOT a text-contrast pass/fail check, just a convenient, well-understood
 * 1–21 scale for "how different do these two colours read".
 *
 * - 3.0 (`strong`) mirrors WCAG's own minimum for large text/UI components,
 *   which makes it a familiar, defensible line for "clearly different".
 * - 1.5 (`moderate`) is a pragmatic midpoint: below it, two colours read as
 *   close variants of the same swatch rather than distinct choices.
 */
export const DISTINCTION_RATIO_THRESHOLDS = {
  strong: 3.0,
  moderate: 1.5,
} as const;

export function classifyDistinction(ratio: number): DistinctionTier {
  if (ratio >= DISTINCTION_RATIO_THRESHOLDS.strong) return 'strong';
  if (ratio >= DISTINCTION_RATIO_THRESHOLDS.moderate) return 'moderate';
  return 'low';
}

/**
 * Surface hierarchy (Dominant vs Secondary) is a structural relationship,
 * not an emphatic one — even "moderate" separation reads as an intentional,
 * workable hierarchy. Only "low" separation is surfaced for review, and
 * even then it's framed as a design trade-off, never as something "wrong".
 */
export const SURFACE_HIERARCHY_STATUS: Record<DistinctionTier, InsightStatus> = {
  strong: 'good',
  moderate: 'good',
  low: 'review',
};

/**
 * Accent prominence is held to a stricter bar: an accent's entire job is to
 * stand out, so "moderate" separation is worth a second look, and "low"
 * separation is flagged as an issue — the accent risks blending into a
 * surface it sits on instead of drawing attention to it.
 */
export const ACCENT_PROMINENCE_STATUS: Record<DistinctionTier, InsightStatus> = {
  strong: 'good',
  moderate: 'review',
  low: 'issue',
};

/** Rank used to combine several tiers/statuses down to the weakest one. */
const TIER_RANK: Record<DistinctionTier, number> = { low: 0, moderate: 1, strong: 2 };
const STATUS_RANK: Record<InsightStatus, number> = { issue: 0, review: 1, good: 2 };

/** The weaker (lower-ranked) of two distinction tiers. */
export function weakerTier(a: DistinctionTier, b: DistinctionTier): DistinctionTier {
  return TIER_RANK[a] <= TIER_RANK[b] ? a : b;
}

/** The worst (lowest-ranked) status among several — "issue" beats "review" beats "good". */
export function worstStatus(statuses: InsightStatus[]): InsightStatus {
  return statuses.reduce((worst, current) => (STATUS_RANK[current] < STATUS_RANK[worst] ? current : worst));
}
