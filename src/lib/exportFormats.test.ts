import { describe, expect, it } from 'vitest';
import { buildCssVariables, buildJsonExport, buildPaletteSvg } from '@/lib/exportFormats';
import { createDefaultPalette } from '@/types/palette';

describe('buildCssVariables', () => {
  it('emits plain CSS custom properties, not semantic tokens or ramps', () => {
    const css = buildCssVariables(createDefaultPalette());

    expect(css).toBe(
      ':root {\n' +
        '  --ratio-dominant: #F7F5F0;\n' +
        '  --ratio-secondary: #444444;\n' +
        '  --ratio-accent: #C74504;\n' +
        '}\n',
    );
  });
});

describe('buildJsonExport', () => {
  it('produces the documented minimal shape', () => {
    const json = JSON.parse(buildJsonExport(createDefaultPalette()));

    expect(json).toEqual({
      brand: 'RATIO',
      ratio: {
        dominant: '#F7F5F0',
        secondary: '#444444',
        accent: '#C74504',
      },
    });
  });
});

describe('buildPaletteSvg', () => {
  it('produces three rects proportional to the role percentages', () => {
    const svg = buildPaletteSvg(createDefaultPalette());

    expect(svg).toContain('width="600" height="200"');
    expect(svg).toContain('width="360" height="200" fill="#F7F5F0"');
    expect(svg).toContain('width="180" height="200" fill="#444444"');
    expect(svg).toContain('width="60" height="200" fill="#C74504"');
  });
});
