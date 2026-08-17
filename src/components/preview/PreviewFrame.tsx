import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { PreviewToolbar } from '@/components/preview/PreviewToolbar';
import { VisionFilters } from '@/components/preview/VisionFilters';
import { pickReadableTextColor } from '@/lib/color';
import { PREVIEW_VIEWPORTS } from '@/types/preview';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';
import type { RatioPalette } from '@/types/palette';
import { VISION_FILTER_STYLES, VISION_SIMULATIONS } from '@/types/accessibility';
import type { VisionSimulationId } from '@/types/accessibility';

interface PreviewFrameProps {
  palette: RatioPalette;
  templateId: PreviewTemplateId;
  viewport: PreviewViewportId;
  visionMode: VisionSimulationId;
  children: ReactNode;
}

/**
 * Renders children at their real, native device width and scales the whole box down
 * with a CSS transform to fit the available space. This keeps the DOM genuinely at
 * (say) 1200px wide — so container-query responsive rules fire correctly — while still
 * fitting inside a narrow sidebar. Screenshots/scaled images would fake this; a
 * transform on real HTML does not.
 */
export function PreviewFrame({
  palette,
  templateId,
  viewport,
  visionMode,
  children,
}: PreviewFrameProps) {
  const deviceWidth = PREVIEW_VIEWPORTS.find((option) => option.id === viewport)?.width ?? 1200;

  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(480);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const containerWidth = outer.clientWidth;
      setScale(containerWidth > 0 ? Math.min(1, containerWidth / deviceWidth) : 1);
      setContentHeight(inner.scrollHeight);
    };

    measure();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [deviceWidth, templateId]);

  const previewVars = {
    '--preview-dominant': palette.dominant.colour.hex,
    '--preview-secondary': palette.secondary.colour.hex,
    '--preview-accent': palette.accent.colour.hex,
    '--preview-on-dominant': pickReadableTextColor(palette.dominant.colour.rgb),
    '--preview-on-secondary': pickReadableTextColor(palette.secondary.colour.rgb),
    '--preview-on-accent': pickReadableTextColor(palette.accent.colour.rgb),
  } as CSSProperties;

  const visionLabel = VISION_SIMULATIONS.find((option) => option.id === visionMode)?.label;

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-card shadow-[var(--shadow-card)]">
      <VisionFilters />
      <PreviewToolbar templateId={templateId} viewport={viewport} />

      <div
        ref={outerRef}
        className="overflow-hidden bg-surface-alt"
        style={{ height: contentHeight * scale }}
      >
        <div
          ref={innerRef}
          className="@container origin-top-left"
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
