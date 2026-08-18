import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { PreviewToolbar } from '@/components/preview/PreviewToolbar';
import { VisionFilters } from '@/components/preview/VisionFilters';
import { pickReadableTextColor } from '@/lib/color';
import { PREVIEW_VIEWPORTS } from '@/types/preview';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';
import type { ProjectPalette } from '@/types/palette';
import { VISION_FILTER_STYLES, VISION_SIMULATIONS } from '@/types/accessibility';
import type { VisionSimulationId } from '@/types/accessibility';

interface PreviewFrameProps {
  palette: ProjectPalette;
  templateId: PreviewTemplateId;
  viewport: PreviewViewportId;
  visionMode: VisionSimulationId;
  children: ReactNode;
}

/** Padding (px, each side) reserved around the scaled canvas — kept in sync with the `p-3` class below. */
const CANVAS_PADDING = 12;

/**
 * Renders children at their real, native device width and scales the whole box down
 * with a CSS transform to fit the available width. This keeps the DOM genuinely at (say)
 * 1440px wide — so container-query responsive rules fire correctly — while still fitting
 * inside a narrow sidebar. Screenshots or scaled images would fake this; a transform on
 * real HTML does not.
 *
 * Scale is driven by width alone, not content height. Landing/Dashboard/Content pages
 * have very different natural heights, and fitting height too (so nothing ever needed
 * scrolling) meant the same viewport rendered at a different width — and so a visibly
 * different size — depending which page happened to be selected. Pinning to width keeps
 * "Tablet" the same size regardless of page; a page taller than the frame scrolls inside
 * it instead, the same way an actual browser window would handle an overlong page.
 */
export function PreviewFrame({
  palette,
  templateId,
  viewport,
  visionMode,
  children,
}: PreviewFrameProps) {
  const deviceWidth = PREVIEW_VIEWPORTS.find((option) => option.id === viewport)?.width ?? 1440;

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // useLayoutEffect (not useEffect) so the scale is measured and applied before the
  // browser paints — otherwise, switching viewport/template can briefly paint the new
  // (already-resized) content at the *previous* scale for one frame.
  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const measure = () => {
      const availableWidth = outer.clientWidth - CANVAS_PADDING * 2;
      setScale(availableWidth > 0 ? Math.min(1, availableWidth / deviceWidth) : 1);
    };

    measure();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [deviceWidth]);

  const previewVars = {
    '--preview-dominant': palette.ratio.dominant.colour.hex,
    '--preview-secondary': palette.ratio.secondary.colour.hex,
    '--preview-accent': palette.ratio.accent.colour.hex,
    '--preview-text': palette.supporting.text.colour.hex,
    '--preview-on-accent': pickReadableTextColor(palette.ratio.accent.colour.rgb),
  } as CSSProperties;

  const visionLabel = VISION_SIMULATIONS.find((option) => option.id === visionMode)?.label;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-card shadow-[var(--shadow-card)]">
      <VisionFilters />
      <PreviewToolbar templateId={templateId} viewport={viewport} />

      <div
        ref={outerRef}
        className="flex min-h-0 flex-1 items-start justify-center overflow-x-hidden overflow-y-auto overscroll-y-contain bg-surface-alt p-3"
      >
        <div
          ref={innerRef}
          className="preview-canvas @container flex-none origin-top"
          style={{
            width: deviceWidth,
            transform: `scale(${scale})`,
            filter: VISION_FILTER_STYLES[visionMode],
            ...previewVars,
          }}
        >
          {children}
        </div>
      </div>

      <p role="status" className="sr-only">
        {visionMode === 'normal'
          ? 'Preview colour simulation is off.'
          : `Preview is now simulating ${visionLabel} vision.`}
      </p>
    </div>
  );
}
