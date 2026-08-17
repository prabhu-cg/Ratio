import { describe, expect, it } from 'vitest';
import { contrastRatioHex } from '@/lib/color';
import { contrastStatus, meetsWcag, WCAG_THRESHOLDS } from '@/lib/wcag';

describe('WCAG_THRESHOLDS', () => {
  it('matches the published WCAG 2.x minimums', () => {
    expect(WCAG_THRESHOLDS.AA.normal).toBe(4.5);
    expect(WCAG_THRESHOLDS.AA.large).toBe(3.0);
    expect(WCAG_THRESHOLDS.AAA.normal).toBe(7.0);
    expect(WCAG_THRESHOLDS.AAA.large).toBe(4.5);
  });
});

describe('meetsWcag', () => {
  it('passes AA normal text only at 4.5:1 and above', () => {
    expect(meetsWcag(4.5, 'AA', 'normal')).toBe(true);
    expect(meetsWcag(4.49, 'AA', 'normal')).toBe(false);
  });

  it('passes AA large text at 3:1 and above', () => {
    expect(meetsWcag(3.0, 'AA', 'large')).toBe(true);
    expect(meetsWcag(2.99, 'AA', 'large')).toBe(false);
  });

  it('passes AAA normal text at 7:1 and above', () => {
    expect(meetsWcag(7.0, 'AAA', 'normal')).toBe(true);
    expect(meetsWcag(6.99, 'AAA', 'normal')).toBe(false);
  });

  it('passes AAA large text at 4.5:1 and above', () => {
    expect(meetsWcag(4.5, 'AAA', 'large')).toBe(true);
    expect(meetsWcag(4.49, 'AAA', 'large')).toBe(false);
  });

  it('black on white passes every level at every size (21:1)', () => {
    const ratio = contrastRatioHex('#000000', '#FFFFFF');
    expect(meetsWcag(ratio, 'AA', 'normal')).toBe(true);
    expect(meetsWcag(ratio, 'AAA', 'normal')).toBe(true);
  });

  it('identical colours fail every level (1:1)', () => {
    const ratio = contrastRatioHex('#C74504', '#C74504');
    expect(ratio).toBeCloseTo(1, 5);
    expect(meetsWcag(ratio, 'AA', 'large')).toBe(false);
  });
});

describe('contrastStatus', () => {
  it('is "good" at and above the AA normal-text threshold', () => {
    expect(contrastStatus(4.5)).toBe('good');
    expect(contrastStatus(21)).toBe('good');
  });

  it('is "review" between the AA large and AA normal thresholds', () => {
    expect(contrastStatus(3.0)).toBe('review');
    expect(contrastStatus(4.2)).toBe('review');
    expect(contrastStatus(4.49)).toBe('review');
  });

  it('is "fail" below the AA large-text threshold', () => {
    expect(contrastStatus(2.99)).toBe('fail');
    expect(contrastStatus(1)).toBe('fail');
  });

  it('two very light colours fail', () => {
    const ratio = contrastRatioHex('#FAFAFA', '#F5F5F0');
    expect(contrastStatus(ratio)).toBe('fail');
  });

  it('two very dark colours fail', () => {
    const ratio = contrastRatioHex('#0A0A0A', '#1A1A1A');
    expect(contrastStatus(ratio)).toBe('fail');
  });
});
