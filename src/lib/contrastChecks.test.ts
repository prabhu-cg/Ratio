import { describe, expect, it } from 'vitest';
import { buildContrastChecks } from '@/lib/contrastChecks';
import { createDefaultPalette, DEFAULT_SUPPORTING_HEX } from '@/types/palette';

const DEFAULT_TEXT = DEFAULT_SUPPORTING_HEX.text;

describe('buildContrastChecks', () => {
  it('returns exactly the five purposeful relationships, each above 1:1 and at most 21:1', () => {
    const checks = buildContrastChecks(createDefaultPalette(), DEFAULT_TEXT);

    expect(checks.map((check) => check.id)).toEqual([
      'text-on-dominant',
      'text-on-secondary',
      'text-on-accent',
      'white-on-accent',
      'dark-on-accent',
    ]);

    for (const check of checks) {
      expect(check.ratio).toBeGreaterThanOrEqual(1);
      expect(check.ratio).toBeLessThanOrEqual(21);
      expect(check.guidance.length).toBeGreaterThan(0);
    }
  });

  it("drives the 'Text on X' checks from the passed-in project text colour, not an auto-picked one", () => {
    const checks = buildContrastChecks(createDefaultPalette(), '#00FF00');

    const onDominant = checks.find((c) => c.id === 'text-on-dominant');
    const onSecondary = checks.find((c) => c.id === 'text-on-secondary');
    const onAccent = checks.find((c) => c.id === 'text-on-accent');

    expect(onDominant?.fgHex).toBe('#00FF00');
    expect(onSecondary?.fgHex).toBe('#00FF00');
    expect(onAccent?.fgHex).toBe('#00FF00');
  });

  it('matches the default Text on Dominant pairing: a strong pass', () => {
    // The spec's own worked example quotes "7.1:1" for #444444 on #F7F5F0, but the
    // standard WCAG relative-luminance formula gives ~8.94:1 for that exact pair —
    // verified independently outside this codebase. Treated as illustrative spec
    // copy rather than a precise fixture; asserting the real, correct value here.
    const checks = buildContrastChecks(createDefaultPalette(), DEFAULT_TEXT);
    const check = checks.find((c) => c.id === 'text-on-dominant');

    expect(check).toBeDefined();
    expect(check?.fgHex).toBe('#444444');
    expect(check?.bgHex).toBe('#F7F5F0');
    expect(check?.ratio).toBeCloseTo(8.94, 1);
    expect(check?.status).toBe('good');
    expect(check?.aaNormal).toBe(true);
    expect(check?.aaaNormal).toBe(true);
  });

  it('flags the default accent pairing as review-worthy, not a hard fail', () => {
    const checks = buildContrastChecks(createDefaultPalette(), DEFAULT_TEXT);
    const whiteOnAccent = checks.find((c) => c.id === 'white-on-accent');
    expect(whiteOnAccent?.status).not.toBe('fail');
  });

  it('recomputes immediately when the palette changes', () => {
    const palette = createDefaultPalette();
    const before = buildContrastChecks(palette, DEFAULT_TEXT);

    const badTextOnDominant = buildContrastChecks(palette, '#F7F6F4');
    const beforeCheck = before.find((c) => c.id === 'text-on-dominant');
    const afterCheck = badTextOnDominant.find((c) => c.id === 'text-on-dominant');

    expect(afterCheck?.ratio).not.toBeCloseTo(beforeCheck?.ratio ?? 0, 1);
    expect(afterCheck?.status).toBe('fail');
  });

  it('handles identical text and dominant colours without throwing (1:1 edge case)', () => {
    const palette = createDefaultPalette();
    const checks = buildContrastChecks(palette, palette.dominant.colour.hex);
    const check = checks.find((c) => c.id === 'text-on-dominant');

    expect(check?.ratio).toBeCloseTo(1, 5);
    expect(check?.status).toBe('fail');
  });
});
