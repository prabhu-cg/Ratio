import { Badge } from '@/components/ui/Badge';
import { PreviewControls } from '@/components/preview/PreviewControls';
import { PreviewFrame } from '@/components/preview/PreviewFrame';
import { PreviewTemplate } from '@/components/preview/PreviewTemplate';
import type { PreviewTemplateId, PreviewViewportId } from '@/types/preview';
import type { RatioPalette } from '@/types/palette';
import type { VisionSimulationId } from '@/types/accessibility';

interface PreviewPanelProps {
  palette: RatioPalette;
  templateId: PreviewTemplateId;
  viewport: PreviewViewportId;
  visionMode: VisionSimulationId;
  onTemplateChange: (id: PreviewTemplateId) => void;
  onViewportChange: (id: PreviewViewportId) => void;
  onVisionModeChange: (id: VisionSimulationId) => void;
}

export function PreviewPanel({
  palette,
  templateId,
  viewport,
  visionMode,
  onTemplateChange,
  onViewportChange,
  onVisionModeChange,
}: PreviewPanelProps) {
  return (
    <aside
      aria-label="Live preview"
      className="workspace-preview flex flex-col gap-4 overflow-y-auto overflow-x-hidden bg-surface-card p-5"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          Preview
        </h2>
        <Badge tone="brand">Live</Badge>
      </div>

      <PreviewControls
        templateId={templateId}
        viewport={viewport}
        visionMode={visionMode}
        onTemplateChange={onTemplateChange}
        onViewportChange={onViewportChange}
        onVisionModeChange={onVisionModeChange}
      />

      <PreviewFrame palette={palette} templateId={templateId} viewport={viewport} visionMode={visionMode}>
        <PreviewTemplate templateId={templateId} />
      </PreviewFrame>
    </aside>
  );
}
