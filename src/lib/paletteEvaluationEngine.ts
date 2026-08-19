import { contrastRatioHex } from '@/lib/color';
import { buildContrastChecks } from '@/lib/contrastChecks';
import {
  classifyDistinction,
  SURFACE_HIERARCHY_STATUS,
  ACCENT_PROMINENCE_STATUS,
  weakerTier,
  worstStatus,
} from '@/lib/evaluationThresholds';
import type { ProjectPalette } from '@/types/palette';
import type {
  DistinctionTier,
  InsightStatus,
  PaletteEvaluation,
  PaletteEvaluationSummary,
  PaletteInsight,
  PaletteInsightBreakdownItem,
} from '@/types/evaluation';

/**
 * RATIO's palette evaluation engine — a read-only insight layer.
 *
 * Given the user's own project palette, it explains what that palette is
 * doing (visual distinction, accent prominence, surface hierarchy, text
 * readability) in plain language. It deliberately:
 *   - never generates or suggests replacement colours,
 *   - never automatically changes the user's colours,
 *   - never produces a single gamified quality score.
 *
 * Kept independent of React/UI — components call `evaluatePalette` and
 * render the result.
 */

function distinctionDetail(ratio: number, tier: DistinctionTier): string {
  return `${ratio.toFixed(1)}:1 · ${tier} distinction`;
}

function buildSurfaceHierarchyInsight(palette: ProjectPalette): PaletteInsight {
  const dominantHex = palette.ratio.dominant.colour.hex;
  const secondaryHex = palette.ratio.secondary.colour.hex;

  const ratio = contrastRatioHex(dominantHex, secondaryHex);
  const tier = classifyDistinction(ratio);
  const status = SURFACE_HIERARCHY_STATUS[tier];

  const summaryByTier: Record<DistinctionTier, string> = {
    strong: 'Clear surface separation',
    moderate: 'Clear surface separation',
    low: 'Subtle surface separation',
  };

  const messageByTier: Record<DistinctionTier, string> = {
    strong:
      'Your Dominant and Secondary colours have clear visual separation, giving your interface an obvious surface hierarchy.',
    moderate:
      'Your Dominant and Secondary colours have moderate visual separation, helping create a clear surface hierarchy.',
    low: 'Your Dominant and Secondary colours are visually close. This can create a subtle, cohesive interface, but structural grouping — where one surface ends and another begins — may be less obvious.',
  };

  const breakdown: PaletteInsightBreakdownItem[] = [
    { label: 'Dominant vs Secondary', status, detail: distinctionDetail(ratio, tier) },
  ];

  return {
    id: 'surface-hierarchy',
    title: 'Surface hierarchy',
    status,
    summary: summaryByTier[tier],
    whatWasEvaluated: 'How visually distinct your Dominant and Secondary colours are from each other.',
    whatWasObserved: messageByTier[tier],
    whyItMatters:
      'Dominant and Secondary set your surface hierarchy — cards, panels and backgrounds rely on a visible difference between them to read as separate structural layers.',
    breakdown,
  };
}

function buildAccentProminenceInsight(palette: ProjectPalette): PaletteInsight {
  const dominantHex = palette.ratio.dominant.colour.hex;
  const secondaryHex = palette.ratio.secondary.colour.hex;
  const accentHex = palette.ratio.accent.colour.hex;

  const dominantRatio = contrastRatioHex(accentHex, dominantHex);
  const secondaryRatio = contrastRatioHex(accentHex, secondaryHex);
  const dominantTier = classifyDistinction(dominantRatio);
  const secondaryTier = classifyDistinction(secondaryRatio);

  // The accent has to stand out from whichever surface it's weakest against —
  // its prominence is only as strong as its worst pairing.
  const tier = weakerTier(dominantTier, secondaryTier);
  const status = ACCENT_PROMINENCE_STATUS[tier];

  const summaryByTier: Record<DistinctionTier, string> = {
    strong: 'Clear accent emphasis',
    moderate: 'Moderate accent emphasis',
    low: 'Low accent emphasis',
  };

  const messageByTier: Record<DistinctionTier, string> = {
    strong: 'Your Accent colour stands out clearly against both the Dominant and Secondary surfaces.',
    moderate:
      'Your Accent colour is noticeable against your surfaces, but the separation is moderate rather than strong on at least one of them.',
    low: 'Your Accent colour is visually close to at least one of your main surfaces, which may weaken its emphasis where they meet.',
  };

  const breakdown: PaletteInsightBreakdownItem[] = [
    {
      label: 'Accent vs Dominant',
      status: ACCENT_PROMINENCE_STATUS[dominantTier],
      detail: distinctionDetail(dominantRatio, dominantTier),
    },
    {
      label: 'Accent vs Secondary',
      status: ACCENT_PROMINENCE_STATUS[secondaryTier],
      detail: distinctionDetail(secondaryRatio, secondaryTier),
    },
  ];

  return {
    id: 'accent-prominence',
    title: 'Accent prominence',
    status,
    summary: summaryByTier[tier],
    whatWasEvaluated:
      "How clearly your Accent colour stands out against both the Dominant and Secondary surfaces it's likely to sit on.",
    whatWasObserved: messageByTier[tier],
    whyItMatters:
      'Accents work by standing out — buttons, highlights and key actions rely on that contrast to draw the eye. An accent that blends into a nearby surface is easy to miss.',
    breakdown,
  };
}

const TEXT_READABILITY_CHECK_IDS = new Set(['text-on-dominant', 'text-on-secondary', 'text-on-accent']);

function toInsightStatus(status: 'good' | 'review' | 'fail'): InsightStatus {
  return status === 'fail' ? 'issue' : status;
}

function buildTextReadabilityInsight(palette: ProjectPalette): PaletteInsight {
  const checks = buildContrastChecks(palette.ratio, palette.supporting.text.colour.hex).filter((check) =>
    TEXT_READABILITY_CHECK_IDS.has(check.id),
  );

  const breakdown: PaletteInsightBreakdownItem[] = checks.map((check) => ({
    label: check.label,
    status: toInsightStatus(check.status),
    detail: `${check.ratio.toFixed(1)}:1`,
  }));

  const status = worstStatus(breakdown.map((item) => item.status));

  const summaryByStatus: Record<InsightStatus, string> = {
    good: 'Good text readability',
    review: 'Some text relationships need review',
    issue: 'Text contrast issues detected',
  };

  const messageByStatus: Record<InsightStatus, string> = {
    good: 'All key text relationships pass — your Text / Foreground colour stays readable on the Dominant and Secondary surfaces, and on your Accent.',
    review:
      'Some text relationships need review — readable for large text and UI elements, but tight for normal body copy in places.',
    issue:
      'Important contrast failures detected — at least one text/background pairing falls below a readable level.',
  };

  return {
    id: 'text-readability',
    title: 'Text readability',
    status,
    summary: summaryByStatus[status],
    whatWasEvaluated:
      'Whether your Text / Foreground colour stays readable on the Dominant surface, the Secondary surface, and the Accent colour.',
    whatWasObserved: messageByStatus[status],
    whyItMatters:
      'Readable text is the baseline requirement for any interface — if a pairing falls short, real content on that surface becomes hard to read.',
    breakdown,
  };
}

function buildSummary(insights: PaletteInsight[]): PaletteEvaluationSummary {
  const goodCount = insights.filter((insight) => insight.status === 'good').length;
  const reviewCount = insights.filter((insight) => insight.status === 'review').length;
  const issueCount = insights.filter((insight) => insight.status === 'issue').length;
  const total = insights.length;

  const headline =
    goodCount === total
      ? `All ${total} key relationships look strong.`
      : `${goodCount} of ${total} key relationships look strong.`;

  return { goodCount, reviewCount, issueCount, total, headline };
}

/** Evaluates a project palette and returns plain-language insights. Pure — no side effects. */
export function evaluatePalette(palette: ProjectPalette): PaletteEvaluation {
  const insights: PaletteInsight[] = [
    buildSurfaceHierarchyInsight(palette),
    buildAccentProminenceInsight(palette),
    buildTextReadabilityInsight(palette),
  ];

  return { insights, summary: buildSummary(insights) };
}
