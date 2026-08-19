import { ROLE_COPY, SUPPORTING_ROLE_COPY, ROLE_ORDER, SUPPORTING_ROLE_ORDER } from '@/types/palette';
import type { AnyRoleId, PaletteRoleId, SupportingRoleId, ProjectPalette } from '@/types/palette';
import type { ColourRole } from '@/types/colourRole';
import { getUsageItemCount } from '@/lib/usageItems';

/**
 * The colour role registry — the single source of truth for what each of
 * RATIO's four roles (Dominant, Secondary, Accent, Text / Foreground)
 * means. Identity fields (name, ratio percentage) are built directly on
 * top of the existing ROLE_COPY / SUPPORTING_ROLE_COPY in
 * src/types/palette.ts rather than redefined here, so there is never a
 * second, conflicting definition of what "Dominant" is.
 *
 * This registry holds static, application-level metadata only — never a
 * colour value. To pair a role with the user's actual colour, use
 * `getRoleColourHex` with the current ProjectPalette.
 */

const RATIO_ROLE_EXTRAS: Record<PaletteRoleId, Pick<ColourRole, 'purpose' | 'typicalUsage'>> = {
  dominant: {
    purpose: 'Provides the main visual foundation.',
    typicalUsage: ['Page backgrounds', 'Large surfaces', 'Primary visual areas', 'Large layout regions'],
  },
  secondary: {
    purpose: 'Adds structure and separation.',
    typicalUsage: ['Cards', 'Panels', 'Supporting sections', 'Containers', 'Secondary surfaces'],
  },
  accent: {
    purpose: 'Creates emphasis and draws attention.',
    typicalUsage: ['Primary actions', 'Important links', 'Highlights', 'Selected states', 'Key indicators'],
  },
};

const SUPPORTING_ROLE_EXTRAS: Record<SupportingRoleId, Pick<ColourRole, 'purpose' | 'typicalUsage'>> = {
  text: {
    purpose: 'Supports readable content and foreground elements.',
    typicalUsage: ['Headings', 'Body copy', 'Labels', 'Icons', 'Interface foreground elements'],
  },
};

function buildRatioColourRole(id: PaletteRoleId): ColourRole {
  const copy = ROLE_COPY[id];
  const extra = RATIO_ROLE_EXTRAS[id];
  return {
    id,
    name: copy.label,
    shortDescription: copy.description,
    ratio: copy.percentage,
    includedInRatio: true,
    purpose: extra.purpose,
    typicalUsage: extra.typicalUsage,
  };
}

function buildSupportingColourRole(id: SupportingRoleId): ColourRole {
  const copy = SUPPORTING_ROLE_COPY[id];
  const extra = SUPPORTING_ROLE_EXTRAS[id];
  return {
    id,
    name: copy.label,
    shortDescription: copy.description,
    ratio: null,
    includedInRatio: false,
    purpose: extra.purpose,
    typicalUsage: extra.typicalUsage,
  };
}

/** Every colour role, keyed by id — the registry. */
export const COLOUR_ROLES: Record<AnyRoleId, ColourRole> = {
  ...(Object.fromEntries(ROLE_ORDER.map((id) => [id, buildRatioColourRole(id)])) as Record<
    PaletteRoleId,
    ColourRole
  >),
  ...(Object.fromEntries(SUPPORTING_ROLE_ORDER.map((id) => [id, buildSupportingColourRole(id)])) as Record<
    SupportingRoleId,
    ColourRole
  >),
};

/** Display order: the three ratio roles first, then supporting roles. */
export const COLOUR_ROLE_ORDER: AnyRoleId[] = [...ROLE_ORDER, ...SUPPORTING_ROLE_ORDER];

export function getColourRole(id: AnyRoleId): ColourRole {
  return COLOUR_ROLES[id];
}

export function listColourRoles(): ColourRole[] {
  return COLOUR_ROLE_ORDER.map((id) => COLOUR_ROLES[id]);
}

/**
 * The live hex value for a role, read directly from the current project
 * palette — roles never carry their own colour, so this is the only way
 * to pair one with an actual colour.
 */
export function getRoleColourHex(palette: ProjectPalette, roleId: AnyRoleId): string {
  if (roleId === 'text') {
    return palette.supporting.text.colour.hex;
  }
  return palette.ratio[roleId].colour.hex;
}

// ---- Display helpers (section 6) — centralised so components never
// reimplement ratio-label formatting or usage counting themselves. ----

/** e.g. "60% of visual hierarchy", or "Supporting colour — outside the ratio". */
export function getRatioLabel(role: ColourRole): string {
  return role.includedInRatio && role.ratio !== null
    ? `${role.ratio}% of visual hierarchy`
    : 'Supporting colour — outside the ratio';
}

/** How many catalogued usage ideas (src/lib/usageItems.ts) apply to this role. */
export function getRoleUsageCount(role: ColourRole): number {
  return getUsageItemCount(role.id);
}

export interface ColourRoleDisplay {
  name: string;
  ratioLabel: string;
  purpose: string;
  usageCount: number;
  includedInRatio: boolean;
}

/** Everything a role card typically needs to render, in one call. */
export function getRoleDisplay(role: ColourRole): ColourRoleDisplay {
  return {
    name: role.name,
    ratioLabel: getRatioLabel(role),
    purpose: role.purpose,
    usageCount: getRoleUsageCount(role),
    includedInRatio: role.includedInRatio,
  };
}
