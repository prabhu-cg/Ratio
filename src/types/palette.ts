import { toColour } from '@/lib/color';
import type { Colour } from '@/types/color';

export type PaletteRoleId = 'dominant' | 'secondary' | 'accent';
export type SupportingRoleId = 'text';
export type AnyRoleId = PaletteRoleId | SupportingRoleId;

export interface RatioRole {
  id: PaletteRoleId;
  label: string;
  percentage: number;
  colour: Colour;
  description: string;
}

/** A functional supporting colour — same interaction model as a RatioRole, but not part of the 60/30/10 ratio (no percentage). */
export interface SupportingRole {
  id: SupportingRoleId;
  label: string;
  colour: Colour;
  description: string;
}

export interface RatioPalette {
  dominant: RatioRole;
  secondary: RatioRole;
  accent: RatioRole;
}

export interface SupportingPalette {
  text: SupportingRole;
}

/** The user's editable project palette: the 60/30/10 ratio plus supporting colours that sit outside it. */
export interface ProjectPalette {
  ratio: RatioPalette;
  supporting: SupportingPalette;
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

const SUPPORTING_ROLE_COPY: Record<SupportingRoleId, { label: string; description: string }> = {
  text: {
    label: 'Text / Foreground',
    description:
      'A functional supporting colour for text and foreground elements. Not part of the 60–30–10 ratio.',
  },
};

export const DEFAULT_HEX: Record<PaletteRoleId, string> = {
  dominant: '#F7F5F0',
  secondary: '#D9D4CC',
  accent: '#C74504',
};

export const DEFAULT_SUPPORTING_HEX: Record<SupportingRoleId, string> = {
  text: '#444444',
};

export const ROLE_ORDER: PaletteRoleId[] = ['dominant', 'secondary', 'accent'];
export const SUPPORTING_ROLE_ORDER: SupportingRoleId[] = ['text'];

function buildRole(id: PaletteRoleId, hex: string): RatioRole {
  const colour = toColour(hex);
  if (!colour) {
    throw new Error(`Invalid default hex for role "${id}": "${hex}"`);
  }
  return { id, colour, ...ROLE_COPY[id] };
}

function buildSupportingRole(id: SupportingRoleId, hex: string): SupportingRole {
  const colour = toColour(hex);
  if (!colour) {
    throw new Error(`Invalid default hex for supporting role "${id}": "${hex}"`);
  }
  return { id, colour, ...SUPPORTING_ROLE_COPY[id] };
}

export function createDefaultPalette(): RatioPalette {
  return {
    dominant: buildRole('dominant', DEFAULT_HEX.dominant),
    secondary: buildRole('secondary', DEFAULT_HEX.secondary),
    accent: buildRole('accent', DEFAULT_HEX.accent),
  };
}

export function createDefaultSupportingPalette(): SupportingPalette {
  return {
    text: buildSupportingRole('text', DEFAULT_SUPPORTING_HEX.text),
  };
}

export function createDefaultProjectPalette(): ProjectPalette {
  return {
    ratio: createDefaultPalette(),
    supporting: createDefaultSupportingPalette(),
  };
}

export const DEFAULT_PALETTE: RatioPalette = createDefaultPalette();

export function paletteRoles(palette: RatioPalette): RatioRole[] {
  return ROLE_ORDER.map((id) => palette[id]);
}

export function supportingRoles(palette: SupportingPalette): SupportingRole[] {
  return SUPPORTING_ROLE_ORDER.map((id) => palette[id]);
}
