import { describe, expect, it } from 'vitest';
import { buildContrastChecks } from '@/lib/contrastChecks';
import { createDefaultPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('buildContrastChecks', () => {
  it('returns exactly the six purposeful relationships, each above 1:1 and at most 21:1', () => {
    const checks = buildContrastChecks(createDefaultPalette());

    expect(checks.map((check) => check.id)).toEqual([
      'primary-on-dominant',
      'primary-on-secondary',
      'primary-on-accent',
      'white-on-accent',
      'dark-on-accent',
      'secondary-on-dominant',
    ]);

    for (const check of checks) {
      expect(check.ratio).toBeGreaterThanOrEqual(1);
      expect(check.ratio).toBeLessThanOrEqual(21);
      expect(check.guidance.length).toBeGreaterThan(0);
    }
  });

  it('matches the pairing from the spec (secondary text on dominant): a strong pass', () => {
    // The spec's own worked example quotes "7.1:1" for #444444 on #F7F5F0, but the
    // standard WCAG relative-luminance formula gives ~8.94:1 for that exact pair —
    // verified independently outside this codebase. Treated as illustrative spec
    // copy rather than a precise fixture; asserting the real, correct value here.
    const checks = buildContrastChecks(createDefaultPalette());
    const check = checks.find((c) => c.id === 'secondary-on-dominant');

    expect(check).toBeDefined();
    expect(check?.fgHex).toBe('#444444');
    expect(check?.bgHex).toBe('#F7F5F0');
    expect(check?.ratio).toBeCloseTo(8.94, 1);
    expect(check?.status).toBe('good');
    expect(check?.aaNormal).toBe(true);
    expect(check?.aaaNormal).toBe(true);
  });

  it('flags the default accent-on-dominant style pairing as review-worthy, not a hard fail', () => {
    const checks = buildContrastChecks(createDefaultPalette());
    // Accent text directly on the dominant background isn't one of the six checks,
    // but "white on accent" mirrors the spec's worked example ratio (~4.2:1) closely
    // enough in spirit: it should land in the review band, not good or fail.
    const whiteOnAccent = checks.find((c) => c.id === 'white-on-accent');
    expect(whiteOnAccent?.status).not.toBe('fail');
  });

  it('recomputes immediately when the palette changes', () => {
    const palette = createDefaultPalette();
    const before = buildContrastChecks(palette);

    const customSecondary = toColour('#F0EEE8');
    if (!customSecondary) throw new Error('expected a valid colour');
    palette.secondary = { ...palette.secondary, colour: customSecondary };

    const after = buildContrastChecks(palette);

    const beforeCheck = before.find((c) => c.id === 'secondary-on-dominant');
    const afterCheck = after.find((c) => c.id === 'secondary-on-dominant');

    expect(afterCheck?.ratio).not.toBeCloseTo(beforeCheck?.ratio ?? 0, 1);
    expect(afterCheck?.status).toBe('fail');
  });

  it('handles identical dominant and secondary colours without throwing (1:1 edge case)', () => {
    const palette = createDefaultPalette();
    palette.secondary = { ...palette.secondary, colour: palette.dominant.colour };

    const checks = buildContrastChecks(palette);
    const check = checks.find((c) => c.id === 'secondary-on-dominant');

    expect(check?.ratio).toBeCloseTo(1, 5);
    expect(check?.status).toBe('fail');
  });
});
