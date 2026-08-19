import { describe, expect, it } from 'vitest';
import { evaluatePalette } from '@/lib/paletteEvaluationEngine';
import { classifyDistinction } from '@/lib/evaluationThresholds';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';
import type { ProjectPalette } from '@/types/palette';

function withColours(overrides: {
  dominant?: string;
  secondary?: string;
  accent?: string;
  text?: string;
}): ProjectPalette {
  const palette = createDefaultProjectPalette();

  if (overrides.dominant) {
    const colour = toColour(overrides.dominant);
    if (!colour) throw new Error('expected a valid colour');
    palette.ratio.dominant = { ...palette.ratio.dominant, colour };
  }
  if (overrides.secondary) {
    const colour = toColour(overrides.secondary);
    if (!colour) throw new Error('expected a valid colour');
    palette.ratio.secondary = { ...palette.ratio.secondary, colour };
  }
  if (overrides.accent) {
    const colour = toColour(overrides.accent);
    if (!colour) throw new Error('expected a valid colour');
    palette.ratio.accent = { ...palette.ratio.accent, colour };
  }
  if (overrides.text) {
    const colour = toColour(overrides.text);
    if (!colour) throw new Error('expected a valid colour');
    palette.supporting.text = { ...palette.supporting.text, colour };
  }

  return palette;
}

describe('classifyDistinction', () => {
  it('classifies ratios into strong / moderate / low tiers', () => {
    expect(classifyDistinction(21)).toBe('strong');
    expect(classifyDistinction(3)).toBe('strong');
    expect(classifyDistinction(2.99)).toBe('moderate');
    expect(classifyDistinction(1.5)).toBe('moderate');
    expect(classifyDistinction(1.49)).toBe('low');
    expect(classifyDistinction(1)).toBe('low');
  });
});

describe('evaluatePalette', () => {
  it('returns exactly three insights: surface hierarchy, accent prominence, text readability', () => {
    const evaluation = evaluatePalette(createDefaultProjectPalette());

    expect(evaluation.insights.map((insight) => insight.id)).toEqual([
      'surface-hierarchy',
      'accent-prominence',
      'text-readability',
    ]);
  });

  it('never mentions a replacement colour, hex suggestion, or numeric score in any insight copy', () => {
    const evaluation = evaluatePalette(createDefaultProjectPalette());
    const allText = evaluation.insights
      .flatMap((insight) => [insight.summary, insight.whatWasEvaluated, insight.whatWasObserved, insight.whyItMatters])
      .join(' ')
      .toLowerCase();

    expect(allText).not.toContain('try #');
    expect(allText).not.toContain('recommended');
    expect(allText).not.toContain('generate');
    expect(allText).not.toMatch(/\d+\s*\/\s*100/);
  });

  it('evaluates the default palette: subtle surfaces, clear accent, but a weak text-on-accent pairing', () => {
    // Independently verified: dominant/secondary ~1.35:1 (low), dominant/accent ~4.50:1
    // and secondary/accent ~3.33:1 (both strong), text/accent ~1.99:1 (fails AA large).
    const evaluation = evaluatePalette(createDefaultProjectPalette());

    const surfaceHierarchy = evaluation.insights.find((i) => i.id === 'surface-hierarchy');
    const accentProminence = evaluation.insights.find((i) => i.id === 'accent-prominence');
    const textReadability = evaluation.insights.find((i) => i.id === 'text-readability');

    expect(surfaceHierarchy?.status).toBe('review');
    expect(accentProminence?.status).toBe('good');
    expect(textReadability?.status).toBe('issue');

    expect(evaluation.summary).toEqual({
      goodCount: 1,
      reviewCount: 1,
      issueCount: 1,
      total: 3,
      headline: '1 of 3 key relationships look strong.',
    });
  });

  describe('surface hierarchy (distinction)', () => {
    it('reports strong distinction as good, with a "clear separation" summary', () => {
      const palette = withColours({ dominant: '#000000', secondary: '#FFFFFF' });
      const insight = evaluatePalette(palette).insights.find((i) => i.id === 'surface-hierarchy');

      expect(insight?.status).toBe('good');
      expect(insight?.summary).toBe('Clear surface separation');
      expect(insight?.breakdown[0].status).toBe('good');
    });

    it('reports low distinction as review, with a "subtle separation" summary', () => {
      const palette = withColours({ dominant: '#FFFFFF', secondary: '#FBFBFB' });
      const insight = evaluatePalette(palette).insights.find((i) => i.id === 'surface-hierarchy');

      expect(insight?.status).toBe('review');
      expect(insight?.summary).toBe('Subtle surface separation');
    });

    it('treats identical dominant and secondary colours as low distinction, not a crash', () => {
      const palette = withColours({ dominant: '#888888', secondary: '#888888' });
      const insight = evaluatePalette(palette).insights.find((i) => i.id === 'surface-hierarchy');

      expect(insight?.status).toBe('review');
      expect(insight?.breakdown[0].detail).toContain('1.0:1');
    });
  });

  describe('accent prominence', () => {
    it('is good when the accent stands out strongly from both surfaces', () => {
      const palette = withColours({ dominant: '#000000', secondary: '#4D4D4D', accent: '#FFFFFF' });
      const insight = evaluatePalette(palette).insights.find((i) => i.id === 'accent-prominence');

      expect(insight?.status).toBe('good');
      expect(insight?.summary).toBe('Clear accent emphasis');
    });

    it('is review when the accent has only moderate separation from one surface', () => {
      const palette = withColours({ dominant: '#FFFFFF', secondary: '#000000', accent: '#B0B0B0' });
      const insight = evaluatePalette(palette).insights.find((i) => i.id === 'accent-prominence');

      expect(insight?.status).toBe('review');
      expect(insight?.summary).toBe('Moderate accent emphasis');
    });

    it('is an issue when the accent is visually close to a surface it sits on', () => {
      const palette = withColours({ dominant: '#FFFFFF', secondary: '#000000', accent: '#F5F5F5' });
      const insight = evaluatePalette(palette).insights.find((i) => i.id === 'accent-prominence');

      expect(insight?.status).toBe('issue');
      expect(insight?.summary).toBe('Low accent emphasis');
      // Driven by the weaker of the two pairings (accent vs dominant here).
      expect(insight?.breakdown.find((item) => item.label === 'Accent vs Dominant')?.status).toBe('issue');
      expect(insight?.breakdown.find((item) => item.label === 'Accent vs Secondary')?.status).toBe('good');
    });
  });

  describe('text readability', () => {
    it('is good when the project text colour reads well on every surface', () => {
      const palette = withColours({
        dominant: '#FFFFFF',
        secondary: '#DDDDDD',
        accent: '#FFAA00',
        text: '#000000',
      });
      const insight = evaluatePalette(palette).insights.find((i) => i.id === 'text-readability');

      expect(insight?.status).toBe('good');
      expect(insight?.summary).toBe('Good text readability');
      expect(insight?.breakdown.every((item) => item.status === 'good')).toBe(true);
    });

    it('is an issue when the text colour fails against a surface it sits on', () => {
      const palette = withColours({
        dominant: '#FFFFFF',
        secondary: '#DDDDDD',
        accent: '#FFAA00',
        text: '#F8F8F8',
      });
      const insight = evaluatePalette(palette).insights.find((i) => i.id === 'text-readability');

      expect(insight?.status).toBe('issue');
      expect(insight?.summary).toBe('Text contrast issues detected');
      expect(insight?.breakdown.find((item) => item.label === 'Text on Dominant')?.status).toBe('issue');
    });

    it('only exposes the three user-driven text checks, not the fixed white/dark-on-accent references', () => {
      const insight = evaluatePalette(createDefaultProjectPalette()).insights.find(
        (i) => i.id === 'text-readability',
      );

      expect(insight?.breakdown.map((item) => item.label)).toEqual([
        'Text on Dominant',
        'Text on Secondary',
        'Text on Accent',
      ]);
    });
  });

  it('surfaces multiple simultaneous issues without hiding any of them', () => {
    const palette = withColours({
      dominant: '#FFFFFF',
      secondary: '#F0F0F0',
      accent: '#EDEDED',
      text: '#FAFAFA',
    });
    const evaluation = evaluatePalette(palette);

    expect(evaluation.insights.find((i) => i.id === 'surface-hierarchy')?.status).toBe('review');
    expect(evaluation.insights.find((i) => i.id === 'accent-prominence')?.status).toBe('issue');
    expect(evaluation.insights.find((i) => i.id === 'text-readability')?.status).toBe('issue');
    expect(evaluation.summary).toEqual({
      goodCount: 0,
      reviewCount: 1,
      issueCount: 2,
      total: 3,
      headline: '0 of 3 key relationships look strong.',
    });
  });

  it('formats the summary headline from the actual good/total counts, never a percentage or score', () => {
    const evaluation = evaluatePalette(createDefaultProjectPalette());

    expect(evaluation.summary.headline).toMatch(/^\d+ of \d+ key relationships look strong\.$/);
    expect(evaluation.summary.headline).not.toMatch(/%|\/\s*100/);
    expect(evaluation.summary.goodCount + evaluation.summary.reviewCount + evaluation.summary.issueCount).toBe(
      evaluation.summary.total,
    );
  });

  it('recomputes immediately when the palette changes (no stale state)', () => {
    const palette = createDefaultProjectPalette();
    const before = evaluatePalette(palette);

    const changed = withColours({ dominant: '#000000', secondary: '#FFFFFF' });
    const after = evaluatePalette(changed);

    expect(before.insights[0].status).not.toBe(after.insights[0].status);
  });
});
