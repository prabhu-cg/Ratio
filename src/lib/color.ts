import type { RGB, HSL, Colour } from '@/types/color';

const HEX_3 = /^#?([0-9a-f]{3})$/i;
const HEX_6 = /^#?([0-9a-f]{6})$/i;

/**
 * Normalises any accepted hex input (#FFF, FFF, #FFFFFF, ffffff, ...) to
 * an uppercase "#RRGGBB" string, or null if the input isn't a valid hex colour.
 */
export function normalizeHex(input: string): string | null {
  const value = input.trim();

  const shortMatch = value.match(HEX_3);
  if (shortMatch) {
    const [r, g, b] = shortMatch[1].split('');
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  const longMatch = value.match(HEX_6);
  if (longMatch) {
    return `#${longMatch[1]}`.toUpperCase();
  }

  return null;
}

export function isValidHex(input: string): boolean {
  return normalizeHex(input) !== null;
}

function clamp255(value: number): number {
  return Math.min(255, Math.max(0, Math.round(value)));
}

/** Expects an already-normalised "#RRGGBB" hex string. */
export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex);
  if (!normalized) {
    throw new Error(`Invalid hex colour: "${hex}"`);
  }

  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHexChannel = (value: number) => clamp255(value).toString(16).padStart(2, '0');
  return `#${toHexChannel(rgb.r)}${toHexChannel(rgb.g)}${toHexChannel(rgb.b)}`.toUpperCase();
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = ((hsl.h % 360) + 360) % 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r1: number;
  let g1: number;
  let b1: number;
  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  return {
    r: clamp255((r1 + m) * 255),
    g: clamp255((g1 + m) * 255),
    b: clamp255((b1 + m) * 255),
  };
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(rgb: RGB): number {
  const channel = (value: number) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** WCAG contrast ratio between two colours, from 1 (no contrast) to 21 (max contrast). */
export function contrastRatio(a: RGB, b: RGB): number {
  const lumA = relativeLuminance(a);
  const lumB = relativeLuminance(b);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Convenience wrapper for contrastRatio when both colours are known-valid hex strings. */
export function contrastRatioHex(a: string, b: string): number {
  return contrastRatio(hexToRgb(a), hexToRgb(b));
}

/** Builds a full Colour record from any accepted hex input, or null if invalid. */
export function toColour(input: string): Colour | null {
  const hex = normalizeHex(input);
  if (!hex) return null;

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);

  return { hex, rgb, hsl };
}

const READABLE_DARK: RGB = { r: 0x1e, g: 0x1c, b: 0x1a };
const READABLE_LIGHT: RGB = { r: 0xf7, g: 0xf5, b: 0xf0 };

/** Picks whichever of two neutral ink/paper tones has stronger contrast against a background. */
export function pickReadableTextColor(background: RGB): string {
  const contrastWithDark = contrastRatio(background, READABLE_DARK);
  const contrastWithLight = contrastRatio(background, READABLE_LIGHT);
  return contrastWithLight > contrastWithDark ? rgbToHex(READABLE_LIGHT) : rgbToHex(READABLE_DARK);
}

export function formatRgb(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function formatHsl(hsl: HSL): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}
