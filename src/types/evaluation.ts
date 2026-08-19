/**
 * Types for RATIO's palette evaluation layer (src/lib/paletteEvaluationEngine.ts).
 * This is an explanatory/insight layer only — it never generates or suggests
 * replacement colours, and never produces a single gamified quality score.
 */

export type InsightStatus = 'good' | 'review' | 'issue';

export type DistinctionTier = 'strong' | 'moderate' | 'low';

export type PaletteInsightId = 'surface-hierarchy' | 'accent-prominence' | 'text-readability';

/** One sub-relationship shown when an insight is expanded, e.g. "Accent vs Dominant". */
export interface PaletteInsightBreakdownItem {
  label: string;
  status: InsightStatus;
  /** Short measured detail, e.g. "3.3:1 · moderate distinction". */
  detail: string;
}

/**
 * One evaluated relationship in the palette. Every insight answers three
 * explicit questions (what was evaluated, what was observed, why it
 * matters) rather than just asserting a verdict.
 */
export interface PaletteInsight {
  id: PaletteInsightId;
  title: string;
  status: InsightStatus;
  /** Short, scannable one-liner for the overview list, e.g. "Clear accent emphasis". */
  summary: string;
  whatWasEvaluated: string;
  whatWasObserved: string;
  whyItMatters: string;
  breakdown: PaletteInsightBreakdownItem[];
}

export interface PaletteEvaluationSummary {
  goodCount: number;
  reviewCount: number;
  issueCount: number;
  total: number;
  /** e.g. "2 of 3 key relationships look strong." */
  headline: string;
}

export interface PaletteEvaluation {
  insights: PaletteInsight[];
  summary: PaletteEvaluationSummary;
}
