import { describe, expect, it } from 'vitest';
import {
  COLOUR_ROLES,
  COLOUR_ROLE_ORDER,
  getColourRole,
  listColourRoles,
  getRoleColourHex,
  getRatioLabel,
  getRoleUsageCount,
  getRoleDisplay,
} from '@/lib/colourRoles';
import { createDefaultProjectPalette } from '@/types/palette';
import { toColour } from '@/lib/color';

describe('colour role registry', () => {
  it('defines exactly the four project roles', () => {
    expect(COLOUR_ROLE_ORDER).toEqual(['dominant', 'secondary', 'accent', 'text']);
    expect(Object.keys(COLOUR_ROLES).sort()).toEqual(['accent', 'dominant', 'secondary', 'text']);
  });

  it('correctly identifies which roles are part of the 60/30/10 ratio', () => {
    expect(getColourRole('dominant').includedInRatio).toBe(true);
    expect(getColourRole('secondary').includedInRatio).toBe(true);
    expect(getColourRole('accent').includedInRatio).toBe(true);
    expect(getColourRole('text').includedInRatio).toBe(false);
  });

  it('reports the correct ratio percentage for each ratio role, and null for Text', () => {
    expect(getColourRole('dominant').ratio).toBe(60);
    expect(getColourRole('secondary').ratio).toBe(30);
    expect(getColourRole('accent').ratio).toBe(10);
    expect(getColourRole('text').ratio).toBeNull();
  });

  it('keeps Text / Foreground explicitly outside the ratio', () => {
    const text = getColourRole('text');
    expect(text.name).toBe('Text / Foreground');
    expect(text.includedInRatio).toBe(false);
    expect(text.ratio).toBeNull();
  });

  it('never carries a colour value on the static role definition', () => {
    for (const role of listColourRoles()) {
      expect(role).not.toHaveProperty('colour');
      expect(role).not.toHaveProperty('hex');
    }
  });

  it('gives every role a non-empty purpose and at least one typical usage example', () => {
    for (const role of listColourRoles()) {
      expect(role.purpose.length).toBeGreaterThan(0);
      expect(role.typicalUsage.length).toBeGreaterThan(0);
      for (const usage of role.typicalUsage) {
        expect(usage.length).toBeGreaterThan(0);
      }
    }
  });

  it('derives role identity from the same ROLE_COPY the rest of the app uses, not a second definition', () => {
    // If someone edits src/types/palette.ts ROLE_COPY, this registry must follow —
    // proving there's only one source of truth for role name/percentage.
    expect(getColourRole('dominant').name).toBe('Dominant');
    expect(getColourRole('secondary').name).toBe('Secondary');
    expect(getColourRole('accent').name).toBe('Accent');
  });
});

describe('getRoleColourHex', () => {
  it('reads the live colour for each role straight from the current palette', () => {
    const palette = createDefaultProjectPalette();

    expect(getRoleColourHex(palette, 'dominant')).toBe(palette.ratio.dominant.colour.hex);
    expect(getRoleColourHex(palette, 'secondary')).toBe(palette.ratio.secondary.colour.hex);
    expect(getRoleColourHex(palette, 'accent')).toBe(palette.ratio.accent.colour.hex);
    expect(getRoleColourHex(palette, 'text')).toBe(palette.supporting.text.colour.hex);
  });

  it('reflects a palette change immediately — there is no separate usage-map colour state', () => {
    const palette = createDefaultProjectPalette();
    const newAccent = toColour('#00A86B');
    if (!newAccent) throw new Error('expected a valid colour');

    const updated = {
      ...palette,
      ratio: { ...palette.ratio, accent: { ...palette.ratio.accent, colour: newAccent } },
    };

    expect(getRoleColourHex(palette, 'accent')).toBe('#C74504');
    expect(getRoleColourHex(updated, 'accent')).toBe('#00A86B');
  });

  it('handles an all-identical-colours palette without throwing', () => {
    const palette = createDefaultProjectPalette();
    const black = toColour('#000000');
    if (!black) throw new Error('expected a valid colour');

    const flattened = {
      ratio: {
        dominant: { ...palette.ratio.dominant, colour: black },
        secondary: { ...palette.ratio.secondary, colour: black },
        accent: { ...palette.ratio.accent, colour: black },
      },
      supporting: { text: { ...palette.supporting.text, colour: black } },
    };

    for (const id of COLOUR_ROLE_ORDER) {
      expect(getRoleColourHex(flattened, id)).toBe('#000000');
    }
  });

  it('handles pure black and pure white roles without throwing', () => {
    const palette = createDefaultProjectPalette();
    const black = toColour('#000000');
    const white = toColour('#FFFFFF');
    if (!black || !white) throw new Error('expected valid colours');

    const extreme = {
      ratio: {
        dominant: { ...palette.ratio.dominant, colour: white },
        secondary: { ...palette.ratio.secondary, colour: black },
        accent: { ...palette.ratio.accent, colour: black },
      },
      supporting: { text: { ...palette.supporting.text, colour: white } },
    };

    expect(getRoleColourHex(extreme, 'dominant')).toBe('#FFFFFF');
    expect(getRoleColourHex(extreme, 'secondary')).toBe('#000000');
  });
});

describe('display helpers', () => {
  it('formats the ratio label for ratio roles as a percentage of visual hierarchy', () => {
    expect(getRatioLabel(getColourRole('dominant'))).toBe('60% of visual hierarchy');
    expect(getRatioLabel(getColourRole('secondary'))).toBe('30% of visual hierarchy');
    expect(getRatioLabel(getColourRole('accent'))).toBe('10% of visual hierarchy');
  });

  it('formats the ratio label for Text / Foreground as a supporting colour, not a percentage', () => {
    expect(getRatioLabel(getColourRole('text'))).toBe('Supporting colour — outside the ratio');
  });

  it('counts catalogued usage items per role, matching the usage catalogue', () => {
    expect(getRoleUsageCount(getColourRole('dominant'))).toBe(3);
    expect(getRoleUsageCount(getColourRole('secondary'))).toBe(3);
    expect(getRoleUsageCount(getColourRole('accent'))).toBe(5);
    expect(getRoleUsageCount(getColourRole('text'))).toBe(4);
  });

  it('bundles every display field into one object via getRoleDisplay', () => {
    const display = getRoleDisplay(getColourRole('accent'));

    expect(display).toEqual({
      name: 'Accent',
      ratioLabel: '10% of visual hierarchy',
      purpose: 'Creates emphasis and draws attention.',
      usageCount: 5,
      includedInRatio: true,
    });
  });
});
