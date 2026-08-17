import { toColour } from '@/lib/color';
import type { Colour } from '@/types/color';

export type PaletteRoleId = 'dominant' | 'secondary' | 'accent';

export interface RatioRole {
  id: PaletteRoleId;
  label: string;
  percentage: number;
  colour: Colour;
  description: string;
}

export interface RatioPalette {
  dominant: RatioRole;
  secondary: RatioRole;
  accent: RatioRole;
}

const ROLE_COPY: Record<PaletteRoleId, { label: string; percentage: number; description: string }> = {
  dominant: {
    label: 'Dominant',
    percentage: 60,
    description: 'The visual foundation. Typically used for large backgrounds and major surfaces.',
  },
  secondary: {
    label: 'Secondary',
    percentage: 30,
    description: 'Supports the dominant colour and helps establish structure and grouping.',
  },
  accent: {
    label: 'Accent',
    percentage: 10,
    description: 'Creates emphasis and draws attention to important actions and content.',
  },
};

export const DEFAULT_HEX: Record<PaletteRoleId, string> = {
  dominant: '#F7F5F0',
  secondary: '#444444',
  accent: '#C74504',
};

export const ROLE_ORDER: PaletteRoleId[] = ['dominant', 'secondary', 'accent'];

function buildRole(id: PaletteRoleId, hex: string): RatioRole {
  const colour = toColour(hex);
  if (!colour) {
    throw new Error(`Invalid default hex for role "${id}": "${hex}"`);
  }
  return { id, colour, ...ROLE_COPY[id] };
}

export function createDefaultPalette(): RatioPalette {
  return {
    dominant: buildRole('dominant', DEFAULT_HEX.dominant),
    secondary: buildRole('secondary', DEFAULT_HEX.secondary),
    accent: buildRole('accent', DEFAULT_HEX.accent),
  };
}

export const DEFAULT_PALETTE: RatioPalette = createDefaultPalette();

export function paletteRoles(palette: RatioPalette): RatioRole[] {
  return ROLE_ORDER.map((id) => palette[id]);
}
