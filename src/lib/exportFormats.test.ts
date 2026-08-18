import { describe, expect, it } from 'vitest';
import { buildCssVariables, buildJsonExport, buildPaletteSvg } from '@/lib/exportFormats';
import { createDefaultPalette, createDefaultProjectPalette } from '@/types/palette';

describe('buildCssVariables', () => {
  it('emits plain CSS custom properties, including the project text colour, not semantic tokens or ramps', () => {
    const css = buildCssVariables(createDefaultProjectPalette());

    expect(css).toBe(
      ':root {\n' +
        '  --ratio-dominant: #F7F5F0;\n' +
        '  --ratio-secondary: #D9D4CC;\n' +
        '  --ratio-accent: #C74504;\n' +
        '  --ratio-text: #444444;\n' +
        '}\n',
    );
  });
});

describe('buildJsonExport', () => {
  it('produces the documented shape with both ratio and supporting colours', () => {
    const json = JSON.parse(buildJsonExport(createDefaultProjectPalette()));

    expect(json).toEqual({
      brand: 'RATIO',
      ratio: {
        dominant: '#F7F5F0',
        secondary: '#D9D4CC',
        accent: '#C74504',
      },
      supporting: {
        text: '#444444',
      },
    });
  });
});

describe('buildPaletteSvg', () => {
  it('produces three rects proportional to the role percentages, from the ratio palette only', () => {
    const svg = buildPaletteSvg(createDefaultPalette());

    expect(svg).toContain('width="600" height="200"');
    expect(svg).toContain('width="360" height="200" fill="#F7F5F0"');
    expect(svg).toContain('width="180" height="200" fill="#D9D4CC"');
    expect(svg).toContain('width="60" height="200" fill="#C74504"');
  });
});
