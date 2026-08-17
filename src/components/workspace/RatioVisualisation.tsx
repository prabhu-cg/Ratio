import { RatioStackVisual } from '@/components/marketing/RatioStackVisual';
import type { RatioPalette } from '@/types/palette';

interface RatioVisualisationProps {
  palette: RatioPalette;
}

export function RatioVisualisation({ palette }: RatioVisualisationProps) {
  return (
    <section
      aria-label="Ratio visualisation"
      className="workspace-viz flex flex-col gap-4 bg-surface-page p-5 sm:p-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          2 · See the ratio
        </h2>
        <span className="font-mono text-xs text-text-muted">
          {palette.dominant.percentage} / {palette.secondary.percentage} / {palette.accent.percentage}
        </span>
      </div>

      <div className="flex flex-1 items-stretch">
        <RatioStackVisual
          palette={palette}
          orientation="horizontal"
          heightClassName="h-full w-full"
          className="flex-1"
        />
      </div>
    </section>
  );
}
