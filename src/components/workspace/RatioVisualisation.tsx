import { RatioStackVisual } from '@/components/marketing/RatioStackVisual';
import { AccessibilityPanel } from '@/components/workspace/AccessibilityPanel';
import { Divider } from '@/components/ui/Divider';
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
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          2 · See the ratio
        </h2>
        <span className="font-mono text-xs text-text-muted">
          {ratio.dominant.percentage} / {ratio.secondary.percentage} / {ratio.accent.percentage}
        </span>
      </div>

      <RatioStackVisual
        palette={ratio}
        orientation="horizontal"
        heightClassName="h-[280px] sm:h-[340px]"
        className="flex-none"
      />

      <Divider className="my-2" />

      <AccessibilityPanel palette={palette} />
    </section>
  );
}
