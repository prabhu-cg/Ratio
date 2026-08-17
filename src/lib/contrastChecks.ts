import { contrastRatioHex, pickReadableTextColor } from '@/lib/color';
import { meetsWcag, contrastStatus } from '@/lib/wcag';
import type { ContrastStatus } from '@/lib/wcag';
import type { RatioPalette } from '@/types/palette';
import type { ContrastCheckResult } from '@/types/accessibility';

const WHITE = '#FFFFFF';
const DARK_INK = '#1E1C1A';

function buildGuidance(status: ContrastStatus, ratio: number, aaaNormal: boolean): string {
  if (status === 'good') {
    return aaaNormal
      ? `${ratio.toFixed(1)}:1 comfortably passes AA for normal text, and also meets the stricter AAA level.`
      : `${ratio.toFixed(1)}:1 passes AA for normal text.`;
  }

  if (status === 'review') {
    return 'This works well for large text and UI elements, but falls short of AA for normal-size text. Consider reserving it for headings, or increasing contrast for body copy.';
  }

  return 'This combination is too low in contrast to use as text at any size.';
}

function buildCheck(
  id: string,
  label: string,
  purpose: string,
  fgHex: string,
  bgHex: string,
): ContrastCheckResult {
  const ratio = contrastRatioHex(fgHex, bgHex);
  const aaNormal = meetsWcag(ratio, 'AA', 'normal');
  const aaaNormal = meetsWcag(ratio, 'AAA', 'normal');
  const status = contrastStatus(ratio);

  return {
    id,
    label,
    purpose,
    fgHex,
    bgHex,
    ratio,
    aaNormal,
    aaaNormal,
    status,
    guidance: buildGuidance(status, ratio, aaaNormal),
  };
}

/**
 * A fixed set of contrast relationships that map directly onto how the palette is
 * actually used elsewhere in RATIO (the workspace preview and the app's own text
 * colour choices) — not an arbitrary sweep of every colour against every other colour.
 */
export function buildContrastChecks(palette: RatioPalette): ContrastCheckResult[] {
  const dominantHex = palette.dominant.colour.hex;
  const secondaryHex = palette.secondary.colour.hex;
  const accentHex = palette.accent.colour.hex;

  const onDominant = pickReadableTextColor(palette.dominant.colour.rgb);
  const onSecondary = pickReadableTextColor(palette.secondary.colour.rgb);
  const onAccent = pickReadableTextColor(palette.accent.colour.rgb);

  return [
    buildCheck(
      'primary-on-dominant',
      'Primary text on Dominant',
      "The text colour RATIO's preview uses directly on the dominant background.",
      onDominant,
      dominantHex,
    ),
    buildCheck(
      'primary-on-secondary',
      'Primary text on Secondary',
      'Text inside secondary surfaces — cards, headers, sidebars.',
      onSecondary,
      secondaryHex,
    ),
    buildCheck(
      'primary-on-accent',
      'Primary text on Accent',
      'Text inside accent-coloured buttons and highlights.',
      onAccent,
      accentHex,
    ),
    buildCheck(
      'white-on-accent',
      'White on Accent',
      'A common convention: white text on your accent colour, regardless of how light or dark it is.',
      WHITE,
      accentHex,
    ),
    buildCheck(
      'dark-on-accent',
      'Dark text on Accent',
      'The other common convention: near-black text on your accent colour.',
      DARK_INK,
      accentHex,
    ),
    buildCheck(
      'secondary-on-dominant',
      'Secondary as text on Dominant',
      'Your secondary colour used directly as text or icons on the dominant background.',
      secondaryHex,
      dominantHex,
    ),
  ];
}
