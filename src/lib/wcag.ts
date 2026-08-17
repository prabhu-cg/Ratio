export type WcagLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';
export type ContrastStatus = 'good' | 'review' | 'fail';

/**
 * WCAG 2.x minimum contrast ratios for text.
 * "Large text" is 18pt+ (24px+) or 14pt+/19px+ bold.
 */
export const WCAG_THRESHOLDS: Record<WcagLevel, Record<TextSize, number>> = {
  AA: { normal: 4.5, large: 3.0 },
  AAA: { normal: 7.0, large: 4.5 },
};

export function meetsWcag(ratio: number, level: WcagLevel, size: TextSize): boolean {
  return ratio >= WCAG_THRESHOLDS[level][size];
}

/**
 * A three-tier read on a contrast ratio, driven directly by the WCAG AA thresholds:
 * - "good": passes AA for normal text (4.5:1+) — safe for body copy.
 * - "review": passes AA for large text only (3:1–4.5:1) — fine for headings/large UI,
 *   worth a second look for small text.
 * - "fail": below 3:1 — not readable as text at any size.
 */
export function contrastStatus(ratio: number): ContrastStatus {
  if (ratio >= WCAG_THRESHOLDS.AA.normal) return 'good';
  if (ratio >= WCAG_THRESHOLDS.AA.large) return 'review';
  return 'fail';
}
