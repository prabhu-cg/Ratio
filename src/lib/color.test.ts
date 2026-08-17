import { describe, expect, it } from 'vitest';
import {
  contrastRatio,
  formatHsl,
  formatRgb,
  hexToRgb,
  hslToRgb,
  isValidHex,
  normalizeHex,
  relativeLuminance,
  rgbToHex,
  rgbToHsl,
  toColour,
} from '@/lib/color';

describe('normalizeHex', () => {
  it('accepts 3-digit shorthand and expands it', () => {
    expect(normalizeHex('#FFF')).toBe('#FFFFFF');
    expect(normalizeHex('fff')).toBe('#FFFFFF');
    expect(normalizeHex('abc')).toBe('#AABBCC');
  });

  it('accepts 6-digit hex with or without a leading #', () => {
    expect(normalizeHex('#F7F5F0')).toBe('#F7F5F0');
    expect(normalizeHex('f7f5f0')).toBe('#F7F5F0');
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeHex('  #C74504  ')).toBe('#C74504');
  });

  it('returns null for invalid input', () => {
    expect(normalizeHex('')).toBeNull();
    expect(normalizeHex('not-a-colour')).toBeNull();
    expect(normalizeHex('#GGGGGG')).toBeNull();
    expect(normalizeHex('#1234')).toBeNull();
    expect(normalizeHex('#12345')).toBeNull();
    expect(normalizeHex('#1234567')).toBeNull();
  });
});

describe('isValidHex', () => {
  it('mirrors normalizeHex validity', () => {
    expect(isValidHex('#C74504')).toBe(true);
    expect(isValidHex('#FFF')).toBe(true);
    expect(isValidHex('nope')).toBe(false);
  });
});

describe('hexToRgb / rgbToHex', () => {
  it('converts known hex values to rgb', () => {
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#C74504')).toEqual({ r: 199, g: 69, b: 4 });
  });

  it('round-trips rgb back to the same normalised hex', () => {
    const cases = ['#C74504', '#444444', '#F7F5F0', '#000000', '#FFFFFF'];
    for (const hex of cases) {
      expect(rgbToHex(hexToRgb(hex))).toBe(hex);
    }
  });

  it('throws for invalid hex input', () => {
    expect(() => hexToRgb('not-a-colour')).toThrow();
  });

  it('clamps out-of-range rgb channels', () => {
    expect(rgbToHex({ r: 300, g: -10, b: 128 })).toBe('#FF0080');
  });
});

describe('rgbToHsl / hslToRgb', () => {
  it('converts pure colours correctly', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 });
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 });
  });

  it('round-trips rgb -> hsl -> rgb within rounding tolerance', () => {
    // HSL is stored as integer degrees/percentages, so a couple of units of
    // drift per channel is expected rounding error, not a bug.
    const TOLERANCE = 2;
    const cases = [
      { r: 199, g: 69, b: 4 },
      { r: 68, g: 68, b: 68 },
      { r: 247, g: 245, b: 240 },
    ];

    for (const rgb of cases) {
      const roundTripped = hslToRgb(rgbToHsl(rgb));
      expect(Math.abs(roundTripped.r - rgb.r)).toBeLessThanOrEqual(TOLERANCE);
      expect(Math.abs(roundTripped.g - rgb.g)).toBeLessThanOrEqual(TOLERANCE);
      expect(Math.abs(roundTripped.b - rgb.b)).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  it('converts hsl back to rgb for a known value', () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe('relativeLuminance / contrastRatio', () => {
  it('gives white the maximum luminance and black the minimum', () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
  });

  it('gives black-on-white the maximum contrast ratio of 21', () => {
    expect(contrastRatio({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 })).toBeCloseTo(21, 1);
  });

  it('gives identical colours a contrast ratio of 1', () => {
    expect(contrastRatio({ r: 100, g: 100, b: 100 }, { r: 100, g: 100, b: 100 })).toBeCloseTo(1, 5);
  });

  it('is symmetric regardless of argument order', () => {
    const a = { r: 199, g: 69, b: 4 };
    const b = { r: 247, g: 245, b: 240 };
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 5);
  });
});

describe('toColour', () => {
  it('builds a full Colour record from valid hex input', () => {
    const colour = toColour('#c74504');
    expect(colour).not.toBeNull();
    expect(colour?.hex).toBe('#C74504');
    expect(colour?.rgb).toEqual({ r: 199, g: 69, b: 4 });
    expect(colour?.hsl).toEqual({ h: 20, s: 96, l: 40 });
  });

  it('returns null for invalid hex input', () => {
    expect(toColour('not-a-colour')).toBeNull();
  });
});

describe('formatRgb / formatHsl', () => {
  it('formats as CSS-style strings', () => {
    expect(formatRgb({ r: 199, g: 69, b: 4 })).toBe('rgb(199, 69, 4)');
    expect(formatHsl({ h: 20, s: 96, l: 40 })).toBe('hsl(20, 96%, 40%)');
  });
});
