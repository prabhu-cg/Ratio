import type { AnyRoleId } from '@/types/palette';

/**
 * Static, application-level metadata for one of RATIO's four colour roles
 * (Dominant, Secondary, Accent, Text / Foreground). Deliberately holds no
 * colour value — roles always reference the live project palette rather
 * than duplicating it (see src/lib/colourRoles.ts).
 */
export interface ColourRole {
  id: AnyRoleId;
  name: string;
  shortDescription: string;
  /** Percentage share of the 60/30/10 ratio, or null when the role sits outside it. */
  ratio: number | null;
  includedInRatio: boolean;
  purpose: string;
  typicalUsage: string[];
}

/**
 * Broad groupings for individual colour applications. Kept small and
 * generic for now — extend as the interactive Colour Usage Map grows,
 * rather than inventing role-specific one-off categories.
 */
export type UsageCategory = 'surface' | 'content' | 'action' | 'navigation' | 'feedback' | 'decoration';

/**
 * A small, live-palette-driven mockup shown for a handful of "important"
 * usage items in the Colour Usage Map — not every item gets one.
 */
export type UsageVisualExampleKind = 'page-canvas' | 'card' | 'button' | 'heading-hierarchy' | 'icon';

/** One concrete place a role's colour could be applied in a real interface. */
export interface UsageItem {
  id: string;
  label: string;
  description: string;
  category: UsageCategory;
  applicableRole: AnyRoleId;
  /** Present only for the subset of items worth illustrating visually. */
  visualExample?: UsageVisualExampleKind;
}
