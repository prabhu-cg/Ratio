import { hexToRgb, pickReadableTextColor } from '@/lib/color';
import { getRoleColourHex } from '@/lib/colourRoles';
import type { ProjectPalette } from '@/types/palette';
import type { UsageContextId } from '@/types/usageContext';

interface ContextPreviewProps {
  contextId: UsageContextId;
  palette: ProjectPalette;
}

/**
 * One small, lightweight composite per context — not a separate design
 * tool, just enough to show how the palette's roles might come together
 * in that kind of interface. Always built from the live palette; the
 * context only changes which composition is drawn.
 */
export function ContextPreview({ contextId, palette }: ContextPreviewProps) {
  const dominant = getRoleColourHex(palette, 'dominant');
  const secondary = getRoleColourHex(palette, 'secondary');
  const accent = getRoleColourHex(palette, 'accent');
  const text = getRoleColourHex(palette, 'text');
  const accentLabelColour = pickReadableTextColor(hexToRgb(accent));

  switch (contextId) {
    case 'marketing':
      return (
        <div
          role="img"
          aria-label={`A marketing hero section with a call-to-action button — your Dominant colour (${dominant}) as the background, your Text colour (${text}) for the headline, and your Accent colour (${accent}) for the button.`}
          className="flex h-24 w-full flex-col items-start justify-center gap-2 rounded-[var(--radius-sm)] border border-border-strong px-4"
          style={{ backgroundColor: dominant }}
        >
          <span className="text-sm font-bold" style={{ color: text }}>
            Headline that grabs attention
          </span>
          <span
            className="rounded-[var(--radius-sm)] px-3 py-1.5 text-[11px] font-semibold"
            style={{ backgroundColor: accent, color: accentLabelColour }}
          >
            Get started
          </span>
        </div>
      );

    case 'saas':
      return (
        <div
          role="img"
          aria-label={`A dashboard layout with a navigation panel and a card — your Dominant colour (${dominant}) as the canvas, your Secondary colour (${secondary}) for the panel and card, and your Accent colour (${accent}) for a status indicator.`}
          className="flex h-24 w-full gap-2 rounded-[var(--radius-sm)] border border-border-strong p-2"
          style={{ backgroundColor: dominant }}
        >
          <div className="h-full w-1/4 flex-none rounded-[var(--radius-sm)]" style={{ backgroundColor: secondary }} />
          <div
            className="flex h-full flex-1 items-start justify-end rounded-[var(--radius-sm)] p-2"
            style={{ backgroundColor: secondary }}
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
          </div>
        </div>
      );

    case 'mobile':
      return (
        <div
          role="img"
          aria-label={`A mobile screen with a bottom card and a primary action — your Dominant colour (${dominant}) as the screen background, your Secondary colour (${secondary}) for the card, and your Accent colour (${accent}) for the action.`}
          className="mx-auto flex h-24 w-16 flex-none flex-col justify-between rounded-[calc(var(--radius-lg)+3px)] border-[3px] border-ink-900 p-1.5"
          style={{ backgroundColor: dominant }}
        >
          <div className="h-9 rounded-[var(--radius-sm)]" style={{ backgroundColor: secondary }} />
          <span aria-hidden="true" className="mx-auto h-3.5 w-3.5 rounded-full" style={{ backgroundColor: accent }} />
        </div>
      );

    case 'editorial':
      return (
        <div
          role="img"
          aria-label={`An article layout with a pull quote — your Dominant colour (${dominant}) as the reading surface, your Text colour (${text}) for the title, and your Accent colour (${accent}) for the pull-quote bar.`}
          className="flex h-24 w-full flex-col justify-center gap-2 rounded-[var(--radius-sm)] border border-border-strong px-4"
          style={{ backgroundColor: dominant }}
        >
          <span className="text-sm font-bold" style={{ color: text }}>
            Article title
          </span>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-6 w-1 flex-none rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-xs italic" style={{ color: text }}>
              A pull quote drawn from the text.
            </span>
          </div>
        </div>
      );

    case 'general':
    default:
      return (
        <div
          role="img"
          aria-label={`A general layout with a card and a primary action — your Dominant colour (${dominant}) as the canvas, your Secondary colour (${secondary}) for the card, and your Accent colour (${accent}) for the action.`}
          className="flex h-24 w-full items-center justify-center gap-3 rounded-[var(--radius-sm)] border border-border-strong p-3"
          style={{ backgroundColor: dominant }}
        >
          <div className="h-full w-2/3 rounded-[var(--radius-sm)] shadow-sm" style={{ backgroundColor: secondary }} />
          <span
            className="flex-none rounded-[var(--radius-sm)] px-3 py-1.5 text-[11px] font-semibold"
            style={{ backgroundColor: accent, color: accentLabelColour }}
          >
            Action
          </span>
        </div>
      );
  }
}
