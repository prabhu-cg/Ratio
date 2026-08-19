import { hexToRgb, pickReadableTextColor } from '@/lib/color';
import { getRoleColourHex } from '@/lib/colourRoles';
import type { ProjectPalette } from '@/types/palette';
import type { UsageVisualExampleKind } from '@/types/colourRole';

interface UsageVisualExampleProps {
  kind: UsageVisualExampleKind;
  palette: ProjectPalette;
}

/**
 * A small, live mockup for one of the "important" usage items — always
 * built from the current project palette, never a static placeholder.
 * Each example carries a role="img" + aria-label since the mockup itself
 * is decorative; the label is what actually communicates its meaning.
 */
export function UsageVisualExample({ kind, palette }: UsageVisualExampleProps) {
  const dominant = getRoleColourHex(palette, 'dominant');
  const secondary = getRoleColourHex(palette, 'secondary');
  const accent = getRoleColourHex(palette, 'accent');
  const text = getRoleColourHex(palette, 'text');

  switch (kind) {
    case 'page-canvas':
      return (
        <div
          role="img"
          aria-label={`Miniature page canvas using your Dominant colour, ${dominant}, as the background.`}
          className="h-20 w-full rounded-[var(--radius-sm)] border border-border-strong"
          style={{ backgroundColor: dominant }}
        />
      );

    case 'card':
      return (
        <div
          role="img"
          aria-label={`A card using your Secondary colour, ${secondary}, on your Dominant background, ${dominant}.`}
          className="flex h-20 w-full items-center justify-center rounded-[var(--radius-sm)] border border-border-strong p-3"
          style={{ backgroundColor: dominant }}
        >
          <div
            className="h-full w-2/3 rounded-[var(--radius-sm)] shadow-sm"
            style={{ backgroundColor: secondary }}
          />
        </div>
      );

    case 'button': {
      const labelColour = pickReadableTextColor(hexToRgb(accent));
      return (
        <div
          role="img"
          aria-label={`A primary button using your Accent colour, ${accent}, with readable label text.`}
          className="flex h-20 w-full items-center justify-center rounded-[var(--radius-sm)] border border-border-strong bg-surface-alt"
        >
          <span
            className="rounded-[var(--radius-sm)] px-4 py-2 text-xs font-semibold"
            style={{ backgroundColor: accent, color: labelColour }}
          >
            Button
          </span>
        </div>
      );
    }

    case 'heading-hierarchy':
      return (
        <div
          role="img"
          aria-label={`Heading and body text using your Text / Foreground colour, ${text}.`}
          className="flex h-20 w-full flex-col justify-center gap-1.5 rounded-[var(--radius-sm)] border border-border-strong px-3"
          style={{ backgroundColor: dominant }}
        >
          <span className="text-sm font-bold" style={{ color: text }}>
            Heading
          </span>
          <span className="text-xs" style={{ color: text }}>
            Body text sits underneath at a lighter visual weight.
          </span>
        </div>
      );

    case 'icon':
      return (
        <div
          role="img"
          aria-label={`An icon using your Text / Foreground colour, ${text}.`}
          className="flex h-20 w-full items-center justify-center rounded-[var(--radius-sm)] border border-border-strong"
          style={{ backgroundColor: dominant }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke={text} strokeWidth="1.75" />
            <path d="M8 12.5L10.5 15L16 9" stroke={text} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );

    default:
      return null;
  }
}
