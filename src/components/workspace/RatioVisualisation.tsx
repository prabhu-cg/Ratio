import { RatioStackVisual } from '@/components/marketing/RatioStackVisual';
import { RatioInfoPopover } from '@/components/workspace/RatioInfoPopover';
import type { ProjectPalette } from '@/types/palette';

interface RatioVisualisationProps {
  palette: ProjectPalette;
}

export function RatioVisualisation({ palette }: RatioVisualisationProps) {
  const { ratio } = palette;

  return (
    <section
      aria-label="Ratio visualisation"
      className="workspace-viz flex flex-col gap-4 overflow-y-auto bg-surface-page p-5 sm:p-8"
    >
      <div className="relative flex flex-col gap-1 pr-8">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          2 · Balance
        </h2>
        <p className="text-sm text-text-muted">
          See how Dominant, Secondary and Accent colours are distributed.
        </p>
        <div className="absolute right-0 top-0">
          <RatioInfoPopover />
        </div>
      </div>

      <RatioStackVisual
        palette={ratio}
        orientation="horizontal"
        heightClassName="h-[216px]"
        className="flex-none"
      />
    </section>
  );
}
