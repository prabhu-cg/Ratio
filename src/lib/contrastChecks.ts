import { contrastRatioHex } from '@/lib/color';
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
 * Contrast relationships driven by the user's actual editable project colours — the
 * 60/30/10 ratio surfaces plus the project's own Text / Foreground colour. This
 * deliberately reports what the user picked, not an auto-optimised readable colour.
 */
export function buildContrastChecks(ratio: RatioPalette, textHex: string): ContrastCheckResult[] {
  const dominantHex = ratio.dominant.colour.hex;
  const secondaryHex = ratio.secondary.colour.hex;
  const accentHex = ratio.accent.colour.hex;

  return [
    buildCheck(
      'text-on-dominant',
      'Text on Dominant',
      "Your project's Text / Foreground colour directly on the dominant background.",
      textHex,
      dominantHex,
    ),
    buildCheck(
      'text-on-secondary',
      'Text on Secondary',
      'Text inside secondary surfaces — cards, headers, sidebars.',
      textHex,
      secondaryHex,
    ),
    buildCheck(
      'text-on-accent',
      'Text on Accent',
      'Text inside accent-coloured buttons and highlights.',
      textHex,
      accentHex,
    ),
    buildCheck(
      'white-on-accent',
      'White on Accent',
      'A fixed reference, not your Text / Foreground colour: white is a common convention for button labels, regardless of how light or dark your accent is.',
      WHITE,
      accentHex,
    ),
    buildCheck(
      'dark-on-accent',
      'Dark text on Accent',
      'Also a fixed reference: the other common convention is near-black button-label text, regardless of your Text / Foreground colour.',
      DARK_INK,
      accentHex,
    ),
  ];
}
